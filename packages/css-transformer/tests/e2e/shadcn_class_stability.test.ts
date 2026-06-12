import { describe, expect, it } from "vitest"
import { twMerge } from "tailwind-merge"
import {
    collectInputClassSources,
    createShadcnRegistryHarness,
    listShadcnInputFiles,
    readShadcnFixture,
} from "./shadcn_registry_helpers"

describe("Shadcn Registry Class Stability", async () => {
    const inputFiles = await listShadcnInputFiles()
    const harness = await createShadcnRegistryHarness()

    it("covers every input fixture", () => {
        expect(inputFiles.length).toBeGreaterThan(0)
    })

    for (const file of inputFiles) {
        it(`keeps static class sources merge-stable in ${file}`, async () => {
            const content = await readShadcnFixture(file)
            const sourceFile = harness.createSourceFile(file, content)
            const sources = collectInputClassSources(sourceFile, file)

            for (const source of sources) {
                const normalized = source.tokens.join(" ")
                const merged = twMerge(normalized)

                expect(
                    merged,
                    [
                        `file: ${source.file}`,
                        `surface: ${source.surface}`,
                        `location: ${source.location.line}:${source.location.column}`,
                        `source: ${source.source}`,
                        `twMerge(source): ${merged}`,
                    ].join("\n")
                ).toBe(normalized)
            }
        })
    }
})
