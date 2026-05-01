import type { CompiledVariantResolver } from "./compiled_variant_resolver"

type StyleRecord = Record<string, unknown>

export interface CompiledStyleNormalizationOptions {
    variantResolver?: CompiledVariantResolver | undefined
}

export function styleNeedsCompiledVariantMetadata(value: unknown): boolean {
    return needsMetadata(value, 0)
}

export function flattenCompiledStyleRecord(
    value: unknown,
    options: CompiledStyleNormalizationOptions = {}
): string[] {
    return flattenValue(value, [], options)
}

function flattenValue(
    value: unknown,
    variants: string[],
    options: CompiledStyleNormalizationOptions
): string[] {
    if (!value) return []

    if (typeof value === "string") {
        return value
            .split(/\s+/)
            .filter(Boolean)
            .map((token) => applyVariantPrefix(token, variants, options))
    }

    if (Array.isArray(value)) {
        return value.flatMap((item) => flattenValue(item, variants, options))
    }

    if (typeof value === "object") {
        return Object.entries(value as StyleRecord).flatMap(([key, item]) => {
            if (isStyleRecord(item)) {
                return flattenNestedRecord(key, item, variants, options)
            }

            return flattenValue(item, variants, options)
        })
    }

    return []
}

function flattenNestedRecord(
    key: string,
    value: StyleRecord,
    variants: string[],
    options: CompiledStyleNormalizationOptions,
    keyApplied = false
): string[] {
    const parentVariants =
        !keyApplied && isCompiledVariantKey(key, options)
            ? [...variants, key]
            : variants

    return Object.entries(value).flatMap(([childKey, item]) => {
        if (isStyleRecord(item)) {
            const combined = options.variantResolver?.tryCombine(key, childKey)
            if (combined) {
                return flattenValue(item, [...variants, combined], options)
            }
            const nextVariants = isCompiledVariantKey(childKey, options)
                ? [...parentVariants, childKey]
                : parentVariants
            return flattenNestedRecord(
                childKey,
                item,
                nextVariants,
                options,
                nextVariants !== parentVariants
            )
        }
        return flattenValue(item, parentVariants, options)
    })
}

function isStyleRecord(value: unknown): value is StyleRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value)
}

function needsMetadata(value: unknown, depth: number): boolean {
    if (!value) return false
    if (typeof value === "string") {
        return depth > 0 && value.split(/\s+/).filter(Boolean).some(noPrefix)
    }
    if (Array.isArray(value)) {
        return value.some((item) => needsMetadata(item, depth))
    }
    if (typeof value === "object") {
        return Object.values(value as StyleRecord).some((item) => {
            return needsMetadata(item, isStyleRecord(item) ? depth + 1 : depth)
        })
    }
    return false
}

function noPrefix(token: string): boolean {
    return splitTopLevelColon(token).length < 2
}

function isCompiledVariantKey(
    key: string,
    options: CompiledStyleNormalizationOptions
): boolean {
    return options.variantResolver?.isVariantKey(key) ?? false
}

function applyVariantPrefix(
    token: string,
    variants: string[],
    options: CompiledStyleNormalizationOptions
): string {
    if (variants.length === 0) return token

    const prefix = `${variants.join(":")}:`
    if (token.startsWith(prefix)) return token

    for (let index = 1; index < variants.length; index += 1) {
        const suffixPrefix = `${variants.slice(index).join(":")}:`
        if (token.startsWith(suffixPrefix)) {
            return `${variants.slice(0, index).join(":")}:${token}`
        }
    }

    if (hasExplicitVariantPrefix(token, options)) return token

    return `${prefix}${token}`
}

function hasExplicitVariantPrefix(
    token: string,
    options: CompiledStyleNormalizationOptions
): boolean {
    const segments = splitTopLevelColon(token)
    if (segments.length < 2) return false

    return segments
        .slice(0, -1)
        .some((segment) => isVariantSegmentLike(segment, options))
}

function isVariantSegmentLike(
    segment: string,
    options: CompiledStyleNormalizationOptions
): boolean {
    return options.variantResolver?.isVariantKey(segment) ?? false
}

function splitTopLevelColon(token: string): string[] {
    const segments: string[] = []
    let start = 0
    let bracketDepth = 0
    let parenDepth = 0
    let quote: string | null = null

    for (let index = 0; index < token.length; index += 1) {
        const char = token[index]
        const previous = token[index - 1]

        if (quote) {
            if (char === quote && previous !== "\\") {
                quote = null
            }
            continue
        }

        if (char === "'" || char === '"') {
            quote = char
            continue
        }
        if (char === "[") {
            bracketDepth += 1
            continue
        }
        if (char === "]") {
            bracketDepth = Math.max(0, bracketDepth - 1)
            continue
        }
        if (char === "(") {
            parenDepth += 1
            continue
        }
        if (char === ")") {
            parenDepth = Math.max(0, parenDepth - 1)
            continue
        }
        if (char === ":" && bracketDepth === 0 && parenDepth === 0) {
            segments.push(token.slice(start, index))
            start = index + 1
        }
    }

    segments.push(token.slice(start))
    return segments
}
