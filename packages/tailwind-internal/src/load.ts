import { TailwindCompiler } from "./compiler"
import { extractTailwindNestGroups } from "./extractor"
import { resolveTailwindNodeDir } from "./resolution"

export async function loadTailwindNestGroups(input: {
    cssRoot?: string
    cssSource?: string
    base?: string
}): Promise<string[]> {
    const base =
        input.base ?? (await resolveTailwindNodeDir(input.cssRoot ?? undefined))
    const compiler =
        input.cssSource === undefined
            ? new TailwindCompiler({
                  cssRoot: input.cssRoot ?? "tailwind.css",
                  base,
              })
            : new TailwindCompiler({ cssSource: input.cssSource, base })
    const designSystem = await compiler.getDesignSystem()
    return extractTailwindNestGroups(designSystem.getVariants())
}
