import { BASE_KEY } from "../../constants"
import type { CacheKey, ClassName, NestedObject } from "../../utils"
import { cache } from "../cache"
import { deepMerge } from "../deep.merge"
import { getTailwindClass } from "../get.tailwind.class"
import type { StyleGeneratorStyle } from "./tool.interface"

const createStyle =
    <StyleType extends NestedObject>() =>
    (style: StyleType): StyleGeneratorStyle<StyleType> => {
        const styleCache = cache<CacheKey, StyleType>()
        const classCache = cache<CacheKey, ClassName>()
        const getCachedStyle = () => styleCache.get(BASE_KEY, () => style)
        return {
            style: getCachedStyle,
            class: () =>
                classCache.get(BASE_KEY, () =>
                    getTailwindClass(getCachedStyle())
                ),
            compose: function (...styles) {
                const composedStyle = deepMerge(getCachedStyle(), ...styles)
                styleCache.set(BASE_KEY, composedStyle)
                classCache.set(BASE_KEY, getTailwindClass(composedStyle))
                return this
            },
        }
    }

export { createStyle }
