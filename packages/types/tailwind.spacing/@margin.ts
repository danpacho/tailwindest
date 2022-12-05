import { PluginVariantsWithDirection } from "../plugin"

type TailwindMarginVariants<
    Direction extends string,
    TailwindSpacing extends string
> = PluginVariantsWithDirection<Direction, TailwindSpacing | "auto">

export type TailwindMarginType<Margin extends string> = {
    /**
     *@description Utilities for controlling an element's margin all.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/margin margin}
     */
    margin: TailwindMarginVariants<"m", Margin>
    /**
     *@description Utilities for controlling an element's margin x.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/margin margin-x}
     */
    marginX: TailwindMarginVariants<"mx", Margin>
    /**
     *@description Utilities for controlling an element's margin y.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/margin margin-y}
     */
    marginY: TailwindMarginVariants<"my", Margin>
    /**
     *@description Utilities for controlling an element's margin top.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/margin margin-top}
     */
    marginTop: TailwindMarginVariants<"mt", Margin>
    /**
     *@description Utilities for controlling an element's margin bottom.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/margin margin-bottom}
     */
    marginBottom: TailwindMarginVariants<"mb", Margin>
    /**
     *@description Utilities for controlling an element's margin right.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/margin margin-right}
     */
    marginRight: TailwindMarginVariants<"mr", Margin>
    /**
     *@description Utilities for controlling an element's margin left.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/margin margin-left}
     */
    marginLeft: TailwindMarginVariants<"ml", Margin>
}
