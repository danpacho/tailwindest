import { describe, expect, test } from "@jest/globals"
import { TypeEqual, expectType } from "ts-expect"
import { type Tailwindest, createWind } from "../packages"
import { label } from "./label"

type MyCustomUnion<PropertyName extends string> =
    | `my-${PropertyName}-1`
    | `my-${PropertyName}-2`
    | `my-${PropertyName}-3`
    | `my-${PropertyName}-4`
    | `my-${PropertyName}-5`
    | `my-${PropertyName}-6`
    | `my-${PropertyName}-7`
    | `my-${PropertyName}-8`
    | `my-${PropertyName}-9`

type CustomTailwind = Tailwindest<
    {
        color: MyCustomUnion<"color">
        sizing: MyCustomUnion<"size">
        screens: {
            conditionA: "@my"
        }
    },
    {
        accentColor: "for-the-accent"
    }
>

describe(label.unit("createWind - plugging custom type"), () => {
    type ExpectedCustomType<
        BaseType extends string | undefined,
        WindPropertyName extends string,
        CustomUnion extends string
    > = BaseType | `${WindPropertyName}-${CustomUnion}`

    type Keys<T> = keyof T

    test(label.case("global - custom color"), () => {
        type PureColor = Tailwindest["color"]
        type CustomColor = CustomTailwind["color"]

        type ExpectedCustomColor = ExpectedCustomType<
            PureColor,
            "text",
            MyCustomUnion<"color">
        >

        expectType<TypeEqual<CustomColor, ExpectedCustomColor>>(true)
    })
    test(label.case("global - custom sizing"), () => {
        type PurePadding = Tailwindest["padding"]
        type CustomPadding = CustomTailwind["padding"]
        type ExpectedCustomPadding = ExpectedCustomType<
            PurePadding,
            "p" | "-p",
            MyCustomUnion<"size">
        >
        expectType<TypeEqual<CustomPadding, ExpectedCustomPadding>>(true)
    })

    test(label.case("global - custom screens"), () => {
        type ExpectedScreenCustom = "@my"
        expectType<TypeEqual<Keys<CustomTailwind>, Keys<Tailwindest>>>(false)
        expectType<
            TypeEqual<
                Keys<CustomTailwind>,
                ExpectedScreenCustom | Keys<Tailwindest>
            >
        >(true)
    })

    test(label.case("accentColor - 'for-the-accent'"), () => {
        type ExpectedAccentCustom = "accent-for-the-accent"
        expectType<
            ExpectedAccentCustom extends CustomTailwind["accentColor"]
                ? true
                : false
        >(true)
        expectType<
            CustomTailwind["accentColor"] extends ExpectedAccentCustom
                ? true
                : false
        >(false)
    })
})

describe(label.unit("createWind - class & stylesheet"), () => {
    const { wind, wind$ } = createWind<CustomTailwind>()

    const box = wind({
        color: "text-my-color-1",
        padding: "-p-my-size-1",
        margin: "m-my-size-1",
        "@my": {
            color: "my:text-my-color-1",
            padding: "my:-p-my-size-1",
            margin: "my:m-my-size-1",
        },
    })

    const testWind$ = wind$("test")
    const boxVariants = testWind$(box.style(), {
        test: {
            color: "text-my-color-9",
            "@my": {
                color: "my:text-my-color-9",
            },
        },
    })

    type FirstArgument<FuncWithArgs> = FuncWithArgs extends (
        ...args: infer Args
    ) => unknown
        ? Args[0]
        : never
    test(label.case("wind first argument type is CustomTailwind"), () => {
        expectType<
            FirstArgument<typeof wind> extends CustomTailwind ? true : false
        >(true)
        expectType<
            CustomTailwind extends FirstArgument<typeof wind> ? true : false
        >(true)
    })
    test(label.case("wind$ second argument type is CustomTailwind"), () => {
        expectType<
            FirstArgument<typeof testWind$> extends CustomTailwind
                ? true
                : false
        >(true)
        expectType<
            CustomTailwind extends FirstArgument<typeof testWind$>
                ? true
                : false
        >(true)
    })

    test(label.case("plugged wind - class"), () => {
        expect(box.style()).toEqual({
            color: "text-my-color-1",
            padding: "-p-my-size-1",
            margin: "m-my-size-1",
            "@my": {
                color: "my:text-my-color-1",
                padding: "my:-p-my-size-1",
                margin: "my:m-my-size-1",
            },
        })
    })
    test(label.case("plugged wind - stylesheet"), () => {
        expect(box.class()).toBe(
            "text-my-color-1 -p-my-size-1 m-my-size-1 my:text-my-color-1 my:-p-my-size-1 my:m-my-size-1"
        )
    })

    test(label.case("plugged wind$ - default class"), () => {
        expect(boxVariants.class()).toBe(box.class())
    })
    test(label.case("plugged wind$ - default stylesheet"), () => {
        expect(boxVariants.style()).toEqual(box.style())
    })

    test(label.case("plugged wind$ - variant class"), () => {
        expect(boxVariants.class("test")).toBe(
            "text-my-color-9 -p-my-size-1 m-my-size-1 my:text-my-color-9 my:-p-my-size-1 my:m-my-size-1"
        )
    })
    test(label.case("plugged wind$ - variant stylesheet"), () => {
        expect(boxVariants.style("test")).toEqual({
            color: "text-my-color-9",
            padding: "-p-my-size-1",
            margin: "m-my-size-1",
            "@my": {
                color: "my:text-my-color-9",
                padding: "my:-p-my-size-1",
                margin: "my:m-my-size-1",
            },
        })
    })
})
