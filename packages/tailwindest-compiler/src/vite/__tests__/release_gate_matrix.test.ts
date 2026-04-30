import * as ts from "typescript"
import { describe, expect, it } from "vitest"
import { createTools } from "../../../../tailwindest/src/tools/create_tools"
import { compile } from "../../index"
import { createCompilerContext } from "../context"

type CompilerContextInstance = ReturnType<typeof createCompilerContext>
type DebugManifest = ReturnType<CompilerContextInstance["getDebugManifest"]>
type DebugFile = DebugManifest["files"][number]

interface ParityCase {
    name: string
    fileName: string
    code: string
    exports: string[]
    expectedCandidates: string[]
    variantTableLimit?: number
    assert?: (
        before: Record<string, unknown>,
        after: Record<string, unknown>
    ) => void
}

function lines(items: string[]): string {
    return items.join("\n")
}

function evaluateModule<T extends Record<string, unknown>>(
    code: string,
    exportNames: string[]
): T {
    const executable = code
        .replace(
            /import\s+\{\s*createTools\s+as\s+(\w+)\s*\}\s+from\s+["']tailwindest["'];?\n?/g,
            "const $1 = createTools\n"
        )
        .replace(
            /import\s+\{\s*createTools\s*\}\s+from\s+["']tailwindest["'];?\n?/g,
            ""
        )
        .replace(/^\s*declare\s+const\s+.*$/gm, "")
        .replace(/\bexport\s+const\s+/g, "const ")
        .replaceAll(" as const", "")

    return new Function(
        "createTools",
        `${executable}\nreturn { ${exportNames.join(", ")} };`
    )(createTools) as T
}

function compileWithDebug(
    code: string,
    fileName: string,
    options: Parameters<typeof createCompilerContext>[0]["options"] = {}
): {
    result: ReturnType<CompilerContextInstance["transformJs"]>
    manifest: DebugManifest
    file: DebugFile
    context: CompilerContextInstance
} {
    const context = createCompilerContext({
        root: "/project",
        options: { debug: true, ...options },
    })
    const result = context.transformJs(code, fileName)
    const manifest = context.getDebugManifest()
    const file = manifest.files.find((item) => item.id === fileName)

    if (!file) {
        throw new Error(`Missing debug file for ${fileName}`)
    }

    return { result, manifest, file, context }
}

function expectParsesAs(fileName: string, code: string): void {
    const output = ts.transpileModule(code, {
        fileName,
        reportDiagnostics: true,
        compilerOptions: {
            jsx: ts.JsxEmit.ReactJSX,
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ESNext,
        },
    })
    const errors =
        output.diagnostics?.filter(
            (item) => item.category === ts.DiagnosticCategory.Error
        ) ?? []

    expect(
        errors.map((error) =>
            ts.flattenDiagnosticMessageText(error.messageText, "\n")
        )
    ).toEqual([])
}

function expectCandidateRecord(
    manifest: DebugManifest,
    candidate: string,
    kind: "exact" | "fallback-known"
): void {
    expect(manifest.candidateRecords).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                candidate,
                kind,
            }),
        ])
    )
}

function expectCompiledCandidatesAreExact(
    manifest: DebugManifest,
    file: DebugFile
): void {
    const compiledCandidates = new Set(
        file.replacements
            .filter((replacement) => replacement.status === "compiled")
            .flatMap((replacement) => replacement.candidates)
    )

    expect(compiledCandidates.size).toBeGreaterThan(0)
    for (const candidate of compiledCandidates) {
        const records = manifest.candidateRecords.filter(
            (record) => record.candidate === candidate
        )
        expect(records.length, candidate).toBeGreaterThan(0)
        expect(
            records.every((record) => record.kind === "exact"),
            candidate
        ).toBe(true)
    }
}

function expectNoCompiledReplacements(file: DebugFile): void {
    expect(file.replacements).not.toEqual(
        expect.arrayContaining([
            expect.objectContaining({ status: "compiled" }),
        ])
    )
}

