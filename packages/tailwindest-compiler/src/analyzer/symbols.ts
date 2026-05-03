import type { CompilerDiagnostic } from "../core/diagnostic_types"
import type * as ts from "typescript"

export type TailwindestCallKind =
    | "style"
    | "toggle"
    | "rotary"
    | "variants"
    | "join"
    | "def"
    | "mergeProps"
    | "mergeRecord"
    | "compose"

/**
 * Byte-offset span in an original source file.
 *
 * `start` is inclusive and `end` is exclusive. Spans are used in diagnostics,
 * source maps, debug manifests, and low-level replacement plans.
 *
 * @public
 */
export interface SourceSpan {
    fileName: string
    start: number
    end: number
}

export interface TailwindestSymbol {
    name: string
    sourceFile: string
    provenance: "createTools"
    runtimeMerger: boolean
}

export interface ResolvedStaticArgument {
    value: unknown
    dependencies: string[]
}

export interface TailwindestCallSite {
    kind: TailwindestCallKind
    span: SourceSpan
    receiver: TailwindestSymbol
    arguments: ResolvedStaticArgument[]
}

export interface ResolvedCallArguments {
    span: SourceSpan
    arguments: ResolvedStaticArgument[]
}

export interface DetectionResult {
    calls: TailwindestCallSite[]
    provenReceiverSpans: SourceSpan[]
    resolvedCallArguments: ResolvedCallArguments[]
    runtimeMergerCalls: SourceSpan[]
    dependencies: string[]
    diagnostics: CompilerDiagnostic[]
}

export interface ImportedBinding {
    localName: string
    importedName: string
    moduleSpecifier: string
    resolvedFile?: string | undefined
    isTypeOnly: boolean
}

export interface ExportedBinding {
    localName?: string
    expression?: ts.Expression | undefined
    reexport?: ImportedBinding
}

export interface ModuleInfo {
    imports: Map<string, ImportedBinding>
    exports: Map<string, ExportedBinding>
    topLevelDeclarations: Map<string, ts.VariableDeclaration>
    classDeclarations: Set<string>
    mutatedBindings: Set<string>
}

export const TAILWINDEST_CALL_KINDS = new Set<TailwindestCallKind>([
    "style",
    "toggle",
    "rotary",
    "variants",
    "join",
    "def",
    "mergeProps",
    "mergeRecord",
    "compose",
])

export const createAnalyzerDiagnostic = (
    code: CompilerDiagnostic["code"],
    message: string
): CompilerDiagnostic => ({
    code,
    message,
    severity: "error",
})
