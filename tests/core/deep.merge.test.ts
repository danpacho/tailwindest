import { describe, expect, test } from "@jest/globals"
import { deepMerge } from "../../packages/core"
import type { NestedObject } from "../../packages/utils"
import { label } from "../label"

describe(label.unit("deepMerge"), () => {
    test(label.case("merge nested object"), () => {
        const baseObject: NestedObject = {
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
        const mergeTargetObject: NestedObject = {
            a: "Im, a",
            b: "Im, b",
            c: {
                d: "Im, d",
                f: {
                    g: "Im, g",
                    i: "i",
                },
            },
        }

        const expectedMergedObject: NestedObject = {
            a: "Im, a",
            b: "Im, b",
            c: {
                d: "Im, d",
                e: "e",
                f: {
                    g: "Im, g",
                    h: "h",
                    i: "i",
                },
            },
        }

        expect(deepMerge(baseObject, mergeTargetObject)).toEqual(
            expectedMergedObject
        )
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type TestObject = any

    test(label.case("skip merging at falsy values"), () => {
        const baseObject: TestObject = {
            a: true,
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
        const falsyObject = {
            a: false,
            b: null,
            c: {
                d: 0,
                f: {
                    h: false,
                },
            },
        }

        expect(deepMerge(baseObject, falsyObject)).toEqual(baseObject)
    })
})
