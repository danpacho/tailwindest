import type { Pluggable } from "../plugin"
import type {
    TailwindestDefaultNestPlug,
    TailwindestNestPlugOption,
} from "../tailwind.plugin.option"
import type {
    TailwindestBasicNestStyleSheet,
    TailwindestNestBasic,
} from "./@nest.basic"
import type { RemoveUnusedNestProperty } from "./@nest.core"
import type {
    TailwindestAria,
    TailwindestAriaCustom,
    TailwindestNestExtends,
} from "./@nest.extends"

interface TailwindestNestTypeSet<Nest extends string, Tailwind>
    extends TailwindestNestBasic<Nest, Tailwind>,
        TailwindestNestExtends<Nest, Tailwind> {}

type TailwindestPlugExtendedTypeSet<
    Nest extends string,
    Tailwind,
    T extends TailwindestNestPlugOption = TailwindestDefaultNestPlug,
> = TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionA"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionB"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionC"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionD"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionE"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionF"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionG"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionH"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionI"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionJ"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionK"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionL"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionM"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionN"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionO"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionP"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionQ"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionR"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionS"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionT"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionU"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionV"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionW"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionX"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionY"]>> &
    TailwindestBasicNestStyleSheet<Nest, Tailwind, Pluggable<T["conditionZ"]>>

type TailwindestNestPlugType<
    Nest extends string,
    TailwindRemoveUnusedNestProperty,
    TailwindNestCustom extends
        TailwindestNestPlugOption = TailwindestDefaultNestPlug,
> = TailwindestNestTypeSet<Nest, TailwindRemoveUnusedNestProperty> &
    TailwindestPlugExtendedTypeSet<
        Nest,
        TailwindRemoveUnusedNestProperty,
        TailwindNestCustom
    >

type TailwindestAriaPlugExtendedTypeSet<
    Nest extends string,
    Tailwind,
    T extends TailwindestNestPlugOption = TailwindestDefaultNestPlug,
> = TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionA"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionB"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionC"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionD"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionE"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionF"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionG"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionH"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionI"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionJ"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionK"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionL"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionM"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionN"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionO"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionP"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionQ"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionR"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionS"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionT"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionU"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionV"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionW"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionX"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionY"]>> &
    TailwindestAriaCustom<Nest, Tailwind, Pluggable<T["conditionZ"]>>

type TailwindestAriaPlugType<
    Nest extends string,
    TailwindRemoveUnusedNestProperty,
    TailwindNestCustom extends
        TailwindestNestPlugOption = TailwindestDefaultNestPlug,
> = TailwindestAria<
    Nest,
    TailwindRemoveUnusedNestProperty,
    TailwindestAriaPlugExtendedTypeSet<
        Nest,
        TailwindRemoveUnusedNestProperty,
        TailwindNestCustom
    >
>

type TailwindestCustomNestTypeSet<
    Nest extends string,
    Tailwind,
    TailwindNestCustom extends
        TailwindestNestPlugOption = TailwindestDefaultNestPlug,
    TailwindAriaCustom extends
        TailwindestNestPlugOption = TailwindestDefaultNestPlug,
> = TailwindestNestPlugType<Nest, Tailwind, TailwindNestCustom> &
    TailwindestAriaPlugType<Nest, Tailwind, TailwindAriaCustom>

export type TailwindestTypeSet<
    Tailwind,
    Nest extends string,
    TailwindNestCustom extends
        TailwindestNestPlugOption = TailwindestDefaultNestPlug,
    TailwindAriaCustom extends
        TailwindestNestPlugOption = TailwindestDefaultNestPlug,
> = Tailwind &
    TailwindestCustomNestTypeSet<
        Nest,
        RemoveUnusedNestProperty<Tailwind>,
        TailwindNestCustom,
        TailwindAriaCustom
    >
