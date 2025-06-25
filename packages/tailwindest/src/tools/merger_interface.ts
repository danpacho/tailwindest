/**
 * @interface
 * Additional class tokens that can be merged into a single className string.
 */
export type AdditionalClassTokens<Literal extends string> = Array<
    Literal | Array<Literal>
>
/**
 * @interface
 * Merge arbitrary class list into one valid style classname string
 */
export type Merger<Literal extends string = string> = (
    ...classList: AdditionalClassTokens<Literal>
) => string
