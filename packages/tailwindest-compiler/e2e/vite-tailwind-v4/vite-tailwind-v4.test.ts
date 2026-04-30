import fs from "node:fs/promises"
import path from "node:path"
import { build } from "vite"
import { describe, expect, it } from "vitest"
import viteConfig from "./vite.config"
import type { TailwindestDebugManifest } from "../../src/debug/debug_manifest"
import { createCompilerContext } from "../../src/vite/context"
import { createHotUpdateHandler } from "../../src/vite/hmr"

const fixtureRoot = path.resolve(__dirname)
const srcRoot = path.join(fixtureRoot, "src")
const mainFile = path.join(srcRoot, "main.ts")
const compiledFile = path.join(srcRoot, "compiled-entry.ts")
const cssFile = path.join(srcRoot, "style.css")

const expectedCandidates = [
    "bg-[rgb(10_20_30)]",
    "bg-black",
    "bg-blue-50",
    "bg-red-50",
    "bg-slate-50",
    "bg-white",
    "border",
    "dark:bg-red-900",
    "dark:hover:bg-red-950",
    "dark:md:hover:bg-sky-600",
    "flex",
    "font-semibold",
    "gap-2",
    "inline-flex",
    "items-center",
    "p-2",
    "p-4",
    "px-2",
    "px-4",
    "px-6",
    "py-2",
    "rounded-md",
    "text-blue-700",
    "text-blue-900",
    "text-emerald-600",
    "text-gray-700",
    "text-green-600",
    "text-red-600",
    "text-red-700",
    "text-red-900",
    "text-slate-950",
    "text-sm",
    "text-white",
    "underline",
]

