import { describe, expect, test } from "vitest"
import { createTools } from "tailwindest"
import {
    composePrimitive,
    composeRotary,
    composeToggle,
    composeVariants,
    createEvaluationEngine,
    createPrimitiveModel,
    createRotaryModel,
    createToggleModel,
    createVariantsModel,
    flattenStyleRecord,
    mergeClassNames,
    primitiveClass,
    primitiveStyle,
    rotaryClassFor,
    rotaryStyleFor,
    toggleClassFor,
    toggleStyleFor,
    variantsClassFor,
    variantsStyleFor,
} from "../index"
import { flattenStyleRecord as runtimeFlattenStyleRecord } from "../../../tailwindest/src/tools/style_normalizer"
import { toDef as runtimeToDef } from "../../../tailwindest/src/tools/to_def"

type Style = Record<string, unknown>

const runtime = createTools<any>()
const merger = (...tokens: Array<string | string[]>): string =>
    tokens
        .flat()
        .flatMap((token) => token.split("|"))
        .flatMap((token) => token.split(" "))
        .filter(Boolean)
        .map((token) => token.trim().toUpperCase())
        .join("|")
const runtimeWithMerger = createTools<any>({ merger })

const baseStyle: Style = {
    display: "flex",
    padding: ["px-2", "py-1"],
    hover: {
        color: "text-blue-500",
        focus: {
            opacity: "opacity-90",
        },
    },
    group: {
        hover: {
            display: "block",
        },
    },
}

