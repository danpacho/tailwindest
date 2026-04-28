import crypto from "node:crypto"
import fsSync from "node:fs"
import fs from "node:fs/promises"
import path from "node:path"
import * as ts from "typescript"
import { createStaticAnalyzer } from "../analyzer/detector"
import type { TailwindestCallKind, SourceSpan } from "../analyzer/symbols"
import { createEvaluationEngine } from "../core/evaluator"
import type { CompilerDiagnostic } from "../core/diagnostic_types"
import type { MergerPolicy } from "../core/merger"
import {
    createDebugManifest,
    stringifyDebugManifest,
    type TailwindestDebugFile,
    type TailwindestDebugManifest,
} from "../debug/debug_manifest"
import {
    diagnosticWithSource,
    diagnosticsForMode,
    type RichCompilerDiagnostic,
} from "../debug/diagnostics"
import {
    createCandidateManifest,
    getSortedExcludedCandidates,
    getSortedCandidates,
    normalizeCandidateFileId,
    removeFileCandidates,
    updateFileCandidates,
    type CandidateManifest,
} from "../tailwind/manifest"
import {
    injectSourceInlineBlock,
    isTailwindCssEntry,
} from "../tailwind/source_inline"
import { substituteTailwindest } from "../transform/substitutor"
import { SourceCache } from "./cache"
import { compileTailwindestSource } from "./compile_transform"

/**
 * Configuration for the Tailwindest Vite integration.
 *
 * These options control both halves of the plugin pair: JavaScript/TypeScript
 * compilation and Tailwind CSS `@source inline()` manifest injection.
 *
 * @public
 */
export interface TailwindestViteOptions {
    /**
     * Source id patterns that should be compiled. When omitted, all
     * JavaScript/TypeScript module ids are eligible.
     */
    include?: Array<string | RegExp>

    /**
     * Source id patterns that should never be compiled or used as CSS entries.
     */
    exclude?: Array<string | RegExp>

    /**
     * Unsupported-value policy.
     *
     * - `"strict"` throws during transform when a call cannot be compiled
     *   exactly.
     * - `"loose"` preserves the runtime call and records a fallback diagnostic.
     *
     * @defaultValue `"strict"`
     */
    mode?: "strict" | "loose"

    /**
     * Write `.tailwindest/debug-manifest.json` with replacement spans,
     * generated text, candidates, and rich diagnostics.
     *
     * @defaultValue `false`
     */
    debug?: boolean

    /**
     * Emit source maps for exact JavaScript replacements.
     *
     * @defaultValue `false`
     */
    sourceMap?: boolean

    /**
     * Maximum static variant lookup-table size before the compiler reports
     * `VARIANT_TABLE_LIMIT_EXCEEDED`.
     */
    variantTableLimit?: number

    /**
     * Custom debug manifest path. When omitted, the plugin writes to
     * `.tailwindest/debug-manifest.json` under the Vite project root.
     */
    debugFile?: string

    /**
     * CSS ids that should receive a Tailwindest `@source inline()` block even
     * when they do not contain a direct `@import "tailwindcss"` statement.
     */
    cssEntries?: Array<string | RegExp>

    /**
     * Directories to pre-scan before the first CSS transform. When omitted,
     * the plugin scans the Vite root `src` directory.
     */
    scanRoots?: string[]

    /**
     * Build-time class merge policy used while evaluating Tailwindest class
     * strings.
     */
    merger?: MergerPolicy

    /**
     * Collect standalone candidate-like string literals from transformed
     * modules. Disable this for fixtures that intentionally keep expected
     * strings next to assertions and rely only on compiler call analysis.
     *
     * @defaultValue `true`
     */
    collectStringLiteralCandidates?: boolean
}

export interface CompilerContextInput {
    root: string
    command?: "serve" | "build"
    options: TailwindestViteOptions
    readFile?: (id: string) => Promise<string>
    scanFiles?: () => Promise<string[]>
}

export interface TransformOutput {
    code: string
    map: ReturnType<typeof substituteTailwindest>["map"]
    candidates: string[]
    diagnostics: RichCompilerDiagnostic[]
    changed: boolean
}

