import type { PluginVariants } from "../../../plugin"

type TailwindOverflowDirection = "x" | "y"

type TailwindOverflowVariants =
    | "auto"
    | "hidden"
    | "clip"
    | "visible"
    | "scroll"

type TailwindOverflow =
    | `overflow-${TailwindOverflowVariants}`
    | "overflow-ellipses"
    | `overflow-${TailwindOverflowDirection}-${TailwindOverflowVariants}`

export type TailwindOverflowType = {
    /**
     *@description Utilities for controlling how an element handles content that is too large for the container.
     *@see {@link https://tailwindcss.com/docs/overflow overflow}
     */
    overflow: TailwindOverflow
    /**
     *@description Utilities for controlling how an element handles content that is too large for the container.
     *@see {@link https://tailwindcss.com/docs/overflow overflow-x}
     */
    overflowX: PluginVariants<"overflow-x", TailwindOverflowVariants>
    /**
     * @description Utilities for controlling how an element handles content that is too large for the container.
     * @see {@link https://tailwindcss.com/docs/overflow overflow-y}
     */
    overflowY: PluginVariants<"overflow-y", TailwindOverflowVariants>
}
