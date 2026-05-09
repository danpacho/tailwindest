import { Project, ScriptTarget, SyntaxKind } from "ts-morph"
import { describe, expect, it } from "vitest"
import { CvaWalker } from "../../src/walkers/cva_walker"
import { TokenAnalyzerImpl } from "../../src/analyzer/token_analyzer"
import type { CSSPropertyResolver } from "create-tailwind-type"
import { createContext } from "../../src/context/transformer_context"
import { TransformerRegistry } from "../../src/registry/transformer_registry"
import { CnWalker } from "../../src/walkers/cn_walker"

class MockResolver implements Partial<CSSPropertyResolver> {
    resolveUnambiguous(className: string): string | null {
        if (className === "flex") return "display"
        if (className === "items-center") return "alignItems"
        if (className === "bg-blue-500") return "backgroundColor"
        if (className === "bg-gray-500") return "backgroundColor"
        if (className === "text-lg") return "fontSize"
        return null
    }
}

describe("CvaWalker", () => {
    const analyzer = new TokenAnalyzerImpl(
        new MockResolver() as CSSPropertyResolver
    )

    function setup(content: string) {
        const project = new Project({
            compilerOptions: { target: ScriptTarget.ESNext },
        })
        const sourceFile = project.createSourceFile("test.ts", content)
        const context = createContext({ analyzer })
        return { sourceFile, context }
    }

    it("should transform basic cva call", () => {
        const { sourceFile, context } = setup(
            `const a = cva("flex items-center")`
        )
        const callExpr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.CallExpression
        )! // CallExpression

        const walker = new CvaWalker()
        expect(walker.canWalk(callExpr)).toBe(true)

        const result = walker.walk(callExpr, context)
        expect(result.success).toBe(true)
        expect(result.transformed).toContain(`tw.style({`)
        expect(result.transformed).toContain(`display: "flex"`)
        expect(result.transformed).toContain(`alignItems: "items-center"`)
    })

    it("should transform cva with variants", () => {
        const { sourceFile, context } = setup(`
            const btn = cva("flex", {
                variants: {
                    intent: {
                        primary: "bg-blue-500",
                        secondary: "bg-gray-500"
                    }
                }
            })
        `)
        const callExpr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.CallExpression
        )!
        const walker = new CvaWalker()

        walker.walk(callExpr, context)
        const text = sourceFile.getFullText()

        expect(text).toContain(`tw.variants({`)
        expect(text).toContain(`display: "flex"`)
        expect(text).toContain(`variants: {`)
        expect(text).toContain(`intent: {`)
        expect(text).toContain(`primary: {`)
        expect(text).toContain(`backgroundColor: "bg-blue-500"`)
    })

    it("should preserve defaultVariants and compoundVariants as JSDoc", () => {
        const { sourceFile, context } = setup(`
            const btn = cva("flex", {
                defaultVariants: { intent: "primary" },
                compoundVariants: [{ intent: "primary", class: "text-lg" }]
            })
        `)
        const callExpr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.CallExpression
        )!
        const walker = new CvaWalker()

        walker.walk(callExpr, context)
        const text = sourceFile.getFullText()

        expect(text).toContain(`* @defaultVariants { intent: "primary" }`)
        expect(text).toContain(
            `* @compoundVariants [{ intent: "primary", class: "text-lg" }]`
        )
        expect(text).toContain(`tw.style({`)
    })

    it("should preserve nested variant prefixes in runtime output", () => {
        const { sourceFile, context } = setup(`
            const btn = cva("dark:hover:bg-blue-500", {
                variants: {
                    intent: {
                        primary: "dark:hover:bg-gray-500"
                    }
                }
            })
        `)
        const callExpr = sourceFile.getFirstDescendantByKind(
            SyntaxKind.CallExpression
        )!
        const walker = new CvaWalker()

        walker.walk(callExpr, context)
        const text = sourceFile.getFullText()

        expect(text).toContain(`backgroundColor: "dark:hover:bg-blue-500"`)
        expect(text).toContain(`backgroundColor: "dark:hover:bg-gray-500"`)
    })

    it("should rewrite cva VariantProps and call sites to Tailwindest variants API", () => {
        const { sourceFile, context } = setup(`
            import { cva, type VariantProps } from "class-variance-authority"
            import { cn } from "@/lib/utils"

            const buttonVariants = cva("flex", {
                variants: {
                    variant: {
                        default: "bg-blue-500",
                        secondary: "bg-gray-500"
                    },
                    size: {
                        default: "text-lg"
                    }
                }
            })

            interface ButtonProps extends VariantProps<typeof buttonVariants> {}

            function Button({ className, variant, size }: ButtonProps & { className?: string }) {
                return <button className={cn(buttonVariants({ variant, size, className }))} />
            }
        `)
        const registry = new TransformerRegistry()
        registry.register(new CvaWalker())
        registry.register(new CnWalker())

        registry.transform(sourceFile, context)
        const text = sourceFile.getFullText()

        expect(text).toContain(
            `import { type GetVariants } from "tailwindest";`
        )
        expect(text).not.toContain(`VariantProps`)
        expect(text).toContain(
            `interface ButtonProps extends GetVariants<typeof buttonVariants> {}`
        )
        expect(text).toContain(`const buttonVariants = tw.variants({`)
        expect(text).toContain(
            `className={tw.join(buttonVariants.class({ variant, size }), className)}`
        )
    })

    it("should use tw.style for cva calls without variants and rewrite call sites", () => {
        const { sourceFile, context } = setup(`
            import { cva } from "class-variance-authority"
            import { cn } from "@/lib/utils"

            const triggerStyle = cva("flex items-center")

            function Trigger({ className }: { className?: string }) {
                return <button className={cn(triggerStyle(), className)} />
            }
        `)
        const registry = new TransformerRegistry()
        registry.register(new CvaWalker())
        registry.register(new CnWalker())

        registry.transform(sourceFile, context)
        const text = sourceFile.getFullText()

        expect(text).toContain(`const triggerStyle = tw.style({`)
        expect(text).not.toContain(`tw.variants({`)
        expect(text).toContain(
            `className={tw.join(triggerStyle.class(), className)}`
        )
    })

    it("should rewrite imported cva variant helpers", () => {
        const { sourceFile, context } = setup(`
            import { type VariantProps } from "class-variance-authority"
            import { buttonVariants } from "./button"
            import { cn } from "@/lib/utils"

            interface LinkProps extends VariantProps<typeof buttonVariants> {}

            function Link({ className }: LinkProps & { className?: string }) {
                return <a className={cn(buttonVariants({ variant: "outline" }), className)} />
            }
        `)
        const registry = new TransformerRegistry()
        registry.register(new CvaWalker())
        registry.register(new CnWalker())

        registry.transform(sourceFile, context)
        const text = sourceFile.getFullText()

        expect(text).toContain(
            `import { type GetVariants } from "tailwindest";`
        )
        expect(text).not.toContain(`VariantProps`)
        expect(text).toContain(
            `interface LinkProps extends GetVariants<typeof buttonVariants> {}`
        )
        expect(text).toContain(
            `className={tw.join(buttonVariants.class({ variant: "outline" }), className)}`
        )
    })

    it("should use tw.join when a cva helper carries className outside a join call", () => {
        const { sourceFile, context } = setup(`
            import { buttonVariants } from "./button"

            const value = buttonVariants({ variant: "outline", className })
        `)
        const registry = new TransformerRegistry()
        registry.register(new CvaWalker())

        registry.transform(sourceFile, context)
        const text = sourceFile.getFullText()

        expect(text).toContain(`import { tw } from "~/tw";`)
        expect(text).toContain(
            `const value = tw.join(buttonVariants.class({ variant: "outline" }), className)`
        )
    })
})
