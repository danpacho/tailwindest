import { describe, expect, test } from "@jest/globals"
import { cache, getCachedValue } from "../../packages/core"
import type { NestedObject } from "../../packages/core/nested.object.type"
import { label } from "../label"

describe(label.unit("getCachedValue"), () => {
    type StoreKey = symbol | string | number
    type StoreValue = string | NestedObject

    const store = cache<StoreKey, StoreValue>()

    const testSringKeys = {
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
    }

    test(label.case("save string at the input store"), () => {
        Object.values(testSringKeys).forEach((key) => {
            expect(store.has(key)).toBe(false)
            // save
            expect(getCachedValue(store, key, () => targetString)).toBe(
                targetString
            )
        })
    })

    test(label.case("save stylesheet at the input store"), () => {
        Object.values(testNestedObjectKeys).forEach((key) => {
            expect(store.has(key)).toBe(false)
            // save
            expect(
                getCachedValue(store, key, () => targetNestedObject)
            ).toEqual(targetNestedObject)
        })
    })

    test(label.case("inquire cached string from the input store"), () => {
        Object.values(testSringKeys).forEach((key) => {
            expect(store.has(key)).toBe(true)
            // cache hit
            expect(getCachedValue(store, key, () => targetString)).toBe(
                targetString
            )
        })
    })

    test(label.case("inquire cached stylesheet from the input store"), () => {
        Object.values(testNestedObjectKeys).forEach((key) => {
            expect(store.has(key)).toBe(true)
            // cache hit
            expect(
                getCachedValue(store, key, () => targetNestedObject)
            ).toEqual(targetNestedObject)
        })
    })
})
