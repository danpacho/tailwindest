import { createTools } from "tailwindest"

const tw = createTools()
const enabled = location.hash.includes("enabled")
const rotarySize = location.hash.includes("lg") ? "lg" : "sm"
const intent = location.hash.includes("danger") ? "danger" : "primary"
const variantSize = location.hash.includes("large") ? "lg" : "sm"
const tone = location.hash.includes("loud") ? "loud" : "quiet"

const staticStyle = tw
    .style({
        display: "flex",
        padding: "px-4",
        color: "text-emerald-600",
    })
    .class("rounded-md")

const joinClass = tw.join("py-2", "text-sm")
const defClass = tw.def(["font-semibold"], {
    background: "bg-white",
})
const toggleClass = tw
    .toggle({
        base: { display: "inline-flex" },
        truthy: { color: "text-green-600" },
        falsy: { color: "text-red-600" },
    })
    .class(enabled, "items-center")
const rotaryClass = tw
    .rotary({
        base: { gap: "gap-2" },
        variants: {
            sm: { padding: "p-2" },
            lg: { padding: "p-4" },
        },
    })
    .class(rotarySize)
const independentVariantClass = tw
    .variants({
        base: { border: "border" },
        variants: {
            intent: {
                primary: { color: "text-blue-700" },
                danger: { color: "text-red-700" },
            },
            size: {
                sm: { padding: "px-2" },
                lg: { padding: "px-6" },
            },
        },
    })
    .class({ intent, size: variantSize })
const conflictingVariantClass = tw
    .variants({
        base: { background: "bg-slate-50", color: "text-slate-950" },
        variants: {
            intent: {
                primary: { background: "bg-blue-50", color: "text-blue-900" },
                danger: { background: "bg-red-50", color: "text-red-900" },
            },
            tone: {
                quiet: { background: "bg-white", color: "text-gray-700" },
                loud: { background: "bg-black", color: "text-white" },
            },
        },
    })
    .class({ intent, tone })
const arbitraryClass = tw
    .style({
        background: "bg-[rgb(10_20_30)]",
        backgroundState: "dark:md:hover:bg-sky-600",
    })
    .class()
const nestedVariantClass = tw
    .style({
        dark: {
            backgroundColor: "bg-red-\u0039\u0030\u0030",
            hover: {
                backgroundColor: "bg-red-\u0039\u0035\u0030",
            },
        },
        backgroundColor: "bg-red-50",
    })
    .class()

function looseFallback(value: string) {
    return tw
        .style({
            textDecoration: "underline",
        })
        .class(value)
}

const renderedClasses = [
    staticStyle,
    joinClass,
    defClass,
    toggleClass,
    rotaryClass,
    independentVariantClass,
    conflictingVariantClass,
    arbitraryClass,
    nestedVariantClass,
    looseFallback("underline"),
].reduce((acc, item) => (acc ? `${acc} ${item}` : item), "")

export function mountTailwindestFixture() {
    document.querySelector<HTMLDivElement>("#app")!.className = renderedClasses
}
