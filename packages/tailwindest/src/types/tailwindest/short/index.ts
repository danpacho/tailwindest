import type { Pluggable } from "../../plugin"
import type {
    TailwindestDefaultNestPlug,
    TailwindestNestPlugOption,
} from "../../tailwind.plugin.option"
import type { RemoveUnusedNestProperty } from "../@nest.core"
import type {
    ShortTailwindestBasicNestStyleSheet,
    ShortTailwindestNestBasic,
} from "./@nest.basic.short"
import type {
    ShortTailwindestAria,
    ShortTailwindestAriaCustom,
    ShortTailwindestNestExtends,
} from "./@nest.extends.short"

interface ShortTailwindestNestTypeSet<Nest extends string, ShortTailwind>
    extends ShortTailwindestNestBasic<Nest, ShortTailwind>,
        ShortTailwindestNestExtends<Nest, ShortTailwind> {}

type ShortTailwindestPlugExtendedTypeSet<
    Nest extends string,
    ShortTailwind,
    T extends TailwindestNestPlugOption = TailwindestDefaultNestPlug,
> = ShortTailwindestBasicNestStyleSheet<
    Nest,
    ShortTailwind,
    Pluggable<T["conditionA"]>
> &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionB"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionC"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionD"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionE"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionF"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionG"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionH"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionI"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionJ"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionK"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionL"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionM"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionN"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionO"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionP"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionQ"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionR"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionS"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionT"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionU"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionV"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionW"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionX"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionY"]>
    > &
    ShortTailwindestBasicNestStyleSheet<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionZ"]>
    >

type ShortTailwindestNestPlugType<
    Nest extends string,
    TailwindRemoveUnusedNestProperty,
    TailwindNestCustom extends
        TailwindestNestPlugOption = TailwindestDefaultNestPlug,
> = ShortTailwindestNestTypeSet<Nest, TailwindRemoveUnusedNestProperty> &
    ShortTailwindestPlugExtendedTypeSet<
        Nest,
        TailwindRemoveUnusedNestProperty,
        TailwindNestCustom
    >

type ShortTailwindestAriaPlugExtendedTypeSet<
    Nest extends string,
    ShortTailwind,
    T extends TailwindestNestPlugOption = TailwindestDefaultNestPlug,
> = ShortTailwindestAriaCustom<
    Nest,
    ShortTailwind,
    Pluggable<T["conditionA"]>
> &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionB"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionC"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionD"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionE"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionF"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionG"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionH"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionI"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionJ"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionK"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionL"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionM"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionN"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionO"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionP"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionQ"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionR"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionS"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionT"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionU"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionV"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionW"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionX"]>
    > &
    ShortTailwindestAriaCustom<
        Nest,
        ShortTailwind,
        Pluggable<T["conditionY"]>
    > &
    ShortTailwindestAriaCustom<Nest, ShortTailwind, Pluggable<T["conditionZ"]>>

type ShortTailwindestAriaPlugType<
    Nest extends string,
    ShortTailwindRemoveUnusedNestProperty,
    TailwindNestCustom extends
        TailwindestNestPlugOption = TailwindestDefaultNestPlug,
> = ShortTailwindestAria<
    Nest,
    ShortTailwindRemoveUnusedNestProperty,
    ShortTailwindestAriaPlugExtendedTypeSet<
        Nest,
        ShortTailwindRemoveUnusedNestProperty,
        TailwindNestCustom
    >
>

type ShortTailwindestCustomNestTypeSet<
    Nest extends string,
    ShortTailwind,
    TailwindNestCustom extends
        TailwindestNestPlugOption = TailwindestDefaultNestPlug,
    TailwindAriaCustom extends
        TailwindestNestPlugOption = TailwindestDefaultNestPlug,
> = ShortTailwindestNestPlugType<Nest, ShortTailwind, TailwindNestCustom> &
    ShortTailwindestAriaPlugType<Nest, ShortTailwind, TailwindAriaCustom>

export type ShortTailwindestTypeSet<
    ShortTailwind,
    Nest extends string,
    TailwindNestCustom extends
        TailwindestNestPlugOption = TailwindestDefaultNestPlug,
    TailwindAriaCustom extends
        TailwindestNestPlugOption = TailwindestDefaultNestPlug,
> = ShortTailwind &
    ShortTailwindestCustomNestTypeSet<
        Nest,
        RemoveUnusedNestProperty<ShortTailwind>,
        TailwindNestCustom,
        TailwindAriaCustom
    >
