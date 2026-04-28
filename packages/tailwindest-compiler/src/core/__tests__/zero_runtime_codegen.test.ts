import { describe, expect, it } from "vitest"
import { compileTailwindestCall } from "../api_compile"
import { emitReadonlyConst, emitRuntimeFreeModule } from "../codegen"

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
