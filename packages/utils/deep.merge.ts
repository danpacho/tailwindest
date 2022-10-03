import type { NestedObject } from "./nested.object.type"

/**
 * @param object string key object
 * @returns Merge nested style object deeply
 */
const deepMerge = <T extends NestedObject>(...obj: T[]): NestedObject => {
    const mergedObject: NestedObject = obj.reduce<NestedObject>(
        (merged, obj) => {
            const objectEntries = Object.entries<unknown>(obj)
            for (const [key, value] of objectEntries) {
                if (merged[key] === undefined) {
                    merged[key] = value
                } else {
                    if (typeof value === "string") {
                        merged[key] = value
                    } else {
                        const res = deepMerge(
                            merged[key] as NestedObject,
                            value as NestedObject
                        )
                        merged[key] = res
                    }
                }
            }
            return merged
        },
        {} as NestedObject
    )

    return mergedObject
}

export { deepMerge }
