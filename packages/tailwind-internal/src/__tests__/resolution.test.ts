import { mkdirSync, writeFileSync } from "node:fs"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import {
    findTailwindCSSRoot,
    getTailwindVersion,
    isVersionSufficient,
} from "../index"

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

describe("Tailwind package resolution helpers", () => {
    it("detects package versions from resolved Tailwind directories", async () => {
        const root = await makeTempProject()
        const pkgDir = join(root, "node_modules", "@tailwindcss", "node")
        mkdirSync(join(pkgDir, "dist"), { recursive: true })
        writeFileSync(
            join(pkgDir, "package.json"),
            JSON.stringify({ name: "@tailwindcss/node", version: "4.2.4" })
        )

        expect(getTailwindVersion(join(pkgDir, "dist"))).toBe("4.2.4")
        expect(isVersionSufficient("4.0.0")).toBe(true)
        expect(isVersionSufficient("3.4.17")).toBe(false)
    })

    it("finds Tailwind CSS roots by v4 entry markers", async () => {
        const root = await makeTempProject()
        mkdirSync(join(root, "src"), { recursive: true })
        writeFileSync(join(root, "src", "app.css"), '@import "tailwindcss";')

        await expect(findTailwindCSSRoot(root)).resolves.toBe(
            join(root, "src", "app.css")
        )
    })
})
