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
        if (className === "bg-accent") return "backgroundColor"
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

    function setupCompiled(content: string) {
        const project = new Project({
            compilerOptions: {
                target: ScriptTarget.ESNext,
                jsx: 1 /* Preserve */,
            },
        })
        const sourceFile = project.createSourceFile("test.tsx", content)
        const context = createContext({ analyzer, outputMode: "compiled" })
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

        expect(text).toContain(`className={globalDiv.class()}`)
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
        expect(text).toContain(`className={globalDiv.class()}`)
    })

    it("should respect objectThreshold config", () => {
        const { sourceFile } = setup(
            `const a = <div className="flex text-sm" />`
        )
        const attr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.JsxAttribute
        )!

        // Set threshold to 3. Current has 2 properties (display, fontSize).
        const context = createContext({ analyzer })
        const walker = new ClassNameWalker({ objectThreshold: 3 })

        walker.walk(attr, context)
        const text = sourceFile.getFullText()

        expect(text).toContain(`className={tw.join("flex text-sm")}`)
        expect(text).not.toContain(`tw.style`)
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

    it("should strip nested variant prefixes in compiled mode", () => {
        const { sourceFile, context } = setupCompiled(
            `const a = <div className="dark:hover:bg-accent" />`
        )
        const attr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.JsxAttribute
        )!
        const walker = new ClassNameWalker()

        walker.walk(attr, context)

        const style = context.styles.getStyles()[0]?.[1].style
        expect(style).toEqual({
            dark: {
                hover: {
                    backgroundColor: "bg-accent",
                },
            },
        })
    })
})