describe("@tailwindest/core runtime parity", () => {
    test("join, def, mergeRecord, and mergeProps match runtime semantics", () => {
        const engine = createEvaluationEngine()
        const classList = [
            "text-sm",
            ["font-bold", 7, 9n],
            {
                "bg-red-500": true,
                hidden: false,
                visible: 1,
            },
            null,
            undefined,
            false,
        ]
        const overrides = [
            baseStyle,
            {
                padding: ["px-4"],
                hover: {
                    color: "text-red-500",
                },
            },
        ]

        expect(engine.join(...classList)).toBe(runtime.join(...classList))
        expect(engine.mergeRecord(...overrides)).toEqual(
            runtime.mergeRecord(...overrides)
        )
        expect(engine.mergeProps(...overrides)).toBe(
            runtime.mergeProps(...overrides)
        )
        expect(engine.def(classList, ...overrides)).toBe(
            runtime.def(classList, ...overrides)
        )
    })

    test("primitive model class, style, and compose match runtime styler", () => {
        const runtimeStyler = runtime.style(baseStyle)
        const coreModel = createPrimitiveModel(baseStyle)

        expect(primitiveClass(coreModel)).toBe(runtimeStyler.class())
        expect(primitiveClass(coreModel, ["mt-2", ["mb-1"]])).toBe(
            runtimeStyler.class("mt-2", ["mb-1"])
        )
        expect(
            primitiveStyle(coreModel, [
                {
                    display: "grid",
                    focus: {
                        outline: "focus:outline-none",
                    },
                },
            ])
        ).toEqual(
            runtimeStyler.style({
                display: "grid",
                focus: {
                    outline: "focus:outline-none",
                },
            })
        )

        const composedRuntime = runtimeStyler.compose({ margin: "m-2" })
        const composedCore = composePrimitive(coreModel, [{ margin: "m-2" }])

        expect(primitiveClass(composedCore)).toBe(composedRuntime.class())
        expect(primitiveStyle(composedCore)).toEqual(composedRuntime.style())
    })

    test("toggle model class, style, and compose match runtime styler", () => {
        const config: { base: Style; truthy: Style; falsy: Style } = {
            base: { display: "flex" },
            truthy: { color: "text-green-500" },
            falsy: { color: "text-red-500" },
        }
        const runtimeStyler = runtime.toggle(config)
        const coreModel = createToggleModel(config)

        expect(toggleClassFor(coreModel, true)).toBe(runtimeStyler.class(true))
        expect(toggleClassFor(coreModel, false, ["opacity-50"])).toBe(
            runtimeStyler.class(false, "opacity-50")
        )
        expect(toggleStyleFor(coreModel, true)).toEqual(
            runtimeStyler.style(true)
        )
        expect(
            toggleStyleFor(coreModel, false, [
                { hover: { color: "text-pink-500" } },
            ])
        ).toEqual(
            runtimeStyler.style(false, { hover: { color: "text-pink-500" } })
        )

        const composedRuntime = runtimeStyler.compose({ margin: "m-1" })
        const composedCore = composeToggle(coreModel, [{ margin: "m-1" }])

        expect(toggleClassFor(composedCore, true)).toBe(
            composedRuntime.class(true)
        )
        expect(toggleStyleFor(composedCore, false)).toEqual(
            composedRuntime.style(false)
        )
    })

    test("rotary model class, style, and compose match runtime styler", () => {
        const config: { base: Style; variants: Record<string, Style> } = {
            base: { display: "inline-flex" },
            variants: {
                sm: { padding: "p-1" },
                lg: { padding: "p-4", hover: { color: "text-lg" } },
            },
        }
        const runtimeStyler = runtime.rotary(config)
        const coreModel = createRotaryModel(config)

        expect(rotaryClassFor(coreModel, "base")).toBe(
            runtimeStyler.class("base")
        )
        expect(rotaryClassFor(coreModel, "lg", ["shadow", ["ring"]])).toBe(
            runtimeStyler.class("lg", "shadow", ["ring"])
        )
        expect(rotaryStyleFor(coreModel, "sm")).toEqual(
            runtimeStyler.style("sm")
        )
        expect(rotaryStyleFor(coreModel, "missing")).toEqual(
            runtimeStyler.style("missing" as never)
        )

        const composedRuntime = runtimeStyler.compose({ margin: "m-4" })
        const composedCore = composeRotary(coreModel, [{ margin: "m-4" }])

        expect(rotaryClassFor(composedCore, "lg")).toBe(
            composedRuntime.class("lg")
        )
        expect(rotaryStyleFor(composedCore, "base")).toEqual(
            composedRuntime.style("base")
        )
    })

    test("variants model class, style, and compose match runtime styler", () => {
        const config: {
            base: Style
            variants: Record<string, Record<string, Style>>
        } = {
            base: { display: "inline-flex" },
            variants: {
                tone: {
                    neutral: { color: "text-zinc-700" },
                    danger: { color: "text-red-700" },
                },
                size: {
                    sm: { padding: "p-1" },
                    lg: { padding: "p-3" },
                },
            },
        }
        const runtimeStyler = runtime.variants(config)
        const coreModel = createVariantsModel(config)
        const props = { tone: "danger", size: "lg", ignored: "noop" } as const

        expect(variantsClassFor(coreModel, props)).toBe(
            runtimeStyler.class(props)
        )
        expect(variantsClassFor(coreModel, props, ["rounded"])).toBe(
            runtimeStyler.class(props, "rounded")
        )
        expect(variantsStyleFor(coreModel, props)).toEqual(
            runtimeStyler.style(props)
        )

        const composedRuntime = runtimeStyler.compose({ margin: "m-2" })
        const composedCore = composeVariants(coreModel, [{ margin: "m-2" }])

        expect(variantsClassFor(composedCore, props)).toBe(
            composedRuntime.class(props)
        )
        expect(variantsStyleFor(composedCore, props)).toEqual(
            composedRuntime.style(props)
        )
    })

    test("custom merger tokenization matches runtime tools", () => {
        const engine = createEvaluationEngine({ merger })
        const style = {
            display: "flex block",
            hover: {
                color: "text-blue-500",
            },
        }
        const runtimeStyler = runtimeWithMerger.style(style)
        const coreModel = createPrimitiveModel(style)

        expect(engine.join("flex block", ["px-2 py-1"])).toBe(
            runtimeWithMerger.join("flex block", ["px-2 py-1"])
        )
        expect(engine.mergeProps(style)).toBe(
            runtimeWithMerger.mergeProps(style)
        )
        expect(mergeClassNames(merger, "flex block", ["px-2 py-1"])).toBe(
            runtimeWithMerger
                .style({ display: "flex block" })
                .class("px-2 py-1")
        )
        expect(primitiveClass(coreModel, ["px-2 py-1"], merger)).toBe(
            runtimeStyler.class("px-2 py-1")
        )
    })

    test("core and runtime style normalizers use structural flattening", () => {
        const style = {
            dark: {
                color: "text-white",
                background: "dark:bg-zinc-900",
            },
            hover: {
                color: "text-blue-500",
            },
            "group-hover": {
                color: "text-blue-500",
            },
            default: {
                color: "text-zinc-900",
            },
            "#hover": {
                color: "text-red-500",
            },
        } satisfies Style

        expect(runtimeFlattenStyleRecord(style)).toEqual(
            flattenStyleRecord(style)
        )
        expect(flattenStyleRecord(style)).toEqual([
            "text-white",
            "dark:bg-zinc-900",
            "text-blue-500",
            "text-blue-500",
            "text-zinc-900",
            "text-red-500",
        ])
    })

    test("runtime toDef adapter matches core engine def semantics", () => {
        const engine = createEvaluationEngine()
        const customEngine = createEvaluationEngine({ merger })
        const classList = ["text-sm", ["font-bold"]]
        const styles = [
            { display: "flex", hover: { color: "text-blue-500" } },
            { display: "grid", focus: { color: "text-red-500" } },
        ]

        expect(
            runtimeToDef(classList, styles, engine.mergeProps, engine.join)
        ).toBe(engine.def(classList, ...styles))
        expect(
            runtimeToDef(
                classList,
                styles,
                customEngine.mergeProps,
                customEngine.join
            )
        ).toBe(customEngine.def(classList, ...styles))
    })
})
