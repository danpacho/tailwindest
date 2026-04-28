#!/usr/bin/env node
import { Command } from "commander"
import path from "path"
import fs from "fs/promises"
import * as p from "@clack/prompts"
import pc from "picocolors"
import { transform } from "./index"
import type { CssTransformerOutputMode } from "./context/output_mode"
import {
    TailwindTypeGenerator,
    TailwindCompiler,
    CSSAnalyzer,
    TypeSchemaGenerator,
    Logger,
} from "create-tailwind-type"

const program = new Command()
const logger = new Logger({ name: "css-transformer" })

async function findTailwindestDefinition(
    startDir: string
): Promise<{ path: string; identifier: string } | null> {
    const searchFiles = [
        "tailwind.ts",
        "src/tailwind.ts",
        "src/styles/tailwind.ts",
    ]
    for (const file of searchFiles) {
        const fullPath = path.resolve(startDir, file)
        try {
            const content = await fs.readFile(fullPath, "utf-8")
            if (content.includes("CreateTailwindest")) {
                const match = content.match(/export const (\w+) = createTools/)
                return {
                    path: file,
                    identifier: match ? match[1] || "tw" : "tw",
                }
            }
        } catch {
            continue
        }
    }
    return null
}

async function runTUI(
    defaults: { outputMode?: CssTransformerOutputMode } = {}
) {
    p.intro(pc.bgCyan(pc.black(" Tailwindest CSS Transformer ")))

    const detectedDef = await findTailwindestDefinition(process.cwd())

    const config = await p.group(
        {
            targetPath: () =>
                p.text({
                    message: "Where is the file or directory to transform?",
                    placeholder: "./src",
                    validate: (value) => {
                        if (!value) return "Path is required"
                    },
                }),
            cssPath: () =>
                p.text({
                    message: "Path to your tailwind.css file?",
                    placeholder: "./src/tailwind.css",
                    initialValue: "tailwind.css",
                }),
            identifier: () =>
                p.text({
                    message: "What is your tailwindest identifier?",
                    placeholder: "tw",
                    initialValue: (detectedDef?.identifier ?? "tw") as string,
                }),
            modulePath: () =>
                p.text({
                    message: "What is the import path for tailwindest?",
                    placeholder: "~/tw",
                    initialValue: (detectedDef
                        ? `@/${detectedDef.path.replace(".ts", "")}`
                        : "~/tw") as string,
                }),
            outputMode: () =>
                p.select({
                    message: "Which Tailwindest output mode should be used?",
                    options: [
                        {
                            value: "auto",
                            label: "Auto",
                            hint: "recommended",
                        },
                        {
                            value: "runtime",
                            label: "Runtime",
                            hint: "CreateTailwindest",
                        },
                        {
                            value: "compiled",
                            label: "Compiled",
                            hint: "CreateCompiledTailwindest",
                        },
                    ],
                    initialValue: defaults.outputMode ?? "auto",
                }),
            walkers: () =>
                p.multiselect({
                    message: "Which walkers would you like to enable?",
                    options: [
                        {
                            value: "cva",
                            label: "CvaWalker (cva() calls)",
                            hint: "recommended",
                        },
                        {
                            value: "cn",
                            label: "CnWalker (cn(), clsx() calls)",
                            hint: "recommended",
                        },
                        {
                            value: "classname",
                            label: "ClassNameWalker (JSX className)",
                            hint: "recommended",
                        },
                    ],
                    initialValues: ["cva", "cn", "classname"],
                }),
            dryRun: () =>
                p.confirm({
                    message: "Dry run? (No files will be overwritten)",
                    initialValue: false,
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
    s.start("Initializing Tailwind engine...")

    try {
        const absoluteTargetPath = path.resolve(
            process.cwd(),
            config.targetPath as string
        )
        const stats = await fs.stat(absoluteTargetPath)

        const absoluteCssPath = path.resolve(
            process.cwd(),
            config.cssPath as string
        )
        const compiler = new TailwindCompiler({
            cssRoot: absoluteCssPath,
            base: "node_modules/tailwindcss",
        })
        const cssAnalyzer = new CSSAnalyzer()
        const schemaGenerator = new TypeSchemaGenerator()

        const storePath = path.join(process.cwd(), ".tailwindest/store.json")
        await fs.mkdir(path.dirname(storePath), { recursive: true })

        const generator = new TailwindTypeGenerator({
            compiler,
            cssAnalyzer,
            generator: schemaGenerator,
            storeRoot: storePath,
        }).setGenOptions({
            useDocs: true,
            useExactVariants: false,
            useArbitraryValue: true,
            useSoftVariants: true,
            useStringKindVariantsOnly: false,
            useOptionalProperty: false,
            disableVariants: false,
            useArbitraryVariant: true,
        })

        await generator.init()
        const resolver = generator.createPropertyResolver()
        s.stop("Tailwind engine initialized.")

        // Process Files
        const files: string[] = []
        if (stats.isDirectory()) {
            const readDir = async (dir: string) => {
                const entries = await fs.readdir(dir, { withFileTypes: true })
                for (const entry of entries) {
                    const res = path.resolve(dir, entry.name)
                    if (entry.isDirectory()) {
                        if (
                            entry.name !== "node_modules" &&
                            entry.name !== "dist"
                        ) {
                            await readDir(res)
                        }
                    } else if (/\.(tsx|ts|js|jsx)$/.test(entry.name)) {
                        files.push(res)
                    }
                }
            }
            await readDir(absoluteTargetPath)
        } else {
            files.push(absoluteTargetPath)
        }

        p.note(`Found ${files.length} files to process.`)

        for (const file of files) {
            const content = await fs.readFile(file, "utf-8")
            const result = await transform(content, {
                resolver,
                tailwindestIdentifier: config.identifier as string,
                tailwindestModulePath: config.modulePath as string,
                outputMode: config.outputMode as CssTransformerOutputMode,
                projectRoot: process.cwd(),
                sourcePath: file,
                walkers: config.walkers as any,
            })

            if (config.dryRun) {
                // In TUI mode, dry run might be too verbose for all files
            } else {
                await fs.writeFile(file, result.code, "utf-8")
            }

            if (result.diagnostics.length > 0) {
                result.diagnostics.forEach((d) => {
                    if (d.level === "error") {
                        p.log.error(
                            `[${d.walkerName}] ${d.message} in ${path.relative(process.cwd(), file)}`
                        )
                    }
                })
            }
        }

        p.outro(
            pc.green(
                `✨ Transformation complete! Processed ${files.length} files.`
            )
        )
    } catch (error) {
        s.stop("Initialization failed.")
        p.log.error(error instanceof Error ? error.message : String(error))
        process.exit(1)
    }
}

program
    .name("tailwindest-transform")
    .description(
        "Transform Tailwind CSS class strings to tailwindest nested objects"
    )
    .argument(
        "[path]",
        "Path to file or directory to transform (triggers TUI if omitted)"
    )
    .option("-c, --css <path>", "Path to tailwind.css file", "tailwind.css")
    .option("-i, --identifier <name>", "Tailwindest identifier", "tw")
    .option("-m, --module <path>", "Tailwindest module path", "~/tw")
    .option(
        "-d, --dry-run",
        "Print transformed code without writing to file",
        false
    )
    .option("--mode <mode>", "Output mode: auto, runtime, or compiled", "auto")
    .action(async (targetPath, options) => {
        const outputMode = normalizeOutputMode(options.mode)
        if (!targetPath) {
            await runTUI({ outputMode })
            return
        }

        await runTUI({ outputMode })
    })

program.parse()

function normalizeOutputMode(mode: string): CssTransformerOutputMode {
    if (mode === "runtime" || mode === "compiled" || mode === "auto") {
        return mode
    }

    throw new Error(`Invalid output mode: ${mode}`)
}
