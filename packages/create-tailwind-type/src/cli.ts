#!/usr/bin/env node

import { Command } from "commander"
import { TailwindTypeGenerator, CSSAnalyzer } from "./generator"
import { TailwindCompiler } from "./internal"
import { TypeSchemaGenerator } from "./type_tools"
import { existsSync } from "fs"
import { resolve } from "path"
import { Logger } from "./logger"
import * as p from "@clack/prompts"
import pc from "picocolors"
import pkg from "../package.json"
import { findTailwindCSSRoot } from "./internal/discovery"
import {
    getTailwindVersion,
    isVersionSufficient,
    resolveTailwindNodeDir,
} from "./internal/resolution"

const programVersion = pkg.version
const logger = new Logger({ name: "create-tailwind-type" })

async function runTUI() {
    p.intro(
        pc.bgCyan(pc.black(` Tailwindest Type Generator v${programVersion} `))
    )

    const tailwindCSSFileRoot = await findTailwindCSSRoot(process.cwd())
    if (tailwindCSSFileRoot) {
        p.log.info(`Found Tailwind CSS root: ${pc.cyan(tailwindCSSFileRoot)}`)
    }

    const config = await p.group(
        {
            cssPath: () =>
                p.text({
                    message: "Path to your tailwind.css file?",
                    initialValue: tailwindCSSFileRoot || "tailwind.css",
                    placeholder: "./src/tailwind.css",
                    validate: (value) => {
                        if (!value) return "CSS path is required"
                    },
                }),
            filename: () =>
                p.text({
                    message: "Output filename for generated types?",
                    initialValue: "tailwind.ts",
                    placeholder: "tailwind.ts",
                }),
            options: () =>
                p.multiselect({
                    message: "Which features would you like to enable?",
                    options: [
                        {
                            value: "docs",
                            label: "Documentation",
                            hint: "recommended",
                        },
                        {
                            value: "arbitrary",
                            label: "Arbitrary Values",
                            hint: "recommended",
                        },
                        {
                            value: "arbitraryVariant",
                            label: "Arbitrary Variants",
                            hint: "data-[...], [&...]",
                        },
                        {
                            value: "soft",
                            label: "Soft Variants",
                            hint: "flexible completion",
                        },
                    ],
                    initialValues: ["docs", "arbitrary", "soft"],
                }),
            advanced: () =>
                p.multiselect({
                    message: "Advanced options (leave empty for defaults)",
                    options: [
                        {
                            value: "optional",
                            label: "Optional Properties",
                            hint: "tw?: string",
                        },
                        {
                            value: "stringOnly",
                            label: "String-kind Variants Only",
                        },
                        { value: "noVariants", label: "Disable Variants" },
                    ],
                    initialValues: [],
                    required: false,
                }),
        },
        {
            onCancel: () => {
                p.cancel("Operation cancelled.")
                process.exit(0)
            },
        }
    )

    const s = p.spinner()
    s.start("Generating Tailwind types...")

    try {
        let tailwindNodeDir = await resolveTailwindNodeDir(
            config.cssPath as string
        )
        let tailwindVersion = getTailwindVersion(tailwindNodeDir)

        if (!isVersionSufficient(tailwindVersion)) {
            p.log.warn(
                `${pc.yellow(`Tailwind CSS v${tailwindVersion} detected.`)} ${pc.dim("create-tailwind-type requires v4.0.0+ for precise local type generation.")}`
            )
            p.log.info(
                `${pc.cyan("Falling back to internal Tailwind v4 engine")} to generate types.`
            )
            tailwindNodeDir = await resolveTailwindNodeDir(undefined, {
                skipLocal: true,
            })
        }

        const compiler = new TailwindCompiler({
            cssRoot: config.cssPath as string,
            base: tailwindNodeDir,
        })

        const cssAnalyzer = new CSSAnalyzer()
        const schemaGenerator = new TypeSchemaGenerator()

        const selectedOptions = config.options as string[]
        const advancedOptions = config.advanced as string[]

        const generator = new TailwindTypeGenerator({
            compiler,
            cssAnalyzer,
            generator: schemaGenerator,
        }).setGenOptions({
            useDocs: selectedOptions.includes("docs"),
            useExactVariants: !selectedOptions.includes("soft"),
            useArbitraryValue: selectedOptions.includes("arbitrary"),
            useSoftVariants: selectedOptions.includes("soft"),
            useStringKindVariantsOnly: advancedOptions.includes("stringOnly"),
            useOptionalProperty: advancedOptions.includes("optional"),
            disableVariants: advancedOptions.includes("noVariants"),
            useArbitraryVariant: selectedOptions.includes("arbitraryVariant"),
        })

        const fileRoot = resolve(process.cwd(), config.filename as string)
        await generator.buildTypes({
            tailwind: fileRoot,
        })
        s.stop("Tailwind types generated successfully!")
        p.outro(
            pc.green(
                `✨ Successfully generated types at ${pc.cyan(config.filename as string)}`
            )
        )
    } catch (error) {
        s.stop("Generation failed.")
        p.log.error(error instanceof Error ? error.message : String(error))
        process.exit(1)
    }
}

