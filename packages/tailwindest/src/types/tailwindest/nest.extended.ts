import type {
    GetNestExtendedStyleSheet,
    TAILWIND_EXTENDED_NEST_CONDITION,
} from "./core"

type TailwindestExtendedNestStyleSheet<
    AllNestConditions extends string,
    Tailwind,
    ExtendedNestCondition extends TAILWIND_EXTENDED_NEST_CONDITION,
    Identifier extends string,
> = GetNestExtendedStyleSheet<
    AllNestConditions,
    Tailwind,
    ExtendedNestCondition,
    Identifier
>

interface TailwindestGroup<
    AllNestConditions extends string,
    Tailwind,
    Identifier extends string,
> {
    /**
     *@description Styling based on parent state
     *@description `group-{pseudo-class}`
     *@see {@link https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state group}
     */
    group?: TailwindestExtendedNestStyleSheet<
        AllNestConditions,
        Tailwind,
        "group",
        Identifier
    >
}
interface TailwindestPeer<
    AllNestConditions extends string,
    Tailwind,
    Identifier extends string,
> {
    /**
     *@description Styling based on sibling state
     *@description `peer-{pseudo-class}`
     *@see {@link https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-sibling-state peer}
     */
    peer?: TailwindestExtendedNestStyleSheet<
        AllNestConditions,
        Tailwind,
        "peer",
        Identifier
    >
}
export interface TailwindestExtendedNest<
    Nest extends string,
    Tailwind,
    Identifier extends string,
> extends TailwindestGroup<Nest, Tailwind, Identifier>,
        TailwindestPeer<Nest, Tailwind, Identifier> {}
