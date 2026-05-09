#!/usr/bin/env node
import { Command } from "commander"
import { realpathSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import fs from "node:fs/promises"
import * as p from "@clack/prompts"
import pc from "picocolors"
import { transform } from "./index"
import type { CssTransformerOutputMode } from "./context/output_mode"
import {
    TailwindTypeGenerator,
    TailwindCompiler,
    CSSAnalyzer,
    TypeSchemaGenerator,
    resolveTailwindNodeDir,
    getTailwindVersion,
    isVersionSufficient,
} from "create-tailwind-type"
import {
    resolveCssTransformerCliConfig,
    resolveTailwindestModulePath,
    type ResolveCssTransformerCliConfigInput,
} from "./cli/auto_discovery"

interface CliOptions {
    css?: string
    identifier?: string
    module?: string
    mode?: string
    dryRun?: boolean
}

export interface RunTransformInput {
    cwd?: string
    targetPath: string
    options: CliOptions
}

const program = new Command()

async function runTUI(options: CliOptions = {}, cwd = process.cwd()) {
    p.intro(pc.bgCyan(pc.black(" Tailwindest CSS Transformer ")))

    const promptResult = await p.group(
        {
            targetPath: () =>
                p.text({
                    message: "Where is the file or directory to transform?",
                    placeholder: "./src",
                    validate: (value) => {
                        if (!value) return "Path is required"
                    },
                }),
        },
        {
            onCancel: () => {
                p.cancel("Operation cancelled.")
                process.exit(0)
            },
        }
    )

    await runTransform({
        cwd,
        targetPath: promptResult.targetPath as string,
        options,
    })
}

export async function runTransform(input: RunTransformInput) {
    const cwd = path.resolve(input.cwd ?? process.cwd())
    const outputMode =
        input.options.mode === undefined
            ? undefined
            : normalizeOutputMode(input.options.mode)

    const configInput: ResolveCssTransformerCliConfigInput = {
        cwd,
        targetPath: input.targetPath,
    }
    if (input.options.css !== undefined) configInput.cssPath = input.options.css
    if (input.options.identifier !== undefined) {
        configInput.tailwindestIdentifier = input.options.identifier
    }
    if (input.options.module !== undefined) {
        configInput.tailwindestModulePath = input.options.module
    }
    if (outputMode !== undefined) configInput.outputMode = outputMode
    if (input.options.dryRun !== undefined) {
        configInput.dryRun = input.options.dryRun
    }

    const config = await resolveCssTransformerCliConfig(configInput)

    for (const warning of config.warnings) {
        p.log.warn(warning)
    }

    p.note(
        [
            `Tailwind CSS: ${path.relative(cwd, config.cssPath)}`,
            `Tailwindest: ${config.tailwindestIdentifier} from ${config.tailwindestModulePath}`,
            `Mode: ${config.outputMode}`,
            `Walkers: ${config.walkers.join(", ")}`,
            `Dry run: ${config.dryRun}`,
        ].join("\n"),
        "Detected config"
    )

    const s = p.spinner()
    s.start("Initializing Tailwind engine...")

    let initialized:
        | {
              stats: Awaited<ReturnType<typeof fs.stat>>
              resolver: Awaited<ReturnType<typeof createTailwindResolver>>
          }
        | undefined
    try {
        initialized = {
            stats: await fs.stat(config.targetPath),
            resolver: await createTailwindResolver(config.cssPath),
        }
        s.stop("Tailwind engine initialized.")
    } catch (error) {
        s.stop("Initialization failed.")
        throw error
    }

    const { stats, resolver } = initialized!

    const files = stats.isDirectory()
        ? await collectSourceFiles(config.targetPath)
        : [config.targetPath]

    p.note(`Found ${files.length} files to process.`)

    for (const file of files) {
        const content = await fs.readFile(file, "utf-8")
        const tailwindestModulePath =
            input.options.module !== undefined ||
            config.tailwindestToolsPath === undefined
                ? config.tailwindestModulePath
                : await resolveTailwindestModulePath({
                      cwd,
                      sourcePath: file,
                      toolsPath: config.tailwindestToolsPath,
                  })
        const result = await transform(content, {
            resolver,
            tailwindestIdentifier: config.tailwindestIdentifier,
            tailwindestModulePath,
            outputMode: config.outputMode,
            projectRoot: cwd,
            sourcePath: file,
            walkers: config.walkers,
        })

        if (!config.dryRun) {
            await fs.writeFile(file, result.code, "utf-8")
        }

        for (const diagnostic of result.diagnostics) {
            if (diagnostic.level === "error") {
                p.log.error(
                    `[${diagnostic.walkerName}] ${diagnostic.message} in ${path.relative(cwd, file)}`
                )
            }
        }
    }

    p.outro(
        pc.green(`Transformation complete. Processed ${files.length} files.`)
    )
}

async function createTailwindResolver(cssPath: string) {
    let tailwindNodeDir = await resolveTailwindNodeDir(cssPath)
    const tailwindVersion = getTailwindVersion(tailwindNodeDir)

    if (!isVersionSufficient(tailwindVersion)) {
        const warning = `Tailwind CSS v${tailwindVersion} detected. Requires v4.0.0+ for precise local transforms.`
        p.log.warn(
            `${pc.yellow(warning)} ${pc.dim("Using internal Tailwind v4 engine.")}`
        )
        tailwindNodeDir = await resolveTailwindNodeDir(undefined, {
            skipLocal: true,
        })
    }

    const compiler = new TailwindCompiler({
        cssRoot: cssPath,
        base: tailwindNodeDir,
    })
    const cssAnalyzer = new CSSAnalyzer()
    const schemaGenerator = new TypeSchemaGenerator()

    const generator = new TailwindTypeGenerator({
        compiler,
        cssAnalyzer,
        generator: schemaGenerator,
    }).setGenOptions({
        useDocs: true,
        useExactVariants: false,
        useArbitraryValue: true,
        useSoftVariants: true,
        useStringKindVariantsOnly: false,
        useOptionalProperty: false,
        disableVariants: false,
    })

    await generator.init()
    return generator.createPropertyResolver()
}

async function collectSourceFiles(targetDir: string): Promise<string[]> {
    const files: string[] = []

    async function readDir(dir: string) {
        const entries = await fs.readdir(dir, { withFileTypes: true })
        for (const entry of entries) {
            const nextPath = path.resolve(dir, entry.name)
            if (entry.isDirectory()) {
                if (entry.name !== "node_modules" && entry.name !== "dist") {
                    await readDir(nextPath)
                }
                continue
            }

            if (/\.(tsx|ts|js|jsx)$/.test(entry.name)) {
                files.push(nextPath)
            }
        }
    }

    await readDir(targetDir)
    return files
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
    .option("-c, --css <path>", "Path to tailwind.css file")
    .option("-i, --identifier <name>", "Tailwindest identifier")
    .option("-m, --module <path>", "Tailwindest module path")
    .option("-d, --dry-run", "Print transformed code without writing to file")
    .option("--mode <mode>", "Output mode: auto or runtime.")
    .action(async (targetPath, options: CliOptions) => {
        try {
            if (!targetPath) {
                await runTUI(options)
                return
            }

            await runTransform({
                targetPath,
                options,
            })
        } catch (error) {
            p.log.error(error instanceof Error ? error.message : String(error))
            process.exit(1)
        }
    })

if (isDirectRun()) {
    program.parse(process.argv)
}

function normalizeOutputMode(mode: string): CssTransformerOutputMode {
    if (mode === "runtime" || mode === "auto") {
        return mode
    }

    throw new Error(`Invalid output mode: ${mode}`)
}

export function isDirectRun(
    entry = process.argv[1],
    moduleUrl = import.meta.url
): boolean {
    if (!entry) return false
    const modulePath = fileURLToPath(moduleUrl)

    try {
        return realpathSync(entry) === realpathSync(modulePath)
    } catch {
        return path.resolve(entry) === path.resolve(modulePath)
    }
}
