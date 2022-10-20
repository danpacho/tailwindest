import type { NestStyle, TailwindestGetNest } from "./@nest.core"

type TailwindestPickNest<Style, Condition extends string> = {
    [ShouldbeOnlyOneKey in Condition]?: TailwindestGetNest<Style, Condition>
}

export type TailwindestNest<
    Tailwind,
    Condition extends string
> = TailwindestPickNest<NestStyle<Tailwind, Condition>, Condition>

type TailwindestSm<Tailwind> = TailwindestNest<Tailwind, "@sm">
type TailwindestMd<Tailwind> = TailwindestNest<Tailwind, "@md">
type TailwindestLg<Tailwind> = TailwindestNest<Tailwind, "@lg">
type TailwindestXl<Tailwind> = TailwindestNest<Tailwind, "@xl">
type Tailwindest2Xl<Tailwind> = TailwindestNest<Tailwind, "@2xl">
interface TailwindestSizeCondition<Tailwind>
    extends TailwindestSm<Tailwind>,
        TailwindestMd<Tailwind>,
        TailwindestLg<Tailwind>,
        TailwindestXl<Tailwind>,
        Tailwindest2Xl<Tailwind> {}

type TailwindestDark<Tailwind> = TailwindestNest<Tailwind, "@dark">
type TailwindestContrastMore<Tailwind> = TailwindestNest<
    Tailwind,
    "@contrast-more"
>
type TailwindestContrassLess<Tailwind> = TailwindestNest<
    Tailwind,
    "@contrast-less"
>
type TailwindestMotionReduce<Tailwind> = TailwindestNest<
    Tailwind,
    "@motion-reduce"
>
type TailwindestMotionSafe<Tailwind> = TailwindestNest<Tailwind, "@motion-safe">
type TailwindestPortrait<Tailwind> = TailwindestNest<Tailwind, "@portrait">
type TailwindestLandscape<Tailwind> = TailwindestNest<Tailwind, "@landscape">
type TailwindestPrint<Tailwind> = TailwindestNest<Tailwind, "@print">

type TailwindestLTR<Tailwind> = TailwindestNest<Tailwind, "@ltr">
type TailwindestRTL<Tailwind> = TailwindestNest<Tailwind, "@rtl">
interface TailwindestMedia<Tailwind>
    extends TailwindestDark<Tailwind>,
        TailwindestRTL<Tailwind>,
        TailwindestLTR<Tailwind>,
        TailwindestPrint<Tailwind>,
        TailwindestPortrait<Tailwind>,
        TailwindestLandscape<Tailwind>,
        TailwindestMotionSafe<Tailwind>,
        TailwindestContrastMore<Tailwind>,
        TailwindestContrassLess<Tailwind>,
        TailwindestMotionReduce<Tailwind> {}

type TailwindestBefore<Tailwind> = TailwindestNest<Tailwind, "::before">
type TailwindestAfter<Tailwind> = TailwindestNest<Tailwind, "::after">
type TailwindestPlaceholder<Tailwind> = TailwindestNest<
    Tailwind,
    "::placeholder"
>
type TailwindestFile<Tailwind> = TailwindestNest<Tailwind, "::file">
type TailwindestMarker<Tailwind> = TailwindestNest<Tailwind, "::marker">
type TailwindestSelection<Tailwind> = TailwindestNest<Tailwind, "::selection">
type TailwindestFirstLine<Tailwind> = TailwindestNest<Tailwind, "::first-line">
type TailwindestFirstLetter<Tailwind> = TailwindestNest<
    Tailwind,
    "::first-letter"
>
interface TailwindestPseudoElements<Tailwind>
    extends TailwindestBefore<Tailwind>,
        TailwindestFile<Tailwind>,
        TailwindestAfter<Tailwind>,
        TailwindestMarker<Tailwind>,
        TailwindestSelection<Tailwind>,
        TailwindestFirstLine<Tailwind>,
        TailwindestFirstLetter<Tailwind>,
        TailwindestPlaceholder<Tailwind> {}

