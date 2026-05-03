import { describe, expect, it } from "vitest"
import { extractTailwindNestGroups } from "../index"

describe("extractTailwindNestGroups", () => {
    it("matches TailwindTypeGenerator variant extraction semantics", () => {
        expect(
            extractTailwindNestGroups([
                {
                    name: "dark",
                    isArbitrary: false,
                    values: [],
                    hasDash: false,
                },
                {
                    name: "group",
                    isArbitrary: false,
                    values: ["group", "peer", "hover", "focus"],
                    hasDash: true,
                },
                {
                    name: "supports",
                    isArbitrary: false,
                    values: ["grid"],
                    hasDash: false,
                },
                {
                    name: "not",
                    isArbitrary: false,
                    values: ["not", "checked"],
                    hasDash: true,
                },
                {
                    name: "surface",
                    isArbitrary: false,
                    values: [],
                    hasDash: false,
                },
            ])
        ).toEqual([
            "dark",
            "group-hover",
            "group-focus",
            "supportsgrid",
            "not-checked",
            "surface",
        ])
    })
})
