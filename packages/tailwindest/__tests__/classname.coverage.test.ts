import { describe, expect, test } from "@jest/globals"
import { type Tailwindest, createTools } from "../src"
import { label } from "./label"

const tw = createTools<Tailwindest>()

type AllClasses = "a" | "aa" | "aaa" | "b" | "bb" | "bbb"

type ClassTypes = {
    a?: "a" | "aa" | "aaa"
    b?: "b" | "bb" | "bbb"
}

const ClassMap = {
    a: ["a", "aa", "aaa"],
    b: ["b", "bb", "bbb"],
} as const satisfies {
    [key in keyof ClassTypes]: ClassTypes[key][]
}

type ClassMapTypes = (typeof ClassMap)[keyof typeof ClassMap][number]

type TypesSimilar<T1, T2> = [
    T1 extends T2 ? true : false,
    T2 extends T1 ? true : false,
] extends [true, true]
    ? true
    : false

describe(label.unit("Basic tailwind classname coverage"), () => {
    test("check all classnames used", () => {
        const valid: TypesSimilar<AllClasses, ClassMapTypes> = true

        expect(valid).toBe(true)
    })
})
