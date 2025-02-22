import { GenericOption } from "./type"

export function toGenericTypeString({
    generic,
    alias,
    genericLiterals,
    typegen,
}: {
    generic: GenericOption | undefined
    alias: string | undefined
    typegen: (genericLiterals?: Array<string>) => string
    genericLiterals?: Array<string> | undefined
}): string {
    if (!alias) return typegen(genericLiterals)

    if (genericLiterals && genericLiterals.length > 0 && generic) {
        const matchedGeneric =
            generic
                .map((g) => {
                    if (typeof g === "string") return g
                    return g.name
                })
                .join("") === genericLiterals.join("")
        if (matchedGeneric) {
            return `${alias}<${genericLiterals.join(", ")}>`
        }
    }

    return alias
}
