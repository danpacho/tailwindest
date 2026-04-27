import type { TokenAnalyzer } from "../analyzer/token_analyzer"
import type { Diagnostic } from "../types"
import { ImportCollector } from "./import_collector"
import { StyleManager } from "./style_manager"

export interface TransformerContext {
    analyzer: TokenAnalyzer
    tailwindestIdentifier: string
    tailwindestModulePath: string
    imports: ImportCollector
    styles: StyleManager
    diagnostics: Diagnostic[]
}

export function createContext(options: {
    analyzer: TokenAnalyzer
    tailwindestIdentifier?: string
    tailwindestModulePath?: string
}): TransformerContext {
    return {
        analyzer: options.analyzer,
        tailwindestIdentifier: options.tailwindestIdentifier ?? "tw",
        tailwindestModulePath: options.tailwindestModulePath ?? "~/tw",
        imports: new ImportCollector(),
        styles: new StyleManager(),
        diagnostics: [],
    }
}
