import { wind } from "tailwindest"

const bg = wind({
    backgroundImage: "bg-gradient-to-b",
    backgroundImageGradientStart: "from-[#D0E33E]",
    backgroundImageGradientEnd: "to-[#FF3C3C]",
    "@dark": {
        backgroundImageGradientStart: "dark:from-[#e9ff4d]",
        backgroundImageGradientEnd: "dark:to-[#ff0707]",
    },
})

const tw = {
    bgClass: bg.class(),
    bgStyle: bg.style(),
} as const

export { tw }
