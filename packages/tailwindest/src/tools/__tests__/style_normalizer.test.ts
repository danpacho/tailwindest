import { describe, expect, it } from "vitest"
import { flattenStyleRecord } from "../style_normalizer"

function className(style: unknown): string {
    return flattenStyleRecord(style).join(" ")
}

describe("nested variant style semantics", () => {
    it("prefixes nested dark and hover keys", () => {
        expect(
            className({
                dark: {
                    backgroundColor: "bg-red-900",
                    hover: {
                        backgroundColor: "bg-red-950",
                    },
                },
                backgroundColor: "bg-red-50",
            })
        ).toBe("dark:bg-red-900 dark:hover:bg-red-950 bg-red-50")
    })

    it("does not double-prefix explicitly prefixed leaves", () => {
        expect(
            className({
                dark: {
                    backgroundColor: "dark:bg-red-900",
                    hover: {
                        backgroundColor: "dark:hover:bg-red-950",
                    },
                },
                backgroundColor: "bg-red-50",
            })
        ).toBe("dark:bg-red-900 dark:hover:bg-red-950 bg-red-50")
    })

    it("completes partial prefixes", () => {
        expect(
            className({
                dark: {
                    hover: {
                        backgroundColor: "hover:bg-red-950",
                    },
                },
            })
        ).toBe("dark:hover:bg-red-950")
    })

    it("prefixes arrays without changing order", () => {
        expect(
            className({
                hover: {
                    padding: ["px-2", ["py-1"]],
                },
            })
        ).toBe("hover:px-2 hover:py-1")
    })

    it("does not prefix unknown grouping keys", () => {
        expect(
            className({
                surface: {
                    backgroundColor: "bg-white",
                },
            })
        ).toBe("bg-white")
    })

    it("prefixes responsive, state, container, and arbitrary variant keys", () => {
        expect(
            className({
                md: {
                    hover: {
                        color: "text-blue-600",
                    },
                },
                "@sm": {
                    padding: "px-4",
                },
                "[&>*]": {
                    margin: "mt-2",
                },
            })
        ).toBe("md:hover:text-blue-600 @sm:px-4 [&>*]:mt-2")
    })

    it("prefixes Tailwindest extended nested variant keys", () => {
        expect(className({ "*": { color: "text-red-600" } })).toBe(
            "*:text-red-600"
        )
        expect(className({ "max-sm": { display: "hidden" } })).toBe(
            "max-sm:hidden"
        )
        expect(className({ before: { content: "content-['']" } })).toBe(
            "before:content-['']"
        )
        expect(className({ "aria-expanded": { display: "block" } })).toBe(
            "aria-expanded:block"
        )
    })

    it("prefixes arbitrary data and aria variants", () => {
        expect(
            className({
                "data-[state=open]": {
                    color: "text-blue-600",
                },
                "aria-[expanded=true]": {
                    display: "block",
                },
            })
        ).toBe("data-[state=open]:text-blue-600 aria-[expanded=true]:block")
    })

    it("combines group and peer with nested state variants", () => {
        expect(
            className({
                group: {
                    hover: {
                        backgroundColor: "bg-blue-500",
                    },
                },
                peer: {
                    focus: {
                        color: "text-sky-600",
                    },
                },
                dark: {
                    group: {
                        hover: {
                            backgroundColor: "bg-blue-500",
                        },
                    },
                },
            })
        ).toBe(
            "group-hover:bg-blue-500 peer-focus:text-sky-600 dark:group-hover:bg-blue-500"
        )
    })

    it("preserves explicit legacy variant chains that are not path suffixes", () => {
        expect(
            className({
                "*": {
                    "2xl": {
                        "@2xl": {
                            padding: "**:*:2xl:3xl:4xl:@2xl:px-1000",
                        },
                    },
                },
            })
        ).toBe("**:*:2xl:3xl:4xl:@2xl:px-1000")
    })
})
