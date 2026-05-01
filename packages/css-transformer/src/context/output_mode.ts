import fs from "fs/promises"
import path from "path"
import type { Diagnostic } from "../types"

export type CssTransformerResolvedOutputMode = "runtime" | "compiled"
export type CssTransformerOutputMode = CssTransformerResolvedOutputMode | "auto"

export type OutputModeEvidenceKind =
    | "explicit-option"
    | "tailwindest-config"
    | "compiler-vite-plugin"
    | "compiler-precompile-bridge"
    | "compiled-tailwindest-type"
    | "compiler-artifact"
    | "compiler-package-dependency"

export interface OutputModeEvidence {
    kind: OutputModeEvidenceKind
    source: string
    strength: "strong" | "weak"
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

const CONFIG_FILES = [
    "tailwindest.config.ts",
    "tailwindest.config.mts",
    "tailwindest.config.js",
    "tailwindest.config.mjs",
    "tailwindest.compiler.config.ts",
    "tailwindest.compiler.config.mts",
    "tailwindest.compiler.config.js",
    "tailwindest.compiler.config.mjs",
    ".tailwindest/config.json",
]

const VITE_CONFIG_FILES = [
    "vite.config.ts",
    "vite.config.mts",
    "vite.config.js",
    "vite.config.mjs",
]

const PRECOMPILE_FILES = [
    "precompile-tailwindest.ts",
    "precompile-tailwindest.mts",
    "scripts/precompile-tailwindest.ts",
    "scripts/precompile-tailwindest.mts",
]

const ARTIFACT_FILES = [
    ".tailwindest/debug-manifest.json",
    ".tailwindest/manifest.json",
]

export async function resolveOutputMode(
    options: ResolveOutputModeOptions = {}
): Promise<OutputModeResolution> {
    const requestedMode = options.outputMode ?? "auto"

    if (requestedMode === "runtime" || requestedMode === "compiled") {
        const diagnostics =
            requestedMode === "compiled"
                ? [
                      createModeDiagnostic(
                          "Compiled output mode is deprecated and reserved for internal compiler experiments. Use runtime output for published migrations."
                      ),
                  ]
                : []

        return {
            requestedMode,
            mode: requestedMode,
            evidence: [
                {
                    kind: "explicit-option",
                    source: "transform options",
                    strength: "strong",
                },
            ],
            diagnostics,
        }
    }

    const evidence: OutputModeEvidence[] = []
    const diagnostics: Diagnostic[] = []
    const projectRoot = options.projectRoot

    if (projectRoot) {
        const configEvidence = await detectTailwindestConfig(projectRoot)
        if (configEvidence) {
            recordDeprecatedCompilerEvidence(
                evidence,
                diagnostics,
                configEvidence
            )
        }

        const viteEvidence = await detectViteCompilerPlugin(projectRoot)
        if (viteEvidence) {
            recordDeprecatedCompilerEvidence(
                evidence,
                diagnostics,
                viteEvidence
            )
        }

        const precompileEvidence =
            await detectCompilerPrecompileBridge(projectRoot)
        if (precompileEvidence) {
            recordDeprecatedCompilerEvidence(
                evidence,
                diagnostics,
                precompileEvidence
            )
        }
    }

    const sourceEvidence = await detectCompiledTypeImport(options)
    if (sourceEvidence) {
        recordDeprecatedCompilerEvidence(evidence, diagnostics, sourceEvidence)
    }

    if (projectRoot) {
        const artifactEvidence = await detectCompilerArtifacts(projectRoot)
        if (artifactEvidence) {
            recordDeprecatedCompilerEvidence(
                evidence,
                diagnostics,
                artifactEvidence
            )
        }

        const packageEvidence =
            await detectCompilerPackageDependency(projectRoot)
        if (packageEvidence) {
            recordDeprecatedCompilerEvidence(
                evidence,
                diagnostics,
                packageEvidence
            )
        }
    }

    return {
        requestedMode,
        mode: "runtime",
        evidence,
        diagnostics,
    }
}

function recordDeprecatedCompilerEvidence(
    records: OutputModeEvidence[],
    diagnostics: Diagnostic[],
    record: OutputModeEvidence
) {
    records.push(record)
    diagnostics.push(
        createModeDiagnostic(
            `Detected deprecated compiler-mode signal (${record.kind} from ${record.source}), but auto mode no longer emits compiled output. Keeping runtime output mode.`
        )
    )
}

async function detectTailwindestConfig(
    projectRoot: string
): Promise<OutputModeEvidence | null> {
    for (const file of CONFIG_FILES) {
        const content = await readProjectFile(projectRoot, file)
        if (!content) continue

        if (
            /outputMode\s*:\s*["']compiled["']/.test(content) ||
            /compiler\s*:\s*true/.test(content)
        ) {
            return {
                kind: "tailwindest-config",
                source: file,
                strength: "strong",
            }
        }
    }

    return null
}

async function detectViteCompilerPlugin(
    projectRoot: string
): Promise<OutputModeEvidence | null> {
    for (const file of VITE_CONFIG_FILES) {
        const content = await readProjectFile(projectRoot, file)
        if (!content) continue

        if (
            content.includes("@tailwindest/compiler/vite") ||
            (/from\s+["']@tailwindest\/compiler["']/.test(content) &&
                /\btailwindest\s*\(/.test(content))
        ) {
            return {
                kind: "compiler-vite-plugin",
                source: file,
                strength: "strong",
            }
        }
    }

    return null
}

async function detectCompilerPrecompileBridge(
    projectRoot: string
): Promise<OutputModeEvidence | null> {
    for (const file of PRECOMPILE_FILES) {
        const content = await readProjectFile(projectRoot, file)
        if (!content) continue

        if (
            content.includes("createCompilerContext") &&
            content.includes("@tailwindest/compiler")
        ) {
            return {
                kind: "compiler-precompile-bridge",
                source: file,
                strength: "strong",
            }
        }
    }

    return null
}

async function detectCompiledTypeImport(
    options: ResolveOutputModeOptions
): Promise<OutputModeEvidence | null> {
    let content = options.sourceCode
    let source = "source"

    if (!content && options.sourcePath) {
        const fileContent = await readFile(options.sourcePath)
        if (fileContent) {
            content = fileContent
        }
        source = options.sourcePath
    }

    if (!content) return null

    if (content.includes("CreateCompiledTailwindest")) {
        return {
            kind: "compiled-tailwindest-type",
            source,
            strength: "strong",
        }
    }

    return null
}

async function detectCompilerArtifacts(
    projectRoot: string
): Promise<OutputModeEvidence | null> {
    for (const file of ARTIFACT_FILES) {
        if (await exists(path.join(projectRoot, file))) {
            return {
                kind: "compiler-artifact",
                source: file,
                strength: "weak",
            }
        }
    }

    return null
}

async function detectCompilerPackageDependency(
    projectRoot: string
): Promise<OutputModeEvidence | null> {
    const content = await readProjectFile(projectRoot, "package.json")
    if (!content) return null

    try {
        const packageJson = JSON.parse(content) as {
            dependencies?: Record<string, string>
            devDependencies?: Record<string, string>
            peerDependencies?: Record<string, string>
        }
        const hasCompiler =
            "@tailwindest/compiler" in (packageJson.dependencies ?? {}) ||
            "@tailwindest/compiler" in (packageJson.devDependencies ?? {}) ||
            "@tailwindest/compiler" in (packageJson.peerDependencies ?? {})

        return hasCompiler
            ? {
                  kind: "compiler-package-dependency",
                  source: "package.json",
                  strength: "weak",
              }
            : null
    } catch {
        return null
    }
}

async function readProjectFile(projectRoot: string, file: string) {
    return readFile(path.join(projectRoot, file))
}

async function readFile(file: string) {
    try {
        return await fs.readFile(file, "utf8")
    } catch {
        return null
    }
}

async function exists(file: string) {
    try {
        await fs.access(file)
        return true
    } catch {
        return false
    }
}

function createModeDiagnostic(message: string): Diagnostic {
    return {
        level: "warning",
        walkerName: "OutputModeResolver",
        message,
    }
}
