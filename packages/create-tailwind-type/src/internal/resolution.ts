import { existsSync, readFileSync } from "fs"
import { join, dirname, parse } from "path"
import { createRequire } from "module"

/**
 * Resolves the directory of '@tailwindcss/node' package.
 * It uses the detected CSS root as a hint for monorepo environments.
 */
export async function resolveTailwindNodeDir(
    cssRoot?: string,
    options: { skipLocal?: boolean } = {}
): Promise<string> {
    const require = createRequire(import.meta.url)
    const searchPaths: string[] = []
    if (!options.skipLocal) {
        searchPaths.push(process.cwd())
        if (cssRoot) {
            searchPaths.push(dirname(cssRoot))
        }
    }

    if (searchPaths.length > 0) {
        try {
            // 1. Try to resolve from the search paths (local or near CSS)
            const tailwindNodePath = require.resolve("@tailwindcss/node", {
                paths: searchPaths,
            })
            return dirname(tailwindNodePath)
        } catch {
            // Continue to fallback
        }
    }

    try {
        // 2. Fallback: try resolving from the CLI package itself
        const tailwindNodePath = require.resolve("@tailwindcss/node")
        return dirname(tailwindNodePath)
    } catch {
        throw new Error(
            "Could not find '@tailwindcss/node' package. Please ensure Tailwind CSS v4 is installed."
        )
    }
}

/**
 * Searches upward for package.json to find the Tailwind CSS version.
 */
export function getTailwindVersion(baseDir: string): string {
    let currentDir = baseDir
    const root = parse(currentDir).root

    while (currentDir !== root) {
        try {
            const packageJsonPath = join(currentDir, "package.json")
            if (existsSync(packageJsonPath)) {
                const packageJson = JSON.parse(
                    readFileSync(packageJsonPath, "utf-8")
                )
                if (
                    packageJson.name === "@tailwindcss/node" ||
                    packageJson.name === "tailwindcss"
                ) {
                    return packageJson.version || "0.0.0"
                }
            }
        } catch {
            // Ignore and continue searching upwards
        }
        const parent = dirname(currentDir)
        if (parent === currentDir) break
        currentDir = parent
    }

    throw new Error(
        "Could not find Tailwind CSS package.json in the provided path or its parent directories."
    )
}

/**
 * Validates if the detected Tailwind version meets the minimum requirement.
 */
export function isVersionSufficient(
    version: string,
    minimum: string = "4.0.0"
): boolean {
    const parts = version.split(".").map(Number)
    const minParts = minimum.split(".").map(Number)

    for (let i = 0; i < 3; i++) {
        const v = parts[i] || 0
        const m = minParts[i] || 0
        if (v > m) return true
        if (v < m) return false
    }
    return true
}
