import { describe, expect, test } from "@jest/globals"
import { cache } from "../../packages/core"
import type { NestedObject } from "../../packages/utils"
import { label } from "../label"

describe(label.unit("cache: set | has"), () => {
    const store = cache<string, NestedObject>()

    const nestedObject = {
        a: "a",
        b: "b",
        c: {
            d: "d",
            e: "e",
            f: {
                g: "g",
                h: "h",
            },
        },
    } as const
    const key = "nestedObject" as const

    test(label.case("set"), () => {
        store.set(key, nestedObject)
        expect(store.has(key)).toBe(true)
    })

    test(label.case("has"), () => {
        expect(store.has(key)).toBe(true)
    })
})

describe(label.unit("cache: get"), () => {
    type StoreKey = symbol | string | number
    type StoreValue = string | NestedObject

    const store = cache<StoreKey, StoreValue>()

    const testStringKeys = {
        string: "0",
        symbol: Symbol(0),
        number: 0,
    }
    const targetString = "string"

    const testNestedObjectKeys = {
        string: "1",
        symbol: Symbol(1),
        number: 1,
    }
    const targetNestedObject: NestedObject = {
        a: "a",
        b: {
            c: {
                d: {
                    e: {
                        f: {
                            g: "g",
                        },
                    },
                },
            },
        },
    } as const

    test(label.case("save string"), () => {
        Object.values(testStringKeys).forEach((key) => {
            expect(store.has(key)).toBe(false)
            // save
            expect(store.get(key, () => targetString)).toBe(targetString)
        })
    })

    test(label.case("save stylesheet"), () => {
        Object.values(testNestedObjectKeys).forEach((key) => {
            expect(store.has(key)).toBe(false)
            // save
            expect(store.get(key, () => targetNestedObject)).toEqual(
                targetNestedObject
            )
        })
    })

    test(label.case("inquire cached string"), () => {
        Object.values(testStringKeys).forEach((key) => {
            expect(store.has(key)).toBe(true)
            // cache hit
            expect(store.get(key, () => targetString)).toBe(targetString)
        })
    })

    test(label.case("inquire cached stylesheet"), () => {
        Object.values(testNestedObjectKeys).forEach((key) => {
            expect(store.has(key)).toBe(true)
            // cache hit
            expect(store.get(key, () => targetNestedObject)).toEqual(
                targetNestedObject
            )
        })
    })
})
