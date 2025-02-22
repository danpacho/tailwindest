import type {
    ClassEntry,
    TailwindCompiler,
    VariantEntry,
} from "../internal/compiler"
import { Logger } from "../logger"
import type { TypeSchemaGenerator } from "../type_tools"
import * as t from "../type_tools"
import { CSSAnalyzer } from "./css_analyzer"
import { readFile, writeFile } from "fs/promises"

const capitalize = (...text: string[]): string =>
    text
        .map((word) => {
            if (word.length === 1) {
                return word.toUpperCase()
            } else if (word.length === 2) {
                return word[0]!.toUpperCase() + word[1]!.toLowerCase()
            } else {
                if (!word[0]) return word[0]
                return word[0]!.toUpperCase() + word.slice(1)
            }
        })
        .join("")

const kebabToCamelCase = (str: string): string => {
    return str.replace(/-./g, (match) => match[1]?.toUpperCase() ?? "")
}

const camelToKebabCase = (str: string): string => {
    return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
}

const toValidCSSProperty = (property: string): string => {
    const withoutPrefix = property.replace(/^-(webkit|moz|ms|o)-/, "")

    return withoutPrefix.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}

const isTwClassPure = (text: string): boolean => {
    return /^[A-Za-z\s]+$/.test(text.replaceAll("-", ""))
}

const sanitizeTwClass = (className: string): string => {
    const nonSigned = className.startsWith("-") ? className.slice(1) : className
    const direction = new Set(["x", "y", "z", "t", "l", "b", "r", "e", "s"])
    const tokens = nonSigned.split("-")
    const nonDirection = tokens.filter(
        (e) =>
            direction.has(e) === false ||
            (e.length === 2 && direction.has(e[1] ?? ""))
    )

    return nonDirection.join("-")
}

const isNumericString = (str: string): boolean => {
    if (str.trim() === "") {
        return false
    }
    const num = Number(str)
    const parsed = parseFloat(str)
    return !isNaN(num) && isFinite(num) && !isNaN(parsed)
}

/**
 * Generates a RegExp to validate strings matching a template that contains a token.
 */
const generateValidator = (rawText: string): RegExp | null => {
    const escapeRegex = (str: string): string =>
        str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")

    // "${string}" kinda pattern
    const tokenPattern = /\$\{([^}]+)\}/g

    if (!tokenPattern.test(rawText)) {
        return null
    }

    tokenPattern.lastIndex = 0

    let regexStr = "^"
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = tokenPattern.exec(rawText)) !== null) {
        const tokenStart = match.index
        const tokenEnd = tokenPattern.lastIndex

        // Look at the literal text before the token.
        let literalBefore = rawText.slice(lastIndex, tokenStart)
        // Remove any trailing whitespace.
        const trimmedBefore = literalBefore.replace(/\s+$/, "")
        let parenLeft = false
        if (trimmedBefore.endsWith("(")) {
            parenLeft = true
        }

        // Look at what comes immediately after the token.
        const afterText = rawText.slice(tokenEnd)
        // Match any leading whitespace followed by a ")".
        const afterMatch = afterText.match(/^(\s*\))/)
        const parenRight = !!afterMatch

        if (parenLeft && parenRight) {
            // Remove the left parenthesis from the literal.
            literalBefore = trimmedBefore.slice(0, -1)
            regexStr += escapeRegex(literalBefore)
            // Insert a capture group that matches one or more characters.
            regexStr += "(.+)"
            // Skip over the token and the matched whitespace and closing ")".
            lastIndex = tokenEnd + (afterMatch ? afterMatch[0].length : 0)
        } else {
            // No surrounding parentheses to ignore – use the literal parts as is.
            regexStr += escapeRegex(rawText.slice(lastIndex, tokenStart))
            regexStr += "(.+)"
            lastIndex = tokenEnd
        }
    }

    // Append any remaining literal text (escaped) after the last token.
    regexStr += escapeRegex(rawText.slice(lastIndex))
    regexStr += "$"

    return new RegExp(regexStr)
}

interface TailwindDocs {
    title: string
    description: string
    link: string
    classNames: Array<string>
    uniqueIdentifier: Array<string>
}

interface TailwindCollectionRecord {
    propertyName: string
    classNames: Array<string>
    variants: Array<string>
}

interface OptimizableMap {
    propertyName: string
    hasNegative: boolean
    soleGroups: Array<string>
    prefixGroups: Array<string>
    valueGroups: Array<string>
    variants: Array<string> | null
    prefixValueMapping: Array<{
        prefix: string
        values: Array<string>
        hasNegative: boolean
    }>
    valueReferenceMap: Map<string, Array<string>>
}

type TailwindCollection = Record<
    TailwindCollectionRecord["propertyName"],
    Omit<TailwindCollectionRecord, "propertyName">
>

type TailwindTypeAliasMap = Map<
    TailwindDocs["uniqueIdentifier"][number],
    Map<Set<TailwindDocs["classNames"][number]>, TailwindDocs["title"]>
>

interface TailwindTypeGenerationOptions {
    useArbitraryValue?: boolean
    useExactVariants?: boolean
    useSoftVariants?: boolean
    useStringKindVariantsOnly?: boolean
    useDocs?: boolean
}
interface TailwindTypeGeneratorDeps {
    compiler: TailwindCompiler
    generator: TypeSchemaGenerator
    cssAnalyzer: CSSAnalyzer
}
interface TailwindTypeGeneratorOptions extends TailwindTypeGenerationOptions {
    storeRoot?: string
}

interface TailwindTypeGeneratorConstructor
    extends TailwindTypeGeneratorDeps,
        TailwindTypeGeneratorOptions {}
