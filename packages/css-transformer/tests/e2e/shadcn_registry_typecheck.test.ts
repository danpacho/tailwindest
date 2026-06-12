import { execFile } from "node:child_process"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { promisify } from "node:util"
import { describe, expect, it } from "vitest"
import {
    createShadcnRegistryHarness,
    listShadcnInputFiles,
    readShadcnFixture,
} from "./shadcn_registry_helpers"

const execFileAsync = promisify(execFile)
const repoRoot = path.resolve(__dirname, "../../../..")
const tscBin = path.join(repoRoot, "node_modules/typescript/bin/tsc")
const tempRootBase = path.join(os.tmpdir(), "tailwindest-shadcn-typecheck")

describe("Shadcn Registry Typecheck", async () => {
    const inputFiles = await listShadcnInputFiles()
    const harness = await createShadcnRegistryHarness()

    it("fails the typecheck harness for known unsafe Tailwindest object keys", async () => {
        const projectRoot = await createTypecheckProjectRoot("negative")

        try {
            await writeTypecheckSupportFiles(projectRoot)
            await writeFile(
                path.join(projectRoot, "negative.tsx"),
                [
                    `import { tw } from "~/tw"`,
                    ``,
                    `tw.style({`,
                    `    xs: {`,
                    `        width: "xs:w-(--popup-width)",`,
                    `    },`,
                    `})`,
                    ``,
                ].join("\n")
            )

            const result = await runTsc(projectRoot)

            expect(result.success).toBe(false)
            expect(result.output).toContain(`'xs' does not exist`)
        } finally {
            await removeTypecheckProjectRoot(projectRoot)
        }
    }, 120_000)

    it("emits transformed registry output as typecheckable tsx files", async () => {
        const projectRoot = await createTypecheckProjectRoot("registry")

        try {
            await writeTypecheckSupportFiles(projectRoot)

            for (const file of inputFiles) {
                const content = await readShadcnFixture(file)
                const sourceFile = harness.createSourceFile(file, content)
                const context = harness.transform(sourceFile)
                const errors = context.diagnostics.filter(
                    (diagnostic) => diagnostic.level === "error"
                )

                expect(errors).toHaveLength(0)
                await writeFile(
                    getRegistryOutputPath(projectRoot, file),
                    sourceFile.getFullText()
                )
            }

            const result = await runTsc(projectRoot)

            expect(result.output).toBe("")
            expect(result.success).toBe(true)
        } finally {
            await removeTypecheckProjectRoot(projectRoot)
        }
    }, 120_000)
})

async function createTypecheckProjectRoot(label: string): Promise<string> {
    const root = `${tempRootBase}-${label}-${process.pid}-${Date.now()}`
    await fs.rm(root, { force: true, recursive: true })
    await fs.mkdir(root, { recursive: true })
    return root
}

async function removeTypecheckProjectRoot(root: string): Promise<void> {
    await fs.rm(root, { force: true, recursive: true })
}

async function writeTypecheckSupportFiles(projectRoot: string): Promise<void> {
    await Promise.all([
        fs.copyFile(
            path.join(repoRoot, "packages/tailwindest/tailwind.2.ts"),
            path.join(projectRoot, "tailwind.ts")
        ),
        writeFile(path.join(projectRoot, "tsconfig.json"), tsconfigJson()),
        writeFile(path.join(projectRoot, "tw.ts"), twModuleSource()),
        writeFile(
            path.join(projectRoot, "typecheck-sentinel.ts"),
            typecheckSentinelSource()
        ),
        writeFile(
            path.join(projectRoot, "external-stubs.d.ts"),
            externalStubsSource()
        ),
        writeFile(path.join(projectRoot, "lib/utils.ts"), utilsModuleSource()),
        writeFile(
            path.join(projectRoot, "registry/new-york/lib/utils.ts"),
            utilsModuleSource()
        ),
        writeFile(
            path.join(projectRoot, "registry/new-york/hooks/use-mobile.ts"),
            `export function useIsMobile(): boolean { return false }\n`
        ),
    ])
}

async function writeFile(filePath: string, content: string): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, content)
}

