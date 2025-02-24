import type { NestedObject } from "../utils"
import type { Merger } from "./merger_interface"

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
     * Flatten objects
     * @param object string key object
     */
    public static flattenObject<FlattenTargetObject>(
        object: FlattenTargetObject
    ): Array<string> {
        return Object.values(object ?? {})
            .map((value) =>
                typeof value !== "string"
                    ? Styler.flattenObject(value as NestedObject)
                    : value
            )
            .flat()
    }

    /**
     * Deeply merge objects into one object
     * @param nestedObject string key object
     */
    public static deepMerge<MergeTargetObject>(
        ...nestedObjects: Array<MergeTargetObject>
    ): MergeTargetObject {
        return nestedObjects.reduce<NestedObject>(
            (mergedObject, currentObject) => {
                for (const [key, value] of Object.entries(
                    currentObject as NestedObject
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
                                existing as NestedObject,
                                value as NestedObject
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
     * @param styleObject
     */
    public static getClassName<StyleObject>(styleObject: StyleObject): string {
        return Styler.flattenObject(styleObject as NestedObject).join(" ")
    }
}
