import type { StyleBlock } from "./css_analyzer"
import type { TailwindTypeAliasMap } from "./generator"
import {
    sanitizeTwClass,
    kebabToCamelCase,
    capitalize,
    toValidCSSProperty,
    isTwClassPure,
    isNumericString,
    generateValidator,
} from "./css_property_utils"

export interface PropertyResolverDeps {
    candidatesToCss: (candidates: string[]) => (string | null)[]
    parseStyleBlock: (css: string) => StyleBlock | null
    typeAliasMap: TailwindTypeAliasMap
    variants: string[]
    colorVariableSet: Set<string>
}

export interface PropertyResolverLogger {
    warn: (msg: string) => void
    error: (msg: string) => void
}

export class CSSPropertyResolver {
    private readonly deps: PropertyResolverDeps
    private readonly logger: PropertyResolverLogger | null
    private readonly uniqueKeySet: Set<string>

    private readonly exceptionalRules: Map<
        string | RegExp,
        {
            property: string | Array<string>
            tester?: Array<RegExp | ((text: string) => boolean)>
        }
    >

    public constructor(
        deps: PropertyResolverDeps,
        logger?: PropertyResolverLogger
    ) {
        this.deps = deps
        this.logger = logger ?? null
        this.uniqueKeySet = new Set(deps.typeAliasMap.keys())
        this.exceptionalRules = this.buildExceptionalRules()
    }

    private buildExceptionalRules(): Map<
        string | RegExp,
        {
            property: string | Array<string>
            tester?: Array<RegExp | ((text: string) => boolean)>
        }
    > {
        const rules: Array<
            [
                string | RegExp,
                {
                    property: string | Array<string>
                    tester?: Array<RegExp | ((text: string) => boolean)>
                },
            ]
        > = [
            ["bg-conic", { property: "backgroundImage" }],
            [
                "size",
                {
                    property: ["width", "height"],
                    tester: [generateValidator("size-${string}")!],
                },
            ],
            [
                "font",
                {
                    property: "fontFamily",
                    tester: [
                        (className: string) => {
                            const fallbackPropertyName =
                                this.resolveFallback(className)

                            const possible =
                                fallbackPropertyName === "fontFamily"
                            return possible
                        },
                    ],
                },
            ],
            [
                "transform",
                {
                    property: "transformBox",
                    tester: [
                        (className: string) => {
                            const fallbackPropertyName =
                                this.resolveFallback(className)

                            const possible =
                                fallbackPropertyName === "transformBox"
                            return possible
                        },
                    ],
                },
            ],
            [
                "drop",
                {
                    property: "filter",
                    tester: [generateValidator("drop-shadow-${string}")!],
                },
            ],
        ]
        return new Map(rules)
    }

    private generateKey(className: string, keySet: Set<string>): string | null {
        if (keySet.has(className)) {
            return className
        }

        const keys = className
            .split("")
            .filter((name) => name === undefined || name !== "")

        let ptr = 0
        let key = keys[ptr]

        const possibleKeys: Array<string> = []

        while (ptr <= keys.length) {
            if (key && keySet.has(key)) {
                possibleKeys.push(key)
            }

            ptr = ptr + 1
            key = keys.slice(0, ptr).join("")
        }

        const possibleKey = possibleKeys[possibleKeys.length - 1]

        if (!possibleKey) {
            return null
        }

        if (!isTwClassPure(possibleKey)) {
            return null
        }

        return possibleKey.trim()
    }

