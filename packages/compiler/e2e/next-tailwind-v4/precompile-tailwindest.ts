import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createCompilerContext } from "../../src/vite/context"

const fixtureRoot = fileURLToPath(new URL(".", import.meta.url))
const sourceRoot = path.join(fixtureRoot, "src/app")
const outputRoot = path.join(fixtureRoot, "app")

await fs.rm(outputRoot, { recursive: true, force: true })
await fs.rm(path.join(fixtureRoot, ".tailwindest"), {
    recursive: true,
    force: true,
})

const files = await walk(sourceRoot)
const jsFiles = files.filter((file) => /\.[cm]?[jt]sx?$/.test(file))
const cssFiles = files.filter((file) => file.endsWith(".css"))
const context = createCompilerContext({
    root: fixtureRoot,
    command: "build",
    options: {
        include: [/src\/app\/.*\.[cm]?[jt]sx?$/],
        cssEntries: [/app\/globals\.css$/],
        mode: "strict",
        debug: true,
        sourceMap: true,
    },
})

for (const file of jsFiles) {
    const relative = path.relative(sourceRoot, file)
    const output = path.join(outputRoot, relative)
    await fs.mkdir(path.dirname(output), { recursive: true })
    const result = context.transformJs(await fs.readFile(file, "utf8"), file)
    await fs.writeFile(output, result.code)
}

for (const file of cssFiles) {
    const relative = path.relative(sourceRoot, file)
    const output = path.join(outputRoot, relative)
    await fs.mkdir(path.dirname(output), { recursive: true })
    const result = context.transformCss(await fs.readFile(file, "utf8"), output)
    await fs.writeFile(output, result.code)
}

async function walk(directory: string): Promise<string[]> {
    const entries = await fs.readdir(directory, { withFileTypes: true })
    const files = await Promise.all(
        entries.map(async (entry) => {
            const resolved = path.join(directory, entry.name)
            if (entry.isDirectory()) {
                return walk(resolved)
            }
            return [resolved]
        })
    )
    return files.flat().sort()
}
