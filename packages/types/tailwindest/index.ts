import type { Pluggable } from "../plugin"
import type {
    TailwindestDefaultNestPlug,
    TailwindestNestPlugOption,
} from "../tailwind.plugin.option"
import type { TailwindestNest, TailwindestNestBasic } from "./@nest.basic"
import type { RemoveUnusedNestProperty } from "./@nest.core"
import type { TailwindestNestExtends } from "./@nest.extends"

interface TailwindestNestTypeSet<Nest extends string, Tailwind>
    extends TailwindestNestBasic<Nest, Tailwind>,
        TailwindestNestExtends<Nest, Tailwind> {}

type TailwindestNestPlugExtendedTypeSet<
    Nest extends string,
    Tailwind,
    T extends TailwindestNestPlugOption = TailwindestDefaultNestPlug
> = TailwindestNest<Nest, Tailwind, Pluggable<T["conditionA"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionB"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionC"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionD"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionE"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionF"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionG"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionH"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionI"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionJ"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionK"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionL"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionM"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionN"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionO"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionP"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionQ"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionR"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionS"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionT"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionU"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionV"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionW"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionX"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionY"]>> &
    TailwindestNest<Nest, Tailwind, Pluggable<T["conditionZ"]>>

type TailwindestNestPlugType<
    Nest extends string,
    TailwindRemoveUnusedNestProperty,
    TailwindNestCustom extends TailwindestNestPlugOption = TailwindestDefaultNestPlug
> = TailwindestNestTypeSet<Nest, TailwindRemoveUnusedNestProperty> &
    TailwindestNestPlugExtendedTypeSet<
        Nest,
        TailwindRemoveUnusedNestProperty,
        TailwindNestCustom
    >

export type TailwindestTypeSet<
    Tailwind,
    Nest extends string,
    TailwindNestCustom extends TailwindestNestPlugOption = TailwindestDefaultNestPlug
> = Tailwind &
    TailwindestNestPlugType<
        Nest,
        RemoveUnusedNestProperty<Tailwind>,
        TailwindNestCustom
    >
