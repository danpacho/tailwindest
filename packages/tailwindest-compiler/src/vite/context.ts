import crypto from "node:crypto"
import fsSync from "node:fs"
import fs from "node:fs/promises"
import path from "node:path"
import * as ts from "typescript"
import { loadTailwindNestGroups } from "@tailwindest/tailwind-internal"
import { createStaticAnalyzer } from "../analyzer/detector"
import type { TailwindestCallKind, SourceSpan } from "../analyzer/symbols"
import {
    createCompiledVariantResolver,
    type CompiledVariantResolver,
} from "../core/compiled_variant_resolver"
import { createEvaluationEngine } from "../core/evaluator"
import type { CompilerDiagnostic } from "../core/diagnostic_types"
import type { MergerPolicy } from "../core/merger"
import {
    createDebugManifest,
    stringifyDebugManifest,
    type TailwindestDebugFile,
    type TailwindestDebugManifest,
    type TailwindestDebugReplacement,
} from "../debug/debug_manifest"
import {
    diagnosticWithSource,
    diagnosticsForRuntimeFallback,
    type RichCompilerDiagnostic,
} from "../debug/diagnostics"
import {
    createCandidateManifest,
    getSortedCandidateRecords,
    getSortedExcludedCandidates,
    getSortedCandidates,
    normalizeCandidateFileId,
    removeFileCandidates,
    updateFileCandidates,
    type CandidateRecord,
    type CandidateManifest,
} from "../tailwind/manifest"
import {
    injectSourceInlineBlock,
    isTailwindCssEntry,
} from "../tailwind/source_inline"
import { substituteTailwindest } from "../transform/substitutor"
import { SourceCache } from "./cache"
import {
    compileTailwindestSource,
    type CandidateOnlyDebugCall,
} from "./compile_transform"

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
    variantResolver?: CompiledVariantResolver | undefined
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
    private readonly cssEntryGroups = new Map<string, string[]>()
    private readonly cssEntryHashes = new Map<string, string>()
    private variantResolver: CompiledVariantResolver | undefined
    private variantResolverReadiness: Promise<void> | undefined
    private variantResolverReadinessChecked = false
    private readonly debugFiles = new Map<string, TailwindestDebugFile>()
    private lastInvalidatedManifestRevision = 0

    public constructor(input: CompilerContextInput) {
        this.root = normalizeCandidateFileId(input.root)
        this.command = input.command ?? "serve"
        this.options = normalizeOptions(input.options)
        this.readFile = input.readFile
        this.scanFiles = input.scanFiles
        this.variantResolver = input.variantResolver
    }

    public updateRoot(root: string): void {
        this.root = normalizeCandidateFileId(root)
    }

    public async preScan(): Promise<void> {
        const files = this.scanFiles
            ? await this.scanFiles()
            : await scanDefaultSourceFiles(this.root, this.options.scanRoots)
        const jsFiles: Array<{ id: string; code: string }> = []
        for (const file of files.sort()) {
            const normalized = normalizeCandidateFileId(file)
            const code = this.readFile
                ? await this.readFile(normalized)
                : await fs.readFile(normalized, "utf8")
            if (isJsId(normalized) && this.shouldTransformJs(normalized)) {
                jsFiles.push({ id: normalized, code })
            } else if (
                isCssId(normalized) &&
                isTailwindCssEntry(
                    normalized,
                    code,
                    this.options.cssEntries ?? []
                )
            ) {
                await this.loadVariantResolverFromCss(normalized, code)
                this.cache.set(normalized, code, hashCode(code))
            }
        }
        for (const file of jsFiles) {
            this.transformJs(file.code, file.id)
        }
        this.variantResolverReadinessChecked = true
    }

    public async ensureVariantResolverReady(): Promise<void> {
        if (this.variantResolverReadinessChecked) {
            return
        }
        this.variantResolverReadiness ??=
            this.loadDiscoveredCssVariantResolvers()
        await this.variantResolverReadiness
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

        const analysis = this.analyzeJs(normalized, code, this.variantResolver)
        this.recordDependencies(normalized, analysis.dependencies)
        const fallbackSpan = fullFileSpan(normalized, code)
        const analysisDiagnostics = richDiagnosticsForDebug(
            analysis.diagnostics,
            normalized,
            fallbackSpan
        )
        const analysisFallbackDiagnostics =
            diagnosticsForRuntimeFallback(analysisDiagnostics)
        const compiled = compileTailwindestSource({
            fileName: normalized,
            code,
            provenCalls: analysis.provenCalls,
            provenReceiverCalls: analysis.provenReceiverCalls,
            runtimeMergerCalls: analysis.runtimeMergerCalls,
            candidateOnlyCalls: analysis.candidateOnlyCalls,
            variantTableLimit: this.options.variantTableLimit,
            merger: this.options.merger ?? DEFAULT_MERGER,
            variantResolver: this.variantResolver,
        })
        const fallbackDiagnostics = diagnosticsForRuntimeFallback(
            compiled.diagnostics
        )
        const transform = substituteTailwindest({
            fileName: normalized,
            code,
            plans: compiled.plans,
            cleanImports: true,
            sourceMapBehavior: this.options.sourceMap
                ? "diagnostic-on-error"
                : false,
        })
        const debugReplacements = debugReplacementsForTransform(
            compiled.debugReplacements,
            transform
        )
        const diagnostics: RichCompilerDiagnostic[] = [
            ...analysisFallbackDiagnostics.diagnostics,
            ...fallbackDiagnostics.diagnostics,
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
        const candidateRecords = candidateRecordsForTransform(
            candidates,
            transform.candidates,
            debugReplacements
        )
        updateFileCandidates(this.manifest, normalized, {
            hash,
            candidates,
            candidateRecords,
            excludedCandidates: analysis.excludedCandidates,
            diagnostics,
        })
        this.updateDebugFile(normalized, hash, {
            replacements: debugReplacements,
            diagnostics,
        })

        return {
            code: transform.code,
            map: transform.map,
            candidates,
            diagnostics,
            changed: transform.changed,
        }
    }

    public removeFile(id: string): boolean {
        const normalized = normalizeCandidateFileId(id)
        this.cache.delete(normalized)
        this.clearDependencies(normalized)
        this.debugFiles.delete(normalized)
        this.cssEntries.delete(normalized)
        if (this.cssEntryGroups.delete(normalized)) {
            this.cssEntryHashes.delete(normalized)
            this.rebuildVariantResolver()
        }
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

    public async transformCssAsync(
        code: string,
        id: string
    ): Promise<TransformOutput> {
        const normalized = normalizeCandidateFileId(id)
        if (this.shouldTransformCss(normalized, code)) {
            await this.loadVariantResolverFromCss(normalized, code)
        }
        return this.transformCss(code, id)
    }

    public getManifestCandidates(): string[] {
        return getSortedCandidates(this.manifest)
    }

    public getDebugManifest(): TailwindestDebugManifest {
        return createDebugManifest({
            files: [...this.debugFiles.values()],
            candidates: this.getManifestCandidates(),
            candidateRecords: getSortedCandidateRecords(this.manifest),
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
        code: string,
        variantResolver: CompiledVariantResolver | undefined
    ): {
        candidates: string[]
        excludedCandidates: string[]
        diagnostics: CompilerDiagnostic[]
        dependencies: string[]
        provenCalls: SourceSpan[]
        provenReceiverCalls: SourceSpan[]
        runtimeMergerCalls: SourceSpan[]
        candidateOnlyCalls: CandidateOnlyDebugCall[]
    } {
        const files = Object.fromEntries(
            this.cache.entries().map((entry) => [entry.id, entry.code])
        )
        files[id] = code
        const analyzer = createStaticAnalyzer(files)
        const result = analyzer.analyzeFile(id)
        const engine = createEvaluationEngine({ variantResolver })
        const candidates: string[] = []
        const excludedCandidates: string[] = []
        const candidateOnlyCalls: CandidateOnlyDebugCall[] = []

        for (const call of result.calls) {
            const values = call.arguments.map((argument) => argument.value)
            let toolCandidates: string[] = []
            if (call.kind === "join") {
                toolCandidates = engine.join(
                    values as never[],
                    this.options.merger ?? DEFAULT_MERGER
                ).candidates
                candidates.push(...toolCandidates)
            } else if (call.kind === "def") {
                const result = engine.def(
                    [values[0]] as never[],
                    values.slice(1) as never[],
                    this.options.merger ?? DEFAULT_MERGER
                )
                toolCandidates = result.candidates
                candidates.push(...toolCandidates)
                excludedCandidates.push(
                    ...collectStyleExclusions(values.slice(1), toolCandidates)
                )
            } else if (call.kind === "mergeProps") {
                const result = engine.mergeProps(
                    values as never[],
                    this.options.merger ?? DEFAULT_MERGER
                )
                toolCandidates = result.candidates
                candidates.push(...toolCandidates)
                excludedCandidates.push(
                    ...collectStyleExclusions(values, toolCandidates)
                )
            } else if (call.kind === "mergeRecord") {
                const result = engine.mergeRecord(values as never[])
                toolCandidates = result.candidates
                candidates.push(...toolCandidates)
                excludedCandidates.push(
                    ...collectStyleExclusions(values, toolCandidates)
                )
            } else {
                toolCandidates = collectCandidatesFromToolCall(
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
            if (isCandidateOnlyToolCall(call.kind)) {
                candidateOnlyCalls.push({
                    kind: call.kind,
                    span: call.span,
                    candidates: toolCandidates,
                    reason: "Candidates collected; no supported replacement was attempted.",
                })
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
            provenCalls: result.calls.map((call) => call.span),
            provenReceiverCalls: result.provenReceiverSpans,
            runtimeMergerCalls: result.runtimeMergerCalls,
            candidateOnlyCalls,
        }
    }

    private async loadVariantResolverFromCss(
        id: string,
        code: string
    ): Promise<void> {
        const normalized = normalizeCandidateFileId(id)
        this.registerCssEntry(normalized)
        const hash = hashCode(code)
        if (this.cssEntryHashes.get(normalized) === hash) return

        const groups = await loadTailwindNestGroups({
            cssRoot: normalized,
            cssSource: code,
        })
        this.cssEntryHashes.set(normalized, hash)
        this.cssEntryGroups.set(normalized, groups)
        this.rebuildVariantResolver()
    }

    private async loadDiscoveredCssVariantResolvers(): Promise<void> {
        const files = this.scanFiles
            ? await this.scanFiles()
            : await scanDefaultSourceFiles(this.root, this.options.scanRoots)
        for (const file of files.sort()) {
            const normalized = normalizeCandidateFileId(file)
            if (!isCssId(normalized)) {
                continue
            }
            const code = this.readFile
                ? await this.readFile(normalized)
                : await fs.readFile(normalized, "utf8")
            if (
                isTailwindCssEntry(
                    normalized,
                    code,
                    this.options.cssEntries ?? []
                )
            ) {
                await this.loadVariantResolverFromCss(normalized, code)
                this.cache.set(normalized, code, hashCode(code))
            }
        }
        this.variantResolverReadinessChecked = true
    }

    private rebuildVariantResolver(): void {
        const groups = [
            ...new Set(
                [...this.cssEntryGroups.keys()]
                    .sort()
                    .flatMap((id) => this.cssEntryGroups.get(id) ?? [])
            ),
        ]
        this.variantResolver =
            groups.length > 0
                ? createCompiledVariantResolver(groups)
                : undefined
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

function isCandidateOnlyToolCall(kind: TailwindestCallKind): boolean {
    return (
        kind === "style" ||
        kind === "toggle" ||
        kind === "rotary" ||
        kind === "variants" ||
        kind === "compose"
    )
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

function debugReplacementsForTransform(
    replacements: TailwindestDebugReplacement[],
    transform: ReturnType<typeof substituteTailwindest>
): TailwindestDebugReplacement[] {
    const unsafeDiagnostic = transform.diagnostics.find((diagnostic) =>
        isUnsafeSkippedDiagnostic(diagnostic)
    )
    if (!unsafeDiagnostic) {
        return replacements
    }

    const skippedSpanKeys = new Set((transform.skippedSpans ?? []).map(spanKey))
    const shouldMarkAllCompiled =
        !transform.changed && skippedSpanKeys.size === 0
    return replacements.map((replacement) =>
        replacement.status !== "compiled" ||
        (!shouldMarkAllCompiled &&
            !skippedSpanKeys.has(spanKey(replacement.originalSpan)))
            ? replacement
            : {
                  ...replacement,
                  generatedText: "",
                  status: "unsafe-skipped",
                  fallback: true,
                  candidateRecords: candidateRecordsForReplacement({
                      ...replacement,
                      status: "unsafe-skipped",
                  }),
                  reason: unsafeDiagnostic.message,
              }
    )
}

function candidateRecordsForTransform(
    candidates: string[],
    appliedCandidates: string[],
    replacements: TailwindestDebugReplacement[]
): CandidateRecord[] {
    const records = replacements.flatMap(candidateRecordsForReplacement)
    const exactCandidates = new Set(
        records
            .filter((record) => record.kind === "exact")
            .map((record) => record.candidate)
    )
    for (const candidate of appliedCandidates) {
        if (!exactCandidates.has(candidate)) {
            records.push({ candidate, kind: "exact" })
            exactCandidates.add(candidate)
        }
    }

    const recordedCandidates = new Set(
        records.map((record) => record.candidate.trim()).filter(Boolean)
    )
    for (const candidate of candidates) {
        const normalized = candidate.trim()
        if (normalized && !recordedCandidates.has(normalized)) {
            records.push({ candidate: normalized, kind: "fallback-known" })
            recordedCandidates.add(normalized)
        }
    }
    return records
}

function candidateRecordsForReplacement(
    replacement: TailwindestDebugReplacement
): CandidateRecord[] {
    const kind: CandidateRecord["kind"] =
        replacement.status === "compiled" ? "exact" : "fallback-known"
    return replacement.candidates.map((candidate) => ({
        candidate,
        kind,
        sourceSpan: replacement.originalSpan,
    }))
}

function isUnsafeSkippedDiagnostic(diagnostic: CompilerDiagnostic): boolean {
    return (
        diagnostic.code === "INVALID_REPLACEMENT_SPAN" ||
        diagnostic.code === "INVALID_REPLACEMENT_SYNTAX" ||
        diagnostic.code === "OVERLAPPING_REPLACEMENT" ||
        diagnostic.code === "IMPORT_CLEANUP_FAILED"
    )
}

function spanKey(span: SourceSpan): string {
    return `${span.fileName}:${span.start}:${span.end}`
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

function normalizeOptions(
    options: TailwindestViteOptions
): TailwindestViteOptions {
    return options
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
        "fallbackBehavior" in diagnostic &&
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