    private resolveFallback(className: string): string | null {
        const findTrierClassNames = [
            // purified -> original
            sanitizeTwClass(className),
            className,
        ] as const

        const findPropertyByCSS = (className: string): string | null => {
            const extractUniqueKeysFromStyleSheet = (
                styleSheet: Record<string, string>
            ): readonly [string | null, Array<string>] => {
                const keys = Object.keys(styleSheet)

                const uniqueKey = keys
                    .map((key) => {
                        if (key === "") return null
                        if (key.startsWith("--") || key.startsWith("-"))
                            return null
                        if (key.startsWith("var")) return null
                        return key
                    })
                    .filter((e) => e !== null)
                    .map(toValidCSSProperty)

                if (uniqueKey.length !== 1) return [null, keys] as const

                return [uniqueKey[0]!, keys] as const
            }
            const css = this.deps.candidatesToCss([className])[0]
            if (!css) {
                return null
            }

            const styleBlock = this.deps.parseStyleBlock(css)
            if (!styleBlock) {
                this.logger?.warn(
                    `Can not generate css block from <${className}> css = ${typeof css}`
                )
                return null
            }

            const [uniqueProperty, styleValues] =
                extractUniqueKeysFromStyleSheet(styleBlock.styles)

            const matchedVariantName = this.deps.variants.find((variant) =>
                className.includes(variant)
            )

            if (uniqueProperty) {
                return uniqueProperty
            }

            if (!matchedVariantName) return null

            const combinedSet: Array<string> = styleValues
                .filter((value) => value.startsWith("--") === false)
                .map((value) => capitalize(matchedVariantName, value))

            if (combinedSet.length !== 1) return null

            return combinedSet[0]!
        }

        const removeDirectionName = (property: string): string => {
            const splitCamelCase = (input: string): string[] => {
                return input
                    .split(/(?=[A-Z])/)
                    .map((word) => word.toLowerCase())
            }
            const tokens = splitCamelCase(property)

            const filterOutDirectionalToken = (token: string) => {
                const directional = new Set([
                    "start",
                    "end",
                    "left",
                    "right",
                    "top",
                    "bottom",
                ])
                return directional.has(token)
            }

            const filtered = tokens.filter(filterOutDirectionalToken)
            if (filtered.length === 0) {
                return property
            }

            const directionRemovedProperty = kebabToCamelCase(
                filtered.join("-")
            )

            return directionRemovedProperty
        }

        const purifiedBasedProperty = findPropertyByCSS(findTrierClassNames[0])
        if (purifiedBasedProperty) {
            return removeDirectionName(purifiedBasedProperty)
        }

        const fullNameBasedProperty = findPropertyByCSS(findTrierClassNames[1])
        if (fullNameBasedProperty) {
            return removeDirectionName(fullNameBasedProperty)
        }

        return null
    }

