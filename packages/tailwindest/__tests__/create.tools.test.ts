import { describe, expect, test } from "@jest/globals"
import { type TypeEqual, expectType } from "ts-expect"
import { type GetVariants, type Tailwindest, createTools } from "../src"
import { label } from "./label"

//TODO: typescript's weird error, TypeEqual is not generic, at ts v5.1.6
expectType<TypeEqual<"", "">>(true)

type FirstArgument<FuncWithArgs> = FuncWithArgs extends (
    ...args: infer Args
) => unknown
    ? Args[0]
    : never

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
            conditionB: "@my1"
            conditionC: "@my2"
            conditionD: "@my3"
            conditionE: "@my4"
            conditionF: "@my5"
            conditionG: "@my6"
            conditionH: "@my7"
        }
    },
    {
        accentColor: "for-the-accent"
    }
>

const tw = createTools<CustomTailwind>()

const box = tw.style({
    color: "text-my-color-1",
    padding: "-p-my-size-1",
    margin: "m-my-size-1",
    "@my": {
        color: "my:text-my-color-1",
        padding: "my:-p-my-size-1",
        margin: "my:m-my-size-1",
    },
})

describe(label.unit("createTools - plug custom type"), () => {
    type ExpectedCustomType<
        BaseType extends string | undefined,
        WindPropertyName extends string,
        CustomUnion extends string,
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
        type ExpectedScreenCustom =
            | "@my"
            | "@my1"
            | "@my2"
            | "@my3"
            | "@my4"
            | "@my5"
            | "@my6"
            | "@my7"
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

describe(label.unit("createTools - style"), () => {
    test(label.case("style first argument type is CustomTailwind"), () => {
        expectType<(typeof box)["style"] extends CustomTailwind ? true : false>(
            true
        )
    })

    test(label.case("plugged style - class"), () => {
        expect(box.style).toStrictEqual({
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
    test(label.case("plugged style - stylesheet"), () => {
        expect(box.class).toBe(
            "text-my-color-1 -p-my-size-1 m-my-size-1 my:text-my-color-1 my:-p-my-size-1 my:m-my-size-1"
        )
    })

    test(label.case("plugged style - compose"), () => {
        box.compose({
            "@aria": {
                ":checked": {
                    "::after": {
                        backgroundColor: "aria-checked:after:bg-amber-100",
                    },
                },
            },
        })
        expect(box.style).toStrictEqual({
            color: "text-my-color-1",
            padding: "-p-my-size-1",
            margin: "m-my-size-1",
            "@my": {
                color: "my:text-my-color-1",
                padding: "my:-p-my-size-1",
                margin: "my:m-my-size-1",
            },
            "@aria": {
                ":checked": {
                    "::after": {
                        backgroundColor: "aria-checked:after:bg-amber-100",
                    },
                },
            },
        })
        expect(box.class).toBe(
            "text-my-color-1 -p-my-size-1 m-my-size-1 my:text-my-color-1 my:-p-my-size-1 my:m-my-size-1 aria-checked:after:bg-amber-100"
        )
    })
})

describe(label.unit("createTools - toggle"), () => {
    const testToggle = tw.toggle({
        truthy: {
            color: "text-my-color-1",
        },
        falsy: {
            color: "text-my-color-9",
        },
    })

    test(label.case("plugged toggle, without base - truthy condition"), () => {
        expect(testToggle.class(true)).toBe("text-my-color-1")
        expect(testToggle.class(!null)).toBe("text-my-color-1")
        expect(testToggle.class(!undefined)).toBe("text-my-color-1")
    })
    test(label.case("plugged toggle, without base - falsy condition"), () => {
        expect(testToggle.class(false)).toBe("text-my-color-9")
    })

    const testToggle2 = tw.toggle({
        base: {
            backgroundColor: "bg-my-color-1",
            color: "text-red-100",
        },
        truthy: {
            color: "text-my-color-1",
        },
        falsy: {
            color: "text-my-color-9",
        },
    })
    test(label.case("plugged toggle, with base - truthy condition"), () => {
        expect(testToggle2.class(true)).toBe("bg-my-color-1 text-my-color-1")
        expect(testToggle2.class(!null)).toBe("bg-my-color-1 text-my-color-1")
        expect(testToggle2.class(!undefined)).toBe(
            "bg-my-color-1 text-my-color-1"
        )
    })
    test(label.case("plugged toggle, with base - falsy condition"), () => {
        expect(testToggle2.class(false)).toBe("bg-my-color-1 text-my-color-9")
    })
    test(label.case("plugged toggle, with base - styleSheet"), () => {
        expect(testToggle2.style(false)).toStrictEqual({
            backgroundColor: "bg-my-color-1",
            color: "text-my-color-9",
        })
    })
    test(label.case("plugged toggle, with base - compose"), () => {
        testToggle2.compose({
            display: "flex",
            backgroundColor: "bg-my-color-9",
            color: "text-amber-100",
        })

        expect(testToggle2.class(true)).toBe(
            "bg-my-color-9 text-my-color-1 flex"
        )
        expect(testToggle2.class(false)).toBe(
            "bg-my-color-9 text-my-color-9 flex"
        )
    })
    test(label.case("plugged toggle, with base - styleSheet"), () => {
        expect(
            testToggle2
                .compose({
                    display: "grid",
                    backgroundColor: "bg-my-color-9",
                })
                .style(true)
        ).toStrictEqual({
            display: "grid",
            backgroundColor: "bg-my-color-9",
            color: "text-my-color-1",
        })
        expect(
            testToggle2
                .compose({
                    display: "grid",
                    backgroundColor: "bg-my-color-9",
                })
                .style(false)
        ).toStrictEqual({
            display: "grid",
            backgroundColor: "bg-my-color-9",
            color: "text-my-color-9",
        })
    })
})

describe(label.unit("createTools - rotary"), () => {
    const boxRotary = tw.rotary({
        base: {
            "@md": {
                padding: "md:p-2",
            },
        },
        test: {
            color: "text-my-color-1",
            padding: "-p-my-size-1",
            margin: "m-my-size-1",
            "@my": {
                color: "my:text-my-color-1",
                padding: "my:-p-my-size-1",
                margin: "my:m-my-size-1",
            },
        },
    })
    const withBooleanRotary = tw.rotary({
        base: {
            padding: "p-2",
        },
        true: {
            backgroundColor: "bg-green-500",
        },
        false: {
            backgroundColor: "bg-red-500",
        },
        amber: {
            backgroundColor: "bg-amber-500",
        },
    })

    test(label.case("rotary second argument type is CustomTailwind"), () => {
        expectType<
            FirstArgument<typeof boxRotary> extends CustomTailwind
                ? true
                : false
        >(true)

        expectType<
            FirstArgument<typeof withBooleanRotary> extends CustomTailwind
                ? true
                : false
        >(true)
    })

    test(label.case("plugged rotary - variant class"), () => {
        expect(boxRotary.class("test")).toBe(
            "md:p-2 text-my-color-1 -p-my-size-1 m-my-size-1 my:text-my-color-1 my:-p-my-size-1 my:m-my-size-1"
        )
        expect(withBooleanRotary.class(true)).toBe("p-2 bg-green-500")
        expect(withBooleanRotary.class(false)).toBe("p-2 bg-red-500")
        expect(withBooleanRotary.class("amber")).toBe("p-2 bg-amber-500")
    })
    test(label.case("plugged rotary - variant stylesheet"), () => {
        expect(boxRotary.style("test")).toStrictEqual({
            "@md": {
                padding: "md:p-2",
            },
            color: "text-my-color-1",
            padding: "-p-my-size-1",
            margin: "m-my-size-1",
            "@my": {
                color: "my:text-my-color-1",
                padding: "my:-p-my-size-1",
                margin: "my:m-my-size-1",
            },
        } satisfies CustomTailwind)

        expect(withBooleanRotary.style(true)).toStrictEqual({
            padding: "p-2",
            backgroundColor: "bg-green-500",
        } satisfies CustomTailwind)
        expect(withBooleanRotary.style(false)).toStrictEqual({
            padding: "p-2",
            backgroundColor: "bg-red-500",
        } satisfies CustomTailwind)
        expect(withBooleanRotary.style("amber")).toStrictEqual({
            padding: "p-2",
            backgroundColor: "bg-amber-500",
        } satisfies CustomTailwind)
    })
    test(label.case("plugged rotary - compose"), () => {
        boxRotary.compose({
            "@md": {
                padding: "md:p-10",
            },
            color: "text-my-color-9",
        } satisfies CustomTailwind)
        expect(boxRotary.class("test")).toBe(
            "md:p-10 text-my-color-1 -p-my-size-1 m-my-size-1 my:text-my-color-1 my:-p-my-size-1 my:m-my-size-1"
        )

        withBooleanRotary.compose({
            color: "text-my-color-9",
            backgroundColor: "bg-yellow-500",
        } satisfies CustomTailwind)
        expect(withBooleanRotary.class(true)).toBe(
            "p-2 text-my-color-9 bg-green-500"
        )
        expect(withBooleanRotary.class(false)).toBe(
            "p-2 text-my-color-9 bg-red-500"
        )
        expect(withBooleanRotary.class("amber")).toBe(
            "p-2 text-my-color-9 bg-amber-500"
        )
    })
})

const boxVariants = tw.variants({
    base: {
        display: "flex",
        alignItems: "items-center",
        justifyContent: "justify-center",

        fontSize: "text-base",
        backgroundColor: "bg-amber-50",

        borderRadius: "rounded-md",
    },
    variants: {
        size: {
            true: {
                padding: "p-1",
            },
            false: {
                padding: "p-2",
            },
        },
        type: {
            badge: {
                flexDirection: "flex-row",
                gap: "gap-1",
            },
            outline: {
                borderColor: "border-transparent",
                borderStyle: "border-solid",
                borderWidth: "border-2",
            },
        },
        color: {
            blue: {
                backgroundColor: "bg-indigo-500",
                borderColor: "border-indigo-300",
                color: "text-white",
                "@dark": {
                    backgroundColor: "dark:bg-indigo-900",
                    borderColor: "dark:border-indigo-700",
                },
            },
            red: {
                backgroundColor: "bg-red-500",
                borderColor: "border-red-300",
                color: "text-white",
                "@dark": {
                    backgroundColor: "dark:bg-red-900",
                    borderColor: "dark:border-red-700",
                },
            },
        },
    },
})

const variantsCase: Array<
    Required<GetVariants<typeof boxVariants>> & {
        expectedClass: string
        expectedComposedClass: string
    }
> = [
    {
        size: true,
        type: "badge",
        color: "blue",
        expectedClass:
            "flex items-center justify-center text-base bg-indigo-500 rounded-md p-1 flex-row gap-1 border-indigo-300 text-white dark:bg-indigo-900 dark:border-indigo-700",
        expectedComposedClass:
            "grid items-center justify-center text-base bg-indigo-500 rounded-md accent-red-400 p-1 flex-row gap-1 border-indigo-300 text-white dark:bg-indigo-900 dark:border-indigo-700",
    },
    {
        size: true,
        type: "badge",
        color: "red",
        expectedClass:
            "flex items-center justify-center text-base bg-red-500 rounded-md p-1 flex-row gap-1 border-red-300 text-white dark:bg-red-900 dark:border-red-700",
        expectedComposedClass:
            "grid items-center justify-center text-base bg-red-500 rounded-md accent-red-400 p-1 flex-row gap-1 border-red-300 text-white dark:bg-red-900 dark:border-red-700",
    },
    {
        size: true,
        type: "outline",
        color: "blue",
        expectedClass:
            "flex items-center justify-center text-base bg-indigo-500 rounded-md p-1 border-indigo-300 border-solid border-2 text-white dark:bg-indigo-900 dark:border-indigo-700",
        expectedComposedClass:
            "grid items-center justify-center text-base bg-indigo-500 rounded-md accent-red-400 p-1 border-indigo-300 border-solid border-2 text-white dark:bg-indigo-900 dark:border-indigo-700",
    },
    {
        size: true,
        type: "outline",
        color: "red",
        expectedClass:
            "flex items-center justify-center text-base bg-red-500 rounded-md p-1 border-red-300 border-solid border-2 text-white dark:bg-red-900 dark:border-red-700",
        expectedComposedClass:
            "grid items-center justify-center text-base bg-red-500 rounded-md accent-red-400 p-1 border-red-300 border-solid border-2 text-white dark:bg-red-900 dark:border-red-700",
    },
    {
        size: false,
        type: "badge",
        color: "blue",
        expectedClass:
            "flex items-center justify-center text-base bg-indigo-500 rounded-md p-2 flex-row gap-1 border-indigo-300 text-white dark:bg-indigo-900 dark:border-indigo-700",
        expectedComposedClass:
            "grid items-center justify-center text-base bg-indigo-500 rounded-md accent-red-400 p-2 flex-row gap-1 border-indigo-300 text-white dark:bg-indigo-900 dark:border-indigo-700",
    },
    {
        size: false,
        type: "badge",
        color: "red",
        expectedClass:
            "flex items-center justify-center text-base bg-red-500 rounded-md p-2 flex-row gap-1 border-red-300 text-white dark:bg-red-900 dark:border-red-700",
        expectedComposedClass:
            "grid items-center justify-center text-base bg-red-500 rounded-md accent-red-400 p-2 flex-row gap-1 border-red-300 text-white dark:bg-red-900 dark:border-red-700",
    },
    {
        size: false,
        type: "outline",
        color: "blue",
        expectedClass:
            "flex items-center justify-center text-base bg-indigo-500 rounded-md p-2 border-indigo-300 border-solid border-2 text-white dark:bg-indigo-900 dark:border-indigo-700",
        expectedComposedClass:
            "grid items-center justify-center text-base bg-indigo-500 rounded-md accent-red-400 p-2 border-indigo-300 border-solid border-2 text-white dark:bg-indigo-900 dark:border-indigo-700",
    },
    {
        size: false,
        type: "outline",
        color: "red",
        expectedClass:
            "flex items-center justify-center text-base bg-red-500 rounded-md p-2 border-red-300 border-solid border-2 text-white dark:bg-red-900 dark:border-red-700",
        expectedComposedClass:
            "grid items-center justify-center text-base bg-red-500 rounded-md accent-red-400 p-2 border-red-300 border-solid border-2 text-white dark:bg-red-900 dark:border-red-700",
    },
]

const cacheAccessCount = 1000
const getVariantsOptionName = (option: {
    size: true | false
    type: "outline" | "badge"
    color: "red" | "blue"
}): string => {
    const optionEntries = Object.entries(option)
    const variantsOption =
        optionEntries.length === 0
            ? "{}, empty option"
            : optionEntries.reduce(
                  (option, [key, value], i) =>
                      `${
                          i === 0 ? `{ ${option}` : `${option}`
                      }${key}: "${value}"${i === 2 ? " }" : ", "}`,
                  ""
              )
    return variantsOption
}

describe(label.unit("createTools - variants: before compose"), () => {
    // cache validation - before compose
    variantsCase.forEach(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ expectedClass, expectedComposedClass: _, ...option }) => {
            const cachedClass = boxVariants.class(option)

            test(
                label.case(`box variants, ${getVariantsOptionName(option)}`),
                () => {
                    expect(cachedClass).toBe(expectedClass)
                }
            )
        }
    )
})

describe(label.unit("createTools - variants: after compose"), () => {
    // cache validation - after compose
    variantsCase.forEach(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ expectedClass: _, expectedComposedClass, ...option }) => {
            boxVariants.compose({
                display: "grid",
                accentColor: "accent-red-400",
            })

            const cachedComposedClass = boxVariants.class(option)
            test(
                label.case(
                    `box variants composed, ${getVariantsOptionName(option)}`
                ),
                () => {
                    expect(cachedComposedClass).toBe(expectedComposedClass)
                }
            )
        }
    )
})

describe(label.unit("createTools - variants: composed cache"), () => {
    variantsCase.forEach(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ expectedClass: _, expectedComposedClass, ...option }) => {
            test(
                label.case(
                    `box variants cache, ${getVariantsOptionName(option)}`
                ),
                () => {
                    for (let i = 0; i < cacheAccessCount; i++) {
                        expect(boxVariants.class(option)).toBe(
                            expectedComposedClass
                        )
                    }
                }
            )
        }
    )
})

describe(label.unit("createTools - mergeProps"), () => {
    test(label.case("merge two stylesheet"), () => {
        expect(
            tw.mergeProps(
                {
                    display: "flex",
                    "@dark": {
                        backgroundColor: "dark:bg-amber-100",
                        ":hover": {
                            backgroundColor: "dark:hover:bg-amber-800",
                        },
                    },
                },
                {
                    display: "grid",
                    "@dark": {
                        backgroundColor: "dark:bg-red-100",
                        ":hover": {
                            backgroundColor: "dark:hover:bg-red-800",
                        },
                    },
                    padding: "p-2",
                }
            )
        ).toBe("grid dark:bg-red-100 dark:hover:bg-red-800 p-2")
    })

    test(label.case("overwrites the styles defined later"), () => {
        type SizeStyle = Pick<CustomTailwind, "padding" | "margin" | "@md">
        const ComponentWithSizeProps = (sizeStyle: SizeStyle) =>
            tw.mergeProps(
                {
                    display: "flex",
                    alignItems: "items-center",
                    justifyContent: "justify-center",

                    padding: "p-1",
                    margin: "m-1",

                    "@md": {
                        padding: "md:p-5",
                        margin: "md:m-5",
                    },
                },
                sizeStyle
            )

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