export class TailwindTypeGenerator {
    private _ds: Awaited<
        ReturnType<(typeof this.compiler)["getDesignSystem"]>
    > | null = null
    public get ds() {
        if (!this._ds)
            throw new Error("Design system is not created, call init first")
        return this._ds
    }
    private _initialized: boolean = false
    private _classList: Array<ClassEntry> | null = null
    public get classList() {
        if (!this._classList)
            throw new Error("Design system is not created, call init first")
        return this._classList!
    }
    private _variantsEntry: Array<VariantEntry> | null = null
    public get variantsEntry() {
        if (!this._variantsEntry)
            throw new Error("Design system is not created, call init first")
        return this._variantsEntry!
    }
    public variants: Array<string> = []

    private readonly $: Logger = new Logger({
        name: "create-tailwind-type",
    })

    public readonly compiler: TailwindCompiler
    public readonly generator: TypeSchemaGenerator
    private readonly cssAnalyzer: CSSAnalyzer
    private static storeRoot = {
        docs: `${__dirname}/dist/store/docs.json`,
    } as const
    private _storeRoot: string | null
    private get storeRoot(): string {
        if (this._storeRoot) return this._storeRoot
        return TailwindTypeGenerator.storeRoot.docs
    }

    private _typeAliasMap: TailwindTypeAliasMap | null = null
    public get typeAliasMap(): TailwindTypeAliasMap {
        if (!this._typeAliasMap)
            throw new Error(
                `TypeAliasMap should be inquired after generated(init).`
            )
        return this._typeAliasMap
    }

    private _docStore: Array<TailwindDocs> | null = null
    private get docStore(): Array<TailwindDocs> {
        if (!this._docStore)
            throw new Error(`DocStore should be exist at ${this.storeRoot}.`)

        return this._docStore
    }

    private genOptions: TailwindTypeGenerationOptions = {
        useDocs: true,
        useArbitraryValue: true,
        // variants options
        useExactVariants: false,
        useSoftVariants: true,
        useStringKindVariantsOnly: false,
    }
    public setGenOptions(newOptions: TailwindTypeGenerationOptions): this {
        if (newOptions.useExactVariants === newOptions.useSoftVariants) {
            this.$.error(
                `Invalid generation option, useExactVariants can't be same as useSoftVariants(${newOptions.useSoftVariants}). Skipped.`
            )
            return this
        }
        this.genOptions = newOptions
        return this
    }

    public constructor(opt: TailwindTypeGeneratorConstructor) {
        this.compiler = opt.compiler
        this.generator = opt.generator
        this.cssAnalyzer = opt.cssAnalyzer
        this._storeRoot = opt.storeRoot ?? null
        this.genOptions = {
            useDocs: opt.useDocs ?? true,
            useArbitraryValue: opt.useArbitraryValue ?? true,
            useSoftVariants: opt.useSoftVariants ?? true,
            useExactVariants: opt.useExactVariants ?? false,
            useStringKindVariantsOnly: opt.useStringKindVariantsOnly ?? false,
        }
    }

    private async prepareTypeAliasMap(): Promise<void> {
        const store: Array<TailwindDocs> = JSON.parse(
            await readFile(this.storeRoot, {
                encoding: "utf-8",
            })
        ) as Array<TailwindDocs>

        this._docStore = store

        const typeAliasMap = store.reduce<TailwindTypeAliasMap>((acc, curr) => {
            curr.uniqueIdentifier.forEach((identifier) => {
                const alias = kebabToCamelCase(curr.title)

                if (isTwClassPure(alias)) {
                    const propertyMap: Map<
                        Set<TailwindDocs["classNames"][number]>,
                        TailwindDocs["title"]
                    > = acc.get(identifier) ?? new Map()

                    propertyMap.set(new Set(curr.classNames), alias)
                    acc.set(identifier, propertyMap)
                }
            })
            return acc
        }, new Map())

        this._typeAliasMap = typeAliasMap
    }

    public async init() {
        if (this._initialized) {
            return
        }

        try {
            this._ds = await this.compiler.getDesignSystem()
            this._classList = this._ds.getClassList()
            this._variantsEntry = this._ds.getVariants()
            this.variants = this.extractVariants()

            await this.prepareTypeAliasMap()

            this._initialized = true
            this.$.success("initialized")

            this.$.info("generation options")
            Object.entries(this.genOptions).forEach(([optKey, optValue]) => {
                this.$.log(`${optKey} : ${optValue}`)
            })
        } catch (e) {
            this._initialized = false
            this.$.error("initialization failed")
            this.$.log(`${JSON.stringify(e, null, 4)}`)
        }
    }

    private extractVariants(): Array<string> {
        // exception lists
        const exception = new Set(["group", "peer", "not"])

        const fullVariants: Array<string> = this.variantsEntry
            .map((e) => {
                const merged = e.values.map((value) => {
                    if (exception.has(value)) {
                        return null
                    }
                    return `${e.name}${e.hasDash ? "-" : ""}${value}`
                })
                if (e.values.length === 0) {
                    merged.push(e.name)
                }
                return merged
            })
            .flat()
            .filter((e) => e !== null)

        return fullVariants
    }

    private hash(str: string, seed: number = 0): string {
        let h1 = seed ^ str.length
        let k1

        for (let i = 0; i < str.length; i++) {
            k1 = str.charCodeAt(i)
            k1 = Math.imul(k1, 0xcc9e2d51)
            k1 = (k1 << 15) | (k1 >>> 17)
            k1 = Math.imul(k1, 0x1b873593)

            h1 ^= k1
            h1 = (h1 << 13) | (h1 >>> 19)
            h1 = Math.imul(h1, 5) + 0xe6546b64
        }

        h1 ^= str.length
        h1 ^= h1 >>> 16
        h1 = Math.imul(h1, 0x85ebca6b)
        h1 ^= h1 >>> 13
        h1 = Math.imul(h1, 0xc2b2ae35)
        h1 ^= h1 >>> 16

        return (h1 >>> 0).toString(16)
    }

