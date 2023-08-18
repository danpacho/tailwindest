import type { GetNestStyleSheet, RemoveIdentifier } from "./@nest.core"

type DASH_IDENTIFIER = "-"

type TailwindestExtendedNestStyleSheet<
    AllNestConditions extends string,
    Tailwind,
    ExtendedNestCondition extends "group" | "peer" | "aria",
    OnlyOneNestCondition extends string,
> = {
    [ShouldBeOnlyOneKey in OnlyOneNestCondition]?: GetNestStyleSheet<
        AllNestConditions,
        Tailwind,
        `${ExtendedNestCondition}${DASH_IDENTIFIER}${RemoveIdentifier<OnlyOneNestCondition>}`
    >
}

type TailwindestGroupBackdrop<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", "::backdrop">
type TailwindestGroupHover<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":hover">
type TailwindestGroupActive<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":active">
type TailwindestGroupFirst<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":first">
type TailwindestGroupLast<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":last">
type TailwindestGroupOnly<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":only">
type TailwindestGroupOdd<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":odd">
type TailwindestGroupEven<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":even">
type TailwindestGroupFirstOfType<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":first-of-type">
type TailwindestGroupLastOfType<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":last-of-type">
type TailwindestGroupOnlyOfType<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":only-of-type">
type TailwindestGroupEmpty<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":empty">
type TailwindestGroupEnabled<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":enabled">
type TailwindestGroupIndeterminate<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":indeterminate">
type TailwindestGroupDefault<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":default">
type TailwindestGroupRequired<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":required">
type TailwindestGroupOptional<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":optional">
type TailwindestGroupValid<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":valid">
type TailwindestGroupInvalid<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":invalid">
type TailwindestGroupInRange<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":in-range">
type TailwindestGroupOutOfRange<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":out-of-range">
type TailwindestGroupPlaceholderShown<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<
    Nest,
    Tailwind,
    "group",
    ":placeholder-shown"
>
type TailwindestGroupAutofill<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":autofill">
type TailwindestGroupReadonly<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":read-only">
type TailwindestGroupChecked<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":checked">
type TailwindestGroupDisabled<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":disabled">
type TailwindestGroupVisited<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":visited">
type TailwindestGroupTarget<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":target">
type TailwindestGroupFocus<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":focus">
type TailwindestGroupFocusWithin<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":focus-within">
type TailwindestGroupFocusVisible<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "group", ":focus-visible">

interface TailwindestGroupPseudoClass<Nest extends string, Tailwind>
    extends TailwindestGroupOdd<Nest, Tailwind>,
        TailwindestGroupLast<Nest, Tailwind>,
        TailwindestGroupOnly<Nest, Tailwind>,
        TailwindestGroupEven<Nest, Tailwind>,
        TailwindestGroupFirst<Nest, Tailwind>,
        TailwindestGroupHover<Nest, Tailwind>,
        TailwindestGroupEmpty<Nest, Tailwind>,
        TailwindestGroupValid<Nest, Tailwind>,
        TailwindestGroupFocus<Nest, Tailwind>,
        TailwindestGroupActive<Nest, Tailwind>,
        TailwindestGroupTarget<Nest, Tailwind>,
        TailwindestGroupEnabled<Nest, Tailwind>,
        TailwindestGroupInRange<Nest, Tailwind>,
        TailwindestGroupVisited<Nest, Tailwind>,
        TailwindestGroupChecked<Nest, Tailwind>,
        TailwindestGroupInvalid<Nest, Tailwind>,
        TailwindestGroupDefault<Nest, Tailwind>,
        TailwindestGroupAutofill<Nest, Tailwind>,
        TailwindestGroupBackdrop<Nest, Tailwind>,
        TailwindestGroupRequired<Nest, Tailwind>,
        TailwindestGroupOptional<Nest, Tailwind>,
        TailwindestGroupDisabled<Nest, Tailwind>,
        TailwindestGroupReadonly<Nest, Tailwind>,
        TailwindestGroupOutOfRange<Nest, Tailwind>,
        TailwindestGroupLastOfType<Nest, Tailwind>,
        TailwindestGroupOnlyOfType<Nest, Tailwind>,
        TailwindestGroupFirstOfType<Nest, Tailwind>,
        TailwindestGroupFocusWithin<Nest, Tailwind>,
        TailwindestGroupIndeterminate<Nest, Tailwind>,
        TailwindestGroupFocusVisible<Nest, Tailwind>,
        TailwindestGroupPlaceholderShown<Nest, Tailwind> {}

type TailwindestPeerBackdrop<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", "::backdrop">
type TailwindestPeerHover<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":hover">
type TailwindestPeerActive<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":active">
type TailwindestPeerFirst<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":first">
type TailwindestPeerLast<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":last">
type TailwindestPeerOnly<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":only">
type TailwindestPeerOdd<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":odd">
type TailwindestPeerEven<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":even">
type TailwindestPeerFirstOfType<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":first-of-type">
type TailwindestPeerLastOfType<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":last-of-type">
type TailwindestPeerOnlyOfType<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":only-of-type">
type TailwindestPeerEmpty<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":empty">
type TailwindestPeerEnabled<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":enabled">
type TailwindestPeerIndeterminate<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":indeterminate">
type TailwindestPeerDefault<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":default">
type TailwindestPeerRequired<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":required">
type TailwindestPeerOptional<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":optional">
type TailwindestPeerValid<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":valid">
type TailwindestPeerInvalid<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":invalid">
type TailwindestPeerInRange<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":in-range">
type TailwindestPeerOutOfRange<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":out-of-range">
type TailwindestPeerPlaceholderShown<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<
    Nest,
    Tailwind,
    "peer",
    ":placeholder-shown"
