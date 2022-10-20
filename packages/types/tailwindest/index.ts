import type { TailwindestNestBasic } from "./@nest.basic"
import type { RemoveUnusedNestProperty } from "./@nest.core"
import type { TailwindestNestExtends } from "./@nest.extends"

export interface TailwindestNestTypeSet<T>
    extends TailwindestNestBasic<RemoveUnusedNestProperty<T>>,
        TailwindestNestExtends<RemoveUnusedNestProperty<T>> {}

export type TailwindestTypeSet<T> = TailwindestNestTypeSet<T> & T
