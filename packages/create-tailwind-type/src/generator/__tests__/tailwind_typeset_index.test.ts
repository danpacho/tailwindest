import { readFile } from "node:fs/promises"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { createTailwindTypesetIndex } from "../tailwind_typeset_index"

describe("TailwindTypesetIndex", () => {
    it("matches utilities against actual Tailwind record value types", async () => {
        const tailwindSource = await readFile(
            path.resolve(__dirname, "../../../../tailwindest/tailwind.2.ts"),
            "utf-8"
        )
        const index = createTailwindTypesetIndex({ tailwindSource })

        expect(index.hasKey("padding")).toBe(true)
        expect(index.hasKey("paddingRight")).toBe(false)
        expect(index.hasNestGroup("sm")).toBe(true)
        expect(index.hasNestGroup("xs")).toBe(false)

        expect(index.matchUtility("pr-8", ["padding"])).toEqual(["padding"])
        expect(index.matchUtility("pl-8", ["padding"])).toEqual(["padding"])
        expect(index.matchUtility("px-2", ["padding"])).toEqual(["padding"])
        expect(index.matchUtility("pt-0", ["padding"])).toEqual(["padding"])
        expect(index.matchUtility("text-xs/relaxed")).toContain("fontSize")
        expect(index.matchUtility("text-primary-foreground")).toContain("color")
        expect(index.matchUtility("ring-sidebar-ring")).toContain("boxShadow")
        expect(index.matchUtility("w-(--popup-width)")).toContain("width")
    })
})
