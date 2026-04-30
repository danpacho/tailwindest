import { describe, expect, it } from "vitest"
import { flattenStyleRecord } from "../style_normalizer"

function className(style: unknown): string {
    return flattenStyleRecord(style).join(" ")
}

describe("structural style normalizer semantics", () => {
    it("ignores nested variant-like keys and preserves authored leaf tokens", () => {
        expect(
            className({
                dark: {
                    color: "text-white",
                },
                hover: {
                    color: "text-blue-500",
                },
                "group-hover": {
                    color: "text-blue-500",
                },
                default: {
                    color: "text-zinc-900",
                },
                "#hover": {
                    color: "text-red-500",
                },
            })
        ).toBe(
            "text-white text-blue-500 text-blue-500 text-zinc-900 text-red-500"
        )
    })

    it("preserves already-prefixed runtime leaf tokens", () => {
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

    it("splits strings and arrays without applying object-path prefixes", () => {
        expect(
            className({
                hover: {
                    padding: ["px-2 py-1", ["mx-1"]],
                },
            })
        ).toBe("px-2 py-1 mx-1")
    })

    it("ignores unknown grouping keys", () => {
        expect(
            className({
                surface: {
                    backgroundColor: "bg-white",
                },
            })
        ).toBe("bg-white")
    })
})
