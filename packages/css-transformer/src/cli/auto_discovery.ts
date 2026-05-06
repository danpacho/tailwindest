import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { findTailwindCSSRoot } from "create-tailwind-type"
import type { CssTransformerOutputMode } from "../context/output_mode"

export type CssTransformerCliWalker = "cva" | "cn" | "classname"

export interface ResolveCssTransformerCliConfigInput {
    cwd: string
    targetPath: string
    cssPath?: string
    tailwindestIdentifier?: string
    tailwindestModulePath?: string
    outputMode?: CssTransformerOutputMode
    dryRun?: boolean
}

export interface ResolvedCssTransformerCliConfig {
    targetPath: string
    cssPath: string
    tailwindestIdentifier: string
    tailwindestModulePath: string
    tailwindestToolsPath?: string
    outputMode: CssTransformerOutputMode
    walkers: CssTransformerCliWalker[]
    dryRun: boolean
    warnings: string[]
}

interface TailwindestDefinition {
    path: string
    identifier: string
}

const DEFAULT_WALKERS: CssTransformerCliWalker[] = ["cva", "cn", "classname"]

const COMMON_TOOLS_FILES = [
    "tailwind.ts",
    "tw.ts",
    "src/tailwind.ts",
    "src/tw.ts",
    "src/styles/tailwind.ts",
    "src/styles/tw.ts",
    "src/styles/index.ts",
] as const

const IGNORED_DIRECTORIES = new Set([
    "node_modules",
    "dist",
    ".next",
    ".git",
    "build",
    ".cache",
    "out",
])

