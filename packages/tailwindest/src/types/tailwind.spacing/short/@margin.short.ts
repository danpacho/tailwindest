import { PluginVariantsWithDirection } from "../../plugin"

type TailwindMarginVariants<
    Direction extends string,
    TailwindSpacing extends string,
> = PluginVariantsWithDirection<Direction, TailwindSpacing | "auto">

export type ShortTailwindMarginType<Margin extends string> = {
    /**
     *@description Utilities for controlling an element's margin all.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/margin margin}
     */
    m: TailwindMarginVariants<"m", Margin>
    /**
     *@description Utilities for controlling an element's margin x.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/margin margin-x}
     */
    mx: TailwindMarginVariants<"mx", Margin>
    /**
     *@description Utilities for controlling an element's margin y.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/margin margin-y}
     */
    my: TailwindMarginVariants<"my", Margin>
    /**
     *@description Utilities for controlling an element's margin top.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/margin margin-top}
     */
    mt: TailwindMarginVariants<"mt", Margin>
    /**
     *@description Utilities for controlling an element's margin bottom.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/margin margin-bottom}
     */
    mb: TailwindMarginVariants<"mb", Margin>
    /**
     *@description Utilities for controlling an element's margin right.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/margin margin-right}
     */
    mr: TailwindMarginVariants<"mr", Margin>
    /**
     *@description Utilities for controlling an element's margin left.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/margin margin-left}
     */
    ml: TailwindMarginVariants<"ml", Margin>
}
