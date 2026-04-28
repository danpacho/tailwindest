import type { TokenAnalyzer } from "../analyzer/token_analyzer"
import type { Diagnostic } from "../types"
import { ImportCollector } from "./import_collector"
import type {
    CssTransformerResolvedOutputMode,
    OutputModeEvidence,
} from "./output_mode"
import { StyleManager } from "./style_manager"

export interface TransformerContext {
    analyzer: TokenAnalyzer
    tailwindestIdentifier: string
    tailwindestModulePath: string
    outputMode: CssTransformerResolvedOutputMode
    outputModeEvidence: OutputModeEvidence[]
    imports: ImportCollector
    styles: StyleManager
    diagnostics: Diagnostic[]
}

export function createContext(options: {
    analyzer: TokenAnalyzer
    tailwindestIdentifier?: string
    tailwindestModulePath?: string
    outputMode?: CssTransformerResolvedOutputMode
    outputModeEvidence?: OutputModeEvidence[]
    diagnostics?: Diagnostic[]
}): TransformerContext {
    return {
        analyzer: options.analyzer,
        tailwindestIdentifier: options.tailwindestIdentifier ?? "tw",
        tailwindestModulePath: options.tailwindestModulePath ?? "~/tw",
        outputMode: options.outputMode ?? "runtime",
        outputModeEvidence: options.outputModeEvidence ?? [],
        imports: new ImportCollector(),
        styles: new StyleManager(),
        diagnostics: options.diagnostics ?? [],
    }
}
