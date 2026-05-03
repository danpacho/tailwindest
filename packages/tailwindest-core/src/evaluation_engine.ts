import { type ClassList, toClass } from "./class_list"
import {
    type AdditionalClassTokens,
    deepMerge,
    flattenRecord,
    getClassName,
    type Merger,
} from "./style_engine"

export interface EvaluationEngine<
    StyleType = Record<string, unknown>,
    ClassLiteral extends string = string,
> {
    flattenRecord: typeof flattenRecord
    getClassName: typeof getClassName
    deepMerge: typeof deepMerge
    join: (...classList: ClassList<ClassLiteral>) => string
    def: (
        classList: ClassList<ClassLiteral>,
        ...styleList: Array<StyleType>
    ) => string
    mergeProps: (...overrideStyles: Array<StyleType>) => string
    mergeRecord: (...overrideRecord: Array<StyleType>) => StyleType
}

export interface EvaluationEngineOptions<ClassLiteral extends string = string> {
    merger?: Merger<ClassLiteral>
}

export function createEvaluationEngine<
    StyleType = Record<string, unknown>,
    ClassLiteral extends string = string,
>({ merger }: EvaluationEngineOptions<ClassLiteral> = {}): EvaluationEngine<
    StyleType,
    ClassLiteral
> {
    return {
        flattenRecord,
        getClassName,
        deepMerge,
        join: (...classList) => joinWithMerger(classList, merger),
        def: (classList, ...styleList) =>
            defWithMerger(
                classList,
                styleList,
                merger as Merger<string> | undefined
            ),
        mergeProps: (...overrideStyles) =>
            mergePropsWithMerger(
                overrideStyles,
                merger as Merger<string> | undefined
            ),
        mergeRecord: (...overrideRecord) => mergeRecord(...overrideRecord),
    }
}

export function join<ClassLiteral extends string = string>(
    ...classList: ClassList<ClassLiteral>
): string {
    return joinWithMerger(classList)
}

function joinWithMerger<ClassLiteral extends string = string>(
    classList: ClassList<ClassLiteral>,
    merger?: Merger<ClassLiteral>
): string {
    const base = toClass(...classList)
    if (merger) {
        const tokens = base
            .split(" ")
            .filter((e) => e.length > 0)
            .map((e) => e.trim())
        return merger(...(tokens as AdditionalClassTokens<ClassLiteral>))
    }
    return base
}

export function def<StyleType>(
    classList: ClassList<string>,
    ...styleList: Array<StyleType>
): string {
    return join(...classList, mergeProps(...styleList))
}

function defWithMerger<StyleType>(
    classList: ClassList<string>,
    styleList: Array<StyleType>,
    merger?: Merger
): string {
    return joinWithMerger(
        [...classList, mergePropsWithMerger(styleList, merger)],
        merger
    )
}

export function mergeProps<StyleType>(
    ...overrideStyles: Array<StyleType>
): string {
    return mergePropsWithMerger(overrideStyles)
}

function mergePropsWithMerger<StyleType>(
    overrideStyles: Array<StyleType>,
    merger?: Merger
): string {
    const res = getClassName(mergeRecord(...overrideStyles))
    if (merger) {
        return merger(res)
    }
    return res
}

export function mergeRecord<StyleType>(
    ...overrideRecord: Array<StyleType>
): StyleType {
    return overrideRecord.reduce<StyleType>(
        (override, curr) => deepMerge(override, curr),
        {} as StyleType
    )
}

export type { AdditionalClassTokens }
