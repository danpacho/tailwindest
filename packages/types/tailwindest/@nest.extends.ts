import type {
    NestStyle,
    RemoveIdentifier,
    TAILWINDEST_NEST_IDENTFIER,
    TailwindestGetNestWithTitle,
} from "./@nest.core"

type TailwindestPickNestWithTitle<
    Style,
    Title extends string,
    Condition extends string
> = {
    [ShouldbeOnlyOneKey in Condition]?: TailwindestGetNestWithTitle<
        Style,
        "",
        `${Title}-${RemoveIdentifier<Condition, TAILWINDEST_NEST_IDENTFIER>}`
    >
}

type TailwindestNestWithTitle<
    Style,
    Title extends "group" | "peer",
    Condition extends string
> = TailwindestPickNestWithTitle<
    NestStyle<
        Style,
        `${Title}-${RemoveIdentifier<Condition, TAILWINDEST_NEST_IDENTFIER>}`
    >,
    Title,
    Condition
>

type TailwindestGroupBackdrop<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":backdrop"
>
type TailwindestGroupHover<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":hover"
>
type TailwindestGroupActive<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":active"
>
type TailwindestGroupFirst<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":first"
>
type TailwindestGroupLast<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":last"
>
type TailwindestGroupOnly<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":only"
>
type TailwindestGroupOdd<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":odd"
>
type TailwindestGroupEven<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":even"
>
type TailwindestGroupFirstOfType<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":first-of-type"
>
type TailwindestGroupLastOfType<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":last-of-type"
>
type TailwindestGroupOnlyOfType<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":only-of-type"
>
type TailwindestGroupEmpty<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":empty"
>
type TailwindestGroupEnabled<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":enabled"
>
type TailwindestGroupIndeterminate<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":indeterminate"
>
type TailwindestGroupDefault<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":default"
>
type TailwindestGroupRequired<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":required"
>
type TailwindestGroupValid<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":valid"
>
type TailwindestGroupInvalid<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":invalid"
>
type TailwindestGroupInRange<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":in-range"
>
type TailwindestGroupOutOfRange<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":out-of-range"
>
type TailwindestGroupPlaceholderShown<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":placeholder-shown"
>
type TailwindestGroupAutofill<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":autofill"
>
type TailwindestGroupReadonly<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":read-only"
>
type TailwindestGroupChecked<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":checked"
>
type TailwindestGroupDisabled<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":disabled"
>
type TailwindestGroupVisited<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":visited"
>
type TailwindestGroupTarget<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":target"
>
type TailwindestGroupFocus<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":focus"
>
type TailwindestGroupFocusWithin<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":focus-within"
>
type TailwindestGroupFocustVisible<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "group",
    ":focus-visible"
>

interface TailwindestGroupPseudoClass<Tailwind>
    extends TailwindestGroupOdd<Tailwind>,
        TailwindestGroupLast<Tailwind>,
        TailwindestGroupOnly<Tailwind>,
        TailwindestGroupEven<Tailwind>,
        TailwindestGroupFirst<Tailwind>,
        TailwindestGroupHover<Tailwind>,
        TailwindestGroupEmpty<Tailwind>,
        TailwindestGroupValid<Tailwind>,
        TailwindestGroupFocus<Tailwind>,
        TailwindestGroupActive<Tailwind>,
        TailwindestGroupTarget<Tailwind>,
        TailwindestGroupEnabled<Tailwind>,
        TailwindestGroupInRange<Tailwind>,
        TailwindestGroupVisited<Tailwind>,
        TailwindestGroupChecked<Tailwind>,
        TailwindestGroupInvalid<Tailwind>,
        TailwindestGroupDefault<Tailwind>,
        TailwindestGroupAutofill<Tailwind>,
        TailwindestGroupBackdrop<Tailwind>,
        TailwindestGroupRequired<Tailwind>,
        TailwindestGroupDisabled<Tailwind>,
        TailwindestGroupReadonly<Tailwind>,
        TailwindestGroupOutOfRange<Tailwind>,
        TailwindestGroupLastOfType<Tailwind>,
        TailwindestGroupOnlyOfType<Tailwind>,
        TailwindestGroupFirstOfType<Tailwind>,
        TailwindestGroupFocusWithin<Tailwind>,
        TailwindestGroupIndeterminate<Tailwind>,
        TailwindestGroupFocustVisible<Tailwind>,
        TailwindestGroupPlaceholderShown<Tailwind> {}

