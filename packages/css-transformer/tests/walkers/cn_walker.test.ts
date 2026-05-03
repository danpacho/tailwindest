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
        if (className === "bg-accent") return "backgroundColor"
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

        expect(text).toContain(`globalDiv.class()`)
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
            `globalDiv.class(isActive && "text-sm", props.className)`
        )
    })

    it("should respect objectThreshold config", () => {
        const { sourceFile } = setup(`const a = cn("flex text-sm")`)
        const callExpr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.CallExpression
        )!

        // Set threshold to 3. Current call has 2 properties (display, fontSize).
        const context = createContext({ analyzer })
        const walker = new CnWalker({ objectThreshold: 3 })

        walker.walk(callExpr, context)
        const text = sourceFile.getFullText()

        expect(text).toContain(`tw.join("flex text-sm")`)
        expect(text).not.toContain(`tw.style`)
    })

    it("should extract complex styles into constants", () => {
        const { sourceFile } = setup(`
            export function MyComponent() {
                return <div className={cn("flex text-sm p-4")} />
            }
        `)
        const callExpr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.CallExpression
        )!

        // Set threshold to 2. Current has 3 properties (display, fontSize, padding).
        const context = createContext({ analyzer })
        const walker = new CnWalker({ objectThreshold: 2 })

        walker.walk(callExpr, context)

        // Manual post-process simulation for test
        const extracted = context.styles.getStyles()
        expect(extracted).toHaveLength(1)
        expect(extracted[0]![0]).toBe("myComponentDiv")

        const text = sourceFile.getFullText()
        expect(text).toContain(`className={myComponentDiv.class()}`)
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

    it("should preserve nested variant prefixes in runtime output", () => {
        const { sourceFile, context } = setup(
            `const a = cn("dark:hover:bg-accent flex")`
        )
        const callExpr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.CallExpression
        )!
        const walker = new CnWalker()

        walker.walk(callExpr, context)

        const style = context.styles.getStyles()[0]?.[1].style
        expect(style).toEqual({
            dark: {
                hover: {
                    backgroundColor: "dark:hover:bg-accent",
                },
            },
            display: "flex",
        })
    })
})
