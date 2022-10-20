import { PlugBase } from "../plugin"
import { TailwindBorderColorType } from "./@border.color"
import { TailwindBorderWidthType } from "./@border.width"

type TailwindBorder<
    TailwindColor extends string,
    BorderWidthPlug extends PlugBase
> = `${Exclude<
    TailwindBorderWidthType<BorderWidthPlug>["borderWidth"],
    "border-0"
>} border-solid ${TailwindBorderColorType<TailwindColor>["borderColor"]}`

export type TailwindBorderType<
    TailwindColor extends string,
    BorderWidthPlug extends PlugBase
> = {
    /**
     *@note `CSS` [shorthand syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#border_properties)
     *@note `<color>` `border-solid` `<width>`
     *@docs [border](https://tailwindcss.com/docs/border-width)
     */
    border:
        | "border border-solid"
        | Exclude<
              TailwindBorder<TailwindColor, BorderWidthPlug>,
              "border border border-solid"
          >
}
