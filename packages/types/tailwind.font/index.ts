import { TailwindContentType } from "./@content"
import { TailwindFontFamilyType } from "./@font.family"
import { TailwindFontSizeType } from "./@font.size"
import { TailwindFontSmoothingType } from "./@font.smoothing"
import { TailwindFontStyleType } from "./@font.style"
import { TailwindFontVariantNumericType } from "./@font.variant.numeric"
import { TailwindFontWeightType } from "./@font.weight"
import { TailwindLetterSpacingType } from "./@letter.spacing"
import { TailwindLineClampType } from "./@line.clamp"
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

export interface TailwindFont<
    TailwindColor extends string,
    FontPlug extends {
        content?: string
        fontFamily?: string
        fontSize?: string
        fontWeight?: string
        textColor?: string
        textIndent?: string
        textDecorationColor?: string
        textDecorationThickness?: string
        textUnderlineOffset?: string
        letterSpacing?: string
        lineHeight?: string
        lineClamp?: string
        listStyleType?: string
    } = {
        content: ""
        fontFamily: ""
        fontSize: ""
        fontWeight: ""
        textColor: ""
        textIndent: ""
        textDecorationColor: ""
        textDecorationThickness: ""
        textUnderlineOffset: ""
        letterSpacing: ""
        lineHeight: ""
        lineClamp: ""
        listStyleType: ""
    }
> extends TailwindTextAlignType,
        TailwindTextOverflowType,
        TailwindTextTransformType,
        TailwindTextDecorationType,
        TailwindTextDecorationStyleType,
        TailwindFontStyleType,
        TailwindFontSmoothingType,
        TailwindFontVariantNumericType,
        TailwindContentType<FontPlug["content"]>,
        TailwindFontSizeType<FontPlug["fontSize"]>,
        TailwindFontWeightType<FontPlug["fontSize"]>,
        TailwindFontFamilyType<FontPlug["fontFamily"]>,
        TailwindTextColorType<TailwindColor, FontPlug["textColor"]>,
        TailwindTextIndentType<TailwindColor, FontPlug["textIndent"]>,
        TailwindTextDecorationColorType<
            TailwindColor,
            FontPlug["textDecorationColor"]
        >,
        TailwindTextDecorationThicknessType<
            FontPlug["textDecorationThickness"]
        >,
        TailwindTextUnderlineOffsetType<FontPlug["textUnderlineOffset"]>,
        TailwindLetterSpacingType<FontPlug["letterSpacing"]>,
        TailwindListStyleTypeType<FontPlug["listStyleType"]>,
        TailwindLineHeightType<FontPlug["lineHeight"]>,
        TailwindLineClampType<FontPlug["lineClamp"]>,
        TailwindListStylePositionType {}
