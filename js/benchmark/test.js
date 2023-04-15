/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createVariants, createWind } from "../../dist/index.js"

/** @typedef {import("tailwindest").Tailwindest<{}, {}>} CustomTailwind */
/** @typedef {ReturnType<typeof createWind<CustomTailwind>>} CreateWind */
/** @typedef {Required<CustomTailwind>} Tailwind */

/** @type {CreateWind} */
const { wind, wind$, mergeProps } = createWind()

/**@type {CustomTailwind} */
const base = {
    "::after": {
        "::placeholder": {
            backdropBlur: "after:placeholder:backdrop-blur-2xl",
        },
    },
    paddingX: "px-1.5",
    paddingY: "py-0.5",
    backgroundColor: "bg-gray-100",
    "::first-letter": {
        backdropBlur: "first-letter:backdrop-blur-2xl",
        "::after": {
            accentColor: "first-letter:after:accent-amber-100",
        },
    },
    borderWidth: "border-2",
    borderColor: "border-black",
    borderRadius: "rounded-sm",

    fontSize: "text-base",
    fontWeight: "font-bold",
    color: "text-black",

    transition: "transition ease-out",
    border: "border-amber-200 border-solid",
    "@dark": {
        backgroundColor: "dark:bg-neutral-800",
        color: "dark:text-white",
        borderColor: "dark:border-neutral-600",
        "@md": {
            backdropBlur: "dark:md:backdrop-blur-2xl",
        },
    },
    ":hover": {
        animation: "hover:animate-ping",
        backgroundColor: "hover:bg-neutral-400",
    },
    ":active": {
        transformScale: "active:scale-105",
    },
    "@peer": {
        ":disabled": {
            "@dark": {
                backdropBlur: "peer-disabled:dark:backdrop-blur-2xl",
            },
            backgroundColor: "peer-disabled:bg-amber-900",
        },
    },
}

/**
 * @description `wind`, no variants mode
 */
const test__wind = wind(base)

/**
 * @description centering style, composed to the `wind$`
 */
const centering = wind({
    display: "flex",
    alignItems: "items-center",
    justifyContent: "justify-center",
    margin: "m-auto",
}).style()

/**
 * @description `wind$` with `warn` | `pending` variants
 * @description compose with `base` & `centering` styles
 */
const test__wind$ = wind$("warn", "pending")(
    {
        // should be removed
        display: "hidden",
        alignItems: "items-baseline",
        justifyContent: "justify-between",
        margin: "m-1",
        // should be removed

        padding: "p-1.5",

        fontWeight: "font-bold",
        color: "text-black",
        backgroundColor: "bg-gray-50",
        ":hover": {
            color: "hover:text-gray-100",
            backgroundColor: "hover:bg-gray-800",
        },
    },
    {
        pending: {
            backgroundColor: "bg-yellow-400",
            ":hover": {
                backgroundColor: "hover:bg-yellow-800",
            },
            "@dark": {
                backgroundColor: "dark:bg-yellow-300",
                ":hover": {
                    backgroundColor: "dark:hover:bg-yellow-500",
                },
            },
        },
        warn: {
            backgroundColor: "bg-red-400",
            ":hover": {
                backgroundColor: "hover:bg-red-800",
            },
            "@dark": {
                backgroundColor: "dark:bg-red-300",
                ":hover": {
                    backgroundColor: "dark:hover:bg-red-500",
                },
            },
        },
    }
    // @ts-ignore
).compose(base, centering)

const variants = createVariants({
    size: test__wind$,
    bg: test__wind$,
})

export { base, variants, test__wind$, test__wind, mergeProps }
