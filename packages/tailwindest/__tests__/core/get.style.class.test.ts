import { describe, expect, test } from "vitest"
import { getStyleClass } from "../../src/core/get.styleclass"
import { label } from "../label"

describe(label.unit("getStyleClass"), () => {
    test(label.case("join string array into className string"), () => {
        const stringArray = ["a", "b", "c", "d", "e"]
        const indent = " "

        expect(getStyleClass(stringArray)).toBe(
            `a${indent}b${indent}c${indent}d${indent}e`
        )
    })
})
