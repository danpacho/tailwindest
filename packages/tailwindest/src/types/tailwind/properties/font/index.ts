import { TailwindContentType } from "./@content"
import { TailwindFontFamilyType } from "./@font.family"
import { TailwindFontSizeType } from "./@font.size"
import { TailwindFontSmoothingType } from "./@font.smoothing"
import { TailwindFontStyleType } from "./@font.style"
import { TailwindFontVariantNumericType } from "./@font.variant.numeric"
import { TailwindFontWeightType } from "./@font.weight"
import { TailwindHyphensType } from "./@hyphens"
import { TailwindLetterSpacingType } from "./@letter.spacing"
import { TailwindLineClampType } from "./@line.clamp"
import { TailwindLineHeightType } from "./@line.height"
import { TailwindListStyleImageType } from "./@list.style.image"
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
import { TailwindWhitespaceType } from "./@whitespace"

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
        listStyleImage?: string
        hyphens?: string
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
        listStyleImage: ""
        hyphens: ""
    },
> extends TailwindTextAlignType,
        TailwindTextOverflowType,
        TailwindTextTransformType,
        TailwindTextDecorationType,
        TailwindTextDecorationStyleType,
        TailwindFontStyleType,
        TailwindFontSmoothingType,
        TailwindFontVariantNumericType,
        TailwindContentType<FontPlug["content"]>,
        TailwindFontWeightType<FontPlug["fontSize"]>,
        TailwindFontFamilyType<FontPlug["fontFamily"]>,
        TailwindTextColorType<TailwindColor, FontPlug["textColor"]>,
        TailwindTextIndentType<TailwindColor, FontPlug["textIndent"]>,
        TailwindFontSizeType<FontPlug["fontSize"], FontPlug["lineHeight"]>,
        TailwindTextDecorationColorType<
            TailwindColor,
            FontPlug["textDecorationColor"]
        >,
        TailwindTextDecorationThicknessType<
            FontPlug["textDecorationThickness"]
        >,
        TailwindTextUnderlineOffsetType<FontPlug["textUnderlineOffset"]>,
        TailwindListStyleImageType<FontPlug["listStyleImage"]>,
        TailwindListStyleTypeType<FontPlug["listStyleType"]>,
        TailwindLetterSpacingType<FontPlug["letterSpacing"]>,
        TailwindLineHeightType<FontPlug["lineHeight"]>,
        TailwindLineClampType<FontPlug["lineClamp"]>,
        TailwindHyphensType<FontPlug["hyphens"]>,
        TailwindListStylePositionType,
        TailwindWhitespaceType {}
