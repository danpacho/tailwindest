import { describe, expect, test } from "@jest/globals"
import { type Tailwindest, createWind } from "../../packages"
import { label } from "../label"

const { mergeProps } = createWind<Tailwindest>()

describe(label.unit("mergeProps"), () => {
    test(label.case("overwrites the styles defined later"), () => {
        const baseStyle: Tailwindest = {
            display: "flex",
            alignItems: "items-center",
            justifyContent: "justify-center",

            padding: "p-1",
            margin: "m-1",

            "@md": {
                padding: "md:p-5",
                margin: "md:m-5",
            },
        }

        type SizeStyle = Pick<Tailwindest, "padding" | "margin" | "@md">
        const ComponentWithSizeProps = (sizeStyle: SizeStyle) =>
            mergeProps(baseStyle, sizeStyle)

        expect(
            ComponentWithSizeProps({
                margin: "m-10",
            })
        ).toBe("flex items-center justify-center p-1 m-10 md:p-5 md:m-5")

        expect(
            ComponentWithSizeProps({
                padding: "p-10",
            })
        ).toBe("flex items-center justify-center p-10 m-1 md:p-5 md:m-5")

        expect(
            ComponentWithSizeProps({
                margin: "m-10",
                padding: "p-10",
            })
        ).toBe("flex items-center justify-center p-10 m-10 md:p-5 md:m-5")

        const complexSizeStyle: SizeStyle = {
            margin: "m-10",
            padding: "p-10",
            "@md": {
                margin: "md:m-20",
                padding: "md:p-20",
            },
        }
        expect(ComponentWithSizeProps(complexSizeStyle)).toBe(
            "flex items-center justify-center p-10 m-10 md:p-20 md:m-20"
        )
    })
})
