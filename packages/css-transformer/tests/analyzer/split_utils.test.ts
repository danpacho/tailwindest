import { describe, expect, it } from "vitest"
import {
    extractVariants,
    splitByColon,
    splitClassString,
} from "../../src/analyzer/split_utils"

describe("split_utils", () => {
    describe("splitByColon", () => {
        it("should split by colon", () => {
            expect(splitByColon("dark:hover:bg-accent")).toEqual([
                "dark",
                "hover",
                "bg-accent",
            ])
        })

        it("should protect colon inside brackets (arbitrary variant)", () => {
            expect(splitByColon("[&:hover]:text-sm")).toEqual([
                "[&:hover]",
                "text-sm",
            ])
        })

        it("should protect colon inside brackets (arbitrary value)", () => {
            expect(splitByColon("bg-[color:red]")).toEqual(["bg-[color:red]"])
        })

        it("should handle nested brackets", () => {
            expect(splitByColon("[&>[data-slot=icon]]:size-4")).toEqual([
                "[&>[data-slot=icon]]",
                "size-4",
            ])
        })

        it("should handle empty string", () => {
            expect(splitByColon("")).toEqual([""])
        })
    })

    describe("splitClassString", () => {
        it("should split by space and filter empty strings", () => {
            expect(splitClassString("  flex   items-center  ")).toEqual([
                "flex",
                "items-center",
            ])
        })

        it("should handle empty string", () => {
            expect(splitClassString("")).toEqual([])
        })
    })

    describe("extractVariants", () => {
        it("should extract variants and utility", () => {
            expect(extractVariants("dark:hover:bg-accent")).toEqual({
                variants: ["dark", "hover"],
                utility: "bg-accent",
            })
        })

        it("should handle token without variants", () => {
            expect(extractVariants("flex")).toEqual({
                variants: [],
                utility: "flex",
            })
        })
    })
})