type TailwindestPeerBackdrop<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":backdrop"
>
type TailwindestPeerHover<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":hover"
>
type TailwindestPeerActive<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":active"
>
type TailwindestPeerFirst<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":first"
>
type TailwindestPeerLast<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":last"
>
type TailwindestPeerOnly<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":only"
>
type TailwindestPeerOdd<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":odd"
>
type TailwindestPeerEven<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":even"
>
type TailwindestPeerFirstOfType<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":first-of-type"
>
type TailwindestPeerLastOfType<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":last-of-type"
>
type TailwindestPeerOnlyOfType<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":only-of-type"
>
type TailwindestPeerEmpty<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":empty"
>
type TailwindestPeerEnabled<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":enabled"
>
type TailwindestPeerIndeterminate<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":indeterminate"
>
type TailwindestPeerDefault<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":default"
>
type TailwindestPeerRequired<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":required"
>
type TailwindestPeerValid<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":valid"
>
type TailwindestPeerInvalid<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":invalid"
>
type TailwindestPeerInRange<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":in-range"
>
type TailwindestPeerOutOfRange<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":out-of-range"
>
type TailwindestPeerPlaceholderShown<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":placeholder-shown"
>
type TailwindestPeerAutofill<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":autofill"
>
type TailwindestPeerReadonly<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":read-only"
>
type TailwindestPeerChecked<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":checked"
>
type TailwindestPeerDisabled<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":disabled"
>
type TailwindestPeerVisited<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":visited"
>
type TailwindestPeerTarget<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":target"
>
type TailwindestPeerFocus<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":focus"
>
type TailwindestPeerFocusWithin<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":focus-within"
>
type TailwindestPeerFocustVisible<Tailwind> = TailwindestNestWithTitle<
    Tailwind,
    "peer",
    ":focus-visible"
>
interface TailwindestPeerPseudoClass<Tailwind>
    extends TailwindestPeerOdd<Tailwind>,
        TailwindestPeerLast<Tailwind>,
        TailwindestPeerOnly<Tailwind>,
        TailwindestPeerEven<Tailwind>,
        TailwindestPeerFirst<Tailwind>,
        TailwindestPeerEmpty<Tailwind>,
        TailwindestPeerHover<Tailwind>,
        TailwindestPeerFocus<Tailwind>,
        TailwindestPeerValid<Tailwind>,
        TailwindestPeerActive<Tailwind>,
        TailwindestPeerTarget<Tailwind>,
        TailwindestPeerChecked<Tailwind>,
        TailwindestPeerVisited<Tailwind>,
        TailwindestPeerInvalid<Tailwind>,
        TailwindestPeerInRange<Tailwind>,
        TailwindestPeerEnabled<Tailwind>,
        TailwindestPeerDefault<Tailwind>,
        TailwindestPeerDisabled<Tailwind>,
        TailwindestPeerBackdrop<Tailwind>,
        TailwindestPeerAutofill<Tailwind>,
        TailwindestPeerReadonly<Tailwind>,
        TailwindestPeerRequired<Tailwind>,
        TailwindestPeerOutOfRange<Tailwind>,
        TailwindestPeerLastOfType<Tailwind>,
        TailwindestPeerOnlyOfType<Tailwind>,
        TailwindestPeerFirstOfType<Tailwind>,
        TailwindestPeerFocusWithin<Tailwind>,
        TailwindestPeerIndeterminate<Tailwind>,
        TailwindestPeerFocustVisible<Tailwind>,
        TailwindestPeerPlaceholderShown<Tailwind> {}

type TailwindestGroup<Tailwind> = {
    /**
     *@note Styling based on parent state (`group-{pseudo-class}`)
     *@docs [group](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state)
     */
    "@group"?: TailwindestGroupPseudoClass<Tailwind>
}

type TailwindestPeer<Tailwind> = {
    /**
     *@note Styling based on sibling state (`peer-{pseudo-class}`)
     *@docs [peer](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-sibling-state)
     */
    "@peer"?: TailwindestPeerPseudoClass<Tailwind>
}

export interface TailwindestNestExtends<Tailwind>
    extends TailwindestGroup<Tailwind>,
        TailwindestPeer<Tailwind> {}
