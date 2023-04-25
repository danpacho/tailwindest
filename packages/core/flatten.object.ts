import type { NestedObject } from "../utils"

/**
 * @param object string key object
 * @returns Flatten nested object into `string[]`
 */
const flattenObject = <FlattenTargetObject extends NestedObject>(
    object: FlattenTargetObject
): string[] =>
    Object.values(object ?? {})
        .map((value) =>
            typeof value !== "string"
                ? flattenObject(value as NestedObject)
                : value
        )
        .flat()

export { flattenObject }
