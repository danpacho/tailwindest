import type { GetNestStyle, TailwindestGetNest } from "./@nest.core"

type TailwindestPickNest<NestStyle, OneNestCondition extends string> = {
    [ShouldBeOnlyOneKey in OneNestCondition]?: TailwindestGetNest<
        NestStyle,
        OneNestCondition
    >
}

export type TailwindestNest<
    Nest extends string,
    Tailwind,
    OneNestCondition extends string,
> = TailwindestPickNest<
    GetNestStyle<Nest, Tailwind, OneNestCondition>,
    OneNestCondition
>

type TailwindestSm<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@sm"
>
type TailwindestMaxSm<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@max-sm"
>
type TailwindestMd<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@md"
>
type TailwindestMaxMd<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@max-md"
>
type TailwindestLg<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@lg"
>
type TailwindestMaxLg<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@max-lg"
>
type TailwindestXl<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@xl"
>
type TailwindestMaxXl<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@max-xl"
>
type Tailwindest2Xl<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@2xl"
>
type TailwindestMax2Xl<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@max-2xl"
>
interface TailwindestSizeCondition<Nest extends string, Tailwind>
    extends TailwindestSm<Nest, Tailwind>,
        TailwindestMd<Nest, Tailwind>,
        TailwindestLg<Nest, Tailwind>,
        TailwindestXl<Nest, Tailwind>,
        Tailwindest2Xl<Nest, Tailwind>,
        TailwindestMaxSm<Nest, Tailwind>,
        TailwindestMaxMd<Nest, Tailwind>,
        TailwindestMaxLg<Nest, Tailwind>,
        TailwindestMaxXl<Nest, Tailwind>,
        TailwindestMax2Xl<Nest, Tailwind> {}

type TailwindestDark<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@dark"
>
type TailwindestContrastMore<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@contrast-more"
>
type TailwindestContrastLess<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@contrast-less"
>
type TailwindestMotionReduce<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@motion-reduce"
>
type TailwindestMotionSafe<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@motion-safe"
>
type TailwindestPortrait<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@portrait"
>
type TailwindestLandscape<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@landscape"
>
type TailwindestPrint<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@print"
>

type TailwindestLTR<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@ltr"
>
type TailwindestRTL<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "@rtl"
>
interface TailwindestMedia<Nest extends string, Tailwind>
    extends TailwindestDark<Nest, Tailwind>,
        TailwindestRTL<Nest, Tailwind>,
        TailwindestLTR<Nest, Tailwind>,
        TailwindestPrint<Nest, Tailwind>,
        TailwindestPortrait<Nest, Tailwind>,
        TailwindestLandscape<Nest, Tailwind>,
        TailwindestMotionSafe<Nest, Tailwind>,
        TailwindestContrastMore<Nest, Tailwind>,
        TailwindestContrastLess<Nest, Tailwind>,
        TailwindestMotionReduce<Nest, Tailwind> {}

type TailwindestBefore<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "::before"
>
type TailwindestAfter<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "::after"
>
type TailwindestPlaceholder<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "::placeholder"
>
type TailwindestFile<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "::file"
>
type TailwindestMarker<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "::marker"
>
type TailwindestSelection<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "::selection"
>
type TailwindestFirstLine<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "::first-line"
>
type TailwindestFirstLetter<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "::first-letter"
>
type TailwindestBackdrop<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    "::backdrop"
>
interface TailwindestPseudoElements<Nest extends string, Tailwind>
    extends TailwindestBefore<Nest, Tailwind>,
        TailwindestFile<Nest, Tailwind>,
        TailwindestAfter<Nest, Tailwind>,
        TailwindestMarker<Nest, Tailwind>,
        TailwindestBackdrop<Nest, Tailwind>,
        TailwindestSelection<Nest, Tailwind>,
        TailwindestFirstLine<Nest, Tailwind>,
        TailwindestFirstLetter<Nest, Tailwind>,
        TailwindestPlaceholder<Nest, Tailwind> {}

type TailwindestHover<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":hover"
>
type TailwindestActive<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":active"
>
type TailwindestFirst<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":first"
>
type TailwindestLast<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":last"
>
type TailwindestOnly<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":only"
>
type TailwindestOdd<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":odd"
>
type TailwindestEven<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":even"
>
type TailwindestFirstOfType<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":first-of-type"
>
type TailwindestLastOfType<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":last-of-type"
>
type TailwindestOnlyOfType<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":only-of-type"
>
type TailwindestEmpty<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":empty"
>
type TailwindestEnabled<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":enabled"
>
type TailwindestIndeterminate<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":indeterminate"
>
type TailwindestDefault<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":default"
>
type TailwindestRequired<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":required"
>
type TailwindestValid<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":valid"
>
type TailwindestInvalid<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":invalid"
>
type TailwindestInRange<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":in-range"
>
type TailwindestOutOfRange<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":out-of-range"
>
type TailwindestPlaceholderShown<
    Nest extends string,
    Tailwind,
> = TailwindestNest<Nest, Tailwind, ":placeholder-shown">
type TailwindestAutofill<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":autofill"
>
type TailwindestReadonly<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":read-only"
>
type TailwindestChecked<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":checked"
>
type TailwindestDisabled<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":disabled"
>
type TailwindestVisited<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":visited"
>
type TailwindestTarget<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":target"
>
type TailwindestFocus<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":focus"
>
type TailwindestFocusWithin<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":focus-within"
>
type TailwindestFocusVisible<Nest extends string, Tailwind> = TailwindestNest<
    Nest,
    Tailwind,
    ":focus-visible"
>
interface TailwindestPseudoClass<Nest extends string, Tailwind>
    extends TailwindestLast<Nest, Tailwind>,
        TailwindestOnly<Nest, Tailwind>,
        TailwindestOdd<Nest, Tailwind>,
        TailwindestEven<Nest, Tailwind>,
        TailwindestFirst<Nest, Tailwind>,
        TailwindestEmpty<Nest, Tailwind>,
        TailwindestValid<Nest, Tailwind>,
        TailwindestFocus<Nest, Tailwind>,
        TailwindestHover<Nest, Tailwind>,
        TailwindestActive<Nest, Tailwind>,
        TailwindestTarget<Nest, Tailwind>,
        TailwindestChecked<Nest, Tailwind>,
        TailwindestVisited<Nest, Tailwind>,
        TailwindestInvalid<Nest, Tailwind>,
        TailwindestInRange<Nest, Tailwind>,
        TailwindestEnabled<Nest, Tailwind>,
        TailwindestDefault<Nest, Tailwind>,
        TailwindestRequired<Nest, Tailwind>,
        TailwindestAutofill<Nest, Tailwind>,
        TailwindestReadonly<Nest, Tailwind>,
        TailwindestDisabled<Nest, Tailwind>,
        TailwindestOutOfRange<Nest, Tailwind>,
        TailwindestLastOfType<Nest, Tailwind>,
        TailwindestOnlyOfType<Nest, Tailwind>,
        TailwindestFirstOfType<Nest, Tailwind>,
        TailwindestFocusWithin<Nest, Tailwind>,
        TailwindestFocusVisible<Nest, Tailwind>,
        TailwindestIndeterminate<Nest, Tailwind>,
        TailwindestPlaceholderShown<Nest, Tailwind> {}

export interface TailwindestNestBasic<Nest extends string, Tailwind>
    extends TailwindestMedia<Nest, Tailwind>,
        TailwindestPseudoClass<Nest, Tailwind>,
        TailwindestSizeCondition<Nest, Tailwind>,
        TailwindestPseudoElements<Nest, Tailwind> {}
