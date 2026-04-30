import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createCompilerContext } from "../../src/vite/context"

const fixtureRoot = fileURLToPath(new URL(".", import.meta.url))
const sourceRoot = path.join(fixtureRoot, "src/app")
const outputRoot = path.join(fixtureRoot, "app")
const sharedSourceRoot = path.join(fixtureRoot, "../design-system/shared")
const sharedOutputRoot = path.join(outputRoot, "design-system-shared")

await fs.rm(outputRoot, { recursive: true, force: true })
await fs.rm(path.join(fixtureRoot, ".tailwindest"), {
    recursive: true,
    force: true,
})

const appFiles = await walk(sourceRoot)
const sharedFiles = (await walk(sharedSourceRoot)).filter((file) =>
    [
        "design_system_expectations.ts",
        "design_system_fixture.tsx",
        "design_system_types.ts",
    ].includes(path.basename(file))
)
const context = createCompilerContext({
    root: fixtureRoot,
    command: "build",
    options: {
        include: [
            /design-system-next\/src\/app\/.*\.[cm]?[jt]sx?$/,
            /design-system\/shared\/design_system_fixture\.tsx$/,
        ],
        cssEntries: [/design-system-next\/app\/globals\.css$/],
        debug: true,
        sourceMap: true,
        collectStringLiteralCandidates: false,
    },
})

for (const file of appFiles.filter((item) => item.endsWith(".css"))) {
    const output = path.join(outputRoot, path.relative(sourceRoot, file))
    await context.transformCssAsync(await fs.readFile(file, "utf8"), output)
}

for (const file of sharedFiles) {
    const relative = path.relative(sharedSourceRoot, file)
    const output = path.join(sharedOutputRoot, relative)
    await fs.mkdir(path.dirname(output), { recursive: true })
    if (file.endsWith("design_system_fixture.tsx")) {
        const result = context.transformJs(
            await fs.readFile(file, "utf8"),
            file
        )
        await fs.writeFile(output, result.code)
    } else {
        await fs.copyFile(file, output)
    }
}

for (const file of appFiles.filter((item) => /\.[cm]?[jt]sx?$/.test(item))) {
    const relative = path.relative(sourceRoot, file)
    const output = path.join(outputRoot, relative)
    await fs.mkdir(path.dirname(output), { recursive: true })
    const source = (await fs.readFile(file, "utf8")).replace(
        "../../../design-system/shared/design_system_fixture",
        "./design-system-shared/design_system_fixture"
    )
    const result = context.transformJs(source, file)
    await fs.writeFile(output, result.code)
}

for (const file of appFiles.filter((item) => item.endsWith(".css"))) {
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
