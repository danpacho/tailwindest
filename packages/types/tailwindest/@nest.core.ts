import type { TailwindNestedBasicType } from "../tailwind.nested/@basic"

export type TAILWINDEST_NEST_IDENTFIER = ":" | "@"
/**
 * @example "::before" -> "before:"
 */
export type RemoveIdentifierAddNest<
    ClassKey extends string,
    Remover extends string
> = ClassKey extends `${Remover}${infer Rest}`
    ? RemoveIdentifierAddNest<Rest, Remover>
    : `${ClassKey}:`

/**
 * @example "::before" -> "before"
 */
export type RemoveIdentifier<
    ClassKey extends string,
    Remover extends string
> = ClassKey extends `${Remover}${infer Rest}`
    ? RemoveIdentifier<Rest, Remover>
    : ClassKey

/**
 * @example
 * "hover", ":dark" -> "dark:hover"
 */
type CombinateToNest<
    StringLiteral,
    Title extends string
> = StringLiteral extends string
    ? Title extends ""
        ? StringLiteral
        : `${RemoveIdentifierAddNest<
              Title,
              TAILWINDEST_NEST_IDENTFIER
          >}${StringLiteral}`
    : StringLiteral

type AddParentKeyAtChild<
    ObjectType,
    Title extends string,
    TitleHeader extends string = ""
> = {
    [Key in keyof ObjectType]?: ObjectType[Key] extends string
        ? CombinateToNest<ObjectType[Key], Title>
        : Key extends string
        ? AddParentKeyAtChild<
              ObjectType[Key],
              `${TitleHeader}:${RemoveIdentifier<
                  Key,
                  TAILWINDEST_NEST_IDENTFIER
              >}`
          >
        : never
}

export type TailwindestGetNest<
    Style,
    TitleHeader extends string = ""
> = AddParentKeyAtChild<Style, "", TitleHeader>

export type TailwindestGetNestWithTitle<
    Style,
    Title extends string,
    TitleHeader extends string = ""
> = AddParentKeyAtChild<Style, Title, TitleHeader>

/**
 * remove identifier at child style's key
 */
type AdjustKey<Style, Condition extends string = ""> = {
    [Key in keyof Style]?: Style[Key] extends string
        ? `${RemoveIdentifierAddNest<
              Condition,
              TAILWINDEST_NEST_IDENTFIER
          >}${Style[Key]}`
        : never
}

/**
 * add nest style
 */
export type NestStyle<Style, Condition extends string = ""> = {
    [key in Exclude<TailwindNestedBasicType, Condition>]?: Style
} & AdjustKey<Style, Condition>

export type RemoveUnusedNestProperty<Tailwindest> = Omit<
    Tailwindest,
    "transition" | "border"
>
