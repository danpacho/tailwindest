import type { ShortTailwind, Tailwind } from "./core"
import type {
    TailwindDefaultGlobalPlugOption,
    TailwindDefaultStylePlug,
    TailwindGlobalPlugOption,
    TailwindStylePlugOption,
} from "./plugin"

/**
 * @description tailwind type definition with pluggable style
 * @description follow `CSS` properties syntax
 */
export type TailwindPlugin<
    GlobalPluginOption extends
        TailwindGlobalPlugOption = TailwindDefaultGlobalPlugOption,
    PlugStyleOption extends TailwindStylePlugOption = TailwindDefaultStylePlug,
> = PlugStyleOption extends TailwindDefaultStylePlug
    ? Tailwind<GlobalPluginOption>
    : Tailwind<GlobalPluginOption, PlugStyleOption>

/**
 * @description tailwind type definition with pluggable style
 * @description follow short-handed `CSS` properties syntax
 */
export type ShortTailwindPlugin<
    GlobalPluginOption extends
        TailwindGlobalPlugOption = TailwindDefaultGlobalPlugOption,
    PlugStyleOption extends TailwindStylePlugOption = TailwindDefaultStylePlug,
> = PlugStyleOption extends TailwindDefaultStylePlug
    ? ShortTailwind<GlobalPluginOption>
    : ShortTailwind<GlobalPluginOption, PlugStyleOption>
