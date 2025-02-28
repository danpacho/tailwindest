#!/usr/bin/env node

import { Command } from "commander"
import { TailwindTypeGenerator, CSSAnalyzer } from "./generator"
import { TailwindCompiler } from "./internal"
import { TypeSchemaGenerator } from "./type_tools"
import { existsSync, readFileSync } from "fs"
import { join, dirname, resolve } from "path"
import { glob } from "glob"
import { readFile } from "fs/promises"
import { createRequire } from "module"
import { Logger } from "./logger"

async function checkFileForImport(filePath: string): Promise<boolean> {
    try {
        const content = await readFile(filePath, "utf-8")
        const kindOfTailwindV4 = [
            "@import 'tailwindcss'",
            '@import "tailwindcss"',
            "tailwindcss",
        ] as const
        return kindOfTailwindV4.some((v4) => content.includes(v4))
    } catch {
        return false
    }
}

async function findTailwindCSSRoot(searchDir: string): Promise<string | null> {
    const commonPaths = [
        "tailwind.css",
        "styles/tailwind.css",
        "css/tailwind.css",
        "src/tailwind.css",
        "src/styles/tailwind.css",
        "src/css/tailwind.css",
    ] as const

    for (const path of commonPaths) {
        const filePath = join(searchDir, path)
        if (existsSync(filePath) && (await checkFileForImport(filePath))) {
            return filePath
        }
    }

    const cssFiles = await glob("**/*.css", { cwd: searchDir })
    for (const file of cssFiles) {
        const filePath = join(searchDir, file)
        if (await checkFileForImport(filePath)) {
            return filePath
        }
    }
    return null
}

async function resolveTailwindNodeDir(): Promise<string> {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    try {
        const nodeModulesPath = join(
            __dirname,
            "..",
            "node_modules",
            "@tailwindcss",
            "node"
        )

        return nodeModulesPath
    } catch {
        const pattern = join(
            __dirname,
            "**",
            "node_modules",
            "@tailwindcss",
            "node"
        )
        const matches = await glob(pattern, { cwd: __dirname, absolute: true })
        if (matches.length > 0) {
            return matches[0]!
        }
        throw new Error(
            "Could not resolve @tailwindcss package. Please ensure it is installed or specify the --base option."
        )
    }
}

function getTailwindVersion(baseDir: string): string {
    try {
        const packageJsonPath = join(baseDir, "package.json")
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"))
        return packageJson.version || "0.0.0"
    } catch {
        throw new Error(
            "Could not read Tailwind CSS package.json to determine version."
        )
    }
}

function isVersionSufficient(
    version: string,
    minimum: string = "4.0.0"
): boolean {
    const [major, minor, patch] = version.split(".").map(Number)
    const [minMajor, minMinor, minPatch] = minimum.split(".").map(Number)
    if (major! > minMajor!) return true
    if (major! < minMajor!) return false
    if (minor! > minMinor!) return true
    if (minor! < minMinor!) return false
    return patch! >= minPatch!
}

import pkg from "../package.json"
import { fileURLToPath } from "url"
const programVersion = pkg.version
const logger = new Logger({ name: "create-tailwind-type" })

const program = new Command()

program
    .name("create-tailwind-type")
    .description(
        "CLI tool to generate Tailwind CSS types (requires Tailwind CSS v4 or higher)"
    )
    .version(programVersion)

program
    .option(
        "-b, --base <path>",
        "Base directory for Tailwind CSS files (defaults to the installed @tailwindcss package directory)."
    )
    .option(
        "-f, --filename <filename>",
        "Output filename for the generated types.",
        "tailwind.ts"
    )
    .option("-d, --docs", "Enable documentation in generated types", true)
    .option("-D --no-docs", "Disable documentation in generated types")
    .option("-a, --arbitrary-value", "Allow arbitrary value generation", true)
    .option("-A, --no-arbitrary-value", "Disable arbitrary value generation")
    .option("-s, --soft-variants", "Enable soft variant generation", true)
    .option("-S --no-soft-variants", "Disable soft variant generation")
    .option(
        "-k, --string-kind-variants-only",
        "Use only string kind variants",
        false
    )
    .option("-o, --optional-property", "Generate optional properties", false)
    .action(async (opts) => {
        const {
            base,
            filename,
            docs,
            arbitraryValue,
            softVariants,
            stringKindVariantsOnly,
            optionalProperty,
        } = opts

        logger.box(
            `${logger.c.rgb(78, 185, 250).bold("create-tailwind-type")} ${logger.c.bold(`v${programVersion}`)}`,
            {
                borderStyle: "round",
                borderColor: "blue",
                padding: 0.75,
            }
        )

        const tailwindCSSFileRoot = await findTailwindCSSRoot(process.cwd())
        if (!tailwindCSSFileRoot) {
            throw new Error("Tailwind CSS file not found")
        }

        try {
            const tailwindNodeDir = base
                ? resolve(process.cwd(), base)
                : await resolveTailwindNodeDir()

            // Check Tailwind CSS version.
            const tailwindVersion = getTailwindVersion(tailwindNodeDir)
            if (!isVersionSufficient(tailwindVersion)) {
                logger.error(
                    `Tailwind CSS version ${tailwindVersion} detected. This tool requires Tailwind CSS v4.0.0 or higher. Please upgrade your Tailwind CSS installation.`
                )
                process.exit(1)
            }

            const compiler = new TailwindCompiler({
                cssRoot: tailwindCSSFileRoot,
                base: tailwindNodeDir,
            })

            const cssAnalyzer = new CSSAnalyzer()
            const schemaGenerator = new TypeSchemaGenerator()

            const generator = new TailwindTypeGenerator({
                compiler,
                cssAnalyzer,
                generator: schemaGenerator,
            }).setGenOptions({
                useDocs: docs,
                useExactVariants: !softVariants,
                useArbitraryValue: arbitraryValue,
                useSoftVariants: softVariants,
                useStringKindVariantsOnly: stringKindVariantsOnly,
                useOptionalProperty: optionalProperty,
            })

            const fileRoot = `${process.cwd()}/${filename}`
            await generator.buildTypes({
                tailwind: fileRoot,
            })
        } catch (error) {
            logger.error("Error occurred.")
            console.error(error)
            process.exit(1)
        }
    })

program.parse(process.argv)
