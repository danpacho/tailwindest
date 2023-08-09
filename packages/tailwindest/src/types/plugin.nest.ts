import type { Pluggable } from "./plugin"
import type { TailwindNestedBasicType } from "./tailwind.nested/@basic"
import type { ShortTailwindNestedBasicType } from "./tailwind.nested/@basic.short"
import type {
    TailwindestDefaultNestPlug,
    TailwindestNestPlugOption,
} from "./tailwind.plugin.option"

type ToPluggableNestKey<
    PlugOption extends TailwindestNestPlugOption = TailwindestDefaultNestPlug,
> = Pluggable<
    | PlugOption["conditionA"]
    | PlugOption["conditionB"]
    | PlugOption["conditionC"]
    | PlugOption["conditionD"]
    | PlugOption["conditionE"]
    | PlugOption["conditionF"]
    | PlugOption["conditionG"]
    | PlugOption["conditionH"]
    | PlugOption["conditionI"]
    | PlugOption["conditionJ"]
    | PlugOption["conditionK"]
    | PlugOption["conditionL"]
    | PlugOption["conditionM"]
    | PlugOption["conditionN"]
    | PlugOption["conditionO"]
    | PlugOption["conditionP"]
    | PlugOption["conditionQ"]
    | PlugOption["conditionR"]
    | PlugOption["conditionS"]
    | PlugOption["conditionT"]
    | PlugOption["conditionU"]
    | PlugOption["conditionV"]
    | PlugOption["conditionW"]
    | PlugOption["conditionX"]
    | PlugOption["conditionY"]
    | PlugOption["conditionZ"]
>

export type TailwindestNestKey<
    PlugOption extends TailwindestNestPlugOption = TailwindestDefaultNestPlug,
> = TailwindNestedBasicType | ToPluggableNestKey<PlugOption>

export type ShortTailwindestNestKey<
    PlugOption extends TailwindestNestPlugOption = TailwindestDefaultNestPlug,
> = ShortTailwindNestedBasicType | ToPluggableNestKey<PlugOption>
