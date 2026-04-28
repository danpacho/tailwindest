import { Node, Project, ScriptTarget } from "ts-morph"
import { describe, expect, it, vi } from "vitest"
import type { TransformerContext } from "../../src/context"
import { ImportCollector } from "../../src/context/import_collector"
import { StyleManager } from "../../src/context/style_manager"
import { TransformerRegistry } from "../../src/registry/transformer_registry"
import type { ClassTransformerWalker } from "../../src/walkers/walker_interface"

describe("TransformerRegistry", () => {
    function createSourceFile(content: string) {
        const project = new Project({
            compilerOptions: { target: ScriptTarget.ESNext },
        })
        return project.createSourceFile("test.ts", content)
    }

    function createMockContext(): TransformerContext {
        return {
            analyzer: {} as any, // Mock analyzer not needed for these tests
            tailwindestIdentifier: "tw",
            tailwindestModulePath: "~/tw",
            outputMode: "runtime",
            outputModeEvidence: [],
            imports: new ImportCollector(),
            styles: new StyleManager(),
            diagnostics: [],
        }
    }

    it("should register walkers and sort by priority", () => {
        const registry = new TransformerRegistry()
        const walker1 = {
            priority: 10,
            name: "w1",
            canWalk: () => true,
            walk: () => ({}),
        } as unknown as ClassTransformerWalker
        const walker2 = {
            priority: 30,
            name: "w2",
            canWalk: () => true,
            walk: () => ({}),
        } as unknown as ClassTransformerWalker
        const walker3 = {
            priority: 20,
            name: "w3",
            canWalk: () => true,
            walk: () => ({}),
        } as unknown as ClassTransformerWalker

        registry.register(walker1)
        registry.register(walker2)
        registry.register(walker3)

        // @ts-expect-error accessing private property for test
        const sortedWalkers = registry.walkers
        expect(sortedWalkers[0]?.priority).toBe(30)
        expect(sortedWalkers[1]?.priority).toBe(20)
        expect(sortedWalkers[2]?.priority).toBe(10)
    })

    it("should walk nodes in reverse order", () => {
        const registry = new TransformerRegistry()
        const context = createMockContext()
        const sourceFile = createSourceFile(`
            const a = 1;
            const b = 2;
        `)

        const visitedNodes: string[] = []
        const walker: ClassTransformerWalker = {
            priority: 10,
            name: "VariableWalker",
            canWalk: (node) => Node.isVariableDeclaration(node),
            walk: (node) => {
                if (Node.isVariableDeclaration(node)) {
                    visitedNodes.push(node.getName())
                }
                return {
                    success: true,
                    original: "",
                    transformed: "",
                    location: { line: 0, column: 0 },
                    warnings: [],
                }
            },
        }

        registry.register(walker)
        registry.transform(sourceFile, context)

        // It should visit 'b' then 'a' because of reverse execution
        expect(visitedNodes).toEqual(["b", "a"])
    })

    it("should call imports.applyTo() at the end", () => {
        const registry = new TransformerRegistry()
        const context = createMockContext()
        const sourceFile = createSourceFile(`const a = 1;`)

        const applyToSpy = vi.spyOn(context.imports, "applyTo")

        registry.transform(sourceFile, context)
        expect(applyToSpy).toHaveBeenCalledWith(sourceFile)
    })

    it("should handle exceptions in walkers and add to diagnostics", () => {
        const registry = new TransformerRegistry()
        const context = createMockContext()
        const sourceFile = createSourceFile(`const a = 1;`)

        const badWalker: ClassTransformerWalker = {
            priority: 10,
            name: "BadWalker",
            canWalk: (node) => Node.isVariableDeclaration(node),
            walk: () => {
                throw new Error("Test error")
            },
        }

        registry.register(badWalker)
        const results = registry.transform(sourceFile, context)

        expect(results).toHaveLength(0)
        expect(context.diagnostics).toHaveLength(1)
        expect(context.diagnostics[0]?.level).toBe("error")
        expect(context.diagnostics[0]?.walkerName).toBe("BadWalker")
        expect(context.diagnostics[0]?.message).toContain("Test error")
    })
})
