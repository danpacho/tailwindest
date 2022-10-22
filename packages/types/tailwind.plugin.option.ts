import type { PluginOption } from "./plugin"
import type { TailwindColorPluginOptionKey } from "./tailwind.common/@color"
import type {
    TailwindNestPluginKey,
    TailwindStylePluginKey,
} from "./tailwind.plugin.key"

export type TailwindStylePlugOption = PluginOption<TailwindStylePluginKey>
export type TailwindDefaultStylePlug = PluginOption<TailwindStylePluginKey, "">

export type TailwindestNestPlugOption = PluginOption<TailwindNestPluginKey>
export type TailwindestDefaultNestPlug = PluginOption<TailwindNestPluginKey, "">

type TailwindGlobalPlugOptionKey = TailwindColorPluginOptionKey | "sizing"
export type TailwindGlobalPlugOption =
    PluginOption<TailwindGlobalPlugOptionKey> & {
        screens?: TailwindestNestPlugOption
    }

export type TailwindDefaultGlobalPlugOption = PluginOption<
    TailwindGlobalPlugOptionKey,
    ""
> & {
    screens?: TailwindestDefaultNestPlug
}
