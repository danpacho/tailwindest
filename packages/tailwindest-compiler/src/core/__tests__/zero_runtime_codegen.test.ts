import { describe, expect, it } from "vitest"
import { compileTailwindestCall } from "../api_compile"
import {
    createGeneratedSymbol,
    emitReadonlyConst,
    emitRuntimeFreeModule,
    resetCodegenSymbolCounter,
} from "../codegen"
import { createTools } from "../../../../tailwindest/src/tools/create_tools"

const span = {
    fileName: "fixture.ts",
    start: 0,
    end: 10,
}

const forbiddenRuntimeTokens = [
    "createTools",
    "PrimitiveStyler",
    "ToggleStyler",
    "RotaryStyler",
    "VariantsStyler",
]

function expectZeroRuntime(code: string) {
    for (const token of forbiddenRuntimeTokens) {
        expect(code).not.toContain(token)
    }
}

const runtimeTw = createTools()

describe("zero-runtime codegen", () => {
    it("does not emit runtime styler imports or calls for fully compiled expressions", () => {
        const result = compileTailwindestCall({
            kind: "rotary.class",
            span,
            config: {
                kind: "static",
                value: {
                    base: { display: "grid" },
                    variants: {
                        sm: { padding: "p-2" },
                        lg: { padding: "p-4" },
                    },
                },
            },
            key: { kind: "dynamic", expression: "size" },
            extraClass: [{ kind: "static", value: "rounded" }],
        })

        const moduleCode = emitRuntimeFreeModule(result.generated)

        expect(result.exact).toBe(true)
        expectZeroRuntime(moduleCode)
        expect(moduleCode).toContain("const __tw")
        expect(moduleCode).toContain("as const")
        expect(moduleCode).toContain("export const compiled =")
    })

    it("emits tree-shakeable readonly lookup constants with no side effects", () => {
        const declaration = emitReadonlyConst("__tw_lookup", {
            base: "grid",
            sm: "grid p-2",
        })

        expect(declaration).toBe(
            'const __tw_lookup = {"base":"grid","sm":"grid p-2"} as const'
        )
        expectZeroRuntime(declaration)
        expect(declaration).not.toContain("new ")
        expect(declaration).not.toContain("()")
    })

    it("sanitizes generated symbols for identifier-unsafe prefixes", () => {
        resetCodegenSymbolCounter()

        for (const prefix of ["data-state", "aria-checked", "1size"]) {
            const symbol = createGeneratedSymbol(prefix)

            expect(symbol).toMatch(/^[$A-Z_a-z][$\w]*$/)
            expect(
                new Function(`const ${symbol} = 1; return ${symbol};`)()
            ).toBe(1)
        }
    })

    it("emits valid lookup declarations for identifier-unsafe variant axes", () => {
        const config = {
            base: { display: "inline-flex" },
            variants: {
                "data-state": {
                    open: { color: "text-green-700" },
                },
                "aria-checked": {
                    true: { background: "bg-green-50" },
                },
                "1size": {
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
                entries: [
                    { axis: "data-state", expression: "state" },
                    { axis: "aria-checked", expression: "checked" },
                    { axis: "1size", expression: "size" },
                ],
            },
            extraClass: [],
            variantTableLimit: 16,
        })

        expect(result.exact).toBe(true)
        expect(
            new Function(
                "state",
                "checked",
                "size",
                `${result.generated.declarations.join("\n").replaceAll(" as const", "")}\nreturn (${result.generated.expression});`
            )("open", "true", 2)
        ).toBe(
            runtimeTw.variants(config).class({
                "data-state": "open",
                "aria-checked": "true",
                "1size": 2,
            } as never)
        )
    })

    it("fully compiled variants use generated lookup symbols only", () => {
        const result = compileTailwindestCall({
            kind: "variants.class",
            span,
            config: {
                kind: "static",
                value: {
                    base: { display: "inline-flex" },
                    variants: {
                        intent: {
                            primary: { color: "text-blue-700" },
                            danger: { color: "text-red-700" },
                        },
                        size: {
                            sm: { padding: "px-2" },
                            lg: { padding: "px-4" },
                        },
                    },
                },
            },
            props: {
                kind: "dynamic-variant-props",
                staticProps: {},
                entries: [
                    { axis: "intent", expression: "intent" },
                    { axis: "size", expression: "size" },
                ],
            },
            extraClass: [],
            variantTableLimit: 16,
        })

        const moduleCode = emitRuntimeFreeModule(result.generated)

        expect(result.exact).toBe(true)
        expectZeroRuntime(moduleCode)
        expect(moduleCode).toMatch(/const __tw_[a-z_]+_\d+ = .* as const/)
        expect(moduleCode).not.toContain("import ")
        expect(moduleCode).not.toContain("require(")
    })
})
