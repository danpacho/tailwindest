import { describe, expect, test } from "@jest/globals"
import { cache } from "../../packages/core"
import type { NestedObject } from "../../packages/core/nested.object.type"
import { label } from "../label"

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
}
const key = "nestedObject"

describe(label.unit("cache"), () => {
    test(label.case("set -> save nested object"), () => {
        store.set(key, nestedObject)
        expect(store.get(key)).toEqual(nestedObject)
    })

    test(label.case("has -> check exsistance"), () => {
        expect(store.has(key)).toBe(true)
    })
})
