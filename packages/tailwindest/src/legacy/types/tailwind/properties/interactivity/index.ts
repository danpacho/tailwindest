import { Pluggable } from "../../../plugin"
import { TailwindAccentColorType } from "./@accent.color"
import { TailwindAppearanceType } from "./@appearance"
import { TailwindCaretColorType } from "./@caret.color"
import { TailwindCursorType } from "./@cursor"
import { TailwindPointerEventsType } from "./@pointer.events"
import { TailwindResizeType } from "./@resize"
import { TailwindScrollBehaviorType } from "./@scroll.behavior"
import { TailwindScrollMarginType } from "./@scroll.margin"
import { TailwindScrollPaddingType } from "./@scroll.padding"
import { TailwindScrollSnapAlignType } from "./@scroll.snap.align"
import { TailwindScrollSnapStopType } from "./@scroll.snap.stop"
import { TailwindScrollSnapTypeType } from "./@scroll.snap.type"
import { TailwindTouchActionType } from "./@touch.action"
import { TailwindUserSelectType } from "./@user.select"
import { TailwindWillChangeType } from "./@will.change"

export interface TailwindInteractivityPlug {
    cursor?: string
    willChange?: string
    caretColor?: string
    accentColor?: string
    scrollMargin?: string
    scrollPadding?: string
}

export interface TailwindInteractivity<
    TailwindColor extends string,
    TailwindSpacing extends string,
    InteractivityPlug extends TailwindInteractivityPlug = {
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
        TailwindCaretColorType<TailwindColor, InteractivityPlug["caretColor"]>,
        TailwindScrollPaddingType<
            TailwindSpacing | Pluggable<InteractivityPlug["scrollPadding"]>
        >,
        TailwindScrollMarginType<
            TailwindSpacing | Pluggable<InteractivityPlug["scrollMargin"]>
        >,
        TailwindAccentColorType<
            TailwindColor,
            InteractivityPlug["accentColor"]
        > {}
