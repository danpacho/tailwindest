import { createTools, type Tailwindest } from "tailwindest"

/**
 * Custom type definition of tailwindest
 * @see {@link https://tailwindest.vercel.app/apis/Tailwindest api reference}
 */
type TailwindCustom = Tailwindest<{}, {}>
/**
 * Full type definition of `tailwindcss`
 */
type Tailwind = Required<TailwindCustom>

const tw = createTools<TailwindCustom>()

export { tw, type Tailwind }
