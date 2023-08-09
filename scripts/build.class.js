import { writeFile } from "fs"

const PSEUDO_ELEMENTS = [
    "::before",
    "::after",
    "::placeholder",
    "::file",
    "::marker",
    "::selection",
    "::first-line",
    "::first-letter",
]
const PSEUDO_CLASSES = [
    ":backdrop",
    ":hover",
    ":active",
    ":first",
    ":last",
    ":only",
    ":odd",
    ":even",
    ":first-of-type",
    ":last-of-type",
    ":only-of-type",
    ":empty",
    ":enabled",
    ":indeterminate",
    ":default",
    ":required",
    ":valid",
    ":invalid",
    ":in-range",
    ":out-of-range",
    ":placeholder-shown",
    ":autofill",
    ":read-only",
    ":checked",
    ":disabled",
    ":visited",
    ":target",
    ":focus",
    ":focus-within",
    ":focus-visible",
]

const MEDIA_CONDITIONS = [
    "@contrast-more",
    "@contrast-less",
    "@motion-reduce",
    "@motion-safe",
    "@portrait",
    "@landscape",
    "@print",
    "@rtl",
    "@ltr",
]

const BREAK_CONDITIONS = [
    "@sm",
    "@md",
    "@lg",
    "@xl",
    "@2xl",
    "@max-sm",
    "@max-md",
    "@max-lg",
    "@max-xl",
    "@max-2xl",
]

const ARIA_CONDITIONS = [
    "@aria-checked",
    "@aria-disabled",
    "@aria-expanded",
    "@aria-hidden",
    "@aria-pressed",
    "@aria-readonly",
    "@aria-required",
    "@aria-selected",
]

const THEME_CONDITION = ["@dark"]

const BasicNestKeys = [
    ...PSEUDO_CLASSES,
    ...PSEUDO_ELEMENTS,
    ...MEDIA_CONDITIONS,
    ...BREAK_CONDITIONS,
    ...ARIA_CONDITIONS,
    ...THEME_CONDITION,
]

const SHORT_HANDED_IDENTIFIER = "$"

/**
 * Replaces `:`, `::`, and `@` with `$`.
 * @param {string[]} classNames - The input array of strings to transform.
 */
const toShortTailwindestIdentifier = (classNames) =>
    classNames.map((inputString) => {
        // replace ':', '::', '@' with '$'
        const replacedInputString = inputString
            .replaceAll(/@/g, SHORT_HANDED_IDENTIFIER)
            .replaceAll(/::/g, SHORT_HANDED_IDENTIFIER)
            .replaceAll(/:/g, SHORT_HANDED_IDENTIFIER)

        return replacedInputString
    })

/**
 * @type {{fileName: string; typeName: string; types: string[]}[]}
 */
const buildData = [
    {
        fileName: "basic",
        typeName: "TailwindNestedBasicType",
        types: BasicNestKeys,
    },
    {
        fileName: "basic.short",
        typeName: "ShortTailwindNestedBasicType",
        types: toShortTailwindestIdentifier(BasicNestKeys),
    },
]

/**
 *
 * @param {string} fileName
 * @param {string} data
 */
const extractFile = (fileName, data) => {
    writeFile(fileName, data, (err) => {
        if (err) {
            throw new Error(`Write to ${fileName} failed`, err)
        }
    })
}

/**
 * @param {string[]} keys
 * @param {string} typeName
 * @returns {string} unionType
 */
const toUnionTypes = (keys, typeName) => {
    const keyLength = keys.length - 1
    const toUnion = keys.map((key, index) => {
        const isLast = index === keyLength
        if (isLast) return `"${key}"`
        return `"${key}" |`
    })
    const unionType = toUnion.join(" ")
    const exportType = `export type ${typeName} = ${unionType}`
    return exportType
}

const buildNestClass = () => {
    const TYPE_BUILD_INFO = {
        LOCATION: `${process.cwd()}/packages/tailwindest/src/types/tailwind.nested`,
        FILE_FORMAT: "ts",
        IDENTIFIER: "@",
    }

    buildData.forEach((data) => {
        const fileName = `${TYPE_BUILD_INFO.LOCATION}/${TYPE_BUILD_INFO.IDENTIFIER}${data.fileName}.${TYPE_BUILD_INFO.FILE_FORMAT}`
        extractFile(fileName, toUnionTypes(data.types, data.typeName))
    })
}

buildNestClass()
