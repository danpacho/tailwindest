import { PluginVariantsWithDirection } from "../plugin"

type TailwindSpaceVariants<
    Direction extends string,
    TailwindSpacing extends string
> = PluginVariantsWithDirection<Direction, TailwindSpacing | "reverse ">

export type TailwindSpaceType<Space extends string> = {
    /**
     *@description Utilities for controlling the space(**margin**) between child elements `> * + *`.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/space space-x}
     */
    spaceX: TailwindSpaceVariants<"space-x", Space>
    /**
     *@description Utilities for controlling the space(**margin**) between child elements `> * + *`.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/space space-y}
     */
    spaceY: TailwindSpaceVariants<"space-y", Space>
}
