import { writeFile } from "fs"

const PSEUDO_CLASS_ELEMENTS = [
    ":before",
    ":after",
    ":placeholder",
    ":file",
    ":marker",
    ":selection",
    ":first-line",
    ":first-letter",
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
    ":contrast-more",
    ":motion-reduce",
    ":motion-safe",
    ":rtl",
    ":ltr",
    ":portrait",
    ":landscape",
]

const BREAK_CONDITIONS = [":sm", ":md", ":lg", ":xl", ":2xl"]
const THEME_CONDITION = [":dark"]

const BasicNestKeys = [
    ...PSEUDO_CLASS_ELEMENTS,
    ...BREAK_CONDITIONS,
    ...THEME_CONDITION,
]

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
