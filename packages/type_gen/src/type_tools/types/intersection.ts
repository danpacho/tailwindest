import { getGeneric } from "./get.generic"
import { toGenericTypeString } from "./to.generic.type.string"
import { type GenericOption, Type } from "./type"

class IntersectionType extends Type {
    private types: Array<Type>

    constructor(
        types: Array<Type | string>,
        alias?: string,
        generic?: GenericOption
    ) {
        super()
        this.alias = alias
        this.generic = generic
        this.types = types.map((t) => getGeneric(generic, t))
    }
    private intersection(genericLiterals?: Array<string>): string {
        return this.types
            .map((t) => t.toTypeString(genericLiterals))
            .join(" & ")
    }
    toTypeString(genericLiterals?: Array<string>): string {
        return toGenericTypeString({
            typegen: this.intersection.bind(this),
            alias: this.alias,
            generic: this.generic,
            genericLiterals,
        })
    }
    collectAliases(genericLiterals?: Array<string>): string[] {
        const childAliases = this.types.flatMap((t) =>
            t.collectAliases(genericLiterals)
        )
        const prefix = this.getTypePrefix()
        const selfAlias = this.alias
            ? [`${prefix}${this.intersection(genericLiterals)};`]
            : []
        return [...childAliases, ...selfAlias]
    }
}

export function intersection(
    types: Array<Type | string>,
    alias?: string,
    generic?: GenericOption
): Type {
    return new IntersectionType(types, alias, generic)
}
