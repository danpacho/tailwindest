import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import * as ts from "typescript"
import { describe, expect, it, vi } from "vitest"
import { createTools } from "../../../../tailwindest/src/tools/create_tools"
import { compile, compileAsync } from "../../index"
import { optimizeVariants } from "../../core/variant_optimizer"
import { createCompilerContext } from "../context"
import { createHotUpdateHandler } from "../hmr"
import { tailwindest } from "../index"

function expectParsesAs(fileName: string, code: string): void {
    const output = ts.transpileModule(code, {
        fileName,
        reportDiagnostics: true,
        compilerOptions: {
            jsx: ts.JsxEmit.ReactJSX,
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ESNext,
        },
    })
    const errors =
        output.diagnostics?.filter(
            (item) => item.category === ts.DiagnosticCategory.Error
        ) ?? []

    expect(errors).toEqual([])
}

function evaluateModule<T extends Record<string, unknown>>(
    code: string,
    exportNames: Array<keyof T & string>
): T {
    const executable = code
        .replace(
            /import\s+\{\s*createTools\s*\}\s+from\s+["']tailwindest["'];?\n?/g,
            ""
        )
        .replace(/\bexport\s+const\s+/g, "const ")
        .replaceAll(" as const", "")

    return new Function(
        "createTools",
        `${executable}\nreturn { ${exportNames.join(", ")} };`
    )(createTools) as T
}

const tailwindCss = '@import "tailwindcss";'
const surfaceTailwindCss = `
@import "tailwindcss";
@custom-variant surface (&:where(.surface, .surface *));
`

describe("tailwindest Vite plugin", () => {
    it("returns transform and source pre plugins using Vite 8 object transform filters", () => {
        const plugins = tailwindest()

        expect(plugins.map((plugin) => plugin.name)).toEqual([
            "tailwindest:transform",
            "tailwindest:source",
        ])
        expect(plugins.every((plugin) => plugin.enforce === "pre")).toBe(true)
        expect(plugins[0]?.handleHotUpdate).toEqual(expect.any(Function))
        expect(plugins[0]?.watchChange).toEqual(expect.any(Function))
        expect(plugins[1]?.handleHotUpdate).toBeUndefined()
        expect(plugins[1]?.watchChange).toBeUndefined()
        expect(typeof plugins[0]?.transform).toBe("object")
        expect(plugins[0]?.transform).toMatchObject({
            filter: { id: expect.any(RegExp) },
            handler: expect.any(Function),
        })
        expect(plugins[1]?.transform).toMatchObject({
            filter: { id: expect.any(RegExp) },
            handler: expect.any(Function),
        })
    })

    it("connects Vite watchChange delete to CSS invalidation and updated CSS injection", async () => {
        const [transformPlugin, sourcePlugin] = tailwindest()
        const transform = transformPlugin.transform
        const source = sourcePlugin.transform
        const cssModule = { id: "/project/src/app.css" }
        const invalidated: string[] = []
        const server = {
            moduleGraph: {
                getModuleById: (id: string) =>
                    id === cssModule.id ? cssModule : undefined,
                invalidateModule: (module: { id?: string | null }) => {
                    if (module.id) {
                        invalidated.push(module.id)
                    }
                },
            },
        }

        transformPlugin.configResolved?.({ root: "/project", command: "serve" })
        await transformPlugin.configureServer?.(server)
        await transform.handler.call(
            {},
            `import { createTools } from "tailwindest"
             const tw = createTools()
             export const cls = tw.join("last-owner")`,
            "/project/src/app.tsx"
        )
        const before = await source.handler.call(
            {},
            `@import "tailwindcss";`,
            "/project/src/app.css"
        )
        expect(before?.code).toContain("last-owner")

        transformPlugin.watchChange?.call({}, "/project/src/app.tsx", {
            event: "delete",
        })
        const after = await source.handler.call(
            {},
            `@import "tailwindcss";`,
            "/project/src/app.css"
        )

        expect(after?.code).not.toContain("last-owner")
        expect(invalidated).toEqual(["/project/src/app.css"])
    })

    it("pre-scans source files so CSS injection is populated before Tailwind transforms CSS", async () => {
        const context = createCompilerContext({
            root: "/project",
            options: {},
            readFile: async (id) =>
                id.endsWith("app.tsx")
                    ? `import { createTools } from "tailwindest"
                       const tw = createTools()
                       const tone = { primary: "text-emerald-600" }
                       export const cls = tw.join("px-4", tone.primary)`
                    : `@import "tailwindcss";`,
            scanFiles: async () => [
                "/project/src/app.tsx",
                "/project/src/app.css",
            ],
        })

        await context.preScan()
        const css = context.transformCss(
            `@import "tailwindcss";`,
            "/project/src/app.css"
        )

        expect(context.getManifestCandidates()).toEqual([
            "px-4",
            "text-emerald-600",
        ])
        expect(css.code).toContain(`@source inline("px-4 text-emerald-600");`)
    })

    it("keeps unsupported Vite calls as runtime fallbacks", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `declare const dynamicClass: string`,
            `export const cls = tw.join("px-4", dynamicClass)`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(code, "/project/src/default.ts")

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(context.getDebugManifest()).toMatchObject({
            files: [
                {
                    diagnostics: expect.arrayContaining([
                        expect.objectContaining({
                            code: "UNSUPPORTED_DYNAMIC_VALUE",
                            fallbackBehavior: "runtime-fallback",
                        }),
                    ]),
                },
            ],
        })
    })

    it("keeps unsupported programmatic compile() calls as runtime fallbacks", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `declare const dynamicClass: string`,
            `export const cls = tw.join("px-4", dynamicClass)`,
        ].join("\n")

        const result = compile(code, { fileName: "/project/src/default.ts" })

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(result.candidates).toContain("px-4")
        expect(result.diagnostics).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    code: "UNSUPPORTED_DYNAMIC_VALUE",
                    fallbackBehavior: "runtime-fallback",
                }),
            ])
        )
    })

    it("compileAsync loads compiled variant metadata from cssSource", async () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `export const cls = tw.style({ surface: { color: "text-blue-500" } }).class()`,
        ].join("\n")

        const result = await compileAsync(code, {
            fileName: "/project/src/button.ts",
            cssSource: surfaceTailwindCss,
        })

        expect(result.changed).toBe(true)
        expect(result.code).toContain(`"surface:text-blue-500"`)
        expect([...new Set(result.candidates)]).toEqual([
            "surface:text-blue-500",
        ])
    })

    it("Vite loads compiled variants from CSS entries without generated tailwind.ts imports", async () => {
        const context = createCompilerContext({
            root: "/project",
            options: {},
        })
        await context.transformCssAsync(
            surfaceTailwindCss,
            "/project/src/app.css"
        )

        const result = context.transformJs(
            [
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `export const cls = tw.style({ surface: { color: "text-blue-500" } }).class()`,
            ].join("\n"),
            "/project/src/button.ts"
        )

        expect(result.changed).toBe(true)
        expect(result.code).toContain(`"surface:text-blue-500"`)
    })

    it("loads CSS variant metadata before the first JS transform when CSS transform has not run", async () => {
        const root = await fs.mkdtemp(
            path.join(os.tmpdir(), "tailwindest-vite-race-")
        )
        await fs.mkdir(path.join(root, "src"), { recursive: true })
        await fs.writeFile(path.join(root, "src/app.css"), surfaceTailwindCss)
        const [transformPlugin] = tailwindest()
        transformPlugin.configResolved?.({ root, command: "serve" })

        try {
            const result = await transformPlugin.transform.handler.call(
                {},
                [
                    `import { createTools } from "tailwindest"`,
                    `const tw = createTools()`,
                    `export const cls = tw.style({ surface: { color: "text-blue-500" } }).class()`,
                ].join("\n"),
                path.join(root, "src/button.ts")
            )

            expect(result?.code).toContain(`"surface:text-blue-500"`)
        } finally {
            await fs.rm(root, { recursive: true, force: true })
        }
    })

    it("reports missing compiled variant metadata instead of guessing default variants", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `export const cls = tw.style({ hover: { color: "text-blue-500" } }).class()`,
        ].join("\n")

        const result = compile(code, { fileName: "/project/src/button.ts" })

        expect(result.changed).toBe(false)
        expect(result.diagnostics).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    code: "MISSING_COMPILED_VARIANT_METADATA",
                }),
            ])
        )
    })

    it("injects not-inline exclusions for raw shorthand leaves unless another candidate owns them", async () => {
        const context = createCompilerContext({
            root: "/project",
            options: {
                debug: true,
            },
        })
        await context.transformCssAsync(tailwindCss, "/project/src/app.css")
        context.transformJs(
            `import { createTools } from "tailwindest"
             const tw = createTools()
             export const cls = tw.style({
                 dark: {
                     backgroundColor: "bg-red-900",
                     hover: { backgroundColor: "bg-red-950" },
                 },
                 backgroundColor: "bg-red-50",
             }).class()`,
            "/project/src/app.tsx"
        )

        const css = context.transformCss(
            `@import "tailwindcss";`,
            "/project/src/app.css"
        ).code

        expect(context.getManifestCandidates()).toEqual([
            "bg-red-50",
            "dark:bg-red-900",
            "dark:hover:bg-red-950",
        ])
        expect(context.getDebugManifest().excludedCandidates).toEqual([
            "bg-red-900",
            "bg-red-950",
        ])
        expect(css).toContain(`@source not inline("bg-red-900 bg-red-950");`)

        context.transformJs(
            `import { createTools } from "tailwindest"
             const tw = createTools()
             export const cls = tw.join("bg-red-900")`,
            "/project/src/explicit.tsx"
        )

        const nextCss = context.transformCss(
            `@import "tailwindcss";`,
            "/project/src/app.css"
        ).code

        expect(context.getDebugManifest().excludedCandidates).toEqual([
            "bg-red-950",
        ])
        expect(nextCss).toContain(`@source not inline("bg-red-950");`)
        expect(nextCss).not.toContain(`@source not inline("bg-red-900`)
    })

    it("injects the source bridge into Tailwind package CSS entries used by framework dev aggregators", async () => {
        const context = createCompilerContext({
            root: "/project",
            options: {
                debug: true,
            },
        })
        await context.transformCssAsync(
            `@layer theme, base, components, utilities;`,
            "/project/node_modules/tailwindcss/index.css"
        )
        context.transformJs(
            `import { createTools } from "tailwindest"
             const tw = createTools()
             export const cls = tw.style({
                 dark: { backgroundColor: "bg-red-900" },
                 backgroundColor: "bg-red-50",
             }).class()`,
            "/project/src/app.tsx"
        )

        const css = context.transformCss(
            `@layer theme, base, components, utilities;`,
            "/project/node_modules/tailwindcss/index.css"
        ).code

        expect(css).toContain(`@source inline("bg-red-50 dark:bg-red-900");`)
        expect(css).toContain(`@source not inline("bg-red-900");`)
    })

    it("returns compiled JS, source maps, and debug replacements for exact calls", () => {
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true, sourceMap: true },
        })
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `export const cls = tw.join("px-4", "py-2")`,
        ].join("\n")

        const result = context.transformJs(code, "/project/src/app.ts")
        const manifest = context.getDebugManifest()
        const originalSpan = {
            fileName: "/project/src/app.ts",
            start: code.indexOf(`tw.join`),
            end: code.indexOf(`tw.join`) + `tw.join("px-4", "py-2")`.length,
        }

        expect(result.code).toContain(`"px-4 py-2"`)
        expect(result.changed).toBe(true)
        expect(result.map?.sources).toEqual(["/project/src/app.ts"])
        expect(manifest.files[0]?.replacements).toEqual([
            {
                kind: "join",
                originalSpan,
                generatedText: `"px-4 py-2"`,
                candidates: ["px-4", "py-2"],
                candidateRecords: [
                    {
                        candidate: "px-4",
                        kind: "exact",
                        sourceSpan: originalSpan,
                    },
                    {
                        candidate: "py-2",
                        kind: "exact",
                        sourceSpan: originalSpan,
                    },
                ],
                status: "compiled",
                fallback: false,
            },
        ])
        expect(manifest.candidates).toEqual(["px-4", "py-2"])
        expect(manifest.candidateRecords).toEqual([
            {
                candidate: "px-4",
                kind: "exact",
                sourceSpan: originalSpan,
            },
            {
                candidate: "py-2",
                kind: "exact",
                sourceSpan: originalSpan,
            },
        ])
    })

    it("reports runtime fallback status and reason for unsupported dynamic Tailwindest calls", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `declare const dynamicClass: string`,
            `export const cls = tw.join("px-4", dynamicClass)`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(code, "/project/src/runtime.ts")
        const span = {
            fileName: "/project/src/runtime.ts",
            start: code.indexOf(`tw.join`),
            end:
                code.indexOf(`tw.join`) +
                `tw.join("px-4", dynamicClass)`.length,
        }
        const replacement = context.getDebugManifest().files[0]?.replacements[0]

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(replacement).toMatchObject({
            kind: "join",
            generatedText: "",
            candidates: ["px-4"],
            candidateRecords: [
                {
                    candidate: "px-4",
                    kind: "fallback-known",
                    sourceSpan: span,
                },
            ],
            status: "runtime-fallback",
            fallback: true,
            reason: expect.stringContaining("dynamicClass"),
        })
        expect(context.getDebugManifest().candidateRecords).toContainEqual({
            candidate: "px-4",
            kind: "fallback-known",
            sourceSpan: span,
        })
    })

    it("reports candidate-only status for stored styler discovery without claiming compilation", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `export const button = tw.style({ color: "text-blue-700" })`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(code, "/project/src/stored.ts")
        const span = {
            fileName: "/project/src/stored.ts",
            start: code.indexOf(`tw.style`),
            end:
                code.indexOf(`tw.style`) +
                `tw.style({ color: "text-blue-700" })`.length,
        }
        const replacement = context.getDebugManifest().files[0]?.replacements[0]

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(replacement).toMatchObject({
            kind: "style",
            generatedText: "",
            candidates: ["text-blue-700"],
            candidateRecords: [
                {
                    candidate: "text-blue-700",
                    kind: "fallback-known",
                    sourceSpan: span,
                },
            ],
            status: "candidate-only",
            fallback: false,
            reason: expect.stringContaining("no supported replacement"),
        })
    })

    it("reports one candidate-only entry for composed styler calls with full candidates", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `export const button = tw.style({ color: "text-blue-700" }).compose({ padding: "p-2" })`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(
            code,
            "/project/src/compose_candidate.ts"
        )
        const replacements =
            context.getDebugManifest().files[0]?.replacements ?? []

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(replacements).toHaveLength(1)
        expect(replacements[0]).toMatchObject({
            kind: "style",
            generatedText: "",
            candidates: ["p-2", "text-blue-700"],
            status: "candidate-only",
            fallback: false,
            reason: expect.stringContaining("no supported replacement"),
        })
        expect(
            replacements.filter(
                (replacement) =>
                    replacement.originalSpan.start ===
                        replacements[0]?.originalSpan.start &&
                    replacement.originalSpan.end ===
                        replacements[0]?.originalSpan.end
            )
        ).toHaveLength(1)
    })

    it("preserves fake tw.join calls instead of trusting the tw name", () => {
        const code = [
            "const tw = { join: (value: string) => `FAKE:${value}` }",
            `export const cls = tw.join("px-4")`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(code, "/project/src/fake-tw.ts")

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(context.getDebugManifest().files[0]?.replacements).toEqual([])
    })

    it("preserves fake tw.style chains instead of trusting the tw name", () => {
        const code = [
            `const tw = {`,
            "  style: (value: unknown) => ({ class: () => `FAKE:${JSON.stringify(value)}` }),",
            `}`,
            `export const cls = tw.style({ color: "text-red-500" }).class()`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(code, "/project/src/fake-style.ts")

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(context.getDebugManifest().files[0]?.replacements).toEqual([])
    })

    it("still replaces proven direct tw.join calls", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `export const cls = tw.join("px-4")`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(code, "/project/src/proven-tw.ts")

        expect(result.code).toContain(`"px-4"`)
        expect(result.changed).toBe(true)
        expect(context.getDebugManifest().files[0]?.replacements).toEqual([
            expect.objectContaining({
                kind: "join",
                generatedText: `"px-4"`,
                fallback: false,
            }),
        ])
    })

    it("still replaces proven direct non-tw tool identifiers", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tools = createTools()`,
            `export const cls = tools.join("px-4")`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(code, "/project/src/proven-tools.ts")

        expect(result.code).toContain(`"px-4"`)
        expect(result.changed).toBe(true)
        expect(context.getDebugManifest().files[0]?.replacements).toEqual([
            expect.objectContaining({
                kind: "join",
                generatedText: `"px-4"`,
                fallback: false,
            }),
        ])
    })

    it("still replaces imported proven tw with the same local name", () => {
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })
        context.transformJs(
            [
                `import { createTools } from "tailwindest"`,
                `export const tw = createTools()`,
            ].join("\n"),
            "/project/src/tools.ts"
        )
        const code = [
            `import { tw } from "./tools"`,
            `export const cls = tw.join("px-4")`,
        ].join("\n")

        const result = context.transformJs(code, "/project/src/app.ts")
        const appDebug = context
            .getDebugManifest()
            .files.find((file) => file.id === "/project/src/app.ts")

        expect(result.code).toContain(`"px-4"`)
        expect(result.changed).toBe(true)
        expect(appDebug?.replacements).toEqual([
            expect.objectContaining({
                kind: "join",
                generatedText: `"px-4"`,
                fallback: false,
            }),
        ])
    })

    it("falls back for imported runtime merger tw join and styler class calls", () => {
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })
        context.transformJs(
            [
                `import { createTools } from "tailwindest"`,
                `const runtimeMerger = (...classes) => classes[0] ?? ""`,
                `export const tw = createTools({ merger: runtimeMerger })`,
            ].join("\n"),
            "/project/src/tools.ts"
        )
        const code = [
            `import { tw } from "./tools"`,
            `export const joined = tw.join("px-2", "px-4")`,
            `export const styled = tw.style({ padding: "px-2" }).class("px-4")`,
        ].join("\n")

        const result = context.transformJs(code, "/project/src/app.ts")
        const appDebug = context
            .getDebugManifest()
            .files.find((file) => file.id === "/project/src/app.ts")

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(appDebug?.replacements).toEqual([
            expect.objectContaining({
                kind: "join",
                generatedText: "",
                fallback: true,
            }),
            expect.objectContaining({
                kind: "style",
                generatedText: "",
                fallback: true,
            }),
        ])
        expect(
            appDebug?.diagnostics.filter(
                (diagnostic) => diagnostic.code === "UNSUPPORTED_MERGER"
            )
        ).toHaveLength(2)
    })

    it("compiles imported no-merger tw join and styler class calls", () => {
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })
        context.transformJs(
            [
                `import { createTools } from "tailwindest"`,
                `export const tw = createTools()`,
            ].join("\n"),
            "/project/src/tools.ts"
        )
        const code = [
            `import { tw } from "./tools"`,
            `export const joined = tw.join("px-2", "px-4")`,
            `export const styled = tw.style({ padding: "px-2" }).class("px-4")`,
        ].join("\n")

        const result = context.transformJs(code, "/project/src/app.ts")
        const appDebug = context
            .getDebugManifest()
            .files.find((file) => file.id === "/project/src/app.ts")

        expect(result.code).toContain(`export const joined = "px-2 px-4"`)
        expect(result.code).toContain(`export const styled = "px-2 px-4"`)
        expect(result.changed).toBe(true)
        expect(appDebug?.replacements).toEqual([
            expect.objectContaining({
                kind: "join",
                generatedText: `"px-2 px-4"`,
                fallback: false,
            }),
            expect.objectContaining({
                kind: "style",
                generatedText: `"px-2 px-4"`,
                fallback: false,
            }),
        ])
        expect(
            appDebug?.diagnostics.some(
                (diagnostic) => diagnostic.code === "UNSUPPORTED_MERGER"
            )
        ).toBe(false)
    })

    it("preserves mixed static and dynamic variants props from source object order", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `export const before = (intent) => tw.variants({`,
            `  base: { display: "inline-flex", color: "text-gray-900" },`,
            `  variants: {`,
            `    intent: { danger: { color: "text-red-700" } },`,
            `    size: { sm: { padding: "px-2" } },`,
            `    tone: { quiet: { color: "text-gray-500" } },`,
            `  },`,
            `}).class({ size: "sm", intent })`,
            `export const after = (intent) => tw.variants({`,
            `  base: { display: "inline-flex", color: "text-gray-900" },`,
            `  variants: {`,
            `    intent: { danger: { color: "text-red-700" } },`,
            `    size: { sm: { padding: "px-2" } },`,
            `    tone: { quiet: { color: "text-gray-500" } },`,
            `  },`,
            `}).class({ intent, tone: "quiet" })`,
        ].join("\n")

        const result = compile(code, { fileName: "/project/src/mixed.ts" })
        const executable = result.code
            .replaceAll(" as const", "")
            .replace("export const before =", "const before =")
            .replace("export const after =", "const after =")

        const { before, after } = new Function(
            `${executable}\nreturn { before, after };`
        )() as {
            before: (intent: string) => string
            after: (intent: string) => string
        }

        expect(result.changed).toBe(true)
        expect(before("danger")).toBe("inline-flex text-red-700 px-2")
        expect(after("danger")).toBe("inline-flex text-gray-500")
    })

    const classProducingExpressions = [
        {
            kind: "style",
            expression: `tw.style({ padding: "px-2" }).class("px-4")`,
        },
        {
            kind: "toggle",
            expression: `tw.toggle({ base: { display: "flex" }, truthy: { color: "text-green-600" }, falsy: { color: "text-red-600" } }).class(true, "px-4")`,
        },
        {
            kind: "rotary",
            expression: `tw.rotary({ base: { display: "grid" }, variants: { sm: { padding: "p-2" } } }).class("sm", "px-4")`,
        },
        {
            kind: "variants",
            expression: `tw.variants({ base: { display: "grid" }, variants: { intent: { primary: { color: "text-blue-600" } } } }).class({ intent: "primary" }, "px-4")`,
        },
        {
            kind: "join",
            expression: `tw.join("px-2", "px-4")`,
        },
        {
            kind: "def",
            expression: `tw.def(["px-2"], { margin: "m-2" })`,
        },
        {
            kind: "mergeProps",
            expression: `tw.mergeProps({ padding: "px-2" }, { margin: "m-2" })`,
        },
    ]

    it.each(classProducingExpressions)(
        "falls back for $kind when source createTools options include a runtime merger",
        ({ expression, kind }) => {
            const code = [
                `import { createTools } from "tailwindest"`,
                `const runtimeMerger = (...classes) => classes[classes.length - 1] ?? ""`,
                `const tw = createTools({ merger: runtimeMerger })`,
                `export const cls = ${expression}`,
            ].join("\n")
            const context = createCompilerContext({
                root: "/project",
                options: { debug: true },
            })

            const result = context.transformJs(
                code,
                `/project/src/runtime-merger-${kind}.ts`
            )
            const manifest = context.getDebugManifest()

            expect(result.code).toBe(code)
            expect(result.changed).toBe(false)
            expect(manifest.files[0]?.replacements).toEqual([
                expect.objectContaining({
                    kind,
                    generatedText: "",
                    fallback: true,
                }),
            ])
            expect(manifest.files[0]?.diagnostics).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ code: "UNSUPPORTED_MERGER" }),
                ])
            )
        }
    )

    it("falls back when source createTools options identifier includes a runtime merger", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const runtimeMerger = (...classes) => classes[classes.length - 1] ?? ""`,
            `const options = { merger: runtimeMerger }`,
            `const tw = createTools(options)`,
            `export const cls = tw.join("px-2", "px-4")`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(
            code,
            "/project/src/options-merger.ts"
        )
        const manifest = context.getDebugManifest()

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(manifest.files[0]?.replacements).toEqual([
            expect.objectContaining({
                kind: "join",
                generatedText: "",
                fallback: true,
            }),
        ])
        expect(manifest.files[0]?.diagnostics).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ code: "UNSUPPORTED_MERGER" }),
            ])
        )
    })

    it("falls back for unknown or spread createTools options while compiling proven merger-free options", () => {
        const unsafeCases = [
            {
                name: "declared-options",
                setup: `declare const options: { merger?: (...classes: string[]) => string }`,
                create: `createTools(options)`,
            },
            {
                name: "call-options",
                setup: `declare function getOptions(): { merger?: (...classes: string[]) => string }`,
                create: `createTools(getOptions())`,
            },
            {
                name: "spread-options",
                setup: `const options = { other: true }`,
                create: `createTools({ ...options })`,
            },
        ]

        for (const testCase of unsafeCases) {
            const code = [
                `import { createTools } from "tailwindest"`,
                testCase.setup,
                `const tw = ${testCase.create}`,
                `export const cls = tw.join("px-2", "px-4")`,
            ].join("\n")
            const result = compile(code, {
                fileName: `/project/src/${testCase.name}.ts`,
            })

            expect(result.code, testCase.name).toBe(code)
            expect(result.changed, testCase.name).toBe(false)
            expect(result.diagnostics, testCase.name).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ code: "UNSUPPORTED_MERGER" }),
                ])
            )
        }

        for (const createExpression of [
            `createTools({})`,
            `createTools({ other: true })`,
            `createTools(options)`,
        ]) {
            const code = [
                `import { createTools } from "tailwindest"`,
                `const options = { other: true }`,
                `const tw = ${createExpression}`,
                `export const cls = tw.join("px-2", "px-4")`,
            ].join("\n")
            const result = compile(code, {
                fileName: `/project/src/merger-free.ts`,
            })

            expect(result.code).toContain(`"px-2 px-4"`)
            expect(result.changed).toBe(true)
        }
    })

    it("falls back for imported createTools receivers with unknown options", () => {
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })
        context.transformJs(
            [
                `import { createTools } from "tailwindest"`,
                `declare const options: { merger?: (...classes: string[]) => string }`,
                `export const tw = createTools(options)`,
            ].join("\n"),
            "/project/src/tools.ts"
        )
        const code = [
            `import { tw } from "./tools"`,
            `export const cls = tw.join("px-2", "px-4")`,
        ].join("\n")

        const result = context.transformJs(code, "/project/src/app.ts")
        const appDebug = context
            .getDebugManifest()
            .files.find((file) => file.id === "/project/src/app.ts")

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(appDebug?.replacements).toEqual([
            expect.objectContaining({
                kind: "join",
                generatedText: "",
                fallback: true,
            }),
        ])
        expect(appDebug?.diagnostics).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ code: "UNSUPPORTED_MERGER" }),
            ])
        )
    })

    it("uses the visible createTools declaration when a nested runtime merger shadows a no-merger receiver", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `function inner() {`,
            `  const tw = createTools({ merger: (...classes) => classes[0] ?? "" })`,
            `  return tw.join("px-2", "px-4")`,
            `}`,
            `export const outer = tw.join("px-2", "px-4")`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(
            code,
            "/project/src/scoped-merger.ts"
        )
        const manifest = context.getDebugManifest()

        expect(result.changed).toBe(true)
        expect(result.code).toContain(`return tw.join("px-2", "px-4")`)
        expect(result.code).toContain(`export const outer = "px-2 px-4"`)
        expect(manifest.files[0]?.replacements).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    kind: "join",
                    generatedText: "",
                    fallback: true,
                }),
                expect.objectContaining({
                    kind: "join",
                    generatedText: `"px-2 px-4"`,
                    fallback: false,
                }),
            ])
        )
        expect(
            manifest.files[0]?.diagnostics.filter(
                (diagnostic) => diagnostic.code === "UNSUPPORTED_MERGER"
            )
        ).toHaveLength(1)
    })

    it("compiles an inner no-merger receiver that shadows a runtime-merger receiver", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const runtimeMerger = (...classes) => classes[classes.length - 1] ?? ""`,
            `const tw = createTools({ merger: runtimeMerger })`,
            `function inner() {`,
            `  const tw = createTools()`,
            `  return tw.join("px-2", "px-4")`,
            `}`,
            `export const outer = tw.join("px-2", "px-4")`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(
            code,
            "/project/src/scoped-no-merger.ts"
        )
        const manifest = context.getDebugManifest()

        expect(result.changed).toBe(true)
        expect(result.code).toContain(`return "px-2 px-4"`)
        expect(result.code).toContain(
            `export const outer = tw.join("px-2", "px-4")`
        )
        expect(manifest.files[0]?.replacements).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    kind: "join",
                    generatedText: `"px-2 px-4"`,
                    fallback: false,
                }),
                expect.objectContaining({
                    kind: "join",
                    generatedText: "",
                    fallback: true,
                }),
            ])
        )
        expect(
            manifest.files[0]?.diagnostics.filter(
                (diagnostic) => diagnostic.code === "UNSUPPORTED_MERGER"
            )
        ).toHaveLength(1)
    })

    it.each(classProducingExpressions)(
        "falls back for $kind when plugin merger policy has no build-time evaluator",
        ({ expression, kind }) => {
            const code = [
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `export const cls = ${expression}`,
            ].join("\n")
            const context = createCompilerContext({
                root: "/project",
                options: {
                    debug: true,
                    merger: {
                        kind: "custom",
                        evaluateAtBuildTime: true,
                        moduleId: "./merge",
                        exportName: "merge",
                    },
                },
            })

            const result = context.transformJs(
                code,
                `/project/src/plugin-merger-${kind}.ts`
            )
            const manifest = context.getDebugManifest()

            expect(result.code).toBe(code)
            expect(result.changed).toBe(false)
            expect(manifest.files[0]?.replacements).toEqual([
                expect.objectContaining({
                    kind,
                    generatedText: "",
                    fallback: true,
                }),
            ])
            expect(manifest.files[0]?.diagnostics).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        code: "NON_DETERMINISTIC_MERGER",
                    }),
                ])
            )
        }
    )

    it("replaces exact no-merger class-producing calls", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `export const cls = tw.style({ padding: "px-2" }).class("px-4")`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(code, "/project/src/no-merger.ts")
        const manifest = context.getDebugManifest()

        expect(result.code).toContain(`"px-2 px-4"`)
        expect(result.changed).toBe(true)
        expect(manifest.files[0]?.replacements).toEqual([
            expect.objectContaining({
                kind: "style",
                generatedText: `"px-2 px-4"`,
                fallback: false,
            }),
        ])
    })

    it("compiles stored primitive styler class and style calls with runtime parity and exact debug records", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `const button = tw.style({ display: "inline-flex", color: "text-blue-700" })`,
            `const extraStyle = { color: "text-red-700", padding: "px-2" }`,
            `export const cls = button.class("rounded-md")`,
            `export const styles = button.style(extraStyle)`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(
            code,
            "/project/src/stored-primitive.ts"
        )
        const before = evaluateModule<{
            cls: string
            styles: Record<string, unknown>
        }>(code, ["cls", "styles"])
        const after = evaluateModule<{
            cls: string
            styles: Record<string, unknown>
        }>(result.code, ["cls", "styles"])
        const replacements =
            context.getDebugManifest().files[0]?.replacements ?? []

        expect(result.changed).toBe(true)
        expect(result.code).toContain(
            `export const cls = "inline-flex text-blue-700 rounded-md"`
        )
        expect(after).toEqual(before)
        expect(replacements).toEqual([
            expect.objectContaining({
                kind: "style",
                generatedText: `"inline-flex text-blue-700 rounded-md"`,
                status: "compiled",
                fallback: false,
                candidates: expect.arrayContaining([
                    "inline-flex",
                    "text-blue-700",
                    "rounded-md",
                ]),
                candidateRecords: expect.arrayContaining([
                    expect.objectContaining({
                        candidate: "text-blue-700",
                        kind: "exact",
                    }),
                ]),
            }),
            expect.objectContaining({
                kind: "style",
                status: "compiled",
                fallback: false,
                candidates: expect.arrayContaining([
                    "inline-flex",
                    "text-red-700",
                    "px-2",
                ]),
                candidateRecords: expect.arrayContaining([
                    expect.objectContaining({
                        candidate: "text-red-700",
                        kind: "exact",
                    }),
                ]),
            }),
        ])
        expect(
            replacements.some(
                (replacement) => replacement.status === "candidate-only"
            )
        ).toBe(false)
    })

    it("compiles stored toggle, rotary, and variants stylers with bounded runtime parity", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `const toggle = tw.toggle({`,
            `  base: { display: "inline-flex" },`,
            `  truthy: { color: "text-green-700" },`,
            `  falsy: { color: "text-red-700" },`,
            `})`,
            `const rotary = tw.rotary({`,
            `  base: { display: "grid" },`,
            `  variants: { sm: { padding: "p-2" }, lg: { padding: "p-4" } },`,
            `})`,
            `const variants = tw.variants({`,
            `  base: { display: "inline-flex", color: "text-gray-900" },`,
            `  variants: { intent: { primary: { color: "text-blue-700" }, danger: { color: "text-red-700" } } },`,
            `})`,
            `const extraStyle = { margin: "m-1" }`,
            `export const toggleClass = (enabled) => toggle.class(enabled, "rounded")`,
            `export const rotaryClass = (size) => rotary.class(size, "shadow-sm")`,
            `export const variantsClass = (intent) => variants.class({ intent }, "px-1")`,
            `export const variantsStyle = (intent) => variants.style({ intent }, extraStyle)`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true, variantTableLimit: 8 },
        })

        const result = context.transformJs(code, "/project/src/stored-all.ts")
        const before = evaluateModule<{
            toggleClass: (enabled: boolean) => string
            rotaryClass: (size: string | undefined) => string
            variantsClass: (intent: string | undefined) => string
            variantsStyle: (
                intent: string | undefined
            ) => Record<string, unknown>
        }>(code, [
            "toggleClass",
            "rotaryClass",
            "variantsClass",
            "variantsStyle",
        ])
        const after = evaluateModule<{
            toggleClass: (enabled: boolean) => string
            rotaryClass: (size: string | undefined) => string
            variantsClass: (intent: string | undefined) => string
            variantsStyle: (
                intent: string | undefined
            ) => Record<string, unknown>
        }>(result.code, [
            "toggleClass",
            "rotaryClass",
            "variantsClass",
            "variantsStyle",
        ])

        expect(result.changed).toBe(true)
        for (const enabled of [true, false]) {
            expect(after.toggleClass(enabled)).toBe(before.toggleClass(enabled))
        }
        for (const size of ["base", "sm", "lg"]) {
            expect(after.rotaryClass(size)).toBe(before.rotaryClass(size))
        }
        for (const intent of [undefined, "primary", "danger"]) {
            expect(after.variantsClass(intent)).toBe(
                before.variantsClass(intent)
            )
            expect(after.variantsStyle(intent)).toEqual(
                before.variantsStyle(intent)
            )
        }
        expect(context.getDebugManifest().files[0]?.replacements).toEqual([
            expect.objectContaining({
                kind: "toggle",
                status: "compiled",
                fallback: false,
            }),
            expect.objectContaining({
                kind: "rotary",
                status: "compiled",
                fallback: false,
            }),
            expect.objectContaining({
                kind: "variants",
                status: "compiled",
                fallback: false,
            }),
            expect.objectContaining({
                kind: "variants",
                status: "compiled",
                fallback: false,
            }),
        ])
        expect(
            context
                .getDebugManifest()
                .candidateRecords.filter((record) => record.kind === "exact")
                .map((record) => record.candidate)
        ).toEqual(
            expect.arrayContaining([
                "text-green-700",
                "p-2",
                "text-blue-700",
                "m-1",
            ])
        )
    })

    it.each([
        {
            name: "let stored styler",
            code: [
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `let button = tw.style({ color: "text-blue-700" })`,
                `export const cls = button.class()`,
            ].join("\n"),
            diagnosticCode: undefined,
        },
        {
            name: "reassigned stored styler",
            code: [
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `let button = tw.style({ color: "text-blue-700" })`,
                `button = tw.style({ color: "text-red-700" })`,
                `export const cls = button.class()`,
            ].join("\n"),
            diagnosticCode: undefined,
        },
        {
            name: "mutated config object",
            code: [
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `const config = { color: "text-blue-700" }`,
                `const button = tw.style(config)`,
                `config.color = "text-red-700"`,
                `export const cls = button.class()`,
            ].join("\n"),
            diagnosticCode: "MUTATED_BINDING",
        },
        {
            name: "direct compose chain",
            code: [
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `const button = tw.style({ color: "text-blue-700" }).compose({ padding: "p-2" })`,
                `export const cls = button.class()`,
            ].join("\n"),
            diagnosticCode: undefined,
        },
    ])(
        "preserves unsupported stored styler fallback for $name",
        ({ code, diagnosticCode }) => {
            const context = createCompilerContext({
                root: "/project",
                options: { debug: true },
            })

            const result = context.transformJs(
                code,
                "/project/src/stored-fallback.ts"
            )
            const manifest = context.getDebugManifest()

            expect(result.code).toBe(code)
            expect(result.changed).toBe(false)
            expect(manifest.files[0]?.replacements).not.toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ status: "compiled" }),
                ])
            )
            if (diagnosticCode) {
                expect(manifest.files[0]?.diagnostics).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ code: diagnosticCode }),
                    ])
                )
            }
        }
    )

    it("falls back for stored styler class calls with runtime merger uncertainty", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const runtimeMerger = (...classes) => classes[classes.length - 1] ?? ""`,
            `const tw = createTools({ merger: runtimeMerger })`,
            `const button = tw.style({ padding: "px-2" })`,
            `export const cls = button.class("px-4")`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(
            code,
            "/project/src/stored-merger.ts"
        )
        const replacements =
            context.getDebugManifest().files[0]?.replacements ?? []

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(replacements).toEqual([
            expect.objectContaining({
                kind: "style",
                generatedText: "",
                candidates: expect.arrayContaining(["px-2", "px-4"]),
                status: "runtime-fallback",
                fallback: true,
            }),
        ])
        expect(context.getDebugManifest().files[0]?.diagnostics).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ code: "UNSUPPORTED_MERGER" }),
            ])
        )
    })

    it("does not compile fake or shadowed stored styler identifiers", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `const button = tw.style({ color: "text-blue-700" })`,
            `function render() {`,
            "  const button = { class: () => `fake` }",
            `  return button.class()`,
            `}`,
            `export const cls = render()`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(
            code,
            "/project/src/stored-shadow.ts"
        )
        const replacements =
            context.getDebugManifest().files[0]?.replacements ?? []

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(replacements).toEqual([
            expect.objectContaining({
                kind: "style",
                status: "candidate-only",
                fallback: false,
            }),
        ])
    })

    it.each([
        {
            name: "parameter shadowing",
            code: [
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `const button = tw.style({ color: "text-blue-700" })`,
                `export const render = (button: { class: () => string }) => button.class()`,
            ].join("\n"),
        },
        {
            name: "TDZ block shadowing",
            code: [
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `const button = tw.style({ color: "text-blue-700" })`,
                `export function render() {`,
                `  const cls = button.class()`,
                `  const button = { class: () => "fake" }`,
                `  return cls`,
                `}`,
            ].join("\n"),
        },
        {
            name: "stored styler escape",
            code: [
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `const button = tw.style({ color: "text-blue-700" })`,
                `declare function mutate(value: unknown): void`,
                `mutate(button)`,
                `export const cls = button.class()`,
            ].join("\n"),
        },
        {
            name: "exported stored styler declaration",
            code: [
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `export const button = tw.style({ color: "text-blue-700" })`,
                `export const get = () => button.class()`,
            ].join("\n"),
        },
        {
            name: "optional method call",
            code: [
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `const button = tw.style({ color: "text-blue-700" })`,
                `export const cls = button.class?.()`,
            ].join("\n"),
        },
        {
            name: "optional stored styler initializer",
            code: [
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `const button = tw.style?.({ color: "text-blue-700" })`,
                `export const cls = button.class()`,
            ].join("\n"),
        },
        {
            name: "optional direct styler chain",
            code: [
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `export const cls = tw.style?.({ color: "text-blue-700" }).class()`,
            ].join("\n"),
        },
    ])("preserves unsafe stored styler use for $name", ({ code }) => {
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(
            code,
            "/project/src/stored-unsafe.ts"
        )

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(context.getDebugManifest().files[0]?.replacements).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({ status: "compiled" }),
            ])
        )
    })

    it("emits JavaScript-compatible lookup declarations while retaining TSX readonly declarations", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `export const cls = (size) => tw.rotary({`,
            `  base: { display: "grid" },`,
            `  variants: { sm: { padding: "p-2" }, lg: { padding: "p-4" } },`,
            `}).class(size)`,
        ].join("\n")

        const jsResult = compile(code, { fileName: "/project/src/lookup.js" })
        const tsxResult = compile(code, {
            fileName: "/project/src/lookup.tsx",
        })

        expect(jsResult.changed).toBe(true)
        expect(jsResult.code).not.toContain("as const")
        expectParsesAs("/project/src/lookup.js", jsResult.code)
        expect(
            () =>
                new Function(
                    jsResult.code.replace("export const cls =", "const cls =")
                )
        ).not.toThrow()
        expect(tsxResult.changed).toBe(true)
        expect(tsxResult.code).toContain("as const")
        expectParsesAs("/project/src/lookup.tsx", tsxResult.code)
    })

    it("marks invalid generated replacement syntax as a runtime fallback in debug output", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `export const cls = (first, second) => tw.variants({`,
            `  base: { display: "inline-flex" },`,
            `  variants: {`,
            `    "a\`b": { one: { color: "text-blue-700" } },`,
            `    tone: { two: { color: "text-red-700" } },`,
            `  },`,
            `}).class({ "a\`b": first, tone: second })`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(code, "/project/src/invalid.ts")
        const manifest = context.getDebugManifest()

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(manifest.files[0]?.replacements).toEqual([
            expect.objectContaining({
                kind: "variants",
                generatedText: "",
                status: "unsafe-skipped",
                fallback: true,
                candidateRecords: expect.arrayContaining([
                    expect.objectContaining({
                        candidate: "inline-flex",
                        kind: "fallback-known",
                    }),
                    expect.objectContaining({
                        candidate: "text-blue-700",
                        kind: "fallback-known",
                    }),
                    expect.objectContaining({
                        candidate: "text-red-700",
                        kind: "fallback-known",
                    }),
                ]),
                reason: expect.stringContaining("syntax error"),
            }),
        ])
        expect(manifest.candidateRecords).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    candidate: "inline-flex",
                    kind: "fallback-known",
                }),
                expect.objectContaining({
                    candidate: "text-blue-700",
                    kind: "fallback-known",
                }),
                expect.objectContaining({
                    candidate: "text-red-700",
                    kind: "fallback-known",
                }),
            ])
        )
        expect(
            manifest.candidateRecords.filter(
                (record) => record.kind === "exact"
            )
        ).toEqual([])
        expect(manifest.files[0]?.diagnostics).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    code: "INVALID_REPLACEMENT_SYNTAX",
                    fallbackBehavior: "runtime-fallback",
                }),
            ])
        )
    })

    it("preserves unresolved imported tw calls without replacement", () => {
        const code = [
            `import { tw } from "./missing"`,
            `export const cls = tw.join("px-4")`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(code, "/project/src/app.ts")
        const appDebug = context.getDebugManifest().files[0]

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(result.code).toContain(`tw.join("px-4")`)
        expect(appDebug?.replacements).toEqual([])
        expect(appDebug?.diagnostics).toEqual([
            expect.objectContaining({
                code: "NOT_TAILWINDEST_SYMBOL",
                fallbackBehavior: "runtime-fallback",
            }),
        ])
    })

    it("preserves locally shadowed tw calls with analyzer provenance diagnostics", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `export const cls = (() => {`,
            "  const tw = { join: (value: string) => `FAKE:${value}` }",
            `  return tw.join("px-4")`,
            `})()`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(code, "/project/src/shadowed-tw.ts")

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(context.getDebugManifest().files[0]?.replacements).toEqual([])
        expect(context.getDebugManifest().files[0]?.diagnostics).toEqual([
            expect.objectContaining({
                code: "NOT_TAILWINDEST_SYMBOL",
                fallbackBehavior: "runtime-fallback",
            }),
        ])
    })

    it("preserves design-system unsupported cases as runtime fallbacks", () => {
        const cases = [
            {
                name: "unknown dynamic class variable in tw.join(dynamicClass)",
                code: [
                    `import { createTools } from "tailwindest"`,
                    `const tw = createTools()`,
                    `declare const dynamicClass: string`,
                    `export const cls = tw.join(dynamicClass)`,
                ].join("\n"),
                diagnostic: "UNSUPPORTED_DYNAMIC_VALUE",
                preservesSource: true,
            },
            {
                name: "dynamic style object in tw.style(dynamicStyle).class()",
                code: [
                    `import { createTools } from "tailwindest"`,
                    `const tw = createTools()`,
                    `declare const dynamicStyle: Record<string, string>`,
                    `export const cls = tw.style(dynamicStyle).class()`,
                ].join("\n"),
                diagnostic: "UNSUPPORTED_DYNAMIC_VALUE",
                preservesSource: true,
            },
            {
                name: "runtime-generated variant table key",
                code: [
                    `import { createTools } from "tailwindest"`,
                    `const tw = createTools()`,
                    `declare const runtimeKey: string`,
                    `export const cls = tw.variants({`,
                    `  base: { display: "flex" },`,
                    `  variants: { tone: { [runtimeKey]: { color: "text-blue-600" } } },`,
                    `}).class({ tone: "primary" })`,
                ].join("\n"),
                diagnostic: "UNSUPPORTED_DYNAMIC_VALUE",
                preservesSource: true,
            },
            {
                name: "unproven receiver provenance",
                code: [
                    `import { createTools } from "tailwindest"`,
                    `const fake = { join: (value: string) => value }`,
                    `export const cls = fake.join("px-4")`,
                ].join("\n"),
                diagnostic: "NOT_TAILWINDEST_SYMBOL",
                runtimeCall: `fake.join("px-4")`,
            },
        ]

        for (const item of cases) {
            const context = createCompilerContext({
                root: "/project",
                options: { debug: true },
            })
            const result = context.transformJs(
                item.code,
                `/project/src/${item.name}.ts`
            )

            if (item.preservesSource) {
                expect(result.code, item.name).toBe(item.code)
                expect(result.changed, item.name).toBe(false)
            } else {
                expect(result.code, item.name).toContain(item.runtimeCall)
            }
            expect(
                context.getDebugManifest().files[0]?.diagnostics,
                item.name
            ).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ code: item.diagnostic }),
                ])
            )
        }
    })

    it("keeps variant table overflow as a runtime fallback warning", () => {
        const result = optimizeVariants({
            base: { display: "flex" },
            variants: {
                one: {
                    a: { color: "text-a" },
                    b: { color: "text-b" },
                },
                two: {
                    c: { color: "text-c" },
                    d: { color: "text-d" },
                },
            },
            variantTableLimit: 4,
        })

        expect(result.exact).toBe(false)
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "VARIANT_TABLE_LIMIT_EXCEEDED",
                severity: "warning",
            }),
        ])
    })

    it("keeps runtime fallback, static manifest candidates, and debug diagnostics", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `declare const dynamicClass: string`,
            `export const cls = tw.join("px-4", dynamicClass)`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(code, "/project/src/fallback.ts")
        const manifest = context.getDebugManifest()

        expect(result.changed).toBe(false)
        expect(result.code).toContain(`tw.join("px-4", dynamicClass)`)
        expect(manifest.candidates).toContain("px-4")
        expect(manifest.files[0]?.diagnostics).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    code: "UNSUPPORTED_DYNAMIC_VALUE",
                    fallbackBehavior: "runtime-fallback",
                }),
            ])
        )
    })

    it("unknown dynamic class preserves runtime call, static candidates, and fallback diagnostic", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `declare const dynamicClass: string`,
            `export const cls = tw.join("px-4", dynamicClass)`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(
            code,
            "/project/src/fallback-join.ts"
        )
        const manifest = context.getDebugManifest()

        expect(result.changed).toBe(false)
        expect(result.code).toContain(`tw.join("px-4", dynamicClass)`)
        expect(manifest.candidates).toContain("px-4")
        expect(manifest.files[0]?.diagnostics).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    code: "UNSUPPORTED_DYNAMIC_VALUE",
                    fallbackBehavior: "runtime-fallback",
                }),
            ])
        )
    })

    it("dynamic style object preserves runtime call, mixed static candidates, and fallback diagnostic", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `declare const dynamicStyle: Record<string, string>`,
            `export const cls = tw.style(dynamicStyle).class("px-4")`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(
            code,
            "/project/src/fallback-style.ts"
        )
        const manifest = context.getDebugManifest()

        expect(result.changed).toBe(false)
        expect(result.code).toContain(`tw.style(dynamicStyle).class("px-4")`)
        expect(manifest.candidates).toContain("px-4")
        expect(manifest.files[0]?.diagnostics).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    code: "UNSUPPORTED_DYNAMIC_VALUE",
                    fallbackBehavior: "runtime-fallback",
                }),
            ])
        )
    })

    it("runtime-generated variant key preserves runtime call, finite candidates, and fallback diagnostic", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `declare const runtimeKey: string`,
            `export const cls = tw.variants({`,
            `  base: { display: "flex" },`,
            `  variants: { tone: { [runtimeKey]: { color: "text-blue-600" }, safe: { color: "text-red-600" } } },`,
            `}).class({ tone: "safe" })`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(
            code,
            "/project/src/fallback-variant-key.ts"
        )
        const manifest = context.getDebugManifest()

        expect(result.changed).toBe(false)
        expect(result.code).toContain(`[runtimeKey]`)
        expect(manifest.candidates).toEqual(
            expect.arrayContaining(["text-blue-600", "text-red-600"])
        )
        expect(manifest.files[0]?.diagnostics).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    code: "UNSUPPORTED_DYNAMIC_VALUE",
                    fallbackBehavior: "runtime-fallback",
                }),
            ])
        )
    })

    it("variant table overflow keeps every static candidate with warning fallback", () => {
        const result = optimizeVariants({
            base: { display: "flex" },
            variants: {
                one: {
                    a: { color: "text-a" },
                    b: { color: "text-b" },
                },
                two: {
                    c: { color: "text-c" },
                    d: { color: "text-d" },
                },
            },
            variantTableLimit: 4,
        })

        expect(result.exact).toBe(false)
        expect(result.classCandidates).toEqual(
            expect.arrayContaining([
                "flex",
                "text-a",
                "text-b",
                "text-c",
                "text-d",
            ])
        )
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "VARIANT_TABLE_LIMIT_EXCEEDED",
                severity: "warning",
            }),
        ])
    })

    it("unproven receiver preserves non-tailwindest call and records provenance diagnostic", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const fake = { join: (value: string) => value }`,
            `export const cls = fake.join("px-4")`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        const result = context.transformJs(
            code,
            "/project/src/fallback-fake.ts"
        )
        const manifest = context.getDebugManifest()

        expect(result.code).toContain(`fake.join("px-4")`)
        expect(manifest.files[0]?.replacements).toEqual([])
        expect(manifest.files[0]?.diagnostics).toEqual([
            expect.objectContaining({
                code: "NOT_TAILWINDEST_SYMBOL",
                fallbackBehavior: "runtime-fallback",
            }),
        ])
    })

    it("keeps deterministic debug replacement order across mixed outcomes", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `declare const dynamicClass: string`,
            `export const exact = tw.join("px-2")`,
            `export const stored = tw.style({ color: "text-blue-700" })`,
            `export const runtime = tw.join("px-4", dynamicClass)`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })

        context.transformJs(code, "/project/src/order.ts")
        const replacements = context.getDebugManifest().files[0]?.replacements

        expect(
            replacements?.map((replacement) => ({
                kind: replacement.kind,
                status: replacement.status,
                start: replacement.originalSpan.start,
            }))
        ).toEqual([
            {
                kind: "join",
                status: "compiled",
                start: code.indexOf(`tw.join("px-2")`),
            },
            {
                kind: "style",
                status: "candidate-only",
                start: code.indexOf(`tw.style({ color: "text-blue-700" })`),
            },
            {
                kind: "join",
                status: "runtime-fallback",
                start: code.indexOf(`tw.join("px-4", dynamicClass)`),
            },
        ])
    })

    it("serve and build contexts derive the same manifest for the same fixture files", async () => {
        const files = {
            "/project/src/app.tsx": `import { createTools } from "tailwindest"
                const tw = createTools()
                export const cls = tw.join("px-4", "dark:hover:bg-sky-600")`,
            "/project/src/app.css": `@import "tailwindcss";`,
        }
        const scanFiles = async () => Object.keys(files)
        const readFile = async (id: string) =>
            files[id as keyof typeof files] ?? ""
        const serve = createCompilerContext({
            root: "/project",
            command: "serve",
            options: {},
            scanFiles,
            readFile,
        })
        const build = createCompilerContext({
            root: "/project",
            command: "build",
            options: {},
            scanFiles,
            readFile,
        })

        await serve.preScan()
        await build.preScan()

        expect(serve.getManifestCandidates()).toEqual(
            build.getManifestCandidates()
        )
        expect(
            serve.transformCss(
                files["/project/src/app.css"],
                "/project/src/app.css"
            ).code
        ).toBe(
            build.transformCss(
                files["/project/src/app.css"],
                "/project/src/app.css"
            ).code
        )
    })

    it("applies include and exclude fallback checks inside transform handlers", async () => {
        const plugins = tailwindest({
            include: [/included/],
            exclude: [/excluded/],
        })
        const transform = plugins[0]?.transform
        if (!transform || typeof transform !== "object") {
            throw new Error("Expected object transform")
        }

        expect(
            await transform.handler.call(
                {},
                `tw.join("px-4")`,
                "/src/excluded.ts"
            )
        ).toBeNull()
        expect(
            await transform.handler.call({}, `tw.join("px-4")`, "/src/other.ts")
        ).toBeNull()
    })

    it("updates manifest from hot-update reads, removes deleted candidates from CSS, and invalidates CSS entries", async () => {
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })
        context.registerCssEntry("/project/src/app.css")
        const cssModule = { id: "/project/src/app.css" }
        const jsModule = { id: "/project/src/app.tsx" }
        const invalidated: string[] = []
        const server = {
            moduleGraph: {
                getModuleById: (id: string) =>
                    id.endsWith("app.css")
                        ? cssModule
                        : id.endsWith("app.tsx")
                          ? jsModule
                          : undefined,
                invalidateModule: (module: { id?: string | null }) => {
                    if (module.id) {
                        invalidated.push(module.id)
                    }
                },
            },
        }

        context.transformJs(
            `import { createTools } from "tailwindest"
             const tw = createTools()
             export const cls = tw.join("px-4", "py-2")`,
            "/project/src/app.tsx"
        )
        expect(context.getDebugManifest().candidateRecords).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ candidate: "py-2", kind: "exact" }),
            ])
        )
        context.recordDependencies("/project/src/app.tsx", [
            "/project/src/styles.ts",
        ])
        expect(
            context.transformCss(
                `@import "tailwindcss";`,
                "/project/src/app.css"
            ).code
        ).toContain("py-2")

        const handler = createHotUpdateHandler(context)
        const affected = await handler({
            file: "/project/src/app.tsx",
            server,
            read: async () => `import { createTools } from "tailwindest"
                const tw = createTools()
                export const cls = tw.join("px-4")`,
        })

        const css = context.transformCss(
            `@import "tailwindcss";`,
            "/project/src/app.css"
        ).code
        expect(css).toContain("px-4")
        expect(css).not.toContain("py-2")
        expect(context.getDebugManifest().candidateRecords).toEqual([
            expect.objectContaining({ candidate: "px-4", kind: "exact" }),
        ])
        expect(affected).toEqual([jsModule])
        expect(invalidated).toEqual([
            "/project/src/app.css",
            "/project/src/app.tsx",
        ])

        expect(context.removeFile("/project/src/app.tsx")).toBe(true)
        expect(context.getDebugManifest().candidateRecords).toEqual([])
    })

    it("drops stale manifest candidates and over-invalidates when changed file reads fail", async () => {
        const context = createCompilerContext({ root: "/project", options: {} })
        context.transformJs(
            `import { createTools } from "tailwindest"
             const tw = createTools()
             export const cls = tw.join("stale-class")`,
            "/project/src/app.tsx"
        )
        const modules = [
            { id: "/project/src/a.ts" },
            { id: "/project/src/b.ts" },
        ]
        const server = {
            moduleGraph: {
                idToModuleMap: new Map(
                    modules.map((module) => [module.id, module])
                ),
                invalidateModule: vi.fn(),
            },
        }

        const affected = await createHotUpdateHandler(context)({
            file: "/project/src/app.tsx",
            server,
            read: async () => {
                throw new Error("file removed before read")
            },
        })

        expect(context.getManifestCandidates()).not.toContain("stale-class")
        expect(affected).toEqual(modules)
        expect(server.moduleGraph.invalidateModule).toHaveBeenCalledTimes(2)
    })

    it("over-invalidates when a changed dependency has no precise reverse edges", async () => {
        const context = createCompilerContext({ root: "/project", options: {} })
        const modules = [
            { id: "/project/src/a.ts" },
            { id: "/project/src/b.ts" },
        ]
        const server = {
            moduleGraph: {
                idToModuleMap: new Map(
                    modules.map((module) => [module.id, module])
                ),
                invalidateModule: vi.fn(),
            },
        }

        const affected = await createHotUpdateHandler(context)({
            file: "/project/src/unknown.ts",
            server,
        })

        expect(affected).toEqual(modules)
        expect(server.moduleGraph.invalidateModule).toHaveBeenCalledTimes(2)
    })
})