    private extractTypeFromMap(
        mapType: Map<string, string | t.Type>
    ): Array<t.Type> {
        return Object.values(Object.fromEntries(mapType)).filter(
            (e) => typeof e !== "string"
        )
    }
    private variantsMap: Map<string, t.Type> = new Map()
    private getVariantsLiteral(variants: Array<string>): t.Type {
        const key = this.hash(variants.join(""))

        if (this.variantsMap.has(key)) {
            return this.variantsMap.get(key)!
        }

        let isNumberIncluded: boolean = false
        const literalList = variants
            .filter((variant) => {
                const isNumberLikeVariant = isNumericString(variant)
                if (isNumberLikeVariant) {
                    isNumberIncluded = true
                }
                if (this.genOptions.useStringKindVariantsOnly) {
                    return isNumberLikeVariant === false
                }
                return true
            })
            .map((variant) => t.literal(variant))

        if (isNumberIncluded) {
            literalList.push(
                t.intersection([
                    t.literal("${number}", { useBackticks: true }),
                    t.record({}),
                ])
            )
        }

        const literalType = t.union(literalList, capitalize("variants", key))

        this.variantsMap.set(key, literalType)

        return literalType
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

    private getPropertyNameTailwindKeyNotFounded(
        className: string,
        useNativeCombine: boolean
    ): string | null {
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
            const css = this.ds.candidatesToCss([className])[0]
            if (!css) {
                return null
            }

            const styleBlock = this.cssAnalyzer.parseStyleBlock(css)
            if (!styleBlock) {
                this.$.warn(
                    `Can not generate css block from <${className}> css = ${typeof css}`
                )
                return null
            }

            const [uniqueProperty, styleValues] =
                extractUniqueKeysFromStyleSheet(styleBlock.styles)

            const matchedVariantName = this.variants.find((variant) =>
                className.includes(variant)
            )

            if (uniqueProperty) {
                if (matchedVariantName && useNativeCombine) {
                    const withTwNative = `${matchedVariantName}${capitalize(
                        uniqueProperty
                    )}`
                    return withTwNative
                }
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

    private exceptionalRules = new Map<
        string | RegExp,
        { property: string | Array<string>; tester?: RegExp }
    >([
        ["bg-conic", { property: "backgroundImage" }],
        [
            "size",
            {
                property: ["width", "height"],
                tester: generateValidator("size-${string}")!,
            },
        ],
    ])

    private getPropertyName(
        className: string,
        uniqueKeySet: Set<string>,
        colorVarSet: Set<string>
    ): string | Array<string> | null {
        // Exceptional case
        const exceptionRuleToken = className.split("-")[0] ?? className
        if (this.exceptionalRules.has(exceptionRuleToken)) {
            const { property, tester } =
                this.exceptionalRules.get(exceptionRuleToken)!
            if (tester) {
                const testResult = tester.test(className)
                if (testResult) {
                    return property
                }
            }
            return property
        }

        const CSS = this.ds.candidatesToCss([className])[0]
        if (!CSS) {
            this.$.warn(`Can not transform <${className}> into css.`)
            return null
        }

        const tailwindKey: string | null =
            this.generateKey(sanitizeTwClass(className), uniqueKeySet) ??
            this.generateKey(className, uniqueKeySet)

        if (tailwindKey === null) {
            const property = this.getPropertyNameTailwindKeyNotFounded(
                className,
                false
            )

            return property
        }

        const propertyAliasPossibility = this.typeAliasMap.get(tailwindKey)

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
            return this.getPropertyNameTailwindKeyNotFounded(className, true)
        }

        if (exactNames.length >= 1) {
            return exactNames
        }

        if (similarNames.length === 1) {
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
                if (colorVarSet.has(token)) {
                    isColorProperty = true
                    break
                }
                ptr = ptr - 1
            }

            const cssBlock = this.cssAnalyzer.parseStyleBlock(CSS)
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
                    this.$.error(
                        `Color-like property ${className} has not found appropriate property in ${similarNames.toString()}`
                    )
                    return null
                }
                if (nameMap.color.length > 1) {
                    this.$.error(
                        `Color-like property ${className} has found many appropriate property in ${nameMap.color.toString()}`
                    )
                    return nameMap.color[0]!
                }
                return nameMap.color[0]!
            }

            if (nameMap.nonColor.length === 0) {
                this.$.error(
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
                    this.$.warn(
                        `NonColor-like property ${className} has found many appropriate property in ${shouldBeNonColorProperty.toString()}`
                    )
                }

                return shouldBeNonColorProperty
            }

            return nameMap.nonColor
        }

