import { RotaryStyler } from "./rotary"
import { Styler } from "./styler"

export type ToggleVariants<StyleType> = {
    /**
     * Base style
     */
    base?: StyleType
    /**
     * Truthy style
     */
    truthy: StyleType
    /**
     * Falsy style
     */
    falsy: StyleType
}

export class ToggleStyler<StyleType> extends Styler<boolean, StyleType> {
    private _rotary: RotaryStyler<StyleType, "T" | "F">
    public constructor(toggle: ToggleVariants<StyleType>) {
        super()
        this._rotary = new RotaryStyler<StyleType, "T" | "F">({
            base: toggle.base,
            variants: {
                T: toggle.truthy,
                F: toggle.falsy,
            },
        })
    }

    /**
     * Get classname
     * @param condition toggle condition
     * @param extraClassName extra classnames, if merger is provided it uses merger or just concat.
     */
    public class(condition: boolean, extraClass?: string): string {
        const inquired = this._rotary.class(condition ? "T" : "F")
        if (!extraClass) return inquired
        return this.merger(inquired, extraClass)
    }

    /**
     * Get stylesheet
     * @param condition toggle condition
     * @param extraStyle extra stylesheet
     */
    public style(condition: boolean, extraStyle?: StyleType) {
        const inquired = this._rotary.style(condition ? "T" : "F")
        if (!extraStyle) inquired
        return Styler.deepMerge(inquired, extraStyle)
    }

    public compose(...styles: Array<StyleType>): ToggleStyler<StyleType> {
        const mergedBase = Styler.deepMerge(
            this._rotary.style("base"),
            ...styles
        )
        return new ToggleStyler({
            base: mergedBase,
            truthy: this._rotary.style("T"),
            falsy: this._rotary.style("F"),
        })
    }
}
