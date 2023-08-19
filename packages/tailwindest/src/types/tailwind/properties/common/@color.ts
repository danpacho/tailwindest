import { PluginOption } from "../../../plugin"
import { TailwindGlobalPluginKey } from "../../plugin"
import { TailwindColorAccent, TailwindColorWithOpacity } from "./@accent"
import {
    TailwindColorWithNoVariants,
    TailwindColorWithVariants,
} from "./@color.variants"

export type TailwindColorPluginOptionKey = Exclude<
    TailwindGlobalPluginKey,
    "sizing"
>
type TailwindColorPlugOption = PluginOption<TailwindColorPluginOptionKey>

type TailwindDefaultColor =
    `${TailwindColorWithVariants}-${TailwindColorAccent}`

export type TailwindColor<
    PlugOption extends TailwindColorPlugOption = PluginOption<
        TailwindColorPluginOptionKey,
        ""
    >,
> =
    | TailwindDefaultColor
    | TailwindColorWithNoVariants<PlugOption["color"]>
    | TailwindColorWithOpacity<PlugOption["opacity"]>
