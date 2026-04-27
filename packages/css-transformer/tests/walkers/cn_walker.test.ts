import { Project, ScriptTarget, SyntaxKind } from "ts-morph"
import { describe, expect, it } from "vitest"
import { CnWalker } from "../../src/walkers/cn_walker"
import { TokenAnalyzerImpl } from "../../src/analyzer/token_analyzer"
import type { CSSPropertyResolver } from "create-tailwind-type"
import { createContext } from "../../src/context/transformer_context"

class MockResolver implements Partial<CSSPropertyResolver> {
    resolveUnambiguous(className: string): string | null {
        if (className === "flex") return "display"
        if (className === "text-sm") return "fontSize"
        if (className === "p-4") return "padding"
        return null
    }
}

describe("CnWalker", () => {
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

    it("should transform static only cn call", () => {
        const { sourceFile, context } = setup(`const a = cn("flex text-sm")`)
        const callExpr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.CallExpression
        )!

        const walker = new CnWalker()
        expect(walker.canWalk(callExpr)).toBe(true)

        walker.walk(callExpr, context)
        const text = sourceFile.getFullText()

        expect(text).toContain(`tw.style({`)
        expect(text).toContain(`display: "flex"`)
        expect(text).toContain(`fontSize: "text-sm"`)
        expect(text).toContain(`}).class()`)
    })

    it("should transform dynamic only cn call", () => {
        const { sourceFile, context } = setup(
            `const a = cn(isActive && "bg-blue", props.className)`
        )
        const callExpr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.CallExpression
        )!
        const walker = new CnWalker()

        walker.walk(callExpr, context)
        const text = sourceFile.getFullText()

        expect(text).toContain(
            `tw.join(isActive && "bg-blue", props.className)`
        )
    })

    it("should transform mixed static and dynamic cn call", () => {
        const { sourceFile, context } = setup(
            `const a = cn("flex", isActive && "text-sm", "p-4", props.className)`
        )
        const callExpr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.CallExpression
        )!
        const walker = new CnWalker()

        walker.walk(callExpr, context)
        const text = sourceFile.getFullText()

        // "flex" and "p-4" are static. The rest are dynamic.
        expect(text).toContain(
            `tw.def([isActive && "text-sm", props.className], {`
        )
        expect(text).toContain(`display: "flex"`)
        expect(text).toContain(`padding: "p-4"`)
    })

    it("should support clsx and classNames", () => {
        const { sourceFile } = setup(
            `const a = clsx("flex"); const b = classNames("flex");`
        )
        const callExprs = sourceFile.getDescendantsOfKind(
            SyntaxKind.CallExpression
        )

        const walker = new CnWalker()
        expect(walker.canWalk(callExprs[0]!)).toBe(true)
        expect(walker.canWalk(callExprs[1]!)).toBe(true)
    })
})
