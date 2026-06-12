import type { Styler } from "./styler"

type NormalizeVariantProps<Args> =
    Args extends Record<PropertyKey, unknown>
        ? {
              [K in keyof Args]?: Exclude<Args[K], undefined>
          }
        : Args

/**
 * Get variants
 */
export type GetVariants<StylerInstance extends Styler<any, any, any>> =
    StylerInstance extends Styler<infer Arg, any, any>
        ? Arg extends never
            ? never
            : NormalizeVariantProps<
                  Exclude<Parameters<StylerInstance["class"]>[0], "base">
              >
        : never
