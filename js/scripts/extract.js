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

const BREAK_CONDITIONS = ["@sm", "@md", "@lg", "@xl", "@2xl"]
const THEME_CONDITION = ["@dark"]

const BasicNestKeys = [
    ...PSEUDO_CLASSES,
    ...PSEUDO_ELEMENTS,
    ...MEDIA_CONDITIONS,
    ...BREAK_CONDITIONS,
    ...THEME_CONDITION,
]

/**
 * @type {{fileName: string; typeName: string; types: string[]}[]}
 */
const data = [
    {
        fileName: "basic",
        typeName: "TailwindNestedBasicType",
        types: BasicNestKeys,
    },
]

/**
 *
 * @param {string} fileName
 * @param {string} data
 */
const extract = (fileName, data) => {
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

const TYPE = {
    LOCATION: "packages/types/tailwind.nested",
    TYPE: "ts",
    IDENT: "@",
}

data.forEach((data) => {
    const fileName = `${TYPE.LOCATION}/${TYPE.IDENT}${data.fileName}.${TYPE.TYPE}`
    extract(fileName, toUnionTypes(data.types, data.typeName))
})
