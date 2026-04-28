import { describe, expect, it, vi } from "vitest"
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
                invalidateModule: (module: { id: string }) =>
                    invalidated.push(module.id),
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
                invalidateModule: (module: { id: string }) =>
                    invalidated.push(module.id),
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