const program = new Command()

program
    .name("create-tailwind-type")
    .description(
        "Generate TypeScript definitions for your Tailwind CSS configuration"
    )
    .version(programVersion)
    .option("-b, --base <path>", "Base directory for @tailwindcss/node")
    .option("-f, --filename <name>", "Output filename", "tailwind.ts")
    .option("-d, --docs", "Enable documentation comments", true)
    .option("-D, --no-docs", "Disable documentation comments")
    .option("-a, --arbitrary-value", "Enable arbitrary value support", true)
    .option("-A, --no-arbitrary-value", "Disable arbitrary value support")
    .option("-s, --soft-variants", "Enable soft variant generation", true)
    .option("-S, --no-soft-variants", "Disable soft variant generation")
    .option(
        "-k, --string-kind-variants-only",
        "Use string-kind variants only",
        false
    )
    .option("-o, --optional-property", "Use optional properties", false)
    .option("-N, --disable-variants", "Disable variant generation", false)
    .option(
        "-v, --arbitrary-variant",
        "Enable arbitrary variant support",
        false
    )
    .action(async (opts) => {
        // If no arguments provided and not in non-interactive mode, run TUI
        if (Object.keys(program.opts()).length === 0) {
            await runTUI()
            return
        }

        const tailwindCSSFileRoot = await findTailwindCSSRoot(process.cwd())

        let tailwindNodeDir = await resolveTailwindNodeDir(
            opts.base || tailwindCSSFileRoot || undefined
        )
        let tailwindVersion = getTailwindVersion(tailwindNodeDir)

        if (!isVersionSufficient(tailwindVersion)) {
            logger.warn(
                `Tailwind CSS v${tailwindVersion} detected. ${pc.dim("Requires v4.0.0+ for precise local types.")}`
            )
            logger.info(
                `Using ${pc.cyan("internal Tailwind v4 engine")} as a fallback.`
            )
            tailwindNodeDir = await resolveTailwindNodeDir(undefined, {
                skipLocal: true,
            })
        }

        const compiler = new TailwindCompiler({
            cssRoot: tailwindCSSFileRoot || "tailwind.css",
            base: tailwindNodeDir,
        })

        const cssAnalyzer = new CSSAnalyzer()
        const schemaGenerator = new TypeSchemaGenerator()

        const generator = new TailwindTypeGenerator({
            compiler,
            cssAnalyzer,
            generator: schemaGenerator,
        }).setGenOptions({
            useDocs: opts.docs,
            useExactVariants: !opts.softVariants,
            useArbitraryValue: opts.arbitraryValue,
            useSoftVariants: opts.softVariants,
            useStringKindVariantsOnly: opts.stringKindVariantsOnly,
            useOptionalProperty: opts.optionalProperty,
            disableVariants: opts.disableVariants,
            useArbitraryVariant: opts.arbitraryVariant,
        })

        const fileRoot = resolve(process.cwd(), opts.filename)
        await generator.buildTypes({
            tailwind: fileRoot,
        })
    })

program.parse(process.argv)
