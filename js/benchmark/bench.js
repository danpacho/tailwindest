import { benchManager } from "./bench.manager.js"
import { mergeProps, test__wind, test__wind$, variants } from "./test.js"

benchManager
    .start()

    .bench("wind class", () => test__wind.class(), 10000000)

    .bench("wind style", () => test__wind.style(), 10000000)

    .bench("wind$ class compose", () => test__wind$.class(), 10000000)

    .bench("wind$ style compose", () => test__wind$.style(), 10000000)

    .bench(
        "wind$ style [warn] compose",
        () => test__wind$.style("warn"),
        10000000
    )
    .bench(
        "wind$ class [warn] compose",
        () => test__wind$.class("warn"),
        10000000
    )

    .bench(
        "variants",
        () =>
            variants({
                bg: "pending",
                size: "warn",
            }),
        10000000
    )

    .bench("merge props", () =>
        mergeProps(test__wind$.style(), {
            display: "grid",
        })
    )

    .bench("⛔️ live compose wind$ [warn] & [pending] into wind", () =>
        test__wind
            .compose(test__wind$.style("warn"), test__wind$.style("pending"))
            .class()
    )
    .bench("⛔️ live compose wind$ [pending] & [warn] into wind", () =>
        test__wind
            .compose(test__wind$.style("pending"), test__wind$.style("warn"))
            .class()
    )

    .getTotalBenchResult()
