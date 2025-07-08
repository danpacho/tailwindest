import { describe, it, expect } from "vitest"
import { createTools } from "../create_tools"

const tw = createTools()

describe("compose method in complex scenarios", () => {
    it("should handle multiple compositions on PrimitiveStyler", () => {
        const primitive = tw.style({
            color: "red",
            fontSize: "12px",
        })

        const composed1 = primitive.compose({ color: "blue" })
        const composed2 = composed1.compose({ fontSize: "16px" })
        const composed3 = composed2.compose({ fontWeight: "bold" })

        expect(composed1.style()).toEqual({
            color: "blue",
            fontSize: "12px",
        })
        expect(composed2.style()).toEqual({
            color: "blue",
            fontSize: "16px",
        })
        expect(composed3.style()).toEqual({
            color: "blue",
            fontSize: "16px",
            fontWeight: "bold",
        })
    })

    it("should handle multiple compositions on ToggleStyler", () => {
        const toggle = tw.toggle({
            base: { color: "gray" },
            truthy: { color: "green" },
            falsy: { color: "red" },
        })

        const composed1 = toggle.compose({ backgroundColor: "white" })
        const composed2 = composed1.compose({ padding: "10px" })
        const composed3 = composed2.compose({
            color: "black",
        })

        expect(composed1.style(true)).toEqual({
            color: "green",
            backgroundColor: "white",
        })
        expect(composed2.style(false)).toEqual({
            color: "red",
            backgroundColor: "white",
            padding: "10px",
        })
        expect(composed3.style(true)).toEqual({
            color: "green",
            backgroundColor: "white",
            padding: "10px",
        })
    })

    it("should handle multiple compositions on RotaryStyler", () => {
        const rotary = tw.rotary({
            base: { fontSize: "14px" },
            variants: {
                primary: { color: "blue" },
                secondary: { color: "green" },
            },
        })

        const composed1 = rotary.compose({ fontWeight: "bold" })
        const composed2 = composed1.compose({ fontSize: "18px" })
        const composed3 = composed2.compose({
            color: "purple",
        })

        expect(composed1.style("primary")).toEqual({
            fontSize: "14px",
            color: "blue",
            fontWeight: "bold",
        })
        expect(composed2.style("secondary")).toEqual({
            fontSize: "18px",
            color: "green",
            fontWeight: "bold",
        })
        expect(composed3.style("primary")).toEqual({
            fontSize: "18px",
            color: "blue",
            fontWeight: "bold",
        })
    })

    it("should handle multiple compositions on VariantsStyler", () => {
        const variants = tw.variants({
            base: { display: "flex" },
            variants: {
                size: {
                    small: { fontSize: "12px" },
                    large: { fontSize: "20px" },
                },
                color: {
                    light: { color: "white" },
                    dark: { color: "black" },
                },
            },
        })

        const composed1 = variants.compose({ alignItems: "center" })
        const composed2 = composed1.compose({
            display: "inline-flex",
        })
        const composed3 = composed2.compose({
            fontSize: "16px",
        })

        expect(composed1.style({ size: "small", color: "dark" })).toEqual({
            display: "flex",
            fontSize: "12px",
            color: "black",
            alignItems: "center",
        })
        expect(composed2.style({ size: "large", color: "light" })).toEqual({
            display: "inline-flex",
            fontSize: "20px",
            color: "white",
            alignItems: "center",
        })
        expect(composed3.style({ size: "small" })).toEqual({
            display: "inline-flex",
            fontSize: "12px",
            alignItems: "center",
        })
    })

    it("should correctly override styles with subsequent compositions", () => {
        const primitive = tw.style({
            padding: "10px",
            margin: "10px",
        })

        const composed = primitive
            .compose({ padding: "12px" })
            .compose({ padding: "14px" })
            .compose({ padding: "16px" })

        expect(composed.style()).toEqual({
            padding: "16px",
            margin: "10px",
        })
    })

    it("should maintain original variants after composition", () => {
        const rotary = tw.rotary({
            variants: {
                one: { color: "one" },
                two: { color: "two" },
            },
        })

        const composed = rotary.compose({ background: "bg" })

        expect(composed.style("one")).toEqual({
            color: "one",
            background: "bg",
        })
        expect(composed.style("two")).toEqual({
            color: "two",
            background: "bg",
        })
    })
})
