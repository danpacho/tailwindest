export type DesignSystemApi =
    | "style.class"
    | "style.style"
    | "style.compose"
    | "toggle.class"
    | "toggle.style"
    | "toggle.compose"
    | "rotary.class"
    | "rotary.style"
    | "rotary.compose"
    | "variants.class"
    | "variants.style"
    | "variants.compose"
    | "join"
    | "def"
    | "mergeProps"
    | "mergeRecord"

export interface DesignSystemExpectation {
    api: DesignSystemApi
    section: string
    tokenGroup: string
    staticClass?: string
    staticStyle?: Record<string, unknown>
    dynamicStates: Record<string, string>
    candidates: string[]
    excludedCandidates: string[]
    computed: Array<
        | "backgroundColor"
        | "borderColor"
        | "color"
        | "cursor"
        | "height"
        | "opacity"
        | "outlineStyle"
        | "paddingLeft"
        | "paddingRight"
        | "width"
    >
}

const styleClass =
    "inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold leading-5 text-slate-900 shadow-sm transition hover:bg-slate-100 focus:ring-2 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 dark:hover:focus:ring-sky-300 data-open:bg-blue-600 data-open:text-white"

const styleStyleClass =
    "inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:ring-2"

const styleComposeClass =
    "inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-300 bg-indigo-50 px-5 py-3 text-base font-semibold text-indigo-900 shadow-md hover:border-cyan-500 focus:text-sky-600"

const toggleOffClass =
    "inline-flex h-7 w-12 items-center rounded-full border border-slate-300 bg-slate-200 p-1 transition"
const toggleOnClass =
    "inline-flex h-7 w-12 items-center rounded-full border border-emerald-500 bg-emerald-500 p-1 transition"
const toggleComposeOffClass =
    "inline-flex h-8 w-14 items-center rounded-full border border-slate-300 bg-slate-200 p-1 transition shadow-sm"
const toggleComposeOnClass =
    "inline-flex h-8 w-14 items-center rounded-full border border-emerald-500 bg-emerald-500 p-1 transition shadow-sm"

const rotaryBaseClass =
    "inline-flex items-center justify-center rounded-md border border-slate-300 bg-white font-semibold text-slate-900 transition"
const rotaryTinyClass = `${rotaryBaseClass} h-7 px-2 py-1 text-xs`
const rotaryMediumClass = `${rotaryBaseClass} h-10 px-4 py-2 text-sm`
const rotaryGiantClass = `${rotaryBaseClass} h-14 px-7 py-4 text-lg`
const rotaryComposeMediumClass = `${rotaryBaseClass} shadow-md h-10 px-4 py-2 text-sm`

const variantsBaseClass =
    "inline-flex items-center justify-center gap-2 rounded-md border font-semibold transition"
const variantsPrimaryMediumClass = `${variantsBaseClass} h-10 px-4 py-2 text-sm border-blue-600 bg-blue-500 text-blue-50`
const variantsDangerMediumClass = `${variantsBaseClass} h-10 px-4 py-2 text-sm border-red-600 bg-red-600 text-red-50`
const variantsDisabledClass = `${variantsBaseClass} h-10 px-4 py-2 text-sm border-blue-600 bg-blue-500 text-blue-50 opacity-50 cursor-not-allowed`
const variantsComposeClass = `${variantsBaseClass} shadow-md h-10 px-4 py-2 text-sm border-emerald-600 bg-emerald-600 text-emerald-50`

const joinBaseClass =
    "inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
const joinFocusedClass = `${joinBaseClass} outline-2`

const defDefaultClass =
    "font-semibold inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
const defDangerClass =
    "font-semibold inline-flex items-center rounded-md border border-red-600 bg-red-50 px-3 py-2 text-sm text-red-900"

const mergePropsDefaultClass =
    "rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm"
const mergePropsDenseInfoClass =
    "rounded-md border border-sky-600 bg-sky-50 px-3 py-2 text-sm text-sky-900 shadow-sm"

const mergeRecordDefaultClass =
    "rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm data-open:bg-violet-50 aria-checked:border-violet-600"
