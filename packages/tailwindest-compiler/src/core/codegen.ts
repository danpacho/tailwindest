/**
 * Runtime-free JavaScript expression emitted by the low-level compiler.
 *
 * `declarations` contains deterministic helper declarations that must appear
 * before `expression` when a lookup table is needed.
 *
 * @public
 */
export interface GeneratedExpression {
    declarations: string[]
    expression: string
}

let symbolCounter = 0

export function resetCodegenSymbolCounter(): void {
    symbolCounter = 0
}

export function createGeneratedSymbol(prefix: string): string {
    symbolCounter += 1
    const safePrefix = sanitizeIdentifierPart(prefix)
    return `__tw_${safePrefix}_${symbolCounter}`
}

export function emitStringLiteral(value: string): GeneratedExpression {
    return {
        declarations: [],
        expression: JSON.stringify(value),
    }
}

export function emitValueLiteral(value: unknown): GeneratedExpression {
    return {
        declarations: [],
        expression: literalExpression(value),
    }
}

export function emitReadonlyConst(name: string, value: unknown): string {
    return `const ${name} = ${literalExpression(value)} as const`
}

export function emitLookupExpression(
    prefix: string,
    table: Record<string, unknown>,
    keyExpression: string
): GeneratedExpression {
    const symbol = createGeneratedSymbol(prefix)
    return {
        declarations: [emitReadonlyConst(symbol, table)],
        expression: `${symbol}[${keyExpression}]`,
    }
}

export function emitRuntimeFreeModule(generated: GeneratedExpression): string {
    return `${generated.declarations.join("\n")}\nexport const compiled = ${generated.expression}`
}

export function literalExpression(value: unknown): string {
    if (value === undefined) return "undefined"
    if (typeof value === "string") return JSON.stringify(value)
    if (typeof value === "number" || typeof value === "boolean") {
        return String(value)
    }
    if (typeof value === "bigint") return `${value.toString()}n`
    if (value === null) return "null"
    if (Array.isArray(value)) {
        return `[${value.map((item) => literalExpression(item)).join(",")}]`
    }
    if (typeof value === "object") {
        const entries = Object.entries(value as Record<string, unknown>).map(
            ([key, item]) => `${JSON.stringify(key)}:${literalExpression(item)}`
        )
        return `{${entries.join(",")}}`
    }
    return "undefined"
}

function sanitizeIdentifierPart(value: string): string {
    const sanitized = value.replace(/[^A-Za-z0-9_$]/g, "_")
    if (sanitized.length === 0) return "value"
    return /^[0-9]/.test(sanitized) ? `_${sanitized}` : sanitized
}
