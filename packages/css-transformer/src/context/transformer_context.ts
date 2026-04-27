import type { TokenAnalyzer } from "../analyzer/token_analyzer"
import type { Diagnostic } from "../types"
import { ImportCollector } from "./import_collector"

export interface TransformerContext {
    analyzer: TokenAnalyzer
    tailwindestIdentifier: string
    tailwindestModulePath: string
    imports: ImportCollector
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
        diagnostics: [],
    }
}