const mergeRecordOpenClass =
    "rounded-md border border-violet-500 bg-violet-100 px-4 py-3 text-sm text-violet-900 shadow-sm data-open:bg-violet-50 aria-checked:border-violet-600"

const requiredNestedCandidates = [
    "hover:bg-slate-100",
    "focus:ring-2",
    "dark:bg-slate-900",
    "dark:text-white",
    "dark:hover:bg-slate-800",
    "dark:hover:focus:ring-sky-300",
    "data-open:bg-blue-600",
    "data-open:text-white",
    "hover:border-cyan-500",
    "focus:text-sky-600",
    "data-open:bg-violet-50",
    "aria-checked:border-violet-600",
]

const raw = (...parts: string[]) => parts.join("-")

export const requiredExcludedCandidates = [
    raw("bg", "slate", "100"),
    raw("ring", "2"),
    raw("bg", "slate", "900"),
    raw("text", "white"),
    raw("bg", "slate", "800"),
    raw("ring", "sky", "300"),
    raw("bg", "blue", "600"),
    raw("bg", "violet", "50"),
    raw("border", "violet", "600"),
] as const

export const zeroRuntimeForbiddenTokens = [
    "createTools",
    "PrimitiveStyler",
    "ToggleStyler",
    "RotaryStyler",
    "VariantsStyler",
    "Styler.deepMerge",
    "flattenStyleRecord",
    "toClass",
    "toDef",
] as const

