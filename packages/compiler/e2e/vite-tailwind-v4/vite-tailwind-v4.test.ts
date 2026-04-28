import fs from "node:fs/promises"
import path from "node:path"
import { build } from "vite"
import { describe, expect, it } from "vitest"
import { createCompilerContext } from "../../src/vite/context"

const fixtureRoot = path.resolve(__dirname)

describe("Vite + Tailwind v4 manifest bridge", () => {
    it("emits CSS for manifest candidates delivered through @source inline()", async () => {
        await fs.rm(path.join(fixtureRoot, "dist"), {
            recursive: true,
            force: true,
        })

        await build({
            configFile: path.join(fixtureRoot, "vite.config.ts"),
        })

        const assets = await fs.readdir(path.join(fixtureRoot, "dist/assets"))
        const cssAsset = assets.find((asset) => asset.endsWith(".css"))
        expect(cssAsset).toBeTypeOf("string")
        const css = await fs.readFile(
            path.join(fixtureRoot, "dist/assets", cssAsset!),
            "utf8"
        )

        expect(css).toContain(".px-4")
        expect(css).toContain(".text-emerald-600")
        expect(css).toContain(".bg-\\[rgb\\(10_20_30\\)\\]")
        expect(css).toContain(".dark\\:md\\:hover\\:bg-sky-600")
    })

    it("derives identical candidate manifests for deterministic dev and build contexts", async () => {
        const files = {
            [path.join(fixtureRoot, "src/main.ts")]: await fs.readFile(
                path.join(fixtureRoot, "src/main.ts"),
                "utf8"
            ),
            [path.join(fixtureRoot, "src/style.css")]: await fs.readFile(
                path.join(fixtureRoot, "src/style.css"),
                "utf8"
            ),
        }
        const scanFiles = async () => Object.keys(files)
        const readFile = async (id: string) => files[id] ?? ""
        const serve = createCompilerContext({
            root: fixtureRoot,
            command: "serve",
            options: {},
            scanFiles,
            readFile,
        })
        const buildContext = createCompilerContext({
            root: fixtureRoot,
            command: "build",
            options: {},
            scanFiles,
            readFile,
        })

        await serve.preScan()
        await buildContext.preScan()

        expect(serve.getManifestCandidates()).toEqual([
            "bg-[rgb(10_20_30)]",
            "dark:md:hover:bg-sky-600",
            "px-4",
            "py-2",
            "text-emerald-600",
        ])
        expect(buildContext.getManifestCandidates()).toEqual(
            serve.getManifestCandidates()
        )
    })
})
