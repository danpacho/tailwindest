import type { NestStyle, TailwindNest, TailwindestGetNest } from "./@nest.core"

type TailwindestPickNest<Style, Condition extends string> = {
    [ShouldbeOnlyOneKey in Condition]: TailwindestGetNest<Style, Condition>
}

type TailwindestNest<Condition extends string> = TailwindestPickNest<
    NestStyle<TailwindNest, Condition>,
    Condition
>

type TailwindestSm = TailwindestNest<"@sm">
type TailwindestMd = TailwindestNest<"@md">
type TailwindestLg = TailwindestNest<"@lg">
type TailwindestXl = TailwindestNest<"@xl">
type Tailwindest2Xl = TailwindestNest<"@2xl">
interface TailwindestSizeCondition
    extends TailwindestSm,
        TailwindestMd,
        TailwindestLg,
        TailwindestXl,
        Tailwindest2Xl {}

type TailwindestDark = TailwindestNest<"@dark">
type TailwindestContrastMore = TailwindestNest<"@contrast-more">
type TailwindestContrassLess = TailwindestNest<"@contrast-less">
type TailwindestMotionReduce = TailwindestNest<"@motion-reduce">
type TailwindestMotionSafe = TailwindestNest<"@motion-safe">
type TailwindestPortrait = TailwindestNest<"@portrait">
type TailwindestLandscape = TailwindestNest<"@landscape">
type TailwindestPrint = TailwindestNest<"@print">

type TailwindestLTR = TailwindestNest<"@ltr">
type TailwindestRTL = TailwindestNest<"@rtl">
interface TailwindestMedia
    extends TailwindestDark,
        TailwindestContrastMore,
        TailwindestContrassLess,
        TailwindestMotionReduce,
        TailwindestMotionSafe,
        TailwindestPortrait,
        TailwindestPrint,
        TailwindestLandscape,
        TailwindestRTL,
        TailwindestLTR {}

type TailwindestBefore = TailwindestNest<"::before">
type TailwindestAfter = TailwindestNest<"::after">
type TailwindestPlaceholder = TailwindestNest<"::placeholder">
type TailwindestFile = TailwindestNest<"::file">
type TailwindestMarker = TailwindestNest<"::marker">
type TailwindestSelection = TailwindestNest<"::selection">
type TailwindestFirstLine = TailwindestNest<"::first-line">
type TailwindestFirstLetter = TailwindestNest<"::first-letter">
interface TailwindestPseudoElements
    extends TailwindestBefore,
        TailwindestAfter,
        TailwindestPlaceholder,
        TailwindestFile,
        TailwindestMarker,
        TailwindestSelection,
        TailwindestFirstLine,
        TailwindestFirstLetter {}

type TailwindestBackdrop = TailwindestNest<":backdrop">
type TailwindestHover = TailwindestNest<":hover">
type TailwindestActive = TailwindestNest<":active">
type TailwindestFirst = TailwindestNest<":first">
type TailwindestLast = TailwindestNest<":last">
type TailwindestOnly = TailwindestNest<":only">
type TailwindestOdd = TailwindestNest<":odd">
type TailwindestEven = TailwindestNest<":even">
type TailwindestFirstOfType = TailwindestNest<":first-of-type">
type TailwindestLastOfType = TailwindestNest<":last-of-type">
type TailwindestOnlyOfType = TailwindestNest<":only-of-type">
type TailwindestEmpty = TailwindestNest<":empty">
type TailwindestEnabled = TailwindestNest<":enabled">
type TailwindestIndeterminate = TailwindestNest<":indeterminate">
type TailwindestDefault = TailwindestNest<":default">
type TailwindestRequired = TailwindestNest<":required">
type TailwindestValid = TailwindestNest<":valid">
type TailwindestInvalid = TailwindestNest<":invalid">
type TailwindestInRange = TailwindestNest<":in-range">
type TailwindestOutOfRange = TailwindestNest<":out-of-range">
type TailwindestPlaceholderShown = TailwindestNest<":placeholder-shown">
type TailwindestAutofill = TailwindestNest<":autofill">
type TailwindestReadonly = TailwindestNest<":read-only">
type TailwindestChecked = TailwindestNest<":checked">
type TailwindestDisabled = TailwindestNest<":disabled">
type TailwindestVisited = TailwindestNest<":visited">
type TailwindestTarget = TailwindestNest<":target">
type TailwindestFocus = TailwindestNest<":focus">
type TailwindestFocusWithin = TailwindestNest<":focus-within">
type TailwindestFocustVisible = TailwindestNest<":focus-visible">
interface TailwindestPseudoClass
    extends TailwindestBackdrop,
        TailwindestHover,
        TailwindestActive,
        TailwindestFirst,
        TailwindestLast,
        TailwindestOnly,
        TailwindestOdd,
        TailwindestEven,
        TailwindestFirstOfType,
        TailwindestLastOfType,
        TailwindestOnlyOfType,
        TailwindestEmpty,
        TailwindestEnabled,
        TailwindestIndeterminate,
        TailwindestDefault,
        TailwindestRequired,
        TailwindestValid,
        TailwindestInvalid,
        TailwindestInRange,
        TailwindestOutOfRange,
        TailwindestPlaceholderShown,
        TailwindestAutofill,
        TailwindestReadonly,
        TailwindestChecked,
        TailwindestDisabled,
        TailwindestVisited,
        TailwindestTarget,
        TailwindestFocus,
        TailwindestFocusWithin,
        TailwindestFocustVisible {}

export interface TailwindestNestBasic
    extends TailwindestSizeCondition,
        TailwindestMedia,
        TailwindestPseudoElements,
        TailwindestPseudoClass {}
