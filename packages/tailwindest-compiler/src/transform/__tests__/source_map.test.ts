import { describe, expect, it } from "vitest"
import { substituteTailwindest } from "../substitutor"
import { createReplacementSourceMap } from "../source_map"
import type { ReplacementPlan } from "../replacement"

const fileName = "/src/app.ts"

const planFor = (
    code: string,
    source: string,
    text: string
): ReplacementPlan => {
    const start = code.indexOf(source)
    if (start < 0) {
        throw new Error(`Missing source: ${source}`)
    }

    return {
        span: { fileName, start, end: start + source.length },
        text,
        priority: 0,
        kind: "style",
        candidates: ["flex"],
        diagnostics: [],
    }
}

const decodeVlq = (segment: string): number[] => {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    const values: number[] = []
    let value = 0
    let shift = 0

    for (const char of segment) {
        const integer = chars.indexOf(char)
        const digit = integer & 31
        value += digit << shift

        if ((integer & 32) !== 0) {
            shift += 5
            continue
        }

        const negative = (value & 1) === 1
        values.push((value >> 1) * (negative ? -1 : 1))
        value = 0
        shift = 0
    }

    return values
}

describe("source maps", () => {
    it("returns a Vite-compatible source map with sourcesContent", () => {
        const code = `const cls = tw.style({ display: "flex" }).class()`
        const result = substituteTailwindest({
            fileName,
            code,
            plans: [
                planFor(
                    code,
                    `tw.style({ display: "flex" }).class()`,
                    `"flex"`
                ),
            ],
            sourceMapBehavior: "revert-on-error",
        })

        expect(result.map).toMatchObject({
            version: 3,
            file: fileName,
            sources: [fileName],
            sourcesContent: [code],
            names: [],
        })
        expect(typeof result.map?.mappings).toBe("string")
    })

    it("maps the replacement call site back to the original call span", () => {
        const code = `const cls = tw.style({ display: "flex" }).class()`
        const callStart = code.indexOf("tw.style")

        const map = createReplacementSourceMap({
            fileName,
            originalCode: code,
            generatedCode: `const cls = "flex"`,
            replacements: [
                planFor(
                    code,
                    `tw.style({ display: "flex" }).class()`,
                    `"flex"`
                ),
            ],
        })

        const firstMappedLine = map.mappings
            .split(";")
            .find((line) => line.length > 0)
        expect(firstMappedLine).toBeDefined()
        const firstSegment = decodeVlq(firstMappedLine!.split(",")[0]!)

        expect(firstSegment).toEqual([12, 0, 0, callStart])
    })

    it("returns original code and diagnostic when source map failure policy reverts on error", () => {
        const code = `const cls = tw.style({ display: "flex" }).class()`
        const result = substituteTailwindest({
            fileName,
            code,
            plans: [
                planFor(
                    code,
                    `tw.style({ display: "flex" }).class()`,
                    `"flex"`
                ),
            ],
            sourceMapBehavior: "revert-on-error",
            createSourceMap: () => {
                throw new Error("map failure")
            },
        })

        expect(result.code).toBe(code)
        expect(result.map).toBeNull()
        expect(result.changed).toBe(false)
        expect(
            result.diagnostics.map((diagnostic) => diagnostic.code)
        ).toContain("SOURCE_MAP_FAILED")
    })

    it("keeps changed code with a diagnostic when source map failure policy reports diagnostics", () => {
        const code = `const cls = tw.style({ display: "flex" }).class()`
        const result = substituteTailwindest({
            fileName,
            code,
            plans: [
                planFor(
                    code,
                    `tw.style({ display: "flex" }).class()`,
                    `"flex"`
                ),
            ],
            sourceMapBehavior: "diagnostic-on-error",
            createSourceMap: () => {
                throw new Error("map failure")
            },
        })

        expect(result.code).toBe(`const cls = "flex"`)
        expect(result.map).toBeNull()
        expect(result.changed).toBe(true)
        expect(
            result.diagnostics.map((diagnostic) => diagnostic.code)
        ).toContain("SOURCE_MAP_FAILED")
    })
})
