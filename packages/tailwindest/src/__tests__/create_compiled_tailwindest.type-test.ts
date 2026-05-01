import type { CreateTailwindest } from "../index"
import type { CreateCompiledTailwindest } from "../create_compiled_tailwindest"

type TestTailwind = {
    backgroundColor: "bg-red-50" | "bg-red-900" | "bg-red-950"
    borderColor: "border-blue-500"
    color: "text-blue-600" | "text-sky-600" | "text-white"
    padding: "px-2" | "py-1"
}

type TestNestGroups =
    | "dark"
    | "hover"
    | "focus"
    | "@sm"
    | "group"
    | "peer"
    | "group-hover"

type RuntimeTailwindest = CreateTailwindest<{
    tailwind: TestTailwind
    tailwindNestGroups: TestNestGroups
    useArbitrary: false
}>

type CompiledTailwindest = CreateCompiledTailwindest<{
    tailwind: TestTailwind
    tailwindNestGroups: TestNestGroups
    useArbitrary: false
    useArbitraryVariant: true
}>

type WideCompiledTailwindest = CreateCompiledTailwindest<{
    tailwind: TestTailwind
    tailwindNestGroups: string
    useArbitrary: false
}>

const runtimeStyle: RuntimeTailwindest = {
    backgroundColor: "bg-red-50",
    dark: {
        backgroundColor: "dark:bg-red-900",
        hover: {
            backgroundColor: "dark:hover:bg-red-950",
        },
    },
}

runtimeStyle

const compiledStyle: CompiledTailwindest = {
    backgroundColor: "bg-red-50",
    dark: {
        backgroundColor: "bg-red-900",
        hover: {
            backgroundColor: "bg-red-950",
        },
    },
    "@sm": {
        padding: ["px-2", "py-1"],
    },
    "group-hover": {
        color: "text-blue-600",
    },
    group: {
        hover: {
            borderColor: "border-blue-500",
        },
    },
    peer: {
        focus: {
            color: "text-sky-600",
        },
    },
    "data-[state=open]": {
        padding: "px-2",
    },
}

compiledStyle

const compiledWithExplicitPrefix: CompiledTailwindest = {
    dark: {
        // @ts-expect-error compiler style values should autocomplete raw utilities, not synthesized variant-prefixed utilities
        backgroundColor: "dark:bg-red-900",
    },
}

compiledWithExplicitPrefix

const runtimeWithRawNestedValue: RuntimeTailwindest = {
    dark: {
        // @ts-expect-error legacy runtime type still synthesizes variant-prefixed value literals
        backgroundColor: "bg-red-900",
    },
}

runtimeWithRawNestedValue

const wideCompiledStyle: WideCompiledTailwindest = {
    backgroundColor: "bg-red-50",
    dark: {
        backgroundColor: "bg-red-900",
    },
}

wideCompiledStyle
