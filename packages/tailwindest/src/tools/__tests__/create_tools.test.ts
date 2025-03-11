import { describe, it, expect } from "vitest"
import { PrimitiveStyler } from "../primitive"
import { RotaryStyler } from "../rotary"
import { VariantsStyler } from "../variants"
import { createTools } from "../create_tools"
import { ToggleStyler } from "../toggle"

describe("PrimitiveStyler", () => {
    type TestStyle = { color: string; fontSize?: string }

    describe("constructor", () => {
        it("initializes with provided style", () => {
            const style: TestStyle = { color: "red" }
            const styler = new PrimitiveStyler<TestStyle>(style)
            expect(styler).toBeInstanceOf(PrimitiveStyler)
        })
    })

    describe("class method", () => {
        it("returns class name from style", () => {
            const style: TestStyle = { color: "blue" }
            const styler = new PrimitiveStyler<TestStyle>(style)
            expect(styler.class()).toBe("blue")
        })

        it("concatenates with extra class name", () => {
            const style: TestStyle = { color: "green" }
            const styler = new PrimitiveStyler<TestStyle>(style)
            expect(styler.class("extra")).toBe("green extra")
        })
    })

    describe("style method", () => {
        it("returns original style", () => {
            const style: TestStyle = { color: "purple" }
            const styler = new PrimitiveStyler<TestStyle>(style)
            expect(styler.style()).toEqual({ color: "purple" })
        })

        it("merges with extra style", () => {
            const style: TestStyle = { color: "yellow" }
            const extraStyle: TestStyle = { fontSize: "16", color: "yellow" }
            const styler = new PrimitiveStyler<TestStyle>(style)
            expect(styler.style(extraStyle)).toEqual({
                color: "yellow",
                fontSize: "16",
            })
        })
    })

    describe("compose method", () => {
        it("creates new styler with merged styles", () => {
            const style: TestStyle = { color: "black" }
            const styler = new PrimitiveStyler<TestStyle>(style)
            const newStyler = styler.compose(
                { fontSize: "12", color: "red" },
                { color: "white" }
            )
            expect(newStyler.style()).toEqual({
                color: "white",
                fontSize: "12",
            })
        })
    })
})

describe("RotaryStyler", () => {
    type TestStyle = { color: string; fontSize?: string }
    const variantKeys = ["primary", "secondary"] as const
    type VariantKey = (typeof variantKeys)[number]

    describe("constructor", () => {
        it("initializes with variants and base", () => {
            const base: TestStyle = { color: "gray" }
            const variants: Record<VariantKey, TestStyle> = {
                primary: { color: "blue" },
                secondary: { color: "green" },
            }
            const styler = new RotaryStyler<TestStyle, VariantKey>({
                base,
                variants,
            })
            expect(styler).toBeInstanceOf(RotaryStyler)
        })
    })

    describe("class method", () => {
        it("returns class name for variant", () => {
            const variants: Record<VariantKey, TestStyle> = {
                primary: { color: "blue" },
                secondary: { color: "green" },
            }
            const styler = new RotaryStyler<TestStyle, VariantKey>({ variants })
            expect(styler.class("primary")).toBe("blue")
        })

        it("returns base class name", () => {
            const base: TestStyle = { color: "gray" }
            const variants: Record<VariantKey, TestStyle> = {
                primary: { color: "blue" },
                secondary: { color: "green" },
            }
            const styler = new RotaryStyler<TestStyle, VariantKey>({
                base,
                variants,
            })
            expect(styler.class("base")).toBe("gray")
        })

        it("concatenates with extra class name", () => {
            const variants: Record<VariantKey, TestStyle> = {
                primary: { color: "blue" },
                secondary: { color: "green" },
            }
            const styler = new RotaryStyler<TestStyle, VariantKey>({ variants })
            expect(styler.class("secondary", "extra")).toBe("green extra")
        })
    })

    describe("style method", () => {
        it("returns style for variant", () => {
            const variants: Record<VariantKey, TestStyle> = {
                primary: { color: "blue" },
                secondary: { color: "green" },
            }
            const styler = new RotaryStyler<TestStyle, VariantKey>({ variants })
            expect(styler.style("primary")).toEqual({ color: "blue" })
        })

        it("merges with extra style", () => {
            const variants: Record<VariantKey, TestStyle> = {
                primary: { color: "blue" },
                secondary: { color: "green" },
            }
            const styler = new RotaryStyler<TestStyle, VariantKey>({ variants })
            expect(
                styler.style("secondary", { fontSize: "16", color: "green" })
            ).toEqual({
                color: "green",
                fontSize: "16",
            })
        })
    })

    describe("compose method", () => {
        it("creates new styler with composed base", () => {
            const base: TestStyle = { color: "gray" }
            const variants: Record<VariantKey, TestStyle> = {
                primary: { color: "blue" },
                secondary: { color: "green" },
            }
            const styler = new RotaryStyler<TestStyle, VariantKey>({
                base,
                variants,
            })
            const newStyler = styler.compose({ fontSize: "12", color: "gray" })
            expect(newStyler.style("base")).toEqual({
                color: "gray",
                fontSize: "12",
            })
            expect(newStyler.style("primary")).toEqual({
                color: "blue",
                fontSize: "12",
            })
        })
    })
})

