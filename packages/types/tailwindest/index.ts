import type { Tailwind } from "../tailwind"
import type { TailwindestNestBasic } from "./@nest.basic"
import type { TailwindestNestExtends } from "./@nest.extends"

interface TailwindestTypeSet
    extends Tailwind,
        TailwindestNestBasic,
        TailwindestNestExtends {}

type DeepPartial<T> = {
    [Key in keyof T]?: DeepPartial<T[Key]>
}
export type Tailwindest = DeepPartial<TailwindestTypeSet>
