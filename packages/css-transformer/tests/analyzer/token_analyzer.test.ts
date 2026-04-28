import type { CSSPropertyResolver } from "create-tailwind-type"
import { describe, expect, it } from "vitest"
import { TokenAnalyzerImpl } from "../../src/analyzer/token_analyzer"

// Mock CSSPropertyResolver
class MockResolver implements Partial<CSSPropertyResolver> {
    resolveUnambiguous(className: string): string | null {
        if (className === "flex") return "display"
        if (className === "bg-accent") return "backgroundColor"
        if (className === "text-sm") return "fontSize"
        if (className === "p-4" || className === "p-2") return "padding"
        return null // unknown
    }
}

describe("TokenAnalyzerImpl", () => {
    const resolver = new MockResolver() as CSSPropertyResolver

    describe("analyze", () => {
        it("should analyze basic string", () => {
            const analyzer = new TokenAnalyzerImpl(resolver)
            const result = analyzer.analyze(
                "flex hover:bg-accent text-sm unknown-xyz"
            )

            expect(result).toHaveLength(4)
            expect(result[0]).toEqual({
                original: "flex",
                utility: "flex",
                variants: [],
                property: "display",
            })
            expect(result[1]).toEqual({
                original: "hover:bg-accent",
                utility: "bg-accent",
                variants: ["hover"],
                property: "backgroundColor",
            })
            expect(result[2]).toEqual({
                original: "text-sm",
                utility: "text-sm",
                variants: [],
                property: "fontSize",
            })
            expect(result[3]).toEqual({
                original: "unknown-xyz",
                utility: "unknown-xyz",
                variants: [],
                property: null,
                warning: "Could not resolve property for utility: unknown-xyz",
            })
        })

        it("should accept array of strings", () => {
            const analyzer = new TokenAnalyzerImpl(resolver)
            const result = analyzer.analyze(["flex", "hover:bg-accent"])
            expect(result).toHaveLength(2)
        })

        it("should handle empty input", () => {
            const analyzer = new TokenAnalyzerImpl(resolver)
            expect(analyzer.analyze("")).toEqual([])
            expect(analyzer.analyze([])).toEqual([])
        })
    })

    describe("buildObjectTree", () => {
        it("should build basic object tree", () => {
            const analyzer = new TokenAnalyzerImpl(resolver)
            const tokens = analyzer.analyze("flex")
            expect(analyzer.buildObjectTree(tokens)).toEqual({
                display: "flex",
            })
        })

        it("should build nested variants", () => {
            const analyzer = new TokenAnalyzerImpl(resolver)
            const tokens = analyzer.analyze("hover:bg-accent")
            expect(analyzer.buildObjectTree(tokens)).toEqual({
                hover: {
                    backgroundColor: "hover:bg-accent",
                },
            })
        })

        it("should build compiled nested variants with raw leaf utilities", () => {
            const analyzer = new TokenAnalyzerImpl(resolver)
            const tokens = analyzer.analyze("hover:bg-accent")
            expect(
                analyzer.buildObjectTree(tokens, { outputMode: "compiled" })
            ).toEqual({
                hover: {
                    backgroundColor: "bg-accent",
                },
            })
        })

        it("should build deeply nested variants", () => {
            const analyzer = new TokenAnalyzerImpl(resolver)
            const tokens = analyzer.analyze("dark:hover:bg-accent")
            expect(analyzer.buildObjectTree(tokens)).toEqual({
                dark: {
                    hover: {
                        backgroundColor: "dark:hover:bg-accent",
                    },
                },
            })
        })

        it("should build compiled deeply nested variants with raw leaf utilities", () => {
            const analyzer = new TokenAnalyzerImpl(resolver)
            const tokens = analyzer.analyze("dark:hover:bg-accent")
            expect(
                analyzer.buildObjectTree(tokens, { outputMode: "compiled" })
            ).toEqual({
                dark: {
                    hover: {
                        backgroundColor: "bg-accent",
                    },
                },
            })
        })

        it("should handle multiple keys", () => {
            const analyzer = new TokenAnalyzerImpl(resolver)
            const tokens = analyzer.analyze("flex hover:bg-accent text-sm")
            expect(analyzer.buildObjectTree(tokens)).toEqual({
                display: "flex",
                hover: {
                    backgroundColor: "hover:bg-accent",
                },
                fontSize: "text-sm",
            })
        })

        it("should ignore unresolved tokens", () => {
            const analyzer = new TokenAnalyzerImpl(resolver)
            const tokens = analyzer.analyze("flex unknown-xyz")
            expect(analyzer.buildObjectTree(tokens)).toEqual({
                display: "flex",
            })
        })

        it("should handle key collision with array promotion", () => {
            const analyzer = new TokenAnalyzerImpl(resolver)
            const tokens = analyzer.analyze("p-4 p-2")
            expect(analyzer.buildObjectTree(tokens)).toEqual({
                padding: ["p-4", "p-2"],
            })
        })

        it("should handle compiled variant key collisions with raw leaf utilities", () => {
            const analyzer = new TokenAnalyzerImpl(resolver)
            const tokens = analyzer.analyze("hover:p-4 hover:p-2")
            expect(
                analyzer.buildObjectTree(tokens, { outputMode: "compiled" })
            ).toEqual({
                hover: {
                    padding: ["p-4", "p-2"],
                },
            })
        })

        it("should apply group prefix", () => {
            const analyzer = new TokenAnalyzerImpl(resolver, "$")
            const tokens = analyzer.analyze("hover:bg-accent")
            expect(analyzer.buildObjectTree(tokens)).toEqual({
                $hover: {
                    backgroundColor: "hover:bg-accent",
                },
            })
        })

        it("should apply group prefix in compiled mode without prefixing leaf utilities", () => {
            const analyzer = new TokenAnalyzerImpl(resolver, "$")
            const tokens = analyzer.analyze("hover:bg-accent")
            expect(
                analyzer.buildObjectTree(tokens, { outputMode: "compiled" })
            ).toEqual({
                $hover: {
                    backgroundColor: "bg-accent",
                },
            })
        })

        it("should apply group prefix only on variants", () => {
            const analyzer = new TokenAnalyzerImpl(resolver, "$")
            const tokens = analyzer.analyze("flex hover:bg-accent")
            expect(analyzer.buildObjectTree(tokens)).toEqual({
                display: "flex",
                $hover: {
                    backgroundColor: "hover:bg-accent",
                },
            })
        })
    })
})
