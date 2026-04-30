import { clsx } from "clsx"

type ClassValue<Literal> =
    | ClassList<Literal>
    | ClassDictionary
    | Literal
    | number
    | bigint
    | null
    | boolean
    | undefined
type ClassDictionary = Record<string, any>

/**
 * Default supported class list.
 */
export type ClassList<Literal = any> = ClassValue<Literal>[]

export function toClass<Literal>(...classList: ClassList<Literal>): string {
    return clsx(classList)
}
