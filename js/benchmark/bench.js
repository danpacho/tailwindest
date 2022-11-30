import { deepMerge, getTailwindClass } from "../../dist/dev/core/index.js"
import { mergeProps } from "../../dist/index.js"
import { benchManager } from "./bench.manager.js"
import {
    base,
    test__wind$__DEV,
    test__wind$__PROD,
    test__wind__DEV,
    test__wind__PROD,
    variant,
    variants__DEV,
    variants__PROD,
} from "./test.js"

benchManager
    .start()

    .bench("deep merge__DEV", () => deepMerge(base, variant))

    .bench("deep merge -> get tw class__DEV", () =>
        getTailwindClass(deepMerge(base, variant))
    )

    .bench("wind class__DEV", () => test__wind__DEV.class(), 10000000)
    .bench("wind class__PROD", () => test__wind__PROD.class(), 10000000)

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

    .bench(
        "variants__DEV",
        () =>
            variants__DEV({
                bg: "pending",
                size: "warn",
            }),
        10000000
    )
    .bench(
        "variants__PROD",
        () =>
            variants__PROD({
                bg: "pending",
                size: "warn",
            }),
        10000000
    )

    .bench("merge props", () =>
        mergeProps(test__wind$__PROD.style(), {
            display: "grid",
        })
    )

    .bench("⛔️ live compose wind$ [warn] & [pending] into wind__DEV", () =>
        test__wind__DEV
            .compose(
                test__wind$__DEV.style("warn"),
                test__wind$__DEV.style("pending")
            )
            .class()
    )
    .bench("⛔️ live compose wind$ [warn] & [pending] into wind__PROD", () =>
        test__wind__PROD
            .compose(
                test__wind$__PROD.style("warn"),
                test__wind$__PROD.style("pending")
            )
            .class()
    )
    .bench("⛔️ live compose wind$ [pending] & [warn] into wind__DEV", () =>
        test__wind__DEV
            .compose(
                test__wind$__DEV.style("pending"),
                test__wind$__DEV.style("warn")
            )
            .class()
    )
    .bench("⛔️ live compose wind$ [pending] & [warn] into wind__PROD", () =>
        test__wind__PROD
            .compose(
                test__wind$__PROD.style("pending"),
                test__wind$__PROD.style("warn")
            )
            .class()
    )

    .getTotalBenchResult()
