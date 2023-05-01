import { Tailwindest, createTools } from "tailwindest"

type TailwindCustom = Tailwindest<
    {},
    {
        animation: "appear"
    }
>

const tw = createTools<TailwindCustom>()

type Tailwind = Required<TailwindCustom>

export { tw, type Tailwind }
