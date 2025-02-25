import type { Merger } from "./merger_interface"

type NestedRecord = Record<string, unknown>

export abstract class Styler<Args, Out> {
    /**
     * Merge tailwind className strings
     * @param merger tailwind property merger
     * @example
     * ```ts
     * // Using `tw-merge` as className merger
     * const twMerge = createTailwindMerge(() => {...})
     *
     * // merger added
     * const tw = createTools<Tailwindest>({ merger: twMerge })
     * ```
     */
    public setMerger(merger: Merger): void {
        this._merger = merger
    }
    private _merger: Merger | null = null
    public get merger(): Merger {
        const defaultMerger: Merger = (...classList) =>
            classList.join(" ").trim()
        return this._merger ?? defaultMerger
    }

    public abstract class(key: Args, extraClassName?: string): string
    public abstract style(key: Args, extraStyle?: Out): unknown

    /**
     * Compose styles and return new stylesheet
     * @param styles compose target styles
     * @returns composed instance
     */
    public abstract compose(...styles: Array<Out>): unknown

    /**
     * Flatten record
     */
    public static flattenRecord<FlattenTargetObject>(
        object: FlattenTargetObject
    ): Array<string> {
        return Object.values(object ?? {})
            .map((value) =>
                typeof value !== "string"
                    ? Styler.flattenRecord(value as NestedRecord)
                    : value
            )
            .flat()
    }

    /**
     * Deep merge record into one record
     */
    public static deepMerge<MergeTargetObject>(
        ...nestedRecordList: Array<MergeTargetObject>
    ): MergeTargetObject {
        return nestedRecordList.reduce<NestedRecord>(
            (mergedObject, currentObject) => {
                for (const [key, value] of Object.entries(
                    currentObject as NestedRecord
                )) {
                    if (mergedObject[key] === undefined) {
                        mergedObject[key] = value
                    } else {
                        const existing = mergedObject[key]
                        if (Array.isArray(existing) || Array.isArray(value)) {
                            const existingArray = Array.isArray(existing)
                                ? existing
                                : [existing]
                            const valueArray = Array.isArray(value)
                                ? value
                                : [value]
                            mergedObject[key] = existingArray.concat(valueArray)
                        } else if (
                            typeof existing === "object" &&
                            existing !== null &&
                            typeof value === "object" &&
                            value !== null
                        ) {
                            mergedObject[key] = Styler.deepMerge(
                                existing as NestedRecord,
                                value as NestedRecord
                            )
                        }
                        // Otherwise (both are strings or mismatched types) override with new value.
                        else {
                            mergedObject[key] = value
                        }
                    }
                }
                return mergedObject
            },
            {}
        ) as MergeTargetObject
    }

    /**
     * Get className from styles
     */
    public static getClassName<Style>(style: Style): string {
        return Styler.flattenRecord(style as NestedRecord).join(" ")
    }
}