describe("Vite + Tailwind v4 manifest bridge", () => {
    it("builds CSS, JS, maps, and debug trace artifacts for the full compiler fixture", async () => {
        await fs.rm(path.join(fixtureRoot, "dist"), {
            recursive: true,
            force: true,
        })
        await fs.rm(path.join(fixtureRoot, ".tailwindest"), {
            recursive: true,
            force: true,
        })

        await build({
            ...viteConfig,
            configFile: false,
        })

        const assets = await fs.readdir(path.join(fixtureRoot, "dist/assets"))
        const cssAsset = assets.find((asset) => asset.endsWith(".css"))
        const jsAsset = assets.find(
            (asset) =>
                asset.startsWith("app-") &&
                asset.endsWith(".js") &&
                !asset.endsWith(".js.map")
        )
        const compiledAsset = assets.find(
            (asset) =>
                asset.startsWith("compiled-") &&
                asset.endsWith(".js") &&
                !asset.endsWith(".js.map")
        )
        const jsMapAsset = assets.find((asset) => asset.endsWith(".js.map"))
        expect(cssAsset).toBeTypeOf("string")
        expect(jsAsset).toBeTypeOf("string")
        expect(compiledAsset).toBeTypeOf("string")
        expect(jsMapAsset).toBeTypeOf("string")
        const css = await fs.readFile(
            path.join(fixtureRoot, "dist/assets", cssAsset!),
            "utf8"
        )
        const js = await fs.readFile(
            path.join(fixtureRoot, "dist/assets", jsAsset!),
            "utf8"
        )
        const compiledJs = await fs.readFile(
            path.join(fixtureRoot, "dist/assets", compiledAsset!),
            "utf8"
        )
        const runtimeJs = js
        const debugManifest = JSON.parse(
            await fs.readFile(
                path.join(fixtureRoot, ".tailwindest/debug-manifest.json"),
                "utf8"
            )
        ) as TailwindestDebugManifest

        expect(debugManifest.candidates).toEqual(expectedCandidates)
        for (const candidate of debugManifest.candidates) {
            expect(css).toContain(cssSelector(candidate))
        }
        for (const token of [
            "PrimitiveStyler",
            "ToggleStyler",
            "RotaryStyler",
            "VariantsStyler",
        ]) {
            expect(js).not.toContain(token)
        }
        expect(runtimeJs).toMatch(/style:\w+=>/)
        for (const token of [
            "createTools",
            "style:",
            "toggle:",
            "rotary:",
            "variants:",
            "PrimitiveStyler",
            "ToggleStyler",
            "RotaryStyler",
            "VariantsStyler",
        ]) {
            expect(compiledJs).not.toContain(token)
        }
        expect(compiledJs).toContain("flex px-4 text-emerald-600 rounded-md")
        expect(debugManifest.candidates).not.toContain("bg-red-900")
        expect(debugManifest.candidates).not.toContain("bg-red-950")
        expect(css).toContain(cssSelector("dark:bg-red-900"))
        expect(css).toContain(cssSelector("dark:hover:bg-red-950"))
        expect(css).not.toContain(cssSelector("bg-red-900"))
        expect(css).not.toContain(cssSelector("bg-red-950"))
        assertManifestDiagnosticContract(debugManifest)

        const source = await fs.readFile(mainFile, "utf8")
        const context = createCompilerContext({
            root: fixtureRoot,
            command: "build",
            options: { debug: true, sourceMap: true },
            scanFiles: async () => [mainFile, cssFile],
            readFile: async (id) =>
                id === mainFile ? source : `@import "tailwindcss";`,
        })
        const transform = context.transformJs(source, mainFile)
        const manifest = context.getDebugManifest()
        const traceReplacement = manifest.files
            .find((file) => file.id === mainFile)
            ?.replacements.find((replacement) =>
                replacement.candidates.includes("px-4")
            )
        expect(traceReplacement).toBeTruthy()
        expect(traceReplacement?.fallback).toBe(false)
        expect(
            source.slice(
                traceReplacement!.originalSpan.start,
                traceReplacement!.originalSpan.end
            )
        ).toMatch(/tw\s*\.\s*style/)
        expect(transform.code).toContain(traceReplacement!.generatedText)
        expect(css).toContain(cssSelector("px-4"))
        expect(
            sourceMapHasTrace({
                map: transform.map!,
                originalCode: source,
                generatedCode: transform.code,
                generatedText: traceReplacement!.generatedText,
                originalStart: traceReplacement!.originalSpan.start,
            })
        ).toBe(true)
    })

    it("derives identical debug manifests for deterministic dev and build contexts", async () => {
        const files = {
            [mainFile]: await fs.readFile(mainFile, "utf8"),
            [compiledFile]: await fs.readFile(compiledFile, "utf8"),
            [cssFile]: await fs.readFile(cssFile, "utf8"),
        }
        const scanFiles = async () => Object.keys(files)
        const readFile = async (id: string) => files[id] ?? ""
        const serve = createCompilerContext({
            root: fixtureRoot,
            command: "serve",
            options: { debug: true, sourceMap: true },
            scanFiles,
            readFile,
        })
        const buildContext = createCompilerContext({
            root: fixtureRoot,
            command: "build",
            options: { debug: true, sourceMap: true },
            scanFiles,
            readFile,
        })

        await serve.preScan()
        await buildContext.preScan()

        expect(serve.getDebugManifest()).toEqual(
            buildContext.getDebugManifest()
        )
        expect(serve.getDebugManifest().candidates).toEqual(expectedCandidates)
    })

    it("updates live JS/CSS candidates and invalidates dependents during HMR-style updates", async () => {
        const context = createCompilerContext({
            root: fixtureRoot,
            command: "serve",
            options: { sourceMap: true },
        })
        const cssModule = { id: cssFile }
        const appModule = { id: mainFile }
        const importedModule = { id: path.join(srcRoot, "imported.ts") }
        const invalidated: string[] = []
        const server = {
            moduleGraph: {
                idToModuleMap: new Map([
                    [cssFile, cssModule],
                    [mainFile, appModule],
                    [importedModule.id, importedModule],
                ]),
                getModuleById: (id: string) =>
                    id === cssFile
                        ? cssModule
                        : id === mainFile
                          ? appModule
                          : id === importedModule.id
                            ? importedModule
                            : undefined,
                invalidateModule: (module: { id?: string | null }) => {
                    if (module.id) invalidated.push(module.id)
                },
            },
        }

        const original = [
            `import { importedStyle } from "./imported"`,
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `export const cls = tw.join("text-cyan-600", "px-4")`,
            `export const imported = tw.style(importedStyle).class()`,
        ].join("\n")
        const edited = original.replace("text-cyan-600", "text-cyan-700")
        const deleted = edited.replace(`, "px-4"`, "")

        context.registerCssEntry(cssFile)
        context.transformJs(original, mainFile)
        context.recordDependencies(mainFile, [importedModule.id])
        expect(
            context.transformCss(`@import "tailwindcss";`, cssFile).code
        ).toContain("text-cyan-600")

        const liveJs = context.transformJs(edited, mainFile)
        expect(liveJs.code).toContain("text-cyan-700")
        const liveCss = context.transformCss(
            `@import "tailwindcss";`,
            cssFile
        ).code
        expect(liveCss).toContain("text-cyan-700")
        expect(liveCss).not.toContain("text-cyan-600")

        context.transformJs(deleted, mainFile)
        const deletedCss = context.transformCss(
            `@import "tailwindcss";`,
            cssFile
        ).code
        expect(deletedCss).not.toContain("px-4")

        context.recordDependencies(mainFile, [importedModule.id])
        await createHotUpdateHandler(context)({
            file: importedModule.id,
            server,
            read: async () =>
                `export const importedStyle = { color: "text-fuchsia-700" }`,
        })
        expect(invalidated).toContain(mainFile)
    })
})