describe("ToggleStyler", () => {
    type TestStyle = { color: string; fontSize?: string }
    type VariantKey = "truthy" | "falsy" | "base"
    describe("constructor", () => {
        it("initializes with variants and base", () => {
            const toggle: Record<VariantKey, TestStyle> = {
                base: { color: "base" },
                truthy: { color: "blue" },
                falsy: { color: "green" },
            }
            const styler = new ToggleStyler<TestStyle>(toggle)
            expect(styler).toBeInstanceOf(ToggleStyler)
        })
    })

    describe("class method", () => {
        it("returns class name for variant", () => {
            const toggle: Record<VariantKey, TestStyle> = {
                base: { color: "base" },
                truthy: { color: "blue" },
                falsy: { color: "green" },
            }
            const styler = new ToggleStyler<TestStyle>(toggle)
            expect(styler.class(true)).toBe("blue")
        })

        it("concatenates with extra class name", () => {
            const toggle: Record<VariantKey, TestStyle> = {
                base: { color: "base" },
                truthy: { color: "blue" },
                falsy: { color: "green" },
            }
            const styler = new ToggleStyler<TestStyle>(toggle)
            expect(styler.class(true, "extra")).toBe("blue extra")
        })
    })

    describe("style method", () => {
        it("returns style for true", () => {
            const toggle: Record<VariantKey, TestStyle> = {
                base: { color: "base" },
                truthy: { color: "blue" },
                falsy: { color: "green" },
            }
            const styler = new ToggleStyler<TestStyle>(toggle)
            expect(styler.style(true)).toEqual({ color: "blue" })
        })

        it("merges with extra style", () => {
            const toggle: Record<VariantKey, TestStyle> = {
                base: { color: "base" },
                truthy: { color: "blue" },
                falsy: { color: "green" },
            }
            const styler = new ToggleStyler<TestStyle>(toggle)
            expect(
                styler.style(true, { fontSize: "16", color: "green" })
            ).toEqual({
                color: "green",
                fontSize: "16",
            })
        })
    })

    describe("compose method", () => {
        it("creates new styler with composed base", () => {
            const toggle: Record<VariantKey, TestStyle> = {
                base: { color: "base" },
                truthy: { color: "blue" },
                falsy: { color: "green" },
            }
            const styler = new ToggleStyler<TestStyle>(toggle)
            const newStyler = styler.compose({ fontSize: "12", color: "gray" })
            expect(newStyler.style(true)).toEqual({
                color: "blue",
                fontSize: "12",
            })
            expect(newStyler.style(false)).toEqual({
                color: "green",
                fontSize: "12",
            })
        })
    })
})

