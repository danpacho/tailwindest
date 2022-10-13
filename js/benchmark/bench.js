import { deepMerge, getTailwindClass } from "../../dist/dev/utils/index.js"
import { benchManager } from "./bench.manager.js"
import {
    base,
    test__wind$__DEV,
    test__wind$__PROD,
    test__wind__DEV,
    test__wind__PROD,
    variant,
} from "./test.js"

benchManager
    .start()

    .bench("deep merge__DEV", () => deepMerge(base, variant))

    .bench("deep merge -> get tw class__DEV", () =>
        getTailwindClass(deepMerge(base, variant))
    )

    .bench("wind class__DEV", () => test__wind__DEV.class())
    .bench("wind class__PROD", () => test__wind__PROD.class())

    .bench("wind style__DEV", () => test__wind__DEV.style(), 10000000)
    .bench("wind style__PROD", () => test__wind__PROD.style(), 10000000)

    .bench("wind$ class compose__DEV", () => test__wind$__DEV.class(), 10000000)
    .bench(
        "wind$ class compose__PROD",
        () => test__wind$__PROD.class(),
        10000000
    )

    .bench("wind$ style compose__DEV", () => test__wind$__DEV.style(), 10000000)
    .bench(
        "wind$ style compose__PROD",
        () => test__wind$__PROD.style(),
        10000000
    )

    .bench(
        "wind$ style [warn] compose__DEV",
        () => test__wind$__DEV.style("warn"),
        10000000
    )
    .bench(
        "wind$ style [warn] compose__PROD",
        () => test__wind$__PROD.style("warn"),
        10000000
    )

    .bench(
        "wind$ class [warn] compose__DEV",
        () => test__wind$__DEV.class("warn"),
        10000000
    )
    .bench(
        "wind$ class [warn] compose__PROD",
        () => test__wind$__PROD.class("warn"),
        10000000
    )

    .bench("wind$ style [pending] <multiple ❌> compose__DEV", () =>
        test__wind$__DEV
            .compose({
                "::after": {
                    "::after": {
                        accentColor: "after:after:accent-black",
                    },
                },
            })
            .style("pending")
    )
    .bench("wind$ style [pending] <multiple ❌> compose__PROD", () =>
        test__wind$__PROD
            .compose({
                "::after": {
                    "::after": {
                        accentColor: "after:after:accent-black",
                    },
                },
            })
            .style("pending")
    )

    .bench("wind$ class [pending] <multiple ❌> compose__DEV", () =>
        test__wind$__DEV
            .compose({
                "::after": {
                    "::after": {
                        accentColor: "after:after:accent-black",
                    },
                },
            })
            .class("pending")
    )
    .bench("wind$ class [pending] <multiple ❌> compose__PROD", () =>
        test__wind$__PROD
            .compose({
                "::after": {
                    "::after": {
                        accentColor: "after:after:accent-black",
                    },
                },
            })
            .class("pending")
    )

    .getTotalBenchResult()
