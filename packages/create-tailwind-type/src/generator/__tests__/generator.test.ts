import path from "node:path"
import { readFile, rm } from "node:fs/promises"
import { describe, expect, it } from "vitest"
import { TailwindTypeGenerator } from "../generator"
import { TailwindCompiler } from "tailwindest-tailwind-internal"
import { CSSAnalyzer } from "../css_analyzer"
import { TypeSchemaGenerator } from "../../type_tools"

describe("TypeGenerator", () => {
    // dependencies
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

    it("should init", async () => {
        await generator.init()

        expect(generator.ds).toBeDefined()
        expect(generator.classList.length).toBeGreaterThan(0)
        expect(generator.variantsEntry.length).toBeGreaterThan(0)
        expect(generator.variants.length).toBeGreaterThan(0)
    })

    it("should extract all the possible variants", () => {
        expect(generator.variants).toMatchInlineSnapshot(`
          [
            "*",
            "**",
            "not-first",
            "not-last",
            "not-only",
            "not-odd",
            "not-even",
            "not-first-of-type",
            "not-last-of-type",
            "not-only-of-type",
            "not-visited",
            "not-target",
            "not-open",
            "not-default",
            "not-checked",
            "not-indeterminate",
            "not-placeholder-shown",
            "not-autofill",
            "not-optional",
            "not-required",
            "not-valid",
            "not-invalid",
            "not-user-valid",
            "not-user-invalid",
            "not-in-range",
            "not-out-of-range",
            "not-read-only",
            "not-empty",
            "not-focus-within",
            "not-hover",
            "not-focus",
            "not-focus-visible",
            "not-active",
            "not-enabled",
            "not-disabled",
            "not-inert",
            "not-in",
            "not-has",
            "not-aria",
            "not-data",
            "not-nth",
            "not-nth-last",
            "not-nth-of-type",
            "not-nth-last-of-type",
            "not-supports",
            "not-motion-safe",
            "not-motion-reduce",
            "not-contrast-more",
            "not-contrast-less",
            "not-max",
            "not-sm",
            "not-md",
            "not-lg",
            "not-xl",
            "not-2xl",
            "not-xs",
            "not-3xl",
            "not-4xl",
            "not-min",
            "not-@max",
            "not-@",
            "not-@min",
            "not-portrait",
            "not-landscape",
            "not-ltr",
            "not-rtl",
            "not-dark",
            "not-print",
            "not-forced-colors",
            "not-inverted-colors",
            "not-pointer-none",
            "not-pointer-coarse",
            "not-pointer-fine",
            "not-any-pointer-none",
            "not-any-pointer-coarse",
            "not-any-pointer-fine",
            "not-noscript",
            "group-first",
            "group-last",
            "group-only",
            "group-odd",
            "group-even",
            "group-first-of-type",
            "group-last-of-type",
            "group-only-of-type",
            "group-visited",
            "group-target",
            "group-open",
            "group-default",
            "group-checked",
            "group-indeterminate",
            "group-placeholder-shown",
            "group-autofill",
            "group-optional",
            "group-required",
            "group-valid",
            "group-invalid",
            "group-user-valid",
            "group-user-invalid",
            "group-in-range",
            "group-out-of-range",
            "group-read-only",
            "group-empty",
            "group-focus-within",
            "group-hover",
            "group-focus",
            "group-focus-visible",
            "group-active",
            "group-enabled",
            "group-disabled",
            "group-inert",
            "group-in",
            "group-has",
            "group-aria",
            "group-data",
            "group-nth",
            "group-nth-last",
            "group-nth-of-type",
            "group-nth-last-of-type",
            "group-ltr",
            "group-rtl",
            "group-dark",
            "peer-first",
            "peer-last",
            "peer-only",
            "peer-odd",
            "peer-even",
            "peer-first-of-type",
            "peer-last-of-type",
            "peer-only-of-type",
            "peer-visited",
            "peer-target",
            "peer-open",
            "peer-default",
            "peer-checked",
            "peer-indeterminate",
            "peer-placeholder-shown",
            "peer-autofill",
            "peer-optional",
            "peer-required",
            "peer-valid",
            "peer-invalid",
            "peer-user-valid",
            "peer-user-invalid",
            "peer-in-range",
            "peer-out-of-range",
            "peer-read-only",
            "peer-empty",
            "peer-focus-within",
            "peer-hover",
            "peer-focus",
            "peer-focus-visible",
            "peer-active",
            "peer-enabled",
            "peer-disabled",
            "peer-inert",
            "peer-in",
            "peer-has",
            "peer-aria",
            "peer-data",
            "peer-nth",
            "peer-nth-last",
            "peer-nth-of-type",
            "peer-nth-last-of-type",
            "peer-ltr",
            "peer-rtl",
            "peer-dark",
            "first-letter",
            "first-line",
            "marker",
            "selection",
            "file",
            "placeholder",
            "backdrop",
            "details-content",
            "before",
            "after",
            "first",
            "last",
            "only",
            "odd",
            "even",
            "first-of-type",
            "last-of-type",
            "only-of-type",
            "visited",
            "target",
            "open",
            "default",
            "checked",
            "indeterminate",
            "placeholder-shown",
            "autofill",
            "optional",
            "required",
            "valid",
            "invalid",
            "user-valid",
            "user-invalid",
            "in-range",
            "out-of-range",
            "read-only",
            "empty",
            "focus-within",
            "hover",
            "focus",
            "focus-visible",
            "active",
            "enabled",
            "disabled",
            "inert",
            "in-first",
            "in-last",
            "in-only",
            "in-odd",
            "in-even",
            "in-first-of-type",
            "in-last-of-type",
            "in-only-of-type",
            "in-visited",
            "in-target",
            "in-open",
            "in-default",
            "in-checked",
            "in-indeterminate",
            "in-placeholder-shown",
            "in-autofill",
            "in-optional",
            "in-required",
            "in-valid",
            "in-invalid",
            "in-user-valid",
            "in-user-invalid",
            "in-in-range",
            "in-out-of-range",
            "in-read-only",
            "in-empty",
            "in-focus-within",
            "in-hover",
            "in-focus",
            "in-focus-visible",
            "in-active",
            "in-enabled",
            "in-disabled",
            "in-inert",
            "in-in",
            "in-has",
            "in-aria",
            "in-data",
            "in-nth",
            "in-nth-last",
            "in-nth-of-type",
            "in-nth-last-of-type",
            "in-ltr",
            "in-rtl",
            "in-dark",
            "has-first",
            "has-last",
            "has-only",
            "has-odd",
            "has-even",
            "has-first-of-type",
            "has-last-of-type",
            "has-only-of-type",
            "has-visited",
            "has-target",
            "has-open",
            "has-default",
            "has-checked",
            "has-indeterminate",
            "has-placeholder-shown",
            "has-autofill",
            "has-optional",
            "has-required",
            "has-valid",
            "has-invalid",
            "has-user-valid",
            "has-user-invalid",
            "has-in-range",
            "has-out-of-range",
            "has-read-only",
            "has-empty",
            "has-focus-within",
            "has-hover",
            "has-focus",
            "has-focus-visible",
            "has-active",
            "has-enabled",
            "has-disabled",
            "has-inert",
            "has-in",
            "has-has",
            "has-aria",
            "has-data",
            "has-nth",
            "has-nth-last",
            "has-nth-of-type",
            "has-nth-last-of-type",
            "has-ltr",
            "has-rtl",
            "has-dark",
            "aria-busy",
            "aria-checked",
            "aria-disabled",
            "aria-expanded",
            "aria-hidden",
            "aria-pressed",
            "aria-readonly",
            "aria-required",
            "aria-selected",
            "data",
            "nth",
            "nth-last",
            "nth-of-type",
            "nth-last-of-type",
            "supports",
            "motion-safe",
            "motion-reduce",
            "contrast-more",
            "contrast-less",
            "max-sm",
            "max-md",
            "max-lg",
            "max-xl",
            "max-2xl",
            "max-xs",
            "max-3xl",
            "max-4xl",
            "sm",
            "md",
            "lg",
            "xl",
            "2xl",
            "xs",
            "3xl",
            "4xl",
            "min-sm",
            "min-md",
            "min-lg",
            "min-xl",
            "min-2xl",
            "min-xs",
            "min-3xl",
            "min-4xl",
            "@max-3xs",
            "@max-2xs",
            "@max-xs",
            "@max-sm",
            "@max-md",
            "@max-lg",
            "@max-xl",
            "@max-2xl",
            "@max-3xl",
            "@max-4xl",
            "@max-5xl",
            "@max-6xl",
            "@max-7xl",
            "@3xs",
            "@2xs",
            "@xs",
            "@sm",
            "@md",
            "@lg",
            "@xl",
            "@2xl",
            "@3xl",
            "@4xl",
            "@5xl",
            "@6xl",
            "@7xl",
            "@min-3xs",
            "@min-2xs",
            "@min-xs",
            "@min-sm",
            "@min-md",
            "@min-lg",
            "@min-xl",
            "@min-2xl",
            "@min-3xl",
            "@min-4xl",
            "@min-5xl",
            "@min-6xl",
            "@min-7xl",
            "portrait",
            "landscape",
            "ltr",
            "rtl",
            "dark",
            "starting",
            "print",
            "forced-colors",
            "inverted-colors",
            "pointer-none",
            "pointer-coarse",
            "pointer-fine",
            "any-pointer-none",
            "any-pointer-coarse",
            "any-pointer-fine",
            "noscript",
          ]
        `)
    })

    it("emits TailwindNestGroups as a pure type from shared variant extraction", async () => {
        const typeSource = await (
            generator as unknown as {
                generateType(input: {
                    globalReference: { color: string[] }
                    optimizationList: never[]
                }): Promise<string>
            }
        ).generateType({
            globalReference: { color: ["red-500"] },
            optimizationList: [],
        })

        expect(typeSource).not.toContain("export const tailwindNestGroups")
        expect(typeSource).toContain("export type TailwindNestGroups =")
        expect(typeSource.indexOf("group-hover")).toBeGreaterThan(
            typeSource.indexOf("export type TailwindNestGroups")
        )
    })

    it("should build types", async () => {
        const tailwindRoot = `${__dirname}/__mocks__/dist/tailwind.ts`
        const tailwindLiteralRoot = `${__dirname}/__mocks__/dist/tailwind_literal.ts`

        await rm(tailwindLiteralRoot, { force: true })

        await generator.buildTypes({
            tailwind: tailwindRoot,
        })

        const tailwindLiteral = await readFile(tailwindLiteralRoot, "utf-8")
        const tailwind = await readFile(tailwindRoot, "utf-8")

        expect(tailwindLiteral).toContain("export type TailwindLiteral =")
        expect(tailwindLiteral).toContain('| "bg-red-500"')
        expect(tailwindLiteral).toContain('| "text-red-500"')
        expect(tailwind).not.toContain("${string}/${Variants")
        expect(tailwind).not.toContain("& {}")
    })

    it("does not emit arbitrary value or slash modifier patterns by default", async () => {
        const defaultGenerator = new TailwindTypeGenerator({
            compiler,
            cssAnalyzer,
            generator: schemaGenerator,
            storeRoot: `${__dirname}/__mocks__/store/docs.json`,
        })
        const tailwindRoot = `${__dirname}/__mocks__/dist/default_tailwind.ts`
        const tailwindLiteralRoot = `${__dirname}/__mocks__/dist/default_tailwind_literal.ts`

        await rm(tailwindRoot, { force: true })
        await rm(tailwindLiteralRoot, { force: true })

        try {
            await defaultGenerator.buildTypes({
                tailwind: tailwindRoot,
            })

            const tailwind = await readFile(tailwindRoot, "utf-8")

            expect(tailwind).not.toContain("Arbitrary support")
            expect(tailwind).not.toContain("[${string}]")
            expect(tailwind).not.toContain("(${string})")
            expect(tailwind).not.toContain("${string}/${Variants")
            expect(tailwind).not.toContain("& {}")
        } finally {
            await rm(tailwindRoot, { force: true })
            await rm(tailwindLiteralRoot, { force: true })
        }
    })

    it("keeps slash modifier patterns disabled with partial options", async () => {
        const partialOptionsGenerator = new TailwindTypeGenerator({
            compiler,
            cssAnalyzer,
            generator: schemaGenerator,
            storeRoot: `${__dirname}/__mocks__/store/docs.json`,
        }).setGenOptions({
            useDocs: false,
        })
        const tailwindRoot = `${__dirname}/__mocks__/dist/partial_options_tailwind.ts`
        const tailwindLiteralRoot = `${__dirname}/__mocks__/dist/partial_options_tailwind_literal.ts`

        await rm(tailwindRoot, { force: true })
        await rm(tailwindLiteralRoot, { force: true })

        try {
            await partialOptionsGenerator.buildTypes({
                tailwind: tailwindRoot,
            })

            const tailwind = await readFile(tailwindRoot, "utf-8")

            expect(tailwind).not.toContain("${string}/${Variants")
            expect(tailwind).not.toContain("& {}")
        } finally {
            await rm(tailwindRoot, { force: true })
            await rm(tailwindLiteralRoot, { force: true })
        }
    })
})