describe("VariantsStyler", () => {
    type TestStyle = { color: string; fontSize?: string }
    type TestVariantMap = {
        size: { small: TestStyle; large: TestStyle }
        theme: { light: TestStyle; dark: TestStyle }
    }

    describe("constructor", () => {
        it("initializes with base and variants", () => {
            const base: TestStyle = { color: "gray" }
            const variants: TestVariantMap = {
                size: {
                    small: { fontSize: "12", color: "tomato" },
                    large: { fontSize: "24", color: "black" },
                },
                theme: { light: { color: "white" }, dark: { color: "black" } },
            }
            const styler = new VariantsStyler<TestStyle, TestVariantMap>({
                base,
                variants,
            })
            expect(styler).toBeInstanceOf(VariantsStyler)
        })
    })

    describe("style method", () => {
        it("returns base style with no variants", () => {
            const base: TestStyle = { color: "gray" }
            const variants: TestVariantMap = {
                size: {
                    small: { fontSize: "12", color: "tomato" },
                    large: { fontSize: "24", color: "black" },
                },
                theme: { light: { color: "white" }, dark: { color: "black" } },
            }
            const styler = new VariantsStyler<TestStyle, TestVariantMap>({
                base,
                variants,
            })
            expect(styler.style({})).toEqual({ color: "gray" })
        })

        it("merges base with variant styles", () => {
            const base: TestStyle = { color: "gray" }
            const variants: TestVariantMap = {
                size: {
                    small: { fontSize: "12", color: "tomato" },
                    large: { fontSize: "24", color: "black" },
                },
                theme: { light: { color: "white" }, dark: { color: "black" } },
            }
            const styler = new VariantsStyler<TestStyle, TestVariantMap>({
                base,
                variants,
            })
            expect(styler.style({ size: "small", theme: "dark" })).toEqual({
                color: "black",
                fontSize: "12",
            })
        })

        it("merges with extra style", () => {
            const base: TestStyle = { color: "gray" }
            const variants: TestVariantMap = {
                size: {
                    small: { fontSize: "12", color: "tomato" },
                    large: { fontSize: "24", color: "black" },
                },
                theme: { light: { color: "white" }, dark: { color: "black" } },
            }
            const styler = new VariantsStyler<TestStyle, TestVariantMap>({
                base,
                variants,
            })
            expect(
                styler.style(
                    { theme: "light" },
                    { color: "white", fontSize: "16" }
                )
            ).toEqual({
                color: "white",
                fontSize: "16",
            })
        })
    })

    describe("class method", () => {
        it("returns class name for base style", () => {
            const base: TestStyle = { color: "gray" }
            const variants: TestVariantMap = {
                size: {
                    small: { fontSize: "12", color: "tomato" },
                    large: { fontSize: "24", color: "black" },
                },
                theme: { light: { color: "white" }, dark: { color: "black" } },
            }
            const styler = new VariantsStyler<TestStyle, TestVariantMap>({
                base,
                variants,
            })
            expect(styler.class({})).toBe("gray")
        })

        it("returns merged class name for variants", () => {
            const base: TestStyle = { color: "gray" }
            const variants: TestVariantMap = {
                size: {
                    small: { fontSize: "12", color: "tomato" },
                    large: { fontSize: "24", color: "black" },
                },
                theme: { light: { color: "white" }, dark: { color: "black" } },
            }
            const styler = new VariantsStyler<TestStyle, TestVariantMap>({
                base,
                variants,
            })
            expect(styler.class({ size: "large", theme: "dark" })).toBe(
                "black 24"
            )
        })

        it("concatenates with extra class name", () => {
            const base: TestStyle = { color: "gray" }
            const variants: TestVariantMap = {
                size: {
                    small: { fontSize: "12", color: "tomato" },
                    large: { fontSize: "24", color: "black" },
                },
                theme: { light: { color: "white" }, dark: { color: "black" } },
            }
            const styler = new VariantsStyler<TestStyle, TestVariantMap>({
                base,
                variants,
            })
            expect(styler.class({ theme: "light" }, "extra")).toBe(
                "white extra"
            )
        })

        it("uses custom merger when set", () => {
            const base: TestStyle = { color: "gray" }
            const variants: TestVariantMap = {
                size: {
                    small: { fontSize: "12", color: "tomato" },
                    large: { fontSize: "24", color: "black" },
                },
                theme: { light: { color: "white" }, dark: { color: "black" } },
            }
            const styler = new VariantsStyler<TestStyle, TestVariantMap>({
                base,
                variants,
            })
            styler.setMerger((...args) => {
                return args.join("-")
            })
            expect(styler.class({ size: "small" }, "extra")).toBe(
                "tomato-12-extra"
            )
        })
    })

    describe("compose method", () => {
        it("creates new styler with composed base", () => {
            const base: TestStyle = { color: "gray" }
            const variants: TestVariantMap = {
                size: {
                    small: { fontSize: "12", color: "tomato" },
                    large: { fontSize: "24", color: "black" },
                },
                theme: { light: { color: "white" }, dark: { color: "black" } },
            }
            const styler = new VariantsStyler<TestStyle, TestVariantMap>({
                base,
                variants,
            })
            const newStyler = styler.compose({ fontSize: "16", color: "gray" })
            expect(newStyler.style({})).toEqual({
                color: "gray",
                fontSize: "16",
            })
            expect(newStyler.style({ size: "small" })).toEqual({
                color: "tomato",
                fontSize: "12",
            })
        })
    })
})

describe("createTools", () => {
    describe("creates tools", () => {
        it("should create all tools", () => {
            const tool = createTools({})
            expect(tool).toBeDefined()
        })

        it("should mergeProps", () => {
            const tool = createTools()
            expect(
                tool.mergeProps(
                    {
                        color: "text-gray-950",
                        fontWeight: "font-bold",
                        fontSize: "text-base",
                    },
                    {
                        color: "text-red-100",
                    }
                )
            ).toBe("text-red-100 font-bold text-base")
        })

        it("should mergeRecord", () => {
            const tool = createTools()
            expect(
                tool.mergeRecord(
                    {
                        color: "text-gray-950",
                        fontWeight: "font-bold",
                        fontSize: "text-base",
                    },
                    {
                        color: "text-red-100",
                    }
                )
            ).toEqual({
                color: "text-red-100",
                fontWeight: "font-bold",
                fontSize: "text-base",
            })
        })

        it("should join style values", () => {
            const tools = createTools<{}>()
            const join1 = tools.join(
                "bg-red-100",
                "p-2",
                "m-2",
                { cls: true },
                { cls2: false },
                { cls3: true },
                ["arr1", "arr2", { cls4: true }]
            )
            expect(join1).toBe("bg-red-100 p-2 m-2 cls cls3 arr1 arr2 cls4")
        })
    })
})
