import { describe, test } from "@jest/globals"
import { TypeEqual, TypeOf, expectType } from "ts-expect"
import {
    Tailwindest,
    type WindVariants,
    createVariants,
    createWind,
} from "../packages"
import { label } from "./label"

const { wind, wind$ } = createWind<Tailwindest>()

const sizeVariantsList = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] as const
const sizeVariants = wind$(
    "2xs",
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl"
)(
    {},
    {
        "2xl": {},
        xl: {},
        lg: {},
        md: {},
        sm: {},
        xs: {},
        "2xs": {},
        defaultVariant: "md",
    }
)

const colorVariantsList = [
    "blue",
    "yellow",
    "green",
    "purple",
    "red",
    "black",
    "white",
] as const
const colorVariants = wind$(
    "blue",
    "yellow",
    "green",
    "purple",
    "red",
    "black",
    "white"
)(
    {},
    {
        black: {},
        blue: {},
        green: {},
        purple: {},
        red: {},
        white: {},
        yellow: {},
        defaultVariant: "white",
    }
)

describe(label.unit("WindVariants - wind$"), () => {
    test(label.case("infer variants type"), () => {
        expectType<
            TypeEqual<
                WindVariants<typeof sizeVariants>,
                typeof sizeVariantsList[number]
            >
        >(true)

        expectType<
            TypeEqual<
                WindVariants<typeof colorVariants>,
                typeof colorVariantsList[number]
            >
        >(true)
    })

    test(label.case("string args can replace with const string array"), () => {
        const colorVariantsReplaceWithConstArray = wind$(...colorVariantsList)(
            {},
            {
                black: {},
                blue: {},
                green: {},
                purple: {},
                red: {},
                white: {},
                yellow: {},
                defaultVariant: "white",
            }
        )
        expectType<
            TypeOf<
                WindVariants<typeof colorVariantsReplaceWithConstArray>,
                WindVariants<typeof colorVariants>
            >
        >(true)

        const sizeVariantsReplaceWithConstArray = wind$(...sizeVariantsList)(
            {},
            {
                "2xl": {},
                xl: {},
                lg: {},
                md: {},
                sm: {},
                xs: {},
                "2xs": {},
                defaultVariant: "md",
            }
        )
        expectType<
            TypeOf<
                WindVariants<typeof sizeVariantsReplaceWithConstArray>,
                WindVariants<typeof sizeVariants>
            >
        >(true)
    })

    test(label.case("compose does not affect type inference result"), () => {
        sizeVariants.compose(
            {
                backgroundColor: "bg-amber-100",
            },
            {
                padding: "p-1",
            },
            {
                margin: "m-1",
            }
        )
        expectType<
            TypeEqual<
                WindVariants<typeof sizeVariants>,
                typeof sizeVariantsList[number]
            >
        >(true)

        colorVariants.compose(
            {
                backgroundColor: "bg-amber-100",
            },
            {
                padding: "p-1",
            },
            {
                margin: "m-1",
            }
        )
        expectType<
            TypeEqual<
                WindVariants<typeof colorVariants>,
                typeof colorVariantsList[number]
            >
        >(true)
    })
})

describe(label.unit("WindVariants - wind"), () => {
    test(label.case("infer never"), () => {
        const baseWind = wind({})
        expectType<TypeEqual<WindVariants<typeof baseWind>, never>>(true)

        const baseWindStyle = baseWind.style()
        expectType<TypeEqual<WindVariants<typeof baseWindStyle>, never>>(true)

        const baseWindComposedStyle = baseWind.compose({}).style()
        expectType<
            TypeEqual<WindVariants<typeof baseWindComposedStyle>, never>
        >(true)
    })
})

describe(label.unit("WindVariants - createVariants"), () => {
    test("infer complex variants type", () => {
        const complexVariants = createVariants({
            color: colorVariants,
            size: sizeVariants,
        })

        expectType<
            TypeEqual<
                WindVariants<typeof complexVariants>,
                {
                    size?: WindVariants<typeof sizeVariants>
                    color?: WindVariants<typeof colorVariants>
                }
            >
        >(true)

        expectType<
            TypeEqual<
                WindVariants<typeof complexVariants>,
                {
                    size?: typeof sizeVariantsList[number]
                    color?: typeof colorVariantsList[number]
                }
            >
        >(true)
    })
})
