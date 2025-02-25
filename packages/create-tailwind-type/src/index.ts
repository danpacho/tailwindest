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
        return content.includes('@import "tailwindcss";')
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

async function resolveTailwindCssDir(): Promise<string> {
    try {
        const require = createRequire(import.meta.url)
        const packageJsonPath = require.resolve("@tailwindcss/package.json")
        return dirname(packageJsonPath)
    } catch {
        const startDir = process.cwd()
        const pattern = join(startDir, "**", "node_modules", "@tailwindcss")
        const matches = await glob(pattern, { cwd: startDir, absolute: true })

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
        const packageJsonPath = join(baseDir, "node", "package.json")
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"))
        return packageJson.version || "0.0.0" // Fallback to 0.0.0 if version is missing
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

import pkg from "package.json"

const programVersion = pkg.version
const logger = new Logger({ name: "create-tailwind-type" })

const program = new Command()

program
    .name("create-tailwind-type")
    .description(
        "CLI tool to generate Tailwind CSS types (requires Tailwind CSS v4 or higher)"
    )
    .version(programVersion)
    .option("-b, --base <path>", "Base directory for Tailwind files")
    .option("-f, --filename <filename>", "Output type filename", "tailwind.ts")
    .option("-d, --use-docs", "Generate with documentation", true)
    .option("-D, --no-docs", "Disable documentation")
    .option("-e, --use-exact-variants", "Use exact variant generation", false)
    .option(
        "-a, --use-arbitrary-value",
        "Allow arbitrary value generation",
        true
    )
    .option("-A, --no-arbitrary-value", "Disallow arbitrary value generation")
    .option("-s, --use-soft-variants", "Enable soft variant generation", true)
    .option("-S, --no-soft-variants", "Disable soft variant generation")
    .option(
        "-k, --use-string-kind-variants-only",
        "Use string kind variants only",
        false
    )
    .option(
        "-o, --use-optional-property",
        "Generate optional properties",
        false
    )
    .action(async (baseOption) => {
        const options = {
            base: baseOption.base,
            filename: baseOption.filename,
            useDocs: baseOption.useDocs && !baseOption.noDocs,
            useExactVariants: baseOption.useExactVariants,
            useArbitraryValue:
                baseOption.useArbitraryValue && !baseOption.noArbitraryValue,
            useSoftVariants:
                baseOption.useSoftVariants && !baseOption.noSoftVariants,
            useStringKindVariantsOnly: baseOption.useStringKindVariantsOnly,
            useOptionalProperty: baseOption.useOptionalProperty,
        }

        logger.box(
            `${logger.c.rgb(78, 185, 250).bold(`create-tailwind-type`)} ${logger.c.bold(`v${programVersion}`)}`,
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
            const baseDir = options.base
                ? resolve(process.cwd(), options.base)
                : await resolveTailwindCssDir()

            // Check Tailwind CSS version
            const tailwindVersion = getTailwindVersion(baseDir)
            if (!isVersionSufficient(tailwindVersion)) {
                logger.error(
                    `Tailwind CSS version ${tailwindVersion} detected. This tool requires Tailwind CSS v4.0.0 or higher. Please upgrade your Tailwind CSS installation.`
                )
                process.exit(1)
            }

            const compiler = new TailwindCompiler({
                cssRoot: tailwindCSSFileRoot,
                base: baseDir,
            })

            const cssAnalyzer = new CSSAnalyzer()
            const schemaGenerator = new TypeSchemaGenerator()

            const generator = new TailwindTypeGenerator({
                compiler,
                cssAnalyzer,
                generator: schemaGenerator,
            }).setGenOptions({
                useDocs: options.useDocs,
                useExactVariants: options.useExactVariants,
                useArbitraryValue: options.useArbitraryValue,
                useSoftVariants: options.useSoftVariants,
                useStringKindVariantsOnly: options.useStringKindVariantsOnly,
                useOptionalProperty: options.useOptionalProperty,
            })

            const fileRoot = `${process.cwd()}/${options.filename}`
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
