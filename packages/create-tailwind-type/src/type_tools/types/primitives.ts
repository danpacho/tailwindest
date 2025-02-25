import { Type } from "./type"

export class PrimitiveType extends Type {
    constructor(
        private typeName: string,
        alias?: string
    ) {
        super()
        this.alias = alias
    }
    toTypeString(): string {
        return this.alias ? this.alias : this.typeName
    }
    collectAliases(): string[] {
        const prefix = this.getTypePrefix()
        return this.alias ? [`${prefix}${this.typeName};`] : []
    }
}

export class LiteralType extends Type {
    private useBacktick: boolean
    constructor(
        private value: string | number | boolean,
        alias?: string,
        useBacktick?: boolean
    ) {
        super()
        this.alias = alias
        this.useBacktick = useBacktick ?? false
    }
    private get literal(): string {
        return typeof this.value === "string"
            ? this.useBacktick
                ? `\`${this.value}\``
                : `"${this.value}"`
            : `${this.value}`
    }
    toTypeString(): string {
        if (this.alias) return this.alias
        return this.literal
    }
    collectAliases(): string[] {
        const prefix = this.getTypePrefix()
        return this.alias ? [`${prefix}${this.literal};`] : []
    }
}

/**
 * Type gen primitives
 */
export function number(alias?: string): Type {
    return new PrimitiveType("number", alias)
}
export function string(alias?: string): Type {
    return new PrimitiveType("string", alias)
}
export function boolean(alias?: string): Type {
    return new PrimitiveType("boolean", alias)
}
export function literal(
    value: string | number | boolean,
    opts?: { alias?: string; useBackticks?: boolean }
): Type {
    return new LiteralType(value, opts?.alias, opts?.useBackticks)
}
