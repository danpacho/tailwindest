import { expectType, TypeEqual } from "ts-expect"
import { describe, expect, it } from "vitest"
import { twMerge } from "tailwind-merge"
import { Merger } from "../merger_interface"
import { createTools } from "../create_tools"
import { CreateTailwindest } from "../../create_tailwindest"
import { ClassList } from "../to_class"

describe("Merger interface", () => {
    it("1. tailwind-merge", () => {
        const merger: Merger = twMerge
        const t = createTools<
            CreateTailwindest<{
                tailwind: Record<string, any>
                tailwindNestGroups: ""
                useArbitrary: true
            }>
        >({
            merger: merger,
        })

        const deduplicatedByTwMerge = t.def(["bg-red-100", "bg-red-200", "p-2"])
        expect(deduplicatedByTwMerge).toBe("bg-red-200 p-2")

        const argumentOrderHasPriority = t.def(
            ["bg-red-100", "bg-red-200", "p-2"],
            {
                backgroundColor: "bg-red-300",
            }
        )
        expect(argumentOrderHasPriority).toBe("p-2 bg-red-300")
    })
    it("2. custom-merger", () => {
        const customMerger: Merger<ClassList> = (...args) => {
            const res = args
                .map((e) => {
                    if (typeof e === "string") {
                        return e
                    }
                    if (Array.isArray(e)) {
                        return customMerger(...e)
                    }
                    throw new Error("Invalid merging value")
                })
                .filter(Boolean)
                .join(" with ")
            return res
        }

        const t = createTools<
            CreateTailwindest<{
                tailwind: Record<string, any>
                tailwindNestGroups: ""
                useArbitrary: true
            }>
        >({
            merger: customMerger,
        })

        const style1 = t.def([["bg-red-100", "bg-red-200"], "p-2"])
        expect(style1).toBe("bg-red-100 with bg-red-200 with p-2")

        const style2 = t.def(["bg-red-100", "bg-red-200", "p-2"], {
            backgroundColor: "bg-red-300",
        })
        expect(style2).toBe(
            "bg-red-100 with bg-red-200 with p-2 with bg-red-300"
        )
    })
})
