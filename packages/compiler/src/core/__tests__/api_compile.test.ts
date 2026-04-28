import { describe, expect, it } from "vitest"
import { createTools } from "../../../../tailwindest/src/tools/create_tools"
import { compileTailwindestCall } from "../api_compile"
import type { ApiCompileInput, CompileValue } from "../api_compile"
import type { StaticClassValue } from "../static_value"

const runtimeTw = createTools()

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
    it("compiles tw.style(obj).class(...extra) static output and candidates", () => {
        const result = compileTailwindestCall({
            kind: "style.class",
            span,
            style: { kind: "static", value: baseStyle },
            extraClass: [{ kind: "static", value: "rounded shadow-sm" }],
        })

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

    it("loose overflow fallback keeps every possible candidate in the replacement plan manifest", () => {
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
            mode: "loose",
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
