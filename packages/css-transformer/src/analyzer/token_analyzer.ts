import type { CSSPropertyResolver } from "create-tailwind-type"
import type { ParsedToken } from "../types"
import { extractVariants, splitClassString } from "./split_utils"

export interface TokenAnalyzer {
    analyze(classNames: string | string[]): ParsedToken[]
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
            const property = this.resolver.resolveUnambiguous(utility)
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
