import {
    composeWind as composeWind__DEV,
    wind as wind__DEV,
} from "../../dist/dev/index.js"
import { deepMerge, getTwClass } from "../../dist/dev/utils/index.js"
import {
    composeWind as composeWind__PROD,
    wind as wind__PROD,
} from "../../dist/index.js"
import { bench } from "./bench.js"

/** @typedef {import('../../dist/types/tailwindest/index').Tailwindest} Tailwindest */
/** @type {Tailwindest} */
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
    borderWidth: "border",
    borderColor: "border-black",
    borderRadius: "rounded-sm",

    fontSize: "text-base",
    fontWeight: "font-bold",
    color: "text-black",

    transition: "transition duration-75 ease-out",
    border: "border border-solid border-amber-200",
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

/** @type {Tailwindest} */
const variant = {
    backgroundColor: "bg-red-600",
    borderColor: "border-red-400",
    color: "text-white",
    alignContent: "content-end",
    ringColor: "ring-amber-400",
    transition: "transition duration-200 ease-linear",
    border: "border border-solid border-red-400",
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

// PRODUCTION
const test__PROD = wind__PROD(base, {
    warn: variant,
})
const test2__PROD = wind__PROD(base, {
    combine: variant,
})

// DEV
const test__DEV = wind__DEV(base, {
    warn: variant,
})
const test2__DEV = wind__PROD(base, {
    combine: variant,
})

bench
    .start()
    .bench("deep merge", () => deepMerge(base, variant))
    .bench("tw class with deep merge", () =>
        getTwClass(deepMerge(base, variant))
    )

    .bench("wind class base cache__DEV", () => test__PROD.class(), 10000000)
    .bench("wind class base cache__PROD", () => test__DEV.class(), 10000000)

    .bench("wind style base cache__DEV", () => test__PROD.style(), 10000000)
    .bench("wind style base cache__PROD", () => test__DEV.style(), 10000000)

    .bench(
        "wind class variant cache__DEV",
        () => test__PROD.class("warn"),
        10000000
    )
    .bench(
        "wind class variant cache__PROD",
        () => test__DEV.class("warn"),
        10000000
    )

    .bench(
        "wind style variant cache__DEV",
        () => test__PROD.style("warn"),
        10000000
    )
    .bench(
        "wind style variant cache__PROD",
        () => test__DEV.style("warn"),
        10000000
    )

    .bench("wind compose__DEV", () =>
        composeWind__DEV(test__DEV.style(), test2__PROD.style("combine"))
    )
    .bench("wind compose__PROD", () =>
        composeWind__PROD(test__DEV.style(), test2__DEV.style("combine"))
    )
    .getTotalBenchResult()
