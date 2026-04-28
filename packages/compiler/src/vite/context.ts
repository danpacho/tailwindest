import crypto from "node:crypto"
import fsSync from "node:fs"
import fs from "node:fs/promises"
import path from "node:path"
import * as ts from "typescript"
import { createStaticAnalyzer } from "../analyzer/detector"
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

export interface TailwindestViteOptions {
    include?: Array<string | RegExp>
    exclude?: Array<string | RegExp>
    mode?: "strict" | "loose"
    debug?: boolean
    sourceMap?: boolean
    variantTableLimit?: number
    debugFile?: string
    cssEntries?: Array<string | RegExp>
    merger?: MergerPolicy
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
            : await scanDefaultSourceFiles(this.root)
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
        const fallbackSpan = fullFileSpan(normalized, code)
        const diagnostics: RichCompilerDiagnostic[] = [
            ...richDiagnosticsForDebug(
                analysis.diagnostics,
                normalized,
                fallbackSpan
            ),
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
        })
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
                candidates.push(
                    ...engine.def(
                        [values[0]] as never[],
                        values.slice(1) as never[],
                        this.options.merger ?? DEFAULT_MERGER,
                        this.options
                    ).candidates
                )
            } else if (call.kind === "mergeProps") {
                candidates.push(
                    ...engine.mergeProps(
                        values as never[],
                        this.options.merger ?? DEFAULT_MERGER,
                        this.options
                    ).candidates
                )
            } else if (call.kind === "mergeRecord") {
                candidates.push(
                    ...engine.mergeRecord(values as never[]).candidates
                )
            } else {
                candidates.push(...collectCandidatesFromValues(values))
            }
        }

        candidates.push(...collectCandidateStringLiterals(code))

        return {
            candidates: [...new Set(candidates)].sort(),
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

function collectCandidateStringLiterals(code: string): string[] {
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

async function scanDefaultSourceFiles(root: string): Promise<string[]> {
    const sourceRoot = path.join(root, "src")
    const files: string[] = []
    await walk(sourceRoot, files).catch(() => undefined)
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
