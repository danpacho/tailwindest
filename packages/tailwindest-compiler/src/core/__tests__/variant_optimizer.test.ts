import { describe, expect, it } from "vitest"
import {
    optionalVariantStateCount,
    optimizeVariants,
    styleWritePaths,
    variantCombinationCount,
} from "../variant_optimizer"

const base = {
    display: "inline-flex",
    color: "text-gray-900",
}

describe("variant optimizer conflict graph", () => {
    it("uses style path write sets, not class token text, for conflicts", () => {
        const left = {
            color: "shared-token",
            nested: {
                padding: "px-2",
            },
        }
        const right = {
            background: "shared-token",
            nested: {
                margin: "mx-2",
            },
        }

        expect(styleWritePaths(left)).toEqual(["color", "nested.padding"])
        expect(styleWritePaths(right)).toEqual(["background", "nested.margin"])

        const optimized = optimizeVariants({
            base,
            variants: {
                tone: { warm: left },
                surface: { warm: right },
            },
        })

        expect(optimized.additiveAxes.map((axis) => axis.axis)).toEqual([
            "tone",
            "surface",
        ])
        expect(optimized.components).toEqual([])
        expect(optimized.strategy).toBe("additive")
    })

    it("independent axes emit additive maps and avoid a full cartesian table", () => {
        const optimized = optimizeVariants({
            base,
            variants: {
                size: {
                    sm: { padding: "px-2" },
                    lg: { padding: "px-4" },
                },
                tone: {
                    quiet: { border: "border-transparent" },
                    loud: { border: "border-current" },
                },
                weight: {
                    normal: { fontWeight: "font-normal" },
                    bold: { fontWeight: "font-bold" },
                },
            },
        })

        expect(
            variantCombinationCount(
                ["size", "tone", "weight"],
                optimized.axisValueKeys
            )
        ).toBe(8)
        expect(optimized.strategy).toBe("additive")
        expect(optimized.additiveAxes.map((axis) => axis.axis)).toEqual([
            "size",
            "tone",
            "weight",
        ])
        expect(optimized.components).toEqual([])
        expect(optimized.classCandidates).toEqual(
            expect.arrayContaining([
                "inline-flex",
                "text-gray-900",
                "px-2",
                "px-4",
                "border-transparent",
                "border-current",
                "font-normal",
                "font-bold",
            ])
        )
    })

    it("conflicting axes emit component tables with every combination candidate", () => {
        const optimized = optimizeVariants({
            base,
            variants: {
                intent: {
                    primary: {
                        color: "text-blue-700",
                        background: "bg-blue-50",
                    },
                    danger: { color: "text-red-700", background: "bg-red-50" },
                },
                emphasis: {
                    weak: { color: "text-gray-500" },
                    strong: { color: "text-black" },
                },
            },
        })

        expect(optimized.strategy).toBe("component")
        expect(optimized.additiveAxes).toEqual([])
        expect(optimized.components).toHaveLength(1)
        expect(optimized.components[0]?.axes).toEqual(["intent", "emphasis"])
        expect(
            Object.keys(optimized.components[0]?.classTable ?? {})
        ).toHaveLength(9)
        expect(optimized.classCandidates).toEqual(
            expect.arrayContaining([
                "text-blue-700",
                "bg-blue-50",
                "text-red-700",
                "bg-red-50",
                "text-gray-500",
                "text-black",
            ])
        )
    })

    it("mixed graph emits additive maps plus component tables", () => {
        const optimized = optimizeVariants({
            base,
            variants: {
                intent: {
                    primary: { color: "text-blue-700" },
                    danger: { color: "text-red-700" },
                },
                emphasis: {
                    weak: { color: "text-gray-500" },
                    strong: { color: "text-black" },
                },
                size: {
                    sm: { padding: "px-2" },
                    lg: { padding: "px-4" },
                },
            },
        })

        expect(optimized.strategy).toBe("mixed")
        expect(optimized.components[0]?.axes).toEqual(["intent", "emphasis"])
        expect(optimized.additiveAxes.map((axis) => axis.axis)).toEqual([
            "size",
        ])
    })

    it("supports boolean-like and numeric-like variant keys", () => {
        const optimized = optimizeVariants({
            base,
            variants: {
                enabled: {
                    true: { opacity: "opacity-100" },
                    false: { opacity: "opacity-50" },
                },
                columns: {
                    "1": { gridTemplateColumns: "grid-cols-1" },
                    "2": { gridTemplateColumns: "grid-cols-2" },
                },
            },
        })

        expect(optimized.axisValueKeys.enabled).toEqual(["true", "false"])
        expect(optimized.axisValueKeys.columns).toEqual(["1", "2"])
        expect(optimized.classCandidates).toEqual(
            expect.arrayContaining([
                "opacity-100",
                "opacity-50",
                "grid-cols-1",
                "grid-cols-2",
            ])
        )
    })

    it("allows component tables under the optional-state variantTableLimit", () => {
        const optimized = optimizeVariants({
            base,
            variants: {
                one: {
                    a: { color: "text-a" },
                    b: { color: "text-b" },
                },
                two: {
                    c: { color: "text-c" },
                    d: { color: "text-d" },
                },
            },
            variantTableLimit: 9,
        })

        expect(optimized.exact).toBe(true)
        expect(
            optionalVariantStateCount(["one", "two"], optimized.axisValueKeys)
        ).toBe(9)
        expect(
            Object.keys(optimized.components[0]?.classTable ?? {})
        ).toHaveLength(9)
        expect(optimized.diagnostics).toEqual([])
    })

    it("over limit fallback counts optional missing states in the emitted table size", () => {
        const optimized = optimizeVariants({
            base,
            variants: {
                one: {
                    a: { color: "text-a" },
                    b: { color: "text-b" },
                },
                two: {
                    c: { color: "text-c" },
                    d: { color: "text-d" },
                },
            },
            variantTableLimit: 4,
        })

        expect(
            optionalVariantStateCount(["one", "two"], optimized.axisValueKeys)
        ).toBe(9)
        expect(optimized.exact).toBe(false)
        expect(optimized.components).toEqual([])
        expect(optimized.diagnostics).toEqual([
            expect.objectContaining({
                code: "VARIANT_TABLE_LIMIT_EXCEEDED",
                severity: "warning",
            }),
        ])
    })

    it("over limit fallback emits VARIANT_TABLE_LIMIT_EXCEEDED and no huge table", () => {
        const optimized = optimizeVariants({
            base,
            variants: {
                one: {
                    a: { color: "text-a" },
                    b: { color: "text-b" },
                    c: { color: "text-c" },
                },
                two: {
                    d: { color: "text-d" },
                    e: { color: "text-e" },
                    f: { color: "text-f" },
                },
            },
            variantTableLimit: 8,
        })

        expect(optimized.exact).toBe(false)
        expect(optimized.components).toEqual([])
        expect(optimized.diagnostics).toEqual([
            expect.objectContaining({
                code: "VARIANT_TABLE_LIMIT_EXCEEDED",
                severity: "warning",
            }),
        ])
        expect(optimized.classCandidates).toEqual(
            expect.arrayContaining([
                "text-a",
                "text-b",
                "text-c",
                "text-d",
                "text-e",
                "text-f",
            ])
        )
    })

    it("over limit fallback preserves all manifest candidates", () => {
        const optimized = optimizeVariants({
            base,
            variants: {
                one: {
                    a: { color: "text-a" },
                    b: { color: "text-b" },
                    c: { color: "text-c" },
                },
                two: {
                    d: { color: "text-d" },
                    e: { color: "text-e" },
                    f: { color: "text-f" },
                },
            },
            variantTableLimit: 8,
        })

        expect(optimized.exact).toBe(false)
        expect(optimized.components).toEqual([])
        expect(optimized.diagnostics).toEqual([
            expect.objectContaining({
                code: "VARIANT_TABLE_LIMIT_EXCEEDED",
                severity: "warning",
            }),
        ])
        expect(optimized.classCandidates).toEqual(
            expect.arrayContaining([
                "inline-flex",
                "text-gray-900",
                "text-a",
                "text-f",
            ])
        )
    })

    it("keeps representative generated table size bounded", () => {
        const optimized = optimizeVariants({
            base,
            variants: {
                intent: {
                    primary: { color: "text-blue-700" },
                    danger: { color: "text-red-700" },
                },
                emphasis: {
                    weak: { color: "text-gray-500" },
                    strong: { color: "text-black" },
                },
                size: {
                    sm: { padding: "px-2" },
                    lg: { padding: "px-4" },
                },
            },
        })

        const serializedShape = JSON.stringify({
            additiveAxes: optimized.additiveAxes.map((axis) => axis.axis),
            components: optimized.components.map((component) => ({
                axes: component.axes,
                classKeys: Object.keys(component.classTable),
            })),
        })

        expect(serializedShape.length).toBeLessThan(600)
        expect(serializedShape).toMatchInlineSnapshot(
            `"{"additiveAxes":["size"],"components":[{"axes":["intent","emphasis"],"classKeys":["[[\\"intent\\",0],[\\"emphasis\\",0]]","[[\\"intent\\",0],[\\"emphasis\\",1,\\"weak\\"]]","[[\\"intent\\",0],[\\"emphasis\\",1,\\"strong\\"]]","[[\\"intent\\",1,\\"primary\\"],[\\"emphasis\\",0]]","[[\\"intent\\",1,\\"primary\\"],[\\"emphasis\\",1,\\"weak\\"]]","[[\\"intent\\",1,\\"primary\\"],[\\"emphasis\\",1,\\"strong\\"]]","[[\\"intent\\",1,\\"danger\\"],[\\"emphasis\\",0]]","[[\\"intent\\",1,\\"danger\\"],[\\"emphasis\\",1,\\"weak\\"]]","[[\\"intent\\",1,\\"danger\\"],[\\"emphasis\\",1,\\"strong\\"]]"]}]}"`
        )
    })
})
