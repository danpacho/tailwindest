import { describe, expect, it } from "vitest"
import { createTools } from "../../../../tailwindest/src/tools/create_tools"
import { compileTailwindestCall } from "../api_compile"
import type { ApiCompileInput, CompileValue } from "../api_compile"
import { createCompiledVariantResolver } from "../compiled_variant_resolver"
import type { StaticClassValue, StaticStyleObject } from "../static_value"

const runtimeTw = createTools()
const commonVariantResolver = createCompiledVariantResolver([
    "dark",
    "hover",
    "group-hover",
    "data-[state=open]",
])

const span = {
    fileName: "fixture.ts",
    start: 0,
    end: 10,
}

const baseStyle = {
    display: "flex",
    color: "text-gray-950",
    padding: ["px-2", "py-1"],
    hover: {
        color: "hover:text-blue-500",
    },
}

const extraStyle = {
    color: "text-red-500",
    margin: "m-2",
}

const toggleConfig = {
    base: {
        display: "inline-flex",
        padding: "px-2",
    },
    truthy: {
        color: "text-green-600",
        hover: {
            color: "hover:text-green-700",
        },
    },
    falsy: {
        color: "text-red-600",
        hover: {
            color: "hover:text-red-700",
        },
    },
}

const rotaryConfig = {
    base: {
        display: "grid",
        gap: "gap-2",
    },
    variants: {
        sm: {
            padding: "p-2",
        },
        md: {
            padding: "p-4",
        },
        "2": {
            padding: "p-8",
        },
    },
}

const variantsConfig = {
    base: {
        display: "inline-flex",
        color: "text-gray-900",
    },
    variants: {
        intent: {
            primary: {
                color: "text-blue-700",
                background: "bg-blue-50",
            },
            danger: {
                color: "text-red-700",
                background: "bg-red-50",
            },
        },
        size: {
            sm: {
                padding: "px-2",
                fontSize: "text-sm",
            },
            lg: {
                padding: "px-4",
                fontSize: "text-lg",
            },
        },
        tone: {
            quiet: {
                border: "border-transparent",
            },
            loud: {
                border: "border-current",
            },
        },
    },
}

const unsupportedCases: ApiCompileInput[] = [
    {
        kind: "style.class",
        span,
        style: { kind: "unsupported", reason: "dynamic style object" },
        extraClass: [],
    },
    {
        kind: "style.style",
        span,
        style: { kind: "unsupported", reason: "dynamic style object" },
        extraStyles: [],
    },
    {
        kind: "style.compose",
        span,
        style: { kind: "static", value: baseStyle },
        styles: [{ kind: "unsupported", reason: "spread style" }],
    },
    {
        kind: "toggle.class",
        span,
        config: { kind: "unsupported", reason: "dynamic toggle config" },
        condition: { kind: "static", value: true },
        extraClass: [],
    },
    {
        kind: "toggle.style",
        span,
        config: { kind: "unsupported", reason: "dynamic toggle config" },
        condition: { kind: "static", value: true },
        extraStyles: [],
    },
    {
        kind: "toggle.compose",
        span,
        config: { kind: "static", value: toggleConfig },
        styles: [{ kind: "unsupported", reason: "spread style" }],
    },
    {
        kind: "rotary.class",
        span,
        config: { kind: "unsupported", reason: "dynamic rotary config" },
        key: { kind: "static", value: "sm" },
        extraClass: [],
    },
    {
        kind: "rotary.style",
        span,
        config: { kind: "unsupported", reason: "dynamic rotary config" },
        key: { kind: "static", value: "sm" },
        extraStyles: [],
    },
    {
        kind: "rotary.compose",
        span,
        config: { kind: "static", value: rotaryConfig },
        styles: [{ kind: "unsupported", reason: "spread style" }],
    },
    {
        kind: "variants.class",
        span,
        config: { kind: "unsupported", reason: "dynamic variants config" },
        props: { kind: "static", value: { intent: "primary" } },
        extraClass: [],
    },
    {
        kind: "variants.style",
        span,
        config: { kind: "unsupported", reason: "dynamic variants config" },
        props: { kind: "static", value: { intent: "primary" } },
        extraStyles: [],
    },
    {
        kind: "variants.compose",
        span,
        config: { kind: "static", value: variantsConfig },
        styles: [{ kind: "unsupported", reason: "spread style" }],
    },
    {
        kind: "join",
        span,
        classList: [{ kind: "unsupported", reason: "dynamic class spread" }],
    },
    {
        kind: "def",
        span,
        classList: { kind: "unsupported", reason: "dynamic class list" },
        styles: [],
    },
    {
        kind: "mergeProps",
        span,
        styles: [{ kind: "unsupported", reason: "dynamic style spread" }],
    },
    {
        kind: "mergeRecord",
        span,
        styles: [{ kind: "unsupported", reason: "dynamic style spread" }],
    },
]

function evaluateExpression<T>(
    expression: string,
    scope: Record<string, unknown> = {}
): T {
    const names = Object.keys(scope)
    const values = Object.values(scope)
    return new Function(...names, `return (${expression});`)(...values) as T
}

function evaluateGenerated<T>(
    generated: { declarations: string[]; expression: string },
    scope: Record<string, unknown> = {}
): T {
    const names = Object.keys(scope)
    const values = Object.values(scope)
    const source = `${generated.declarations.join("\n").replaceAll(" as const", "")}\nreturn (${generated.expression});`
    return new Function(...names, source)(...values) as T
}

function candidatesOf(input: ApiCompileInput): string[] {
    return compileTailwindestCall(input).candidates
}

function expectContainsAll(actual: string[], expected: string[]) {
    for (const className of expected) {
        expect(actual).toContain(className)
    }
}

