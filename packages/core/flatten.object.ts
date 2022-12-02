import type { NestedObject } from "./nested.object.type"

/**
 * @param object string key object
 * @returns Flatten nested object into `string[]`
 */
const flattenObject = <T extends NestedObject>(object: T): string[] =>
    Object.values(object ?? {})
        .map((value) =>
            typeof value !== "string"
                ? flattenObject(value as NestedObject)
                : value
        )
        .flat()

export { flattenObject }
