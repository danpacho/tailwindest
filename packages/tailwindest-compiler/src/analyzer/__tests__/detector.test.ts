import { describe, expect, it } from "vitest"
import { createStaticAnalyzer } from "../detector"

const app = "/src/app.ts"

describe("tailwindest symbol detector", () => {
    it("detects direct createTools() instances regardless of variable name and follows aliases", () => {
        const analyzer = createStaticAnalyzer({
            [app]: `
                import { createTools } from "tailwindest"

                const tw = createTools()
                const styles = createTools()
                const css = tw

                tw.style({ color: "text-red-500" })
                styles.toggle({ true: { color: "text-blue-500" }, false: {} })
                css.join("px-2")
            `,
        })

        const result = analyzer.analyzeFile(app)

        expect(result.calls.map((call) => call.kind)).toEqual([
            "style",
            "toggle",
            "join",
        ])
        expect(result.diagnostics).toEqual([])
    })

    it("detects imported and re-exported createTools() provenance", () => {
        const analyzer = createStaticAnalyzer({
            "/src/tools.ts": `
                import { createTools } from "tailwindest"
                export const tw = createTools()
                export const alias = tw
            `,
            "/src/reexport.ts": `
                export { alias as css } from "./tools"
            `,
            [app]: `
                import { css } from "./reexport"
                css.style({ color: "text-red-500" })
            `,
        })

        const result = analyzer.analyzeFile(app)

        expect(result.calls).toHaveLength(1)
        expect(result.calls[0]?.receiver.provenance).toBe("createTools")
        expect(result.dependencies).toEqual([
            "/src/reexport.ts",
            "/src/tools.ts",
        ])
    })

    it.each([
        ".ts",
        ".tsx",
        ".mts",
        ".cts",
        ".js",
        ".jsx",
        ".mjs",
        ".cjs",
    ] as const)(
        "detects createTools() provenance through extensionless directory imports from index%s",
        (extension) => {
            const dependency = `/src/toolbox/index${extension}`
            const analyzer = createStaticAnalyzer({
                [dependency]: `
                    import { createTools } from "tailwindest"
                    export const css = createTools()
                `,
                [app]: `
                    import { css } from "./toolbox"
                    css.style({ color: "text-red-500" })
                `,
            })

            const result = analyzer.analyzeFile(app)

            expect(result.calls).toHaveLength(1)
            expect(result.calls[0]?.receiver.provenance).toBe("createTools")
            expect(result.dependencies).toEqual([dependency])
            expect(result.diagnostics).toEqual([])
        }
    )

    it.each([
        "not-tailwindest/foo",
        "@scope/not-tailwindest/foo",
        "@tailwindest/fake",
    ])(
        "rejects createTools imports from non-tailwindest module %s",
        (moduleSpecifier) => {
            const analyzer = createStaticAnalyzer({
                [app]: `
                    import { createTools } from "${moduleSpecifier}"

                    const tw = createTools()
                    tw.join("px-4")
                `,
            })

            const result = analyzer.analyzeFile(app)

            expect(result.calls).toEqual([])
            expect(
                result.diagnostics.map((diagnostic) => diagnostic.code)
            ).toEqual(["NOT_TAILWINDEST_SYMBOL"])
        }
    )

    it("accepts createTools imports from a tailwindest package subpath", () => {
        const analyzer = createStaticAnalyzer({
            [app]: `
                import { createTools } from "tailwindest/tools"

                const tw = createTools()
                tw.join("px-4")
            `,
        })

        const result = analyzer.analyzeFile(app)

        expect(result.calls.map((call) => call.kind)).toEqual(["join"])
        expect(result.diagnostics).toEqual([])
    })

    it("marks imported runtime-merger receivers and preserves no-merger aliases", () => {
        const analyzer = createStaticAnalyzer({
            "/src/tools.ts": `
                import { createTools } from "tailwindest"
                const runtimeMerger = (...classes: string[]) => classes[0] ?? ""
                export const runtimeTw = createTools({ merger: runtimeMerger })
                export const runtimeAlias = runtimeTw
                export const plainTw = createTools()
                export const plainAlias = plainTw
            `,
            [app]: `
                import { runtimeAlias, plainAlias } from "./tools"
                runtimeAlias.join("px-2", "px-4")
                plainAlias.join("px-2", "px-4")
            `,
        })

        const result = analyzer.analyzeFile(app)

        expect(result.calls.map((call) => call.receiver.runtimeMerger)).toEqual(
            [true, false]
        )
        expect(result.diagnostics).toEqual([])
    })

    it("treats unknown and spread createTools options as runtime merger risks", () => {
        const analyzer = createStaticAnalyzer({
            "/src/tools.ts": `
                import { createTools } from "tailwindest"
                declare const unknownOptions: { merger?: (...classes: string[]) => string }
                const safeOptions = { other: true }
                const spreadOptions = { ...safeOptions }
                export const unknownTw = createTools(unknownOptions)
                export const safeTw = createTools(safeOptions)
                export const spreadTw = createTools(spreadOptions)
            `,
            [app]: `
                import { unknownTw, safeTw, spreadTw } from "./tools"
                unknownTw.join("px-2")
                safeTw.join("px-2")
                spreadTw.join("px-2")
            `,
        })

        const result = analyzer.analyzeFile(app)

        expect(result.calls.map((call) => call.receiver.runtimeMerger)).toEqual(
            [true, false, true]
        )
    })

    it("detects destructured tools when createTools() provenance remains provable", () => {
        const analyzer = createStaticAnalyzer({
            [app]: `
                import { createTools } from "tailwindest"

                const { style, join } = createTools()
                style({ color: "text-red-500" })
                join("px-2")
            `,
        })

        const result = analyzer.analyzeFile(app)

        expect(result.calls.map((call) => call.kind)).toEqual(["style", "join"])
        expect(result.calls.map((call) => call.receiver.name)).toEqual([
            "style",
            "join",
        ])
        expect(result.diagnostics).toEqual([])
    })

    it("detects destructured tools from a proven tool object alias", () => {
        const analyzer = createStaticAnalyzer({
            [app]: `
                import { createTools } from "tailwindest"

                const tw = createTools()
                const tools = tw
                const { style } = tools
                style({ color: "text-red-500" })
            `,
        })

        const result = analyzer.analyzeFile(app)

        expect(result.calls.map((call) => call.kind)).toEqual(["style"])
        expect(result.diagnostics).toEqual([])
    })

    it("rejects local shadowing, unrelated objects, and type-only structural compatibility", () => {
        const analyzer = createStaticAnalyzer({
            "/src/types.ts": `
                export interface ToolShape {
                    style(value: unknown): unknown
                }
            `,
            [app]: `
                import { createTools } from "tailwindest"
                import type { ToolShape } from "./types"

                const real = createTools()
                const objectNamedTw = { style: (_value: unknown) => "runtime" }
                objectNamedTw.style({ color: "text-red-500" })

                const structural = {} as ToolShape
                structural.style({ color: "text-blue-500" })

                {
                    const real = { style: (_value: unknown) => "shadowed" }
                    real.style({ color: "text-green-500" })
                }
            `,
        })

        const result = analyzer.analyzeFile(app)

        expect(result.calls).toEqual([])
        expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(
            [
                "NOT_TAILWINDEST_SYMBOL",
                "NOT_TAILWINDEST_SYMBOL",
                "NOT_TAILWINDEST_SYMBOL",
            ]
        )
    })

    it("rejects destructured functions from unrelated objects and local shadowing", () => {
        const analyzer = createStaticAnalyzer({
            [app]: `
                import { createTools } from "tailwindest"

                const otherObject = { style: (_value: unknown) => "runtime" }
                const { style } = otherObject
                style({ color: "text-red-500" })

                const { join } = createTools()
                {
                    const join = (_value: unknown) => "shadowed"
                    join("px-2")
                }
            `,
        })

        const result = analyzer.analyzeFile(app)

        expect(result.calls).toEqual([])
        expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(
            ["NOT_TAILWINDEST_SYMBOL", "NOT_TAILWINDEST_SYMBOL"]
        )
    })
})
