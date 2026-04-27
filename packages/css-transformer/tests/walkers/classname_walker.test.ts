import { Project, ScriptTarget, SyntaxKind } from "ts-morph"
import { describe, expect, it } from "vitest"
import { ClassNameWalker } from "../../src/walkers/classname_walker"
import { TokenAnalyzerImpl } from "../../src/analyzer/token_analyzer"
import type { CSSPropertyResolver } from "create-tailwind-type"
import { createContext } from "../../src/context/transformer_context"

class MockResolver implements Partial<CSSPropertyResolver> {
    resolveUnambiguous(className: string): string | null {
        if (className === "flex") return "display"
        if (className === "text-sm") return "fontSize"
        return null
    }
}

describe("ClassNameWalker", () => {
    const analyzer = new TokenAnalyzerImpl(
        new MockResolver() as CSSPropertyResolver
    )

    function setup(content: string) {
        const project = new Project({
            compilerOptions: {
                target: ScriptTarget.ESNext,
                jsx: 1 /* Preserve */,
            },
        })
        const sourceFile = project.createSourceFile("test.tsx", content)
        const context = createContext({ analyzer })
        return { sourceFile, context }
    }

    it("should transform string literal className", () => {
        const { sourceFile, context } = setup(
            `const a = <div className="flex text-sm" />`
        )
        const attr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.JsxAttribute
        )!

        const walker = new ClassNameWalker()
        expect(walker.canWalk(attr)).toBe(true)

        walker.walk(attr, context)
        const text = sourceFile.getFullText()

        expect(text).toContain(`className={tw.style({`)
        expect(text).toContain(`display: "flex"`)
        expect(text).toContain(`fontSize: "text-sm"`)
        expect(text).toContain(`}).class()}`)
    })

    it("should transform jsx expression with string literal className", () => {
        const { sourceFile, context } = setup(
            `const a = <div className={"flex"} />`
        )
        const attr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.JsxAttribute
        )!
        const walker = new ClassNameWalker()

        expect(walker.canWalk(attr)).toBe(true)
        walker.walk(attr, context)

        const text = sourceFile.getFullText()
        expect(text).toContain(`className={tw.style({`)
        expect(text).toContain(`display: "flex"`)
        expect(text).toContain(`}).class()}`)
    })

    it("should not transform empty className", () => {
        const { sourceFile, context } = setup(`const a = <div className="" />`)
        const attr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.JsxAttribute
        )!
        const walker = new ClassNameWalker()

        const result = walker.walk(attr, context)
        expect(result.success).toBe(false)
        expect(sourceFile.getFullText()).toContain(`className=""`)
    })
})
