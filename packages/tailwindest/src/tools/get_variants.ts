import type { Styler } from "./styler"

/**
 * Get variants
 */
export type GetVariants<StylerInstance extends Styler<any, any, any>> =
    StylerInstance extends Styler<infer Arg, any, any>
        ? Arg extends never
            ? never
            : Exclude<Parameters<StylerInstance["class"]>[0], "base">
        : never