function expectRuntimeParity(testCase: ParityCase): void {
    const { result, manifest, file } = compileWithDebug(
        testCase.code,
        testCase.fileName,
        testCase.variantTableLimit === undefined
            ? {}
            : { variantTableLimit: testCase.variantTableLimit }
    )
    const before = evaluateModule(testCase.code, testCase.exports)
    const after = evaluateModule(result.code, testCase.exports)

    expect(result.changed, testCase.name).toBe(true)
    if (testCase.assert) {
        testCase.assert(before, after)
    } else {
        expect(after, testCase.name).toEqual(before)
    }
    expect(file.replacements.length, testCase.name).toBeGreaterThan(0)
    expect(file.replacements, testCase.name).toEqual(
        file.replacements.map((replacement) =>
            expect.objectContaining({
                status: "compiled",
                fallback: false,
            })
        )
    )
    expectCompiledCandidatesAreExact(manifest, file)
    for (const candidate of testCase.expectedCandidates) {
        expectCandidateRecord(manifest, candidate, "exact")
    }
}

describe("Layer 8 release gate matrix", () => {
    describe("exact createTools runtime parity", () => {
        const parityCases: ParityCase[] = [
            {
                name: "tw.join with token definitions",
                fileName: "/project/src/release-join.ts",
                code: lines([
                    `import { createTools } from "tailwindest"`,
                    `const tw = createTools()`,
                    `const display = "inline-flex"`,
                    `const padding = "px-4"`,
                    `export const actual = tw.join(display, padding, ["rounded-md", { "hover:bg-sky-50": true }])`,
                ]),
                exports: ["actual"],
                expectedCandidates: [
                    "inline-flex",
                    "px-4",
                    "rounded-md",
                    "hover:bg-sky-50",
                ],
            },
            {
                name: "aliased createTools import with non-tw receiver",
                fileName: "/project/src/release-alias.ts",
                code: lines([
                    `import { createTools as makeTools } from "tailwindest"`,
                    `const tools = makeTools()`,
                    `export const actual = tools.join("gap-2", "md:flex")`,
                ]),
                exports: ["actual"],
                expectedCandidates: ["gap-2", "md:flex"],
            },
            {
                name: "tw.def with classList and style config definitions",
                fileName: "/project/src/release-def.ts",
                code: lines([
                    `import { createTools } from "tailwindest"`,
                    `const tw = createTools()`,
                    `const classList = ["inline-flex", ["rounded-md", { "shadow-sm": true }]]`,
                    `const baseStyle = { display: "grid", padding: ["px-2", "py-1"] }`,
                    `const toneStyle = { color: "text-red-700", margin: "m-1" }`,
                    `export const actual = tw.def(classList, baseStyle, toneStyle)`,
                ]),
                exports: ["actual"],
                expectedCandidates: [
                    "inline-flex",
                    "rounded-md",
                    "shadow-sm",
                    "grid",
                    "px-2",
                    "py-1",
                    "text-red-700",
                    "m-1",
                ],
            },
            {
                name: "tw.mergeProps and tw.mergeRecord with shared style configs",
                fileName: "/project/src/release-merge.ts",
                code: lines([
                    `import { createTools } from "tailwindest"`,
                    `const tw = createTools()`,
                    `const baseStyle = { display: "inline-flex", color: "text-gray-900", padding: "px-2" }`,
                    `const overrideStyle = { color: "text-blue-700", margin: "m-2" }`,
                    `export const props = tw.mergeProps(baseStyle, overrideStyle)`,
                    `export const record = tw.mergeRecord(baseStyle, overrideStyle)`,
                ]),
                exports: ["props", "record"],
                expectedCandidates: [
                    "inline-flex",
                    "text-blue-700",
                    "px-2",
                    "m-2",
                ],
            },
            {
                name: "direct tw.style class and style calls",
                fileName: "/project/src/release-style.ts",
                code: lines([
                    `import { createTools } from "tailwindest"`,
                    `const tw = createTools()`,
                    `const baseStyle = { display: "inline-flex", color: "text-gray-900", padding: "px-2" }`,
                    `const overrideStyle = { color: "text-blue-700", margin: "m-2" }`,
                    `export const cls = tw.style(baseStyle).class("rounded-md")`,
                    `export const styles = tw.style(baseStyle).style(overrideStyle)`,
                ]),
                exports: ["cls", "styles"],
                expectedCandidates: [
                    "inline-flex",
                    "text-gray-900",
                    "text-blue-700",
                    "px-2",
                    "rounded-md",
                    "m-2",
                ],
            },
            {
                name: "direct tw.toggle dynamic and static class plus style calls",
                fileName: "/project/src/release-toggle.ts",
                code: lines([
                    `import { createTools } from "tailwindest"`,
                    `const tw = createTools()`,
                    `const toggleConfig = {`,
                    `  base: { display: "inline-flex", padding: "px-2" },`,
                    `  truthy: { color: "text-green-700" },`,
                    `  falsy: { color: "text-red-700" },`,
                    `}`,
                    `const overrideStyle = { margin: "m-1" }`,
                    `export const dynamicClass = (enabled) => tw.toggle(toggleConfig).class(enabled, "rounded-md")`,
                    `export const staticClass = tw.toggle(toggleConfig).class(true, "shadow-sm")`,
                    `export const dynamicStyle = (enabled) => tw.toggle(toggleConfig).style(enabled, overrideStyle)`,
                ]),
                exports: ["dynamicClass", "staticClass", "dynamicStyle"],
                expectedCandidates: [
                    "inline-flex",
                    "px-2",
                    "text-green-700",
                    "text-red-700",
                    "rounded-md",
                    "shadow-sm",
                    "m-1",
                ],
                assert: (before, after) => {
                    const beforeDynamicClass = before.dynamicClass as (
                        enabled: boolean
                    ) => string
                    const afterDynamicClass = after.dynamicClass as (
                        enabled: boolean
                    ) => string
                    const beforeDynamicStyle = before.dynamicStyle as (
                        enabled: boolean
                    ) => Record<string, unknown>
                    const afterDynamicStyle = after.dynamicStyle as (
                        enabled: boolean
                    ) => Record<string, unknown>

                    expect(after.staticClass).toBe(before.staticClass)
                    for (const enabled of [true, false]) {
                        expect(afterDynamicClass(enabled)).toBe(
                            beforeDynamicClass(enabled)
                        )
                        expect(afterDynamicStyle(enabled)).toEqual(
                            beforeDynamicStyle(enabled)
                        )
                    }
                },
            },
            {
                name: "direct tw.rotary dynamic and static class plus style calls",
                fileName: "/project/src/release-rotary.ts",
                code: lines([
                    `import { createTools } from "tailwindest"`,
                    `const tw = createTools()`,
                    `const rotaryConfig = {`,
                    `  base: { display: "grid", gap: "gap-2" },`,
                    `  variants: { sm: { padding: "p-2" }, lg: { padding: "p-4" } },`,
                    `}`,
                    `const overrideStyle = { margin: "m-1" }`,
                    `export const dynamicClass = (size) => tw.rotary(rotaryConfig).class(size, "rounded-md")`,
                    `export const staticClass = tw.rotary(rotaryConfig).class("lg", "shadow-sm")`,
                    `export const dynamicStyle = (size) => tw.rotary(rotaryConfig).style(size, overrideStyle)`,
                ]),
                exports: ["dynamicClass", "staticClass", "dynamicStyle"],
                expectedCandidates: [
                    "grid",
                    "gap-2",
                    "p-2",
                    "p-4",
                    "rounded-md",
                    "shadow-sm",
                    "m-1",
                ],
                assert: (before, after) => {
                    const beforeDynamicClass = before.dynamicClass as (
                        size: string
                    ) => string
                    const afterDynamicClass = after.dynamicClass as (
                        size: string
                    ) => string
                    const beforeDynamicStyle = before.dynamicStyle as (
                        size: string
                    ) => Record<string, unknown>
                    const afterDynamicStyle = after.dynamicStyle as (
                        size: string
                    ) => Record<string, unknown>

                    expect(after.staticClass).toBe(before.staticClass)
                    for (const size of ["base", "sm", "lg"]) {
                        expect(afterDynamicClass(size)).toBe(
                            beforeDynamicClass(size)
                        )
                        expect(afterDynamicStyle(size)).toEqual(
                            beforeDynamicStyle(size)
                        )
                    }
                },
            },
            {
                name: "direct tw.variants mixed static and dynamic props class plus style calls",
                fileName: "/project/src/release-variants.ts",
                code: lines([
                    `import { createTools } from "tailwindest"`,
                    `const tw = createTools()`,
                    `const variantsConfig = {`,
                    `  base: { display: "inline-flex", color: "text-gray-900" },`,
                    `  variants: {`,
                    `    intent: { danger: { color: "text-red-700" }, primary: { color: "text-blue-700" } },`,
                    `    size: { sm: { padding: "px-2" } },`,
                    `    tone: { quiet: { color: "text-gray-500" } },`,
                    `  },`,
                    `}`,
                    `const overrideStyle = { margin: "m-1" }`,
                    `export const staticBeforeDynamic = (intent) => tw.variants(variantsConfig).class({ size: "sm", intent }, "rounded-md")`,
                    `export const dynamicBeforeStatic = (intent) => tw.variants(variantsConfig).class({ intent, tone: "quiet" })`,
                    `export const styleResult = (intent) => tw.variants(variantsConfig).style({ intent, tone: "quiet" }, overrideStyle)`,
                ]),
                exports: [
                    "staticBeforeDynamic",
                    "dynamicBeforeStatic",
                    "styleResult",
                ],
                expectedCandidates: [
                    "inline-flex",
                    "text-gray-900",
                    "text-red-700",
                    "text-blue-700",
                    "px-2",
                    "text-gray-500",
                    "rounded-md",
                    "m-1",
                ],
                variantTableLimit: 16,
                assert: (before, after) => {
                    const beforeStatic = before.staticBeforeDynamic as (
                        intent: string | undefined
                    ) => string
                    const afterStatic = after.staticBeforeDynamic as (
                        intent: string | undefined
                    ) => string
                    const beforeDynamic = before.dynamicBeforeStatic as (
                        intent: string | undefined
                    ) => string
                    const afterDynamic = after.dynamicBeforeStatic as (
                        intent: string | undefined
                    ) => string
                    const beforeStyle = before.styleResult as (
                        intent: string | undefined
                    ) => Record<string, unknown>
                    const afterStyle = after.styleResult as (
                        intent: string | undefined
                    ) => Record<string, unknown>

                    for (const intent of [undefined, "danger", "primary"]) {
                        expect(afterStatic(intent)).toBe(beforeStatic(intent))
                        expect(afterDynamic(intent)).toBe(beforeDynamic(intent))
                        expect(afterStyle(intent)).toEqual(beforeStyle(intent))
                    }
                },
            },
            {
                name: "stored tw.style styler class and style calls",
                fileName: "/project/src/release-stored-style.ts",
                code: lines([
                    `import { createTools } from "tailwindest"`,
                    `const tw = createTools()`,
                    `const baseStyle = { display: "inline-flex", color: "text-blue-700" }`,
                    `const overrideStyle = { color: "text-red-700", padding: "px-2" }`,
                    `const button = tw.style(baseStyle)`,
                    `export const cls = button.class("rounded-md")`,
                    `export const styles = button.style(overrideStyle)`,
                ]),
                exports: ["cls", "styles"],
                expectedCandidates: [
                    "inline-flex",
                    "text-blue-700",
                    "text-red-700",
                    "px-2",
                    "rounded-md",
                ],
            },
            {
                name: "stored toggle rotary and variants stylers",
                fileName: "/project/src/release-stored-stylers.ts",
                code: lines([
                    `import { createTools } from "tailwindest"`,
                    `const tw = createTools()`,
                    `const toggle = tw.toggle({ base: { display: "inline-flex" }, truthy: { color: "text-green-700" }, falsy: { color: "text-red-700" } })`,
                    `const rotary = tw.rotary({ base: { display: "grid" }, variants: { sm: { padding: "p-2" }, lg: { padding: "p-4" } } })`,
                    `const variants = tw.variants({ base: { display: "inline-flex" }, variants: { intent: { primary: { color: "text-blue-700" }, danger: { color: "text-red-700" } } } })`,
                    `const overrideStyle = { margin: "m-1" }`,
                    `export const toggleClass = (enabled) => toggle.class(enabled, "rounded-md")`,
                    `export const rotaryClass = (size) => rotary.class(size, "shadow-sm")`,
                    `export const variantsClass = (intent) => variants.class({ intent }, "px-1")`,
                    `export const variantsStyle = (intent) => variants.style({ intent }, overrideStyle)`,
                ]),
                exports: [
                    "toggleClass",
                    "rotaryClass",
                    "variantsClass",
                    "variantsStyle",
                ],
                expectedCandidates: [
                    "inline-flex",
                    "text-green-700",
                    "text-red-700",
                    "grid",
                    "p-2",
                    "p-4",
                    "text-blue-700",
                    "m-1",
                    "rounded-md",
                    "shadow-sm",
                    "px-1",
                ],
                variantTableLimit: 8,
                assert: (before, after) => {
                    const beforeToggle = before.toggleClass as (
                        enabled: boolean
                    ) => string
                    const afterToggle = after.toggleClass as (
                        enabled: boolean
                    ) => string
                    const beforeRotary = before.rotaryClass as (
                        size: string
                    ) => string
                    const afterRotary = after.rotaryClass as (
                        size: string
                    ) => string
                    const beforeVariants = before.variantsClass as (
                        intent: string | undefined
                    ) => string
                    const afterVariants = after.variantsClass as (
                        intent: string | undefined
                    ) => string
                    const beforeVariantsStyle = before.variantsStyle as (
                        intent: string | undefined
                    ) => Record<string, unknown>
                    const afterVariantsStyle = after.variantsStyle as (
                        intent: string | undefined
                    ) => Record<string, unknown>

                    for (const enabled of [true, false]) {
                        expect(afterToggle(enabled)).toBe(beforeToggle(enabled))
                    }
                    for (const size of ["base", "sm", "lg"]) {
                        expect(afterRotary(size)).toBe(beforeRotary(size))
                    }
                    for (const intent of [undefined, "primary", "danger"]) {
                        expect(afterVariants(intent)).toBe(
                            beforeVariants(intent)
                        )
                        expect(afterVariantsStyle(intent)).toEqual(
                            beforeVariantsStyle(intent)
                        )
                    }
                },
            },
        ]

        it.each(parityCases)("$name", (testCase) => {
            expectRuntimeParity(testCase)
        })
    })

    describe("safe fallback contract", () => {
        it("preserves fake tw.join and fake tw.style chains without replacements", () => {
            const cases = [
                lines([
                    `const tw = { join: (value) => \`FAKE:\${value}\` }`,
                    `export const cls = tw.join("px-4")`,
                ]),
                lines([
                    `const tw = {`,
                    `  style: (value) => ({ class: () => \`FAKE:\${JSON.stringify(value)}\` }),`,
                    `}`,
                    `export const cls = tw.style({ color: "text-red-500" }).class()`,
                ]),
            ]

            for (const [index, code] of cases.entries()) {
                const { result, file } = compileWithDebug(
                    code,
                    `/project/src/fake-${index}.ts`
                )

                expect(result.code).toBe(code)
                expect(result.changed).toBe(false)
                expect(file.replacements).toEqual([])
            }
        })

        it("preserves unproven aliases and shadowed receivers", () => {
            const cases = [
                {
                    name: "uncertain alias",
                    code: lines([
                        `import { createTools } from "tailwindest"`,
                        `const tw = createTools()`,
                        `const maybeTw = Math.random() > 0 ? tw : { join: (value) => value }`,
                        `export const cls = maybeTw.join("px-4")`,
                    ]),
                },
                {
                    name: "local shadowing",
                    code: lines([
                        `import { createTools } from "tailwindest"`,
                        `const tw = createTools()`,
                        `export const cls = (() => {`,
                        `  const tw = { join: (value) => \`FAKE:\${value}\` }`,
                        `  return tw.join("px-4")`,
                        `})()`,
                    ]),
                },
            ]

            for (const testCase of cases) {
                const { result, file } = compileWithDebug(
                    testCase.code,
                    `/project/src/${testCase.name}.ts`
                )

                expect(result.code, testCase.name).toBe(testCase.code)
                expect(result.changed, testCase.name).toBe(false)
                expect(file.replacements, testCase.name).toEqual([])
                expect(file.diagnostics, testCase.name).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            code: "NOT_TAILWINDEST_SYMBOL",
                            fallbackBehavior: "runtime-fallback",
                        }),
                    ])
                )
            }
        })

        it("preserves unknown dynamic class and style values with runtime fallback diagnostics", () => {
            const cases = [
                {
                    name: "dynamic class",
                    code: lines([
                        `import { createTools } from "tailwindest"`,
                        `const tw = createTools()`,
                        `declare const dynamicClass: string`,
                        `export const cls = tw.join("px-4", dynamicClass)`,
                    ]),
                    replacementKind: "join",
                    candidate: "px-4",
                },
                {
                    name: "dynamic style",
                    code: lines([
                        `import { createTools } from "tailwindest"`,
                        `const tw = createTools()`,
                        `declare const dynamicStyle: Record<string, string>`,
                        `export const cls = tw.style(dynamicStyle).class("px-4")`,
                    ]),
                    replacementKind: "style",
                    candidate: "px-4",
                },
            ]

            for (const testCase of cases) {
                const { result, manifest, file } = compileWithDebug(
                    testCase.code,
                    `/project/src/${testCase.name}.ts`
                )

                expect(result.code, testCase.name).toBe(testCase.code)
                expect(result.changed, testCase.name).toBe(false)
                expect(file.replacements, testCase.name).toEqual([
                    expect.objectContaining({
                        kind: testCase.replacementKind,
                        status: "runtime-fallback",
                        fallback: true,
                        generatedText: "",
                    }),
                ])
                expect(file.diagnostics, testCase.name).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            code: "UNSUPPORTED_DYNAMIC_VALUE",
                            fallbackBehavior: "runtime-fallback",
                        }),
                    ])
                )
                expectCandidateRecord(
                    manifest,
                    testCase.candidate,
                    "fallback-known"
                )
            }
        })

        it("keeps unknown spreads as fallback-known candidates without compiling", () => {
            const cases = [
                {
                    name: "style spread",
                    code: lines([
                        `import { createTools } from "tailwindest"`,
                        `const tw = createTools()`,
                        `declare const dynamicStyle: Record<string, string>`,
                        `export const cls = tw.style({ ...dynamicStyle, color: "text-blue-700" }).class("px-4")`,
                    ]),
                    candidates: ["text-blue-700", "px-4"],
                },
                {
                    name: "variant props spread",
                    code: lines([
                        `import { createTools } from "tailwindest"`,
                        `const tw = createTools()`,
                        `declare const props: Record<string, string>`,
                        `export const cls = tw.variants({`,
                        `  base: { display: "inline-flex" },`,
                        `  variants: { tone: { quiet: { color: "text-gray-500" } } },`,
                        `}).class({ ...props, tone: "quiet" })`,
                    ]),
                    candidates: ["inline-flex", "text-gray-500"],
                },
            ]

            for (const testCase of cases) {
                const { result, manifest, file } = compileWithDebug(
                    testCase.code,
                    `/project/src/${testCase.name}.ts`
                )

                expect(result.code, testCase.name).toBe(testCase.code)
                expect(result.changed, testCase.name).toBe(false)
                expectNoCompiledReplacements(file)
                for (const candidate of testCase.candidates) {
                    expectCandidateRecord(manifest, candidate, "fallback-known")
                }
            }
        })

        it("keeps compose chains candidate-only rather than compiling them", () => {
            const cases = [
                {
                    name: "direct compose",
                    code: lines([
                        `import { createTools } from "tailwindest"`,
                        `const tw = createTools()`,
                        `export const composed = tw.style({ color: "text-blue-700" }).compose({ padding: "p-2" })`,
                    ]),
                },
                {
                    name: "stored compose result",
                    code: lines([
                        `import { createTools } from "tailwindest"`,
                        `const tw = createTools()`,
                        `const composed = tw.style({ color: "text-blue-700" }).compose({ padding: "p-2" })`,
                        `export const cls = composed.class()`,
                    ]),
                },
            ]

            for (const testCase of cases) {
                const { result, manifest, file } = compileWithDebug(
                    testCase.code,
                    `/project/src/${testCase.name}.ts`
                )

                expect(result.code, testCase.name).toBe(testCase.code)
                expect(result.changed, testCase.name).toBe(false)
                expectNoCompiledReplacements(file)
                expect(file.replacements, testCase.name).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            status: "candidate-only",
                            fallback: false,
                        }),
                    ])
                )
                expectCandidateRecord(
                    manifest,
                    "text-blue-700",
                    "fallback-known"
                )
                expectCandidateRecord(manifest, "p-2", "fallback-known")
            }
        })

        it("preserves runtime createTools mergers instead of compiling class-producing APIs", () => {
            const code = lines([
                `import { createTools } from "tailwindest"`,
                `const merger = (...classes) => classes[classes.length - 1] ?? ""`,
                `const tw = createTools({ merger })`,
                `export const joined = tw.join("px-2", "px-4")`,
                `export const styled = tw.style({ padding: "px-2" }).class("px-4")`,
                `export const props = tw.mergeProps({ padding: "px-2" }, { margin: "m-1" })`,
            ])

            const { result, manifest, file } = compileWithDebug(
                code,
                "/project/src/runtime-merger.ts"
            )

            expect(result.code).toBe(code)
            expect(result.changed).toBe(false)
            expect(file.replacements).toEqual([
                expect.objectContaining({
                    kind: "join",
                    status: "runtime-fallback",
                    fallback: true,
                }),
                expect.objectContaining({
                    kind: "style",
                    status: "runtime-fallback",
                    fallback: true,
                }),
                expect.objectContaining({
                    kind: "mergeProps",
                    status: "runtime-fallback",
                    fallback: true,
                }),
            ])
            expect(file.diagnostics).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ code: "UNSUPPORTED_MERGER" }),
                ])
            )
            expectCandidateRecord(manifest, "px-2", "fallback-known")
            expectCandidateRecord(manifest, "px-4", "fallback-known")
            expectCandidateRecord(manifest, "m-1", "fallback-known")
        })

        it("preserves exported tw declarations when exact imports are cleaned up", () => {
            const code = lines([
                `import { createTools } from "tailwindest"`,
                `export const tw = createTools()`,
                `export const cls = tw.join("px-4")`,
            ])

            const { result, manifest, file } = compileWithDebug(
                code,
                "/project/src/exported-tw.ts"
            )

            expect(result.changed).toBe(true)
            expect(result.code).toBe(
                lines([
                    `import { createTools } from "tailwindest"`,
                    `export const tw = createTools()`,
                    `export const cls = "px-4"`,
                ])
            )
            expect(file.replacements).toEqual([
                expect.objectContaining({
                    kind: "join",
                    status: "compiled",
                    fallback: false,
                }),
            ])
            expectCandidateRecord(manifest, "px-4", "exact")
        })

        it("preserves exported stored stylers as runtime values", () => {
            const code = lines([
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `export const button = tw.style({ color: "text-blue-700" })`,
                `export const cls = button.class()`,
            ])

            const { result, manifest, file } = compileWithDebug(
                code,
                "/project/src/exported-styler.ts"
            )

            expect(result.code).toBe(code)
            expect(result.changed).toBe(false)
            expectNoCompiledReplacements(file)
            expect(file.replacements).toEqual([
                expect.objectContaining({
                    kind: "style",
                    status: "candidate-only",
                    fallback: false,
                }),
            ])
            expectCandidateRecord(manifest, "text-blue-700", "fallback-known")
        })
    })

    it("emits parseable dynamic lookup output for JS, JSX, TS, and TSX source kinds", () => {
        for (const extension of ["js", "jsx", "ts", "tsx"]) {
            const fileName = `/project/src/source-kind.${extension}`
            const code = lines([
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `export const cls = (size) => tw.rotary({`,
                `  base: { display: "grid" },`,
                `  variants: { sm: { padding: "p-2" }, lg: { padding: "p-4" } },`,
                `}).class(size)`,
            ])

            const result = compile(code, { fileName })

            expect(result.changed, extension).toBe(true)
            expectParsesAs(fileName, result.code)
            if (extension === "js" || extension === "jsx") {
                expect(result.code, extension).not.toContain(" as const")
            }
        }
    })

    it("marks invalid generated replacement syntax as unsafe runtime fallback", () => {
        const code = lines([
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `export const cls = (first, second) => tw.variants({`,
            `  base: { display: "inline-flex" },`,
            `  variants: {`,
            '    "a`b": { one: { color: "text-blue-700" } },',
            `    tone: { two: { color: "text-red-700" } },`,
            `  },`,
            '}).class({ "a`b": first, tone: second })',
        ])

        const { result, manifest, file } = compileWithDebug(
            code,
            "/project/src/invalid-codegen.ts"
        )

        expect(result.code).toBe(code)
        expect(result.changed).toBe(false)
        expect(file.replacements).toEqual([
            expect.objectContaining({
                kind: "variants",
                generatedText: "",
                status: "unsafe-skipped",
                fallback: true,
                candidateRecords: expect.arrayContaining([
                    expect.objectContaining({
                        candidate: "inline-flex",
                        kind: "fallback-known",
                    }),
                    expect.objectContaining({
                        candidate: "text-blue-700",
                        kind: "fallback-known",
                    }),
                    expect.objectContaining({
                        candidate: "text-red-700",
                        kind: "fallback-known",
                    }),
                ]),
                reason: expect.stringContaining("syntax error"),
            }),
        ])
        expect(file.diagnostics).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    code: "INVALID_REPLACEMENT_SYNTAX",
                    fallbackBehavior: "runtime-fallback",
                }),
            ])
        )
        expectCandidateRecord(manifest, "inline-flex", "fallback-known")
        expectCandidateRecord(manifest, "text-blue-700", "fallback-known")
        expectCandidateRecord(manifest, "text-red-700", "fallback-known")
        expect(
            manifest.candidateRecords.filter(
                (record) => record.kind === "exact"
            )
        ).toEqual([])
    })

    it("keeps debug statuses and candidate record kinds aligned for mixed outcomes", () => {
        const code = lines([
            `import { createTools } from "tailwindest"`,
            `const tw = createTools()`,
            `declare const dynamicClass: string`,
            `export const exact = tw.join("px-2")`,
            `export const stored = tw.style({ color: "text-blue-700" })`,
            `export const runtime = tw.join("px-4", dynamicClass)`,
        ])

        const { result, manifest, file } = compileWithDebug(
            code,
            "/project/src/debug-contract.ts"
        )

        expect(result.changed).toBe(true)
        expect(result.code).toContain(`export const exact = "px-2"`)
        expect(result.code).toContain(
            `export const stored = tw.style({ color: "text-blue-700" })`
        )
        expect(result.code).toContain(
            `export const runtime = tw.join("px-4", dynamicClass)`
        )
        expect(
            file.replacements.map((replacement) => ({
                kind: replacement.kind,
                status: replacement.status,
                fallback: replacement.fallback,
            }))
        ).toEqual([
            { kind: "join", status: "compiled", fallback: false },
            { kind: "style", status: "candidate-only", fallback: false },
            { kind: "join", status: "runtime-fallback", fallback: true },
        ])
        expect(file.replacements[0]?.candidateRecords).toEqual([
            expect.objectContaining({
                candidate: "px-2",
                kind: "exact",
            }),
        ])
        expect(file.replacements[1]?.candidateRecords).toEqual([
            expect.objectContaining({
                candidate: "text-blue-700",
                kind: "fallback-known",
            }),
        ])
        expect(file.replacements[2]?.candidateRecords).toEqual([
            expect.objectContaining({
                candidate: "px-4",
                kind: "fallback-known",
            }),
        ])
        expectCandidateRecord(manifest, "px-2", "exact")
        expectCandidateRecord(manifest, "text-blue-700", "fallback-known")
        expectCandidateRecord(manifest, "px-4", "fallback-known")
    })

    it("removes stale manifest candidates on update and delete", () => {
        const context = createCompilerContext({
            root: "/project",
            options: { debug: true },
        })
        const fileName = "/project/src/hmr-release.ts"

        context.transformJs(
            lines([
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `export const cls = tw.join("stale-class")`,
            ]),
            fileName
        )
        expect(context.getManifestCandidates()).toEqual(["stale-class"])

        context.transformJs(
            lines([
                `import { createTools } from "tailwindest"`,
                `const tw = createTools()`,
                `export const cls = tw.join("fresh-class")`,
            ]),
            fileName
        )
        expect(context.getManifestCandidates()).toEqual(["fresh-class"])
        expect(context.getDebugManifest().candidateRecords).toEqual([
            expect.objectContaining({
                candidate: "fresh-class",
                kind: "exact",
            }),
        ])

        expect(context.removeFile(fileName)).toBe(true)
        expect(context.getManifestCandidates()).toEqual([])
        expect(context.getDebugManifest().candidateRecords).toEqual([])
    })
})
