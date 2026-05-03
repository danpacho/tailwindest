import {
    composePrimitive,
    createPrimitiveModel,
    primitiveClass,
    primitiveStyle,
    type PrimitiveStyleModel,
} from "tailwindest-core"
import type { AdditionalClassTokens } from "./merger_interface"
import { Styler } from "./styler"

export class PrimitiveStyler<
    StyleType,
    StyleLiteral extends string = string,
> extends Styler<never, StyleType, StyleLiteral> {
    private _model: PrimitiveStyleModel<StyleType>
    private _class: string

    public constructor(style: StyleType) {
        super()
        this._model = createPrimitiveModel(style)
        this._class = primitiveClass(this._model)
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
        return primitiveStyle(this._model, extraStyles)
    }

    public compose(...styles: Array<StyleType>): PrimitiveStyler<StyleType> {
        return new PrimitiveStyler<StyleType>(
            composePrimitive(this._model, styles).style
        )
    }
}
