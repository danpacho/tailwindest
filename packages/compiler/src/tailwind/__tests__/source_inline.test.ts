import { describe, expect, it } from "vitest"
import { createCandidateManifest, updateFileCandidates } from "../manifest"
import { injectSourceInlineBlock } from "../source_inline"

const manifestWith = (candidates: string[]) => {
    const manifest = createCandidateManifest()
    updateFileCandidates(manifest, "/src/app.tsx", {
        hash: "app",
        candidates,
        diagnostics: [],
    })
    return manifest
}

describe("@source inline() injection", () => {
    it("injects exactly once after a real Tailwind import and replaces prior blocks", () => {
        const code = [
            `@import "tailwindcss";`,
            ``,
            `.button {`,
            `    color: red;`,
            `}`,
        ].join("\n")

        const first = injectSourceInlineBlock({
            id: "/src/app.css",
            code,
            manifest: manifestWith(["px-4", "hover:bg-blue-500"]),
        })
        const second = injectSourceInlineBlock({
            id: "/src/app.css?direct",
            code: first.code,
            manifest: manifestWith(["px-6"]),
        })

        expect(first.changed).toBe(true)
        expect(second.code).toBe(
            [
                `@import "tailwindcss";`,
                `/* tailwindest:start */`,
                `@source inline("px-6");`,
                `/* tailwindest:end */`,
                ``,
                `.button {`,
                `    color: red;`,
                `}`,
            ].join("\n")
        )
        expect(second.code.match(/tailwindest:start/g)).toHaveLength(1)
    })

    it("preserves user CSS outside the marker block byte-for-byte", () => {
        const before = `/* keep before */\n@layer components {\n.btn { @apply px-2; }\n}\n`
        const after = `\n/* keep after */\n.card{display:block}\n`
        const code = `@import 'tailwindcss';\n${before}/* tailwindest:start */\n@source inline("old");\n/* tailwindest:end */${after}`

        const result = injectSourceInlineBlock({
            id: "/src/app.css",
            code,
            manifest: manifestWith(["new-class"]),
        })

        expect(result.code).toBe(
            `@import 'tailwindcss';\n/* tailwindest:start */\n@source inline("new-class");\n/* tailwindest:end */\n${before}${after}`
        )
    })

    it("escapes CSS string delimiters without changing arbitrary values, slash opacity, or stacked variants", () => {
        const result = injectSourceInlineBlock({
            id: "/src/app.css",
            code: `@import "tailwindcss";`,
            manifest: manifestWith([
                String.raw`content-["hello"]`,
                "bg-[rgb(10_20_30)]",
                "text-red-500/50",
                "dark:md:hover:bg-blue-500",
            ]),
        })

        expect(result.code).toContain(String.raw`content-[\"hello\"]`)
        expect(result.code).toContain("bg-[rgb(10_20_30)]")
        expect(result.code).toContain("text-red-500/50")
        expect(result.code).toContain("dark:md:hover:bg-blue-500")
    })

    it("does not inject into unrelated CSS unless cssEntries explicitly matches the id", () => {
        const manifest = manifestWith(["px-4"])
        const plain = `.plain { color: red; }`

        expect(
            injectSourceInlineBlock({
                id: "/src/plain.css",
                code: plain,
                manifest,
            }).code
        ).toBe(plain)
        expect(
            injectSourceInlineBlock({
                id: "/src/plain.css?used",
                code: plain,
                manifest,
                cssEntries: [/plain\.css$/],
            }).code
        ).toBe(
            `/* tailwindest:start */\n@source inline("px-4");\n/* tailwindest:end */\n${plain}`
        )
    })
})
