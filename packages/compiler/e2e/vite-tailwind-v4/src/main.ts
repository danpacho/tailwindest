import { createTools } from "tailwindest"

const tw = createTools()
const palette = {
    primary: "text-emerald-600",
}

const staticClass = tw.join("px-4", "py-2")
const lookupClass = tw.join(palette.primary)
const arbitraryClass = tw.join("bg-[rgb(10_20_30)]")
const stackedVariant = tw.join("dark:md:hover:bg-sky-600")

document.querySelector<HTMLDivElement>("#app")!.className = [
    staticClass,
    lookupClass,
    arbitraryClass,
    stackedVariant,
].join(" ")
