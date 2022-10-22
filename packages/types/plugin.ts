export type Literalize<Literal> = Literal extends string
    ? string extends Literal
        ? never
        : Literal
    : never

type RecordWithPartial<Key extends string, Value> = { [P in Key]?: Value }

export type PlugBase = string | undefined
export type Pluggable<Plug> = Literalize<Exclude<Plug, "" | undefined>>

export type PluginOption<
    OptionKey extends string,
    OptionValueType = string
> = RecordWithPartial<OptionKey, OptionValueType>

export type PluginVariants<
    Title extends string,
    Value extends string
> = `${Title}-${Value}`

export type PluginVariantsWithDirection<
    Title extends string,
    Value extends string
> = PluginVariants<Title | `-${Title}`, Value>

export type ToPlugin<Value extends string, Plug extends PlugBase = ""> =
    | Value
    | Pluggable<Plug>

export type ToPluginWithTitle<
    Title extends string,
    Value extends string,
    Plug extends PlugBase = ""
> = PluginVariants<Title, ToPlugin<Value, Plug>>
