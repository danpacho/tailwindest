import { PluginOption } from "./plugin"
import { TailwindColorPluginOptionKey } from "./tailwind.common/@color"
import { TailwindStylePluginKey } from "./tailwind.plugin.key"

type TailwindGlobalPlugOptionKey = TailwindColorPluginOptionKey | "sizing"
export type TailwindGlobalPlugOption = PluginOption<TailwindGlobalPlugOptionKey>

export type TailwindDefaultGlobalPlugOption = PluginOption<
    TailwindGlobalPlugOptionKey,
    ""
>

export type TailwindStylePlugOption = PluginOption<TailwindStylePluginKey>
export type TailwindDefaultStylePlug = PluginOption<TailwindStylePluginKey, "">
