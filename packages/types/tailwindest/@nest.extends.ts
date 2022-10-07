import type {
    NestStyle,
    RemoveIdentifier,
    TAILWINDEST_NEST_IDENTFIER,
    TailwindNest,
    TailwindestGetNestWithTitle,
} from "./@nest.core"

type TailwindestPickNestWithTitle<
    Style,
    Condition extends string,
    Title extends string
> = {
    [ShouldbeOnlyOneKey in Condition]: TailwindestGetNestWithTitle<
        Style,
        "",
        `${Title}-${RemoveIdentifier<Condition, TAILWINDEST_NEST_IDENTFIER>}`
    >
}

type TailwindestNestWithTitle<
    Title extends "group" | "peer",
    Condition extends string
> = TailwindestPickNestWithTitle<
    NestStyle<
        TailwindNest,
        `${Title}-${RemoveIdentifier<Condition, TAILWINDEST_NEST_IDENTFIER>}`
    >,
    Condition,
    Title
>

type TailwindestGroupBackdrop = TailwindestNestWithTitle<"group", ":backdrop">
type TailwindestGroupHover = TailwindestNestWithTitle<"group", ":hover">
type TailwindestGroupActive = TailwindestNestWithTitle<"group", ":active">
type TailwindestGroupFirst = TailwindestNestWithTitle<"group", ":first">
type TailwindestGroupLast = TailwindestNestWithTitle<"group", ":last">
type TailwindestGroupOnly = TailwindestNestWithTitle<"group", ":only">
type TailwindestGroupOdd = TailwindestNestWithTitle<"group", ":odd">
type TailwindestGroupEven = TailwindestNestWithTitle<"group", ":even">
type TailwindestGroupFirstOfType = TailwindestNestWithTitle<
    "group",
    ":first-of-type"
>
type TailwindestGroupLastOfType = TailwindestNestWithTitle<
    "group",
    ":last-of-type"
>
type TailwindestGroupOnlyOfType = TailwindestNestWithTitle<
    "group",
    ":only-of-type"
>
type TailwindestGroupEmpty = TailwindestNestWithTitle<"group", ":empty">
type TailwindestGroupEnabled = TailwindestNestWithTitle<"group", ":enabled">
type TailwindestGroupIndeterminate = TailwindestNestWithTitle<
    "group",
    ":indeterminate"
>
type TailwindestGroupDefault = TailwindestNestWithTitle<"group", ":default">
type TailwindestGroupRequired = TailwindestNestWithTitle<"group", ":required">
type TailwindestGroupValid = TailwindestNestWithTitle<"group", ":valid">
type TailwindestGroupInvalid = TailwindestNestWithTitle<"group", ":invalid">
type TailwindestGroupInRange = TailwindestNestWithTitle<"group", ":in-range">
type TailwindestGroupOutOfRange = TailwindestNestWithTitle<
    "group",
    ":out-of-range"
>
type TailwindestGroupPlaceholderShown = TailwindestNestWithTitle<
    "group",
    ":placeholder-shown"
>
type TailwindestGroupAutofill = TailwindestNestWithTitle<"group", ":autofill">
type TailwindestGroupReadonly = TailwindestNestWithTitle<"group", ":read-only">
type TailwindestGroupChecked = TailwindestNestWithTitle<"group", ":checked">
type TailwindestGroupDisabled = TailwindestNestWithTitle<"group", ":disabled">
type TailwindestGroupVisited = TailwindestNestWithTitle<"group", ":visited">
type TailwindestGroupTarget = TailwindestNestWithTitle<"group", ":target">
type TailwindestGroupFocus = TailwindestNestWithTitle<"group", ":focus">
type TailwindestGroupFocusWithin = TailwindestNestWithTitle<
    "group",
    ":focus-within"
>
type TailwindestGroupFocustVisible = TailwindestNestWithTitle<
    "group",
    ":focus-visible"
>

interface TailwindestGroupPseudoClass
    extends TailwindestGroupBackdrop,
        TailwindestGroupHover,
        TailwindestGroupActive,
        TailwindestGroupFirst,
        TailwindestGroupLast,
        TailwindestGroupOnly,
        TailwindestGroupOdd,
        TailwindestGroupEven,
        TailwindestGroupFirstOfType,
        TailwindestGroupLastOfType,
        TailwindestGroupOnlyOfType,
        TailwindestGroupEmpty,
        TailwindestGroupEnabled,
        TailwindestGroupIndeterminate,
        TailwindestGroupDefault,
        TailwindestGroupRequired,
        TailwindestGroupValid,
        TailwindestGroupInvalid,
        TailwindestGroupInRange,
        TailwindestGroupOutOfRange,
        TailwindestGroupPlaceholderShown,
        TailwindestGroupAutofill,
        TailwindestGroupReadonly,
        TailwindestGroupChecked,
        TailwindestGroupDisabled,
        TailwindestGroupVisited,
        TailwindestGroupTarget,
        TailwindestGroupFocus,
        TailwindestGroupFocusWithin,
        TailwindestGroupFocustVisible {}