export const expectedDesignSystemCases = {
    "button.style.class": {
        api: "style.class",
        section: "Button",
        tokenGroup: "button-style",
        staticClass: styleClass,
        dynamicStates: {
            closed: styleClass,
            open: styleClass,
        },
        candidates: [
            "bg-slate-50",
            "border-slate-300",
            ...requiredNestedCandidates,
        ],
        excludedCandidates: [...requiredExcludedCandidates],
        computed: [
            "backgroundColor",
            "borderColor",
            "color",
            "paddingLeft",
            "paddingRight",
        ],
    },
    "form.style.style": {
        api: "style.style",
        section: "Form Elements",
        tokenGroup: "form-style-object",
        staticClass: styleStyleClass,
        staticStyle: {
            display: "inline-flex",
            borderColor: "border-slate-300",
            focus: {
                borderColor: "border-sky-500",
                ring: "ring-2",
            },
        },
        dynamicStates: {
            default: styleStyleClass,
            focus: styleStyleClass,
        },
        candidates: ["focus:border-sky-500", "focus:ring-2"],
        excludedCandidates: [raw("border", "sky", "500"), raw("ring", "2")],
        computed: ["borderColor", "outlineStyle", "paddingLeft"],
    },
    "card.style.compose": {
        api: "style.compose",
        section: "Composite Cards",
        tokenGroup: "card-style-compose",
        staticClass: styleComposeClass,
        dynamicStates: {
            base: styleComposeClass,
            peer: styleComposeClass,
        },
        candidates: [
            "bg-indigo-50",
            "border-indigo-300",
            "shadow-md",
            "hover:border-cyan-500",
            "focus:text-sky-600",
        ],
        excludedCandidates: [
            raw("border", "cyan", "500"),
            raw("text", "sky", "600"),
        ],
        computed: ["backgroundColor", "borderColor", "color"],
    },
    "toggle.toggle.class": {
        api: "toggle.class",
        section: "Toggle",
        tokenGroup: "toggle-class",
        staticClass: toggleOffClass,
        dynamicStates: {
            off: toggleOffClass,
            on: toggleOnClass,
        },
        candidates: ["bg-slate-200", "bg-emerald-500", "border-emerald-500"],
        excludedCandidates: [],
        computed: ["backgroundColor", "borderColor", "width", "height"],
    },
    "checkbox.toggle.style": {
        api: "toggle.style",
        section: "Checkbox",
        tokenGroup: "checkbox-toggle-style",
        staticClass:
            "inline-flex h-5 w-5 items-center justify-center rounded border border-slate-400 bg-white aria-checked:bg-emerald-600 aria-checked:border-emerald-600 focus:ring-2",
        staticStyle: {
            width: "w-5",
            height: "h-5",
            "aria-checked": {
                backgroundColor: "bg-emerald-600",
                borderColor: "border-emerald-600",
            },
        },
        dynamicStates: {
            unchecked:
                "inline-flex h-5 w-5 items-center justify-center rounded border border-slate-400 bg-white aria-checked:bg-emerald-600 aria-checked:border-emerald-600 focus:ring-2",
            checked:
                "inline-flex h-5 w-5 items-center justify-center rounded border border-slate-400 bg-white aria-checked:bg-emerald-600 aria-checked:border-emerald-600 focus:ring-2",
        },
        candidates: [
            "aria-checked:bg-emerald-600",
            "aria-checked:border-emerald-600",
            "focus:ring-2",
        ],
        excludedCandidates: [raw("ring", "2")],
        computed: ["backgroundColor", "borderColor", "width", "height"],
    },
    "toggle.toggle.compose": {
        api: "toggle.compose",
        section: "Toggle",
        tokenGroup: "toggle-compose",
        staticClass: toggleComposeOffClass,
        dynamicStates: {
            off: toggleComposeOffClass,
            on: toggleComposeOnClass,
        },
        candidates: ["shadow-sm", "bg-slate-200", "bg-emerald-500"],
        excludedCandidates: [],
        computed: ["backgroundColor", "borderColor", "width", "height"],
    },
    "button.rotary.class": {
        api: "rotary.class",
        section: "Button",
        tokenGroup: "button-rotary",
        staticClass: rotaryMediumClass,
        dynamicStates: {
            tiny: rotaryTinyClass,
            medium: rotaryMediumClass,
            giant: rotaryGiantClass,
        },
        candidates: ["h-7", "h-10", "h-14", "px-2", "px-4", "px-7"],
        excludedCandidates: [],
        computed: ["width", "height", "paddingLeft", "paddingRight"],
    },
    "radio.rotary.style": {
        api: "rotary.style",
        section: "Radio Button",
        tokenGroup: "radio-rotary-style",
        staticClass:
            "inline-flex h-6 w-6 items-center justify-center rounded-full border border-blue-600 bg-blue-50 text-blue-900",
        staticStyle: {
            width: "w-6",
            height: "h-6",
            borderColor: "border-blue-600",
        },
        dynamicStates: {
            primary:
                "inline-flex h-6 w-6 items-center justify-center rounded-full border border-blue-600 bg-blue-50 text-blue-900",
            danger: "inline-flex h-6 w-6 items-center justify-center rounded-full border border-red-600 bg-red-50 text-red-900",
        },
        candidates: [
            "border-blue-600",
            "bg-blue-50",
            "border-red-600",
            "bg-red-50",
        ],
        excludedCandidates: [],
        computed: ["backgroundColor", "borderColor", "width", "height"],
    },
    "card.rotary.compose": {
        api: "rotary.compose",
        section: "Composite Cards",
        tokenGroup: "card-rotary-compose",
        staticClass: rotaryComposeMediumClass,
        dynamicStates: {
            medium: rotaryComposeMediumClass,
            giant: `${rotaryBaseClass} shadow-md h-14 px-7 py-4 text-lg`,
        },
        candidates: ["shadow-md", "h-14", "px-7"],
        excludedCandidates: [],
        computed: ["height", "paddingLeft", "paddingRight"],
    },
    "button.variants.class": {
        api: "variants.class",
        section: "Button",
        tokenGroup: "button-variants",
        staticClass: variantsPrimaryMediumClass,
        dynamicStates: {
            primary: variantsPrimaryMediumClass,
            danger: variantsDangerMediumClass,
            disabled: variantsDisabledClass,
        },
        candidates: [
            "bg-blue-500",
            "text-blue-50",
            "bg-red-600",
            "text-red-50",
            "opacity-50",
            "cursor-not-allowed",
        ],
        excludedCandidates: [],
        computed: [
            "backgroundColor",
            "borderColor",
            "color",
            "opacity",
            "cursor",
        ],
    },
    "form.variants.style": {
        api: "variants.style",
        section: "Form Elements",
        tokenGroup: "form-variants-style",
        staticClass:
            "w-full rounded-md border border-emerald-600 bg-emerald-50 px-3 py-2 text-sm text-emerald-900",
        staticStyle: {
            borderColor: "border-emerald-600",
            backgroundColor: "bg-emerald-50",
        },
        dynamicStates: {
            success:
                "w-full rounded-md border border-emerald-600 bg-emerald-50 px-3 py-2 text-sm text-emerald-900",
            warning:
                "w-full rounded-md border border-amber-600 bg-amber-50 px-3 py-2 text-sm text-amber-900",
        },
        candidates: ["border-emerald-600", "bg-emerald-50", "border-amber-600"],
        excludedCandidates: [],
        computed: ["backgroundColor", "borderColor", "color"],
    },
    "card.variants.compose": {
        api: "variants.compose",
        section: "Composite Cards",
        tokenGroup: "card-variants-compose",
        staticClass: variantsComposeClass,
        dynamicStates: {
            success: variantsComposeClass,
            danger: `${variantsBaseClass} shadow-md h-10 px-4 py-2 text-sm border-red-600 bg-red-600 text-red-50`,
        },
        candidates: ["shadow-md", "bg-emerald-600", "bg-red-600"],
        excludedCandidates: [],
        computed: ["backgroundColor", "borderColor", "color"],
    },
    "form.join": {
        api: "join",
        section: "Form Elements",
        tokenGroup: "join",
        staticClass: joinBaseClass,
        dynamicStates: {
            rest: joinBaseClass,
            focused: joinFocusedClass,
        },
        candidates: ["outline-2", "border-slate-300", "text-slate-800"],
        excludedCandidates: [],
        computed: ["borderColor", "outlineStyle", "paddingLeft"],
    },
    "form.def": {
        api: "def",
        section: "Form Elements",
        tokenGroup: "def",
        staticClass: defDefaultClass,
        dynamicStates: {
            default: defDefaultClass,
            danger: defDangerClass,
        },
        candidates: ["font-semibold", "border-red-600", "bg-red-50"],
        excludedCandidates: [],
        computed: ["backgroundColor", "borderColor", "color"],
    },
    "card.mergeProps": {
        api: "mergeProps",
        section: "Composite Cards",
        tokenGroup: "merge-props",
        staticClass: mergePropsDefaultClass,
        dynamicStates: {
            default: mergePropsDefaultClass,
            denseInfo: mergePropsDenseInfoClass,
        },
        candidates: ["bg-sky-50", "border-sky-600", "px-3", "py-2"],
        excludedCandidates: [],
        computed: ["backgroundColor", "borderColor", "paddingLeft"],
    },
    "card.mergeRecord": {
        api: "mergeRecord",
        section: "Composite Cards",
        tokenGroup: "merge-record",
        staticClass: mergeRecordDefaultClass,
        staticStyle: {
            borderColor: "border-slate-300",
            "data-open": {
                backgroundColor: "bg-violet-50",
            },
        },
        dynamicStates: {
            default: mergeRecordDefaultClass,
            open: mergeRecordOpenClass,
        },
        candidates: [
            "bg-violet-100",
            "border-violet-500",
            "data-open:bg-violet-50",
            "aria-checked:border-violet-600",
        ],
        excludedCandidates: [
            raw("bg", "violet", "50"),
            raw("border", "violet", "600"),
        ],
        computed: ["backgroundColor", "borderColor", "color"],
    },
} as const satisfies Record<string, DesignSystemExpectation>

export type DesignSystemCaseId = keyof typeof expectedDesignSystemCases

export const allExpectedCandidates = Array.from(
    new Set(
        Object.values(expectedDesignSystemCases).flatMap(
            (item) => item.candidates
        )
    )
).sort()

export const allExpectedExcludedCandidates = Array.from(
    new Set(
        Object.values(expectedDesignSystemCases).flatMap(
            (item) => item.excludedCandidates
        )
    )
).sort()

export const expectedSectionNames = [
    "Button",
    "Form Elements",
    "Checkbox",
    "Radio Button",
    "Toggle",
    "Composite Cards",
    "Debug Matrix",
] as const
