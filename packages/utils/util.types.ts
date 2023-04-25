export type ClassName = string
export type CacheKey = string | symbol | number
export type StyleGeneratorCache<StyleType extends NestedObject> = [
    StyleType,
    ClassName
]

export type ToString<MightBeString> = Extract<MightBeString, string>

export type NestedObject = Record<string, unknown>