type TailwindestBackdrop<Tailwind> = TailwindestNest<Tailwind, ":backdrop">
type TailwindestHover<Tailwind> = TailwindestNest<Tailwind, ":hover">
type TailwindestActive<Tailwind> = TailwindestNest<Tailwind, ":active">
type TailwindestFirst<Tailwind> = TailwindestNest<Tailwind, ":first">
type TailwindestLast<Tailwind> = TailwindestNest<Tailwind, ":last">
type TailwindestOnly<Tailwind> = TailwindestNest<Tailwind, ":only">
type TailwindestOdd<Tailwind> = TailwindestNest<Tailwind, ":odd">
type TailwindestEven<Tailwind> = TailwindestNest<Tailwind, ":even">
type TailwindestFirstOfType<Tailwind> = TailwindestNest<
    Tailwind,
    ":first-of-type"
>
type TailwindestLastOfType<Tailwind> = TailwindestNest<
    Tailwind,
    ":last-of-type"
>
type TailwindestOnlyOfType<Tailwind> = TailwindestNest<
    Tailwind,
    ":only-of-type"
>
type TailwindestEmpty<Tailwind> = TailwindestNest<Tailwind, ":empty">
type TailwindestEnabled<Tailwind> = TailwindestNest<Tailwind, ":enabled">
type TailwindestIndeterminate<Tailwind> = TailwindestNest<
    Tailwind,
    ":indeterminate"
>
type TailwindestDefault<Tailwind> = TailwindestNest<Tailwind, ":default">
type TailwindestRequired<Tailwind> = TailwindestNest<Tailwind, ":required">
type TailwindestValid<Tailwind> = TailwindestNest<Tailwind, ":valid">
type TailwindestInvalid<Tailwind> = TailwindestNest<Tailwind, ":invalid">
type TailwindestInRange<Tailwind> = TailwindestNest<Tailwind, ":in-range">
type TailwindestOutOfRange<Tailwind> = TailwindestNest<
    Tailwind,
    ":out-of-range"
>
type TailwindestPlaceholderShown<Tailwind> = TailwindestNest<
    Tailwind,
    ":placeholder-shown"
>
type TailwindestAutofill<Tailwind> = TailwindestNest<Tailwind, ":autofill">
type TailwindestReadonly<Tailwind> = TailwindestNest<Tailwind, ":read-only">
type TailwindestChecked<Tailwind> = TailwindestNest<Tailwind, ":checked">
type TailwindestDisabled<Tailwind> = TailwindestNest<Tailwind, ":disabled">
type TailwindestVisited<Tailwind> = TailwindestNest<Tailwind, ":visited">
type TailwindestTarget<Tailwind> = TailwindestNest<Tailwind, ":target">
type TailwindestFocus<Tailwind> = TailwindestNest<Tailwind, ":focus">
type TailwindestFocusWithin<Tailwind> = TailwindestNest<
    Tailwind,
    ":focus-within"
>
type TailwindestFocusVisible<Tailwind> = TailwindestNest<
    Tailwind,
    ":focus-visible"
>
interface TailwindestPseudoClass<Tailwind>
    extends TailwindestLast<Tailwind>,
        TailwindestOnly<Tailwind>,
        TailwindestOdd<Tailwind>,
        TailwindestEven<Tailwind>,
        TailwindestFirst<Tailwind>,
        TailwindestEmpty<Tailwind>,
        TailwindestValid<Tailwind>,
        TailwindestFocus<Tailwind>,
        TailwindestHover<Tailwind>,
        TailwindestActive<Tailwind>,
        TailwindestTarget<Tailwind>,
        TailwindestChecked<Tailwind>,
        TailwindestVisited<Tailwind>,
        TailwindestInvalid<Tailwind>,
        TailwindestInRange<Tailwind>,
        TailwindestEnabled<Tailwind>,
        TailwindestDefault<Tailwind>,
        TailwindestRequired<Tailwind>,
        TailwindestAutofill<Tailwind>,
        TailwindestBackdrop<Tailwind>,
        TailwindestReadonly<Tailwind>,
        TailwindestDisabled<Tailwind>,
        TailwindestOutOfRange<Tailwind>,
        TailwindestLastOfType<Tailwind>,
        TailwindestOnlyOfType<Tailwind>,
        TailwindestFirstOfType<Tailwind>,
        TailwindestFocusWithin<Tailwind>,
        TailwindestFocusVisible<Tailwind>,
        TailwindestIndeterminate<Tailwind>,
        TailwindestPlaceholderShown<Tailwind> {}

export interface TailwindestNestBasic<Tailwind>
    extends TailwindestMedia<Tailwind>,
        TailwindestPseudoClass<Tailwind>,
        TailwindestSizeCondition<Tailwind>,
        TailwindestPseudoElements<Tailwind> {}
