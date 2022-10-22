import { PluginVariantsWithDirection } from "../plugin"

type TailwindSpaceVariants<
    Direction extends string,
    TailwindSpacing extends string
> = PluginVariantsWithDirection<Direction, TailwindSpacing | "reverse ">

export type TailwindSpaceType<Space extends string> = {
    /**
     *@note Utilities for controlling the space(**margin**) between child elements `> * + *`.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [space](https://tailwindcss.com/docs/space)
     */
    spaceX: TailwindSpaceVariants<"space-x", Space>
    /**
     *@note Utilities for controlling the space(**margin**) between child elements `> * + *`.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [space](https://tailwindcss.com/docs/space)
     */
    spaceY: TailwindSpaceVariants<"space-y", Space>
}
