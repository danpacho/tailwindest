import { benchManager } from "./bench.manager.js"
import {
    test__rotary,
    test__style,
    test__toggle,
    test__variants,
    tw,
} from "./test.js"

const ITER_COUNT = 10000000
/**@type {Array<Required<import("../../dist/index.js").GetVariants<typeof test__variants>>["bg"]>} */
const VARIANT_BG_OPTIONS = ["red", "blue", "green"]
/**@type {Array<Required<import("../../dist/index.js").GetVariants<typeof test__variants>>["size"]>} */
const VARIANT_SIZE_OPTIONS = ["pending", "warn"]

benchManager
    .start()

    .bench("style class", () => test__style.class, ITER_COUNT)
    .bench("style style", () => test__style.style, ITER_COUNT)

    .bench("toggle style [true]", () => test__toggle.style(true), ITER_COUNT)
    .bench("toggle class [true]", () => test__toggle.class(true), ITER_COUNT)
    .bench("toggle style [false]", () => test__toggle.style(false), ITER_COUNT)
    .bench("toggle class [false]", () => test__toggle.class(false), ITER_COUNT)

    .bench("rotary style [warn]", () => test__rotary.style("warn"), ITER_COUNT)
    .bench("rotary class [warn]", () => test__rotary.class("warn"), ITER_COUNT)
    .bench(
        "rotary style [pending]",
        () => test__rotary.style("pending"),
        ITER_COUNT
    )
    .bench(
        "rotary class [pending]",
        () => test__rotary.class("pending"),
        ITER_COUNT
    )

    .bench(
        "variants",
        (i) =>
            typeof i === "number"
                ? test__variants.class({
                      bg: VARIANT_BG_OPTIONS[i % 3],
                      size: VARIANT_SIZE_OPTIONS[i % 2],
                  })
                : test__variants.class({
                      bg: "blue",
                      size: "pending",
                  }),
        ITER_COUNT
    )

    .bench("merge props", () =>
        tw.mergeProps(test__rotary.style("pending"), {
            display: "grid",
        })
    )

    .bench(
        "⛔️ live compose rotary [warn] & [pending] into wind",
        () =>
            test__style.compose(
                test__rotary.style("warn"),
                test__rotary.style("pending")
            ).class
    )
    .bench(
        "⛔️ live compose rotary [pending] & [warn] into wind",
        () =>
            test__style.compose(
                test__rotary.style("pending"),
                test__rotary.style("warn")
            ).class
    )

    .getTotalBenchResult()