function getRegistryOutputPath(projectRoot: string, file: string): string {
    const match = /^input_[^_]+_(.+)\.txt$/.exec(file)
    if (!match) {
        throw new Error(`Unexpected shadcn fixture file name: ${file}`)
    }

    const moduleName = match[1]!
    const section = moduleName.startsWith("use-") ? "hooks" : "ui"
    return path.join(
        projectRoot,
        `registry/new-york/${section}/${moduleName}.tsx`
    )
}

async function runTsc(
    projectRoot: string
): Promise<{ success: boolean; output: string }> {
    try {
        await execFileAsync(
            process.execPath,
            [tscBin, "--project", "tsconfig.json", "--pretty", "false"],
            {
                cwd: projectRoot,
                maxBuffer: 1024 * 1024 * 20,
            }
        )

        return { success: true, output: "" }
    } catch (error) {
        const execError = error as {
            stdout?: string | Buffer
            stderr?: string | Buffer
        }
        return {
            success: false,
            output: [execError.stdout, execError.stderr]
                .filter(Boolean)
                .map((chunk) => chunk!.toString())
                .join("\n"),
        }
    }
}

function tsconfigJson(): string {
    return `${JSON.stringify(
        {
            compilerOptions: {
                strict: true,
                noImplicitAny: false,
                target: "esnext",
                module: "esnext",
                lib: ["dom", "dom.iterable", "esnext"],
                esModuleInterop: true,
                moduleResolution: "bundler",
                noUncheckedIndexedAccess: true,
                exactOptionalPropertyTypes: false,
                forceConsistentCasingInFileNames: true,
                noEmit: true,
                skipLibCheck: true,
                jsx: "react-jsx",
                ignoreDeprecations: "6.0",
                types: ["node", "react"],
                typeRoots: [path.join(repoRoot, "node_modules/@types")],
                baseUrl: ".",
                paths: {
                    "@/*": ["./*"],
                    "~/*": ["./*"],
                    tailwindest: [
                        path.join(
                            repoRoot,
                            "packages/tailwindest/src/index.ts"
                        ),
                    ],
                    "tailwindest/*": [
                        path.join(repoRoot, "packages/tailwindest/src/*"),
                    ],
                    "@tailwindest/core": [
                        path.join(
                            repoRoot,
                            "packages/tailwindest-core/src/index.ts"
                        ),
                    ],
                    "@tailwindest/core/*": [
                        path.join(repoRoot, "packages/tailwindest-core/src/*"),
                    ],
                },
            },
            include: ["**/*.ts", "**/*.tsx"],
        },
        null,
        4
    )}\n`
}

function twModuleSource(): string {
    return [
        `import { createTools, type CreateTailwindest } from "tailwindest"`,
        `import type { Tailwind, TailwindNestGroups } from "./tailwind"`,
        ``,
        `export type Tailwindest = CreateTailwindest<{`,
        `    tailwind: Tailwind`,
        `    tailwindNestGroups: TailwindNestGroups`,
        `    useArbitrary: true`,
        `    useArbitraryNestGroups: true`,
        `}>`,
        ``,
        `export const tw = createTools<{`,
        `    tailwindest: Tailwindest`,
        `    tailwindLiteral: string`,
        `    useArbitrary: true`,
        `    useTypedClassLiteral: true`,
        `}>()`,
        ``,
    ].join("\n")
}

function typecheckSentinelSource(): string {
    return [
        `import { tw } from "~/tw"`,
        ``,
        `// @ts-expect-error verifies real Tailwindest object typing is active`,
        `tw.style({ __notTailwindestProperty: "flex" })`,
        ``,
    ].join("\n")
}

function utilsModuleSource(): string {
    return [
        `export function cn(...inputs: unknown[]): string {`,
        `    return inputs.filter(Boolean).join(" ")`,
        `}`,
        ``,
    ].join("\n")
}

