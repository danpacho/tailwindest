import { describe, expect, it } from "vitest"
import { readFileSync, existsSync, readdirSync, statSync } from "fs"
import { join } from "path"
import { transform } from "../../src"
import type { CSSPropertyResolver } from "create-tailwind-type"

// Simple mock resolver for E2E tests
class E2EMockResolver implements Partial<CSSPropertyResolver> {
    resolveUnambiguous(className: string): string | null {
        const rules: Record<string, string> = {
            flex: "display",
            "items-center": "alignItems",
            "justify-center": "justifyContent",
            "bg-blue-500": "backgroundColor",
            "bg-gray-500": "backgroundColor",
            "bg-red-500": "backgroundColor",
            "text-sm": "fontSize",
            "text-lg": "fontSize",
            "text-white": "color",
            "p-4": "padding",
            "p-2": "padding",
            "m-2": "margin",
        }
        return rules[className] || null
    }
}

describe("Golden File E2E Tests", () => {
    const fixturesDir = join(__dirname, "../fixtures")
    const fixtureDirs = readdirSync(fixturesDir)
        .filter((f) => statSync(join(fixturesDir, f)).isDirectory())
        .filter((f) => f !== "shadcn_registry")

    const resolver = new E2EMockResolver() as CSSPropertyResolver

    it("should have at least 5 fixtures", () => {
        expect(fixtureDirs.length).toBeGreaterThanOrEqual(5)
    })

    for (const dir of fixtureDirs) {
        it(`should pass fixture: ${dir}`, async () => {
            const inputPath = join(fixturesDir, dir, "input.tsx")
            const expectedPath = join(fixturesDir, dir, "expected.tsx")

            if (!existsSync(inputPath)) {
                throw new Error(`input.tsx missing in ${dir}`)
            }
            if (!existsSync(expectedPath)) {
                throw new Error(`expected.tsx missing in ${dir}`)
            }

            const inputCode = readFileSync(inputPath, "utf-8")
            const expectedCode = readFileSync(expectedPath, "utf-8")

            const { code } = await transform(inputCode, { resolver })

            expect(code.trim()).toBe(expectedCode.trim())
        })
    }
})
