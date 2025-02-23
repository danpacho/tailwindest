#!/usr/bin/env node

import { Command } from "commander"
import { TailwindTypeGenerator, CSSAnalyzer } from "./generator"
import { TailwindCompiler } from "./internal"
import { TypeSchemaGenerator } from "./type_tools"

import { existsSync } from "fs"
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

import pkg from "package.json"

const programVersion = pkg.version

const logger = new Logger({ name: "create-tailwind-type" })

const program = new Command()

program
    .name("create-tailwind-type")
    .description("CLI tool to generate Tailwind CSS types")
    .version(programVersion)

program
    .option("--base <path>", "Base directory for tailwind files")
    .option("--filename <filename>", "Type filename", "tailwind.ts")
    .option("--use-docs", "Enable useDocs option", false)
    .option("--use-exact-variants", "Enable exact variant generation", false)
    .option("--use-arbitrary-value", "Enable arbitrary value generation", false)
    .option("--use-soft-variants", "Enable soft variant generation", true)
    .option(
        "--use-string-kind-variants-only",
        "Enable string kind variants only",
        false
    )
    .option(
        "--use-optional-property",
        "Enable optional property generation",
        false
    )
    .action(
        async (options: {
            base?: string
            filename: string
            useDocs: boolean
            useExactVariants: boolean
            useArbitraryValue: boolean
            useSoftVariants: boolean
            useOptionalProperty: boolean
            useStringKindVariantsOnly: boolean
        }) => {
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
                    useDocs: !!options.useDocs,
                    useExactVariants: options.useExactVariants,
                    useArbitraryValue: options.useArbitraryValue,
                    useSoftVariants: options.useSoftVariants,
                    useStringKindVariantsOnly:
                        options.useStringKindVariantsOnly,
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
        }
    )

program.parse(process.argv)
