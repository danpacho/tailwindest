const DIVIDER = " "

/**
 * @param stylesArray flattened styles, which is `string[]`
 * @returns Join array into `string`
 */
const getStyleClass = (stylesArray: string[]) => stylesArray.join(DIVIDER)

export { getStyleClass }
