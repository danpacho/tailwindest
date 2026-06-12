import { describe, expect, it } from "vitest"
import { twMerge } from "tailwind-merge"
import { splitClassString } from "../../src/analyzer/split_utils"
import {
    collectInputClassSources,
    collectOutputLiteralClassSources,
    collectOutputTokenCounts,
    countInputTokens,
    createShadcnRegistryHarness,
    listShadcnInputFiles,
    readShadcnFixture,
} from "./shadcn_registry_helpers"

type HistoricalFamily = {
    name: string
    matches: (token: string) => boolean
}

const historicalFamilies: HistoricalFamily[] = [
    {
        name: "group/name",
        matches: (token) => token.includes("group/"),
    },
    {
        name: "peer/name",
        matches: (token) => token.includes("peer/"),
    },
    {
        name: "@container/name",
        matches: (token) => token.startsWith("@container/"),
    },
    {
        name: "[--var:value]",
        matches: (token) => /^\[--[^:\]]+:.+\]$/.test(token),
    },
    {
        name: "variant:[--var:value]",
        matches: (token) => /:\[--[^:\]]+:.+\]$/.test(token),
    },
    {
        name: "data-[side=...]:slide-in-*",
        matches: (token) => /^data-\[side=.*\]:slide-in-/.test(token),
    },
    {
        name: "**: chains",
        matches: (token) => token.includes("**:"),
    },
    {
        name: "xs:w-(--var)",
        matches: (token) => /^xs:w-\(--.+\)$/.test(token),
    },
]

describe("Shadcn Registry Class Preservation", async () => {
    const inputFiles = await listShadcnInputFiles()
    const harness = await createShadcnRegistryHarness()

    it("covers every input fixture", () => {
        expect(inputFiles.length).toBeGreaterThan(0)
    })

    it("keeps representative raw fallback outputs merge-equivalent", async () => {
        const checkedSources: string[] = []

        for (const file of inputFiles) {
            const content = await readShadcnFixture(file)
            const sourceFile = harness.createSourceFile(file, content)
            const inputSources = collectInputClassSources(sourceFile, file)
            const inputByNormalizedSource = new Map(
                inputSources.map((source) => [source.tokens.join(" "), source])
            )

            harness.transform(sourceFile)

            for (const outputSource of collectOutputLiteralClassSources(
                sourceFile
            )) {
                const normalizedOutput =
                    splitClassString(outputSource).join(" ")
                const inputSource =
                    inputByNormalizedSource.get(normalizedOutput)
                if (!inputSource) continue

                expect(twMerge(normalizedOutput)).toBe(
                    twMerge(inputSource.tokens.join(" "))
                )
                checkedSources.push(`${file}:${inputSource.location.line}`)

                if (checkedSources.length >= 10) break
            }

            if (checkedSources.length >= 10) break
        }

        expect(checkedSources.length).toBeGreaterThan(0)
    })

    for (const file of inputFiles) {
        it(`represents every supported static token in ${file}`, async () => {
            const content = await readShadcnFixture(file)
            const sourceFile = harness.createSourceFile(file, content)
            const inputSources = collectInputClassSources(sourceFile, file)
            const inputCounts = countInputTokens(inputSources)

            const context = harness.transform(sourceFile)
            const errors = context.diagnostics.filter(
                (diagnostic) => diagnostic.level === "error"
            )
            expect(errors).toHaveLength(0)

            const outputCounts = collectOutputTokenCounts(sourceFile)

            expect(
                findMissingTokens(file, inputCounts, outputCounts),
                "Output must represent every supported input token as a multiset."
            ).toEqual([])

            expect(
                findHistoricalFamilyFailures(file, inputCounts, outputCounts),
                "Historical preservation families must remain represented when present."
            ).toEqual([])
        })
    }
})

function findMissingTokens(
    file: string,
    inputCounts: Map<string, number>,
    outputCounts: Map<string, number>
): string[] {
    const missing: string[] = []

    for (const [token, inputCount] of inputCounts) {
        const outputCount = outputCounts.get(token) ?? 0
        if (outputCount >= inputCount) continue

        missing.push(
            [
                `file: ${file}`,
                `token: ${token}`,
                `inputCount: ${inputCount}`,
                `outputCount: ${outputCount}`,
            ].join(" ")
        )
    }

    return missing
}

function findHistoricalFamilyFailures(
    file: string,
    inputCounts: Map<string, number>,
    outputCounts: Map<string, number>
): string[] {
    const failures: string[] = []

    for (const family of historicalFamilies) {
        for (const [token, inputCount] of inputCounts) {
            if (!family.matches(token)) continue

            const outputCount = outputCounts.get(token) ?? 0
            if (outputCount >= inputCount) continue

            failures.push(
                [
                    `family: ${family.name}`,
                    `file: ${file}`,
                    `token: ${token}`,
                    `inputCount: ${inputCount}`,
                    `outputCount: ${outputCount}`,
                ].join(" ")
            )
        }
    }

    return failures
}
