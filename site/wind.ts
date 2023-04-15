import { Tailwindest, createWind } from "tailwindest"

type TailwindCustom = Tailwindest<
    {},
    {
        animation: "appear"
    }
>

const { wind, mergeProps, toggle, wind$ } = createWind<TailwindCustom>()

type Tailwind = Required<TailwindCustom>

export { wind, wind$, mergeProps, toggle, type Tailwind }
