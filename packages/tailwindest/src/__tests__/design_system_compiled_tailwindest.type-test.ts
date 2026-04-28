import {
    createTools,
    type CreateCompiledTailwindest,
    type CreateTailwindest,
} from "../index"

type DesignTailwind = {
    backgroundColor:
        | "bg-slate-50"
        | "bg-slate-100"
        | "bg-slate-800"
        | "bg-slate-900"
        | "bg-blue-600"
    borderColor: "border-slate-300" | "border-blue-600"
    color: "text-slate-900" | "text-white"
    padding: "px-4" | "py-2"
    ring: "ring-2" | "ring-sky-300"
}

type DesignNestGroups =
    | "dark"
    | "hover"
    | "focus"
    | "group"
    | "peer"
    | "data-[state=open]"
    | "aria-[checked=true]"

type DesignCompiled = CreateCompiledTailwindest<{
    tailwind: DesignTailwind
    tailwindNestGroups: DesignNestGroups
    useArbitrary: false
    useArbitraryVariant: true
}>

type DesignLegacy = CreateTailwindest<{
    tailwind: DesignTailwind
    tailwindNestGroups: DesignNestGroups
    useArbitrary: false
}>

type DesignTools = {
    tailwindest: DesignCompiled
    tailwindLiteral: DesignTailwind[keyof DesignTailwind]
    useArbitrary: false
    useTypedClassLiteral: true
}

const compiledRawNested: DesignCompiled = {
    backgroundColor: "bg-slate-50",
    hover: { backgroundColor: "bg-slate-100" },
    dark: {
        backgroundColor: "bg-slate-900",
        color: "text-white",
        hover: {
            backgroundColor: "bg-slate-800",
            focus: { ring: "ring-sky-300" },
        },
    },
    "data-[state=open]": {
        backgroundColor: "bg-blue-600",
        color: "text-white",
    },
}

compiledRawNested

const compiledRejectsSynthesizedDark: DesignCompiled = {
    dark: {
        // @ts-expect-error compiled nested objects use raw leaves, not synthesized dark-prefixed values
        backgroundColor: "dark:bg-slate-900",
    },
}

compiledRejectsSynthesizedDark

const compiledRejectsSynthesizedDeep: DesignCompiled = {
    dark: {
        hover: {
            // @ts-expect-error compiled deep nested objects use raw leaves, not synthesized dark:hover-prefixed values
            backgroundColor: "dark:hover:bg-slate-800",
        },
    },
}

compiledRejectsSynthesizedDeep

const legacySynthesizedNested: DesignLegacy = {
    backgroundColor: "bg-slate-50",
    dark: {
        backgroundColor: "dark:bg-slate-900",
        hover: {
            backgroundColor: "dark:hover:bg-slate-800",
        },
    },
}

legacySynthesizedNested

const legacyRejectsRawNested: DesignLegacy = {
    dark: {
        // @ts-expect-error legacy nested values remain synthesized variant-prefixed literals
        backgroundColor: "bg-slate-900",
    },
}

legacyRejectsRawNested

const tw = createTools<DesignTools>()

const toggle = tw.toggle({
    truthy: { backgroundColor: "bg-blue-600" },
    falsy: { backgroundColor: "bg-slate-50" },
})
const toggleClass: string = toggle.class(true)
const toggleStyle: DesignCompiled = toggle.style(false)

toggleClass
toggleStyle

const rotary = tw.rotary({
    variants: {
        small: { padding: "px-4" },
        large: { padding: "py-2" },
    },
})
rotary.class("small")
// @ts-expect-error rotary keys are inferred from the variant table
rotary.class("medium")

const variants = tw.variants({
    variants: {
        status: {
            primary: { backgroundColor: "bg-blue-600" },
            basic: { backgroundColor: "bg-slate-50" },
        },
        checked: {
            true: { borderColor: "border-blue-600" },
            false: { borderColor: "border-slate-300" },
        },
    },
})
variants.class({ status: "primary", checked: "true" })
// @ts-expect-error variant option keys are inferred per axis
variants.class({ status: "danger" })
