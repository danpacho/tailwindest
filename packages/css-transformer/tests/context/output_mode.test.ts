import { mkdtemp, mkdir, writeFile } from "fs/promises"
import { tmpdir } from "os"
import path from "path"
import { describe, expect, it } from "vitest"
import { resolveOutputMode } from "../../src/context/output_mode"

async function createProject(files: Record<string, string> = {}) {
    const root = await mkdtemp(path.join(tmpdir(), "tailwindest-mode-"))
    for (const [file, content] of Object.entries(files)) {
        const fullPath = path.join(root, file)
        await mkdir(path.dirname(fullPath), { recursive: true })
        await writeFile(fullPath, content, "utf8")
    }
    return root
}

describe("resolveOutputMode", () => {
    it("uses explicit runtime mode over compiled auto signals", async () => {
        const projectRoot = await createProject({
            "vite.config.ts": `import { tailwindest } from "@tailwindest/compiler/vite"; export default { plugins: [tailwindest()] }`,
        })

        const result = await resolveOutputMode({
            outputMode: "runtime",
            projectRoot,
        })

        expect(result.mode).toBe("runtime")
        expect(result.evidence[0]?.kind).toBe("explicit-option")
    })

    it("uses explicit compiled mode", async () => {
        const result = await resolveOutputMode({ outputMode: "compiled" })

        expect(result.mode).toBe("compiled")
        expect(result.evidence[0]?.kind).toBe("explicit-option")
    })

    it("resolves compiler Vite plugin projects to compiled mode", async () => {
        const projectRoot = await createProject({
            "vite.config.ts": `import { tailwindest } from "@tailwindest/compiler/vite"; export default { plugins: [tailwindest()] }`,
        })

        const result = await resolveOutputMode({ projectRoot })

        expect(result.mode).toBe("compiled")
        expect(result.evidence[0]?.kind).toBe("compiler-vite-plugin")
    })

    it("resolves Next precompile bridge projects to compiled mode", async () => {
        const projectRoot = await createProject({
            "precompile-tailwindest.ts": `import { createCompilerContext } from "@tailwindest/compiler";`,
        })

        const result = await resolveOutputMode({ projectRoot })

        expect(result.mode).toBe("compiled")
        expect(result.evidence[0]?.kind).toBe("compiler-precompile-bridge")
    })

    it("resolves CreateCompiledTailwindest source imports to compiled mode", async () => {
        const result = await resolveOutputMode({
            sourceCode: `import type { CreateCompiledTailwindest } from "tailwindest";`,
        })

        expect(result.mode).toBe("compiled")
        expect(result.evidence[0]?.kind).toBe("compiled-tailwindest-type")
    })

    it("keeps package dependency only projects in runtime mode with a diagnostic", async () => {
        const projectRoot = await createProject({
            "package.json": JSON.stringify({
                dependencies: { "@tailwindest/compiler": "^1.0.0" },
            }),
        })

        const result = await resolveOutputMode({ projectRoot })

        expect(result.mode).toBe("runtime")
        expect(result.evidence[0]?.kind).toBe("compiler-package-dependency")
        expect(result.diagnostics[0]?.message).toContain("weak signal")
    })

    it("keeps artifact-only projects in runtime mode with a diagnostic", async () => {
        const projectRoot = await createProject({
            ".tailwindest/debug-manifest.json": "{}",
        })

        const result = await resolveOutputMode({ projectRoot })

        expect(result.mode).toBe("runtime")
        expect(result.evidence[0]?.kind).toBe("compiler-artifact")
        expect(result.diagnostics[0]?.message).toContain("probable")
    })

    it("defaults unknown projects to runtime mode", async () => {
        const projectRoot = await createProject()

        const result = await resolveOutputMode({ projectRoot })

        expect(result.mode).toBe("runtime")
        expect(result.evidence).toEqual([])
        expect(result.diagnostics).toEqual([])
    })
})
