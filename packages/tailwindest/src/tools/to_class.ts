import { clsx } from "clsx"

// Type definition from <clsx> copyright >> https://github.com/lukeed/clsx
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
 * @interface
 * Default supported class list
 */
export type ClassList<Literal = any> = ClassValue<Literal>[]

export function toClass<Literal>(...classList: ClassList<Literal>): string {
    return clsx(classList)
}
