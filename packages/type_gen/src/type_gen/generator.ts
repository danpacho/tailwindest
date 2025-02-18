import { write } from "fs"
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
                return word[0]!.toUpperCase() + word.slice(1)
            }
        })
        .join("")

const kebabToCamelCase = (str: string): string => {
    return str.replace(/-./g, (match) => match[1]?.toUpperCase() ?? "")
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
    const direction = new Set(["x", "y", "t", "l", "b", "r"])
    const nonDirection = nonSigned
        .split("-")
        .filter((e) => direction.has(e) === false)

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

type TailwindTypeAliasMap = Map<
    TailwindDocs["uniqueIdentifier"][number],
    Map<Set<TailwindDocs["classNames"][number]>, TailwindDocs["title"]>
>

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
        name: "create-tailwindest",
    })

    public readonly compiler: TailwindCompiler
    public readonly generator: TypeSchemaGenerator
    private readonly cssAnalyzer: CSSAnalyzer

    public constructor(opt: {
        compiler: TailwindCompiler
        generator: TypeSchemaGenerator
        cssAnalyzer: CSSAnalyzer
        storeRoot?: string
    }) {
        this.compiler = opt.compiler
        this.generator = opt.generator
        this.cssAnalyzer = opt.cssAnalyzer
        this._storeRoot = opt.storeRoot ?? null
    }

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

    private async prepareTypeAliasMap(): Promise<void> {
        const store: Array<TailwindDocs> = JSON.parse(
            await readFile(this.storeRoot, {
                encoding: "utf-8",
            })
        ) as Array<TailwindDocs>

        this._docStore = store

        const typeAliasMap = store.reduce<TailwindTypeAliasMap>((acc, curr) => {
            curr.uniqueIdentifier.forEach((ident) => {
                const alias = kebabToCamelCase(curr.title)

                if (isTwClassPure(alias)) {
                    const aliasMap: Map<
                        Set<TailwindDocs["classNames"][number]>,
                        TailwindDocs["title"]
                    > = acc.get(ident) ?? new Map()

                    aliasMap.set(new Set(curr.classNames), alias)
                    acc.set(ident, aliasMap)
                }
            })
            return acc
        }, new Map())

        this._typeAliasMap = typeAliasMap
    }

    public async init() {
        if (this._initialized) {
            this.$.info("already initialized")
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

    private variantsMap: Map<string, t.Type> = new Map()
    private getVariantsLiteral(variants: Array<string>): t.Type {
        const key = this.hash(variants.join(""))

        if (this.variantsMap.has(key)) {
            return this.variantsMap.get(key)!
        }
        const literalType = t.union(
            [
                ...variants.map((variant) => t.literal(variant)),
                t.literal("${string}", {
                    useBackticks: true,
                }),
            ],
            `Variants__${key}`
        )

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
        css: string,
        className: string,
        useNativeCombine: boolean
    ): string | null {
        const extractUniqueKeysFromStyleSheet = (
            styleSheet: Record<string, string>
        ): readonly [string | null, Array<string>] => {
            const keys = Object.keys(styleSheet)

            const uniqueKey = keys
                .map((key) => {
                    if (key === "") return null
                    if (key.startsWith("--") || key.startsWith("-")) return null
                    if (key.startsWith("var")) return null
                    return key
                })
                .filter((e) => e !== null)
                .map(toValidCSSProperty)

            if (uniqueKey.length !== 1) return [null, keys] as const

            return [uniqueKey[0]!, keys] as const
        }

        const styleBlock = this.cssAnalyzer.parseStyleBlock(css)
        if (!styleBlock) {
            this.$.warn(
                `Can not generate css block from <${className}> css = ${typeof css}`
            )
            return null
        }

        const [uniqueProperty, styleValues] = extractUniqueKeysFromStyleSheet(
            styleBlock.styles
        )

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

    private getPropertyName(
        className: string,
        uniqueKeySet: Set<string>
    ): string | null {
        const CSS = this.ds.candidatesToCss([className])[0]
        if (!CSS) {
            this.$.warn(`Can not transform <${className}> into css`)
            return null
        }

        const tailwindKey: string | null =
            this.generateKey(sanitizeTwClass(className), uniqueKeySet) ??
            this.generateKey(className, uniqueKeySet)

        if (tailwindKey === null) {
            const property =
                this.getPropertyNameTailwindKeyNotFounded(
                    CSS,
                    sanitizeTwClass(className),
                    false
                ) ??
                this.getPropertyNameTailwindKeyNotFounded(CSS, className, false)

            if (!property) {
                // console.log(property, className)
            } else {
                // console.log("success", className)
            }

            return property
        }

        const propertyAliasPossibility = this.typeAliasMap.get(tailwindKey)

        const aliasList = Array.from(propertyAliasPossibility ?? [])

        const finder = (className: string, aliasSet: Set<string>): boolean => {
            const sanitizedClassName = sanitizeTwClass(className)

            const tester = Array.from(aliasSet)
                .map((alias) => generateValidator(alias))
                .filter((e) => e !== null)

            if (tester.some((tester) => tester.test(sanitizedClassName))) {
                return true
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
            return founded
        }

        const propertyName = aliasList.find(([aliasSet]) => {
            if (finder(className, aliasSet)) {
                return true
            }
            return false
        })?.[1]

        if (!propertyName) {
            return this.getPropertyNameTailwindKeyNotFounded(
                CSS,
                sanitizeTwClass(className),
                true
            )
        }

        return propertyName
    }

    public async buildTypes(saveRoot: {
        tailwindRecord: string
        tailwindClass: string
    }) {
        await this.init()

        const uniqueKeySet = new Set<string>(
            Array.from(this.typeAliasMap.keys())
        )
        const collectedRecord: Record<string, Array<t.Type>> = {}

        try {
            for (const entry of this.classList) {
                const [className, variants] = entry

                const property = this.getPropertyName(className, uniqueKeySet)

                if (!property) {
                    this.$.warn(`Can not find property & css for ${className}.`)
                    continue
                }

                if (!collectedRecord[property]) {
                    collectedRecord[property] = []
                }

                const classLiteral: t.Type = t.literal(className)
                collectedRecord[property].push(classLiteral)

                const hasVariants = variants.modifiers.length > 0

                if (hasVariants) {
                    const variantLiteral = this.getVariantsLiteral(
                        variants.modifiers
                    )
                    const COMBINE = "/" as const
                    const withVariants = t.literal(
                        `${className}${COMBINE}\$\{${variantLiteral.alias}\}`,
                        {
                            useBackticks: true,
                        }
                    )

                    collectedRecord[property].push(withVariants)
                }
            }

            console.log(Object.keys(collectedRecord).toSorted().join("\n"))
            // Generate type

            const recordType = Object.entries(collectedRecord).reduce<
                Record<string, t.Type>
            >((record, [key, shouldBeUnion]) => {
                const typeName = `Tailwind${capitalize(key)}`
                record[key] = t.union(shouldBeUnion, typeName).setExport(true)
                return record
            }, {})

            const tailwindestSchema = t
                .record("Tailwindest", recordType, {
                    keyword: "interface",
                })
                .setExport(true)
            const literalType = await Promise.all(
                Array.from(this.variantsMap.values()).map(
                    async (e) => await this.generator.generate(e)
                )
            )
            const tailwindClassListSchema = t
                .union(
                    Object.values(collectedRecord).flat(),
                    "TailwindClassNames"
                )
                .setExport(true)

            const classListType = await this.generator.generate(
                tailwindClassListSchema
            )
            const classTypeset: string = (
                literalType +
                "\n" +
                classListType
            ).replaceAll(",", "")

            const tailwindestType =
                await this.generator.generate(tailwindestSchema)

            const recordTypeset: string = (
                literalType +
                "\n" +
                tailwindestType
            ).replaceAll(",", "")

            await Promise.all([
                writeFile(saveRoot.tailwindClass, classTypeset, {
                    encoding: "utf-8",
                }),
                writeFile(saveRoot.tailwindRecord, recordTypeset, {
                    encoding: "utf-8",
                }),
            ])
        } catch (e) {
            this.$.error("build type error occurred")
            this.$.error(JSON.stringify(e, null, 4))
        }

        this.$.success("build type finished")
    }
}
