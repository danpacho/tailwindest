import type { AdditionalClassTokens } from "./merger_interface"
import { Styler } from "./styler"

export class PrimitiveStyler<
    StyleType,
    StyleLiteral extends string = string,
> extends Styler<never, StyleType, StyleLiteral> {
    private _class: string
    private _style: StyleType

    public constructor(style: StyleType) {
        super()
        this._class = Styler.getClassName(style)
        this._style = style
    }

    /**
     * Get classname
     * @param extraClassName extra classnames, if merger is provided it uses merger or just concat.
     */
    public class(
        ...extraClassList: AdditionalClassTokens<StyleLiteral>
    ): string {
        const inquired = this._class
        if (extraClassList.length === 0) return inquired
        return this.merge(inquired as StyleLiteral, ...extraClassList)
    }

    /**
     * Get stylesheet
     * @param extraStyle extra stylesheet
     */
    public style(...extraStyles: Array<StyleType>): StyleType {
        const inquired = this._style
        if (!extraStyles) return inquired
        return Styler.deepMerge(inquired, ...extraStyles)
    }

    public compose(...styles: Array<StyleType>): PrimitiveStyler<StyleType> {
        return new PrimitiveStyler<StyleType>(
            Styler.deepMerge(this._style, ...styles)!
        )
    }
}
