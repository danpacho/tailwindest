import { getGeneric } from "./get.generic"
import { type GenericOption, Type } from "./type"

type RecordDefineMethod = "type" | "interface"

export class RecordType extends Type {
    private fields: Record<string, Type>
    public extendsList: Array<RecordType> | null = null
    public setExtends(extendsList: Array<RecordType>): this {
        if (extendsList.length > 0) {
            this.extendsList = extendsList
        }
        return this
    }
    constructor(
        filed: Record<string, Type | string>,
        alias?: string,
        generic?: GenericOption,
        public readonly keyword: RecordDefineMethod = "type"
    ) {
        super()

        this.fields = Object.entries(filed).reduce<Record<string, Type>>(
            (acc, [key, value]) => {
                acc[key] = getGeneric(generic, value)
                return acc
            },
            {}
        )
        this.alias = alias
        this.generic = generic
    }
    private getRecordPrefix() {
        const typePrefix = this.getTypePrefix()

        if (this.keyword === "type") return typePrefix

        const interfacePrefix = `${typePrefix.replace("type", "interface").replace("=", "")}`

        if (Array.isArray(this.extendsList)) {
            const withExtendsPrefix = `${interfacePrefix} extends ${this.extendsList
                ?.map((e) => {
                    if (Array.isArray(e.generic)) {
                        const generics = e.generic
                            .map((gen) => {
                                return (
                                    this.generic?.find((genName) => {
                                        return typeof gen === "string"
                                            ? genName === gen
                                            : genName === gen.name
                                    }) ?? null
                                )
                            })
                            .filter((e) => e !== null)
                        return `${e.alias}<${generics.join(", ")}>`
                    }
                    return e.alias
                })
                .join(", ")}`

            return withExtendsPrefix
        }

        return interfacePrefix
    }
    toTypeString(genericLiterals?: Array<string>): string {
        const prefix = this.getRecordPrefix()
        const fieldsStr = Object.entries(this.fields)
            .map(([name, type]) => {
                const fieldType: string = name.includes("?") ? "?:" : ":"
                return `${type.getDoc()}${name.replaceAll("?", "")}${fieldType} ${type.toTypeString(genericLiterals)}`
            })
            .join(";\n  ")
        const recordStr = `{\n  ${fieldsStr}\n}`
        return prefix ? prefix + recordStr : recordStr
    }
    collectAliases(genericLiterals?: Array<string>): string[] {
        const childAliases = Object.values(this.fields).flatMap((t) =>
            t.collectAliases(genericLiterals)
        )
        const selfAlias = this.alias ? [this.toTypeString(genericLiterals)] : []
        return [...childAliases, ...selfAlias]
    }
}

type RecordGenerationOption = {
    generic?: GenericOption
    keyword?: RecordDefineMethod
}
export function record(
    nameOrFields: string | Record<string, Type | string>,
    fieldsOrOptions?: Record<string, Type | string> | RecordGenerationOption,
    maybeOptions?: RecordGenerationOption
): RecordType {
    const isAliasSpecified = typeof nameOrFields === "string"
    if (isAliasSpecified) {
        const typeName = nameOrFields
        const fieldsObj = fieldsOrOptions as Record<string, Type | string>
        const options = maybeOptions || {}
        return new RecordType(
            fieldsObj,
            typeName,
            options.generic,
            options.keyword
        )
    }

    const fieldsObj = nameOrFields as Record<string, Type | string>
    const options = fieldsOrOptions as RecordGenerationOption | undefined
    return new RecordType(
        fieldsObj,
        undefined,
        options?.generic,
        options?.keyword
    )
}
