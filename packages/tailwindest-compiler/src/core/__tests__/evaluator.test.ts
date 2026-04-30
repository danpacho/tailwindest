import { describe, expect, it } from "vitest"
import { createTools } from "../../../../tailwindest/src/tools/create_tools"
import { Styler } from "../../../../tailwindest/src/tools/styler"
import {
    createEvaluationEngine,
    deepMerge,
    flattenRecord,
    getClassName,
} from "../evaluator"
import { createCompiledVariantResolver } from "../compiled_variant_resolver"
import type { StaticClassValue, StaticStyleObject } from "../static_value"

const variantResolver = createCompiledVariantResolver([
    "*",
    "2xl",
    "@2xl",
    "@sm",
    "[&>*]",
    "aria-expanded",
    "before",
    "dark",
    "data-[state=open]",
    "focus",
    "group-hover",
    "hover",
    "max-sm",
    "md",
    "peer-focus",
])
const variantOptions = { variantResolver }
const engine = createEvaluationEngine(variantOptions)
const runtimeTools = createTools()

describe("evaluation engine", () => {
    it("flattenRecord returns [] for nullish and empty style records", () => {
        expect(flattenRecord(undefined)).toEqual([])
        expect(flattenRecord(null)).toEqual([])
        expect(flattenRecord({})).toEqual(Styler.flattenRecord({}))
    })

    it("flattenRecord preserves insertion order for nested compiled records and special keys", () => {
        const style = {
            display: "flex",
            nested: {
                "2": "two",
                "1": "one",
                base: "base-class",
                true: "true-class",
                false: "false-class",
            },
            hover: {
                color: "hover:text-blue-500",
                focus: {
                    ring: "focus:ring-2",
                },
            },
        }

        expect(flattenRecord(style, variantOptions)).toEqual([
            "flex",
            "one",
            "two",
            "base-class",
            "true-class",
            "false-class",
            "hover:text-blue-500",
            "hover:focus:ring-2",
        ])
    })

    it("flattenRecord flattens array values as runtime currently does", () => {
        const style = {
            padding: ["px-2", ["py-1", { nested: "gap-2" }]],
            ignoredNumber: 1,
            nested: {
                margin: ["mx-1", "my-1"],
            },
        }

        expect(flattenRecord(style)).toEqual(Styler.flattenRecord(style))
        expect(flattenRecord(style)).toEqual([
            "px-2",
            "py-1",
            "gap-2",
            "mx-1",
            "my-1",
        ])
    })

    it("deepMerge matches runtime last-win behavior for strings, arrays, nested objects, and mixed values", () => {
        const first = {
            color: "text-gray-950",
            padding: ["px-2"],
            state: {
                hover: "hover:bg-gray-100",
                focus: ["focus:ring-1"],
                mixed: ["old"],
            },
            mixedRoot: ["old-root"],
        }
        const second = {
            color: "text-red-100",
            padding: ["px-4", "py-2"],
            state: {
                focus: ["focus:ring-2"],
                active: "active:bg-red-100",
                mixed: "new",
            },
            mixedRoot: "new-root",
        }
        const third = {
            color: "text-blue-100",
            state: {
                hover: "hover:bg-blue-100",
            },
        }

        expect(deepMerge([first, second, third])).toEqual(
            Styler.deepMerge(
                first as Record<string, unknown>,
                second as Record<string, unknown>,
                third as Record<string, unknown>
            )
        )
        expect(deepMerge([first, second, third])).toEqual({
            color: "text-blue-100",
            padding: ["px-4", "py-2"],
            state: {
                hover: "hover:bg-blue-100",
                focus: ["focus:ring-2"],
                mixed: "new",
                active: "active:bg-red-100",
            },
            mixedRoot: "new-root",
        })
    })

    it("getClassName prefixes nested compiled variant keys", () => {
        const style = {
            dark: {
                backgroundColor: "bg-red-900",
                hover: {
                    backgroundColor: "bg-red-950",
                },
            },
            backgroundColor: "bg-red-50",
        }

        expect(getClassName(style, variantOptions)).toBe(
            "dark:bg-red-900 dark:hover:bg-red-950 bg-red-50"
        )
    })

    it("getClassName preserves explicit prefixes, completes partial prefixes, and ignores unknown grouping keys", () => {
        const style = {
            background: "bg-[#123456]",
            width: "w-[calc(100%-1rem)]",
            custom: "bg-(--my-color)",
            dark: {
                backgroundColor: "dark:bg-red-900",
                hover: {
                    backgroundColor: "hover:bg-red-950",
                },
            },
            surface: {
                backgroundColor: "bg-white",
            },
            md: {
                hover: {
                    color: "text-blue-600",
                },
            },
            "@sm": {
                padding: ["px-4", ["py-2"]],
            },
            "[&>*]": {
                margin: "mt-2",
            },
            empty: {},
        }

        expect(getClassName(style, variantOptions)).toBe(
            "bg-[#123456] w-[calc(100%-1rem)] bg-(--my-color) dark:bg-red-900 dark:hover:bg-red-950 bg-white md:hover:text-blue-600 @sm:px-4 @sm:py-2 [&>*]:mt-2"
        )
    })

    it("getClassName handles extended, arbitrary, group, peer, and legacy explicit variant chains", () => {
        const style = {
            "*": {
                color: "text-red-600",
            },
            "max-sm": {
                display: "hidden",
            },
            before: {
                content: "content-['']",
            },
            "aria-expanded": {
                display: "block",
            },
            "data-[state=open]": {
                color: "text-blue-600",
            },
            group: {
                hover: {
                    backgroundColor: "bg-blue-500",
                },
            },
            peer: {
                focus: {
                    color: "text-sky-600",
                },
            },
            dark: {
                group: {
                    hover: {
                        backgroundColor: "bg-blue-500",
                    },
                },
            },
            legacy: {
                "*": {
                    "2xl": {
                        "@2xl": {
                            padding: "**:*:2xl:3xl:4xl:@2xl:px-1000",
                        },
                    },
                },
            },
        }

        expect(getClassName(style, variantOptions)).toBe(
            "*:text-red-600 max-sm:hidden before:content-[''] aria-expanded:block data-[state=open]:text-blue-600 group-hover:bg-blue-500 peer-focus:text-sky-600 dark:group-hover:bg-blue-500 **:*:2xl:3xl:4xl:@2xl:px-1000"
        )
    })

    it("join matches createTools/clsx behavior for supported static class values", () => {
        const values = [
            "bg-red-100",
            ["p-2", ["m-2", { nested: true, skipped: false }]],
            { cls: true, cls2: false, truthy: 1, big: 2n },
            true,
            false,
            null,
            undefined,
            0,
            7,
            2n,
        ] satisfies StaticClassValue[]

        const result = engine.join(values, { kind: "none" })

        expect(result.value).toBe(runtimeTools.join(...(values as never[])))
        expect(result.value).toBe("bg-red-100 p-2 m-2 nested cls truthy big 7")
        expect(result.candidates).toEqual([
            "bg-red-100",
            "p-2",
            "m-2",
            "nested",
            "cls",
            "truthy",
            "big",
            "7",
        ])
        expect(result.exact).toBe(true)
        expect(result.diagnostics).toEqual([])
    })

    it("def emits class list first and merged style output after it", () => {
        const classList = [
            "bg-red-100",
            "p-2",
            { cls: true, cls2: false },
            ["arr1", "arr2", { cls3: true }],
        ] satisfies StaticClassValue[]
        const styles = [
            {
                backgroundColor: "bg-red-100",
                padding: ["px-2"],
            },
            {
                backgroundColor: "bg-blue-100",
                padding: "p-2",
            },
            {
                hover: {
                    backgroundColor: "hover:bg-blue-100",
                },
            },
        ] satisfies StaticStyleObject[]

        const result = engine.def(classList, styles, { kind: "none" })

        expect(result.value).toBe(
            runtimeTools.def(classList as never, ...styles)
        )
        expect(result.value).toBe(
            "bg-red-100 p-2 cls arr1 arr2 cls3 bg-blue-100 p-2 hover:bg-blue-100"
        )
        expect(result.candidates).toEqual([
            "bg-red-100",
            "p-2",
            "cls",
            "arr1",
            "arr2",
            "cls3",
            "bg-blue-100",
            "p-2",
            "hover:bg-blue-100",
        ])
    })

    it("mergeRecord and mergeProps match runtime output for multi-record overrides", () => {
        const styles = [
            {
                color: "text-gray-950",
                fontWeight: "font-bold",
                fontSize: "text-base",
                nested: {
                    padding: "px-2",
                    margin: "mx-1",
                },
            },
            {
                color: "text-red-100",
                nested: {
                    padding: "px-4",
                },
            },
            {
                color: "text-blue-100",
                nested: {
                    padding: "px-6",
                },
            },
        ] satisfies StaticStyleObject[]

        expect(engine.mergeRecord(styles).value).toEqual(
            runtimeTools.mergeRecord(...styles)
        )
        expect(engine.mergeProps(styles, { kind: "none" }).value).toBe(
            runtimeTools.mergeProps(...styles)
        )
        expect(engine.mergeProps(styles, { kind: "none" }).value).toBe(
            "text-blue-100 font-bold text-base px-6 mx-1"
        )
    })
})
