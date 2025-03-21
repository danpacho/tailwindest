import { describe, it } from "vitest"
import { getTailwindLCP } from "./lcp_class.mjs"
import { expect } from "vitest"
describe("LCP for tw classes", () => {
    it("Should extract LCP for tailwindcss", () => {
        const gridRows = [
            "grid-rows-${string}",
            "grid-rows-none",
            "grid-rows-subgrid",
            "grid-rows-[${string}]",
            "grid-rows-(${string})",
        ]
        const grid = getTailwindLCP(gridRows)
        expect(grid).toEqual(["grid-rows"])
        const colStuff = [
            "col-span-${string}",
            "col-span-full",
            "col-span-(${string})",
            "col-span-[${string}]",
            "col-start-${string}",
            "-col-start-${string}",
            "col-start-auto",
            "col-start-(${string})",
            "col-start-[${string}]",
            "col-end-${string}",
            "-col-end-${string}",
            "col-end-auto",
            "col-end-(${string})",
            "col-end-[${string}]",
            "col-auto",
            "col-(${string})",
            "col-[${string}]",
        ]
        const col = getTailwindLCP(colStuff)
        expect(col).toEqual(["col"])

        const displayClasses = [
            "inline",
            "block",
            "inline-block",
            "flow-root",
            "flex",
            "inline-flex",
            "grid",
            "inline-grid",
            "contents",
            "table",
            "inline-table",
            "table-caption",
            "table-cell",
            "table-row",
            "list-item",
            "hidden",
            "sr-only",
            "not-sr-only",
        ]
        const display = getTailwindLCP(displayClasses)
        expect(display).toEqual([
            "inline",
            "block",
            "flow-root",
            "flex",
            "grid",
            "contents",
            "table",
            "list-item",
            "hidden",
            "sr-only",
            "not-sr-only",
        ])
    })
})
