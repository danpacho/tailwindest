import { describe, it, expect, vi, beforeEach } from "vitest"
import { Styler } from "../styler" // Adjust path as needed
import type { AdditionalClassTokens, Merger } from "../merger_interface"

// Mock implementation of Styler for testing abstract methods
class TestStyler extends Styler<string, Record<string, unknown>> {
    public class(
        key: string,
        ...extraClassNames: AdditionalClassTokens<string>
    ): string {
        return this.merge(key, ...extraClassNames)
    }

    public style(key: string, extraStyle?: Record<string, unknown>): unknown {
        return { [key]: extraStyle || "test" }
    }

    public compose(...styles: Array<Record<string, unknown>>): unknown {
        return Styler.deepMerge(...styles)
    }
}

describe("Styler", () => {
    describe("merger", () => {
        it("uses default merger when none set", () => {
            const styler = new TestStyler()
            expect(styler.merge("a", "b", ["d e f", "g", "h"], "i")).toBe(
                "a b d e f g h i"
            )
        })

        it("uses custom merger when set", () => {
            const styler = new TestStyler()
            const customMerger: Merger = vi.fn((...classes) =>
                classes.join("-")
            )
            styler.setMerger(customMerger)
            expect(styler.merge("a", "b")).toBe("a-b")
            expect(customMerger).toHaveBeenCalledWith("a", "b")
        })
    })

    describe("flattenRecord", () => {
        it("flattens nested record to string array", () => {
            const input = {
                a: "class1",
                b: {
                    c: "class2",
                    d: {
                        e: "class3",
                    },
                },
            }
            const result = Styler.flattenRecord(input)
            expect(result).toEqual(["class1", "class2", "class3"])
        })

        it("handles empty object", () => {
            expect(Styler.flattenRecord({})).toEqual([])
        })

        it("handles undefined", () => {
            expect(Styler.flattenRecord(undefined)).toEqual([])
        })
    })

    describe("deepMerge", () => {
        it("merges simple objects", () => {
            const result = Styler.deepMerge({ a: "1" }, { b: "2" })
            expect(result).toEqual({ a: "1", b: "2" })
        })

        it("merges nested objects", () => {
            const result = Styler.deepMerge(
                { a: { b: "1" } },
                { a: { c: "2" } }
            )
            expect(result).toEqual({ a: { b: "1", c: "2" } })
        })

        it("overrides arrays", () => {
            const result = Styler.deepMerge({ a: ["1"] }, { a: ["2"] })
            expect(result).toEqual({ a: ["2"] })
        })

        it("override mixed array and non-array", () => {
            const result = Styler.deepMerge({ a: "1" }, { a: ["2"] })
            expect(result).toEqual({ a: ["2"] })
        })

        it("override mixed non-array and array", () => {
            const result = Styler.deepMerge({ a: ["1"] }, { a: "2" })
            expect(result).toEqual({ a: "2" })
        })

        it("overrides non-object values", () => {
            const result = Styler.deepMerge({ a: "1" }, { a: "2" })
            expect(result).toEqual({ a: "2" })
        })
    })

    describe("getClassName", () => {
        it("converts style object to className string", () => {
            const style = {
                a: "class1",
                b: {
                    c: "class2",
                },
            }
            expect(Styler.getClassName(style)).toBe("class1 class2")
        })

        it("handles empty style", () => {
            expect(Styler.getClassName({})).toBe("")
        })
    })

    describe("TestStyler implementation", () => {
        let styler: TestStyler

        beforeEach(() => {
            styler = new TestStyler()
        })

        it("class method uses merger", () => {
            expect(styler.class("test", "extra")).toBe("test extra")
        })

        it("style method returns object", () => {
            expect(styler.style("key", { extra: "value" })).toEqual({
                key: { extra: "value" },
            })
        })

        it("compose method merges styles", () => {
            const result = styler.compose({ a: "1" }, { b: "2" })
            expect(result).toEqual({ a: "1", b: "2" })
        })
    })
})
