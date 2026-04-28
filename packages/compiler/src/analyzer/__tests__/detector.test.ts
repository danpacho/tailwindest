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
