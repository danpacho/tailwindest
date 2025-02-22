import { Type } from "./type"

export class GenericValueType extends Type {
    constructor(private value: string) {
        super()
    }
    toTypeString(): string {
        return this.value
    }
    collectAliases(): string[] {
        return []
    }
}

export class GenericType extends Type {
    constructor(
        private name: string,
        alias?: string
    ) {
        super()
        this.alias = alias
    }
    toTypeString(): string {
        return this.alias ? this.alias : this.name
    }
    collectAliases(): string[] {
        return this.alias ? [`type ${this.alias} = ${this.name};`] : []
    }
}
