import type { Diagnostic } from "../types"

export type CssTransformerResolvedOutputMode = "runtime"
export type CssTransformerOutputMode = CssTransformerResolvedOutputMode | "auto"

export type OutputModeEvidenceKind = "explicit-option"

export interface OutputModeEvidence {
    kind: OutputModeEvidenceKind
    source: string
    strength: "strong"
}

export interface OutputModeResolution {
    requestedMode: CssTransformerOutputMode
    mode: CssTransformerResolvedOutputMode
    evidence: OutputModeEvidence[]
    diagnostics: Diagnostic[]
}

export interface ResolveOutputModeOptions {
    outputMode?: CssTransformerOutputMode
    projectRoot?: string
    sourcePath?: string
    sourceCode?: string
}

export async function resolveOutputMode(
    options: ResolveOutputModeOptions = {}
): Promise<OutputModeResolution> {
    const requestedMode = options.outputMode ?? "auto"

    if (requestedMode !== "runtime" && requestedMode !== "auto") {
        throw new Error(`Invalid output mode: ${requestedMode}`)
    }

    return {
        requestedMode,
        mode: "runtime",
        evidence:
            requestedMode === "runtime"
                ? [
                      {
                          kind: "explicit-option",
                          source: "transform options",
                          strength: "strong",
                      },
                  ]
                : [],
        diagnostics: [],
    }
}
