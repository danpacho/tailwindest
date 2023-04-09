import { Tailwindest, createWind } from "tailwindest"

const { wind, mergeProps, toggle, wind$ } = createWind<Tailwindest>()

type Tailwind = Required<Tailwindest>

export { wind, wind$, mergeProps, toggle, type Tailwind }
