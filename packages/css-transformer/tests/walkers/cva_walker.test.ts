import { Project, ScriptTarget, SyntaxKind } from "ts-morph"
import { describe, expect, it } from "vitest"
import { CvaWalker } from "../../src/walkers/cva_walker"
import { TokenAnalyzerImpl } from "../../src/analyzer/token_analyzer"
import type { CSSPropertyResolver } from "create-tailwind-type"
import { createContext } from "../../src/context/transformer_context"

class MockResolver implements Partial<CSSPropertyResolver> {
    resolveUnambiguous(className: string): string | null {
        if (className === "flex") return "display"
        if (className === "items-center") return "alignItems"
        if (className === "bg-blue-500") return "backgroundColor"
        if (className === "bg-gray-500") return "backgroundColor"
        if (className === "text-lg") return "fontSize"
        return null
    }
}

describe("CvaWalker", () => {
    const analyzer = new TokenAnalyzerImpl(
        new MockResolver() as CSSPropertyResolver
    )

    function setup(content: string) {
        const project = new Project({
            compilerOptions: { target: ScriptTarget.ESNext },
        })
        const sourceFile = project.createSourceFile("test.ts", content)
        const context = createContext({ analyzer })
        return { sourceFile, context }
    }

    it("should transform basic cva call", () => {
        const { sourceFile, context } = setup(
            `const a = cva("flex items-center")`
        )
        const callExpr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.CallExpression
        )! // CallExpression

        const walker = new CvaWalker()
        expect(walker.canWalk(callExpr)).toBe(true)

        const result = walker.walk(callExpr, context)
        expect(result.success).toBe(true)
        expect(result.transformed).toContain(`tw.variants({`)
        expect(result.transformed).toContain(`display: "flex"`)
        expect(result.transformed).toContain(`alignItems: "items-center"`)
    })

    it("should transform cva with variants", () => {
        const { sourceFile, context } = setup(`
            const btn = cva("flex", {
                variants: {
                    intent: {
                        primary: "bg-blue-500",
                        secondary: "bg-gray-500"
                    }
                }
            })
        `)
        const callExpr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.CallExpression
        )!
        const walker = new CvaWalker()

        walker.walk(callExpr, context)
        const text = sourceFile.getFullText()

        expect(text).toContain(`tw.variants({`)
        expect(text).toContain(`display: "flex"`)
        expect(text).toContain(`variants: {`)
        expect(text).toContain(`intent: {`)
        expect(text).toContain(`primary: {`)
        expect(text).toContain(`backgroundColor: "bg-blue-500"`)
    })

    it("should preserve defaultVariants and compoundVariants as JSDoc", () => {
        const { sourceFile, context } = setup(`
            const btn = cva("flex", {
                defaultVariants: { intent: "primary" },
                compoundVariants: [{ intent: "primary", class: "text-lg" }]
            })
        `)
        const callExpr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.CallExpression
        )!
        const walker = new CvaWalker()

        walker.walk(callExpr, context)
        const text = sourceFile.getFullText()

        expect(text).toContain(`* @defaultVariants { intent: "primary" }`)
        expect(text).toContain(
            `* @compoundVariants [{ intent: "primary", class: "text-lg" }]`
        )
        expect(text).toContain(`tw.variants({`)
    })

    it("should preserve nested variant prefixes in runtime output", () => {
        const { sourceFile, context } = setup(`
            const btn = cva("dark:hover:bg-blue-500", {
                variants: {
                    intent: {
                        primary: "dark:hover:bg-gray-500"
                    }
                }
            })
        `)
        const callExpr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.CallExpression
        )!
        const walker = new CvaWalker()

        walker.walk(callExpr, context)
        const text = sourceFile.getFullText()

        expect(text).toContain(`backgroundColor: "dark:hover:bg-blue-500"`)
        expect(text).toContain(`backgroundColor: "dark:hover:bg-gray-500"`)
    })
})
