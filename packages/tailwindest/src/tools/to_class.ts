import { ClassArray, clsx } from "clsx"

export type ClassList = ClassArray
export function toClass(...classList: ClassList): string {
    return clsx(classList)
}
