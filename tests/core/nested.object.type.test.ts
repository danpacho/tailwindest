import { describe, test } from "@jest/globals"
import { type TypeEqual, expectType } from "ts-expect"
import type { Tailwindest } from "../../packages"
import type { NestedObject } from "../../packages/utils"
import { label } from "../label"

describe(label.unit("Type NestedObject"), () => {
    const nestedObject = {
        a: {
            b: {
                c: { d: "d" },
            },
        },
    }
    const tailwindStyle = {
        display: "flex",
        alignItems: "items-center",
    } as const

    test(label.case("object inferred as NestedObject"), () => {
        expectType<NestedObject>(nestedObject)
        expectType<NestedObject>(tailwindStyle)
    })

    test(
        label.case("const asserted style props inferred as Tailwindest"),
        () => {
            expectType<Tailwindest>(tailwindStyle)
        }
    )

    test(
        label.case("Tailwindest extends NestedObject true, reverse false"),
        () => {
            expectType<
                TypeEqual<
                    typeof tailwindStyle extends NestedObject ? true : false,
                    typeof nestedObject extends NestedObject ? true : false
                >
            >(true)

            expectType<
                TypeEqual<
                    typeof nestedObject extends Tailwindest ? true : false,
                    true
                >
            >(false)

            expectType<
                TypeEqual<NestedObject extends Tailwindest ? true : false, true>
            >(true)
        }
    )
})
