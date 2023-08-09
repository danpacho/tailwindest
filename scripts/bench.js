import { BenchManager } from "./benchmark/bench.manager.js"
import * as bulk from "./bulk.data.js"

const ITER_COUNT = 10000000
/**@type {Array<Required<import("../packages/tailwindest/dist/index.js").GetVariants<typeof bulk.variants>>["bg"]>} */
const VARIANT_BG_OPTIONS = ["red", "blue", "green"]
/**@type {Array<Required<import("../packages/tailwindest/dist/index.js").GetVariants<typeof bulk.variants>>["size"]>} */
const VARIANT_SIZE_OPTIONS = ["pending", "warn"]

const bench = new BenchManager()
bench
    .start()

    .bench("style class", () => bulk.style.class, ITER_COUNT)
    .bench("style style", () => bulk.style.style, ITER_COUNT)

    .bench("toggle style [true]", () => bulk.toggle.style(true), ITER_COUNT)
    .bench("toggle class [true]", () => bulk.toggle.class(true), ITER_COUNT)
    .bench("toggle style [false]", () => bulk.toggle.style(false), ITER_COUNT)
    .bench("toggle class [false]", () => bulk.toggle.class(false), ITER_COUNT)

    .bench("rotary style [warn]", () => bulk.rotary.style("warn"), ITER_COUNT)
    .bench("rotary class [warn]", () => bulk.rotary.class("warn"), ITER_COUNT)
    .bench(
        "rotary style [pending]",
        () => bulk.rotary.style("pending"),
        ITER_COUNT
    )
    .bench(
        "rotary class [pending]",
        () => bulk.rotary.class("pending"),
        ITER_COUNT
    )

    .bench(
        "variants",
        (i) =>
            typeof i === "number"
                ? bulk.variants.class({
                      bg: VARIANT_BG_OPTIONS[i % 3],
                      size: VARIANT_SIZE_OPTIONS[i % 2],
                  })
                : bulk.variants.class({
                      bg: "blue",
                      size: "pending",
                  }),
        ITER_COUNT
    )

    .bench("merge props", () =>
        bulk.tw.mergeProps(bulk.rotary.style("pending"), {
            display: "grid",
        })
    )

    .bench(
        "⛔️ live compose rotary [warn] & [pending] into wind",
        () =>
            bulk.style.compose(
                bulk.rotary.style("warn"),
                bulk.rotary.style("pending")
            ).class
    )
    .bench(
        "⛔️ live compose rotary [pending] & [warn] into wind",
        () =>
            bulk.style.compose(
                bulk.rotary.style("pending"),
                bulk.rotary.style("warn")
            ).class
    )

    .getTotalBenchResult()
