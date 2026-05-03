import { Project, ScriptTarget } from "ts-morph"
import { describe, expect, it } from "vitest"
import { ImportCollector } from "../../src/context/import_collector"

describe("ImportCollector", () => {
    function createSourceFile(content: string) {
        const project = new Project({
            compilerOptions: { target: ScriptTarget.ESNext },
        })
        return project.createSourceFile("test.ts", content)
    }

    it("should add a new import declaration if not exists", () => {
        const sourceFile = createSourceFile("")
        const collector = new ImportCollector()
        collector.addNamedImport("~/tw", "tw")
        collector.applyTo(sourceFile)

        expect(sourceFile.getFullText().trim()).toBe(
            `import { tw } from "~/tw";`
        )
    })

    it("should merge into existing import declaration", () => {
        const sourceFile = createSourceFile(`import { other } from "~/tw";`)
        const collector = new ImportCollector()
        collector.addNamedImport("~/tw", "tw")
        collector.applyTo(sourceFile)

        expect(sourceFile.getFullText().trim()).toBe(
            `import { other, tw } from "~/tw";`
        )
    })

    it("should not duplicate existing named import", () => {
        const sourceFile = createSourceFile(`import { tw } from "~/tw";`)
        const collector = new ImportCollector()
        collector.addNamedImport("~/tw", "tw")
        collector.applyTo(sourceFile)

        expect(sourceFile.getFullText().trim()).toBe(
            `import { tw } from "~/tw";`
        )
    })

    it("should remove unused imports and remove whole declaration if empty", () => {
        const sourceFile = createSourceFile(
            `import { cva, VariantProps } from "class-variance-authority";\nimport { cn } from "utils";`
        )
        const collector = new ImportCollector()
        collector.registerToRemove("cva")
        collector.registerToRemove("cn")
        collector.applyTo(sourceFile)

        expect(sourceFile.getFullText().trim()).toBe(
            `import { VariantProps } from "class-variance-authority";`
        )
    })

    it("should remove default import if matched", () => {
        const sourceFile = createSourceFile(`import cn from "clsx";`)
        const collector = new ImportCollector()
        collector.registerToRemove("cn")
        collector.applyTo(sourceFile)

        expect(sourceFile.getFullText().trim()).toBe("")
    })
})
