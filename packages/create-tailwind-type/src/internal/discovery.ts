import { existsSync, readFileSync } from "fs"
import { join } from "path"
import { glob } from "glob"
import { readFile } from "fs/promises"

export async function checkFileForImport(filePath: string): Promise<boolean> {
    try {
        const content = await readFile(filePath, "utf-8")
        // Tailwind v4 Entry Point markers
        const markers = [
            "@import 'tailwindcss'",
            '@import "tailwindcss"',
            "@tailwind",
            "@theme",
            "@plugin",
            "@utility",
            "@variant",
        ] as const
        return markers.some((marker) => content.includes(marker))
    } catch {
        return false
    }
}

export async function findTailwindCSSRoot(
    searchDir: string
): Promise<string | null> {
    const commonPaths = [
        "tailwind.css",
        "index.css",
        "globals.css",
        "app.css",
        "styles/tailwind.css",
        "styles/globals.css",
        "styles/index.css",
        "css/tailwind.css",
        "src/tailwind.css",
        "src/index.css",
        "src/globals.css",
        "src/app.css",
        "src/styles/tailwind.css",
        "src/styles/globals.css",
        "src/css/tailwind.css",
    ] as const

    // 1. Fast path: check common filenames first
    for (const path of commonPaths) {
        const filePath = join(searchDir, path)
        if (existsSync(filePath) && (await checkFileForImport(filePath))) {
            return filePath
        }
    }

    // 2. Slow path: glob with sensible exclusions
    const cssFiles = await glob("**/*.{css,pcss,postcss}", {
        cwd: searchDir,
        ignore: [
            "node_modules/**",
            "dist/**",
            ".next/**",
            ".git/**",
            "build/**",
            ".cache/**",
            "out/**",
        ],
    })

    for (const file of cssFiles) {
        const filePath = join(searchDir, file)
        if (await checkFileForImport(filePath)) {
            return filePath
        }
    }
    return null
}
