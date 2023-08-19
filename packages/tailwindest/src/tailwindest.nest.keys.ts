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
type TailwindNestConditions = {
    break: string
    pseudoClass: string
    pseudoElement: string
}

type GetTailwindNestKeys<
    NestConditions extends TailwindNestConditions,
    IdentifierOption extends TailwindNestConditionIdentifierOption,
> =
    | `${IdentifierOption["breakIdentifier"]}${NestConditions["break"]}`
    | `${IdentifierOption["pseudoClassIdentifier"]}${NestConditions["pseudoClass"]}`
    | `${IdentifierOption["pseudoElementIdentifier"]}${NestConditions["pseudoElement"]}`

type TailwindNestPluginOptions = {
    screens: UndefinableString
    aria: UndefinableString
}

export type TailwindestNestKeys<
    IdentifierOption extends TailwindNestConditionIdentifierOption,
    PluginOptions extends TailwindNestPluginOptions,
> =
    | GetTailwindNestKeys<
          {
              break: TailwindBreakConditions
              pseudoClass: TailwindPseudoClassConditions
              pseudoElement: TailwindPseudoElementConditions
          },
          IdentifierOption
      >
    | `${IdentifierOption["breakIdentifier"]}${Pluggable<
          PluginOptions["screens"]
      >}`
    | `${IdentifierOption["breakIdentifier"]}${Pluggable<
          PluginOptions["aria"]
      >}`
