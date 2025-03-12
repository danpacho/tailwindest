import { describe, test } from "vitest"
import { type TypeEqual, expectType } from "ts-expect"
import { type GetVariants, createTools } from "../"

const tw = createTools()

const sizeRotary = tw.rotary({
    variants: {
        "2xl": {},
        xl: {},
        lg: {},
        md: {},
        sm: {},
        xs: {},
        "2xs": {},
        base: {},
    },
})
type ExpectedSizeVariants = "sm" | "md" | "lg" | "xl" | "2xl" | "xs" | "2xs"

const colorRotary = tw.rotary({
    variants: {
        black: {},
        blue: {},
        green: {},
        purple: {},
        red: {},
        white: {},
        yellow: {},
    },
})
type ExpectedColorVariants =
    | "red"
    | "yellow"
    | "green"
    | "blue"
    | "purple"
    | "black"
    | "white"

describe("GetVariants - rotary", () => {
    test("infer variants type", () => {
        sizeRotary.class("2xl")
        expectType<
            TypeEqual<GetVariants<typeof sizeRotary>, ExpectedSizeVariants>
        >(true)

        expectType<
            TypeEqual<GetVariants<typeof colorRotary>, ExpectedColorVariants>
        >(true)
    })

    test("compose does not affect type inference result", () => {
        sizeRotary.compose(
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
            TypeEqual<GetVariants<typeof sizeRotary>, ExpectedSizeVariants>
        >(true)

        colorRotary.compose(
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
            TypeEqual<GetVariants<typeof colorRotary>, ExpectedColorVariants>
        >(true)
    })
})

describe("GetVariants - style", () => {
    test("infer never", () => {
        const baseWind = tw.style({})
        expectType<TypeEqual<GetVariants<typeof baseWind>, string | undefined>>(
            true
        )
    })
})

describe("GetVariants - variants: without boolean | number", () => {
    const totVariants = tw.variants({
        base: {},
        variants: {
            color: {
                black: {},
                blue: {},
                green: {},
                purple: {},
                red: {
                    display: "flex",
                    alignItems: "items-center",
                },
                white: {},
                yellow: {},
            },
            size: {
                "2xl": {},
                xl: {},
                lg: {},
                md: {},
                sm: {},
                xs: {},
                "2xs": {},
            },
        },
    })

    test("infer variants type", () => {
        expectType<
            TypeEqual<
                GetVariants<typeof totVariants>,
                {
                    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "xs" | "2xs"
                    color?:
                        | "red"
                        | "yellow"
                        | "green"
                        | "blue"
                        | "purple"
                        | "black"
                        | "white"
                }
            >
        >(true)
    })

    test("infer variants type - by rotary", () => {
        expectType<
            TypeEqual<
                GetVariants<typeof totVariants>,
                {
                    size?: GetVariants<typeof sizeRotary>
                    color?: GetVariants<typeof colorRotary>
                }
            >
        >(true)
    })
})

describe("GetVariants - variants: with boolean | number", () => {
    const withBooleanAndNumber = tw.variants({
        base: {},
        variants: {
            color: {
                black: {},
                blue: {},
                green: {},
                purple: {},
                red: {},
                white: {},
                yellow: {},
            },
            size: {
                "2xl": {},
                xl: {},
                lg: {},
                md: {},
                sm: {},
                xs: {},
                "2xs": {},
            },
            light: {
                true: {},
                false: {},
            },
            onlyTrue: {
                true: {},
            },
            onlyFalse: {
                false: {},
            },
            numbers: {
                [1]: {},
                [2]: {},
            },
            never: {
                [Symbol()]: {},
            },
            withNever: {
                [Symbol()]: {},
                withNever: {},
            },
            combinations: {
                [Symbol()]: {},
                withNever: {},
                [1]: {},
                true: {},
                false: {},
            },
        },
    })

    test("infer variants type", () => {
        expectType<
            TypeEqual<
                GetVariants<typeof withBooleanAndNumber>,
                {
                    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "xs" | "2xs"
                    color?:
                        | "red"
                        | "yellow"
                        | "green"
                        | "blue"
                        | "purple"
                        | "black"
                        | "white"
                    light?: "true" | "false"
                    onlyTrue?: "true"
                    onlyFalse?: "false"
                    numbers?: 1 | 2
                    never?: symbol
                    withNever?: symbol | "withNever"
                    combinations?: symbol | "true" | "false" | 1 | "withNever"
                }
            >
        >(true)
    })
})
