import { Tailwindest } from "./types/tailwindest"
import { cache } from "./utils"

type ClassCache = {
    key: string
    value: string
}
type StyleCache = {
    key: string
    value: Tailwindest
}
function windestCache(): {
    getClass: (key: string) => string | undefined
    setClass: (key: string, value: string) => void
    hasClass: (key: string) => boolean
    getStyle: (key: string) => Tailwindest | undefined
    setStyle: (key: string, value: Tailwindest) => void
    hasStyle: (key: string) => boolean
} {
    const {
        get: getClass,
        set: setClass,
        has: hasClass,
    } = cache<ClassCache["key"], ClassCache["value"]>()
    const {
        get: getStyle,
        set: setStyle,
        has: hasStyle,
    } = cache<StyleCache["key"], StyleCache["value"]>()

    return {
        getClass,
        setClass,
        hasClass,
        getStyle,
        setStyle,
        hasStyle,
    }
}

export { windestCache }
