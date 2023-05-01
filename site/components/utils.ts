import { tw } from "wind"

const bg = tw.style({
    gradient: "bg-gradient-to-b",
    gradientStart: "from-[#D0E33E]",
    gradientEnd: "to-[#FF3C3C]",
    "@dark": {
        gradientStart: "dark:from-[#e9ff4d]",
        gradientEnd: "dark:to-[#ff0707]",
    },
})

const util = {
    bg,
} as const

export { util as tw }
