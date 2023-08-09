import { Pluggable } from "../../plugin"
import { TailwindAppearanceType } from "../@appearance"
import { TailwindCursorType } from "../@cursor"
import { TailwindPointerEventsType } from "../@pointer.events"
import { TailwindResizeType } from "../@resize"
import { TailwindScrollBehaviorType } from "../@scroll.behavior"
import { TailwindScrollSnapAlignType } from "../@scroll.snap.align"
import { TailwindScrollSnapStopType } from "../@scroll.snap.stop"
import { TailwindScrollSnapTypeType } from "../@scroll.snap.type"
import { TailwindTouchActionType } from "../@touch.action"
import { TailwindUserSelectType } from "../@user.select"
import { TailwindWillChangeType } from "../@will.change"
import { ShortTailwindAccentColorType } from "./@accent.color.short"
import { ShortTailwindCaretColorType } from "./@caret.color.short"
import { ShortTailwindScrollMarginType } from "./@scroll.margin.short"
import { ShortTailwindScrollPaddingType } from "./@scroll.padding.short"

export interface ShortTailwindInteractivity<
    TailwindColor extends string,
    TailwindSpacing extends string,
    InteractivityPlug extends {
        cursor?: string
        willChange?: string
        caretColor?: string
        accentColor?: string
        scrollMargin?: string
        scrollPadding?: string
    } = {
        cursor: ""
        willChange: ""
        caretColor: ""
        accentColor: ""
        scrollMargin: ""
        scrollPadding: ""
    },
> extends TailwindResizeType,
        TailwindUserSelectType,
        TailwindAppearanceType,
        TailwindTouchActionType,
        TailwindPointerEventsType,
        TailwindScrollBehaviorType,
        TailwindScrollSnapTypeType,
        TailwindScrollSnapStopType,
        TailwindScrollSnapAlignType,
        TailwindCursorType<InteractivityPlug["cursor"]>,
        TailwindWillChangeType<InteractivityPlug["willChange"]>,
        ShortTailwindCaretColorType<
            TailwindColor,
            InteractivityPlug["caretColor"]
        >,
        ShortTailwindScrollPaddingType<
            TailwindSpacing | Pluggable<InteractivityPlug["scrollPadding"]>
        >,
        ShortTailwindScrollMarginType<
            TailwindSpacing | Pluggable<InteractivityPlug["scrollMargin"]>
        >,
        ShortTailwindAccentColorType<
            TailwindColor,
            InteractivityPlug["accentColor"]
        > {}