>
type TailwindestPeerAutofill<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":autofill">
type TailwindestPeerReadonly<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":read-only">
type TailwindestPeerChecked<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":checked">
type TailwindestPeerDisabled<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":disabled">
type TailwindestPeerVisited<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":visited">
type TailwindestPeerTarget<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":target">
type TailwindestPeerFocus<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":focus">
type TailwindestPeerFocusWithin<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":focus-within">
type TailwindestPeerFocusVisible<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "peer", ":focus-visible">

interface TailwindestPeerPseudoClass<Nest extends string, Tailwind>
    extends TailwindestPeerOdd<Nest, Tailwind>,
        TailwindestPeerLast<Nest, Tailwind>,
        TailwindestPeerOnly<Nest, Tailwind>,
        TailwindestPeerEven<Nest, Tailwind>,
        TailwindestPeerFirst<Nest, Tailwind>,
        TailwindestPeerEmpty<Nest, Tailwind>,
        TailwindestPeerHover<Nest, Tailwind>,
        TailwindestPeerFocus<Nest, Tailwind>,
        TailwindestPeerValid<Nest, Tailwind>,
        TailwindestPeerActive<Nest, Tailwind>,
        TailwindestPeerTarget<Nest, Tailwind>,
        TailwindestPeerChecked<Nest, Tailwind>,
        TailwindestPeerVisited<Nest, Tailwind>,
        TailwindestPeerInvalid<Nest, Tailwind>,
        TailwindestPeerInRange<Nest, Tailwind>,
        TailwindestPeerEnabled<Nest, Tailwind>,
        TailwindestPeerDefault<Nest, Tailwind>,
        TailwindestPeerDisabled<Nest, Tailwind>,
        TailwindestPeerBackdrop<Nest, Tailwind>,
        TailwindestPeerAutofill<Nest, Tailwind>,
        TailwindestPeerReadonly<Nest, Tailwind>,
        TailwindestPeerOptional<Nest, Tailwind>,
        TailwindestPeerRequired<Nest, Tailwind>,
        TailwindestPeerOutOfRange<Nest, Tailwind>,
        TailwindestPeerLastOfType<Nest, Tailwind>,
        TailwindestPeerOnlyOfType<Nest, Tailwind>,
        TailwindestPeerFirstOfType<Nest, Tailwind>,
        TailwindestPeerFocusWithin<Nest, Tailwind>,
        TailwindestPeerIndeterminate<Nest, Tailwind>,
        TailwindestPeerFocusVisible<Nest, Tailwind>,
        TailwindestPeerPlaceholderShown<Nest, Tailwind> {}

type TailwindestAriaChecked<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "aria", ":checked">
type TailwindestAriaDisabled<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "aria", ":disabled">
type TailwindestAriaExpanded<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "aria", ":expanded">
type TailwindestAriaHidden<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "aria", ":hidden">
type TailwindestAriaPressed<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "aria", ":pressed">
type TailwindestAriaReadonly<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "aria", ":readonly">
type TailwindestAriaRequired<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "aria", ":required">
type TailwindestAriaSelected<
    Nest extends string,
    Tailwind,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "aria", ":selected">

interface TailwindestAriaClass<Nest extends string, Tailwind>
    extends TailwindestAriaChecked<Nest, Tailwind>,
        TailwindestAriaDisabled<Nest, Tailwind>,
        TailwindestAriaExpanded<Nest, Tailwind>,
        TailwindestAriaHidden<Nest, Tailwind>,
        TailwindestAriaPressed<Nest, Tailwind>,
        TailwindestAriaReadonly<Nest, Tailwind>,
        TailwindestAriaRequired<Nest, Tailwind>,
        TailwindestAriaSelected<Nest, Tailwind> {}

export interface TailwindestAria<
    Nest extends string,
    Tailwind,
    TailwindestAriaCustom,
> {
    /**
     *@description Conditional styling based on `aria-*`
     *@description `aria-{attributes}`
     *@see {@link https://tailwindcss.com/docs/hover-focus-and-other-states#aria-states aria states}
     */
    "@aria"?: TailwindestAriaClass<Nest, Tailwind> & TailwindestAriaCustom
}
export type TailwindestAriaCustom<
    Nest extends string,
    Tailwind,
    CustomAria extends string,
> = TailwindestExtendedNestStyleSheet<Nest, Tailwind, "aria", CustomAria>

interface TailwindestGroup<Nest extends string, Tailwind> {
    /**
     *@description Styling based on parent state
     *@description `group-{pseudo-class}`
     *@see {@link https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state group}
     */
    "@group"?: TailwindestGroupPseudoClass<Nest, Tailwind>
}

interface TailwindestPeer<Nest extends string, Tailwind> {
    /**
     *@description Styling based on sibling state
     *@description `peer-{pseudo-class}`
     *@see {@link https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-sibling-state peer}
     */
    "@peer"?: TailwindestPeerPseudoClass<Nest, Tailwind>
}

export interface TailwindestNestExtends<Nest extends string, Tailwind>
    extends TailwindestGroup<Nest, Tailwind>,
        TailwindestPeer<Nest, Tailwind> {}