const JS_RE = /\.[cm]?[jt]sx?$/
const CSS_RE = /\.css$/
const DEFAULT_MERGER: MergerPolicy = { kind: "none" }

export class CompilerContext {
    public readonly manifest: CandidateManifest = createCandidateManifest()
    public readonly cache = new SourceCache()
    public readonly command: "serve" | "build"
    private root: string
    private readonly options: TailwindestViteOptions
    private readonly readFile: ((id: string) => Promise<string>) | undefined
    private readonly scanFiles: (() => Promise<string[]>) | undefined
    private readonly dependencies = new Map<string, Set<string>>()
    private readonly reverseDependencies = new Map<string, Set<string>>()
    private readonly cssEntries = new Set<string>()
    private readonly debugFiles = new Map<string, TailwindestDebugFile>()
    private lastInvalidatedManifestRevision = 0

    public constructor(input: CompilerContextInput) {
        this.root = normalizeCandidateFileId(input.root)
        this.command = input.command ?? "serve"
        this.options = input.options
        this.readFile = input.readFile
        this.scanFiles = input.scanFiles
    }

    public updateRoot(root: string): void {
        this.root = normalizeCandidateFileId(root)
    }

    public async preScan(): Promise<void> {
        const files = this.scanFiles
            ? await this.scanFiles()
            : await scanDefaultSourceFiles(this.root, this.options.scanRoots)
        for (const file of files.sort()) {
            const normalized = normalizeCandidateFileId(file)
            const code = this.readFile
                ? await this.readFile(normalized)
                : await fs.readFile(normalized, "utf8")
            if (isJsId(normalized) && this.shouldTransformJs(normalized)) {
                this.transformJs(code, normalized)
            } else if (
                isCssId(normalized) &&
                isTailwindCssEntry(
                    normalized,
                    code,
                    this.options.cssEntries ?? []
                )
            ) {
                this.registerCssEntry(normalized)
                this.cache.set(normalized, code, hashCode(code))
            }
        }
    }

    public shouldTransformJs(id: string): boolean {
        const normalized = normalizeCandidateFileId(id)
        if (!isJsId(normalized)) {
            return false
        }
        if (matchesAny(normalized, this.options.exclude ?? [])) {
            return false
        }
        const include = this.options.include
        return (
            !include || include.length === 0 || matchesAny(normalized, include)
        )
    }

    public shouldTransformCss(id: string, code: string): boolean {
        const normalized = normalizeCandidateFileId(id)
        if (!isCssId(normalized)) {
            return false
        }
        if (matchesAny(normalized, this.options.exclude ?? [])) {
            return false
        }
        return isTailwindCssEntry(
            normalized,
            code,
            this.options.cssEntries ?? []
        )
    }

