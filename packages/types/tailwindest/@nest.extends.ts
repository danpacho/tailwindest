import type {
    GetNestStyle,
    RemoveIdentifier,
    TailwindestGetNest,
} from "./@nest.core"

type DASH_IDENTIFIER = "-"

type TailwindestPickNestWithTitle<
    NestStyle,
    DashNestCondition extends string,
    OneNestCondition extends string
> = {
    [ShouldBeOnlyOneKey in OneNestCondition]?: TailwindestGetNest<
        NestStyle,
        `${DashNestCondition}${DASH_IDENTIFIER}${RemoveIdentifier<OneNestCondition>}`
    >
}

type TailwindestNestWithTitle<
    Nest extends string,
    Tailwind,
    DashNestCondition extends "group" | "peer",
    Condition extends string
> = TailwindestPickNestWithTitle<
    GetNestStyle<
        Nest,
        Tailwind,
        `${DashNestCondition}${DASH_IDENTIFIER}${RemoveIdentifier<Condition>}`
    >,
    DashNestCondition,
    Condition
>

type TailwindestGroupBackdrop<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":backdrop">
type TailwindestGroupHover<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":hover">
type TailwindestGroupActive<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":active">
type TailwindestGroupFirst<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":first">
type TailwindestGroupLast<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":last">
type TailwindestGroupOnly<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":only">
type TailwindestGroupOdd<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":odd">
type TailwindestGroupEven<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":even">
type TailwindestGroupFirstOfType<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":first-of-type">
type TailwindestGroupLastOfType<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":last-of-type">
type TailwindestGroupOnlyOfType<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":only-of-type">
type TailwindestGroupEmpty<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":empty">
type TailwindestGroupEnabled<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":enabled">
type TailwindestGroupIndeterminate<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":indeterminate">
type TailwindestGroupDefault<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":default">
type TailwindestGroupRequired<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":required">
type TailwindestGroupOptional<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":optional">
type TailwindestGroupValid<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":valid">
type TailwindestGroupInvalid<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":invalid">
type TailwindestGroupInRange<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":in-range">
type TailwindestGroupOutOfRange<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":out-of-range">
type TailwindestGroupPlaceholderShown<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":placeholder-shown">
type TailwindestGroupAutofill<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":autofill">
type TailwindestGroupReadonly<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":read-only">
type TailwindestGroupChecked<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":checked">
type TailwindestGroupDisabled<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":disabled">
type TailwindestGroupVisited<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":visited">
type TailwindestGroupTarget<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":target">
type TailwindestGroupFocus<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":focus">
type TailwindestGroupFocusWithin<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":focus-within">
type TailwindestGroupFocusVisible<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "group", ":focus-visible">

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
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":backdrop">
type TailwindestPeerHover<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":hover">
type TailwindestPeerActive<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":active">
type TailwindestPeerFirst<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":first">
type TailwindestPeerLast<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":last">
type TailwindestPeerOnly<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":only">
type TailwindestPeerOdd<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":odd">
type TailwindestPeerEven<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":even">
type TailwindestPeerFirstOfType<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":first-of-type">
type TailwindestPeerLastOfType<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":last-of-type">
type TailwindestPeerOnlyOfType<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":only-of-type">
type TailwindestPeerEmpty<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":empty">
type TailwindestPeerEnabled<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":enabled">
type TailwindestPeerIndeterminate<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":indeterminate">
type TailwindestPeerDefault<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":default">
type TailwindestPeerRequired<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":required">
type TailwindestPeerOptional<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":optional">
type TailwindestPeerValid<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":valid">
type TailwindestPeerInvalid<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":invalid">
type TailwindestPeerInRange<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":in-range">
type TailwindestPeerOutOfRange<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":out-of-range">
type TailwindestPeerPlaceholderShown<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":placeholder-shown">
type TailwindestPeerAutofill<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":autofill">
type TailwindestPeerReadonly<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":read-only">
type TailwindestPeerChecked<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":checked">
type TailwindestPeerDisabled<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":disabled">
type TailwindestPeerVisited<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":visited">
type TailwindestPeerTarget<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":target">
type TailwindestPeerFocus<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":focus">
type TailwindestPeerFocusWithin<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":focus-within">
type TailwindestPeerFocusVisible<
    Nest extends string,
    Tailwind
> = TailwindestNestWithTitle<Nest, Tailwind, "peer", ":focus-visible">

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

type TailwindestGroup<Nest extends string, Tailwind> = {
    /**
     *@description Styling based on parent state
     *@description `group-{pseudo-class}`
     *@see {@link https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state group}
     */
    "@group"?: TailwindestGroupPseudoClass<Nest, Tailwind>
}

type TailwindestPeer<Nest extends string, Tailwind> = {
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
