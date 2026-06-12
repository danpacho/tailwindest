import type { CSSPropertyResolver } from "create-tailwind-type"
import type {
    ClassSourcePlan,
    ClassSourceToken,
    ParsedToken,
    PreservedClassToken,
    StructuredClassToken,
} from "../types"
import { extractVariants, splitClassString } from "./split_utils"

type VariantAwareResolver = CSSPropertyResolver & {
    isKnownVariant?: (variant: string) => boolean
}

const STATE_VARIANTS = [
    "first",
    "last",
    "only",
    "odd",
    "even",
    "first-of-type",
    "last-of-type",
    "only-of-type",
    "visited",
    "target",
    "open",
    "default",
    "checked",
    "indeterminate",
    "placeholder-shown",
    "autofill",
    "optional",
    "required",
    "valid",
    "invalid",
    "user-valid",
    "user-invalid",
    "in-range",
    "out-of-range",
    "read-only",
    "empty",
    "focus-within",
    "hover",
    "focus",
    "focus-visible",
    "active",
    "enabled",
    "disabled",
    "inert",
]

const VARIANT_OPERATORS = [
    "in",
    "has",
    "aria",
    "data",
    "nth",
    "nth-last",
    "nth-of-type",
    "nth-last-of-type",
]

const DATA_STATE_VARIANTS = [
    "data-open",
    "data-closed",
    "data-checked",
    "data-unchecked",
    "data-selected",
    "data-disabled",
    "data-active",
    "data-horizontal",
    "data-vertical",
]

const MEDIA_VARIANTS = [
    "motion-safe",
    "motion-reduce",
    "contrast-more",
    "contrast-less",
    "max-sm",
    "max-md",
    "max-lg",
    "max-xl",
    "max-2xl",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "min-sm",
    "min-md",
    "min-lg",
    "min-xl",
    "min-2xl",
    "portrait",
    "landscape",
    "ltr",
    "rtl",
    "dark",
    "starting",
    "print",
    "forced-colors",
    "inverted-colors",
    "pointer-none",
    "pointer-coarse",
    "pointer-fine",
    "any-pointer-none",
    "any-pointer-coarse",
    "any-pointer-fine",
    "noscript",
]

const prefix = (name: string, variants: string[]) =>
    variants.map((variant) => `${name}-${variant}`)

const TYPED_VARIANT_KEYS = new Set([
    "*",
    "**",
    "first-letter",
    "first-line",
    "marker",
    "selection",
    "file",
    "placeholder",
    "backdrop",
    "details-content",
    "before",
    "after",
    "aria-busy",
    "aria-checked",
    "aria-disabled",
    "aria-expanded",
    "aria-hidden",
    "aria-pressed",
    "aria-readonly",
    "aria-required",
    "aria-selected",
    "data",
    "supports",
    "not-supports",
    "not-max",
    "not-min",
    "not-@",
    "not-@max",
    "not-@min",
    ...STATE_VARIANTS,
    ...VARIANT_OPERATORS,
    ...DATA_STATE_VARIANTS,
    ...MEDIA_VARIANTS,
    ...prefix("not", [
        ...STATE_VARIANTS,
        ...VARIANT_OPERATORS,
        ...DATA_STATE_VARIANTS,
        ...MEDIA_VARIANTS,
    ]),
    ...prefix("group", [
        ...STATE_VARIANTS,
        ...VARIANT_OPERATORS,
        ...DATA_STATE_VARIANTS,
        "ltr",
        "rtl",
        "dark",
    ]),
    ...prefix("peer", [
        ...STATE_VARIANTS,
        ...VARIANT_OPERATORS,
        ...DATA_STATE_VARIANTS,
        "ltr",
        "rtl",
        "dark",
    ]),
    ...prefix("in", [
        ...STATE_VARIANTS,
        ...VARIANT_OPERATORS,
        ...DATA_STATE_VARIANTS,
        "ltr",
        "rtl",
        "dark",
    ]),
    ...prefix("has", [
        ...STATE_VARIANTS,
        ...VARIANT_OPERATORS,
        ...DATA_STATE_VARIANTS,
        "ltr",
        "rtl",
        "dark",
    ]),
])

function isTypedArbitraryVariant(variant: string): boolean {
    return (
        /^\[[\s\S]+\]$/.test(variant) ||
        /^(?:group|peer)-[\s\S]+\/[\s\S]+$/.test(variant) ||
        /^(?:not-|group-|peer-|in-|has-)?(?:data|aria|has|nth|nth-last|nth-of-type|nth-last-of-type)-\[[\s\S]+\]$/.test(
            variant
        )
    )
}

