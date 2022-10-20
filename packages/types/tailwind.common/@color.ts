import { PluginOption } from "../plugin"
import { TailwindGlobalPluginKey } from "../tailwind.plugin.key"
import { TailwindColorAccent, TailwindColorWithOpacity } from "./@accent"
import {
    TailwindColorVariants,
    TailwindColorWithNoVariants,
} from "./@color.variants"

export type TailwindColorPluginOptionKey = Exclude<
    TailwindGlobalPluginKey,
    "sizing"
>
type TailwindColorPlugOption = PluginOption<TailwindColorPluginOptionKey>

export type TailwindColor<
    PlugOption extends TailwindColorPlugOption = PluginOption<
        TailwindColorPluginOptionKey,
        ""
    >
> =
    | TailwindColorWithNoVariants<PlugOption["color"]>
    | TailwindColorWithOpacity<PlugOption["opacity"]>
    | `${TailwindColorVariants}-${TailwindColorAccent}`