    public transformJs(code: string, id: string): TransformOutput {
        const normalized = normalizeCandidateFileId(id)
        const hash = hashCode(code)
        this.cache.set(normalized, code, hash)

        if (!this.shouldTransformJs(normalized)) {
            return unchangedTransform(code)
        }

        const analysis = this.analyzeJs(normalized, code)
        this.recordDependencies(normalized, analysis.dependencies)
        const fallbackSpan = fullFileSpan(normalized, code)
        const analysisDiagnostics = richDiagnosticsForDebug(
            analysis.diagnostics,
            normalized,
            fallbackSpan
        )
        const analysisModeDiagnostics = diagnosticsForMode(
            analysisDiagnostics,
            this.options.mode ?? "strict"
        )
        const strictAnalysisFailures =
            (this.options.mode ?? "strict") === "strict"
                ? analysisModeDiagnostics.diagnostics.filter(
                      (item) =>
                          item.code === "NOT_TAILWINDEST_SYMBOL" ||
                          item.message.includes("Computed property key")
                  )
                : []
        if (strictAnalysisFailures.length > 0) {
            const first = strictAnalysisFailures[0]
            throw new Error(
                `${first?.code ?? "TAILWINDEST_ANALYZE_FAILED"}: ${first?.message ?? "Tailwindest strict analysis failed."}`
            )
        }
        const compiled = compileTailwindestSource({
            fileName: normalized,
            code,
            mode: this.options.mode ?? "strict",
            variantTableLimit: this.options.variantTableLimit,
            merger: this.options.merger ?? DEFAULT_MERGER,
        })
        const modeDiagnostics = diagnosticsForMode(
            compiled.diagnostics,
            this.options.mode ?? "strict"
        )
        if (modeDiagnostics.shouldFail) {
            const first = modeDiagnostics.diagnostics[0]
            throw new Error(
                `${first?.code ?? "TAILWINDEST_COMPILE_FAILED"}: ${first?.message ?? "Tailwindest strict transform failed."}`
            )
        }
        const transform = substituteTailwindest({
            fileName: normalized,
            code,
            plans: compiled.plans,
            cleanImports: true,
            sourceMapMode: this.options.sourceMap ? "loose" : false,
        })
        const diagnostics: RichCompilerDiagnostic[] = [
            ...analysisModeDiagnostics.diagnostics,
            ...modeDiagnostics.diagnostics,
            ...richDiagnosticsForDebug(
                transform.diagnostics,
                normalized,
                fallbackSpan
            ),
        ]
        const candidates = [
            ...analysis.candidates,
            ...compiled.candidates,
            ...transform.candidates,
        ]
        updateFileCandidates(this.manifest, normalized, {
            hash,
            candidates,
            excludedCandidates: analysis.excludedCandidates,
            diagnostics,
        })
        this.updateDebugFile(normalized, hash, {
            replacements: compiled.debugReplacements,
            diagnostics,
        })

        return {
            code: transform.code,
            map: transform.map,
            candidates: transform.candidates,
            diagnostics,
            changed: transform.changed,
        }
    }

    public removeFile(id: string): boolean {
        const normalized = normalizeCandidateFileId(id)
        this.cache.delete(normalized)
        this.clearDependencies(normalized)
        this.debugFiles.delete(normalized)
        this.writeDebugManifest()
        return removeFileCandidates(this.manifest, normalized)
    }

    public transformCss(code: string, id: string): TransformOutput {
        const normalized = normalizeCandidateFileId(id)
        if (!this.shouldTransformCss(normalized, code)) {
            return unchangedTransform(code)
        }

        this.registerCssEntry(normalized)
        this.cache.set(normalized, code, hashCode(code))
        const sourceInlineInput = {
            id: normalized,
            code,
            manifest: this.manifest,
        }
        const result = injectSourceInlineBlock(
            this.options.cssEntries
                ? { ...sourceInlineInput, cssEntries: this.options.cssEntries }
                : sourceInlineInput
        )
        this.writeDebugManifest()
        return {
            code: result.code,
            map: null,
            candidates: [],
            diagnostics: [],
            changed: result.code !== code,
        }
    }

    public getManifestCandidates(): string[] {
        return getSortedCandidates(this.manifest)
    }

    public getDebugManifest(): TailwindestDebugManifest {
        return createDebugManifest({
            mode: this.options.mode ?? "strict",
            files: [...this.debugFiles.values()],
            candidates: this.getManifestCandidates(),
            excludedCandidates: this.getExcludedManifestCandidates(),
        })
    }

    public getExcludedManifestCandidates(): string[] {
        return getSortedExcludedCandidates(this.manifest)
    }

    public registerCssEntry(id: string): void {
        this.cssEntries.add(normalizeCandidateFileId(id))
    }

    public getCssEntries(): string[] {
        return [...this.cssEntries].sort()
    }

    public recordDependencies(consumer: string, dependencies: string[]): void {
        const normalized = normalizeCandidateFileId(consumer)
        this.clearDependencies(normalized)
        const next = new Set(
            dependencies.map((dependency) =>
                normalizeCandidateFileId(dependency)
            )
        )
        this.dependencies.set(normalized, next)

        for (const dependency of next) {
            if (!this.reverseDependencies.has(dependency)) {
                this.reverseDependencies.set(dependency, new Set())
            }
            this.reverseDependencies.get(dependency)?.add(normalized)
        }
    }

