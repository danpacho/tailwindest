import { tw } from "../tw"

const bg = tw.style({
    backgroundImage: ["bg-linear-to-tl", "from-[#D0E33E]", "to-[#FF3C3C]"],
    "@dark": {
        backgroundImage: ["dark:from-[#F1FF8A]", "dark:to-[#FF3F3F]"],
    },
})

const goldGradient = tw.style({
    backgroundImage: [
        "bg-linear-to-tl",
        "from-amber-400",
        "via-amber-200",
        "to-amber-500",
    ],
})

const amberColor = tw.style({
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
