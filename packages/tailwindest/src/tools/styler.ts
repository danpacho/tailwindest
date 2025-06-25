import type { AdditionalClassTokens, Merger } from "./merger_interface"

type NestedRecord = Record<string, unknown>
export abstract class Styler<Args, Out, Literal extends string = string> {
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
    public setMerger(merger: Merger | undefined) {
        if (!merger) return this
        this._merger = merger
        return this
    }
    private _merger: Merger | null = null
    private static _defaultMerger: Merger = (...classList) =>
        classList.join(" ").trim()
    /**
     * Merge className tokens into one className string.
     * @param classList list of className strings or arrays of className strings
     * @returns Merged className string
     */
    public merge(...classList: AdditionalClassTokens<Literal>): string {
        const tokens = classList
            .flatMap((token) =>
                Array.isArray(token) ? token : token.split(" ")
            )
            .filter((token) => token && token.length > 0)
            .map((token) => token.trim())

        return this._merger
            ? this._merger(...tokens)
            : Styler._defaultMerger(...tokens)
    }

    public abstract class(
        key: Args,
        ...classList: AdditionalClassTokens<Literal>
    ): string
    public abstract style(key: Args, ...extraStyle: Array<Out>): unknown

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
