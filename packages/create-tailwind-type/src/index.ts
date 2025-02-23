#!/usr/bin/env node

import { Command } from "commander"
import { TailwindTypeGenerator, CSSAnalyzer } from "./generator"
import { TailwindCompiler } from "./internal"
import { TypeSchemaGenerator } from "./type_tools"

const program = new Command()

program
    .name("create-tailwind-type")
    .description("CLI tool to generate Tailwind CSS types")
    .version("1.0.0")

program
    .option(
        "--base <path>",
        "Base directory for tailwind files",
        "node_modules/@tailwindcss"
    )
    .option("--filename <filename>", "Type filename", "tailwind.ts") // default false; use --use-docs flag to enable
    .option("--use-docs", "Enable useDocs option", false) // default false; use --use-docs flag to enable
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
    .action(async (options) => {
        try {
            const compiler = new TailwindCompiler({
                cssRoot: options.cssRoot,
                base: options.base,
            })

            const cssAnalyzer = new CSSAnalyzer()
            const schemaGenerator = new TypeSchemaGenerator()

            const generator = new TailwindTypeGenerator({
                compiler,
                cssAnalyzer,
                generator: schemaGenerator,
                storeRoot: options.storeRoot,
            }).setGenOptions({
                useDocs: !!options.useDocs,
                useExactVariants: options.useExactVariants,
                useArbitraryValue: options.useArbitraryValue,
                useSoftVariants: options.useSoftVariants,
                useStringKindVariantsOnly: options.useStringKindVariantsOnly,
                useOptionalProperty: options.useOptionalProperty,
            })

            await generator.buildTypes({
                tailwind: options.filename,
            })
        } catch (error) {
            process.exit(1)
        }
    })

program.parse(process.argv)
