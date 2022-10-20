type Literalize<Literal> = Literal extends string
    ? string extends Literal
        ? never
        : Literal
    : never

type RecordWithPartial<Key extends string, Value> = { [P in Key]?: Value }

export type PlugBase = string | undefined
export type Pluggable<T> = Literalize<Exclude<T, "" | undefined>>

export type PluginOption<
    OptionKey extends string,
    OptionValueType = string
> = RecordWithPartial<OptionKey, OptionValueType>
