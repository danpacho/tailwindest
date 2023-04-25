//@ts-check
import { createTools } from "../../dist/index.js"

/** @typedef {import("../../packages").Tailwindest<{}, {}>} CustomTailwind */
/** @typedef {ReturnType<typeof createTools<CustomTailwind>>} CreateWind */
/** @typedef {Required<CustomTailwind>} Tailwind */

/** @type {CreateWind} */
const tw = createTools()

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
 * @description `style`, no variants mode
 */
const test__style = tw.style(base)

/**
 * @description centering style, composed to the `wind$`
 */
const centering = tw
    .style({
        display: "flex",
        alignItems: "items-center",
        justifyContent: "justify-center",
        margin: "m-auto",
    })
    .style()

/**
 * @description `wind$` with `warn` | `pending` variants
 * @description compose with `base` & `centering` styles
 */
const test__rotary = tw
    .rotary({
        base: {
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
    })
    .compose(base, centering)

const test__toggle = tw.toggle({
    falsy: {
        borderColor: "border-red-100",
        backgroundColor: "bg-white",
        "@dark": {
            borderColor: "dark:border-red-400",
            backgroundColor: "dark:bg-red-950",
        },
    },
    truthy: {
        borderColor: "border-blue-100",
        backgroundColor: "bg-white",
        "@dark": {
            borderColor: "dark:border-blue-400",
            backgroundColor: "dark:bg-blue-950",
        },
    },
    base: {
        display: "flex",
        alignItems: "items-center",
        justifyContent: "justify-center",
        flexDirection: "flex-col",
        gap: "gap-2",

        padding: "p-2",
        margin: "m-2.5",

        borderWidth: "border",
        borderColor: "border-transparent",
        backgroundColor: "bg-transparent",

        color: "text-black",
        "@dark": {
            color: "dark:text-white",
        },
    },
})

const test__variants = tw.variants({
    size: {
        base: {
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
    },
    bg: {
        red: {
            fontWeight: "font-bold",
            color: "text-white",
            backgroundColor: "bg-red-500",
            ":hover": {
                color: "hover:text-gray-100",
                backgroundColor: "hover:bg-red-800",
            },
        },
        blue: {
            fontWeight: "font-bold",
            color: "text-white",
            backgroundColor: "bg-blue-500",
            ":hover": {
                color: "hover:text-gray-100",
                backgroundColor: "hover:bg-blue-800",
            },
        },
        green: {
            fontWeight: "font-bold",
            color: "text-white",
            backgroundColor: "bg-green-500",
            ":hover": {
                color: "hover:text-gray-100",
                backgroundColor: "hover:bg-green-800",
            },
        },
    },
})

export { base, test__variants, test__rotary, test__style, test__toggle, tw }
