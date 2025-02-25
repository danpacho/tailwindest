import { toGenericTypeString } from "./to.generic.type.string"
import { type GenericOption, Type } from "./type"

export class ArrayType extends Type {
    constructor(
        public element: Type,
        alias?: string,
        generic?: GenericOption
    ) {
        super()
        this.alias = alias
        this.generic = generic
    }
    private array(genericLiterals?: Array<string>): string {
        return `Array<${this.element.toTypeString(genericLiterals)}>`
    }
    toTypeString(genericLiterals?: Array<string>): string {
        return toGenericTypeString({
            typegen: this.array.bind(this),
            alias: this.alias,
            generic: this.generic,
            genericLiterals,
        })
    }
    collectAliases(genericLiterals?: Array<string>): string[] {
        const childAliases = this.element.collectAliases(genericLiterals)
        const prefix = this.getTypePrefix()
        const selfAlias = this.alias
            ? [`${prefix}${this.array(genericLiterals)};`]
            : []
        return [...childAliases, ...selfAlias]
    }
}

export function array(
    type: Type,
    alias?: string,
    generic?: GenericOption
): ArrayType {
    return new ArrayType(type, alias, generic)
}