    public getReverseDependencies(id: string): string[] {
        return [
            ...(this.reverseDependencies.get(normalizeCandidateFileId(id)) ??
                []),
        ].sort()
    }

    public shouldInvalidateCssForManifest(): boolean {
        if (this.manifest.revision === this.lastInvalidatedManifestRevision) {
            return false
        }
        this.lastInvalidatedManifestRevision = this.manifest.revision
        return true
    }

    private analyzeJs(
        id: string,
        code: string
    ): {
        candidates: string[]
        excludedCandidates: string[]
        diagnostics: CompilerDiagnostic[]
        dependencies: string[]
    } {
        const files = Object.fromEntries(
            this.cache.entries().map((entry) => [entry.id, entry.code])
        )
        files[id] = code
        const analyzer = createStaticAnalyzer(files)
        const result = analyzer.analyzeFile(id)
        const engine = createEvaluationEngine()
        const candidates: string[] = []
        const excludedCandidates: string[] = []

        for (const call of result.calls) {
            const values = call.arguments.map((argument) => argument.value)
            if (call.kind === "join") {
                candidates.push(
                    ...engine.join(
                        values as never[],
                        this.options.merger ?? DEFAULT_MERGER,
                        this.options
                    ).candidates
                )
            } else if (call.kind === "def") {
                const result = engine.def(
                    [values[0]] as never[],
                    values.slice(1) as never[],
                    this.options.merger ?? DEFAULT_MERGER,
                    this.options
                )
                candidates.push(...result.candidates)
                excludedCandidates.push(
                    ...collectStyleExclusions(
                        values.slice(1),
                        result.candidates
                    )
                )
            } else if (call.kind === "mergeProps") {
                const result = engine.mergeProps(
                    values as never[],
                    this.options.merger ?? DEFAULT_MERGER,
                    this.options
                )
                candidates.push(...result.candidates)
                excludedCandidates.push(
                    ...collectStyleExclusions(values, result.candidates)
                )
            } else if (call.kind === "mergeRecord") {
                const result = engine.mergeRecord(values as never[])
                candidates.push(...result.candidates)
                excludedCandidates.push(
                    ...collectStyleExclusions(values, result.candidates)
                )
            } else {
                const toolCandidates = collectCandidatesFromToolCall(
                    call.kind,
                    values,
                    engine
                )
                candidates.push(...toolCandidates)
                excludedCandidates.push(
                    ...collectExclusionsFromToolCall(
                        call.kind,
                        values,
                        toolCandidates
                    )
                )
            }
        }

        if (this.options.collectStringLiteralCandidates !== false) {
            candidates.push(
                ...collectCandidateStringLiterals(
                    code,
                    result.calls.map((call) => call.span)
                )
            )
        }

        return {
            candidates: [...new Set(candidates)].sort(),
            excludedCandidates: [...new Set(excludedCandidates)].sort(),
            diagnostics: result.diagnostics,
            dependencies: result.dependencies,
        }
    }

    private updateDebugFile(
        id: string,
        hash: string,
        input: Pick<TailwindestDebugFile, "replacements" | "diagnostics">
    ): void {
        this.debugFiles.set(id, {
            id,
            hash,
            replacements: input.replacements,
            diagnostics: input.diagnostics,
        })
        this.writeDebugManifest()
    }

    private writeDebugManifest(): void {
        if (!this.options.debug) {
            return
        }
        const fileName =
            this.options.debugFile ??
            path.join(this.root, ".tailwindest", "debug-manifest.json")
        try {
            fsSync.mkdirSync(path.dirname(fileName), { recursive: true })
            fsSync.writeFileSync(
                fileName,
                stringifyDebugManifest(this.getDebugManifest())
            )
        } catch {
            // Virtual test roots and read-only build roots should not change codegen.
        }
    }

    private clearDependencies(consumer: string): void {
        const previous = this.dependencies.get(consumer)
        if (!previous) {
            return
        }
        for (const dependency of previous) {
            const consumers = this.reverseDependencies.get(dependency)
            consumers?.delete(consumer)
            if (consumers?.size === 0) {
                this.reverseDependencies.delete(dependency)
            }
        }
        this.dependencies.delete(consumer)
    }
}

