import { Styler } from "./styler"

export class RotaryStyler<
    StyleType,
    const VariantKey extends string,
> extends Styler<VariantKey, StyleType> {
    private _variants: Record<VariantKey | "base", StyleType>
    private _variantsMap: Record<VariantKey | "base", string>

    public constructor({
        variants,
        base = {} as StyleType,
    }: {
        base?: StyleType | undefined
        variants: Record<VariantKey, StyleType>
    }) {
        super()
        this._variants = { ...variants, base: base }
        this._variantsMap = {
            ...Object.entries(variants).reduce<Record<VariantKey, string>>(
                (variantsMap, [key, value]) => {
                    variantsMap[key as VariantKey] = Styler.getClassName(value)
                    return variantsMap
                },
                {} as Record<VariantKey, string>
            ),
            base: Styler.getClassName(base),
        }
    }

    /**
     * Get classname
     * @param variant variant name
     * @param extraClassName extra classnames, if merger is provided it uses merger or just concat.
     */
    public class(
        variant: VariantKey | "base",
        extraClassName?: string
    ): string {
        const inquired = this._variantsMap[variant]

        if (!extraClassName) return inquired
        return this.merger(inquired, extraClassName)
    }

    /**
     * Get stylesheet
     * @param variant variant name
     * @param extraStyle extra stylesheet
     */
    public style(
        variant?: VariantKey | "base",
        extraStyle?: StyleType
    ): StyleType {
        const inquired = this._variants[variant as VariantKey | "base"]

        if (!extraStyle) return inquired
        return Styler.deepMerge(inquired, extraStyle)
    }

    public compose(
        ...styles: Array<StyleType>
    ): RotaryStyler<StyleType, VariantKey> {
        const baseStyle = this.style("base")
        const composedStyle = Styler.deepMerge(baseStyle, ...styles)

        return new RotaryStyler({
            base: composedStyle,
            variants: this._variants,
        })
    }
}
