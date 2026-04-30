import { mkdirSync, writeFileSync } from "node:fs"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { loadTailwindNestGroups, TailwindCompiler } from "../index"

const tempDirs: string[] = []

afterEach(async () => {
    await Promise.all(
        tempDirs
            .splice(0)
            .map((dir) => rm(dir, { recursive: true, force: true }))
    )
})

async function makeTempProject(): Promise<string> {
    const dir = await mkdtemp(join(tmpdir(), "tailwind-internal-"))
    tempDirs.push(dir)
    return dir
}

describe("TailwindCompiler", () => {
    it("loads a design system from a cssRoot file", async () => {
        const root = await makeTempProject()
        const cssRoot = join(root, "src", "app.css")
        mkdirSync(join(root, "src"), { recursive: true })
        writeFileSync(cssRoot, '@import "tailwindcss";')

        const compiler = new TailwindCompiler({
            cssRoot,
            base: process.cwd(),
        })

        const designSystem = await compiler.getDesignSystem()
        const classList = designSystem.getClassList()
        expect(classList.length).toBeGreaterThan(0)
    })

    it("loads nest groups from inline cssSource", async () => {
        const groups = await loadTailwindNestGroups({
            cssSource: '@import "tailwindcss";',
            base: process.cwd(),
        })

        expect(groups).toContain("hover")
    })
})
