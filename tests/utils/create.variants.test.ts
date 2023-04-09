import { describe, expect, test } from "@jest/globals"
import { Tailwindest, createVariants, createWind } from "../../packages"
import { label } from "../label"

const { wind$ } = createWind<Tailwindest>()

const boxSize = wind$("sm", "md")(
    {
        display: "flex",
        alignItems: "items-center",
        justifyContent: "justify-center",

        fontSize: "text-base",
        backgroundColor: "bg-amber-50",
    },
    {
        sm: {
            padding: "p-1",
        },
        md: {
            padding: "p-2",
        },
    }
)

const boxType = wind$("badge", "outline")(
    {
        borderRadius: "rounded-md",
    },
    {
        badge: {
            flexDirection: "flex-row",
            gap: "gap-1",
        },
        outline: {
            borderColor: "border-transparent",
            borderStyle: "border-solid",
            borderWidth: "border-2",
        },
    }
)

const boxColor = wind$("red", "blue")(
    {
        backgroundColor: "bg-white",
        borderColor: "border-gray-100",
        color: "text-black",
        "@dark": {
            backgroundColor: "dark:bg-neutral-900",
            borderColor: "dark:border-neutral-700",
        },
    },
    {
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
    }
)

const box = createVariants({
    size: boxSize,
    type: boxType,
    color: boxColor,
})

const variantsCase: {
    size?: "sm" | "md"
    type?: "badge" | "outline"
    color?: "red" | "blue"
    expectedClass: string
}[] = [
    {
        size: "sm",
        type: "badge",
        color: "blue",
        expectedClass:
            "flex items-center justify-center text-base bg-indigo-500 p-1 rounded-md flex-row gap-1 border-indigo-300 text-white dark:bg-indigo-900 dark:border-indigo-700",
    },
    {
        size: "sm",
        type: "badge",
        color: "red",
        expectedClass:
            "flex items-center justify-center text-base bg-red-500 p-1 rounded-md flex-row gap-1 border-red-300 text-white dark:bg-red-900 dark:border-red-700",
    },
    {
        size: "sm",
        type: "outline",
        color: "blue",
        expectedClass:
            "flex items-center justify-center text-base bg-indigo-500 p-1 rounded-md border-indigo-300 border-solid border-2 text-white dark:bg-indigo-900 dark:border-indigo-700",
    },
    {
        size: "sm",
        type: "outline",
        color: "red",
        expectedClass:
            "flex items-center justify-center text-base bg-red-500 p-1 rounded-md border-red-300 border-solid border-2 text-white dark:bg-red-900 dark:border-red-700",
    },
    {
        size: "md",
        type: "badge",
        color: "blue",
        expectedClass:
            "flex items-center justify-center text-base bg-indigo-500 p-2 rounded-md flex-row gap-1 border-indigo-300 text-white dark:bg-indigo-900 dark:border-indigo-700",
    },
    {
        size: "md",
        type: "badge",
        color: "red",
        expectedClass:
            "flex items-center justify-center text-base bg-red-500 p-2 rounded-md flex-row gap-1 border-red-300 text-white dark:bg-red-900 dark:border-red-700",
    },
    {
        size: "md",
        type: "outline",
        color: "blue",
        expectedClass:
            "flex items-center justify-center text-base bg-indigo-500 p-2 rounded-md border-indigo-300 border-solid border-2 text-white dark:bg-indigo-900 dark:border-indigo-700",
    },
    {
        size: "md",
        type: "outline",
        color: "red",
        expectedClass:
            "flex items-center justify-center text-base bg-red-500 p-2 rounded-md border-red-300 border-solid border-2 text-white dark:bg-red-900 dark:border-red-700",
    },
    {
        size: "md",
        expectedClass:
            "flex items-center justify-center text-base bg-white p-2 rounded-md border-gray-100 text-black dark:bg-neutral-900 dark:border-neutral-700",
    },
    {
        color: "blue",
        expectedClass:
            "flex items-center justify-center text-base bg-indigo-500 rounded-md border-indigo-300 text-white dark:bg-indigo-900 dark:border-indigo-700",
    },
    {
        type: "outline",
        expectedClass:
            "flex items-center justify-center text-base bg-white rounded-md border-gray-100 border-solid border-2 text-black dark:bg-neutral-900 dark:border-neutral-700",
    },
    {
        expectedClass:
            "flex items-center justify-center text-base bg-white rounded-md border-gray-100 text-black dark:bg-neutral-900 dark:border-neutral-700",
    },
]

describe(label.unit("createVariants"), () => {
    variantsCase.forEach(({ expectedClass, ...option }) => {
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

        const cachedClass = box(option)

        test(label.case(`box variants, ${variantsOption}`), () => {
            expect(cachedClass).toBe(expectedClass)
        })

        const cacheAccessCount = 1000
        test(label.case(`box variants cache, ${variantsOption}`), () => {
            for (let i = 0; i < cacheAccessCount; i++) {
                expect(box(option)).toBe(cachedClass)
            }
        })
    })
})