function isTypedContainerVariant(variant: string): boolean {
    return /^@(?:min-|max-)?(?:3xs|2xs|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)(?:\/[\s\S]+)?$/.test(
        variant
    )
}

function isTypedVariantKey(
    variant: string,
    resolver: CSSPropertyResolver
): boolean {
    if ((resolver as VariantAwareResolver).isKnownVariant?.(variant)) {
        return true
    }
    if (isTypedArbitraryVariant(variant)) return true
    if (isTypedContainerVariant(variant)) return true
    return TYPED_VARIANT_KEYS.has(variant)
}

function normalizeUtilityForPropertyLookup(utility: string): string {
    return utility.replace(/^!/, "").replace(/!$/, "")
}

export interface TokenAnalyzer {
    analyze(classNames: string | string[]): ParsedToken[]
    plan(classNames: string | string[]): ClassSourcePlan
    buildObjectTree(tokens: ParsedToken[]): Record<string, any>
}

export class TokenAnalyzerImpl implements TokenAnalyzer {
    constructor(
        private readonly resolver: CSSPropertyResolver,
        private readonly groupPrefix: string = ""
    ) {}

    public analyze(classNames: string | string[]): ParsedToken[] {
        let tokens: string[]
        if (Array.isArray(classNames)) {
            tokens = classNames.flatMap((c) => splitClassString(c))
        } else {
            tokens = splitClassString(classNames)
        }

        return tokens.map((token) => {
            const { utility, variants } = extractVariants(token)
            const property = this.resolver.resolveUnambiguous(
                normalizeUtilityForPropertyLookup(utility)
            )
            const parsedToken: ParsedToken = {
                original: token,
                utility,
                property,
                variants,
            }

            if (!property) {
                parsedToken.warning = `Could not resolve property for utility: ${utility}`
            }

            return parsedToken
        })
    }

    public plan(classNames: string | string[]): ClassSourcePlan {
        const source = Array.isArray(classNames)
            ? classNames.join(" ")
            : classNames
        const tokens = this.analyze(classNames).map(
            (token, index): ClassSourceToken => {
                if (token.property) {
                    if (
                        token.variants.some(
                            (variant) =>
                                !isTypedVariantKey(variant, this.resolver)
                        )
                    ) {
                        return {
                            ...token,
                            kind: "preserved",
                            index,
                            property: null,
                            reason: "unsafe-serialization",
                        }
                    }

                    return {
                        ...token,
                        kind: "structured",
                        index,
                        property: token.property,
                    }
                }

                return {
                    ...token,
                    kind: "preserved",
                    index,
                    property: null,
                    reason: "unresolved-property",
                }
            }
        )
        const structuredTokens = tokens.filter(
            (token): token is StructuredClassToken =>
                token.kind === "structured"
        )
        const preservedTokens = tokens.filter(
            (token): token is PreservedClassToken => token.kind === "preserved"
        )

        return {
            source,
            tokens,
            structuredTokens,
            preservedTokens,
            styleTree: this.buildObjectTree(structuredTokens),
        }
    }

    public buildObjectTree(tokens: ParsedToken[]): Record<string, any> {
        const result: Record<string, any> = {}

        for (const token of tokens) {
            if (!token.property) continue // Skip unresolved tokens

            let currentLevel = result

            // Traverse/create path for variants
            for (const variant of token.variants) {
                const variantKey = this.groupPrefix
                    ? `${this.groupPrefix}${variant}`
                    : variant

                if (!(variantKey in currentLevel)) {
                    currentLevel[variantKey] = {}
                } else if (
                    typeof currentLevel[variantKey] !== "object" ||
                    Array.isArray(currentLevel[variantKey])
                ) {
                    // Collision at intermediate level (should not happen in valid Tailwind)
                    // but we handle it just in case
                    currentLevel[variantKey] = {
                        __prev: currentLevel[variantKey],
                    }
                }

                currentLevel = currentLevel[variantKey]
            }

            // Assign property at leaf level
            const propKey = token.property
            const leafValue = token.original
            if (!(propKey in currentLevel)) {
                currentLevel[propKey] = leafValue
            } else {
                // Key collision (Array promotion)
                const existing = currentLevel[propKey]
                if (Array.isArray(existing)) {
                    existing.push(leafValue)
                } else {
                    currentLevel[propKey] = [existing, leafValue]
                }
            }
        }

        return result
    }
}
