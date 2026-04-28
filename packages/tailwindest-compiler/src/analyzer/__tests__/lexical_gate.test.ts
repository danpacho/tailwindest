import { describe, expect, it } from "vitest"
import { hasTailwindestSentinel } from "../lexical_gate"

describe("lexical gate", () => {
    it("returns true for every supported Tailwindest sentinel", () => {
        const sentinels = [
            "createTools",
            ".style(",
            ".toggle(",
            ".rotary(",
            ".variants(",
            ".join(",
            ".def(",
            ".mergeProps(",
            ".mergeRecord(",
        ]

        for (const sentinel of sentinels) {
            expect(
                hasTailwindestSentinel(`const value = tools${sentinel}{})`)
            ).toBe(true)
        }
    })

    it("returns false for unrelated files", () => {
        expect(
            hasTailwindestSentinel(`
                export const button = {
                    className: "px-2 py-1",
                    render: () => "not a tailwindest file",
                }
            `)
        ).toBe(false)
    })
})