        return distinguishSimilarNames(className, similarNames)
    }

    private legacyRulePrefixes = ["bg-gradient"] as const
    private shouldSkip(className: string): boolean {
        if (
            this.legacyRulePrefixes.some((skipPrefix) =>
                className.startsWith(skipPrefix)
            )
        ) {
            return true
        }
        return false
    }

    public async buildTypes(saveRoot: {
        tailwind: string
        tailwindest: string
    }) {
        await this.init()

        const uniqueKeySet = new Set<string>(
            Array.from(this.typeAliasMap.keys())
        )

        const tailwindCollection: TailwindCollection = {}

        try {
            // symbolic type generation needed
            const compiled = await this.compiler.compileCss(
                this.classList.map((e) => e[0])
            )

            const compiledStyleBlock =
                this.cssAnalyzer.parseStyleDefinition(compiled)

            const colorVariableSet: Set<string> = new Set(
                compiledStyleBlock
                    .filter((e) => e.property.startsWith("--color"))
                    .map((e) => e.property.replace("--color-", ""))
            )
            const colorVariables: Array<string> = Array.from(colorVariableSet)

            for (const entry of this.classList) {
                const [className, variants] = entry

                if (this.shouldSkip(className)) {
                    this.$.info(`Skip <${className}>, depreciated at v4.`)
                    continue
                }

                let property = this.getPropertyName(
                    className,
                    uniqueKeySet,
                    colorVariableSet
                )

                if (!property) {
                    const isUserDefined =
                        this.ds.candidatesToCss([className])[0] !== null

                    if (isUserDefined) {
                        property = "custom"
                        this.$.info(`Mark <${className}> as custom property.`)
                    } else {
                        this.$.warn(
                            `Not valid classname <${className}>. Skipped generation.`
                        )
                        continue
                    }
                }

                const assignRecord = (property: string): void => {
                    if (!tailwindCollection[property]) {
                        tailwindCollection[property] = {
                            classNames: [],
                            variants: [],
                        }
                    }

                    tailwindCollection[property]!.classNames.push(className)

                    if (variants.modifiers.length === 0) return

                    const prevVariantSet = new Set(
                        tailwindCollection[property]!.variants
                    )
                    variants.modifiers.forEach((variant) => {
                        if (!prevVariantSet.has(variant)) {
                            tailwindCollection[property]!.variants.push(variant)
                        }
                    })
                }
                if (Array.isArray(property)) {
                    property.forEach(assignRecord)
                } else {
                    assignRecord(property)
                }
            }

            const colorNames = new Set(
                colorVariables.map((e) => e.split("-")[0])
            )

            const optimizedMapList = await this.createOptimizableMapList(
                tailwindCollection,
                [
                    // color like
                    (prefixStr) => {
                        if (colorNames.has(prefixStr)) return false
                        return true
                    },
                    // number like
                    (prefixStr) => {
                        if (Number.isNaN(parseFloat(prefixStr))) return true
                        return false
                    },
                ]
            )

            const [tailwind, tailwindest] = await Promise.all([
                this.generateType({
                    type: "tailwind",
                    globalReference: { color: colorVariables },
                    optimizationList: optimizedMapList,
                }),
                this.generateType({
                    type: "tailwindest",
                    globalReference: { color: colorVariables },
                    optimizationList: optimizedMapList,
                }),
            ])

            await Promise.all([
                writeFile(saveRoot.tailwindest, tailwindest, {
                    encoding: "utf-8",
                }),
                writeFile(saveRoot.tailwind, tailwind, {
                    encoding: "utf-8",
                }),
                writeFile(
                    `${saveRoot.tailwind}.json`,
                    JSON.stringify(tailwindCollection, null, 4)
                ),
            ])
        } catch (e) {
            this.$.error("build type error occurred")
            console.error(e)
        }

        this.$.success("build type finished")
        this.$.log(`tailwind : ${saveRoot.tailwind}`)
        this.$.log(`tailwindest : ${saveRoot.tailwindest}`)
    }

    private createOptimizableMap(
        collectionRecord: TailwindCollectionRecord,
        prefixRules: Array<(someText: string) => boolean> = []
    ): OptimizableMap {
        const {
            propertyName,
            classNames: originalClassNames,
            variants,
        } = collectionRecord

        const hasNegative = originalClassNames.some((className) =>
            className.startsWith("-")
        )

        // Purify class names if negative values exist
        let classNames: string[] = []
        if (hasNegative) {
            classNames = originalClassNames.map((e) =>
                e.startsWith("-") ? e.slice(1) : e
            )
        } else {
            classNames = originalClassNames
        }

        const findPrefixGroups = (
            classGroups: string[],
            parentPrefix: string[]
        ): string[] => {
            const uniquePrefixTokens = Array.from(
                new Set(
                    classGroups
                        .map((e) => {
                            const splitted = e.split("-")

                            if (splitted.length === 1) {
                                return null
                            }

                            const possiblePrefix = splitted[0]
                            if (!possiblePrefix) return null

                            const isNotPrefix = prefixRules.some(
                                (rule) => rule(possiblePrefix) === false
                            )
                            if (isNotPrefix) return null

                            return possiblePrefix
                        })
                        .filter((e) => Boolean(e) && e !== "")
                )
            )

            if (uniquePrefixTokens.length === 0) return []
            if (classGroups.length === 0) return []

            const matchedPrefixes = uniquePrefixTokens.reduce<string[]>(
                (matched, token) => {
                    if (!token) return matched

                    const matchingCount = classGroups.reduce(
                        (count, className) => {
                            if (className.includes(token)) {
                                return count + 1
                            }
                            return count
                        },
                        0
                    )

                    if (matchingCount > 2) {
                        matched.push(token)
                    }

                    return matched
                },
                []
            )
            const parentRemovedPrefixes = matchedPrefixes.filter(
                (e) => parentPrefix.includes(e) === false
            )
            if (parentRemovedPrefixes.length === 0) return []

            const prefixGroups = parentRemovedPrefixes.reduce<string[][]>(
                (recursiveCollected, prefix) => {
                    const group: string[] = classGroups.reduce<string[]>(
                        (groupList, className) => {
                            if (className.includes(prefix)) {
                                const childrenToken = className.replace(
                                    `${prefix}-`,
                                    ""
                                )
                                groupList.push(childrenToken)
                            }
                            return groupList
                        },
                        []
                    )

                    const childPrefixes = findPrefixGroups(
                        group,
                        matchedPrefixes
                    )

                    recursiveCollected.push([prefix])
                    if (childPrefixes.length !== 0) {
                        const combined = childPrefixes.map(
                            (childPrefix) => `${prefix}-${childPrefix}`
                        )
                        recursiveCollected.push(combined)
                    }
                    return recursiveCollected
                },
                []
            )

            const collectedPrefixes = Array.from(
                new Set([prefixGroups.flat()])
            ).flat()

            return collectedPrefixes
        }

        const findUniquePrefixGroups = (
            classNames: Array<string>,
            independentPrefixGroups: Array<string>
        ): Array<string> => {
            const samePrefixGroups = findPrefixGroups(
                independentPrefixGroups,
                []
            )

            const targetAnalysisPrefixGroups: Array<string> =
                samePrefixGroups.length === 0
                    ? independentPrefixGroups
                    : samePrefixGroups

            const groups = targetAnalysisPrefixGroups.map((rootPrefix) => {
                return {
                    samePrefixGroups: independentPrefixGroups.filter((prefix) =>
                        prefix.startsWith(rootPrefix)
                    ),
                    matched: classNames.filter(
                        (className) =>
                            className.startsWith(`${rootPrefix}-`) &&
                            className !== rootPrefix
                    ),
                }
            })

            const countMatching = (
                prefix: string,
                classNames: Array<string>
            ): number => {
                return classNames.reduce<number>((matched, className) => {
                    if (
                        className.startsWith(`${prefix}-`) ||
                        className === prefix
                    ) {
                        return matched + 1
                    }
                    return matched
                }, 0)
            }

            const uniqueGroupByLength: Array<string> = groups.reduce<
                Array<string>
            >((finalPrefixGroups, group) => {
                const matchedGroups = group.samePrefixGroups.map(
                    (samePrefix) =>
                        [
                            samePrefix,
                            countMatching(samePrefix, group.matched),
                        ] as const
                )
                const uniqueGroups = matchedGroups.reduce<Map<number, string>>(
                    (matched, groups) => {
                        const [prefix, count] = groups
                        const prevPrefix = matched.get(count)
                        if (!prevPrefix) {
                            // new group
                            matched.set(count, prefix)
                            return matched
                        }

                        // check uniqueness by prefix length, if same count then longer prefix will be unique prefix
                        if (prefix.length > prevPrefix.length) {
                            matched.set(count, prefix)
                        }
                        return matched
                    },
                    new Map()
                )

                const uniquePrefixes = Object.values(
                    Object.fromEntries(uniqueGroups)
                )
                finalPrefixGroups.push(...uniquePrefixes)

                return finalPrefixGroups
            }, [])

            const finalGroups: Array<string> = Array.from(
                new Set([
                    ...independentPrefixGroups.filter((prefix) =>
                        targetAnalysisPrefixGroups.every(
                            (samePrefix) => samePrefix !== prefix
                        )
                    ),
                    ...uniqueGroupByLength,
                ])
            )

            return finalGroups
        }

        const prefixGroups = findUniquePrefixGroups(
            classNames,
            findPrefixGroups(classNames, [])
        )

        const soleGroups = Array.from(
            new Set(
                classNames.filter((className) => {
                    return (
                        prefixGroups.some(
                            (prefix) =>
                                className.startsWith(`${prefix}-`) &&
                                className !== prefix
                        ) === false
                    )
                })
            )
        )

        const valueGroups = Array.from(
            new Set(
                classNames.map((className) => {
                    const valueList = prefixGroups.map((prefix) =>
                        className.replace(`${prefix}-`, "")
                    )
                    const shortestString = valueList.reduce(
                        (a, b) => (a!.length <= b.length ? a : b),
                        valueList[0]
                    )!
                    return shortestString
                })
            )
        )

        const removeAt = <ArrayT extends Array<any>>(
            arr: ArrayT,
            i: number
        ): ArrayT => {
            if (i < 0 || i >= arr.length) return arr.slice() as ArrayT
            return [...arr.slice(0, i), ...arr.slice(i + 1)] as ArrayT
        }

        // Create an array mapping each prefix to its corresponding values.
        const prefixValueMapping = prefixGroups.map((prefix, i, totPrexies) => {
            const otherPrefixes = removeAt(totPrexies, i)
            const values = Array.from(
                new Set(
                    classNames
                        .filter((className) => {
                            const possible = className.startsWith(`${prefix}-`)
                            if (!possible) return false
                            const otherPossiblePrefix = otherPrefixes
                                .map((p) =>
                                    className.startsWith(`${p}-`) ? p : null
                                )
                                .filter((e) => e !== null)
                            if (otherPossiblePrefix.length === 0) {
                                return true
                            }
                            const biggestLength = Math.max(
                                prefix.length,
                                ...otherPossiblePrefix.map((e) => e.length)
                            )
                            if (biggestLength === prefix.length) {
                                return true
                            }
                            return false
                        })
                        .map((className) => className.slice(prefix.length + 1))
                )
            )

            const groupHasNegative = originalClassNames.some((className) =>
                className.startsWith("-")
            )

            if (
                values.length === 0 &&
                otherPrefixes.some((other) => other.includes(prefix))
            ) {
                return {
                    prefix,
                    values: [],
                    hasNegative: groupHasNegative,
                }
            }

            return { prefix, values, hasNegative: groupHasNegative }
        })

        // Standalone case
        const isStandAlone = prefixValueMapping.length === 0

        if (isStandAlone) {
            return {
                propertyName,
                variants: variants.length > 0 ? variants : null,
                hasNegative,
                prefixGroups,
                soleGroups,
                valueGroups: classNames,
                prefixValueMapping: classNames.map((property) => ({
                    hasNegative: property.startsWith("-"),
                    prefix: property,
                    values: [],
                })),
                valueReferenceMap: new Map(),
            }
        }

        // Generate symbolic clusters
        const arrayIntersection = (arr1: string[], arr2: string[]): string[] =>
            arr1.filter((token) => arr2.includes(token))

        type Cluster = { commonTokens: string[]; indices: number[] }
        const clusters: Array<Cluster> = []
        for (let i = 0; i < prefixValueMapping.length; i++) {
            const current = prefixValueMapping[i]?.values

            if (!current) {
                continue
            }

            let assigned = false
            for (let cluster of clusters) {
                const common = arrayIntersection(cluster.commonTokens, current)
                if (common.length <= 5) {
                    // Skip too small common things --> overhead
                    continue
                }

                if (
                    common.length ===
                    Math.min(cluster.commonTokens.length, current.length)
                ) {
                    // They are compatible; update cluster common tokens and add index.
                    cluster.commonTokens = common
                    cluster.indices.push(i)
                    assigned = true
                    break
                }
            }
            if (!assigned) {
                clusters.push({ commonTokens: current.slice(), indices: [i] })
            }
        }

        // Add symbol to clusters :: Maps cluster index -> reference symbol
        let refCounter: number = 1
        const clusterRefs = new Map<number, string>()
        clusters.forEach((cluster, idx) => {
            // if it can be extracted as variables, we should(global optimizations)
            const REFERENCE_THRESHOLD = 1 as const
            const shouldMakeReference =
                cluster.indices.length >= REFERENCE_THRESHOLD &&
                cluster.commonTokens.length > 0
            if (shouldMakeReference) {
                clusterRefs.set(idx, `$ref${refCounter}`)
                refCounter++
            }
        })
        // Create the valueReferenceMap from clusters
        const valueReferenceMap = new Map<string, string[]>()
        clusters.forEach((cluster, idx) => {
            if (clusterRefs.has(idx) && cluster.commonTokens.length > 0) {
                valueReferenceMap.set(
                    clusterRefs.get(idx)!,
                    cluster.commonTokens
                )
            }
        })

        // Update prefixValueMapping with clusters
        clusters.forEach((cluster, clusterIdx) => {
            if (!clusterRefs.has(clusterIdx)) return // no optimization if only one group in cluster

            const refSymbol = clusterRefs.get(clusterIdx)!

            cluster.indices.forEach((idx) => {
                const originalTokens = prefixValueMapping[idx]?.values
                if (originalTokens) {
                    const nonSymbolicValues = originalTokens.filter(
                        (token) => !cluster.commonTokens.includes(token)
                    )

                    prefixValueMapping[idx]!.values =
                        nonSymbolicValues.length > 0
                            ? [refSymbol, ...nonSymbolicValues]
                            : [refSymbol]
                }
            })
        })

        return {
            propertyName,
            variants: variants.length > 0 ? variants : null,
            hasNegative,
            prefixGroups,
            soleGroups,
            valueGroups,
            prefixValueMapping,
            valueReferenceMap,
        }
    }

    private async createOptimizableMapList(
        tailwindCollection: TailwindCollection,
        prefixRules: Array<(someText: string) => boolean> = []
    ): Promise<Array<OptimizableMap>> {
        const optimizationList = Object.entries(tailwindCollection).map(
            ([propertyName, { classNames, variants }]) => {
                return this.createOptimizableMap(
                    {
                        propertyName,
                        classNames,
                        variants,
                    },
                    prefixRules
                )
            }
        )

        return optimizationList
    }

    private generateInterface(
        globalReference: { color: Array<string> },
        optimizableMap: OptimizableMap
    ): {
        referenceTypeMap: Map<string, string | t.Type>
        tailwindProperty: t.RecordType
        tailwindestProperty: t.RecordType
    } {
        const getSubset = (
            parent: Array<string>,
            subset: Array<string>,
            removeSubset: boolean = true
        ): [boolean, Array<string>] => {
            const parentSet = new Set(parent)
            const isSubset = subset.every((element) => parentSet.has(element))

            let removed = parent
            if (isSubset && removeSubset) {
                const childSet = new Set(subset)
                removed = parent.filter((e) => !childSet.has(e))
            }

            return [isSubset, removed]
        }

        const {
            propertyName,
            prefixGroups,
            soleGroups,
            valueReferenceMap,
            prefixValueMapping,
            variants,
        } = optimizableMap

        const updateRefMapFromGlobalRef = (
            refMap: Map<string, string[]>
        ): Map<string, string[]> => {
            const newRefMap = new Map(refMap)

            for (const [refName, refValue] of newRefMap) {
                const [isColorIncluded, colorRemoved] = getSubset(
                    refValue,
                    globalReference.color,
                    true
                )

                if (isColorIncluded) {
                    colorRemoved.push("$global_color")
                    newRefMap.set(refName, colorRemoved)
                }
            }
            return newRefMap
        }

        const valueRefMapWithGlobal =
            updateRefMapFromGlobalRef(valueReferenceMap)

        const globalLiteralMap = Object.keys(globalReference).reduce(
            (refMap, key) => {
                refMap.set(
                    `$global_${key}`,
                    this.getGlobalLiteral(`$global_${key}`)
                )
                return refMap
            },
            new Map<string, t.Type>()
        )

        const referenceTypeMap = Object.entries(
            Object.fromEntries(valueRefMapWithGlobal)
        ).reduce((refTypeMap, [refKey, values]) => {
            const literalUnion = t.union(
                values.map((value) => {
                    if (value.startsWith("$global")) {
                        const globalLiteral = globalLiteralMap.get(value)!
                        if (!globalLiteral) {
                            this.$.error(
                                `Ref error: ${value} is global reference, but it is not found`
                            )
                        }
                        return globalLiteral.alias!
                    } else {
                        return t.literal(value)
                    }
                }),
                capitalize(propertyName, refKey.replace("$", ""))
            )
            refTypeMap.set(refKey, literalUnion)
            return refTypeMap
        }, new Map<string, t.Type | string>())

        const variantsLiteral = variants
            ? this.getVariantsLiteral(variants)
            : null

        const soleUnion = t.union(
            soleGroups.map((soleClass) => t.literal(soleClass))
        )
        const propertyUnion = t.union(
            [
                // sole
                soleUnion,
                // prefix-value
                ...prefixValueMapping.reduce<Array<t.Type>>(
                    (propertyLiteralList, mapping) => {
                        if (mapping.values.length === 0) {
                            const independentValue = t.literal(mapping.prefix)
                            propertyLiteralList.push(independentValue)
                            return propertyLiteralList
                        }

                        const prefix = kebabToCamelCase(mapping.prefix)
                        const literalName = capitalize(
                            propertyName,
                            prefix
                                .toLowerCase()
                                .replace(propertyName.toLowerCase(), ""),
                            "literal"
                        )
                        const literalUnion = t.union(
                            mapping.values.map((value) => {
                                const isReferenceFounded = value.startsWith("$")
                                if (isReferenceFounded) {
                                    const reference =
                                        referenceTypeMap.get(value)!
                                    if (typeof reference === "string") {
                                        return t.literal(
                                            `${mapping.prefix}-\${${reference}}`,
                                            {
                                                useBackticks: true,
                                            }
                                        )
                                    }

                                    return t.literal(
                                        `${mapping.prefix}-\${${reference.alias}}`,
                                        {
                                            useBackticks: true,
                                        }
                                    )
                                } else {
                                    return t.literal(
                                        `${mapping.prefix}-${value}`
                                    )
                                }
                            }),
                            literalName
                        )

                        if (mapping.hasNegative) {
                            const withNegative = t.union(
                                [
                                    literalUnion,
                                    t.literal(`-\${${literalUnion.alias}}`, {
                                        useBackticks: true,
                                    }),
                                ],
                                capitalize(literalName, "with", "sign")
                            )
                            propertyLiteralList.push(withNegative)
                        } else {
                            propertyLiteralList.push(literalUnion)
                        }
                        return propertyLiteralList
                    },
                    []
                ),
            ],
            capitalize(propertyName, "property")
        )

        // doc-data extraction
        const foundedDocumentation = this.docStore.find((e) => {
            const purifiedTitle = e.title.replaceAll(" ", "").trim()
            if (purifiedTitle.includes("/")) {
                const titles = purifiedTitle.split("/")
                return titles.some(
                    (title) => kebabToCamelCase(title) === propertyName
                )
            }
            return kebabToCamelCase(purifiedTitle) === propertyName
        })

        // arbitrary supports
        const arbitraryDescriptions: Array<string> = []
        const arbitrarySupport = prefixGroups
            .reduce<
                Array<{
                    prefix: string
                    arbitraryTypes: Array<
                        | {
                              bracket: readonly ["[", "]"]
                              description: "<string>"
                              type: "string"
                          }
                        | {
                              bracket: readonly ["(", ")"]
                              description: "<var-name>"
                              type: "string"
                          }
                        | {
                              bracket: readonly ["", ""]
                              description: "<number>"
                              type: "number"
                          }
                    > | null
                }>
            >((arbitraryGroups, prefix) => {
                // only {prefix}-{${string}}
                const possibleMatch = foundedDocumentation?.classNames.filter(
                    (docClassName) =>
                        docClassName.startsWith(prefix) &&
                        docClassName.includes("${string}")
                )
                if (possibleMatch && possibleMatch.length > 0) {
                    const types = possibleMatch.map((match) => {
                        if (match.includes("(") && match.includes(")")) {
                            return {
                                bracket: ["(", ")"],
                                description: "<var-name>",
                                type: "string",
                            } as const
                        }

                        if (match.includes("[") && match.includes("]")) {
                            return {
                                bracket: ["[", "]"],
                                description: "<string>",
                                type: "string",
                            } as const
                        }

                        return {
                            bracket: ["", ""],
                            description: "<number>",
                            type: "number",
                        } as const
                    })
                    arbitraryGroups.push({
                        prefix,
                        arbitraryTypes: types,
                    })
                } else {
                    arbitraryGroups.push({
                        prefix,
                        arbitraryTypes: null,
                    })
                }
                return arbitraryGroups
            }, [])
            .map((analysis) => {
                if (analysis.arbitraryTypes === null) {
                    return null
                }

                const arbitraryIntersectionList = analysis.arbitraryTypes.map(
                    ({ bracket: [open, close], type, description }) => {
                        const docString = `${analysis.prefix}-${open}${description}${close}`
                        arbitraryDescriptions.push(docString)

                        const typeString = `${analysis.prefix}-${open}\${${type}}${close}`
                        const withArbitrary = t.intersection([
                            t.literal(typeString, {
                                useBackticks: true,
                            }),
                            t.record({}),
                        ])
                        return withArbitrary
                    }
                )
                return t.union(arbitraryIntersectionList)
            })
            .filter((e) => e !== null)

        const getPropertyUnionWithVariants = (): t.Type => {
            if (variantsLiteral === null) return propertyUnion

            if (this.genOptions.useExactVariants) {
                return t.union([
                    propertyUnion,
                    t.literal(
                        `\${${propertyUnion.alias}}/\${${variantsLiteral.alias}}`,
                        {
                            useBackticks: true,
                        }
                    ),
                ])
            }

            if (this.genOptions.useSoftVariants) {
                return t.union([
                    propertyUnion,
                    ...prefixGroups.map((prefix) =>
                        t.intersection([
                            t.literal(
                                `${prefix}-\${string}/\${${variantsLiteral.alias}}`,
                                {
                                    useBackticks: true,
                                }
                            ),
                            t.record({}),
                        ])
                    ),
                ])
            }

            return propertyUnion
        }
        const propertyUnionWithVariants = getPropertyUnionWithVariants()

        const propertyValue = this.genOptions.useArbitraryValue
            ? t.union(
                  [propertyUnionWithVariants, ...arbitrarySupport],
                  capitalize(propertyName, "value")
              )
            : propertyUnionWithVariants.setAlias(
                  capitalize(propertyName, "value")
              )

        const propertyValueForTailwindest = t.union(
            [t.array(propertyValue), propertyValue],
            capitalize(propertyName, "value", "with", "array")
        )

        const addArbitraryDocs = (type: t.Type) => {
            if (
                this.genOptions.useArbitraryValue &&
                arbitraryDescriptions.length > 0
            ) {
                const arbitraryDescription = `\nArbitrary support\n\n${arbitraryDescriptions.map((e) => `\`${e}\``).join(", ")}`
                type.addDoc("@description", arbitraryDescription)
            }
        }

        if (this.genOptions.useDocs) {
            const docInjectionTarget = [
                propertyValue,
                propertyValueForTailwindest,
            ]

            if (foundedDocumentation) {
                docInjectionTarget.forEach((type) => {
                    type.addDoc("title", `\`${capitalize(propertyName)}\``)
                        .addDoc(
                            "@description",
                            foundedDocumentation.description
                        )
                        .addDoc(
                            "@see",
                            `{@link ${foundedDocumentation.link} Tailwind docs}`
                        )
                        .addDoc(
                            "@see",
                            `{@link https://developer.mozilla.org/en-US/docs/Web/CSS/${camelToKebabCase(propertyName)} , MDN docs}`
                        )
                        .setSkipDocs(true)
                    addArbitraryDocs(type)
                })
            } else {
                if (propertyName === "custom") {
                    docInjectionTarget.forEach((type) => {
                        type.addDoc("title", `\`${capitalize(propertyName)}\``)
                            .addDoc(
                                "@description",
                                "Custom properties, defined by user."
                            )
                            .setSkipDocs(true)
                    })
                } else {
                    docInjectionTarget.forEach((type) => {
                        type.addDoc("title", `\`${capitalize(propertyName)}\``)
                            .addDoc(
                                "@see",
                                `{@link https://tailwindcss.com/docs Tailwind docs}`
                            )
                            .addDoc(
                                "@see",
                                `{@link https://developer.mozilla.org/en-US/docs/Web/CSS/${camelToKebabCase(propertyName)} , MDN docs}`
                            )
                            .setSkipDocs(true)
                        addArbitraryDocs(type)
                    })
                }
            }
        }

        const propertyInterface = t.record(
            capitalize("tailwind", propertyName),
            {
                [`${propertyName}?`]: propertyValue,
            },
            {
                keyword: "interface",
            }
        )

        const propertyInterfaceTailwindest = t.record(
            capitalize("tailwindest", propertyName),
            {
                [`${propertyName}?`]: propertyValueForTailwindest,
            },
            {
                keyword: "interface",
            }
        )

        return {
            tailwindProperty: propertyInterface,
            tailwindestProperty: propertyInterfaceTailwindest,
            referenceTypeMap: referenceTypeMap,
        }
    }

    private globalMap: Map<string, t.Type> = new Map()
    private getGlobalLiteral(globalRefKey: string): t.Type {
        let key: string = globalRefKey
        if (!globalRefKey.startsWith("$global_")) {
            this.$.warn(
                `Global literal should access with $global keyword. But received ${globalRefKey}`
            )
            key = "$global_" + globalRefKey
        }
        if (!this.globalMap.has(key)) {
            throw new Error(`Global ref ${key} is not exist`)
        }
        return this.globalMap.get(key)!
    }
    private setGlobalLiteral(globalReference: { color: Array<string> }): void {
        Object.entries(globalReference).forEach(
            ([globalRefKey, globalVariants]) => {
                const literalType = t
                    .union(
                        globalVariants.map((variant) => t.literal(variant)),
                        capitalize("tailwind", "global", globalRefKey)
                    )
                    .setExport(true)
                    .addDoc(
                        "@description",
                        `Tailwind global ${globalRefKey} property`
                    )

                const withGlobalPrefix = `$global_${globalRefKey}`
                this.globalMap.set(withGlobalPrefix, literalType)
            }
        )
    }

    private async generateType({
        type,
        globalReference,
        optimizationList,
    }: {
        type: "tailwind" | "tailwindest"
        globalReference: { color: Array<string> }
        optimizationList: Array<OptimizableMap>
    }) {
        // Global reference injection
        this.setGlobalLiteral(globalReference)

        const interfaceList = optimizationList.reduce<{
            tailwindInterface: Array<t.RecordType>
            tailwindestInterface: Array<t.RecordType>
            referenceTypeMap: Array<t.Type>
        }>(
            (interfaceList, optimizationMap) => {
                const {
                    tailwindProperty,
                    tailwindestProperty,
                    referenceTypeMap,
                } = this.generateInterface(globalReference, optimizationMap)
                interfaceList.tailwindInterface.push(tailwindProperty)
                interfaceList.tailwindestInterface.push(tailwindestProperty)
                interfaceList.referenceTypeMap.push(
                    ...this.extractTypeFromMap(referenceTypeMap)
                )

                return interfaceList
            },
            {
                referenceTypeMap: [],
                tailwindInterface: [],
                tailwindestInterface: [],
            }
        )

        let response: string = ""
        if (type === "tailwind") {
            const tailwindSchema = t
                .record(
                    "Tailwind",
                    {},
                    {
                        keyword: "interface",
                    }
                )
                .setExport(true)
                .setExtends(interfaceList.tailwindInterface)

            response = await this.generator.generateAll([
                ...this.extractTypeFromMap(this.globalMap),
                ...this.extractTypeFromMap(this.variantsMap),
                ...interfaceList.referenceTypeMap,
                ...interfaceList.tailwindInterface,
                tailwindSchema,
            ])
        } else {
            const tailwindestSchema = t
                .record(
                    "Tailwindest",
                    {},
                    {
                        keyword: "interface",
                    }
                )
                .setExport(true)
                .setExtends(interfaceList.tailwindestInterface)

            response = await this.generator.generateAll([
                ...this.extractTypeFromMap(this.globalMap),
                ...this.extractTypeFromMap(this.variantsMap),
                ...interfaceList.referenceTypeMap,
                ...interfaceList.tailwindestInterface,
                tailwindestSchema,
            ])
        }

        return response
    }
}
