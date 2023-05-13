import { tw as s } from "wind"

const bg = s.style({
    gradient: "bg-gradient-to-b",
    gradientStart: "from-[#D0E33E]",
    gradientEnd: "to-[#FF3C3C]",
    "@dark": {
        gradientStart: "dark:from-[#F1FF8A]",
        gradientEnd: "dark:to-[#FF3F3F]",
    },
})

const goldGradient = s.style({
    gradient: "bg-gradient-to-tl",
    gradientStart: "from-amber-400",
    gradientMiddle: "via-amber-200",
    gradientEnd: "to-amber-500",
})

const amberColor = s.style({
    color: "text-amber-100/80",
    borderWidth: "border",
    backgroundColor: "bg-transparent",
    borderColor: "border-amber-100/25",
})

const util = {
    bg,
    goldGradient,
    amberColor,
} as const

export { util }
