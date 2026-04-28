import { createTools } from "tailwindest"

const tw = createTools()
export const primitiveClass = tw
    .style({
        display: "flex",
        padding: "px-4",
        color: "text-emerald-600",
    })
    .class("rounded-md")

export const toggleClass = tw
    .toggle({
        base: { display: "inline-flex" },
        truthy: { color: "text-green-600" },
        falsy: { color: "text-red-600" },
    })
    .class(true)

export const rotaryClass = tw
    .rotary({
        base: { gap: "gap-2" },
        variants: {
            sm: { padding: "p-2" },
            lg: { padding: "p-4" },
        },
    })
    .class("lg")

export const variantsClass = tw
    .variants({
        base: { border: "border" },
        variants: {
            intent: {
                primary: { color: "text-blue-700" },
                danger: { color: "text-red-700" },
            },
        },
    })
    .class({ intent: "primary" })
;(
    globalThis as typeof globalThis & { __tailwindestCompiledClass: string }
).__tailwindestCompiledClass = [
    primitiveClass,
    toggleClass,
    rotaryClass,
    variantsClass,
].reduce((acc, item) => (acc ? `${acc} ${item}` : item), "")
