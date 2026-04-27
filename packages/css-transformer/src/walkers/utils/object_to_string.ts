export function objectToString(
    obj: Record<string, any>,
    indent: number = 4
): string {
    const spaces = " ".repeat(indent)
    const prevSpaces = " ".repeat(Math.max(0, indent - 4))

    let str = "{\n"

    for (const [key, value] of Object.entries(obj)) {
        // Handle identifier keys
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
            ? key
            : `"${key}"`

        if (value === null) {
            str += `${spaces}${safeKey}: null,\n`
        } else if (Array.isArray(value)) {
            const arrayItems = value
                .map((v) => (typeof v === "string" ? `"${v}"` : String(v)))
                .join(", ")
            str += `${spaces}${safeKey}: [${arrayItems}],\n`
        } else if (typeof value === "object") {
            str += `${spaces}${safeKey}: ${objectToString(value, indent + 4)},\n`
        } else if (typeof value === "string") {
            str += `${spaces}${safeKey}: "${value}",\n`
        } else {
            str += `${spaces}${safeKey}: ${value},\n`
        }
    }

    str += `${prevSpaces}}`
    return str
}
