import type { AdditionalClassTokens } from "./merger_interface"
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

export class ToggleStyler<
    StyleType,
    StyleLiteral extends string = string,
> extends Styler<boolean, StyleType, StyleLiteral> {
    private _rotary: RotaryStyler<StyleType, "T" | "F", StyleLiteral>
    private _T: StyleType
    private _F: StyleType

    public constructor(toggle: ToggleVariants<StyleType>) {
        super()
        this._T = toggle.truthy
        this._F = toggle.falsy
        this._rotary = new RotaryStyler<StyleType, "T" | "F", StyleLiteral>({
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
     * @param extraClassNames extra classnames, if merger is provided it uses merger or just concat.
     */
    public class(
        condition: boolean,
        ...extraClassNames: AdditionalClassTokens<StyleLiteral>
    ): string {
        const inquired = this._rotary.class(condition ? "T" : "F")
        if (extraClassNames.length === 0) return inquired
        return this.merge(inquired as StyleLiteral, ...extraClassNames)
    }

    /**
     * Get stylesheet
     * @param condition toggle condition
     * @param extraStyle extra stylesheet
     */
    public style(condition: boolean, extraStyle?: StyleType): StyleType {
        const inquired = this._rotary.style(condition ? "T" : "F")
        if (!extraStyle) inquired
        return Styler.deepMerge(inquired, extraStyle)!
    }

    public compose(...styles: Array<StyleType>): ToggleStyler<StyleType> {
        const mergedBase = Styler.deepMerge(
            this._rotary.style("base"),
            ...styles
        )
        return new ToggleStyler({
            base: mergedBase,
            truthy: this._T,
            falsy: this._F,
        })
    }
}
