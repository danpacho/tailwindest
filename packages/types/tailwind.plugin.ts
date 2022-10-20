import type { Tailwind } from "./tailwind"
import type {
    TailwindDefaultGlobalPlugOption,
    TailwindDefaultStylePlug,
    TailwindGlobalPlugOption,
    TailwindStylePlugOption,
} from "./tailwind.plugin.option"

export type TailwindWithOption<
    GlobalPluginOption extends TailwindGlobalPlugOption = TailwindDefaultGlobalPlugOption,
    PlugStyleOption extends TailwindStylePlugOption = TailwindDefaultStylePlug
> = PlugStyleOption extends TailwindDefaultStylePlug
    ? Tailwind<GlobalPluginOption>
    : Tailwind<GlobalPluginOption, PlugStyleOption>
