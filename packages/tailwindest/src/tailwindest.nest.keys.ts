import { TailwindBreakConditions } from "./types/nest.keys/break"
import { TailwindPseudoClassConditions } from "./types/nest.keys/pseudo.class"
import { TailwindPseudoElementConditions } from "./types/nest.keys/pseudo.element"
import { Pluggable } from "./types/plugin"
import type { UndefinableString } from "./utils"

export type TailwindNestConditionIdentifierOption = {
    /**
     * @description break condition identifier
     * @example break condition list
     * ```ts
     * type TailwindBreakConditions =
            | "contrast-more"
            | "contrast-less"
            | "motion-reduce"
            | "motion-safe"
            | "portrait"
            | "landscape"
            | "print"
            | "rtl"
            | "ltr"
            | "sm"
            | "md"
            | "lg"
            | "xl"
            | "2xl"
            | "max-sm"
            | "max-md"
            | "max-lg"
            | "max-xl"
            | "max-2xl"
            | "aria-checked"
            | "aria-disabled"
            | "aria-expanded"
            | "aria-hidden"
            | "aria-pressed"
            | "aria-readonly"
            | "aria-required"
            | "aria-selected"
            | "dark"
     * ```
     */
    breakIdentifier: string
    /**
     * @description pseudo class condition identifier
     * @example pseudo class condition list
     * ```ts
     * type TailwindPseudoClassConditions =
            | "hover"
            | "active"
            | "first"
            | "last"
            | "only"
            | "odd"
            | "even"
            | "first-of-type"
            | "last-of-type"
            | "only-of-type"
            | "empty"
            | "enabled"
            | "indeterminate"
            | "default"
            | "required"
            | "valid"
            | "invalid"
            | "in-range"
            | "out-of-range"
            | "placeholder-shown"
            | "autofill"
            | "read-only"
            | "checked"
            | "disabled"
            | "visited"
            | "target"
            | "focus"
            | "focus-within"
            | "focus-visible"
            | "optional"
     * ```
     */
    pseudoClassIdentifier: string
    /**
     * @description pseudo element condition identifier
     * @example pseudo element condition list
     * ```ts
     * type TailwindPseudoElementConditions =
            | "before"
            | "after"
            | "placeholder"
            | "file"
            | "marker"
            | "backdrop"
            | "selection"
            | "first-line"
            | "first-letter"

     * ```
     */
    pseudoElementIdentifier: string
}
type TailwindestNestConditions = {
    break: string
    pseudoClass: string
    pseudoElement: string
}

type GetTailwindestBaseNestKeys<
    IdentifierOption extends TailwindNestConditionIdentifierOption,
    NestConditions extends TailwindestNestConditions,
> =
    | `${IdentifierOption["breakIdentifier"]}${NestConditions["break"]}`
    | `${IdentifierOption["pseudoClassIdentifier"]}${NestConditions["pseudoClass"]}`
    | `${IdentifierOption["pseudoElementIdentifier"]}${NestConditions["pseudoElement"]}`

type GetTailwindestCustomScreenKeys<
    IdentifierOption extends TailwindNestConditionIdentifierOption,
    PluginOptions extends TailwindestNestPluginOptions,
> = `${IdentifierOption["breakIdentifier"]}${Pluggable<
    PluginOptions["screens"]
>}`

/**
 * @description aria prefix of custom properties
 * @example
 * ```ts
 * type MyAria = "checked" | "disabled"
 * type Result = "aria-checked" | "aria-disabled"
 * ```
 */
type ARIA_PREFIX = "aria-"

type GetTailwindestCustomAriaKeys<
    IdentifierOption extends TailwindNestConditionIdentifierOption,
    PluginOptions extends TailwindestNestPluginOptions,
> = `${IdentifierOption["breakIdentifier"]}${ARIA_PREFIX}${Pluggable<
    PluginOptions["aria"]
>}`

type TailwindestNestPluginOptions = {
    screens: UndefinableString
    aria: UndefinableString
}

export type TailwindestNestKeys<
    IdentifierOption extends TailwindNestConditionIdentifierOption,
    PluginOptions extends TailwindestNestPluginOptions,
> =
    | GetTailwindestBaseNestKeys<
          IdentifierOption,
          {
              break: TailwindBreakConditions
              pseudoClass: TailwindPseudoClassConditions
              pseudoElement: TailwindPseudoElementConditions
          }
      >
    | GetTailwindestCustomScreenKeys<IdentifierOption, PluginOptions>
    | GetTailwindestCustomAriaKeys<IdentifierOption, PluginOptions>
