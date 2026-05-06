import { mkdtemp, mkdir, readFile, symlink, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { afterEach, describe, expect, it, vi } from "vitest"

const promptMocks = vi.hoisted(() => ({
    group: vi.fn(),
    note: vi.fn(),
    outro: vi.fn(),
    intro: vi.fn(),
    spinnerStart: vi.fn(),
    spinnerStop: vi.fn(),
    logError: vi.fn(),
    logInfo: vi.fn(),
    logWarn: vi.fn(),
}))

const tailwindMocks = vi.hoisted(() => ({
    resolver: { resolveUnambiguous: vi.fn() },
    generatorOptions: [] as unknown[],
    resolveTailwindNodeDir: vi.fn(async (cssRoot?: string) =>
        cssRoot
            ? "/local/@tailwindcss/node/dist"
            : "/fallback/@tailwindcss/node/dist"
    ),
    getTailwindVersion: vi.fn((base: string) =>
        base.startsWith("/local") ? "3.4.0" : "4.0.0"
    ),
    isVersionSufficient: vi.fn((version: string) => version.startsWith("4")),
    findTailwindCSSRoot: vi.fn(async (cwd: string) =>
        join(cwd, "src/styles/tailwind.css")
    ),
}))

const transformMock = vi.hoisted(() =>
    vi.fn(async (content: string) => ({
        code: content.replace('className="flex"', "className={tw.flex}"),
        diagnostics: [],
        results: [],
    }))
)

vi.mock("@clack/prompts", () => ({
    group: promptMocks.group,
    note: promptMocks.note,
    outro: promptMocks.outro,
    intro: promptMocks.intro,
    spinner: () => ({
        start: promptMocks.spinnerStart,
        stop: promptMocks.spinnerStop,
    }),
    log: {
        error: promptMocks.logError,
        info: promptMocks.logInfo,
        warn: promptMocks.logWarn,
    },
    text: vi.fn(),
    cancel: vi.fn(),
}))

vi.mock("picocolors", () => ({
    default: {
        bgCyan: (value: string) => value,
        black: (value: string) => value,
        green: (value: string) => value,
        cyan: (value: string) => value,
        yellow: (value: string) => value,
        dim: (value: string) => value,
    },
}))

vi.mock("create-tailwind-type", () => ({
    TailwindCompiler: class {
        constructor(public options: unknown) {}
    },
    CSSAnalyzer: class {},
    TypeSchemaGenerator: class {},
    Logger: class {
        warn = vi.fn()
        info = vi.fn()
    },
    TailwindTypeGenerator: class {
        constructor(options: unknown) {
            tailwindMocks.generatorOptions.push(options)
        }
        setGenOptions() {
            return this
        }
        async init() {}
        createPropertyResolver() {
            return tailwindMocks.resolver
        }
    },
    resolveTailwindNodeDir: tailwindMocks.resolveTailwindNodeDir,
    getTailwindVersion: tailwindMocks.getTailwindVersion,
    isVersionSufficient: tailwindMocks.isVersionSufficient,
    findTailwindCSSRoot: tailwindMocks.findTailwindCSSRoot,
}))

vi.mock("../../src/index", () => ({
    transform: transformMock,
}))

import { isDirectRun, runTransform } from "../../src/cli"

async function makeProject() {
    const root = await mkdtemp(join(tmpdir(), "tailwindest-css-cli-run-"))
    await writeProjectFile(
        root,
        "src/styles/tailwind.css",
        '@import "tailwindcss";\n'
    )
    await writeProjectFile(
        root,
        "src/styles/tailwind.ts",
        "import { createTools } from 'tailwindest'\nexport const tw = createTools()\n"
    )
    return root
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

afterEach(() => {
    vi.clearAllMocks()
    tailwindMocks.generatorOptions = []
})

describe("runTransform", () => {
    it("runs a provided target without entering the TUI", async () => {
        const cwd = await makeProject()
        const sourcePath = await writeProjectFile(
            cwd,
            "src/components/button.tsx",
            'export function Button() { return <button className="flex" /> }\n'
        )

        await runTransform({
            cwd,
            targetPath: "src/components/button.tsx",
            options: {},
        })

        await expect(readFile(sourcePath, "utf-8")).resolves.toContain(
            "className={tw.flex}"
        )
        expect(promptMocks.group).not.toHaveBeenCalled()
        expect(transformMock).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                tailwindestIdentifier: "tw",
                tailwindestModulePath: "../styles/tailwind",
                outputMode: "auto",
                walkers: ["cva", "cn", "classname"],
            })
        )
    })

    it("does not write transformed code during dry run", async () => {
        const cwd = await makeProject()
        const original =
            'export function Button() { return <button className="flex" /> }\n'
        const sourcePath = await writeProjectFile(
            cwd,
            "src/components/button.tsx",
            original
        )

        await runTransform({
            cwd,
            targetPath: "src/components/button.tsx",
            options: { dryRun: true },
        })

        await expect(readFile(sourcePath, "utf-8")).resolves.toBe(original)
    })

    it("uses the default generator docs store instead of requiring a project-local store file", async () => {
        const cwd = await makeProject()
        await writeProjectFile(
            cwd,
            "src/components/button.tsx",
            'export function Button() { return <button className="flex" /> }\n'
        )

        await runTransform({
            cwd,
            targetPath: "src/components/button.tsx",
            options: { dryRun: true },
        })

        expect(tailwindMocks.generatorOptions).toHaveLength(1)
        expect(tailwindMocks.generatorOptions[0]).not.toHaveProperty(
            "storeRoot"
        )
    })

    it("recomputes relative tailwindest imports for nested files under a directory target", async () => {
        const cwd = await makeProject()
        await writeProjectFile(
            cwd,
            "src/components/ui/button.tsx",
            'export function Button() { return <button className="flex" /> }\n'
        )

        await runTransform({
            cwd,
            targetPath: "src/components",
            options: {},
        })

        expect(transformMock).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                sourcePath: join(cwd, "src/components/ui/button.tsx"),
                tailwindestModulePath: "../../styles/tailwind",
            })
        )
    })
})

describe("isDirectRun", () => {
    it("treats a symlinked bin path as direct execution", async () => {
        const cwd = await mkdtemp(join(tmpdir(), "tailwindest-css-cli-bin-"))
        const cliPath = await writeProjectFile(
            cwd,
            "dist/cli.js",
            "#!/usr/bin/env node\n"
        )
        const symlinkPath = join(cwd, "tailwindest-transform")
        await symlink(cliPath, symlinkPath)

        expect(isDirectRun(symlinkPath, pathToFileURL(cliPath).href)).toBe(true)
    })
})
