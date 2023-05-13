// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { NestedObject } from "../../utils"
import { createRotary } from "./create.rotary"
import type {
    StyleGeneratorRotary,
    StyleGeneratorToggle,
} from "./tool.interface"

type Toggle<StyleType extends NestedObject> = {
    /**
     * `true` condition `styleSheet`
     */
    truthy: StyleType
    /**
     * `false` condition `styleSheet`
     */
    falsy: StyleType
    /**
     * base `styleSheet`, `[optional]`
     */
    base?: StyleType
}

const TOGGLE_TRUTHY_KEY = "truthy" as const
const TOGGLE_FALSY_KEY = "falsy" as const

const createToggle = <StyleType extends NestedObject>() => {
    const rotary = createRotary<StyleType>()
    return (
        toggleVariants: Toggle<StyleType>
    ): StyleGeneratorToggle<StyleType> => {
        const toggleCache: StyleGeneratorRotary<StyleType, "truthy" | "falsy"> =
            rotary(toggleVariants)

        return {
            style: (toggleCondition) =>
                toggleCache.style(
                    toggleCondition ? TOGGLE_TRUTHY_KEY : TOGGLE_FALSY_KEY
                ),
            class: (toggleCondition) =>
                toggleCache.class(
                    toggleCondition ? TOGGLE_TRUTHY_KEY : TOGGLE_FALSY_KEY
                ),
            compose: function (...styles) {
                toggleCache.compose(...styles)
                return this
            },
        }
    }
}

export { createToggle }
