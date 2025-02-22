import { GenericType, GenericValueType } from "./generic"
import { GenericOption, Type } from "./type"

export function getGeneric(
    generic: GenericOption | undefined,
    typeOrGeneric: string | Type
) {
    const isGenericImpossible = typeof typeOrGeneric !== "string"
    if (isGenericImpossible) return typeOrGeneric

    const literalUsage = !Array.isArray(generic) || generic.length === 0
    if (literalUsage) {
        return new GenericValueType(typeOrGeneric)
    }

    const matchedGeneric = generic.find((g) => {
        if (typeof g === "string") return g === typeOrGeneric
        return g.name === typeOrGeneric
    })
    if (!matchedGeneric) return new GenericValueType(typeOrGeneric)

    return new GenericType(typeOrGeneric)
}
