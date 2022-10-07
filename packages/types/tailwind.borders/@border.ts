import { TailwindBorderColorType } from "./@border.color"
import { TailwindBorderWidthType } from "./@border.width"

type TailwindBorder = `${Exclude<
    TailwindBorderWidthType["borderWidth"],
    "border-0"
>} border-solid ${TailwindBorderColorType["borderColor"]}`
export type TailwindBorderType = {
    /**
     *@note `CSS` [shorthand syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#border_properties)
     *@note `<color>` `border-solid` `<width>`
     *@docs [border](https://tailwindcss.com/docs/border-width)
     */
    border:
        | "border border-solid"
        | Exclude<TailwindBorder, "border border border-solid">
}
