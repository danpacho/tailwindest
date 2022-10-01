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
import { TailwindUserSlectType } from "./@user.slect"
import { TailwindWillChangeType } from "./@will.change"

export interface TailwindInteractivity
    extends TailwindAccentColorType,
        TailwindAppearanceType,
        TailwindCaretColorType,
        TailwindCursorType,
        TailwindPointerEventsType,
        TailwindResizeType,
        TailwindScrollBehaviorType,
        TailwindScrollMarginType,
        TailwindScrollPaddingType,
        TailwindScrollSnapAlignType,
        TailwindScrollSnapStopType,
        TailwindScrollSnapTypeType,
        TailwindTouchActionType,
        TailwindUserSlectType,
        TailwindWillChangeType {}
