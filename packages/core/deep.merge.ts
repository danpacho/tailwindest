import type { NestedObject } from "./nested.object.type"

/**
 * @param nestedObject string key object
 * @returns Merge nested style object deeply
 */
const deepMerge = <T>(...nestedObject: T[]): T =>
    nestedObject.reduce<NestedObject>((mergedObject, currentObject) => {
        for (const [currKey, currValue] of Object.entries(
            currentObject as NestedObject
        )) {
            if (mergedObject[currKey] === undefined) {
                mergedObject[currKey] = currValue
            } else {
                if (typeof currValue === "string") {
                    mergedObject[currKey] = currValue
                } else {
                    if (currValue) {
                        if (typeof mergedObject[currKey] === "string") {
                            deepMerge(mergedObject[currKey], currValue)
                        } else {
                            mergedObject[currKey] = deepMerge(
                                mergedObject[currKey],
                                currValue
                            )
                        }
                    }
                }
            }
        }
        return mergedObject
    }, {}) as T

export { deepMerge }
