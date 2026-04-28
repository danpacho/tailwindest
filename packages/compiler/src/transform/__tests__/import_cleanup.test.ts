import { describe, expect, it } from "vitest"
import type { CompilerDiagnostic } from "../../core/diagnostic_types"
import { cleanupRuntimeImports } from "../import_cleanup"
import { substituteTailwindest } from "../substitutor"
import type { ReplacementPlan } from "../replacement"

const fileName = "/src/app.ts"

const planFor = (
    code: string,
    source: string,
    text: string,
    candidates: string[] = ["flex"],
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

describe("cleanupRuntimeImports", () => {
    it("removes Tailwindest imports when all runtime tools are compiled away", () => {
        const code = [
            `import { style } from "tailwindest"`,
            `const cls = "flex"`,
        ].join("\n")

        const result = cleanupRuntimeImports({ fileName, code })

        expect(result.code).toBe(`const cls = "flex"`)
        expect(result.changed).toBe(true)
        expect(result.diagnostics).toEqual([])
    })

    it("preserves Tailwindest imports when a fallback call remains", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `const cls = tw.join(dynamicValue)`,
        ].join("\n")

        const result = cleanupRuntimeImports({ fileName, code })

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
    })

    it("preserves unrelated named imports from the same declaration", () => {
        const code = [
            `import { createTools, keepMe } from "tailwindest"`,
            `keepMe()`,
            `const cls = "flex"`,
        ].join("\n")

        const result = cleanupRuntimeImports({ fileName, code })

        expect(result.code).toBe(
            [
                `import { keepMe } from "tailwindest"`,
                `keepMe()`,
                `const cls = "flex"`,
            ].join("\n")
        )
    })

    it("preserves unrelated default imports without leaving empty named bindings", () => {
        const code = [
            `import runtimeDefault, { createTools } from "tailwindest"`,
            `runtimeDefault()`,
            `const cls = "flex"`,
        ].join("\n")

        const result = cleanupRuntimeImports({ fileName, code })

        expect(result.code).toBe(
            [
                `import runtimeDefault from "tailwindest"`,
                `runtimeDefault()`,
                `const cls = "flex"`,
            ].join("\n")
        )
    })

    it("preserves type-only imports", () => {
        const code = [
            `import type { ToolOptions } from "tailwindest"`,
            `const cls = "flex"`,
        ].join("\n")

        const result = cleanupRuntimeImports({ fileName, code })

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
    })

    it("returns original code and diagnostic when import cleanup fails during substitution", () => {
        const code = [
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `const cls = tw.style({ display: "flex" }).class()`,
        ].join("\n")

        const result = substituteTailwindest({
            fileName,
            code,
            plans: [
                planFor(
                    code,
                    `tw.style({ display: "flex" }).class()`,
                    `"flex"`
                ),
            ],
            cleanImports: true,
            cleanupImports: () => {
                throw new Error("cleanup failed")
            },
        })

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(
            result.diagnostics.map((diagnostic) => diagnostic.code)
        ).toContain("IMPORT_CLEANUP_FAILED")
    })

    it("preserves runtime imports during substitution cleanup when a fallback call remains", () => {
        const code = [
            `import { style, join } from "tailwindest"`,
            `const fallback = join(style(dynamicValue).class())`,
            `const exact = style({ display: "flex" }).class()`,
        ].join("\n")
        const fallbackDiagnostic: CompilerDiagnostic = {
            code: "UNSUPPORTED_DYNAMIC_VALUE",
            message: "dynamic value stays at runtime",
            severity: "warning",
        }

        const result = substituteTailwindest({
            fileName,
            code,
            cleanImports: true,
            plans: [
                {
                    ...planFor(
                        code,
                        `join(style(dynamicValue).class())`,
                        `"compiled"`
                    ),
                    kind: "join",
                    candidates: ["compiled"],
                },
                planFor(
                    code,
                    `style(dynamicValue).class()`,
                    `"unused"`,
                    [],
                    [fallbackDiagnostic]
                ),
                planFor(code, `style({ display: "flex" }).class()`, `"flex"`),
            ],
        })

        expect(result.code).toBe(
            [
                `import { style, join } from "tailwindest"`,
                `const fallback = join(style(dynamicValue).class())`,
                `const exact = "flex"`,
            ].join("\n")
        )
        expect(result.diagnostics).toEqual([
            fallbackDiagnostic,
            expect.objectContaining({ code: "OVERLAPPING_REPLACEMENT" }),
        ])
    })
})