function externalStubsSource(): string {
    return [
        `declare module "class-variance-authority" {`,
        `    export const cva: any`,
        `    export type VariantProps<T> = any`,
        `}`,
        ``,
        `declare module "@radix-ui/react-slot" {`,
        `    export const Slot: any`,
        `}`,
        ``,
        `declare module "@radix-ui/react-*" {`,
        `    export const Root: any`,
        `    export const Trigger: any`,
        `    export const Content: any`,
        `    export const CollapsibleTrigger: any`,
        `    export const CollapsibleContent: any`,
        `    export const Item: any`,
        `    export const Header: any`,
        `    export const Footer: any`,
        `    export const Title: any`,
        `    export const Description: any`,
        `    export const List: any`,
        `    export const Link: any`,
        `    export const Anchor: any`,
        `    export const Overlay: any`,
        `    export const Portal: any`,
        `    export const Provider: any`,
        `    export const Close: any`,
        `    export const Cancel: any`,
        `    export const Action: any`,
        `    export const Menu: any`,
        `    export const Value: any`,
        `    export const Icon: any`,
        `    export const Viewport: any`,
        `    export const Group: any`,
        `    export const Label: any`,
        `    export const Separator: any`,
        `    export const CheckboxItem: any`,
        `    export const RadioItem: any`,
        `    export const RadioGroup: any`,
        `    export const RadioGroupItem: any`,
        `    export const ItemIndicator: any`,
        `    export const ItemText: any`,
        `    export const Sub: any`,
        `    export const SubTrigger: any`,
        `    export const SubContent: any`,
        `    export const Indicator: any`,
        `    export const Thumb: any`,
        `    export const Track: any`,
        `    export const Range: any`,
        `    export const Corner: any`,
        `    export const ScrollAreaScrollbar: any`,
        `    export const ScrollAreaThumb: any`,
        `    export const Image: any`,
        `    export const Fallback: any`,
        `    export const ScrollUpButton: any`,
        `    export const ScrollDownButton: any`,
        `    export type DialogProps = any`,
        `}`,
        ``,
        `declare module "lucide-react" {`,
        `    export const ArrowLeft: any`,
        `    export const ArrowRight: any`,
        `    export const Check: any`,
        `    export const ChevronDown: any`,
        `    export const ChevronDownIcon: any`,
        `    export const ChevronLeft: any`,
        `    export const ChevronLeftIcon: any`,
        `    export const ChevronRight: any`,
        `    export const ChevronRightIcon: any`,
        `    export const ChevronUp: any`,
        `    export const Circle: any`,
        `    export const GripVertical: any`,
        `    export const Minus: any`,
        `    export const MoreHorizontal: any`,
        `    export const PanelLeft: any`,
        `    export const Search: any`,
        `    export const X: any`,
        `}`,
        ``,
        `declare module "cmdk" {`,
        `    export const Command: any`,
        `}`,
        ``,
        `declare module "embla-carousel-react" {`,
        `    export type UseEmblaCarouselType = [any, any]`,
        `    export default function useEmblaCarousel(...args: any[]): UseEmblaCarouselType`,
        `}`,
        ``,
        `declare module "input-otp" {`,
        `    import type * as React from "react"`,
        `    export const OTPInput: any`,
        `    export const OTPInputContext: React.Context<any>`,
        `}`,
        ``,
        `declare module "next-themes" {`,
        `    export function useTheme(): { theme?: string }`,
        `}`,
        ``,
        `declare module "react-day-picker" {`,
        `    export const DayButton: any`,
        `    export const DayPicker: any`,
        `    export function getDefaultClassNames(): Record<string, string>`,
        `}`,
        ``,
        `declare module "react-resizable-panels" {`,
        `    export const Panel: any`,
        `    export const PanelGroup: any`,
        `    export const PanelResizeHandle: any`,
        `}`,
        ``,
        `declare module "recharts" {`,
        `    export const Legend: any`,
        `    export type LegendProps = any`,
        `    export const ResponsiveContainer: any`,
        `    export const Tooltip: any`,
        `}`,
        ``,
        `declare module "sonner" {`,
        `    export const Toaster: any`,
        `}`,
        ``,
        `declare module "vaul" {`,
        `    export const Drawer: any`,
        `}`,
        ``,
    ].join("\n")
}
