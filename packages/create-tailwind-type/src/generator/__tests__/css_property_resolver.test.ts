import path from "node:path"
import { describe, expect, it } from "vitest"
import { TailwindTypeGenerator } from "../generator"
import { TailwindCompiler } from "tailwindest-tailwind-internal"
import { CSSAnalyzer } from "../css_analyzer"
import { TypeSchemaGenerator } from "../../type_tools"
import { CSSPropertyResolver } from "../css_property_resolver"

describe("CSSPropertyResolver", () => {
    // Reuse same deps as generator.test.ts
    const compiler = new TailwindCompiler({
        cssRoot: `${__dirname}/__mocks__/tailwind.css`,
        base: path.resolve(
            __dirname,
            "../../../../../node_modules/tailwindcss"
        ),
    })
    const cssAnalyzer = new CSSAnalyzer()
    const schemaGenerator = new TypeSchemaGenerator()

    const generator = new TailwindTypeGenerator({
        compiler,
        cssAnalyzer,
        generator: schemaGenerator,
        storeRoot: `${__dirname}/__mocks__/store/docs.json`,
    }).setGenOptions({
        useDocs: true,
        useExactVariants: false,
        useArbitraryValue: false,
        useSoftVariants: true,
        useStringKindVariantsOnly: false,
        useOptionalProperty: false,
        disableVariants: true,
    })

    let resolver: CSSPropertyResolver
    const emptyColorVarSet = new Set<string>()

    it("should initialize generator and create resolver", async () => {
        await generator.init()
        resolver = generator.createPropertyResolver()
        expect(resolver).toBeDefined()
        expect(resolver).toBeInstanceOf(CSSPropertyResolver)
    })

    it("should resolve basic mapping: flex → display", () => {
        const result = resolver.resolve("flex")
        // "flex" maps to the "display" property
        expect(result).toContain("display")
    })

    it("should resolve bg-* → backgroundColor", () => {
        const result = resolver.resolve("bg-red-500")
        // bg-red-500 should map to backgroundColor (might be in array)
        if (Array.isArray(result)) {
            expect(
                result.some(
                    (r) => r.includes("background") || r.includes("Background")
                )
            ).toBe(true)
        } else {
            expect(result).toBeTruthy()
        }
    })

    it("should resolve size-* → [width, height] (multiple mapping)", () => {
        const result = resolver.resolve("size-4")
        // size-4 maps to both width and height via exceptionalRules
        expect(result).toEqual(["width", "height"])
    })

    it("should resolve bg-conic-* → backgroundImage (via alias matching)", () => {
        const result = resolver.resolve("bg-conic-45")
        // bg-conic-45 goes through the normal alias matching path (not exceptional rules)
        // because exceptionRuleToken splits to "bg", not "bg-conic"
        if (Array.isArray(result)) {
            expect(result).toContain("backgroundImage")
        } else {
            expect(result).toBe("backgroundImage")
        }
    })

    it("should resolve font-sans → fontFamily (exceptionalRules + tester)", () => {
        const result = resolver.resolve("font-sans")
        expect(result).toBe("fontFamily")
    })

    it("should resolve drop-shadow-* → filter (exceptionalRules)", () => {
        const result = resolver.resolve("drop-shadow-md")
        expect(result).toBe("filter")
    })

    it("should return null for totally unknown class", () => {
        const result = resolver.resolve("totally-unknown-class-xyz")
        expect(result).toBeNull()
    })

    describe("resolveUnambiguous", () => {
        it("should return single string for size-4", () => {
            const result = resolver.resolveUnambiguous("size-4")
            // size-4 → ["width", "height"] → first = "width"
            expect(typeof result).toBe("string")
            expect(result).toBe("width")
        })

        it("should return string for simple mapping", () => {
            const result = resolver.resolveUnambiguous("flex")
            expect(typeof result).toBe("string")
        })

        it("should return null for unknown class", () => {
            const result = resolver.resolveUnambiguous(
                "totally-unknown-class-xyz"
            )
            expect(result).toBeNull()
        })
    })

    describe("external instantiation", () => {
        it("should be instantiable independently from generator", () => {
            // Verify CSSPropertyResolver can be instantiated outside generator.ts
            const manualResolver = new CSSPropertyResolver({
                candidatesToCss: (candidates) =>
                    generator.ds.candidatesToCss(candidates),
                parseStyleBlock: (css) => cssAnalyzer.parseStyleBlock(css),
                typeAliasMap: generator.typeAliasMap,
                variants: generator.variants,
                colorVariableSet: new Set<string>(),
            })
            expect(manualResolver).toBeInstanceOf(CSSPropertyResolver)

            const result = manualResolver.resolve("flex")
            expect(result).toContain("display")
        })
    })
})
