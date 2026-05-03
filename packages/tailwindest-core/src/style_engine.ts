import { flattenStyleRecord } from "./style_normalizer"

type NestedRecord = Record<string, unknown>

/**
 * Additional class tokens that can be merged into a single className string.
 */
export type AdditionalClassTokens<Literal extends string = string> = Array<
    Literal | Array<Literal>
>

/**
 * Merge arbitrary class list into one valid style classname string.
 */
export type Merger<Literal extends string = string> = (
    ...classList: AdditionalClassTokens<Literal>
) => string

export function flattenRecord<FlattenTargetObject>(
    object: FlattenTargetObject
): Array<string> {
    return flattenStyleRecord(object)
}

export function deepMerge<MergeTargetObject>(
    ...nestedRecordList: Array<MergeTargetObject>
): MergeTargetObject {
    return nestedRecordList.reduce<NestedRecord>(
        (mergedObject, currentObject) => {
            if (!currentObject) return mergedObject

            for (const [key, value] of Object.entries(
                currentObject as NestedRecord
            )) {
                if (mergedObject[key] === undefined) {
                    mergedObject[key] = value
                } else {
                    const existing = mergedObject[key]
                    if (Array.isArray(value)) {
                        mergedObject[key] = value
                    } else if (
                        typeof existing === "object" &&
                        existing !== null &&
                        typeof value === "object" &&
                        value !== null
                    ) {
                        mergedObject[key] = deepMerge(
                            existing as NestedRecord,
                            value as NestedRecord
                        )
                    } else {
                        mergedObject[key] = value
                    }
                }
            }
            return mergedObject
        },
        {}
    ) as MergeTargetObject
}

export function getClassName<Style>(style: Style): string {
    return flattenRecord(style as NestedRecord).join(" ")
}

export function defaultMerge(...classList: AdditionalClassTokens): string {
    return classList.join(" ").trim()
}

export function mergeClassNames<Literal extends string = string>(
    merger: Merger<Literal> | undefined,
    ...classList: AdditionalClassTokens<Literal>
): string {
    const tokens = classList
        .flatMap((token) => (Array.isArray(token) ? token : token.split(" ")))
        .filter((token) => token && token.length > 0)
        .map((token) => token.trim())

    return merger
        ? merger(...(tokens as AdditionalClassTokens<Literal>))
        : defaultMerge(...tokens)
}
