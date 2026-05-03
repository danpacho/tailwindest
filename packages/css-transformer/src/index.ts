export * from "./types"
export * from "./analyzer"
export * from "./context"
export * from "./registry"
export * from "./walkers"

import { Project, ScriptTarget } from "ts-morph"
import { TokenAnalyzerImpl } from "./analyzer/token_analyzer"
import { createContext } from "./context/transformer_context"
import {
    resolveOutputMode,
    type CssTransformerOutputMode,
    type ResolveOutputModeOptions,
} from "./context/output_mode"
import { TransformerRegistry } from "./registry/transformer_registry"
import {
    CvaWalker,
    CnWalker,
    ClassNameWalker,
    type CnWalkerConfig,
    type ClassNameWalkerConfig,
} from "./walkers"
import type { CSSPropertyResolver } from "create-tailwind-type"
import type { TransformResult, Diagnostic } from "./types"

export interface TransformOptions {
    tailwindestIdentifier?: string
    tailwindestModulePath?: string
    outputMode?: CssTransformerOutputMode
    projectRoot?: string
    sourcePath?: string
    resolver: CSSPropertyResolver
    /**
     * List of walkers to use. If not provided, all default walkers are used.
     * @default ["cva", "cn", "classname"]
     */
    walkers?: Array<"cva" | "cn" | "classname">
    /**
     * Global configuration for the transformer.
     */
    config?: CnWalkerConfig & ClassNameWalkerConfig
}

export interface TransformOutput {
    code: string
    results: TransformResult[]
    diagnostics: Diagnostic[]
}

export async function transform(
    sourceCode: string,
    options: TransformOptions
): Promise<TransformOutput> {
    const project = new Project({
        compilerOptions: { target: ScriptTarget.ESNext, jsx: 1 /* Preserve */ },
    })
    // We use a dummy filename so ts-morph can parse JSX properly
    const sourceFile = project.createSourceFile("temp.tsx", sourceCode)

    const outputModeOptions: ResolveOutputModeOptions = { sourceCode }
    if (options.outputMode !== undefined) {
        outputModeOptions.outputMode = options.outputMode
    }
    if (options.projectRoot !== undefined) {
        outputModeOptions.projectRoot = options.projectRoot
    }
    if (options.sourcePath !== undefined) {
        outputModeOptions.sourcePath = options.sourcePath
    }

    const outputMode = await resolveOutputMode(outputModeOptions)
    const analyzer = new TokenAnalyzerImpl(options.resolver)
    const contextOptions: Parameters<typeof createContext>[0] = {
        analyzer,
        diagnostics: [...outputMode.diagnostics],
    }
    if (options.tailwindestIdentifier !== undefined) {
        contextOptions.tailwindestIdentifier = options.tailwindestIdentifier
    }
    if (options.tailwindestModulePath !== undefined) {
        contextOptions.tailwindestModulePath = options.tailwindestModulePath
    }

    const context = createContext(contextOptions)
    const registry = new TransformerRegistry()

    const selectedWalkers = options.walkers ?? ["cva", "cn", "classname"]
    if (selectedWalkers.includes("cva")) registry.register(new CvaWalker())
    if (selectedWalkers.includes("cn"))
        registry.register(new CnWalker(options.config))
    if (selectedWalkers.includes("classname"))
        registry.register(new ClassNameWalker(options.config))

    const results = registry.transform(sourceFile, context)

    const code = sourceFile.getFullText()

    return {
        code: code.trim(),
        results,
        diagnostics: context.diagnostics,
    }
}
