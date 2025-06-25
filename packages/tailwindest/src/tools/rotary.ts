import type { AdditionalClassTokens } from "./merger_interface"
import { Styler } from "./styler"

export class RotaryStyler<
    StyleType,
    const VariantKey extends string,
    StyleLiteral extends string = string,
> extends Styler<VariantKey, StyleType, StyleLiteral> {
    private _variants: Record<VariantKey | "base", StyleType>
    private _originalVariants: Record<VariantKey, StyleType>
    private _variantsMap: Record<VariantKey | "base", string>

    private _createVariants(
        variants: Record<VariantKey, StyleType>,
        base: StyleType = {} as StyleType
    ): Record<VariantKey | "base", StyleType> {
        return Object.entries(variants).reduce<
            Record<VariantKey | "base", StyleType>
        >(
            (variants, [key, value]) => {
                if (key === "base") {
                    return variants
                }
                variants[key as VariantKey] = Styler.deepMerge<StyleType>(
                    base,
                    value as StyleType
                )
                return variants
            },
            { base: base } as Record<VariantKey | "base", StyleType>
        )
    }
    private _createVariantsMap(
        variants: Record<VariantKey | "base", StyleType>,
        base: StyleType = {} as StyleType
    ): Record<VariantKey | "base", string> {
        return {
            ...Object.entries(variants).reduce<
                Record<VariantKey | "base", string>
            >(
                (variantsMap, [key, value]) => {
                    variantsMap[key as VariantKey] = Styler.getClassName(value)
                    return variantsMap
                },
                {} as Record<VariantKey | "base", string>
            ),
            base: Styler.getClassName(base),
        }
    }
    public constructor({
        variants,
        base = {} as StyleType,
    }: {
        base?: StyleType | undefined
        variants: Record<VariantKey, StyleType>
    }) {
        super()
        this._originalVariants = variants
        this._variants = this._createVariants(variants, base)
        this._variantsMap = this._createVariantsMap(this._variants, base)
    }

    /**
     * Get stylesheet
     * @param variant variant name
     * @param extraStyles extra stylesheet
     */
    public style(
        variant?: VariantKey | "base",
        ...extraStyles: Array<StyleType>
    ): StyleType {
        const inquired = this._variants[variant as VariantKey]

        if (!extraStyles) return inquired
        return Styler.deepMerge(inquired, ...extraStyles)
    }

    /**
     * Get classname
     * @param variant variant name
     * @param extraClassNames extra classnames, if merger is provided it uses merger or just concat.
     */
    public class(
        variant: VariantKey | "base",
        ...extraClassNames: AdditionalClassTokens<StyleLiteral>
    ): string {
        const inquired = this._variantsMap[variant]

        if (!extraClassNames) return inquired
        return this.merge(inquired as StyleLiteral, ...extraClassNames)
    }

    public compose(
        ...styles: Array<StyleType>
    ): RotaryStyler<StyleType, VariantKey> {
        const baseStyle = this.style("base")
        const composedStyle = Styler.deepMerge(baseStyle, ...styles)
        return new RotaryStyler({
            base: composedStyle,
            variants: this._originalVariants,
        })
    }
}
