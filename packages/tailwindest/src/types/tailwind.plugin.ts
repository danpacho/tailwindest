import type { Tailwind } from "./tailwind"
import type {
    TailwindDefaultGlobalPlugOption,
    TailwindDefaultStylePlug,
    TailwindGlobalPlugOption,
    TailwindStylePlugOption,
} from "./tailwind.plugin.option"
import type { ShortTailwind } from "./tailwind.short"

export type TailwindWithOption<
    GlobalPluginOption extends
        TailwindGlobalPlugOption = TailwindDefaultGlobalPlugOption,
    PlugStyleOption extends TailwindStylePlugOption = TailwindDefaultStylePlug,
> = PlugStyleOption extends TailwindDefaultStylePlug
    ? Tailwind<GlobalPluginOption>
    : Tailwind<GlobalPluginOption, PlugStyleOption>

export type ShortTailwindWithOption<
    GlobalPluginOption extends
        TailwindGlobalPlugOption = TailwindDefaultGlobalPlugOption,
    PlugStyleOption extends TailwindStylePlugOption = TailwindDefaultStylePlug,
> = PlugStyleOption extends TailwindDefaultStylePlug
    ? ShortTailwind<GlobalPluginOption>
    : ShortTailwind<GlobalPluginOption, PlugStyleOption>
