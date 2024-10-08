import { createRotary } from "./create.rotary"
import type { TailwindestStyler } from "./tool.interface"

type Toggle<StyleType> = {
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

const createToggle = <StyleType>() => {
    const rotary = createRotary<StyleType>()

    return (
        toggleVariants: Toggle<StyleType>
    ): TailwindestStyler<StyleType, boolean> => {
        const toggleCache: TailwindestStyler<StyleType, "truthy" | "falsy"> =
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
