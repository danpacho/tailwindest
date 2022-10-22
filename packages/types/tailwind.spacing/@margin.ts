import { PluginVariantsWithDirection } from "../plugin"

type TailwindMarginVariants<
    Direction extends string,
    TailwindSpacing extends string
> = PluginVariantsWithDirection<Direction, TailwindSpacing | "auto">

export type TailwindMarginType<Margin extends string> = {
    /**
     *@note Utilities for controlling an element's margin all.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    margin: TailwindMarginVariants<"m", Margin>
    /**
     *@note Utilities for controlling an element's margin x.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginX: TailwindMarginVariants<"mx", Margin>
    /**
     *@note Utilities for controlling an element's margin y.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginY: TailwindMarginVariants<"my", Margin>
    /**
     *@note Utilities for controlling an element's margin top.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginTop: TailwindMarginVariants<"mt", Margin>
    /**
     *@note Utilities for controlling an element's margin bottom.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginBottom: TailwindMarginVariants<"mb", Margin>
    /**
     *@note Utilities for controlling an element's margin right.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginRight: TailwindMarginVariants<"mr", Margin>
    /**
     *@note Utilities for controlling an element's margin left.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginLeft: TailwindMarginVariants<"ml", Margin>
}
