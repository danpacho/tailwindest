import { writeFile } from "fs"

const PSEUDO_ELEMENTS = [
    "before",
    "after",
    "placeholder",
    "file",
    "marker",
    "backdrop",
    "selection",
    "first-line",
    "first-letter",
]
const PSEUDO_CLASSES = [
    "hover",
    "active",
    "first",
    "last",
    "only",
    "odd",
    "even",
    "first-of-type",
    "last-of-type",
    "only-of-type",
    "empty",
    "enabled",
    "indeterminate",
    "default",
    "required",
    "valid",
    "invalid",
    "in-range",
    "out-of-range",
    "placeholder-shown",
    "autofill",
    "read-only",
    "checked",
    "disabled",
    "visited",
    "target",
    "focus",
    "focus-within",
    "focus-visible",
    "optional",
]

const MEDIA_CONDITIONS = [
    "contrast-more",
    "contrast-less",
    "motion-reduce",
    "motion-safe",
    "portrait",
    "landscape",
    "print",
    "rtl",
    "ltr",
    "forced-colors",
]

const SCREEN_CONDITIONS = [
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
]

const ARIA_CONDITIONS = [
    "aria-checked",
    "aria-disabled",
    "aria-expanded",
    "aria-hidden",
    "aria-pressed",
    "aria-readonly",
    "aria-required",
    "aria-selected",
]

const CHILD_CONDITIONS = ["*"]

const THEME_CONDITION = ["dark"]

const BREAK_CONDITIONS = [
    ...MEDIA_CONDITIONS,
    ...SCREEN_CONDITIONS,
    ...ARIA_CONDITIONS,
    ...THEME_CONDITION,
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
const buildUnionTypes = (keys, typeName) => {
    const keyLength = keys.length - 1
    const unionList = keys.map((key, index) => {
        const isLast = index === keyLength
        if (isLast) return `"${key}"`
        return `"${key}" |`
    })
    const unionType = unionList.join(" ")
    const exportType = `export type ${typeName} = ${unionType}`
    return exportType
}

/**
 * @type {{fileName: string; typeName: string; types: string[]}[]}
 */
const buildData = [
    {
        fileName: "break",
        typeName: "TailwindBreakConditions",
        types: BREAK_CONDITIONS,
    },
    {
        fileName: "pseudo.class",
        typeName: "TailwindPseudoClassConditions",
        types: PSEUDO_CLASSES,
    },
    {
        fileName: "pseudo.element",
        typeName: "TailwindPseudoElementConditions",
        types: PSEUDO_ELEMENTS,
    },
    {
        fileName: "global",
        typeName: "TailwindGlobalConditions",
        types: CHILD_CONDITIONS,
    },
]

const buildNestClass = () => {
    const TYPE_BUILD_INFO = {
        LOCATION: `${process.cwd()}/packages/tailwindest/src/types/nest.keys`,
        FILE_FORMAT: "ts",
    }

    buildData.forEach((data) => {
        const fileName = `${TYPE_BUILD_INFO.LOCATION}/${data.fileName}.${TYPE_BUILD_INFO.FILE_FORMAT}`
        extractFile(fileName, buildUnionTypes(data.types, data.typeName))
    })
}

buildNestClass()
