export const capitalize = (...text: string[]): string =>
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

export const kebabToCamelCase = (str: string): string => {
    return str.replace(/-./g, (match) => match[1]?.toUpperCase() ?? "")
}

export const camelToKebabCase = (str: string): string => {
    return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
}

export const toValidCSSProperty = (property: string): string => {
    const withoutPrefix = property.replace(/^-(webkit|moz|ms|o)-/, "")

    return withoutPrefix.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}

export const isTwClassPure = (text: string): boolean => {
    return /^[A-Za-z\s]+$/.test(text.replaceAll("-", ""))
}

export const sanitizeTwClass = (className: string): string => {
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

export const isNumericString = (str: string): boolean => {
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
export const generateValidator = (rawText: string): RegExp | null => {
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