type TailwindestPeerBackdrop = TailwindestNestWithTitle<"peer", ":backdrop">
type TailwindestPeerHover = TailwindestNestWithTitle<"peer", ":hover">
type TailwindestPeerActive = TailwindestNestWithTitle<"peer", ":active">
type TailwindestPeerFirst = TailwindestNestWithTitle<"peer", ":first">
type TailwindestPeerLast = TailwindestNestWithTitle<"peer", ":last">
type TailwindestPeerOnly = TailwindestNestWithTitle<"peer", ":only">
type TailwindestPeerOdd = TailwindestNestWithTitle<"peer", ":odd">
type TailwindestPeerEven = TailwindestNestWithTitle<"peer", ":even">
type TailwindestPeerFirstOfType = TailwindestNestWithTitle<
    "peer",
    ":first-of-type"
>
type TailwindestPeerLastOfType = TailwindestNestWithTitle<
    "peer",
    ":last-of-type"
>
type TailwindestPeerOnlyOfType = TailwindestNestWithTitle<
    "peer",
    ":only-of-type"
>
type TailwindestPeerEmpty = TailwindestNestWithTitle<"peer", ":empty">
type TailwindestPeerEnabled = TailwindestNestWithTitle<"peer", ":enabled">
type TailwindestPeerIndeterminate = TailwindestNestWithTitle<
    "peer",
    ":indeterminate"
>
type TailwindestPeerDefault = TailwindestNestWithTitle<"peer", ":default">
type TailwindestPeerRequired = TailwindestNestWithTitle<"peer", ":required">
type TailwindestPeerValid = TailwindestNestWithTitle<"peer", ":valid">
type TailwindestPeerInvalid = TailwindestNestWithTitle<"peer", ":invalid">
type TailwindestPeerInRange = TailwindestNestWithTitle<"peer", ":in-range">
type TailwindestPeerOutOfRange = TailwindestNestWithTitle<
    "peer",
    ":out-of-range"
>
type TailwindestPeerPlaceholderShown = TailwindestNestWithTitle<
    "peer",
    ":placeholder-shown"
>
type TailwindestPeerAutofill = TailwindestNestWithTitle<"peer", ":autofill">
type TailwindestPeerReadonly = TailwindestNestWithTitle<"peer", ":read-only">
type TailwindestPeerChecked = TailwindestNestWithTitle<"peer", ":checked">
type TailwindestPeerDisabled = TailwindestNestWithTitle<"peer", ":disabled">
type TailwindestPeerVisited = TailwindestNestWithTitle<"peer", ":visited">
type TailwindestPeerTarget = TailwindestNestWithTitle<"peer", ":target">
type TailwindestPeerFocus = TailwindestNestWithTitle<"peer", ":focus">
type TailwindestPeerFocusWithin = TailwindestNestWithTitle<
    "peer",
    ":focus-within"
>
type TailwindestPeerFocustVisible = TailwindestNestWithTitle<
    "peer",
    ":focus-visible"
>
interface TailwindestPeerPseudoClass
    extends TailwindestPeerBackdrop,
        TailwindestPeerHover,
        TailwindestPeerActive,
        TailwindestPeerFirst,
        TailwindestPeerLast,
        TailwindestPeerOnly,
        TailwindestPeerOdd,
        TailwindestPeerEven,
        TailwindestPeerFirstOfType,
        TailwindestPeerLastOfType,
        TailwindestPeerOnlyOfType,
        TailwindestPeerEmpty,
        TailwindestPeerEnabled,
        TailwindestPeerIndeterminate,
        TailwindestPeerDefault,
        TailwindestPeerRequired,
        TailwindestPeerValid,
        TailwindestPeerInvalid,
        TailwindestPeerInRange,
        TailwindestPeerOutOfRange,
        TailwindestPeerPlaceholderShown,
        TailwindestPeerAutofill,
        TailwindestPeerReadonly,
        TailwindestPeerChecked,
        TailwindestPeerDisabled,
        TailwindestPeerVisited,
        TailwindestPeerTarget,
        TailwindestPeerFocus,
        TailwindestPeerFocusWithin,
        TailwindestPeerFocustVisible {}

type TailwindestGroup = {
    /**
     *@note Styling based on parent state (`group-{pseudo-class}`)
     *@docs [group](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state)
     */
    "@group": TailwindestGroupPseudoClass
}

type TailwindestPeer = {
    /**
     *@note Styling based on sibling state (`peer-{pseudo-class}`)
     *@docs [peer](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-sibling-state)
     */
    "@peer": TailwindestPeerPseudoClass
}

export interface TailwindestNestExtends
    extends TailwindestGroup,
        TailwindestPeer {}