function collectCandidatesFromToolCall(
    kind: TailwindestCallKind,
    values: unknown[],
    engine: ReturnType<typeof createEvaluationEngine>
): string[] {
    if (kind === "style") {
        return collectCandidatesFromStyles([values[0]], engine)
    }
    if (kind === "compose") {
        return collectCandidatesFromStyles(values, engine)
    }
    if (kind === "toggle") {
        const config = values[0] as
            | {
                  base?: unknown
                  truthy?: unknown
                  falsy?: unknown
              }
            | undefined
        return collectCandidatesFromStyles(
            [config?.base ?? {}, config?.truthy ?? {}, config?.falsy ?? {}],
            engine
        )
    }
    if (kind === "rotary") {
        const config = values[0] as
            | {
                  base?: unknown
                  variants?: Record<string, unknown>
              }
            | undefined
        return collectCandidatesFromStyles(
            [config?.base ?? {}, ...Object.values(config?.variants ?? {})],
            engine
        )
    }
    if (kind === "variants") {
        const config = values[0] as
            | {
                  base?: unknown
                  variants?: Record<string, Record<string, unknown>>
              }
            | undefined
        return collectCandidatesFromStyles(
            [
                config?.base ?? {},
                ...Object.values(config?.variants ?? {}).flatMap((axis) =>
                    Object.values(axis)
                ),
            ],
            engine
        )
    }

    return collectCandidatesFromValues(values)
}

function collectExclusionsFromToolCall(
    kind: TailwindestCallKind,
    values: unknown[],
    effectiveCandidates: string[]
): string[] {
    if (kind === "style") {
        return collectStyleExclusions([values[0]], effectiveCandidates)
    }
    if (kind === "compose") {
        return collectStyleExclusions(values, effectiveCandidates)
    }
    if (kind === "toggle") {
        const config = values[0] as
            | {
                  base?: unknown
                  truthy?: unknown
                  falsy?: unknown
              }
            | undefined
        return collectStyleExclusions(
            [config?.base ?? {}, config?.truthy ?? {}, config?.falsy ?? {}],
            effectiveCandidates
        )
    }
    if (kind === "rotary") {
        const config = values[0] as
            | {
                  base?: unknown
                  variants?: Record<string, unknown>
              }
            | undefined
        return collectStyleExclusions(
            [config?.base ?? {}, ...Object.values(config?.variants ?? {})],
            effectiveCandidates
        )
    }
    if (kind === "variants") {
        const config = values[0] as
            | {
                  base?: unknown
                  variants?: Record<string, Record<string, unknown>>
              }
            | undefined
        return collectStyleExclusions(
            [
                config?.base ?? {},
                ...Object.values(config?.variants ?? {}).flatMap((axis) =>
                    Object.values(axis)
                ),
            ],
            effectiveCandidates
        )
    }
    if (kind === "mergeProps" || kind === "mergeRecord") {
        return collectStyleExclusions(values, effectiveCandidates)
    }

    return []
}

function collectStyleExclusions(
    styles: unknown[],
    effectiveCandidates: string[]
): string[] {
    const effective = new Set(effectiveCandidates)
    return collectCandidatesFromValues(styles).filter(
        (candidate) => !effective.has(candidate)
    )
}

function collectCandidatesFromStyles(
    styles: unknown[],
    engine: ReturnType<typeof createEvaluationEngine>
): string[] {
    return [
        ...new Set(
            styles.flatMap(
                (style) => engine.mergeRecord([style] as never[]).candidates
            )
        ),
    ]
}

export function createCompilerContext(
    input: CompilerContextInput
): CompilerContext {
    return new CompilerContext(input)
}

function collectCandidatesFromValues(values: unknown[]): string[] {
    const candidates: string[] = []
    for (const value of values) {
        collectCandidatesFromValue(value, candidates)
    }
    return candidates
}

