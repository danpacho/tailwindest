import type { TailwindVariantEntry } from "./compiler"

export function extractTailwindNestGroups(
    variants: readonly TailwindVariantEntry[]
): string[] {
    const ignoredValues = new Set(["group", "peer", "not"])
    return variants.flatMap((entry) => {
        if (entry.values.length === 0) return [entry.name]
        return entry.values.flatMap((value) =>
            ignoredValues.has(value)
                ? []
                : [`${entry.name}${entry.hasDash ? "-" : ""}${value}`]
        )
    })
}
