import { writeFile } from "fs"

const CLASS = [
    ":before",
    ":after",
    ":placeholder",
    ":file",
    ":marker",
    ":selection",
    ":first-line",
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
/**
 * @param {string[]} a
 * @param {string[]} b
 * @returns {string[]} combination of a and b
 */
const combination = (a, b) =>
    a.map((a) => b.filter((b) => b !== a).map((b) => `${a}${b}`)).flat()

/**
 * @param {string[]} a
 * @param {string[]} b
 * @returns {string[]} both side of combination of a and b
 */
const combinationAll = (a, b) => {
    const combA = combination(a, b)
    const combB = combination(b, a)
    const res = [...combA, ...combB]
    return res
}

const BasicNestKeys = [...CLASS, ...BREAK_CONDITIONS, ...THEME_CONDITION]
const BasicCombinationNestKeys = combinationAll(CLASS, CLASS)

const data = [
    {
        fileName: "basic",
        typeName: "TailwindNestedBasicType",
        types: BasicNestKeys,
    },
    {
        fileName: "combination",
        typeName: "TailwindNestedCombinationType",
        types: BasicCombinationNestKeys,
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

const FILE_LOCATION = "packages/types/tailwind.nested"
const FILE_TYPE = "ts"
const FILE_IDENT = "@"
data.forEach((data) => {
    const fileName = `${FILE_LOCATION}/${FILE_IDENT}${data.fileName}.${FILE_TYPE}`
    extract(fileName, toUnionTypes(data.types, data.typeName))
})
