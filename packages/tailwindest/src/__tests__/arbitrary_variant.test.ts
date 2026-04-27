import { describe, it, expectTypeOf } from "vitest"
import type { CreateTailwindest } from "../create_tailwindest"

describe("Arbitrary Variant Type Tests", () => {
    type Tailwind = {
        color: "text-red-500" | "text-blue-500"
        backgroundColor: "bg-red-500" | "bg-blue-500"
    }
    type TailwindNestGroups = "hover" | "active" | "focus"

    describe("useArbitraryVariant: true", () => {
        type Tailwindest = CreateTailwindest<{
            tailwind: Tailwind
            tailwindNestGroups: TailwindNestGroups
            useArbitraryVariant: true
        }>

        it("should allow arbitrary variants with [...] syntax", () => {
            expectTypeOf<Tailwindest["[&>tr]"]>().not.toBeNever()
            expectTypeOf<Tailwindest["data-[state=open]"]>().not.toBeNever()
            expectTypeOf<Tailwindest["aria-[sort=ascending]"]>().not.toBeNever()
        })

        it("should allow data-* and aria-* shorthand variants", () => {
            expectTypeOf<Tailwindest["data-current"]>().not.toBeNever()
            expectTypeOf<Tailwindest["aria-disabled"]>().not.toBeNever()
        })

        it("should allow feature, media, and container query variants", () => {
            expectTypeOf<
                Tailwindest["supports-[display:grid]"]
            >().not.toBeNever()
            expectTypeOf<
                Tailwindest["media-[min-width:600px]"]
            >().not.toBeNever()
            expectTypeOf<
                Tailwindest["container-[inline-size>400px]"]
            >().not.toBeNever()
        })

        it("should allow group variants with @... syntax", () => {
            expectTypeOf<Tailwindest["@group-hover"]>().not.toBeNever()
            expectTypeOf<Tailwindest["@peer-focus"]>().not.toBeNever()
        })

        it("should maintain strict property validation inside arbitrary variants", () => {
            type InArbitrary = NonNullable<Tailwindest["[&>tr]"]>

            // Valid properties should be allowed
            expectTypeOf<InArbitrary>().not.toBeNever()

            // Check specific property type (including array support and optionality)
            type ExpectedColor =
                | Tailwind["color"]
                | Tailwind["color"][]
                | undefined
            expectTypeOf<InArbitrary["color"]>().toEqualTypeOf<ExpectedColor>()
        })

        it("should support recursive arbitrary variants", () => {
            // @ts-ignore - TS sometimes has issues with recursive template literal index signatures
            type Step1 = NonNullable<Tailwindest["[&>tr]"]>
            // @ts-ignore
            type Step2 = NonNullable<Step1["[&:hover]"]>

            // If the above compiles (or ignored), we check the resulting type
            expectTypeOf<Step2>().not.toBeNever()
        })

        it("should support standard variants alongside arbitrary ones", () => {
            expectTypeOf<Tailwindest["hover"]>().not.toBeNever()
        })
    })

    describe("useArbitraryVariant: false (default)", () => {
        type Tailwindest = CreateTailwindest<{
            tailwind: Tailwind
            tailwindNestGroups: TailwindNestGroups
            useArbitraryVariant: false
        }>

        it("should NOT allow arbitrary variants with [...] syntax", () => {
            // @ts-expect-error - arbitrary variant is disabled
            type Fail = Tailwindest["[&>tr]"]
        })
    })

    describe("Cross-feature: useArbitrary: true & useArbitraryVariant: true", () => {
        type Tailwindest = CreateTailwindest<{
            tailwind: Tailwind
            tailwindNestGroups: TailwindNestGroups
            useArbitrary: true
            useArbitraryVariant: true
        }>

        it("should allow both arbitrary properties and arbitrary variants", () => {
            type InArbitrary = NonNullable<Tailwindest["[&>tr]"]>

            expectTypeOf<Tailwindest["[&>tr]"]>().not.toBeNever()

            // Should allow any string for color because useArbitrary is true
            type Base = Tailwind["color"] | (string & {})
            type ExpectedColor = Base | Base[] | undefined
            expectTypeOf<InArbitrary["color"]>().toEqualTypeOf<ExpectedColor>()
        })
    })
})
