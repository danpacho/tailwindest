import { Styler } from "./styler"
import { RotaryStyler } from "./rotary"

export type VariantsRecord<StyleType> = Record<
    string,
    Record<string, StyleType>
>
export type VariantsProps<StyleType, VMap extends VariantsRecord<StyleType>> = {
    base?: StyleType
    variants: VMap
}
export type VariantOptions<VMap extends VariantsRecord<any>> = {
    [K in keyof VMap]?: keyof VMap[K]
}
type VariantStylerMap<
    StyleType,
    VMapKey extends string | number | symbol,
> = Record<VMapKey, RotaryStyler<StyleType, string>>

export class VariantsStyler<
    StyleType,
    const VMap extends VariantsRecord<StyleType>,
> extends Styler<VariantOptions<VMap>, StyleType> {
    private _base: StyleType
    private _variantsMap: VMap
    private _variantStylerMap: VariantStylerMap<StyleType, keyof VMap>

    constructor(params: VariantsProps<StyleType, VMap>) {
        super()
        this._base = params.base ?? ({} as StyleType)
        this._variantsMap = params.variants
        this._variantStylerMap = Object.keys(this._variantsMap).reduce<
            VariantStylerMap<StyleType, keyof VMap>
        >(
            (acc, variantKey) => {
                const recordForKey = this._variantsMap[variantKey]!
                const rotary = new RotaryStyler<StyleType, string>({
                    variants: recordForKey,
                })
                acc[variantKey as keyof VMap] = rotary
                return acc
            },
            {} as VariantStylerMap<StyleType, keyof VMap>
        )
    }

    /**
     * Get stylesheet
     * @param variant variant record
     * @param extraStyle extra stylesheet
     */
    public style(
        variant: VariantOptions<VMap>,
        extraStyle?: StyleType
    ): StyleType {
        let merged = this._base

        for (const [variantKey, subVariant] of Object.entries(variant)) {
            if (subVariant) {
                const subStyler = this._variantStylerMap[variantKey]!
                const subStyle = subStyler.style(subVariant)
                merged = Styler.deepMerge(merged, subStyle)
            }
        }

        if (!extraStyle) return merged
        return Styler.deepMerge(merged, extraStyle)
    }

    /**
     * Get classname
     * @param variant variant record
     * @param extraClassName extra classnames, if merger is provided it uses merger or just concat.
     */
    public class(
        variant: VariantOptions<VMap>,
        extraClassName?: string
    ): string {
        const inquired = this.style(variant)

        if (!extraClassName) return Styler.getClassName(inquired)
        return this.merger(...Styler.flattenRecord(inquired), extraClassName)
    }

    public compose(
        ...styles: Array<StyleType>
    ): VariantsStyler<StyleType, VMap> {
        const mergedBase = Styler.deepMerge(this._base, ...styles)
        return new VariantsStyler<StyleType, VMap>({
            base: mergedBase,
            variants: this._variantsMap,
        })
    }
}
