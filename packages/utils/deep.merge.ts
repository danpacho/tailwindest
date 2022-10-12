/* eslint-disable @typescript-eslint/no-extra-semi */
import type { NestedObject } from "./nested.object.type"

/**
 * @param object string key object
 * @returns Merge nested style object deeply
 */
const deepMerge = <T extends NestedObject>(...obj: T[]): T => {
    const mergedObject: T = obj.reduce<T>((merged, obj) => {
        const objectEntries = Object.entries<unknown>(obj)
        for (const [key, value] of objectEntries) {
            if (merged[key] === undefined) {
                ;(merged as NestedObject)[key] = value
            } else {
                if (typeof value === "string") {
                    ;(merged as NestedObject)[key] = value
                } else {
                    const res = deepMerge(
                        merged[key] as NestedObject,
                        value as NestedObject
                    )
                    ;(merged as NestedObject)[key] = res
                }
            }
        }
        return merged
    }, {} as T)

    return mergedObject
}

export { deepMerge }
