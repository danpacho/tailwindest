/**
 * @description Tailwindest Styler interface
 */
export interface TailwindestStyler<
    StyleSheet,
    StyleArgs,
    UseShorthand = false,
> {
    /**
     * @description Get class name
     */
    class: UseShorthand extends true ? string : (styleArgs: StyleArgs) => string
    /**
     * @description Get style sheet object
     */
    style: UseShorthand extends true
        ? StyleSheet
        : (styleArgs: StyleArgs) => StyleSheet
    /**
     * @description Compose styleSheets into `base` styleSheet
     * @param styles Compose target styleSheets
     */
    compose: (...styles: Array<StyleSheet>) => {
        /**
         * @description Get class name
         */
        class: UseShorthand extends true
            ? string
            : (styleArgs: StyleArgs) => string
        /**
         * @description Get style sheet object
         */
        style: UseShorthand extends true
            ? StyleSheet
            : (styleArgs: StyleArgs) => StyleSheet
    }
}
