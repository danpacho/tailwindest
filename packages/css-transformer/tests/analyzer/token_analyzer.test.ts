import type { CSSPropertyResolver } from "create-tailwind-type"
import { describe, expect, it } from "vitest"
import { TokenAnalyzerImpl } from "../../src/analyzer/token_analyzer"

// Mock CSSPropertyResolver
class MockResolver implements Partial<CSSPropertyResolver> {
    resolveUnambiguous(className: string): string | null {
        if (className === "flex") return "display"
        if (className === "relative") return "position"
        if (className === "bg-accent") return "backgroundColor"
        if (className === "text-sm") return "fontSize"
        if (className === "text-xs/relaxed") return "fontSize"
        if (className === "text-primary-foreground") return "color"
        if (className === "text-accent-foreground") return "color"
        if (className === "text-accent-foreground!") return "color"
        if (className === "p-4" || className === "p-2") return "padding"
        if (className === "w-(--popup-width)") return "width"
        if (className === "gap-(--card-spacing)") return "gap"
        if (className === "backdrop-blur-xs") return "backdropFilter"
        if (className === "z-50") return "zIndex"
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

    describe("plan", () => {
        it("should preserve every token while classifying structured tokens", () => {
            const analyzer = new TokenAnalyzerImpl(resolver)
            const source = "flex group/card hover:bg-accent unknown-xyz"
            const plan = analyzer.plan(source)

            expect(plan.source).toBe(source)
            expect(plan.tokens).toEqual([
                {
                    original: "flex",
                    utility: "flex",
                    variants: [],
                    property: "display",
                    kind: "structured",
                    index: 0,
                },
                {
                    original: "group/card",
                    utility: "group/card",
                    variants: [],
                    property: null,
                    warning:
                        "Could not resolve property for utility: group/card",
                    kind: "preserved",
                    index: 1,
                    reason: "unresolved-property",
                },
                {
                    original: "hover:bg-accent",
                    utility: "bg-accent",
                    variants: ["hover"],
                    property: "backgroundColor",
                    kind: "structured",
                    index: 2,
                },
                {
                    original: "unknown-xyz",
                    utility: "unknown-xyz",
                    variants: [],
                    property: null,
                    warning:
                        "Could not resolve property for utility: unknown-xyz",
                    kind: "preserved",
                    index: 3,
                    reason: "unresolved-property",
                },
            ])
            expect(plan.structuredTokens).toEqual([
                plan.tokens[0],
                plan.tokens[2],
            ])
            expect(plan.preservedTokens).toEqual([
                plan.tokens[1],
                plan.tokens[3],
            ])
            expect(plan.styleTree).toEqual({
                display: "flex",
                hover: {
                    backgroundColor: "hover:bg-accent",
                },
            })
            expect(plan.styleTree).toEqual(
                analyzer.buildObjectTree(plan.structuredTokens)
            )
        })

        it("should preserve arbitrary declarations while structuring resolved utilities", () => {
            const analyzer = new TokenAnalyzerImpl(resolver)
            const source =
                "gap-(--card-spacing) data-[size=sm]:[--card-spacing:--spacing(4)]"
            const plan = analyzer.plan(source)

            expect(plan.tokens).toEqual([
                {
                    original: "gap-(--card-spacing)",
                    utility: "gap-(--card-spacing)",
                    variants: [],
                    property: "gap",
                    kind: "structured",
                    index: 0,
                },
                {
                    original: "data-[size=sm]:[--card-spacing:--spacing(4)]",
                    utility: "[--card-spacing:--spacing(4)]",
                    variants: ["data-[size=sm]"],
                    property: null,
                    warning:
                        "Could not resolve property for utility: [--card-spacing:--spacing(4)]",
                    kind: "preserved",
                    index: 1,
                    reason: "unresolved-property",
                },
            ])
            expect(plan.structuredTokens).toEqual([plan.tokens[0]])
            expect(plan.preservedTokens).toEqual([plan.tokens[1]])
            expect(plan.styleTree).toEqual({
                gap: "gap-(--card-spacing)",
            })
            expect(plan.styleTree).toEqual(
                analyzer.buildObjectTree(plan.structuredTokens)
            )
        })

        it("should normalize array source while preserving token classification", () => {
            const analyzer = new TokenAnalyzerImpl(resolver)
            const plan = analyzer.plan(["flex", "hover:bg-accent"])

            expect(plan.source).toBe("flex hover:bg-accent")
            expect(plan.tokens).toHaveLength(2)
            expect(plan.structuredTokens).toEqual(plan.tokens)
            expect(plan.preservedTokens).toEqual([])
            expect(plan.styleTree).toEqual({
                display: "flex",
                hover: {
                    backgroundColor: "hover:bg-accent",
                },
            })
        })

        it("should classify typography and semantic color tokens independently", () => {
            const analyzer = new TokenAnalyzerImpl(resolver)
            const plan = analyzer.plan(
                "text-xs/relaxed text-primary-foreground"
            )

            expect(plan.preservedTokens).toEqual([])
            expect(plan.styleTree).toEqual({
                fontSize: "text-xs/relaxed",
                color: "text-primary-foreground",
            })
        })

        it("should preserve resolved tokens with type-unsafe variant chains", () => {
            const analyzer = new TokenAnalyzerImpl(resolver)
            const source = [
                "relative",
                "w-(--popup-width)",
                "xs:w-(--popup-width)",
                "group-focus/context-menu-item:text-accent-foreground",
                "peer-hover/menu-button:text-accent-foreground",
                "**:data-[slot=kbd]:z-50",
                "supports-backdrop-filter:backdrop-blur-xs",
            ].join(" ")
            const plan = analyzer.plan(source)

            expect(
                plan.structuredTokens.map((token) => token.original)
            ).toEqual(["relative", "w-(--popup-width)"])
            expect(plan.preservedTokens).toEqual([
                expect.objectContaining({
                    original: "xs:w-(--popup-width)",
                    reason: "unsafe-serialization",
                }),
                expect.objectContaining({
                    original:
                        "group-focus/context-menu-item:text-accent-foreground",
                    reason: "unsafe-serialization",
                }),
                expect.objectContaining({
                    original: "peer-hover/menu-button:text-accent-foreground",
                    reason: "unsafe-serialization",
                }),
                expect.objectContaining({
                    original: "**:data-[slot=kbd]:z-50",
                    reason: "unsafe-serialization",
                }),
                expect.objectContaining({
                    original: "supports-backdrop-filter:backdrop-blur-xs",
                    reason: "unsafe-serialization",
                }),
            ])
            expect(plan.styleTree).toEqual({
                position: "relative",
                width: "w-(--popup-width)",
            })
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

        it("should apply group prefix", () => {
            const analyzer = new TokenAnalyzerImpl(resolver, "$")
            const tokens = analyzer.analyze("hover:bg-accent")
            expect(analyzer.buildObjectTree(tokens)).toEqual({
                $hover: {
                    backgroundColor: "hover:bg-accent",
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
