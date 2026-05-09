import { describe, it } from "vitest"
import type { CreateTailwindest } from "../create_tailwindest"

type TestTailwind = {
    backgroundColor: "bg-red-500"
    cursor: "cursor-grabbing"
    display: "block"
    margin: "mt-4"
}

type TestNestGroups = "active" | "group-hover" | "hover"

type DefaultStyle = CreateTailwindest<{
    tailwind: TestTailwind
    tailwindNestGroups: TestNestGroups
}>

type ArbitraryNestStyle = CreateTailwindest<{
    tailwind: TestTailwind
    tailwindNestGroups: TestNestGroups
    useArbitraryNestGroups: true
}>

type PrefixedArbitraryNestStyle = CreateTailwindest<{
    tailwind: TestTailwind
    tailwindNestGroups: TestNestGroups
    groupPrefix: "#"
    useArbitraryNestGroups: true
}>

describe("CreateTailwindest arbitrary nest groups", () => {
    it("keeps arbitrary nest groups opt-in", () => {
        const knownNestGroup: DefaultStyle = {
            hover: {
                margin: "hover:mt-4",
            },
        }

        const arbitraryNestGroup: DefaultStyle = {
            // @ts-expect-error arbitrary nest groups are disabled by default
            "[&_p]": {
                margin: "[&_p]:mt-4",
            },
        }

        const dynamicNestGroup: DefaultStyle = {
            // @ts-expect-error dynamic nest groups are disabled by default
            "aria-invalid": {
                backgroundColor: "aria-invalid:bg-red-500",
            },
        }

        void knownNestGroup
        void arbitraryNestGroup
        void dynamicNestGroup
    })

    it("supports Tailwind arbitrary nest group patterns", () => {
        const style: ArbitraryNestStyle = {
            "[&.is-dragging]": {
                cursor: "[&.is-dragging]:cursor-grabbing",
            },
            "[@supports(display:grid)]": {
                display: "[@supports(display:grid)]:block",
            },
            "@[618px]": {
                display: "@[618px]:block",
            },
            "aria-[sort=ascending]": {
                backgroundColor: "aria-[sort=ascending]:bg-red-500",
            },
            "aria-invalid": {
                backgroundColor: "aria-invalid:bg-red-500",
            },
            "data-[size=large]": {
                margin: "data-[size=large]:mt-4",
            },
            "data-state": {
                backgroundColor: "data-state:bg-red-500",
            },
            "group-[.is-published]": {
                display: "group-[.is-published]:block",
            },
            "group-aria-invalid": {
                backgroundColor: "group-aria-invalid:bg-red-500",
            },
            "has-aria-invalid": {
                backgroundColor: "has-aria-invalid:bg-red-500",
            },
            "has-[a]": {
                margin: "has-[a]:mt-4",
            },
            "in-aria-invalid": {
                backgroundColor: "in-aria-invalid:bg-red-500",
            },
            "in-[.foo]": {
                margin: "in-[.foo]:mt-4",
            },
            "max-[877px]": {
                display: "max-[877px]:block",
            },
            "min-[712px]": {
                display: "min-[712px]:block",
            },
            "not-[.foo]": {
                margin: "not-[.foo]:mt-4",
            },
            "not-data-state": {
                backgroundColor: "not-data-state:bg-red-500",
            },
            "nth-[3n+1]": {
                margin: "nth-[3n+1]:mt-4",
            },
            "peer-data-state": {
                backgroundColor: "peer-data-state:bg-red-500",
            },
            "peer-[:nth-of-type(3)_&]": {
                display: "peer-[:nth-of-type(3)_&]:block",
            },
            "placement-[top-start]": {
                margin: "placement-[top-start]:mt-4",
            },
            "supports-[display:grid]": {
                display: "supports-[display:grid]:block",
            },
        }

        void style
    })

    it("supports arbitrary nest groups stacked with known and arbitrary groups", () => {
        const style: ArbitraryNestStyle = {
            hover: {
                "[&.is-dragging]": {
                    cursor: "hover:[&.is-dragging]:cursor-grabbing",
                },
            },
            "[&.is-dragging]": {
                active: {
                    cursor: "[&.is-dragging]:active:cursor-grabbing",
                },
                "[&_p]": {
                    margin: "[&.is-dragging]:[&_p]:mt-4",
                },
            },
        }

        void style
    })

    it("supports prefixed arbitrary nest groups", () => {
        const style: PrefixedArbitraryNestStyle = {
            "#hover": {
                "#[&_p]": {
                    margin: "hover:[&_p]:mt-4",
                },
            },
            "#[&_p]": {
                margin: "[&_p]:mt-4",
            },
        }

        void style
    })
})
