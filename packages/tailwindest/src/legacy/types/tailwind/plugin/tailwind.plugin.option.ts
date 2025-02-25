import type { PluginOption } from "../../plugin"
import { TailwindColorPluginOptionKey } from "../properties"
import type { TailwindStylePluginKey } from "./tailwind.plugin.key"

export type TailwindStylePlugOption = PluginOption<TailwindStylePluginKey>

type DEFAULT_VALUE = ""
export type TailwindDefaultStylePlug = PluginOption<
    TailwindStylePluginKey,
    DEFAULT_VALUE
>

type TailwindGlobalPlugOptionKey =
    | TailwindColorPluginOptionKey
    | "sizing"
    | "screens"
export type TailwindGlobalPlugOption = PluginOption<TailwindGlobalPlugOptionKey>

export type TailwindDefaultGlobalPlugOption = PluginOption<
    TailwindGlobalPlugOptionKey,
    DEFAULT_VALUE
>
