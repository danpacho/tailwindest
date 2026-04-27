export function splitByColon(token: string): string[] {
    const segments: string[] = []
    let current = ""
    let bracketDepth = 0

    for (const char of token) {
        if (char === "[") bracketDepth++
        if (char === "]") bracketDepth--
        if (char === ":" && bracketDepth === 0) {
            segments.push(current)
            current = ""
        } else {
            current += char
        }
    }
    segments.push(current)
    return segments
}

export function splitClassString(input: string): string[] {
    return input.split(/\s+/).filter((token) => token.length > 0)
}

export function extractVariants(token: string): {
    variants: string[]
    utility: string
} {
    const segments = splitByColon(token)
    if (segments.length === 1) {
        return { variants: [], utility: segments[0]! }
    }

    const utility = segments[segments.length - 1]!
    const variants = segments.slice(0, -1)

    return { variants, utility }
}
