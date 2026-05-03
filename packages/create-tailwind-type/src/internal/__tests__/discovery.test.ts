import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import {
    checkFileForImport,
    findTailwindCSSRoot,
} from "tailwindest-tailwind-internal"

const tempDirs: string[] = []

afterEach(async () => {
    await Promise.all(
        tempDirs
            .splice(0)
            .map((dir) => rm(dir, { recursive: true, force: true }))
    )
})

async function makeTempProject(): Promise<string> {
    const dir = await mkdtemp(join(tmpdir(), "tailwindest-discovery-"))
    tempDirs.push(dir)
    return dir
}

async function writeProjectFile(
    root: string,
    relativePath: string,
    content: string
): Promise<string> {
    const file = join(root, relativePath)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, content)
    return file
}

describe("Tailwind CSS Root Discovery", () => {
    describe("checkFileForImport", () => {
        const markers = [
            "@import 'tailwindcss'",
            '@import "tailwindcss"',
            "@tailwind",
            "@theme",
            "@plugin",
            "@utility",
            "@variant",
        ]

        it.each(markers)(
            "should return true if file contains marker: %s",
            async (marker) => {
                const root = await makeTempProject()
                const file = await writeProjectFile(
                    root,
                    "test.css",
                    `/* some styles */\n${marker}\n/* more styles */`
                )

                await expect(checkFileForImport(file)).resolves.toBe(true)
            }
        )

        it("should return false if no markers are present", async () => {
            const root = await makeTempProject()
            const file = await writeProjectFile(
                root,
                "test.css",
                ".btn { color: red; }"
            )

            await expect(checkFileForImport(file)).resolves.toBe(false)
        })

        it("should return false if file read fails", async () => {
            const root = await makeTempProject()

            await expect(
                checkFileForImport(join(root, "missing.css"))
            ).resolves.toBe(false)
        })
    })

    describe("findTailwindCSSRoot", () => {
        it("should find the root in the fast path (common filename)", async () => {
            const root = await makeTempProject()
            await writeProjectFile(
                root,
                "tailwind.css",
                "@theme { --color-primary: red; }"
            )

            await expect(findTailwindCSSRoot(root)).resolves.toBe(
                join(root, "tailwind.css")
            )
        })

        it("should find the root in src/globals.css", async () => {
            const root = await makeTempProject()
            await writeProjectFile(
                root,
                "src/globals.css",
                "@import 'tailwindcss';"
            )

            await expect(findTailwindCSSRoot(root)).resolves.toBe(
                join(root, "src/globals.css")
            )
        })

        it("should fallback to slow path (glob) if fast path fails", async () => {
            const root = await makeTempProject()
            await writeProjectFile(
                root,
                "src/features/ui/entry.pcss",
                "@plugin 'some-plugin';"
            )

            await expect(findTailwindCSSRoot(root)).resolves.toBe(
                join(root, "src/features/ui/entry.pcss")
            )
        })

        it("should ignore files in excluded directories", async () => {
            const root = await makeTempProject()
            await writeProjectFile(
                root,
                "node_modules/package/entry.css",
                '@import "tailwindcss";'
            )

            await expect(findTailwindCSSRoot(root)).resolves.toBe(null)
        })

        it("should return null if no tailwind entry point is found", async () => {
            const root = await makeTempProject()
            await writeProjectFile(
                root,
                "index.css",
                ".normal-css { color: blue; }"
            )
            await writeProjectFile(root, "styles.css", ".other { color: red; }")

            await expect(findTailwindCSSRoot(root)).resolves.toBe(null)
        })
    })
})
