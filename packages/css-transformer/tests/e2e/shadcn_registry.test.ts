import { describe, expect, it } from "vitest"
import { Project } from "ts-morph"
import path from "path"
import fs from "fs/promises"
import { TransformerRegistry } from "../../src/registry/transformer_registry"
import { TokenAnalyzerImpl } from "../../src/analyzer/token_analyzer"
import { createContext } from "../../src/context/transformer_context"
import { CvaWalker } from "../../src/walkers/cva_walker"
import { CnWalker } from "../../src/walkers/cn_walker"
import { ClassNameWalker } from "../../src/walkers/classname_walker"

import {
    TailwindTypeGenerator,
    TailwindCompiler,
    CSSAnalyzer,
    TypeSchemaGenerator,
} from "create-tailwind-type"

describe("Shadcn Registry E2E Tests", async () => {
    const registryDir = path.join(__dirname, "../fixtures/shadcn_registry")
    let files: string[] = []

    try {
        files = await fs.readdir(registryDir)
    } catch (e) {
        console.warn(
            "Could not read registry dir. Run the download script first."
        )
    }

    const project = new Project({
        compilerOptions: {
            jsx: 1, // preserve
            strict: true,
            esModuleInterop: true,
        },
    })

    // Initialize Real Generator
    const compiler = new TailwindCompiler({
        cssRoot: path.join(
            __dirname,
            "../../../create-tailwind-type/src/generator/__tests__/__mocks__/tailwind.css"
        ),
        base: "node_modules/tailwindcss",
    })
    const cssAnalyzer = new CSSAnalyzer()
    const schemaGenerator = new TypeSchemaGenerator()

    const generator = new TailwindTypeGenerator({
        compiler,
        cssAnalyzer,
        generator: schemaGenerator,
        storeRoot: path.join(
            __dirname,
            "../../../create-tailwind-type/src/generator/__tests__/__mocks__/store/docs.json"
        ),
    }).setGenOptions({
        useDocs: true,
        useExactVariants: false,
        useArbitraryValue: false,
        useSoftVariants: true,
        useStringKindVariantsOnly: false,
        useOptionalProperty: false,
        disableVariants: true,
    })

    await generator.init()
    const resolver = generator.createPropertyResolver()

    const analyzer = new TokenAnalyzerImpl(resolver)
    const registry = new TransformerRegistry()

    registry.register(new CvaWalker())
    registry.register(new CnWalker())
    registry.register(new ClassNameWalker())

    // Only test on input files
    const inputFiles = files.filter(
        (f) => f.startsWith("input_") && f.endsWith(".txt")
    )

    for (const file of inputFiles) {
        it(`should transform ${file} correctly`, async () => {
            const content = await fs.readFile(
                path.join(registryDir, file),
                "utf-8"
            )

            // We use .tsx extension internally so ts-morph can parse JSX
            const sourceFile = project.createSourceFile(
                `test_${file}.tsx`,
                content,
                { overwrite: true }
            )

            const context = createContext({
                analyzer,
                tailwindestIdentifier: "tw",
                tailwindestModulePath: "~/tw",
            })

            registry.transform(sourceFile, context)

            // 1. Should not throw any fatal error
            const errors = context.diagnostics.filter(
                (d) => d.level === "error"
            )
            expect(errors).toHaveLength(0)

            const transformedText = sourceFile.getFullText()

            // 2. Validate against expected snapshot file
            const expectedFileName = file.replace("input_", "expected_")
            const expectedFilePath = path.join(registryDir, expectedFileName)

            await expect(transformedText).toMatchFileSnapshot(expectedFilePath)
        })
    }
})
