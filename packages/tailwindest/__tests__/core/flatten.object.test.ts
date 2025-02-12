import { describe, expect, test } from "vitest"
import { flattenObject } from "../../src/core/flatten.object"
import { label } from "../label"

describe(label.unit("flattenObject"), () => {
    test(label.case("flatten nested object into string array"), () => {
        const nestedObjectWithString = {
            a: "a",
            b: "b",
            c: {
                d: "d",
                e: "e",
                f: {
                    g: "g",
                    h: "h",
                    i: {
                        j: "j",
                        k: "k",
                        numberExcluded: 0,
                    },
                },
            },
        }

        expect(flattenObject(nestedObjectWithString)).toEqual([
            "a",
            "b",
            "d",
            "e",
            "g",
            "h",
            "j",
            "k",
        ])
    })

    test(label.case("skip flat at falsy values"), () => {
        const nestedObjectWithFalsy = {
            a: false,
            b: 0,
            c: {
                d: null,
                e: NaN,
                f: {
                    g: undefined,
                    h: false,
                    i: {
                        j: Number.isNaN(true),
                        k: () => false,
                        l: [
                            false,
                            0,
                            NaN,
                            () => false,
                            undefined,
                            null,
                            Number.isNaN(true),
                        ],
                        m: () => () => undefined,
                    },
                },
            },
        }

        expect(flattenObject(nestedObjectWithFalsy)).toEqual([])
    })
})
