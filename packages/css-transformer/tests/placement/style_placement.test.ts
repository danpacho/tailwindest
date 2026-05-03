import { describe, expect, it } from "vitest"
import { Project, ScriptTarget } from "ts-morph"
import { transform } from "../../src"
import type { CSSPropertyResolver } from "create-tailwind-type"

describe("Style Constant Placement", () => {
    const resolver: any = {
        resolveUnambiguous: (utility: string) => {
            // Simple mock: return the utility itself as the property name
            return utility.split("-")[0] || utility
        },
    }

    it("TC-1: should place style constant immediately above the component", async () => {
        const input = `
import { cn } from "@/lib/utils";
import { tw } from "~/tw";

export function MyComponent() {
    return <div className={cn("flex text-sm p-4 m-2 opacity-50 bg-white")} />;
}
`.trim()

        const { code } = await transform(input, {
            resolver,
            config: { objectThreshold: 5 },
        })

        const lines = code.split("\n")
        const styleStartLine = lines.findIndex((l) =>
            l.includes("const myComponentDiv =")
        )
        const componentLine = lines.findIndex((l) =>
            l.includes("export function MyComponent")
        )

        expect(styleStartLine).toBeGreaterThan(-1)
        expect(componentLine).toBeGreaterThan(-1)
        // Style should be before component
        expect(styleStartLine).toBeLessThan(componentLine)
    })

    it("TC-2: should place multiple style constants above the same component", async () => {
        const input = `
import { cn } from "@/lib/utils";
import { tw } from "~/tw";

export function MyComponent() {
    return (
        <div className={cn("flex text-sm p-4 m-2 opacity-50 bg-white")}>
            <span className={cn("text-red-500 font-bold leading-none text-center grayscale blur-sm")} />
        </div>
    );
}
`.trim()

        const { code } = await transform(input, {
            resolver,
            config: { objectThreshold: 5 },
        })

        const lines = code.split("\n")
        const divStyleIndex = lines.findIndex((l) =>
            l.includes("const myComponentDiv =")
        )
        const spanStyleIndex = lines.findIndex((l) =>
            l.includes("const myComponentSpan =")
        )
        const componentIndex = lines.findIndex((l) =>
            l.includes("export function MyComponent")
        )

        expect(divStyleIndex).toBeLessThan(componentIndex)
        expect(spanStyleIndex).toBeLessThan(componentIndex)
    })

    it("TC-3: should handle hoisting safety by placing shared style before the first usage", async () => {
        const input = `
import { cn } from "@/lib/utils";
import { tw } from "~/tw";

export function ComponentA() {
    return <div className={cn("flex text-sm p-4 m-2 opacity-50 bg-white")} />;
}

export function ComponentB() {
    return <div className={cn("flex text-sm p-4 m-2 opacity-50 bg-white")} />;
}
`.trim()

        const { code } = await transform(input, {
            resolver,
            config: { objectThreshold: 5 },
        })

        const lines = code.split("\n")
        const styleIndex = lines.findIndex((l) =>
            l.includes("const componentADiv =")
        )
        const compAIndex = lines.findIndex((l) =>
            l.includes("export function ComponentA")
        )
        const compBIndex = lines.findIndex((l) =>
            l.includes("export function ComponentB")
        )

        // Style should be before ComponentA (the first usage)
        expect(styleIndex).toBeLessThan(compAIndex)
        // Should not be between A and B
        expect(styleIndex).toBeLessThan(compBIndex)

        expect(code).toContain(".class()")
    })

    it("TC-5: should place style before global top-level calls", async () => {
        const input = `
import { cn } from "@/lib/utils";
import { tw } from "~/tw";

const globalStyle = cn("flex text-sm p-4 m-2 opacity-50 bg-white");

export function MyComponent() {
    return <div className={globalStyle} />;
}
`.trim()

        const { code } = await transform(input, {
            resolver,
            config: { objectThreshold: 5 },
        })

        const lines = code.split("\n")
        const extractedIndex = lines.findIndex((l) =>
            l.includes("const globalDiv =")
        )
        const usageIndex = lines.findIndex((l) =>
            l.includes("const globalStyle =")
        )

        expect(extractedIndex).toBeLessThan(usageIndex)
    })

    it("TC-6: should handle placement between imports and first component", async () => {
        const input = `
import { cn } from "@/lib/utils";
import { tw } from "~/tw";
export function MyComponent() {
    return <div className={cn("flex text-sm p-4 m-2 opacity-50 bg-white")} />;
}
`.trim()

        const { code } = await transform(input, {
            resolver,
            config: { objectThreshold: 5 },
        })

        expect(code).toContain("import { tw }")
        const lines = code.split("\n")
        const importIndex = lines.findIndex((l) => l.includes("import"))
        const styleIndex = lines.findIndex((l) =>
            l.includes("const myComponentDiv")
        )

        expect(styleIndex).toBeGreaterThan(importIndex)
    })
})
