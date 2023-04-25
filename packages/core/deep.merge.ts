import type { NestedObject } from "../utils"

/**
 * @param nestedObject string key object
 * @returns Merge nested style object deeply
 */
const deepMerge = <MergeTargetObject>(
    ...nestedObject: MergeTargetObject[]
): MergeTargetObject =>
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
                        mergedObject[currKey] = deepMerge(
                            mergedObject[currKey],
                            currValue
                        )
                    }
                }
            }
        }
        return mergedObject
    }, {}) as MergeTargetObject

export { deepMerge }
