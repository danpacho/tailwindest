import { describe, expect, it } from "vitest"
import {
    sanitizeTwClass,
    kebabToCamelCase,
    camelToKebabCase,
    capitalize,
    toValidCSSProperty,
    isTwClassPure,
    isNumericString,
    generateValidator,
} from "../css_property_utils"

describe("css_property_utils", () => {
    describe("sanitizeTwClass", () => {
        it("should remove negative sign and direction suffixes", () => {
            // removes the "-" prefix and single-char direction tokens
            expect(sanitizeTwClass("-px-2")).toBe("px-2")
        })

        it("should not modify class without direction tokens", () => {
            expect(sanitizeTwClass("bg-red-500")).toBe("bg-red-500")
        })

        it("should remove single direction tokens", () => {
            // "x" is a direction token, should be filtered
            expect(sanitizeTwClass("px")).toBe("px")
            // tokens: ["p", "x"] → "x" is direction → removed → "p"
            expect(sanitizeTwClass("p-x")).toBe("p")
        })

        it("should preserve two-char tokens that start with direction", () => {
            // "2xl" is not a direction (length > 1 and not matching)
            expect(sanitizeTwClass("max-2xl")).toBe("max-2xl")
        })

        it("should handle class with only negative sign", () => {
            expect(sanitizeTwClass("-m-4")).toBe("m-4")
        })
    })

    describe("kebabToCamelCase", () => {
        it("should convert kebab-case to camelCase", () => {
            expect(kebabToCamelCase("bg-color")).toBe("bgColor")
        })

        it("should handle single word", () => {
            expect(kebabToCamelCase("display")).toBe("display")
        })

        it("should handle multiple hyphens", () => {
            expect(kebabToCamelCase("border-top-width")).toBe("borderTopWidth")
        })
    })

    describe("camelToKebabCase", () => {
        it("should convert camelCase to kebab-case", () => {
            expect(camelToKebabCase("backgroundColor")).toBe("background-color")
        })

        it("should handle single word", () => {
            expect(camelToKebabCase("display")).toBe("display")
        })
    })

    describe("capitalize", () => {
        it("should capitalize single word", () => {
            expect(capitalize("hello")).toBe("Hello")
        })

        it("should capitalize multiple words and join", () => {
            expect(capitalize("hello", "world")).toBe("HelloWorld")
        })

        it("should handle single character", () => {
            expect(capitalize("a")).toBe("A")
        })

        it("should handle two character word", () => {
            expect(capitalize("ab")).toBe("Ab")
        })
    })

    describe("toValidCSSProperty", () => {
        it("should remove vendor prefix and convert to camelCase", () => {
            expect(toValidCSSProperty("-webkit-transform")).toBe("transform")
        })

        it("should convert kebab to camelCase", () => {
            expect(toValidCSSProperty("background-color")).toBe(
                "backgroundColor"
            )
        })

        it("should handle property without prefix", () => {
            expect(toValidCSSProperty("display")).toBe("display")
        })
    })

    describe("isTwClassPure", () => {
        it("should return true for pure alphabetic class", () => {
            expect(isTwClassPure("background-color")).toBe(true)
        })

        it("should return false for class with numbers", () => {
            expect(isTwClassPure("bg-500")).toBe(false)
        })

        it("should return true for simple class name", () => {
            expect(isTwClassPure("flex")).toBe(true)
        })
    })

    describe("isNumericString", () => {
        it("should return true for integer string", () => {
            expect(isNumericString("42")).toBe(true)
        })

        it("should return true for float string", () => {
            expect(isNumericString("3.14")).toBe(true)
        })

        it("should return false for empty string", () => {
            expect(isNumericString("")).toBe(false)
        })

        it("should return false for whitespace-only string", () => {
            expect(isNumericString("   ")).toBe(false)
        })

        it("should return false for non-numeric string", () => {
            expect(isNumericString("abc")).toBe(false)
        })

        it("should return false for Infinity", () => {
            expect(isNumericString("Infinity")).toBe(false)
        })
    })

    describe("generateValidator", () => {
        it("should generate RegExp for template with ${string}", () => {
            const regex = generateValidator("size-${string}")
            expect(regex).toBeInstanceOf(RegExp)
            expect(regex!.test("size-4")).toBe(true)
            expect(regex!.test("size-full")).toBe(true)
            expect(regex!.test("not-size")).toBe(false)
        })

        it("should return null for plain text without token", () => {
            expect(generateValidator("plain-text")).toBeNull()
        })

        it("should handle template with parentheses", () => {
            const regex = generateValidator("drop-shadow(${string})")
            expect(regex).toBeInstanceOf(RegExp)
            expect(regex!.test("drop-shadow-lg")).toBe(true)
        })

        it("should handle template with multiple tokens", () => {
            const regex = generateValidator("${string}-${string}")
            expect(regex).toBeInstanceOf(RegExp)
            expect(regex!.test("a-b")).toBe(true)
        })
    })
})
