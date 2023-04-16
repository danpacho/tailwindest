import type { PluginOption } from "./plugin"
import type { TailwindColorPluginOptionKey } from "./tailwind.common/@color"
import type {
    TailwindNestPluginKey,
    TailwindStylePluginKey,
} from "./tailwind.plugin.key"

export interface TailwindStylePlugOption
    extends PluginOption<TailwindStylePluginKey> {
    aria?: TailwindestNestPlugOption
}

type DEFAULT_VALUE = ""
export type TailwindDefaultStylePlug = PluginOption<
    TailwindStylePluginKey,
    DEFAULT_VALUE
> & {
    aria?: TailwindestDefaultNestPlug
}

export type TailwindestNestPlugOption = PluginOption<TailwindNestPluginKey>
export type TailwindestDefaultNestPlug = PluginOption<TailwindNestPluginKey, "">

type TailwindGlobalPlugOptionKey = TailwindColorPluginOptionKey | "sizing"
export type TailwindGlobalPlugOption =
    PluginOption<TailwindGlobalPlugOptionKey> & {
        screens?: TailwindestNestPlugOption
    }

export type TailwindDefaultGlobalPlugOption = PluginOption<
    TailwindGlobalPlugOptionKey,
    DEFAULT_VALUE
> & {
    screens?: TailwindestDefaultNestPlug
}
