import { Styler } from "./styler"

export class PrimitiveStyler<StyleType> extends Styler<never, StyleType> {
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
    public class(extraClassName?: string): string {
        const inquired = this._class
        if (!extraClassName) return inquired
        return this.merger(inquired, extraClassName)
    }

    /**
     * Get stylesheet
     * @param extraStyle extra stylesheet
     */
    public style(extraStyle?: StyleType): StyleType {
        const inquired = this._style
        if (!extraStyle) return inquired
        return Styler.deepMerge(inquired, extraStyle)
    }

    public compose(...styles: Array<StyleType>): PrimitiveStyler<StyleType> {
        return new PrimitiveStyler<StyleType>(
            Styler.deepMerge(this._style, ...styles)!
        )
    }
}
