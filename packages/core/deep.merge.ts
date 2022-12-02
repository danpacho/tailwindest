/* eslint-disable @typescript-eslint/no-extra-semi */
import type { NestedObject } from "./nested.object.type"

/**
 * @param obj string key object
 * @returns Merge nested style object deeply
 */
const deepMerge = <T>(...obj: T[]): T =>
    obj.reduce<T>((merged, obj) => {
        const objectEntries = Object.entries<unknown>(obj as NestedObject)
        for (const [key, value] of objectEntries) {
            if ((merged as NestedObject)[key] === undefined) {
                ;(merged as NestedObject)[key] = value
            } else {
                if (typeof value === "string") {
                    ;(merged as NestedObject)[key] = value
                } else {
                    if (value) {
                        if (typeof (merged as NestedObject)[key] === "string") {
                            deepMerge((merged as NestedObject)[key], value)
                        } else {
                            ;(merged as NestedObject)[key] = deepMerge(
                                (merged as NestedObject)[key],
                                value
                            )
                        }
                    }
                }
            }
        }
        return merged
    }, {} as T)

export { deepMerge }