function cssSelector(candidate: string): string {
    return `.${candidate
        .replace(/\\/g, "\\\\")
        .replace(/:/g, "\\:")
        .replace(/\[/g, "\\[")
        .replace(/\]/g, "\\]")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)")}`
}

function assertManifestDiagnosticContract(manifest: {
    files: Array<{
        diagnostics?: Array<unknown>
    }>
}) {
    for (const file of manifest.files) {
        for (const diagnostic of file.diagnostics ?? []) {
            expect(diagnostic).toMatchObject({
                code: expect.any(String),
                severity: expect.stringMatching(/^(error|warning|info)$/),
                fallbackBehavior: expect.stringMatching(
                    /^(runtime-fallback|informational)$/
                ),
                file: expect.any(String),
                span: {
                    fileName: expect.any(String),
                    start: expect.any(Number),
                    end: expect.any(Number),
                },
                message: expect.any(String),
            })
        }
    }
}

function sourceMapHasTrace(input: {
    map: {
        sources: string[]
        mappings: string
    }
    originalCode: string
    generatedCode: string
    generatedText: string
    originalStart: number
}): boolean {
    expect(input.map.sources).toContain(mainFile)
    const generated = offsetToPosition(
        input.generatedCode,
        input.generatedCode.indexOf(input.generatedText)
    )
    const original = offsetToPosition(input.originalCode, input.originalStart)
    return decodeMappings(input.map.mappings).some(
        (mapping) =>
            mapping.generatedLine === generated.line &&
            mapping.generatedColumn === generated.column &&
            mapping.originalLine === original.line &&
            mapping.originalColumn === original.column
    )
}

function offsetToPosition(
    code: string,
    offset: number
): { line: number; column: number } {
    let line = 0
    let column = 0
    for (let index = 0; index < offset; index += 1) {
        if (code[index] === "\n") {
            line += 1
            column = 0
        } else {
            column += 1
        }
    }
    return { line, column }
}

function decodeMappings(mappings: string): Array<{
    generatedLine: number
    generatedColumn: number
    originalLine: number
    originalColumn: number
}> {
    let previousSource = 0
    let previousOriginalLine = 0
    let previousOriginalColumn = 0
    return mappings.split(";").flatMap((lineMappings, generatedLine) => {
        let previousGeneratedColumn = 0
        return lineMappings
            .split(",")
            .filter(Boolean)
            .map((segment) => {
                const values = decodeSegment(segment)
                previousGeneratedColumn += values[0] ?? 0
                previousSource += values[1] ?? 0
                previousOriginalLine += values[2] ?? 0
                previousOriginalColumn += values[3] ?? 0
                return {
                    generatedLine,
                    generatedColumn: previousGeneratedColumn,
                    originalLine: previousOriginalLine,
                    originalColumn: previousOriginalColumn,
                }
            })
    })
}

function decodeSegment(segment: string): number[] {
    const values: number[] = []
    let value = 0
    let shift = 0
    for (const char of segment) {
        let digit =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(
                char
            )
        const continuation = digit & 32
        digit &= 31
        value += digit << shift
        if (continuation) {
            shift += 5
            continue
        }
        const negative = value & 1
        values.push(negative ? -(value >> 1) : value >> 1)
        value = 0
        shift = 0
    }
    return values
}
