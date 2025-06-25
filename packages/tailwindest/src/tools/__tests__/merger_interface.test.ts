import { describe, expect, it } from "vitest"
import { createTools } from "../create_tools"
import type { Merger } from "../merger_interface"
import type { CreateTailwindest } from "../../create_tailwindest"

import { twMerge } from "tailwind-merge"

describe("Merger interface", () => {
    it("1. tailwind-merge", () => {
        const merger: Merger = twMerge
        const t = createTools<{
            tailwindest: CreateTailwindest<{
                tailwind: Record<string, any>
                tailwindNestGroups: ""
                useArbitrary: true
            }>
        }>({
            merger: merger,
        })

        const deduplicatedByTwMerge = t.def(["bg-red-100", "bg-red-200", "p-2"])
        expect(deduplicatedByTwMerge).toBe("bg-red-200 p-2")

        const argumentOrderHasPriority = t.def(
            ["bg-red-100", "bg-red-200", "p-2"],
            {
                backgroundColor: "bg-red-300",
                border: ["border-t-4"],
            },
            {
                border: "border-2",
            }
        )
        expect(argumentOrderHasPriority).toBe("p-2 bg-red-300 border-2")
        const style = t.style({
            backgroundColor: "bg-red-100",
        })

        expect(style.class("bg-red-200", "p-2")).toBe("bg-red-200 p-2")
    })
    it("2. custom-merger", () => {
        const customMerger: Merger = (...args) => {
            const uniqueToken = Array.from(new Set(args))
            return uniqueToken.join(" with ")
        }

        const t = createTools<{
            tailwindest: CreateTailwindest<{
                tailwind: Record<string, any>
                tailwindNestGroups: ""
                useArbitrary: true
            }>
        }>({
            merger: customMerger,
        })

        const style1 = t.def([["bg-red-100", "bg-red-200"], "p-2"])
        expect(style1).toBe("bg-red-100 with bg-red-200 with p-2")

        const style2 = t.def(
            ["bg-red-100", "ONCE", "ONCE", "ONCE", "bg-red-200", "p-2"],
            {
                backgroundColor: "bg-red-300",
            }
        )
        expect(style2).toBe(
            "bg-red-100 with ONCE with bg-red-200 with p-2 with bg-red-300"
        )
    })
})
