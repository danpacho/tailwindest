import { describe, expect, it } from "vitest"
import { createStaticAnalyzer } from "../detector"

const app = "/src/app.ts"

describe("static resolver", () => {
    it("resolves accepted literal forms, wrappers, static spreads, and computed string keys", () => {
        const analyzer = createStaticAnalyzer({
            [app]: `
                import { createTools } from "tailwindest"

                const tw = createTools()
                const key = "color"
                const shared = { padding: ["px-2", "py-1"] }

                tw.style(({
                    [key]: "text-red-500",
                    enabled: true,
                    count: 3,
                    big: 2n,
                    nested: { display: "flex" },
                    ...shared,
                } as const) satisfies Record<string, unknown>)
            `,
        })

        const result = analyzer.analyzeFile(app)

        expect(result.diagnostics).toEqual([])
        expect(result.calls[0]?.arguments[0]?.value).toEqual({
            color: "text-red-500",
            enabled: true,
            count: 3,
            big: 2n,
            nested: { display: "flex" },
            padding: ["px-2", "py-1"],
        })
    })

    it("resolves imported export const values through three modules and records dependency edges", () => {
        const analyzer = createStaticAnalyzer({
            "/src/base.ts": `
                export const base = { color: "text-red-500" } as const
            `,
            "/src/mid.ts": `
                export { base as mid } from "./base"
            `,
            "/src/styles.ts": `
                import { mid } from "./mid"
                export const style = { ...mid, display: "flex" } as const
            `,
            [app]: `
                import { createTools } from "tailwindest"
                import { style } from "./styles"

                const tw = createTools()
                tw.style(style)
            `,
        })

        const result = analyzer.analyzeFile(app)
        const graph = analyzer.getDependencyGraph()

        expect(result.diagnostics).toEqual([])
        expect(result.calls[0]?.arguments[0]?.value).toEqual({
            color: "text-red-500",
            display: "flex",
        })
        expect(result.dependencies).toEqual([
            "/src/styles.ts",
            "/src/mid.ts",
            "/src/base.ts",
        ])
        expect(graph.getReverseDependencies("/src/base.ts")).toEqual([
            "/src/app.ts",
            "/src/mid.ts",
        ])
    })

    it("rejects unsupported values with explicit diagnostics", () => {
        const cases = [
            {
                name: "function calls",
                source: "const value = makeStyle()",
                code: "UNSUPPORTED_DYNAMIC_VALUE",
            },
            {
                name: "getters",
                source: "const value = { get color() { return 'text-red-500' } }",
                code: "SIDE_EFFECTFUL_INITIALIZER",
            },
            {
                name: "class instances",
                source: "class Box {}; const value = new Box()",
                code: "SIDE_EFFECTFUL_INITIALIZER",
            },
            {
                name: "new expressions",
                source: "const value = new Map()",
                code: "SIDE_EFFECTFUL_INITIALIZER",
            },
            {
                name: "Date references",
                source: "const value = Date",
                code: "SIDE_EFFECTFUL_INITIALIZER",
            },
            {
                name: "Math.random",
                source: "const value = Math.random",
                code: "SIDE_EFFECTFUL_INITIALIZER",
            },
            {
                name: "process.env",
                source: "const value = process.env.NODE_ENV",
                code: "SIDE_EFFECTFUL_INITIALIZER",
            },
            {
                name: "unknown spreads",
                source: "declare const dynamicStyle: Record<string, unknown>; const value = { ...dynamicStyle }",
                code: "UNKNOWN_SPREAD",
            },
            {
                name: "mutated bindings",
                source: "const value = { color: 'text-red-500' }; value.color = 'text-blue-500'",
                code: "MUTATED_BINDING",
            },
            {
                name: "mutated nested aliases",
                source: "const value = { nested: { color: 'text-red-500' } }; const alias = value.nested; alias.color = 'text-blue-500'",
                code: "MUTATED_BINDING",
            },
        ] as const

        for (const testCase of cases) {
            const analyzer = createStaticAnalyzer({
                [app]: `
                    import { createTools } from "tailwindest"
                    const tw = createTools()
                    ${testCase.source}
                    tw.style(value)
                `,
            })

            const result = analyzer.analyzeFile(app)

            expect(result.calls, testCase.name).toEqual([])
            expect(
                result.diagnostics.map((diagnostic) => diagnostic.code),
                testCase.name
            ).toContain(testCase.code)
        }
    })

    it("terminates circular references with a diagnostic and visited dependency edges", () => {
        const analyzer = createStaticAnalyzer({
            "/src/a.ts": `
                import { b } from "./b"
                export const a = b
            `,
            "/src/b.ts": `
                import { a } from "./a"
                export const b = a
            `,
            [app]: `
                import { createTools } from "tailwindest"
                import { a } from "./a"

                const tw = createTools()
                tw.style(a)
            `,
        })

        const result = analyzer.analyzeFile(app)

        expect(result.calls).toEqual([])
        expect(result.dependencies).toEqual(["/src/a.ts", "/src/b.ts"])
        expect(
            result.diagnostics.map((diagnostic) => diagnostic.code)
        ).toContain("CIRCULAR_STATIC_REFERENCE")
    })
})

describe("analyzer performance guards", () => {
    it("scans 500 modules without unbounded recursion and reparses only changed modules", () => {
        const files: Record<string, string> = {
            "/src/module-0.ts": `export const style0 = { color: "text-red-500" } as const`,
            [app]: `
                import { createTools } from "tailwindest"
                import { style499 } from "./module-499"
                const tw = createTools()
                tw.style(style499)
            `,
        }

        for (let index = 1; index < 500; index++) {
            files[`/src/module-${index}.ts`] = `
                import { style${index - 1} } from "./module-${index - 1}"
                export const style${index} = { ...style${index - 1}, index: ${index} } as const
            `
        }

        const analyzer = createStaticAnalyzer(files)
        const result = analyzer.analyzeFile(app)
        const parseCountAfterFirstScan = analyzer.getParseCount()

        expect(result.diagnostics).toEqual([])
        expect(result.calls[0]?.arguments[0]?.value).toMatchObject({
            color: "text-red-500",
            index: 499,
        })

        analyzer.updateFile(
            app,
            files[app]!.replace(
                "tw.style(style499)",
                "tw.style({ color: 'text-blue-500' })"
            )
        )
        analyzer.analyzeFile(app)

        expect(
            analyzer.getParseCount() - parseCountAfterFirstScan
        ).toBeLessThanOrEqual(1)
    })
})
