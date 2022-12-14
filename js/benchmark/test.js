/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
    createVariants as createVariants__DEV,
    wind$ as wind$__DEV,
    wind as wind__DEV,
} from "../../dist/dev/index.js"
import {
    createVariants as createVariants__PROD,
    wind$ as wind$__PROD,
    wind as wind__PROD,
} from "../../dist/index.js"

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

const variant = {
    backgroundColor: "bg-red-600",
    borderColor: "border-red-400",
    color: "text-white",
    alignContent: "content-end",
    ringColor: "ring-amber-400",
    transition: "transition ease-linear",
    border: "border-red-400 border-solid",
    "@dark": {
        backgroundColor: "dark:bg-red-500",
        color: "dark:text-white",
        borderColor: "dark:border-red-300",
        ":hover": {
            backgroundColor: "dark:hover:bg-red-800",
            accentColor: "dark:hover:accent-amber-100",
        },
        "::after": {
            accentColor: "dark:after:accent-amber-100",
        },
        "@md": {
            backdropBlur: "dark:md:backdrop-blur-none",
        },
    },
    ":hover": {
        backgroundColor: "hover:bg-red-200",
        "::after": {
            accentColor: "hover:after:accent-amber-100",
            alignItems: "hover:after:items-baseline",
        },
    },
    "@peer": {
        ":disabled": {
            "@dark": {
                backdropBlur: "peer-disabled:dark:backdrop-blur-xl",
            },
            backgroundColor: "peer-disabled:bg-amber-200",
        },
        ":hover": {
            boxShadow: "peer-hover:shadow-inner",
        },
    },
}

/**
 * @development
 * @description `wind`, no variants mode
 */
const test__wind__DEV = wind__DEV(base)

/**
 * @production
 * @description `wind`, no variants mode
 */
// @ts-ignore
const test__wind__PROD = wind__PROD(base)

/**
 * @production
 * @description centering style, composed to the `wind$`
 */
const centering = wind__PROD({
    display: "flex",
    alignItems: "items-center",
    justifyContent: "justify-center",
    margin: "m-auto",
}).style()

/**
 * @development
 * @description `wind$` with `warn` | `pending` variants
 * @description compose with `base` & `centering` styles
 */
const test__wind$__DEV = wind$__DEV("warn", "pending")(
    {
        //! should be replaced by centering start
        display: "hidden",
        alignItems: "items-baseline",
        justifyContent: "justify-between",
        margin: "m-1",
        //! should be replaced by centering end

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
).compose(base, centering)

/**
 * @production
 * @description `wind$` with `warn` | `pending` variants
 * @description compose with `base` & `centering` styles
 */
const test__wind$__PROD = wind$__PROD("warn", "pending")(
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

const variants__PROD = createVariants__PROD({
    size: test__wind$__PROD,
    bg: test__wind$__PROD,
})

const variants__DEV = createVariants__DEV({
    size: test__wind$__PROD,
    bg: test__wind$__PROD,
})

export {
    base,
    variant,
    test__wind$__DEV,
    test__wind$__PROD,
    test__wind__DEV,
    test__wind__PROD,
    variants__DEV,
    variants__PROD,
}
