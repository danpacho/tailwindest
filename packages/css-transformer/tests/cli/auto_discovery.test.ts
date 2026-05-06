import { mkdtemp, mkdir, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { resolveCssTransformerCliConfig } from "../../src/cli/auto_discovery"

async function makeProject() {
    return mkdtemp(join(tmpdir(), "tailwindest-css-cli-"))
}

async function writeProjectFile(
    root: string,
    filePath: string,
    content: string
) {
    const fullPath = join(root, filePath)
    await mkdir(resolve(fullPath, ".."), { recursive: true })
    await writeFile(fullPath, content)
    return fullPath
}

async function writeCssRoot(
    root: string,
    filePath = "src/styles/tailwind.css"
) {
    return writeProjectFile(root, filePath, '@import "tailwindcss";\n')
}

describe("resolveCssTransformerCliConfig", () => {
    it("resolves css root with create-tailwind-type discovery", async () => {
        const cwd = await makeProject()
        await writeCssRoot(cwd)
        await writeProjectFile(
            cwd,
            "src/styles/tailwind.ts",
            "import { createTools } from 'tailwindest'\nexport const tw = createTools()\n"
        )

        const config = await resolveCssTransformerCliConfig({
            cwd,
            targetPath: "src/components/ui",
        })

        expect(config.cssPath).toBe(resolve(cwd, "src/styles/tailwind.css"))
    })

    it("resolves css root with fallback glob discovery", async () => {
        const cwd = await makeProject()
        await writeCssRoot(cwd, "app/assets/site.postcss")
        await writeProjectFile(
            cwd,
            "src/styles/tailwind.ts",
            "import { createTools } from 'tailwindest'\nexport const tw = createTools()\n"
        )

        const config = await resolveCssTransformerCliConfig({
            cwd,
            targetPath: "src/components/ui",
        })

        expect(config.cssPath).toBe(resolve(cwd, "app/assets/site.postcss"))
    })

    it("resolves tailwindest identifier from createTools generic export", async () => {
        const cwd = await makeProject()
        await writeCssRoot(cwd)
        await writeProjectFile(
            cwd,
            "tailwind.ts",
            "import { createTools, type CreateTailwindest } from 'tailwindest'\nexport const styles = createTools<CreateTailwindest>()\n"
        )

        const config = await resolveCssTransformerCliConfig({
            cwd,
            targetPath: "src/app/page.tsx",
        })

        expect(config.tailwindestIdentifier).toBe("styles")
    })

    it("resolves alias import path from tsconfig paths", async () => {
        const cwd = await makeProject()
        await writeCssRoot(cwd)
        await writeProjectFile(
            cwd,
            "tsconfig.json",
            JSON.stringify({
                compilerOptions: {
                    baseUrl: ".",
                    paths: {
                        "@/*": ["./src/*"],
                    },
                },
            })
        )
        await writeProjectFile(
            cwd,
            "src/styles/tailwind.ts",
            "import { createTools } from 'tailwindest'\nexport const tw = createTools<{ tailwindest: Tailwindest }>()\n"
        )

        const config = await resolveCssTransformerCliConfig({
            cwd,
            targetPath: "src/components/ui/button.tsx",
        })

        expect(config.tailwindestModulePath).toBe("@/styles/tailwind")
    })

    it("uses default mode walkers and dryRun when omitted", async () => {
        const cwd = await makeProject()
        await writeCssRoot(cwd)
        await writeProjectFile(
            cwd,
            "src/tw.ts",
            "import { createTools } from 'tailwindest'\nexport const tw = createTools()\n"
        )

        const config = await resolveCssTransformerCliConfig({
            cwd,
            targetPath: "src/components",
        })

        expect(config.outputMode).toBe("auto")
        expect(config.walkers).toEqual(["cva", "cn", "classname"])
        expect(config.dryRun).toBe(false)
    })

    it("keeps explicit CLI overrides", async () => {
        const cwd = await makeProject()
        await writeCssRoot(cwd)
        await writeProjectFile(
            cwd,
            "src/tw.ts",
            "import { createTools } from 'tailwindest'\nexport const tw = createTools()\n"
        )

        const config = await resolveCssTransformerCliConfig({
            cwd,
            targetPath: "src/components",
            cssPath: "src/styles/tailwind.css",
            tailwindestIdentifier: "ui",
            tailwindestModulePath: "@/ui/tw",
            outputMode: "runtime",
            dryRun: true,
        })

        expect(config.cssPath).toBe(resolve(cwd, "src/styles/tailwind.css"))
        expect(config.tailwindestIdentifier).toBe("ui")
        expect(config.tailwindestModulePath).toBe("@/ui/tw")
        expect(config.outputMode).toBe("runtime")
        expect(config.dryRun).toBe(true)
    })

    it("fails when css root cannot be inferred", async () => {
        const cwd = await makeProject()

        await expect(
            resolveCssTransformerCliConfig({
                cwd,
                targetPath: "src/components",
            })
        ).rejects.toThrow(
            "Could not find a Tailwind CSS entry. Pass --css <path>."
        )
    })

    it("falls back to legacy tailwindest import when no tools export exists", async () => {
        const cwd = await makeProject()
        await writeCssRoot(cwd)

        const config = await resolveCssTransformerCliConfig({
            cwd,
            targetPath: "src/components",
        })

        expect(config.tailwindestIdentifier).toBe("tw")
        expect(config.tailwindestModulePath).toBe("~/tw")
        expect(config.warnings).toContain(
            "Could not infer Tailwindest tools export. Falling back to tw from ~/tw."
        )
    })

    it("prefers common tools file over later glob result", async () => {
        const cwd = await makeProject()
        await writeCssRoot(cwd)
        await writeProjectFile(
            cwd,
            "src/styles/tailwind.ts",
            "import { createTools } from 'tailwindest'\nexport const tw = createTools()\n"
        )
        await writeProjectFile(
            cwd,
            "src/zz-generated/tools.ts",
            "import { createTools } from 'tailwindest'\nexport const later = createTools()\n"
        )

        const config = await resolveCssTransformerCliConfig({
            cwd,
            targetPath: "src/components/card.tsx",
        })

        expect(config.tailwindestIdentifier).toBe("tw")
        expect(config.tailwindestModulePath).toBe("../styles/tailwind")
    })

    it("uses relative import path when no tsconfig alias matches", async () => {
        const cwd = await makeProject()
        await writeCssRoot(cwd)
        await writeProjectFile(
            cwd,
            "src/styles/tailwind.ts",
            "import { createTools } from 'tailwindest'\nexport const tw = createTools()\n"
        )

        const config = await resolveCssTransformerCliConfig({
            cwd,
            targetPath: "src/components/ui/button.tsx",
        })

        expect(config.tailwindestModulePath).toBe("../../styles/tailwind")
    })

    it("normalizes index tools file to directory import", async () => {
        const cwd = await makeProject()
        await writeCssRoot(cwd)
        await writeProjectFile(
            cwd,
            "tsconfig.json",
            JSON.stringify({
                compilerOptions: {
                    paths: {
                        "@/*": ["src/*"],
                    },
                },
            })
        )
        await writeProjectFile(
            cwd,
            "src/styles/index.ts",
            "import { createTools } from 'tailwindest'\nexport const tw = createTools()\n"
        )

        const config = await resolveCssTransformerCliConfig({
            cwd,
            targetPath: "src/components/ui/button.tsx",
        })

        expect(config.tailwindestModulePath).toBe("@/styles")
    })
})
