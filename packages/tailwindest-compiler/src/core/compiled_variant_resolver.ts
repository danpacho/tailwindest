export interface CompiledVariantResolver {
    isVariantKey(key: string): boolean
    tryCombine(parent: string, child: string): string | null
}

export function createCompiledVariantResolver(
    variantKeys: readonly string[]
): CompiledVariantResolver {
    const variants = new Set(variantKeys)

    return {
        isVariantKey(key) {
            return variants.has(key)
        },
        tryCombine(parent, child) {
            const combined = `${parent}-${child}`
            return variants.has(combined) ? combined : null
        },
    }
}
