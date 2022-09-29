import { TailwindContentType } from "./@content"
import { TailwindFontFamilyType } from "./@font.family"
import { TailwindFontSizeType } from "./@font.size"
import { TailwindFontSmoothingType } from "./@font.smoothing"
import { TailwindFontStyleType } from "./@font.style"
import { TailwindFontVariantNumericType } from "./@font.variant.numeric"
import { TailwindFontWeightType } from "./@font.weight"
import { TailwindLetterSpacingType } from "./@letter.spacing"
import { TailwindLineHeightType } from "./@line.height"
import { TailwindListStylePositionType } from "./@list.style.position"
import { TailwindListStyleTypeType } from "./@list.style.type"
import { TailwindTextAlignType } from "./@text.align"
import { TailwindTextColorType } from "./@text.color"
import { TailwindTextDecorationType } from "./@text.decoration"
import { TailwindTextDecorationColorType } from "./@text.decoration.color"
import { TailwindTextDecorationStyleType } from "./@text.decoration.style"
import { TailwindTextDecorationThicknessType } from "./@text.decoration.thickness"
import { TailwindTextIndentType } from "./@text.indent"
import { TailwindTextOverflowType } from "./@text.overflow"
import { TailwindTextTransformType } from "./@text.transform"
import { TailwindTextUnderlineOffsetType } from "./@text.underline.offset"

export interface TailwindFont
    extends TailwindContentType,
        TailwindFontFamilyType,
        TailwindFontSizeType,
        TailwindFontSmoothingType,
        TailwindFontStyleType,
        TailwindFontVariantNumericType,
        TailwindFontWeightType,
        TailwindLetterSpacingType,
        TailwindLineHeightType,
        TailwindListStylePositionType,
        TailwindListStyleTypeType,
        TailwindTextAlignType,
        TailwindTextColorType,
        TailwindTextDecorationType,
        TailwindTextDecorationColorType,
        TailwindTextDecorationStyleType,
        TailwindTextDecorationThicknessType,
        TailwindTextIndentType,
        TailwindTextOverflowType,
        TailwindTextTransformType,
        TailwindTextUnderlineOffsetType {}
