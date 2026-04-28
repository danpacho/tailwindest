import { describe, expect, it, vi } from "vitest"
import { optimizeVariants } from "../../core/variant_optimizer"
import { createCompilerContext } from "../context"
import { createHotUpdateHandler } from "../hmr"
import { tailwindest } from "../index"

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

    it("injects not-inline exclusions for raw shorthand leaves unless another candidate owns them", () => {
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })
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

    it("injects the source bridge into Tailwind package CSS entries used by framework dev aggregators", () => {
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })
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

        expect(result.code).toContain(`"px-4 py-2"`)
        expect(result.changed).toBe(true)
        expect(result.map?.sources).toEqual(["/project/src/app.ts"])
        expect(manifest.files[0]?.replacements).toEqual([
            {
                kind: "join",
                originalSpan: {
                    fileName: "/project/src/app.ts",
                    start: code.indexOf(`tw.join`),
                    end:
                        code.indexOf(`tw.join`) +
                        `tw.join("px-4", "py-2")`.length,
                },
                generatedText: `"px-4 py-2"`,
                candidates: ["px-4", "py-2"],
                fallback: false,
            },
        ])
        expect(manifest.candidates).toEqual(["px-4", "py-2"])
    })

    it("fails strict transforms for unsupported exact compile and preserves loose runtime fallback", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `declare const dynamicClass: string`,
            `export const cls = tw.join(dynamicClass)`,
        ].join("\n")

        const strict = createCompilerContext({
            root: "/project",
            options: { mode: "strict" },
        })
        expect(() => strict.transformJs(code, "/project/src/app.ts")).toThrow(
            /UNRESOLVED_STATIC_VALUE|UNSUPPORTED_DYNAMIC_VALUE/
        )

        const loose = createCompilerContext({
            root: "/project",
            options: { mode: "loose", debug: true },
        })
        const result = loose.transformJs(code, "/project/src/app.ts")

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(loose.getDebugManifest().files[0]?.replacements).toEqual([
            expect.objectContaining({
                kind: "join",
                generatedText: "",
                fallback: true,
            }),
        ])
    })

    it("fails design-system strict negatives without browser fallback", () => {
        const cases = [
            {
                name: "unknown dynamic class variable in tw.join(dynamicClass)",
                code: [
                    `import { createTools } from "tailwindest"`,
                    `const tw = createTools()`,
                    `declare const dynamicClass: string`,
                    `export const cls = tw.join(dynamicClass)`,
                ].join("\n"),
                error: /UNRESOLVED_STATIC_VALUE|UNSUPPORTED_DYNAMIC_VALUE/,
            },
            {
                name: "dynamic style object in tw.style(dynamicStyle).class()",
                code: [
                    `import { createTools } from "tailwindest"`,
                    `const tw = createTools()`,
                    `declare const dynamicStyle: Record<string, string>`,
                    `export const cls = tw.style(dynamicStyle).class()`,
                ].join("\n"),
                error: /UNRESOLVED_STATIC_VALUE|UNSUPPORTED_DYNAMIC_VALUE/,
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
                error: /UNRESOLVED_STATIC_VALUE/,
            },
            {
                name: "unproven receiver provenance",
                code: [
                    `import { createTools } from "tailwindest"`,
                    `const fake = { join: (value: string) => value }`,
                    `export const cls = fake.join("px-4")`,
                ].join("\n"),
                error: /NOT_TAILWINDEST_SYMBOL/,
            },
        ]

        for (const item of cases) {
            const context = createCompilerContext({
                root: "/project",
                options: { mode: "strict", debug: true },
            })
            expect(
                () =>
                    context.transformJs(
                        item.code,
                        `/project/src/${item.name}.ts`
                    ),
                item.name
            ).toThrow(item.error)
        }
    })

    it("fails strict mode when variant table size exceeds the configured limit", () => {
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
            mode: "strict",
            variantTableLimit: 4,
        })

        expect(result.exact).toBe(false)
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "VARIANT_TABLE_LIMIT_EXCEEDED",
                severity: "error",
            }),
        ])
    })

    it("keeps loose runtime fallback, static manifest candidates, and debug diagnostics", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `declare const dynamicClass: string`,
            `export const cls = tw.join("px-4", dynamicClass)`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { mode: "loose", debug: true },
        })

        const result = context.transformJs(code, "/project/src/loose.ts")
        const manifest = context.getDebugManifest()

        expect(result.changed).toBe(false)
        expect(result.code).toContain(`tw.join("px-4", dynamicClass)`)
        expect(manifest.candidates).toContain("px-4")
        expect(manifest.files[0]?.diagnostics).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    code: "UNSUPPORTED_DYNAMIC_VALUE",
                    modeBehavior: "loose-fallback",
                }),
            ])
        )
    })

    it("loose unknown dynamic class preserves runtime call, static candidates, and fallback diagnostic", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `declare const dynamicClass: string`,
            `export const cls = tw.join("px-4", dynamicClass)`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { mode: "loose", debug: true },
        })

        const result = context.transformJs(code, "/project/src/loose-join.ts")
        const manifest = context.getDebugManifest()

        expect(result.changed).toBe(false)
        expect(result.code).toContain(`tw.join("px-4", dynamicClass)`)
        expect(manifest.candidates).toContain("px-4")
        expect(manifest.files[0]?.diagnostics).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    code: "UNSUPPORTED_DYNAMIC_VALUE",
                    modeBehavior: "loose-fallback",
                }),
            ])
        )
    })

    it("loose dynamic style object preserves runtime call, mixed static candidates, and fallback diagnostic", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `declare const dynamicStyle: Record<string, string>`,
            `export const cls = tw.style(dynamicStyle).class("px-4")`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { mode: "loose", debug: true },
        })

        const result = context.transformJs(code, "/project/src/loose-style.ts")
        const manifest = context.getDebugManifest()

        expect(result.changed).toBe(false)
        expect(result.code).toContain(`tw.style(dynamicStyle).class("px-4")`)
        expect(manifest.candidates).toContain("px-4")
        expect(manifest.files[0]?.diagnostics).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    code: "UNSUPPORTED_DYNAMIC_VALUE",
                    modeBehavior: "loose-fallback",
                }),
            ])
        )
    })

    it("loose runtime-generated variant key preserves runtime call, finite candidates, and fallback diagnostic", () => {
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
            options: { mode: "loose", debug: true },
        })

        const result = context.transformJs(
            code,
            "/project/src/loose-variant-key.ts"
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
                    modeBehavior: "loose-fallback",
                }),
            ])
        )
    })

    it("loose variant table overflow keeps every static candidate with warning fallback", () => {
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
            mode: "loose",
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

    it("loose unproven receiver preserves non-tailwindest call and records provenance diagnostic", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const fake = { join: (value: string) => value }`,
            `export const cls = fake.join("px-4")`,
        ].join("\n")
        const context = createCompilerContext({
            root: "/project",
            options: { mode: "loose", debug: true },
        })

        const result = context.transformJs(code, "/project/src/loose-fake.ts")
        const manifest = context.getDebugManifest()

        expect(result.code).toContain(`fake.join("px-4")`)
        expect(manifest.files[0]?.replacements).toEqual([])
        expect(manifest.files[0]?.diagnostics).toEqual([
            expect.objectContaining({
                code: "NOT_TAILWINDEST_SYMBOL",
                modeBehavior: "strict-fails",
            }),
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
        const context = createCompilerContext({ root: "/project", options: {} })
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
        expect(affected).toEqual([jsModule])
        expect(invalidated).toEqual([
            "/project/src/app.css",
            "/project/src/app.tsx",
        ])
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
