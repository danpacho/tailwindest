import { describe, expect, it } from "vitest"
import { createTools } from "../../../../tailwindest/src/tools/create_tools"
import { evaluateMergerPolicy } from "../merger"
import type { MergerPolicy } from "../merger"
import { createEvaluationEngine } from "../evaluator"

const engine = createEvaluationEngine()

describe("merger policy safety", () => {
    it("kind none uses the runtime default merge behavior", () => {
        const values = [" px-2  py-1 ", "px-4", ["mt-2 mb-2"]]
        const result = evaluateMergerPolicy(values, { kind: "none" })

        expect(result.value).toBe("px-2 py-1 px-4 mt-2 mb-2")
        expect(result.candidates).toEqual([
            "px-2",
            "py-1",
            "px-4",
            "mt-2",
            "mb-2",
        ])
        expect(result.exact).toBe(true)
        expect(result.diagnostics).toEqual([])
    })

    it("known merger requires a stable config hash", () => {
        const policy = {
            kind: "known",
            name: "tailwind-merge",
            configHash: "",
        } as MergerPolicy
        const result = engine.join(["px-2", "px-4"], policy)

        expect(result.exact).toBe(false)
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "MERGER_CONFIG_MISSING",
            }),
        ])
    })

    it("known merger with a stable hash is still non-exact until an equivalent build-time merger is wired", () => {
        const result = engine.join(["px-2", "px-4"], {
            kind: "known",
            name: "tailwind-merge",
            configHash: "sha256:test",
        })

        expect(result.value).toBe("px-2 px-4")
        expect(result.exact).toBe(false)
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "NON_DETERMINISTIC_MERGER",
            }),
        ])
    })

    it("unsupported merger emits UNSUPPORTED_MERGER and strict mode refuses exact compilation", () => {
        const result = engine.join(
            ["bg-red-100", "hover:bg-blue-100"],
            { kind: "unsupported", reason: "runtime closure" },
            { mode: "strict" }
        )

        expect(result.value).toBe("bg-red-100 hover:bg-blue-100")
        expect(result.exact).toBe(false)
        expect(result.fallback).toBeUndefined()
        expect(result.candidates).toEqual(["bg-red-100", "hover:bg-blue-100"])
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "UNSUPPORTED_MERGER",
                severity: "error",
            }),
        ])
    })

    it("loose mode returns fallback intent and candidates for unsupported statically knowable values", () => {
        const result = engine.def(
            ["bg-[#123456]", "dark:hover:sm:bg-red-500"],
            [
                {
                    width: "w-[calc(100%-1rem)]",
                    custom: "bg-(--my-color)",
                },
            ],
            { kind: "unsupported", reason: "user provided merger" },
            { mode: "loose" }
        )

        expect(result.value).toBe(
            "bg-[#123456] dark:hover:sm:bg-red-500 w-[calc(100%-1rem)] bg-(--my-color)"
        )
        expect(result.exact).toBe(false)
        expect(result.fallback).toEqual({
            reason: "user provided merger",
        })
        expect(result.candidates).toEqual([
            "bg-[#123456]",
            "dark:hover:sm:bg-red-500",
            "w-[calc(100%-1rem)]",
            "bg-(--my-color)",
        ])
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "UNSUPPORTED_MERGER",
                severity: "warning",
            }),
        ])
    })

    it("custom build-time merger policy without an evaluator emits a non-deterministic diagnostic", () => {
        const result = engine.mergeProps(
            [{ color: "text-gray-950" }, { color: "text-blue-100" }],
            {
                kind: "custom",
                evaluateAtBuildTime: true,
                moduleId: "./merger",
                exportName: "merge",
            }
        )

        expect(result.value).toBe("text-blue-100")
        expect(result.exact).toBe(false)
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "NON_DETERMINISTIC_MERGER",
            }),
        ])
    })

    it("mergeProps with no merger matches runtime for duplicate nested style paths and empty objects", () => {
        const runtimeTools = createTools()
        const styles = [
            {},
            {
                nested: {
                    color: "text-red-100",
                    padding: ["px-2"],
                },
            },
            {
                nested: {
                    color: "text-blue-100",
                    padding: ["px-4"],
                },
            },
        ]

        const result = engine.mergeProps(styles, { kind: "none" })

        expect(result.value).toBe(runtimeTools.mergeProps(...styles))
        expect(result.value).toBe("text-blue-100 px-4")
        expect(result.candidates).toEqual(["text-blue-100", "px-4"])
    })
})