    /**
     * Resolve a Tailwind class name to its corresponding CSS property name(s).
     * @returns The CSS property name, an array of property names, or null if unresolvable.
     */
    public resolve(className: string): string | Array<string> | null {
        // Exceptional case
        const sanitized = sanitizeTwClass(className)
        const exceptionRuleToken = sanitized.split("-")[0] ?? sanitized
        if (
            this.exceptionalRules.has(exceptionRuleToken) ||
            this.exceptionalRules.has(className)
        ) {
            const { property, tester } =
                this.exceptionalRules.get(exceptionRuleToken) ??
                this.exceptionalRules.get(className)!

            if (tester) {
                const testResult = tester.some((e) => {
                    if (e instanceof RegExp) {
                        return e.test(className)
                    } else {
                        return e(className)
                    }
                })
                if (testResult) {
                    return property
                }
            } else {
                return property
            }
        }

        const CSS = this.deps.candidatesToCss([className])[0]
        if (!CSS) {
            this.logger?.warn(`Can not transform <${className}> into css.`)
            return null
        }

        const tailwindKey: string | null =
            this.generateKey(sanitizeTwClass(className), this.uniqueKeySet) ??
            this.generateKey(className, this.uniqueKeySet)

        if (tailwindKey === null) {
            const property = this.resolveFallback(className)

            return property
        }

        const propertyAliasPossibility = this.deps.typeAliasMap.get(tailwindKey)

        const aliasList = Array.from(propertyAliasPossibility ?? [])

        const finder = (
            className: string,
            aliasSet: Set<string>
        ): "EXACT_FOUNDED" | "SIMILAR_FOUNDED" | "NOT_FOUNDED" => {
            if (aliasSet.has(className)) return "EXACT_FOUNDED"

            const sanitizedClassName = sanitizeTwClass(className)

            const tester = Array.from(aliasSet)
                .map((alias) => generateValidator(alias))
                .filter((e) => e !== null)

            if (tester.some((tester) => tester.test(sanitizedClassName))) {
                return "SIMILAR_FOUNDED"
            }

            const possibilities = className.split("-")
            const join = (currStr: string, possibilities: Array<string>) => {
                if (possibilities.length === 0) return [currStr]
                return possibilities.map((p) => `${p}-${currStr}`)
            }

            const key = possibilities.reduce<Array<string>>(
                (resultsArray, substr) => {
                    if (isNumericString(substr)) {
                        const withArbitrary = [
                            "${string}",
                            "(${string})",
                            "[${string}]",
                        ]
                            .map((arbitrary) =>
                                resultsArray
                                    .map((result) => join(arbitrary, [result]))
                                    .flat()
                            )
                            .flat()
                        resultsArray.push(...withArbitrary)
                        return resultsArray
                    }

                    return join(substr, resultsArray)
                },
                []
            )

            const founded = key.some((e) => aliasSet.has(e))
            return founded ? "SIMILAR_FOUNDED" : "NOT_FOUNDED"
        }

        const propertyNameSymbol = aliasList.reduce<{
            exact: Set<string>
            similar: Set<string>
        }>(
            (acc, [aliasSet, propertyName]) => {
                const foundType = finder(className, aliasSet)
                if (foundType === "EXACT_FOUNDED") {
                    acc.exact.add(propertyName)
                } else if (foundType === "SIMILAR_FOUNDED") {
                    acc.similar.add(propertyName)
                }

                return acc
            },
            {
                exact: new Set(),
                similar: new Set(),
            }
        )

        const exactNames = Array.from(propertyNameSymbol.exact)
        const similarNames = Array.from(propertyNameSymbol.similar)
        const propertyNameNotFounded =
            exactNames.length === 0 && similarNames.length === 0

        if (propertyNameNotFounded) {
            return this.resolveFallback(className)
        }

        if (exactNames.length >= 1) {
            return exactNames
        }

        if (similarNames.length === 1) {
            const fallbackByCSS = this.resolveFallback(className)
            if (fallbackByCSS === similarNames[0]) {
                return fallbackByCSS
            }
            return similarNames[0]!
        }

        const distinguishSimilarNames = (
            className: string,
            similarNames: Array<string>
        ): string | Array<string> | null => {
            let isColorProperty: boolean = false

            const divider = "-" as const
            const tokens = className.split("-")
            let ptr = tokens.length - 1
            let token: string = tokens[ptr]!
            while (ptr >= 1) {
                token = tokens[ptr - 1]! + divider + token
                if (this.deps.colorVariableSet.has(token)) {
                    isColorProperty = true
                    break
                }
                ptr = ptr - 1
            }

            const cssBlock = this.deps.parseStyleBlock(CSS)
            const colorProperty = new Set(
                Object.entries(cssBlock?.styles ?? {}).reduce<Array<string>>(
                    (acc, [key, value]) => {
                        if (value.toLowerCase().includes("color")) {
                            acc.push(key)
                        }
                        return acc
                    },
                    []
                )
            )

            const nameMap = similarNames.reduce<{
                color: string[]
                nonColor: string[]
            }>(
                (acc, property) => {
                    const lowerCasedProperty = property.toLowerCase()
                    const isColorProperty = lowerCasedProperty.includes("color")

                    if (isColorProperty || colorProperty.has(property)) {
                        acc.color.push(property)
                        return acc
                    } else {
                        acc.nonColor.push(property)
                        return acc
                    }
                },
                {
                    color: [],
                    nonColor: [],
                }
            )

            if (isColorProperty) {
                if (nameMap.color.length === 0) {
                    this.logger?.error(
                        `Color-like property ${className} has not found appropriate property in ${similarNames.toString()}`
                    )
                    return null
                }
                if (nameMap.color.length > 1) {
                    this.logger?.error(
                        `Color-like property ${className} has found many appropriate property in ${nameMap.color.toString()}`
                    )
                    return nameMap.color[0]!
                }
                return nameMap.color[0]!
            }

            if (nameMap.nonColor.length === 0) {
                this.logger?.error(
                    `NonColor-like property ${className} has not found appropriate property in ${similarNames.toString()}`
                )
                return null
            }

            if (nameMap.nonColor.length > 1) {
                const findFinalNonColorProperty = (
                    nonColorLike: Array<string>
                ) => {
                    return nonColorLike.filter((property) =>
                        ["width", "height", "margin", "padding", "inset"].some(
                            (nonColorProperty) =>
                                property
                                    .toLowerCase()
                                    .includes(nonColorProperty)
                        )
                    )
                }

                const shouldBeNonColorProperty = findFinalNonColorProperty(
                    nameMap.nonColor
                )

                if (shouldBeNonColorProperty.length !== 1) {
                    this.logger?.warn(
                        `NonColor-like property ${className} has found many appropriate property in ${shouldBeNonColorProperty.toString()}`
                    )
                }

                return shouldBeNonColorProperty
            }

            return nameMap.nonColor
        }

        return distinguishSimilarNames(className, similarNames)
    }

    /**
     * Resolve a class name to a single unambiguous property name.
     * If the result is an array, returns the first element.
     * @returns A single CSS property name, or null if unresolvable.
     */
    public resolveUnambiguous(className: string): string | null {
        const result = this.resolve(className)
        if (result === null) return null
        if (Array.isArray(result)) {
            return result[0] ?? null
        }
        return result
    }
}
