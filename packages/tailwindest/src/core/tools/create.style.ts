import type { ClassName } from "../../utils"
import { deepMerge } from "../deep.merge"
import { getTailwindClass } from "../get.tailwind.class"
import type { TailwindestStyler } from "./tool.interface"

class StyleSheet<StyleType>
    implements TailwindestStyler<StyleType, never, true>
{
    private s: StyleType
    private c: ClassName

    constructor(style: StyleType) {
        this.s = style
        this.c = getTailwindClass(style)
    }

    get class() {
        return this.c
    }

    get style() {
        return this.s
    }

    compose(...styles: StyleType[]) {
        this.s = deepMerge(this.s, ...styles)
        this.c = getTailwindClass(this.s)
        return this
    }
}

const createStyle =
    <StyleType>() =>
    (style: StyleType): TailwindestStyler<StyleType, never, true> =>
        new StyleSheet<StyleType>(style)

export { createStyle }