function collectCandidatesFromValue(
    value: unknown,
    candidates: string[]
): void {
    if (typeof value === "string") {
        candidates.push(...value.split(/\s+/).filter(Boolean))
        return
    }
    if (Array.isArray(value)) {
        for (const item of value) {
            collectCandidatesFromValue(item, candidates)
        }
        return
    }
    if (value && typeof value === "object") {
        for (const [key, item] of Object.entries(value)) {
            if (
                typeof item === "string" ||
                Array.isArray(item) ||
                (item && typeof item === "object")
            ) {
                collectCandidatesFromValue(item, candidates)
            } else if (item) {
                candidates.push(key)
            }
        }
    }
}

function collectCandidateStringLiterals(
    code: string,
    ignoredSpans: SourceSpan[] = []
): string[] {
    if (!code.includes("tailwindest") && !code.includes("createTools")) {
        return []
    }

    const sourceFile = ts.createSourceFile(
        "/source.tsx",
        code,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX
    )
    const candidates: string[] = []
    const visit = (node: ts.Node): void => {
        if (ts.isImportDeclaration(node)) {
            return
        }
        if (
            ts.isStringLiteral(node) ||
            ts.isNoSubstitutionTemplateLiteral(node)
        ) {
            const start = node.getStart(sourceFile)
            const end = node.getEnd()
            if (
                ignoredSpans.some(
                    (span) => start >= span.start && end <= span.end
                )
            ) {
                return
            }
            const text = node.text
            if (isCandidateLike(text)) {
                candidates.push(...text.split(/\s+/).filter(isCandidateLike))
            }
        }
        ts.forEachChild(node, visit)
    }
    visit(sourceFile)
    return candidates
}

function isCandidateLike(value: string): boolean {
    return /[-:[\]/]/.test(value) &&
        !value.startsWith("#") &&
        !value.includes("/")
        ? !value.includes(".")
        : /[-:[\]]/.test(value) && !value.startsWith("#")
}

async function scanDefaultSourceFiles(
    root: string,
    scanRoots?: string[]
): Promise<string[]> {
    const sourceRoots =
        scanRoots && scanRoots.length > 0
            ? scanRoots.map((item) =>
                  path.isAbsolute(item) ? item : path.resolve(root, item)
              )
            : [path.join(root, "src")]
    const files: string[] = []
    for (const sourceRoot of sourceRoots) {
        await walk(sourceRoot, files).catch(() => undefined)
    }
    return files
}

async function walk(directory: string, files: string[]): Promise<void> {
    const entries = await fs.readdir(directory, { withFileTypes: true })
    for (const entry of entries) {
        const resolved = path.join(directory, entry.name)
        if (entry.isDirectory()) {
            if (entry.name !== "node_modules" && entry.name !== "dist") {
                await walk(resolved, files)
            }
        } else if (isJsId(resolved) || isCssId(resolved)) {
            files.push(resolved)
        }
    }
}

function matchesAny(id: string, patterns: Array<string | RegExp>): boolean {
    return patterns.some((pattern) => {
        if (typeof pattern === "string") {
            return (
                normalizeCandidateFileId(pattern) === id || id.endsWith(pattern)
            )
        }
        return pattern.test(id)
    })
}

function isJsId(id: string): boolean {
    return JS_RE.test(normalizeCandidateFileId(id))
}

function isCssId(id: string): boolean {
    return CSS_RE.test(normalizeCandidateFileId(id))
}

function hashCode(code: string): string {
    return crypto.createHash("sha1").update(code).digest("hex")
}

function richDiagnosticsForDebug(
    diagnostics: CompilerDiagnostic[],
    file: string,
    fallbackSpan: { fileName: string; start: number; end: number }
): RichCompilerDiagnostic[] {
    return diagnostics.map((diagnostic) =>
        "modeBehavior" in diagnostic &&
        "file" in diagnostic &&
        "span" in diagnostic
            ? (diagnostic as RichCompilerDiagnostic)
            : diagnosticWithSource(diagnostic, file, fallbackSpan)
    )
}

function fullFileSpan(
    fileName: string,
    code: string
): { fileName: string; start: number; end: number } {
    return { fileName, start: 0, end: code.length }
}

function unchangedTransform(code: string): TransformOutput {
    return {
        code,
        map: null,
        candidates: [],
        diagnostics: [],
        changed: false,
    }
}
