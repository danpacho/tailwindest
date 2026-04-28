type StyleRecord = Record<string, unknown>

export const DEFAULT_VARIANT_KEYS = new Set<string>([
    "hover",
    "focus",
    "focus-visible",
    "focus-within",
    "active",
    "visited",
    "disabled",
    "enabled",
    "checked",
    "indeterminate",
    "required",
    "valid",
    "invalid",
    "in-range",
    "out-of-range",
    "placeholder-shown",
    "autofill",
    "read-only",
    "open",
    "first",
    "last",
    "only",
    "odd",
    "even",
    "first-of-type",
    "last-of-type",
    "only-of-type",
    "empty",
    "target",
    "default",
    "optional",
    "dark",
    "*",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "max-sm",
    "max-md",
    "max-lg",
    "max-xl",
    "max-2xl",
    "portrait",
    "landscape",
    "rtl",
    "ltr",
    "motion-safe",
    "motion-reduce",
    "contrast-more",
    "contrast-less",
    "forced-colors",
    "print",
    "aria-checked",
    "aria-disabled",
    "aria-expanded",
    "aria-hidden",
    "aria-pressed",
    "aria-readonly",
    "aria-required",
    "aria-selected",
    "before",
    "after",
    "placeholder",
    "file",
    "marker",
    "backdrop",
    "selection",
    "first-line",
    "first-letter",
])

export interface StyleNormalizationOptions {
    isVariantKey?: (key: string) => boolean
}

const COMPOUND_VARIANT_KEYS = new Set(["group", "peer"])

export function flattenStyleRecord(
    value: unknown,
    options: StyleNormalizationOptions = {}
): string[] {
    return flattenValue(value, [], options)
}

function flattenValue(
    value: unknown,
    variants: string[],
    options: StyleNormalizationOptions
): string[] {
    if (!value) return []

    if (typeof value === "string") {
        return value
            .split(/\s+/)
            .filter(Boolean)
            .map((token) => applyVariantPrefix(token, variants))
    }

    if (Array.isArray(value)) {
        return value.flatMap((item) => flattenValue(item, variants, options))
    }

    if (typeof value === "object") {
        return Object.entries(value as StyleRecord).flatMap(([key, item]) => {
            if (COMPOUND_VARIANT_KEYS.has(key) && isStyleRecord(item)) {
                return flattenCompoundVariant(key, item, variants, options)
            }

            const nextVariants = isVariantKey(key, options)
                ? [...variants, key]
                : variants
            return flattenValue(item, nextVariants, options)
        })
    }

    return []
}

function flattenCompoundVariant(
    key: string,
    value: StyleRecord,
    variants: string[],
    options: StyleNormalizationOptions
): string[] {
    return Object.entries(value).flatMap(([childKey, item]) => {
        if (isVariantKey(childKey, options)) {
            return flattenValue(
                item,
                [...variants, `${key}-${childKey}`],
                options
            )
        }

        return flattenValue(item, variants, options)
    })
}

function isStyleRecord(value: unknown): value is StyleRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isVariantKey(
    key: string,
    options: StyleNormalizationOptions
): boolean {
    if (options.isVariantKey) return options.isVariantKey(key)
    return (
        DEFAULT_VARIANT_KEYS.has(key) ||
        key.startsWith("@") ||
        (key.includes("[") && key.endsWith("]"))
    )
}

function applyVariantPrefix(token: string, variants: string[]): string {
    if (variants.length === 0) return token

    const prefix = `${variants.join(":")}:`
    if (token.startsWith(prefix)) return token

    for (let index = 1; index < variants.length; index += 1) {
        const suffixPrefix = `${variants.slice(index).join(":")}:`
        if (token.startsWith(suffixPrefix)) {
            return `${variants.slice(0, index).join(":")}:${token}`
        }
    }

    if (hasExplicitVariantPrefix(token)) return token

    return `${prefix}${token}`
}

function hasExplicitVariantPrefix(token: string): boolean {
    const segments = splitTopLevelColon(token)
    if (segments.length < 2) return false

    return segments
        .slice(0, -1)
        .some((segment) => isVariantSegmentLike(segment))
}

function isVariantSegmentLike(segment: string): boolean {
    return (
        DEFAULT_VARIANT_KEYS.has(segment) ||
        segment === "**" ||
        segment.startsWith("@") ||
        segment.startsWith("group-") ||
        segment.startsWith("peer-") ||
        (segment.includes("[") && segment.endsWith("]"))
    )
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
