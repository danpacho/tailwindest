import { describe, expect, it } from "vitest"
import type { CompilerDiagnostic } from "../../core/diagnostic_types"
import { substituteTailwindest } from "../substitutor"
import type { ReplacementPlan } from "../replacement"

const fileName = "/src/app.tsx"

const planFor = (
    code: string,
    source: string,
    text: string,
    candidates: string[] = [],
    diagnostics: CompilerDiagnostic[] = []
): ReplacementPlan => {
    const start = code.indexOf(source)
    if (start < 0) {
        throw new Error(`Missing source: ${source}`)
    }

    return {
        span: { fileName, start, end: start + source.length },
        text,
        priority: 0,
        kind: "style",
        candidates,
        diagnostics,
    }
}

describe("substituteTailwindest", () => {
    it("returns original code and diagnostic for invalid spans", () => {
        const code = `const cls = tw.style({ display: "flex" }).class()`
        const result = substituteTailwindest({
            fileName,
            code,
            plans: [
                {
                    span: { fileName, start: -1, end: 10 },
                    text: `"flex"`,
                    priority: 0,
                    kind: "style",
                    candidates: ["flex"],
                    diagnostics: [],
                },
            ],
        })

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(
            result.diagnostics.map((diagnostic) => diagnostic.code)
        ).toContain("INVALID_REPLACEMENT_SPAN")
    })

    it("returns original code and diagnostic when generated syntax is invalid", () => {
        const code = `const cls = tw.style({ display: "flex" }).class()`
        const result = substituteTailwindest({
            fileName,
            code,
            plans: [
                planFor(code, `tw.style({ display: "flex" }).class()`, `"flex`),
            ],
        })

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(
            result.diagnostics.map((diagnostic) => diagnostic.code)
        ).toContain("INVALID_REPLACEMENT_SYNTAX")
    })

    it("applies multiple independent replacements from the end of the file", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `const first = tw.style({ display: "flex" }).class()`,
            `const second = tw.join("px-2", "py-1")`,
        ].join("\n")

        const result = substituteTailwindest({
            fileName,
            code,
            plans: [
                planFor(
                    code,
                    `tw.style({ display: "flex" }).class()`,
                    `"flex"`,
                    ["flex"]
                ),
                {
                    ...planFor(code, `tw.join("px-2", "py-1")`, `"px-2 py-1"`, [
                        "px-2",
                        "py-1",
                    ]),
                    kind: "join",
                },
            ],
            cleanImports: false,
        })

        expect(result.code).toBe(
            [
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `const first = "flex"`,
                `const second = "px-2 py-1"`,
            ].join("\n")
        )
        expect(result.candidates).toEqual(["flex", "px-2", "py-1"])
        expect(result.changed).toBe(true)
    })

    it("keeps the outer nested replacement when it accounts for inner candidates", () => {
        const code = `const cls = tw.join(tw.style({ display: "flex" }).class(), tw.style({ color: "red" }).class())`
        const outerSource = `tw.join(tw.style({ display: "flex" }).class(), tw.style({ color: "red" }).class())`
        const innerOne = `tw.style({ display: "flex" }).class()`
        const innerTwo = `tw.style({ color: "red" }).class()`

        const result = substituteTailwindest({
            fileName,
            code,
            plans: [
                {
                    ...planFor(code, outerSource, `"flex text-red-500"`, [
                        "flex",
                        "text-red-500",
                    ]),
                    kind: "join",
                },
                planFor(code, innerOne, `"flex"`, ["flex"]),
                planFor(code, innerTwo, `"text-red-500"`, ["text-red-500"]),
            ],
        })

        expect(result.code).toBe(`const cls = "flex text-red-500"`)
        expect(result.diagnostics).toEqual([])
        expect(result.candidates).toEqual(["flex", "text-red-500"])
    })

    it("leaves unsafe overlapping replacements unchanged and emits a diagnostic", () => {
        const code = `const cls = tw.join("a", "b")`
        const result = substituteTailwindest({
            fileName,
            code,
            plans: [
                {
                    ...planFor(code, `tw.join("a", "b")`, `"a b"`, ["a"]),
                    kind: "join",
                },
                { ...planFor(code, `"a", "b"`, `"x"`, ["x"]), kind: "join" },
            ],
        })

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(
            result.diagnostics.map((diagnostic) => diagnostic.code)
        ).toContain("OVERLAPPING_REPLACEMENT")
    })

    it("replaces spans at the beginning and end of a file", () => {
        const code = `tw.join("start")\nconst middle = 1\ntw.join("end")`

        const result = substituteTailwindest({
            fileName,
            code,
            plans: [
                {
                    ...planFor(code, `tw.join("start")`, `"start"`, ["start"]),
                    kind: "join",
                },
                {
                    ...planFor(code, `tw.join("end")`, `"end"`, ["end"]),
                    kind: "join",
                },
            ],
        })

        expect(result.code).toBe(`"start"\nconst middle = 1\n"end"`)
        expect(result.candidates).toEqual(["start", "end"])
    })

    it("preserves formatting outside replacement spans", () => {
        const code = [
            `const before = 1`,
            `// keep comment before`,
            `const cls = tw.style({`,
            `    display: "flex",`,
            `    color: "red",`,
            `}).class()`,
            ``,
            `    const spaced = true`,
            `// keep comment after`,
        ].join("\n")

        const result = substituteTailwindest({
            fileName,
            code,
            plans: [
                planFor(
                    code,
                    [
                        `tw.style({`,
                        `    display: "flex",`,
                        `    color: "red",`,
                        `}).class()`,
                    ].join("\n"),
                    `"flex text-red-500"`
                ),
            ],
        })

        expect(result.code).toMatchInlineSnapshot(`
          "const before = 1
          // keep comment before
          const cls = "flex text-red-500"

              const spaced = true
          // keep comment after"
        `)
    })

    it("keeps JSX expressions valid after substitution", () => {
        const code = `export const App = () => <div className={tw.style({ display: "flex" }).class()} />`
        const result = substituteTailwindest({
            fileName,
            code,
            plans: [
                planFor(
                    code,
                    `tw.style({ display: "flex" }).class()`,
                    `"flex"`,
                    ["flex"]
                ),
            ],
        })

        expect(result.code).toBe(
            `export const App = () => <div className={"flex"} />`
        )
        expect(result.changed).toBe(true)
        expect(result.diagnostics).toEqual([])
    })

    it("leaves fallback calls unchanged while preserving their diagnostics", () => {
        const code = `const cls = tw.join(dynamicValue)`
        const fallbackDiagnostic: CompilerDiagnostic = {
            code: "UNSUPPORTED_DYNAMIC_VALUE",
            message: "dynamic value stays at runtime",
            severity: "warning",
        }

        const result = substituteTailwindest({
            fileName,
            code,
            plans: [
                {
                    ...planFor(
                        code,
                        `tw.join(dynamicValue)`,
                        `"unused"`,
                        [],
                        [fallbackDiagnostic]
                    ),
                    kind: "join",
                },
            ],
        })

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(result.diagnostics).toEqual([fallbackDiagnostic])
    })

    it("protects fallback spans from overlapping outer exact replacements", () => {
        const code = `const cls = tw.join(tw.style(dynamicValue).class())`
        const fallbackDiagnostic: CompilerDiagnostic = {
            code: "UNSUPPORTED_DYNAMIC_VALUE",
            message: "dynamic value stays at runtime",
            severity: "warning",
        }

        const result = substituteTailwindest({
            fileName,
            code,
            plans: [
                {
                    ...planFor(
                        code,
                        `tw.join(tw.style(dynamicValue).class())`,
                        `"compiled"`,
                        ["compiled"]
                    ),
                    kind: "join",
                },
                planFor(
                    code,
                    `tw.style(dynamicValue).class()`,
                    `"unused"`,
                    [],
                    [fallbackDiagnostic]
                ),
            ],
        })

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(result.diagnostics).toEqual([
            fallbackDiagnostic,
            expect.objectContaining({ code: "OVERLAPPING_REPLACEMENT" }),
        ])
    })

    it("applies independent exact replacements that do not overlap protected fallback spans", () => {
        const code = [
            `const fallback = tw.join(tw.style(dynamicValue).class())`,
            `const exact = tw.style({ display: "flex" }).class()`,
        ].join("\n")
        const fallbackDiagnostic: CompilerDiagnostic = {
            code: "UNSUPPORTED_DYNAMIC_VALUE",
            message: "dynamic value stays at runtime",
            severity: "warning",
        }

        const result = substituteTailwindest({
            fileName,
            code,
            plans: [
                {
                    ...planFor(
                        code,
                        `tw.join(tw.style(dynamicValue).class())`,
                        `"compiled"`,
                        ["compiled"]
                    ),
                    kind: "join",
                },
                planFor(
                    code,
                    `tw.style(dynamicValue).class()`,
                    `"unused"`,
                    [],
                    [fallbackDiagnostic]
                ),
                planFor(
                    code,
                    `tw.style({ display: "flex" }).class()`,
                    `"flex"`,
                    ["flex"]
                ),
            ],
        })

        expect(result.code).toBe(
            [
                `const fallback = tw.join(tw.style(dynamicValue).class())`,
                `const exact = "flex"`,
            ].join("\n")
        )
        expect(result.changed).toBe(true)
        expect(result.candidates).toEqual(["flex"])
        expect(result.diagnostics).toEqual([
            fallbackDiagnostic,
            expect.objectContaining({ code: "OVERLAPPING_REPLACEMENT" }),
        ])
    })
})
