import {
    deepMerge,
    flattenRecord,
    getClassName,
    mergeClassNames,
} from "@tailwindest/core"
import type { AdditionalClassTokens, Merger } from "./merger_interface"

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
    /**
     * Merge className tokens into one className string.
     * @param classList list of className strings or arrays of className strings
     * @returns Merged className string
     */
    public merge(...classList: AdditionalClassTokens<Literal>): string {
        return mergeClassNames(this._merger ?? undefined, ...classList)
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
        return flattenRecord(object)
    }

    /**
     * Deep merge record into one record
     */
    public static deepMerge<MergeTargetObject>(
        ...nestedRecordList: Array<MergeTargetObject>
    ): MergeTargetObject {
        return deepMerge(...nestedRecordList)
    }

    /**
     * Get className from styles
     */
    public static getClassName<Style>(style: Style): string {
        return getClassName(style)
    }
}