const TOOLS_EXPORT_PATTERN =
    /export\s+const\s+([A-Za-z_$][\w$]*)\s*=\s*createTools(?:\s*<[\s\S]*?>)?\s*\(/

export async function resolveCssTransformerCliConfig(
    input: ResolveCssTransformerCliConfigInput
): Promise<ResolvedCssTransformerCliConfig> {
    const warnings: string[] = []
    const cwd = path.resolve(input.cwd)
    const cssPath = input.cssPath
        ? path.resolve(cwd, input.cssPath)
        : await findTailwindCSSRoot(cwd)

    if (!cssPath) {
        throw new Error(
            "Could not find a Tailwind CSS entry. Pass --css <path>."
        )
    }

    const targetPath = path.resolve(cwd, input.targetPath)
    const definition = await findTailwindestDefinition(cwd)
    const tailwindestIdentifier =
        input.tailwindestIdentifier ?? definition?.identifier ?? "tw"

    let tailwindestModulePath = input.tailwindestModulePath
    if (!tailwindestModulePath) {
        if (definition) {
            tailwindestModulePath = await resolveTailwindestModulePath({
                cwd,
                sourcePath: targetPath,
                toolsPath: definition.path,
            })
        } else {
            tailwindestModulePath = "~/tw"
            warnings.push(
                "Could not infer Tailwindest tools export. Falling back to tw from ~/tw."
            )
        }
    }

    const resolved: ResolvedCssTransformerCliConfig = {
        targetPath,
        cssPath,
        tailwindestIdentifier,
        tailwindestModulePath,
        outputMode: input.outputMode ?? "auto",
        walkers: [...DEFAULT_WALKERS],
        dryRun: input.dryRun ?? false,
        warnings,
    }
    if (definition) {
        resolved.tailwindestToolsPath = definition.path
    }

    return resolved
}

async function findTailwindestDefinition(
    cwd: string
): Promise<TailwindestDefinition | null> {
    const seen = new Set<string>()
    const candidates: string[] = []

    for (const file of COMMON_TOOLS_FILES) {
        candidates.push(path.join(cwd, file))
    }

    for (const file of await walkTypeScriptFiles(cwd)) {
        candidates.push(file)
    }

    for (const candidate of candidates) {
        const normalized = path.resolve(candidate)
        if (seen.has(normalized)) continue
        seen.add(normalized)

        const definition = await readTailwindestDefinition(normalized)
        if (definition) return definition
    }

    return null
}

async function readTailwindestDefinition(
    filePath: string
): Promise<TailwindestDefinition | null> {
    let content: string
    try {
        content = await readFile(filePath, "utf-8")
    } catch {
        return null
    }

    if (
        !content.includes("createTools") &&
        !content.includes("CreateTailwindest")
    ) {
        return null
    }

    const match = content.match(TOOLS_EXPORT_PATTERN)
    const identifier = match?.[1]
    if (!identifier) return null

    return {
        path: filePath,
        identifier,
    }
}

async function walkTypeScriptFiles(root: string): Promise<string[]> {
    const files: string[] = []

    async function visit(dir: string) {
        let entries
        try {
            entries = await readdir(dir, { withFileTypes: true })
        } catch {
            return
        }

        for (const entry of entries) {
            if (entry.isDirectory()) {
                if (!IGNORED_DIRECTORIES.has(entry.name)) {
                    await visit(path.join(dir, entry.name))
                }
                continue
            }

            if (/\.(ts|tsx)$/.test(entry.name)) {
                files.push(path.join(dir, entry.name))
            }
        }
    }

    await visit(root)
    return files.sort()
}

export async function resolveTailwindestModulePath(input: {
    cwd: string
    sourcePath: string
    toolsPath: string
}): Promise<string> {
    const cwd = path.resolve(input.cwd)
    const toolsPath = path.resolve(cwd, input.toolsPath)
    const sourcePath = path.resolve(cwd, input.sourcePath)

    const aliasPath = await inferAliasModulePath(cwd, toolsPath)
    if (aliasPath) return aliasPath

    const targetDir = getTargetDirectory(sourcePath)
    let relativePath = toPosixPath(path.relative(targetDir, toolsPath))
    if (!relativePath.startsWith(".")) {
        relativePath = `./${relativePath}`
    }
    return stripModuleFileSuffix(relativePath)
}

function getTargetDirectory(targetPath: string): string {
    if (/\.(tsx|ts|jsx|js)$/.test(targetPath)) {
        return path.dirname(targetPath)
    }
    return targetPath
}

async function inferAliasModulePath(
    cwd: string,
    toolsPath: string
): Promise<string | null> {
    const configs = ["tsconfig.json", "jsconfig.json"]
    for (const configFile of configs) {
        const config = await readJson(path.join(cwd, configFile))
        const paths = config?.compilerOptions?.paths
        if (!paths || typeof paths !== "object") continue

        const baseUrl =
            typeof config.compilerOptions?.baseUrl === "string"
                ? config.compilerOptions.baseUrl
                : "."
        const baseDir = path.resolve(cwd, baseUrl)
        const matches: string[] = []

        for (const [aliasPattern, targetPatterns] of Object.entries(paths)) {
            if (!Array.isArray(targetPatterns)) continue
            for (const targetPattern of targetPatterns) {
                if (typeof targetPattern !== "string") continue
                const match = matchAliasPattern({
                    baseDir,
                    aliasPattern,
                    targetPattern,
                    toolsPath,
                })
                if (match) matches.push(match)
            }
        }

        if (matches.length > 0) {
            return matches.sort((a, b) => a.length - b.length)[0] ?? null
        }
    }

    return null
}

async function readJson(filePath: string): Promise<any | null> {
    try {
        return JSON.parse(await readFile(filePath, "utf-8"))
    } catch {
        return null
    }
}

function matchAliasPattern(input: {
    baseDir: string
    aliasPattern: string
    targetPattern: string
    toolsPath: string
}): string | null {
    const wildcardIndex = input.targetPattern.indexOf("*")
    if (wildcardIndex === -1) {
        const resolvedTarget = path.resolve(input.baseDir, input.targetPattern)
        if (path.resolve(input.toolsPath) !== resolvedTarget) return null
        return stripModuleFileSuffix(input.aliasPattern)
    }

    const targetPrefix = input.targetPattern.slice(0, wildcardIndex)
    const targetSuffix = input.targetPattern.slice(wildcardIndex + 1)
    const resolvedPrefix = path.resolve(input.baseDir, targetPrefix)
    const relativeFromPrefix = toPosixPath(
        path.relative(resolvedPrefix, input.toolsPath)
    )

    if (relativeFromPrefix.startsWith("../") || relativeFromPrefix === "..") {
        return null
    }
    if (targetSuffix && !relativeFromPrefix.endsWith(targetSuffix)) {
        return null
    }

    const wildcardValue = targetSuffix
        ? relativeFromPrefix.slice(0, -targetSuffix.length)
        : relativeFromPrefix
    const modulePath = input.aliasPattern.replace("*", wildcardValue)
    return stripModuleFileSuffix(modulePath)
}

function stripModuleFileSuffix(modulePath: string): string {
    const withoutExtension = modulePath.replace(/\.(tsx|ts)$/, "")
    return withoutExtension.replace(/\/index$/, "")
}

function toPosixPath(value: string): string {
    return value.split(path.sep).join("/")
}
