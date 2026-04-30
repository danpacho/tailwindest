import { describe, expect, it } from "vitest"
import { flattenCompiledStyleRecord } from "../compiled_style_normalizer"
import { createCompiledVariantResolver } from "../compiled_variant_resolver"

function className(
    style: unknown,
    metadata: readonly string[] | undefined = undefined
): string {
    return flattenCompiledStyleRecord(
        style,
        metadata
            ? { variantResolver: createCompiledVariantResolver(metadata) }
            : {}
    ).join(" ")
}

describe("compiled style normalizer", () => {
    it("does not prefix default Tailwind variant names without metadata", () => {
        expect(
            className({
                default: {
                    color: "text-zinc-900",
                },
                dark: {
                    color: "text-white",
                },
                hover: {
                    color: "text-blue-500",
                },
            })
        ).toBe("text-zinc-900 text-white text-blue-500")
    })

    it("prefixes nested compiled variant paths from metadata", () => {
        expect(
            className(
                {
                    dark: {
                        color: "text-white",
                        hover: {
                            color: "text-blue-500",
                        },
                    },
                },
                ["dark", "hover"]
            )
        ).toBe("dark:text-white dark:hover:text-blue-500")
    })

    it("prefixes custom metadata variants and does not prefix them when missing", () => {
        expect(
            className(
                {
                    surface: {
                        color: "text-slate-900",
                    },
                },
                ["surface"]
            )
        ).toBe("surface:text-slate-900")

        expect(
            className(
                {
                    surface: {
                        color: "text-slate-900",
                    },
                },
                ["hover"]
            )
        ).toBe("text-slate-900")
    })

    it("combines compound variants only when the combined key exists in metadata", () => {
        expect(
            className(
                {
                    group: {
                        hover: {
                            backgroundColor: "bg-blue-500",
                        },
                    },
                },
                ["hover"]
            )
        ).toBe("hover:bg-blue-500")

        expect(
            className(
                {
                    group: {
                        hover: {
                            backgroundColor: "bg-blue-500",
                        },
                    },
                },
                ["group", "hover", "group-hover"]
            )
        ).toBe("group-hover:bg-blue-500")
    })

    it("supports arbitrary variants only when metadata contains them", () => {
        expect(
            className(
                {
                    "[&>*]": {
                        margin: "mt-2",
                    },
                },
                ["[&>*]"]
            )
        ).toBe("[&>*]:mt-2")

        expect(
            className(
                {
                    "[&>*]": {
                        margin: "mt-2",
                    },
                },
                []
            )
        ).toBe("mt-2")
    })

    it("preserves explicit prefixes and completes suffix prefixes", () => {
        expect(
            className(
                {
                    dark: {
                        backgroundColor: "dark:bg-red-900",
                        hover: {
                            backgroundColor: "hover:bg-red-950",
                        },
                    },
                },
                ["dark", "hover"]
            )
        ).toBe("dark:bg-red-900 dark:hover:bg-red-950")
    })
})