describe("compileTailwindestCall API surface", () => {
    it("fails closed for nested compiled shorthand when variant metadata is missing", () => {
        const result = compileTailwindestCall({
            kind: "style.class",
            span,
            style: {
                kind: "static",
                value: {
                    hover: {
                        color: "text-blue-500",
                    },
                },
            },
            extraClass: [],
        })

        expect(result.exact).toBe(false)
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "MISSING_COMPILED_VARIANT_METADATA",
            }),
        ])
        expect(result.candidates).toEqual(["text-blue-500"])
        expect(result.candidates).not.toContain("hover:text-blue-500")
    })

    it("preserves arbitrary nested structural leaves when variant metadata is missing", () => {
        const result = compileTailwindestCall({
            kind: "style.class",
            span,
            style: {
                kind: "static",
                value: {
                    nested: {
                        color: "text-blue-500",
                    },
                },
            },
            extraClass: [],
        })

        expect(result.exact).toBe(false)
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "MISSING_COMPILED_VARIANT_METADATA",
            }),
        ])
        expect(result.candidates).toEqual(["text-blue-500"])
        expect(result.candidates).not.toContain("nested:text-blue-500")
    })

    it("preserves runtime-compatible class extras when variant metadata is missing", () => {
        const result = compileTailwindestCall({
            kind: "style.class",
            span,
            style: {
                kind: "static",
                value: {
                    hover: {
                        color: "text-blue-500",
                    },
                },
            },
            extraClass: [{ kind: "static", value: "px-2" }],
        })

        expect(result.exact).toBe(false)
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "MISSING_COMPILED_VARIANT_METADATA",
            }),
        ])
        expect(result.candidates).toEqual(["text-blue-500", "px-2"])
    })

    it("does not collect runtime-incompatible class extras when variant metadata is missing", () => {
        const result = compileTailwindestCall({
            kind: "style.class",
            span,
            style: {
                kind: "static",
                value: {
                    hover: {
                        color: "text-blue-500",
                    },
                },
            },
            extraClass: [
                { kind: "static", value: { "px-2": true } as StaticClassValue },
            ],
        })

        expect(result.exact).toBe(false)
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "MISSING_COMPILED_VARIANT_METADATA",
            }),
        ])
        expect(result.candidates).toEqual(["text-blue-500"])
        expect(result.candidates).not.toContain("px-2")
    })

    it.each([
        {
            name: "style.style",
            expectedCandidate: "text-blue-500",
            input: {
                kind: "style.style",
                span,
                style: {
                    kind: "static",
                    value: { hover: { color: "text-blue-500" } },
                },
                extraStyles: [],
            },
        },
        {
            name: "style.compose",
            expectedCandidate: "text-blue-500",
            input: {
                kind: "style.compose",
                span,
                style: {
                    kind: "static",
                    value: { hover: { color: "text-blue-500" } },
                },
                styles: [],
            },
        },
        {
            name: "toggle.class",
            expectedCandidate: "text-blue-500",
            input: {
                kind: "toggle.class",
                span,
                config: {
                    kind: "static",
                    value: {
                        truthy: { hover: { color: "text-blue-500" } },
                        falsy: { color: "text-slate-500" },
                    },
                },
                condition: { kind: "static", value: true },
                extraClass: [],
            },
        },
        {
            name: "toggle.style",
            expectedCandidate: "text-blue-500",
            input: {
                kind: "toggle.style",
                span,
                config: {
                    kind: "static",
                    value: {
                        truthy: { hover: { color: "text-blue-500" } },
                        falsy: { color: "text-slate-500" },
                    },
                },
                condition: { kind: "static", value: true },
                extraStyles: [],
            },
        },
        {
            name: "toggle.compose",
            expectedCandidate: "text-blue-600",
            input: {
                kind: "toggle.compose",
                span,
                config: {
                    kind: "static",
                    value: {
                        truthy: { color: "text-blue-500" },
                        falsy: { color: "text-slate-500" },
                    },
                },
                styles: [
                    {
                        kind: "static",
                        value: { hover: { color: "text-blue-600" } },
                    },
                ],
            },
        },
        {
            name: "rotary.class",
            expectedCandidate: "text-blue-500",
            input: {
                kind: "rotary.class",
                span,
                config: {
                    kind: "static",
                    value: {
                        variants: {
                            sm: { hover: { color: "text-blue-500" } },
                        },
                    },
                },
                key: { kind: "static", value: "sm" },
                extraClass: [],
            },
        },
        {
            name: "rotary.style",
            expectedCandidate: "text-blue-500",
            input: {
                kind: "rotary.style",
                span,
                config: {
                    kind: "static",
                    value: {
                        variants: {
                            sm: { hover: { color: "text-blue-500" } },
                        },
                    },
                },
                key: { kind: "static", value: "sm" },
                extraStyles: [],
            },
        },
        {
            name: "rotary.compose",
            expectedCandidate: "text-blue-600",
            input: {
                kind: "rotary.compose",
                span,
                config: {
                    kind: "static",
                    value: {
                        variants: {
                            sm: { color: "text-blue-500" },
                        },
                    },
                },
                styles: [
                    {
                        kind: "static",
                        value: { hover: { color: "text-blue-600" } },
                    },
                ],
            },
        },
        {
            name: "variants.class",
            expectedCandidate: "text-blue-500",
            input: {
                kind: "variants.class",
                span,
                config: {
                    kind: "static",
                    value: {
                        variants: {
                            intent: {
                                primary: {
                                    hover: { color: "text-blue-500" },
                                },
                            },
                        },
                    },
                },
                props: { kind: "static", value: { intent: "primary" } },
                extraClass: [],
            },
        },
        {
            name: "variants.style",
            expectedCandidate: "text-blue-500",
            input: {
                kind: "variants.style",
                span,
                config: {
                    kind: "static",
                    value: {
                        variants: {
                            intent: {
                                primary: {
                                    hover: { color: "text-blue-500" },
                                },
                            },
                        },
                    },
                },
                props: { kind: "static", value: { intent: "primary" } },
                extraStyles: [],
            },
        },
        {
            name: "variants.compose",
            expectedCandidate: "text-blue-600",
            input: {
                kind: "variants.compose",
                span,
                config: {
                    kind: "static",
                    value: {
                        variants: {
                            intent: {
                                primary: { color: "text-blue-500" },
                            },
                        },
                    },
                },
                styles: [
                    {
                        kind: "static",
                        value: { hover: { color: "text-blue-600" } },
                    },
                ],
            },
        },
        {
            name: "def",
            expectedCandidate: "text-blue-500",
            input: {
                kind: "def",
                span,
                classList: { kind: "static", value: [] },
                styles: [
                    {
                        kind: "static",
                        value: { hover: { color: "text-blue-500" } },
                    },
                ],
            },
        },
        {
            name: "mergeProps",
            expectedCandidate: "text-blue-500",
            input: {
                kind: "mergeProps",
                span,
                styles: [
                    {
                        kind: "static",
                        value: { hover: { color: "text-blue-500" } },
                    },
                ],
            },
        },
        {
            name: "mergeRecord",
            expectedCandidate: "text-blue-500",
            input: {
                kind: "mergeRecord",
                span,
                styles: [
                    {
                        kind: "static",
                        value: { hover: { color: "text-blue-500" } },
                    },
                ],
            },
        },
    ] satisfies Array<{
        name: string
        expectedCandidate: string
        input: ApiCompileInput
    }>)(
        "fails closed for nested compiled shorthand without metadata in $name",
        ({ input, expectedCandidate }) => {
            const result = compileTailwindestCall(input)

            expect(result.exact).toBe(false)
            expect(result.diagnostics).toEqual([
                expect.objectContaining({
                    code: "MISSING_COMPILED_VARIANT_METADATA",
                }),
            ])
            expect(result.candidates).toContain(expectedCandidate)
            expect(result.candidates).not.toContain(
                `hover:${expectedCandidate}`
            )
        }
    )

    it("uses explicit compiled variant metadata for exact nested shorthand", () => {
        const result = compileTailwindestCall(
            {
                kind: "style.class",
                span,
                style: {
                    kind: "static",
                    value: {
                        surface: {
                            color: "text-blue-500",
                        },
                    },
                },
                extraClass: [],
            },
            {
                variantResolver: createCompiledVariantResolver(["surface"]),
            }
        )

        expect(result.exact).toBe(true)
        expect(result.generated.expression).toBe('"surface:text-blue-500"')
        expect(result.candidates).toEqual(["surface:text-blue-500"])
    })

    it.each([
        { name: "without resolver", options: undefined },
        {
            name: "with resolver",
            options: { variantResolver: commonVariantResolver },
        },
    ])(
        "compiles direct variant-looking leaves as structural classes $name",
        ({ options }) => {
            const result = compileTailwindestCall(
                {
                    kind: "style.class",
                    span,
                    style: {
                        kind: "static",
                        value: {
                            dark: "bg-red-900",
                        },
                    },
                    extraClass: [],
                },
                options
            )

            expect(result.exact).toBe(true)
            expect(result.diagnostics).toEqual([])
            expect(result.generated.expression).toBe('"bg-red-900"')
            expect(result.candidates).toEqual(["bg-red-900"])
        }
    )

    it("reports compile-required diagnostics for object-returning nested shorthand with metadata", () => {
        const result = compileTailwindestCall(
            {
                kind: "style.style",
                span,
                style: {
                    kind: "static",
                    value: {
                        dark: {
                            color: "text-white",
                        },
                    },
                },
                extraStyles: [],
            },
            { variantResolver: commonVariantResolver }
        )

        expect(result.exact).toBe(false)
        expect(result.replacement).toBeUndefined()
        expect(result.candidates).toEqual(["dark:text-white"])
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "COMPILED_VARIANT_REQUIRES_CLASS_OUTPUT",
            }),
        ])
    })

    it("reports compile-required diagnostics when nested dynamic variants.class overflows", () => {
        const result = compileTailwindestCall(
            {
                kind: "variants.class",
                span,
                config: {
                    kind: "static",
                    value: {
                        variants: {
                            intent: {
                                primary: {
                                    hover: { color: "text-blue-500" },
                                },
                                danger: {
                                    hover: { color: "text-red-500" },
                                },
                            },
                            tone: {
                                soft: {
                                    hover: { color: "text-sky-500" },
                                },
                                loud: {
                                    hover: { color: "text-orange-500" },
                                },
                            },
                        },
                    },
                },
                props: {
                    kind: "dynamic-variant-props",
                    entries: [
                        { axis: "intent", expression: "intent" },
                        { axis: "tone", expression: "tone" },
                    ],
                },
                extraClass: [],
                variantTableLimit: 1,
            },
            { variantResolver: commonVariantResolver }
        )

        expect(result.exact).toBe(false)
        expect(result.replacement).toBeUndefined()
        expect(result.diagnostics).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    code: "VARIANT_TABLE_LIMIT_EXCEEDED",
                }),
                expect.objectContaining({
                    code: "COMPILED_VARIANT_REQUIRES_CLASS_OUTPUT",
                }),
            ])
        )
    })

    it.each([
        {
            name: "style.style",
            input: {
                kind: "style.style",
                span,
                style: { kind: "static", value: baseStyle },
                extraStyles: [{ kind: "static", value: extraStyle }],
            },
        },
        {
            name: "style.compose",
            input: {
                kind: "style.compose",
                span,
                style: { kind: "static", value: baseStyle },
                styles: [{ kind: "static", value: extraStyle }],
            },
        },
        {
            name: "toggle.style",
            input: {
                kind: "toggle.style",
                span,
                config: { kind: "static", value: toggleConfig },
                condition: { kind: "static", value: true },
                extraStyles: [{ kind: "static", value: extraStyle }],
            },
        },
        {
            name: "toggle.compose",
            input: {
                kind: "toggle.compose",
                span,
                config: { kind: "static", value: toggleConfig },
                styles: [{ kind: "static", value: extraStyle }],
            },
        },
        {
            name: "rotary.style",
            input: {
                kind: "rotary.style",
                span,
                config: { kind: "static", value: rotaryConfig },
                key: { kind: "static", value: "sm" },
                extraStyles: [{ kind: "static", value: extraStyle }],
            },
        },
        {
            name: "rotary.compose",
            input: {
                kind: "rotary.compose",
                span,
                config: { kind: "static", value: rotaryConfig },
                styles: [{ kind: "static", value: extraStyle }],
            },
        },
        {
            name: "variants.style",
            input: {
                kind: "variants.style",
                span,
                config: { kind: "static", value: variantsConfig },
                props: { kind: "static", value: { intent: "primary" } },
                extraStyles: [{ kind: "static", value: extraStyle }],
                variantTableLimit: 64,
            },
        },
        {
            name: "variants.compose",
            input: {
                kind: "variants.compose",
                span,
                config: { kind: "static", value: variantsConfig },
                styles: [{ kind: "static", value: extraStyle }],
            },
        },
        {
            name: "mergeRecord",
            input: {
                kind: "mergeRecord",
                span,
                styles: [
                    { kind: "static", value: baseStyle },
                    { kind: "static", value: extraStyle },
                ],
            },
        },
        {
            name: "join",
            input: {
                kind: "join",
                span,
                classList: [
                    { kind: "static", value: "px-2" },
                    { kind: "static", value: "px-4" },
                ],
            },
        },
    ] satisfies Array<{ name: string; input: ApiCompileInput }>)(
        "does not create a replacement plan for forbidden exact API $name",
        ({ input }) => {
            const result = compileTailwindestCall(input, {
                variantResolver: commonVariantResolver,
            })

            expect(result.exact).toBe(true)
            expect(result.generated.expression).not.toBe("")
            expect(result.candidates.length).toBeGreaterThan(0)
            expect(result.replacement).toBeUndefined()
        }
    )

    it("compiles tw.style(obj).class(...extra) static output and candidates", () => {
        const result = compileTailwindestCall(
            {
                kind: "style.class",
                span,
                style: { kind: "static", value: baseStyle },
                extraClass: [{ kind: "static", value: "rounded shadow-sm" }],
            },
            { variantResolver: commonVariantResolver }
        )

        expect(result.exact).toBe(true)
        expect(evaluateExpression(result.generated.expression)).toBe(
            runtimeTw.style(baseStyle).class("rounded shadow-sm")
        )
        expect(result.replacement?.text).toBe(result.generated.expression)
        expectContainsAll(result.candidates, [
            "flex",
            "text-gray-950",
            "px-2",
            "py-1",
            "hover:text-blue-500",
            "rounded",
            "shadow-sm",
        ])
    })

    it.each([
        {
            name: "style.class",
            input: {
                kind: "style.class",
                span,
                style: { kind: "static", value: baseStyle },
                extraClass: [
                    { kind: "static", value: "rounded" },
                    { kind: "static", value: ["px-4", "py-2"] },
                ],
            },
            runtime: () =>
                runtimeTw.style(baseStyle).class("rounded", ["px-4", "py-2"]),
        },
        {
            name: "toggle.class",
            input: {
                kind: "toggle.class",
                span,
                config: { kind: "static", value: toggleConfig },
                condition: { kind: "static", value: true },
                extraClass: [
                    { kind: "static", value: "rounded" },
                    { kind: "static", value: ["px-4", "py-2"] },
                ],
            },
            runtime: () =>
                runtimeTw
                    .toggle(toggleConfig)
                    .class(true, "rounded", ["px-4", "py-2"]),
        },
        {
            name: "rotary.class",
            input: {
                kind: "rotary.class",
                span,
                config: { kind: "static", value: rotaryConfig },
                key: { kind: "static", value: "sm" },
                extraClass: [
                    { kind: "static", value: "rounded" },
                    { kind: "static", value: ["px-4", "py-2"] },
                ],
            },
            runtime: () =>
                runtimeTw
                    .rotary(rotaryConfig)
                    .class("sm", "rounded", ["px-4", "py-2"]),
        },
        {
            name: "variants.class",
            input: {
                kind: "variants.class",
                span,
                config: { kind: "static", value: variantsConfig },
                props: { kind: "static", value: { intent: "primary" } },
                extraClass: [
                    { kind: "static", value: "rounded" },
                    { kind: "static", value: ["px-4", "py-2"] },
                ],
                variantTableLimit: 64,
            },
            runtime: () =>
                runtimeTw
                    .variants(variantsConfig)
                    .class({ intent: "primary" }, "rounded", ["px-4", "py-2"]),
        },
    ] satisfies Array<{
        name: string
        input: ApiCompileInput
        runtime: () => string
    }>)(
        "compiles $name with runtime-compatible string and string-array extras",
        ({ input, runtime }) => {
            const result = compileTailwindestCall(input, {
                variantResolver: commonVariantResolver,
            })

            expect(result.exact).toBe(true)
            expect(evaluateGenerated(result.generated)).toBe(runtime())
            expectContainsAll(result.candidates, ["rounded", "px-4", "py-2"])
        }
    )

    it.each([
        { label: "object", value: { "unsafe-object-extra": true } },
        { label: "number", value: 1 },
        { label: "boolean", value: true },
        {
            label: "array containing object",
            value: ["safe-array-extra", { "unsafe-array-object-extra": true }],
        },
    ])(
        "falls back for runtime-incompatible class extra $label across class-output APIs",
        ({ value }) => {
            const cases = [
                {
                    name: "style.class",
                    input: {
                        kind: "style.class",
                        span,
                        style: { kind: "static", value: baseStyle },
                        extraClass: [{ kind: "static", value }],
                    },
                    baseCandidate: "text-gray-950",
                },
                {
                    name: "toggle.class",
                    input: {
                        kind: "toggle.class",
                        span,
                        config: { kind: "static", value: toggleConfig },
                        condition: { kind: "static", value: true },
                        extraClass: [{ kind: "static", value }],
                    },
                    baseCandidate: "inline-flex",
                },
                {
                    name: "rotary.class",
                    input: {
                        kind: "rotary.class",
                        span,
                        config: { kind: "static", value: rotaryConfig },
                        key: { kind: "static", value: "sm" },
                        extraClass: [{ kind: "static", value }],
                    },
                    baseCandidate: "grid",
                },
                {
                    name: "variants.class",
                    input: {
                        kind: "variants.class",
                        span,
                        config: { kind: "static", value: variantsConfig },
                        props: {
                            kind: "static",
                            value: { intent: "primary" },
                        },
                        extraClass: [{ kind: "static", value }],
                        variantTableLimit: 64,
                    },
                    baseCandidate: "inline-flex",
                },
            ] satisfies Array<{
                name: string
                input: ApiCompileInput
                baseCandidate: string
            }>

            for (const item of cases) {
                const result = compileTailwindestCall(item.input, {
                    variantResolver: commonVariantResolver,
                })

                expect(result.exact, item.name).toBe(false)
                expect(result.replacement, item.name).toBeUndefined()
                expect(result.candidates, item.name).toContain(
                    item.baseCandidate
                )
                expect(result.candidates, item.name).not.toContain(
                    "unsafe-object-extra"
                )
                expect(result.candidates, item.name).not.toContain(
                    "unsafe-array-object-extra"
                )
                expect(result.diagnostics, item.name).toEqual([
                    expect.objectContaining({
                        code: "UNSUPPORTED_DYNAMIC_VALUE",
                        message: expect.stringContaining(
                            "runtime-incompatible class extra"
                        ),
                    }),
                ])
            }
        }
    )

    it("compiles nested variant style shorthand into prefixed class candidates", () => {
        const style = {
            dark: {
                backgroundColor: "bg-red-900",
                hover: {
                    backgroundColor: "bg-red-950",
                },
            },
            backgroundColor: "bg-red-50",
        }
        const result = compileTailwindestCall(
            {
                kind: "style.class",
                span,
                style: { kind: "static", value: style },
                extraClass: [],
            },
            { variantResolver: commonVariantResolver }
        )

        expect(result.exact).toBe(true)
        expect(evaluateExpression(result.generated.expression)).toBe(
            "dark:bg-red-900 dark:hover:bg-red-950 bg-red-50"
        )
        expect(result.candidates).toEqual([
            "dark:bg-red-900",
            "dark:hover:bg-red-950",
            "bg-red-50",
        ])
    })

    it("compiles extended group and arbitrary nested variant candidates", () => {
        const style = {
            group: {
                hover: {
                    backgroundColor: "bg-blue-500",
                },
            },
            "data-[state=open]": {
                color: "text-blue-600",
            },
        }
        const result = compileTailwindestCall(
            {
                kind: "style.class",
                span,
                style: { kind: "static", value: style },
                extraClass: [],
            },
            { variantResolver: commonVariantResolver }
        )

        expect(result.exact).toBe(true)
        expect(evaluateExpression(result.generated.expression)).toBe(
            "group-hover:bg-blue-500 data-[state=open]:text-blue-600"
        )
        expect(result.candidates).toEqual([
            "group-hover:bg-blue-500",
            "data-[state=open]:text-blue-600",
        ])
    })

    it("compiles tw.style(obj).style(...extra) static object output and candidates", () => {
        const result = compileTailwindestCall({
            kind: "style.style",
            span,
            style: { kind: "static", value: baseStyle },
            extraStyles: [{ kind: "static", value: extraStyle }],
        })

        expect(result.exact).toBe(true)
        expect(evaluateExpression(result.generated.expression)).toEqual(
            runtimeTw.style(baseStyle).style(extraStyle)
        )
        expectContainsAll(result.candidates, ["text-red-500", "m-2"])
    })

    it("compiles tw.style(obj).compose(...styles) into a primitive model output", () => {
        const result = compileTailwindestCall({
            kind: "style.compose",
            span,
            style: { kind: "static", value: baseStyle },
            styles: [{ kind: "static", value: extraStyle }],
        })

        expect(result.exact).toBe(true)
        expect(result.replacement).toBeUndefined()
        expect(evaluateExpression(result.generated.expression)).toEqual(
            runtimeTw.style(baseStyle).compose(extraStyle).style()
        )
        expectContainsAll(result.candidates, ["text-red-500", "m-2"])
    })

    it("compiles tw.toggle(config).class(condition, ...extra) to a ternary with true/false runtime parity", () => {
        const result = compileTailwindestCall({
            kind: "toggle.class",
            span,
            config: { kind: "static", value: toggleConfig },
            condition: { kind: "dynamic", expression: "condition" },
            extraClass: [{ kind: "static", value: "rounded" }],
        })

        expect(result.exact).toBe(true)
        expect(result.generated.expression).toContain("?")
        for (const condition of [true, false]) {
            expect(evaluateGenerated(result.generated, { condition })).toBe(
                runtimeTw.toggle(toggleConfig).class(condition, "rounded")
            )
        }
        expectContainsAll(result.candidates, [
            "inline-flex",
            "px-2",
            "text-green-600",
            "hover:text-green-700",
            "text-red-600",
            "hover:text-red-700",
            "rounded",
        ])
    })

    it("compiles tw.toggle(config).style(condition, extraStyle?) to conditional object output", () => {
        const result = compileTailwindestCall({
            kind: "toggle.style",
            span,
            config: { kind: "static", value: toggleConfig },
            condition: { kind: "dynamic", expression: "condition" },
            extraStyles: [{ kind: "static", value: extraStyle }],
        })

        expect(result.exact).toBe(true)
        for (const condition of [true, false]) {
            expect(evaluateGenerated(result.generated, { condition })).toEqual(
                runtimeTw.toggle(toggleConfig).style(condition, extraStyle)
            )
        }
    })

    it("compiles tw.toggle(config).style(condition, ...extraStyles) with runtime rest merge semantics", () => {
        const secondExtra = { display: "grid", gap: "gap-2" }
        const result = compileTailwindestCall({
            kind: "toggle.style",
            span,
            config: { kind: "static", value: toggleConfig },
            condition: { kind: "dynamic", expression: "condition" },
            extraStyles: [
                { kind: "static", value: extraStyle },
                { kind: "static", value: secondExtra },
            ],
        })
        const runtimeStyler = runtimeTw.toggle(toggleConfig)
        const runtimeStyle = (
            condition: boolean,
            ...styles: StaticStyleObject[]
        ) =>
            (
                runtimeStyler.style as (
                    condition: boolean,
                    ...styles: StaticStyleObject[]
                ) => StaticStyleObject
            ).call(runtimeStyler, condition, ...styles)

        expect(result.exact).toBe(true)
        for (const condition of [true, false]) {
            expect(evaluateGenerated(result.generated, { condition })).toEqual(
                runtimeStyle(condition, extraStyle, secondExtra)
            )
        }
    })

    it("compiles tw.toggle(config).compose(...styles) base merge semantics", () => {
        const result = compileTailwindestCall({
            kind: "toggle.compose",
            span,
            config: { kind: "static", value: toggleConfig },
            styles: [{ kind: "static", value: extraStyle }],
        })

        expect(result.exact).toBe(true)
        expect(result.replacement).toBeUndefined()
        expect(evaluateExpression(result.generated.expression)).toEqual(
            runtimeTw.toggle(toggleConfig).compose(extraStyle).style(true)
        )
    })

    it("compiles tw.rotary(config).class(key, ...extra) to readonly lookup with every key plus base runtime parity", () => {
        const result = compileTailwindestCall({
            kind: "rotary.class",
            span,
            config: { kind: "static", value: rotaryConfig },
            key: { kind: "dynamic", expression: "key" },
            extraClass: [{ kind: "static", value: "rounded" }],
        })

        expect(result.exact).toBe(true)
        expect(result.generated.declarations.join("\n")).toContain("as const")
        for (const key of ["base", "sm", "md", "2"]) {
            expect(evaluateGenerated(result.generated, { key })).toBe(
                runtimeTw.rotary(rotaryConfig).class(key as never, "rounded")
            )
        }
        expectContainsAll(result.candidates, [
            "grid",
            "gap-2",
            "p-2",
            "p-4",
            "p-8",
            "rounded",
        ])
    })

    it("compiles tw.rotary(config).style(key, ...extraStyles) to readonly lookup object output", () => {
        const result = compileTailwindestCall({
            kind: "rotary.style",
            span,
            config: { kind: "static", value: rotaryConfig },
            key: { kind: "dynamic", expression: "key" },
            extraStyles: [{ kind: "static", value: extraStyle }],
        })

        expect(result.exact).toBe(true)
        for (const key of ["base", "sm", "md", "2"]) {
            expect(evaluateGenerated(result.generated, { key })).toEqual(
                runtimeTw.rotary(rotaryConfig).style(key as never, extraStyle)
            )
        }
    })

    it("preserves tw.rotary(config).style(dynamicKey, ...extraStyles) missing-key runtime fallback", () => {
        const result = compileTailwindestCall({
            kind: "rotary.style",
            span,
            config: { kind: "static", value: rotaryConfig },
            key: { kind: "dynamic", expression: "key" },
            extraStyles: [{ kind: "static", value: extraStyle }],
        })

        expect(result.exact).toBe(true)
        expect(evaluateGenerated(result.generated, { key: "xl" })).toEqual(
            runtimeTw.rotary(rotaryConfig).style("xl" as never, extraStyle)
        )
    })

    it("preserves tw.rotary(config).class(dynamicKey) missing-key runtime failure", () => {
        const result = compileTailwindestCall({
            kind: "rotary.class",
            span,
            config: { kind: "static", value: rotaryConfig },
            key: { kind: "dynamic", expression: "key" },
            extraClass: [],
        })

        expect(result.exact).toBe(true)
        expect(evaluateGenerated(result.generated, { key: "sm" })).toBe(
            runtimeTw.rotary(rotaryConfig).class("sm")
        )
        expect(() =>
            evaluateGenerated(result.generated, { key: "xl" })
        ).toThrow(TypeError)
    })

    it("compiles tw.rotary(config).compose(...styles) base merge semantics", () => {
        const result = compileTailwindestCall({
            kind: "rotary.compose",
            span,
            config: { kind: "static", value: rotaryConfig },
            styles: [{ kind: "static", value: extraStyle }],
        })

        expect(result.exact).toBe(true)
        expect(result.replacement).toBeUndefined()
        expect(evaluateExpression(result.generated.expression)).toEqual(
            runtimeTw.rotary(rotaryConfig).compose(extraStyle).style("sm")
        )
    })

    it("compiles tw.variants(config).class(props, ...extra) with exhaustive finite-domain runtime parity", () => {
        const result = compileTailwindestCall({
            kind: "variants.class",
            span,
            config: { kind: "static", value: variantsConfig },
            props: {
                kind: "dynamic-variant-props",
                entries: [
                    { axis: "intent", expression: "intent" },
                    { axis: "size", expression: "size" },
                    { axis: "tone", expression: "tone" },
                ],
            },
            extraClass: [{ kind: "static", value: "rounded" }],
            variantTableLimit: 64,
        })

        expect(result.exact).toBe(true)
        const intents = ["primary", "danger"] as const
        const sizes = ["sm", "lg"] as const
        const tones = ["quiet", "loud"] as const
        for (const intent of intents) {
            for (const size of sizes) {
                for (const tone of tones) {
                    expect(
                        evaluateGenerated(result.generated, {
                            intent,
                            size,
                            tone,
                        })
                    ).toBe(
                        runtimeTw
                            .variants(variantsConfig)
                            .class({ intent, size, tone }, "rounded")
                    )
                }
            }
        }
        expectContainsAll(result.candidates, [
            "inline-flex",
            "text-blue-700",
            "bg-blue-50",
            "text-red-700",
            "bg-red-50",
            "px-2",
            "text-sm",
            "px-4",
            "text-lg",
            "border-transparent",
            "border-current",
            "rounded",
        ])
    })

    it("compiles tw.variants(config).style(props, ...extraStyles) and missing optional props match runtime base behavior", () => {
        const result = compileTailwindestCall({
            kind: "variants.style",
            span,
            config: { kind: "static", value: variantsConfig },
            props: {
                kind: "dynamic-variant-props",
                entries: [
                    { axis: "intent", expression: "intent" },
                    { axis: "size", expression: "size" },
                    { axis: "tone", expression: "tone" },
                ],
            },
            extraStyles: [{ kind: "static", value: extraStyle }],
            variantTableLimit: 64,
        })

        expect(result.exact).toBe(true)
        expect(
            evaluateGenerated(result.generated, {
                intent: undefined,
                size: undefined,
                tone: undefined,
            })
        ).toEqual(runtimeTw.variants(variantsConfig).style({}, extraStyle))
        expect(
            evaluateGenerated(result.generated, {
                intent: "danger",
                size: undefined,
                tone: "quiet",
            })
        ).toEqual(
            runtimeTw
                .variants(variantsConfig)
                .style({ intent: "danger", tone: "quiet" }, extraStyle)
        )
    })

    it("compiles tw.variants(config).style(props) conflicting component axes for every full combination", () => {
        const config = {
            base: { display: "inline-flex", color: "text-gray-900" },
            variants: {
                intent: {
                    primary: { color: "text-blue-700" },
                    danger: { color: "text-red-700" },
                },
                emphasis: {
                    weak: { color: "text-gray-500" },
                    strong: { color: "text-black" },
                },
            },
        }
        const result = compileTailwindestCall({
            kind: "variants.style",
            span,
            config: { kind: "static", value: config },
            props: {
                kind: "dynamic-variant-props",
                entries: [
                    { axis: "intent", expression: "intent" },
                    { axis: "emphasis", expression: "emphasis" },
                ],
            },
            extraStyles: [],
            variantTableLimit: 16,
        })

        expect(result.exact).toBe(true)
        for (const intent of ["primary", "danger"] as const) {
            for (const emphasis of ["weak", "strong"] as const) {
                expect(
                    evaluateGenerated(result.generated, { intent, emphasis })
                ).toEqual(
                    runtimeTw.variants(config).style({ intent, emphasis })
                )
            }
        }
    })

    it("compiles tw.variants(config).style(props) conflicting component axes with missing optional props", () => {
        const config = {
            base: { display: "inline-flex", color: "text-gray-900" },
            variants: {
                intent: {
                    primary: { color: "text-blue-700" },
                    danger: { color: "text-red-700" },
                },
                emphasis: {
                    weak: { color: "text-gray-500" },
                    strong: { color: "text-black" },
                },
            },
        }
        const result = compileTailwindestCall({
            kind: "variants.style",
            span,
            config: { kind: "static", value: config },
            props: {
                kind: "dynamic-variant-props",
                entries: [
                    { axis: "intent", expression: "intent" },
                    { axis: "emphasis", expression: "emphasis" },
                ],
            },
            extraStyles: [],
            variantTableLimit: 16,
        })

        expect(result.exact).toBe(true)
        expect(
            evaluateGenerated(result.generated, {
                intent: "primary",
                emphasis: undefined,
            })
        ).toEqual(runtimeTw.variants(config).style({ intent: "primary" }))
        expect(
            evaluateGenerated(result.generated, {
                intent: undefined,
                emphasis: "weak",
            })
        ).toEqual(runtimeTw.variants(config).style({ emphasis: "weak" }))
        expect(
            evaluateGenerated(result.generated, {
                intent: undefined,
                emphasis: undefined,
            })
        ).toEqual(runtimeTw.variants(config).style({}))
    })

    it("compiles tw.variants(config).class(props) conflicting component axes with missing optional props", () => {
        const config = {
            base: { display: "inline-flex", color: "text-gray-900" },
            variants: {
                intent: {
                    primary: { color: "text-blue-700" },
                    danger: { color: "text-red-700" },
                },
                emphasis: {
                    weak: { color: "text-gray-500" },
                    strong: { color: "text-black" },
                },
            },
        }
        const result = compileTailwindestCall({
            kind: "variants.class",
            span,
            config: { kind: "static", value: config },
            props: {
                kind: "dynamic-variant-props",
                entries: [
                    { axis: "intent", expression: "intent" },
                    { axis: "emphasis", expression: "emphasis" },
                ],
            },
            extraClass: [],
            variantTableLimit: 16,
        })

        expect(result.exact).toBe(true)
        expect(
            evaluateGenerated(result.generated, {
                intent: "primary",
                emphasis: undefined,
            })
        ).toBe(runtimeTw.variants(config).class({ intent: "primary" }))
        expect(
            evaluateGenerated(result.generated, {
                intent: undefined,
                emphasis: "weak",
            })
        ).toBe(runtimeTw.variants(config).class({ emphasis: "weak" }))
        expect(
            evaluateGenerated(result.generated, {
                intent: undefined,
                emphasis: undefined,
            })
        ).toBe(runtimeTw.variants(config).class({}))
    })

    it("compiles tw.variants(config).class(props) conflicting component axes in props entry order", () => {
        const config = {
            base: { display: "inline-flex", color: "text-gray-900" },
            variants: {
                intent: {
                    primary: { color: "text-blue-700" },
                },
                emphasis: {
                    weak: { color: "text-gray-500" },
                },
            },
        }
        const result = compileTailwindestCall({
            kind: "variants.class",
            span,
            config: { kind: "static", value: config },
            props: {
                kind: "dynamic-variant-props",
                entries: [
                    { axis: "emphasis", expression: "emphasis" },
                    { axis: "intent", expression: "intent" },
                ],
            },
            extraClass: [],
            variantTableLimit: 16,
        })

        expect(result.exact).toBe(true)
        expect(
            evaluateGenerated(result.generated, {
                emphasis: "weak",
                intent: "primary",
            })
        ).toBe(
            runtimeTw
                .variants(config)
                .class({ emphasis: "weak", intent: "primary" })
        )
        expect(
            evaluateGenerated(result.generated, {
                emphasis: "weak",
                intent: undefined,
            })
        ).toBe(runtimeTw.variants(config).class({ emphasis: "weak" }))
        expect(
            evaluateGenerated(result.generated, {
                emphasis: undefined,
                intent: "primary",
            })
        ).toBe(runtimeTw.variants(config).class({ intent: "primary" }))
    })

    it("compiles tw.variants(config).style(props) conflicting component axes in props entry order", () => {
        const config = {
            base: { display: "inline-flex", color: "text-gray-900" },
            variants: {
                intent: {
                    primary: { color: "text-blue-700" },
                },
                emphasis: {
                    weak: { color: "text-gray-500" },
                },
            },
        }
        const result = compileTailwindestCall({
            kind: "variants.style",
            span,
            config: { kind: "static", value: config },
            props: {
                kind: "dynamic-variant-props",
                entries: [
                    { axis: "emphasis", expression: "emphasis" },
                    { axis: "intent", expression: "intent" },
                ],
            },
            extraStyles: [],
            variantTableLimit: 16,
        })

        expect(result.exact).toBe(true)
        expect(
            evaluateGenerated(result.generated, {
                emphasis: "weak",
                intent: "primary",
            })
        ).toEqual(
            runtimeTw
                .variants(config)
                .style({ emphasis: "weak", intent: "primary" })
        )
        expect(
            evaluateGenerated(result.generated, {
                emphasis: "weak",
                intent: undefined,
            })
        ).toEqual(runtimeTw.variants(config).style({ emphasis: "weak" }))
        expect(
            evaluateGenerated(result.generated, {
                emphasis: undefined,
                intent: "primary",
            })
        ).toEqual(runtimeTw.variants(config).style({ intent: "primary" }))
    })

    it("treats boolean false dynamic variant expressions as missing while preserving string false keys", () => {
        const config = {
            base: { opacity: "opacity-100" },
            variants: {
                enabled: {
                    true: { opacity: "opacity-100" },
                    false: { opacity: "opacity-50" },
                },
            },
        }
        const result = compileTailwindestCall({
            kind: "variants.class",
            span,
            config: { kind: "static", value: config },
            props: {
                kind: "dynamic-variant-props",
                entries: [{ axis: "enabled", expression: "enabled" }],
            },
            extraClass: [],
        })

        expect(result.exact).toBe(true)
        expect(evaluateGenerated(result.generated, { enabled: false })).toBe(
            runtimeTw.variants(config).class({ enabled: false } as never)
        )
        expect(evaluateGenerated(result.generated, { enabled: "false" })).toBe(
            runtimeTw.variants(config).class({ enabled: "false" })
        )
    })

    it("allows __missing as a real dynamic variant value while preserving missing runtime behavior", () => {
        const config = {
            base: { color: "text-slate-900" },
            variants: {
                state: {
                    __missing: { color: "text-purple-700" },
                    "0": { color: "text-yellow-700" },
                    false: { color: "text-red-700" },
                },
            },
        }
        const result = compileTailwindestCall({
            kind: "variants.class",
            span,
            config: { kind: "static", value: config },
            props: {
                kind: "dynamic-variant-props",
                entries: [{ axis: "state", expression: "state" }],
            },
            extraClass: [],
        })
        const runtimeClass = (state: unknown) =>
            runtimeTw.variants(config).class({ state } as never)

        expect(result.exact).toBe(true)
        expect(
            evaluateGenerated(result.generated, { state: "__missing" })
        ).toBe(runtimeClass("__missing"))
        expect(evaluateGenerated(result.generated, { state: "0" })).toBe(
            runtimeClass("0")
        )
        expect(evaluateGenerated(result.generated, { state: 0 })).toBe(
            runtimeClass(0)
        )
        expect(evaluateGenerated(result.generated, { state: false })).toBe(
            runtimeClass(false)
        )
        expect(evaluateGenerated(result.generated, { state: undefined })).toBe(
            runtimeClass(undefined)
        )
        expect(evaluateGenerated(result.generated, { state: "unknown" })).toBe(
            runtimeClass("unknown")
        )
    })

    it("keeps ordered dynamic variants.class lookup keys collision-safe for delimiter-like values", () => {
        const config = {
            base: { display: "base" },
            variants: {
                a: {
                    "x|b:v:y": { color: "a-long" },
                    x: { color: "a-x" },
                },
                b: {
                    "y|b:m": { background: "b-long" },
                },
            },
        }
        const result = compileTailwindestCall({
            kind: "variants.class",
            span,
            config: { kind: "static", value: config },
            props: {
                kind: "dynamic-variant-props",
                entries: [
                    { axis: "a", expression: "a" },
                    { axis: "b", expression: "b" },
                ],
            },
            extraClass: [],
        })
        const runtimeVariants = runtimeTw.variants(config)
        const runtimeClass = (
            props: Parameters<typeof runtimeVariants.class>[0]
        ) => runtimeVariants.class(props)

        expect(result.exact).toBe(true)
        expect(
            evaluateGenerated(result.generated, {
                a: "x|b:v:y",
                b: undefined,
            })
        ).toBe(runtimeClass({ a: "x|b:v:y" }))
        expect(
            evaluateGenerated(result.generated, { a: "x", b: "y|b:m" })
        ).toBe(runtimeClass({ a: "x", b: "y|b:m" }))
        expect(runtimeClass({ a: "x|b:v:y" })).not.toBe(
            runtimeClass({ a: "x", b: "y|b:m" })
        )
    })

    it("preserves mixed static and dynamic variants.class props in object entry order", () => {
        const config = {
            base: { display: "inline-flex", color: "text-gray-900" },
            variants: {
                intent: {
                    danger: { color: "text-red-700" },
                },
                size: {
                    sm: { padding: "px-2" },
                },
                tone: {
                    quiet: { color: "text-gray-500" },
                },
            },
        }
        const cases = [
            {
                name: "static before dynamic",
                props: {
                    kind: "dynamic-variant-props" as const,
                    staticProps: { size: "sm" },
                    entries: [{ axis: "intent", expression: "intent" }],
                    orderedEntries: [
                        { kind: "static" as const, axis: "size" },
                        {
                            kind: "dynamic" as const,
                            axis: "intent",
                            expression: "intent",
                        },
                    ],
                },
                scope: { intent: "danger" },
                runtimeProps: { size: "sm", intent: "danger" },
            },
            {
                name: "dynamic before static",
                props: {
                    kind: "dynamic-variant-props" as const,
                    staticProps: { tone: "quiet" },
                    entries: [{ axis: "intent", expression: "intent" }],
                    orderedEntries: [
                        {
                            kind: "dynamic" as const,
                            axis: "intent",
                            expression: "intent",
                        },
                        { kind: "static" as const, axis: "tone" },
                    ],
                },
                scope: { intent: "danger" },
                runtimeProps: { intent: "danger", tone: "quiet" },
            },
        ]

        for (const item of cases) {
            const result = compileTailwindestCall({
                kind: "variants.class",
                span,
                config: { kind: "static", value: config },
                props: item.props,
                extraClass: [],
                variantTableLimit: 16,
            })

            expect(result.exact, item.name).toBe(true)
            const runtimeProps = item.runtimeProps as {
                intent?: "danger"
                size?: "sm"
                tone?: "quiet"
            }
            expect(evaluateGenerated(result.generated, item.scope)).toBe(
                runtimeTw.variants(config).class(runtimeProps)
            )
        }
    })

    it("uses the last duplicate dynamic variants.class prop expression", () => {
        const config = {
            variants: {
                size: {
                    sm: { padding: "p-1" },
                    lg: { padding: "p-2" },
                },
            },
        }
        const result = compileTailwindestCall({
            kind: "variants.class",
            span,
            config: { kind: "static", value: config },
            props: {
                kind: "dynamic-variant-props",
                entries: [
                    { axis: "size", expression: "first" },
                    { axis: "size", expression: "second" },
                ],
                orderedEntries: [
                    {
                        kind: "dynamic",
                        axis: "size",
                        expression: "first",
                    },
                    {
                        kind: "dynamic",
                        axis: "size",
                        expression: "second",
                    },
                ],
            },
            extraClass: [],
        })
        const runtimeVariants = runtimeTw.variants(config)

        expect(result.exact).toBe(true)
        for (const first of ["sm", "lg"] as const) {
            for (const second of ["sm", "lg"] as const) {
                expect(
                    evaluateGenerated(result.generated, { first, second })
                ).toBe(runtimeVariants.class({ size: second }))
            }
        }
    })

    it("preserves mixed static and dynamic variants.style props in object entry order", () => {
        const config = {
            base: { display: "inline-flex", color: "text-gray-900" },
            variants: {
                intent: {
                    danger: { color: "text-red-700" },
                },
                size: {
                    sm: { padding: "px-2" },
                },
                tone: {
                    quiet: { color: "text-gray-500" },
                },
            },
        }
        const result = compileTailwindestCall({
            kind: "variants.style",
            span,
            config: { kind: "static", value: config },
            props: {
                kind: "dynamic-variant-props",
                staticProps: { tone: "quiet" },
                entries: [{ axis: "intent", expression: "intent" }],
                orderedEntries: [
                    {
                        kind: "dynamic",
                        axis: "intent",
                        expression: "intent",
                    },
                    { kind: "static", axis: "tone" },
                ],
            },
            extraStyles: [],
            variantTableLimit: 16,
        })

        expect(result.exact).toBe(true)
        expect(
            evaluateGenerated(result.generated, { intent: "danger" })
        ).toEqual(
            runtimeTw
                .variants(config)
                .style({ intent: "danger", tone: "quiet" })
        )
    })

    it("keeps numeric dynamic variant keys addressable while falsy zero is missing", () => {
        const config = {
            base: { display: "block" },
            variants: {
                size: {
                    "0": { padding: "p-0" },
                    "2": { padding: "p-2" },
                },
            },
        }
        const result = compileTailwindestCall({
            kind: "variants.class",
            span,
            config: { kind: "static", value: config },
            props: {
                kind: "dynamic-variant-props",
                staticProps: {},
                entries: [{ axis: "size", expression: "size" }],
            },
            extraClass: [],
        })

        expect(result.exact).toBe(true)
        expect(evaluateGenerated(result.generated, { size: 2 })).toBe(
            runtimeTw.variants(config).class({ size: 2 } as never)
        )
        expect(evaluateGenerated(result.generated, { size: 0 })).toBe(
            runtimeTw.variants(config).class({ size: 0 } as never)
        )
        expect(evaluateGenerated(result.generated, { size: "0" })).toBe(
            runtimeTw.variants(config).class({ size: "0" })
        )
    })

    it("compiles tw.variants(config).style(props) mixed additive and component graph with missing props", () => {
        const config = {
            base: {
                display: "inline-flex",
                color: "text-gray-900",
                padding: "px-1",
            },
            variants: {
                intent: {
                    primary: { color: "text-blue-700" },
                    danger: { color: "text-red-700" },
                },
                emphasis: {
                    weak: { color: "text-gray-500" },
                    strong: { color: "text-black" },
                },
                size: {
                    sm: { padding: "px-2" },
                    lg: { padding: "px-4" },
                },
            },
        }
        const result = compileTailwindestCall({
            kind: "variants.style",
            span,
            config: { kind: "static", value: config },
            props: {
                kind: "dynamic-variant-props",
                entries: [
                    { axis: "intent", expression: "intent" },
                    { axis: "emphasis", expression: "emphasis" },
                    { axis: "size", expression: "size" },
                ],
            },
            extraStyles: [],
            variantTableLimit: 32,
        })

        expect(result.exact).toBe(true)
        for (const intent of ["primary", undefined]) {
            for (const emphasis of ["weak", undefined]) {
                for (const size of ["sm", undefined]) {
                    const props = Object.fromEntries(
                        Object.entries({ intent, emphasis, size }).filter(
                            ([, value]) => value !== undefined
                        )
                    )
                    expect(
                        evaluateGenerated(result.generated, {
                            intent,
                            emphasis,
                            size,
                        })
                    ).toEqual(runtimeTw.variants(config).style(props))
                }
            }
        }
    })

    it("compiles tw.variants(config).style(props) nested deep merge without losing sibling paths", () => {
        const config = {
            base: {
                hover: {
                    color: "hover:text-gray-900",
                },
            },
            variants: {
                tone: {
                    info: {
                        hover: {
                            background: "hover:bg-blue-50",
                        },
                    },
                },
            },
        }
        const result = compileTailwindestCall({
            kind: "variants.style",
            span,
            config: { kind: "static", value: config },
            props: {
                kind: "dynamic-variant-props",
                entries: [{ axis: "tone", expression: "tone" }],
            },
            extraStyles: [],
        })

        expect(result.exact).toBe(true)
        expect(evaluateGenerated(result.generated, { tone: "info" })).toEqual(
            runtimeTw.variants(config).style({ tone: "info" })
        )
        expect(
            evaluateGenerated(result.generated, { tone: undefined })
        ).toEqual(runtimeTw.variants(config).style({}))
    })

    it("evaluates dynamic variants.style prop expressions once per axis", () => {
        const config = {
            base: {
                display: "flex",
                color: "text-gray-900",
                padding: "px-1",
            },
            variants: {
                size: {
                    sm: {
                        color: "text-red-700",
                        padding: "px-2",
                    },
                },
            },
        }
        const result = compileTailwindestCall({
            kind: "variants.style",
            span,
            config: { kind: "static", value: config },
            props: {
                kind: "dynamic-variant-props",
                entries: [{ axis: "size", expression: "nextSize()" }],
            },
            extraStyles: [],
        })
        let calls = 0
        const nextSize = () => {
            calls += 1
            return "sm"
        }

        expect(result.exact).toBe(true)
        expect(evaluateGenerated(result.generated, { nextSize })).toEqual(
            runtimeTw.variants(config).style({ size: "sm" })
        )
        expect(calls).toBe(1)
    })

    it("preserves base fallback for unknown dynamic additive variant values", () => {
        const config = {
            base: { padding: "px-1", display: "flex" },
            variants: {
                size: {
                    sm: { padding: "px-2" },
                },
            },
        }
        const result = compileTailwindestCall({
            kind: "variants.class",
            span,
            config: { kind: "static", value: config },
            props: {
                kind: "dynamic-variant-props",
                entries: [{ axis: "size", expression: "size" }],
            },
            extraClass: [],
        })

        expect(result.exact).toBe(true)
        expect(evaluateGenerated(result.generated, { size: "xl" })).toBe(
            runtimeTw.variants(config).class({ size: "xl" } as never)
        )
    })

    it("preserves ordered variant fallback for unknown dynamic values", () => {
        const config = {
            base: { padding: "px-1", display: "flex" },
            variants: {
                intent: {
                    danger: { color: "text-red-700" },
                },
                size: {
                    sm: { padding: "px-2" },
                },
            },
        }
        const props = {
            kind: "dynamic-variant-props" as const,
            staticProps: { intent: "danger" },
            entries: [{ axis: "size", expression: "size" }],
            orderedEntries: [
                { kind: "static" as const, axis: "intent" },
                {
                    kind: "dynamic" as const,
                    axis: "size",
                    expression: "size",
                },
            ],
        }
        const classResult = compileTailwindestCall({
            kind: "variants.class",
            span,
            config: { kind: "static", value: config },
            props,
            extraClass: [],
            variantTableLimit: 16,
        })
        const styleResult = compileTailwindestCall({
            kind: "variants.style",
            span,
            config: { kind: "static", value: config },
            props,
            extraStyles: [],
            variantTableLimit: 16,
        })

        expect(classResult.exact).toBe(true)
        expect(styleResult.exact).toBe(true)
        expect(evaluateGenerated(classResult.generated, { size: "xl" })).toBe(
            runtimeTw
                .variants(config)
                .class({ intent: "danger", size: "xl" } as never)
        )
        expect(
            evaluateGenerated(styleResult.generated, { size: "xl" })
        ).toEqual(
            runtimeTw
                .variants(config)
                .style({ intent: "danger", size: "xl" } as never)
        )
    })

    it("compiles tw.variants(config).compose(...styles) base merge semantics", () => {
        const result = compileTailwindestCall({
            kind: "variants.compose",
            span,
            config: { kind: "static", value: variantsConfig },
            styles: [{ kind: "static", value: extraStyle }],
        })

        expect(result.exact).toBe(true)
        expect(result.replacement).toBeUndefined()
        expect(evaluateExpression(result.generated.expression)).toEqual(
            runtimeTw
                .variants(variantsConfig)
                .compose(extraStyle)
                .style({ intent: "primary" })
        )
    })

    it("compiles tw.join(...classList) static output and candidates", () => {
        const classList: Array<CompileValue<StaticClassValue>> = [
            { kind: "static", value: "bg-white" },
            { kind: "static", value: ["px-2", { "hover:bg-gray-50": true }] },
            { kind: "static", value: false },
        ]
        const result = compileTailwindestCall({
            kind: "join",
            span,
            classList: [...classList],
        })

        expect(result.exact).toBe(true)
        expect(evaluateExpression(result.generated.expression)).toBe(
            runtimeTw.join(
                "bg-white",
                ["px-2", { "hover:bg-gray-50": true }],
                false
            )
        )
        expectContainsAll(result.candidates, [
            "bg-white",
            "px-2",
            "hover:bg-gray-50",
        ])
    })

    it("compiles tw.def(classList, ...styleList) static output and candidates", () => {
        const classList = ["bg-white", ["rounded", { shadow: true }]]
        const result = compileTailwindestCall({
            kind: "def",
            span,
            classList: { kind: "static", value: classList },
            styles: [
                { kind: "static", value: baseStyle },
                { kind: "static", value: extraStyle },
            ],
        })

        expect(result.exact).toBe(true)
        expect(evaluateExpression(result.generated.expression)).toBe(
            runtimeTw.def(classList, baseStyle, extraStyle)
        )
        expectContainsAll(result.candidates, [
            "bg-white",
            "rounded",
            "shadow",
            "text-red-500",
            "m-2",
        ])
    })

    it("compiles tw.mergeProps(...styles) static output and candidates", () => {
        const result = compileTailwindestCall({
            kind: "mergeProps",
            span,
            styles: [
                { kind: "static", value: baseStyle },
                { kind: "static", value: extraStyle },
            ],
        })

        expect(result.exact).toBe(true)
        expect(evaluateExpression(result.generated.expression)).toBe(
            runtimeTw.mergeProps(baseStyle, extraStyle)
        )
        expectContainsAll(result.candidates, ["text-red-500", "m-2"])
    })

    it.each([
        {
            name: "style.class",
            input: {
                kind: "style.class",
                span,
                style: { kind: "static", value: baseStyle },
                extraClass: [{ kind: "static", value: "px-4" }],
                merger: { kind: "unsupported", reason: "runtime merger" },
            },
        },
        {
            name: "toggle.class",
            input: {
                kind: "toggle.class",
                span,
                config: { kind: "static", value: toggleConfig },
                condition: { kind: "static", value: true },
                extraClass: [{ kind: "static", value: "px-4" }],
                merger: { kind: "unsupported", reason: "runtime merger" },
            },
        },
        {
            name: "rotary.class",
            input: {
                kind: "rotary.class",
                span,
                config: { kind: "static", value: rotaryConfig },
                key: { kind: "static", value: "sm" },
                extraClass: [{ kind: "static", value: "px-4" }],
                merger: { kind: "unsupported", reason: "runtime merger" },
            },
        },
        {
            name: "variants.class",
            input: {
                kind: "variants.class",
                span,
                config: { kind: "static", value: variantsConfig },
                props: { kind: "static", value: { intent: "primary" } },
                extraClass: [{ kind: "static", value: "px-4" }],
                merger: { kind: "unsupported", reason: "runtime merger" },
            },
        },
        {
            name: "join",
            input: {
                kind: "join",
                span,
                classList: [{ kind: "static", value: "px-2 px-4" }],
                merger: { kind: "unsupported", reason: "runtime merger" },
            },
        },
        {
            name: "def",
            input: {
                kind: "def",
                span,
                classList: { kind: "static", value: ["px-2"] },
                styles: [{ kind: "static", value: extraStyle }],
                merger: { kind: "unsupported", reason: "runtime merger" },
            },
        },
        {
            name: "mergeProps",
            input: {
                kind: "mergeProps",
                span,
                styles: [{ kind: "static", value: extraStyle }],
                merger: { kind: "unsupported", reason: "runtime merger" },
            },
        },
    ])("falls back for $name when a runtime merger is present", ({ input }) => {
        const result = compileTailwindestCall(input as ApiCompileInput, {
            variantResolver: commonVariantResolver,
        })

        expect(result.exact).toBe(false)
        expect(result.replacement).toBeUndefined()
        expect(result.diagnostics).toEqual([
            expect.objectContaining({ code: "UNSUPPORTED_MERGER" }),
        ])
    })

    it.each([
        {
            policyName: "known",
            policy: {
                kind: "known" as const,
                name: "tailwind-merge" as const,
                configHash: "sha256:test",
            },
        },
        {
            policyName: "custom",
            policy: {
                kind: "custom" as const,
                evaluateAtBuildTime: true as const,
                moduleId: "./merger",
                exportName: "merge",
            },
        },
    ])(
        "falls back for every class-producing API with a $policyName merger policy",
        ({ policy }) => {
            const inputs = [
                {
                    kind: "style.class",
                    span,
                    style: { kind: "static", value: baseStyle },
                    extraClass: [{ kind: "static", value: "px-4" }],
                    merger: policy,
                },
                {
                    kind: "toggle.class",
                    span,
                    config: { kind: "static", value: toggleConfig },
                    condition: { kind: "static", value: true },
                    extraClass: [{ kind: "static", value: "px-4" }],
                    merger: policy,
                },
                {
                    kind: "rotary.class",
                    span,
                    config: { kind: "static", value: rotaryConfig },
                    key: { kind: "static", value: "sm" },
                    extraClass: [{ kind: "static", value: "px-4" }],
                    merger: policy,
                },
                {
                    kind: "variants.class",
                    span,
                    config: { kind: "static", value: variantsConfig },
                    props: { kind: "static", value: { intent: "primary" } },
                    extraClass: [{ kind: "static", value: "px-4" }],
                    merger: policy,
                },
                {
                    kind: "join",
                    span,
                    classList: [{ kind: "static", value: "px-2 px-4" }],
                    merger: policy,
                },
                {
                    kind: "def",
                    span,
                    classList: { kind: "static", value: ["px-2"] },
                    styles: [{ kind: "static", value: extraStyle }],
                    merger: policy,
                },
                {
                    kind: "mergeProps",
                    span,
                    styles: [{ kind: "static", value: extraStyle }],
                    merger: policy,
                },
            ]

            for (const input of inputs) {
                const result = compileTailwindestCall(
                    input as ApiCompileInput,
                    { variantResolver: commonVariantResolver }
                )

                expect(result.exact, input.kind).toBe(false)
                expect(result.replacement, input.kind).toBeUndefined()
                expect(result.diagnostics, input.kind).toEqual([
                    expect.objectContaining({
                        code: "NON_DETERMINISTIC_MERGER",
                    }),
                ])
            }
        }
    )

    it("compiles tw.mergeRecord(...styles) static object output and candidates", () => {
        const result = compileTailwindestCall({
            kind: "mergeRecord",
            span,
            styles: [
                { kind: "static", value: baseStyle },
                { kind: "static", value: extraStyle },
            ],
        })

        expect(result.exact).toBe(true)
        expect(evaluateExpression(result.generated.expression)).toEqual(
            runtimeTw.mergeRecord(baseStyle, extraStyle)
        )
        expectContainsAll(result.candidates, ["text-red-500", "m-2"])
    })

    it.each(unsupportedCases)(
        "$kind unsupported input emits fallback diagnostics and no replacement",
        (input) => {
            const result = compileTailwindestCall(input)

            expect(result.exact).toBe(false)
            expect(result.replacement).toBeUndefined()
            expect(result.diagnostics.length).toBeGreaterThan(0)
            expect(result.diagnostics[0]?.code).toBe(
                "UNSUPPORTED_DYNAMIC_VALUE"
            )
        }
    )

    it("falls back instead of throwing for non-array def classList values", () => {
        const result = compileTailwindestCall({
            kind: "def",
            span,
            classList: {
                kind: "static",
                value: { "px-2": true } as never,
            },
            styles: [
                {
                    kind: "static",
                    value: { color: "text-red-500" },
                },
            ],
        })

        expect(result.exact).toBe(false)
        expect(result.replacement).toBeUndefined()
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "UNSUPPORTED_DYNAMIC_VALUE",
            }),
        ])
    })

    it("variant overflow fallback keeps every possible candidate in the replacement plan manifest", () => {
        const result = compileTailwindestCall({
            kind: "variants.class",
            span,
            config: {
                kind: "static",
                value: {
                    base: variantsConfig.base,
                    variants: {
                        intent: variantsConfig.variants.intent,
                        emphasis: {
                            weak: { color: "text-gray-500" },
                            strong: { color: "text-black" },
                        },
                    },
                },
            },
            props: {
                kind: "dynamic-variant-props",
                entries: [
                    { axis: "intent", expression: "intent" },
                    { axis: "emphasis", expression: "emphasis" },
                ],
            },
            extraClass: [],
            variantTableLimit: 1,
        })

        expect(result.exact).toBe(false)
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "VARIANT_TABLE_LIMIT_EXCEEDED",
                severity: "warning",
            }),
        ])
        expectContainsAll(result.candidates, [
            "text-blue-700",
            "bg-blue-50",
            "text-red-700",
            "bg-red-50",
            "text-gray-500",
            "text-black",
        ])
    })

    it("candidate collection covers every public API branch", () => {
        expectContainsAll(
            candidatesOf({
                kind: "toggle.class",
                span,
                config: { kind: "static", value: toggleConfig },
                condition: { kind: "static", value: true },
                extraClass: [],
            }),
            ["text-green-600", "text-red-600"]
        )
        expectContainsAll(
            candidatesOf({
                kind: "rotary.class",
                span,
                config: { kind: "static", value: rotaryConfig },
                key: { kind: "static", value: "base" },
                extraClass: [],
            }),
            ["p-2", "p-4", "p-8"]
        )
        expectContainsAll(
            candidatesOf({
                kind: "variants.class",
                span,
                config: { kind: "static", value: variantsConfig },
                props: { kind: "static", value: { intent: "primary" } },
                extraClass: [],
            }),
            ["text-blue-700", "text-red-700", "px-2", "px-4", "border-current"]
        )
    })
})
