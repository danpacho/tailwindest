/**
 * LCP for class strings
 * @param {string[]} classNames - The array of strings to inspect.
 * @returns {string} - The longest common prefix.
 */
function LCP(classNames) {
    if (!classNames.length) return ""

    let prefix = classNames[0]

    for (let i = 1; i < classNames.length; i++) {
        const str = classNames[i]
        while (!str.startsWith(prefix)) {
            prefix = prefix.slice(0, -1)
            if (!prefix) return ""
        }
    }
    return prefix
}

/**
 * LCP for tailwind classNames
 * @param {string[]} classNames - The list of class names to analyze.
 * @returns {string[]} - A single prefix string, or an array of two.
 */
export function getTailwindLCP(classNames) {
    /**
     * @param {string} str
     */
    const trimHyphens = (str) => {
        return str.replace(/^-+|-+$/g, "")
    }

    /**
     * @type {Array<Array<string>>}
     */
    const ident = classNames.map((tw) => {
        const twList = tw.split("-").filter((e) => e !== "")
        if (twList.length === 0) {
            return [tw, tw]
        }
        const first = twList[0]
        return [first, trimHyphens(tw)]
    })
    const uniqueKeys = Array.from(new Set(ident.map((value) => value[0])))

    /**
     * @param {string} key
     * @param {Array<Array<string>>} ident
     * @returns {Array<string>}
     */
    const findByKey = (key, ident) => {
        const res = []
        for (const curr of ident) {
            if (curr[0] === key) {
                res.push(curr[1])
            }
        }
        return res
    }
    const identGroups = uniqueKeys.map((key) => {
        return findByKey(key, ident)
    })

    const commonSubsets = identGroups.map((ident) => trimHyphens(LCP(ident)))

    return commonSubsets
}

/**
 * LCP for tailwind classNames
 * @param {string[]} classNames - The list of class names to analyze.
 * @param {Set<string>} uniqueKeyStore - Unique key store
 * @returns {string[]} - A single prefix string, or an array of two.
 */
export function getTailwindLCPByKeyStore(classNames, uniqueKeyStore) {
    /**
     * @param {string} str
     */
    const trimHyphens = (str) => {
        return str.replace(/^-+|-+$/g, "")
    }
    console.log(uniqueKeyStore)

    /**
     * @param {string} className
     */
    const findUniqueKey = (className) => {
        const twList = className.split("-").filter((e) => e !== "")
        if (twList.length === 0) return className

        let ptr = 0
        let uniqueKey = twList[ptr]
        while (ptr < twList.length) {
            if (!uniqueKeyStore.has(uniqueKey)) {
                ptr = ptr + 1
                if (ptr >= twList.length) {
                    throw new Error(
                        `Classname unique not founded for ${className}`,
                        {
                            cause: Array.from(uniqueKeyStore),
                        }
                    )
                }
                uniqueKey = twList[ptr]
            }
        }

        return uniqueKey
    }

    /**
     * @type {Array<Array<string>>}
     */
    const ident = classNames.map((className) => {
        return [findUniqueKey(className), trimHyphens(className)]
    })
    const uniqueKeys = Array.from(new Set(ident.map((value) => value[0])))

    /**
     * @param {string} key
     * @param {Array<Array<string>>} ident
     * @returns {Array<string>}
     */
    const findByKey = (key, ident) => {
        const res = []
        for (const curr of ident) {
            if (curr[0] === key) {
                res.push(curr[1])
            }
        }
        return res
    }
    const identGroups = uniqueKeys.map((key) => {
        return findByKey(key, ident)
    })

    const commonSubsets = identGroups.map((ident) => trimHyphens(LCP(ident)))

    commonSubsets.forEach((key) => {
        uniqueKeyStore.add(key)
    })

    return commonSubsets
}
