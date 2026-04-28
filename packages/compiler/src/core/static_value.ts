export type StaticClassDictionary = Record<string, unknown>

export type StaticClassValue =
    | StaticClassValue[]
    | StaticClassDictionary
    | string
    | number
    | bigint
    | boolean
    | null
    | undefined

export type StaticStyleValue =
    | StaticStyleObject
    | StaticStyleValue[]
    | string
    | number
    | bigint
    | boolean
    | null
    | undefined

export interface StaticStyleObject {
    [key: string]: StaticStyleValue
}
