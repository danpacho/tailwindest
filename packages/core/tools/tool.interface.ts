import type { NestedObject } from "../../utils"

export interface StyleGeneratorStyle<StyleType extends NestedObject> {
    /**
     * @description Get className `string`
     */
    class: string

    /**
     * @description Get styleSheet `object`
     */
    style: StyleType

    /**
     * @description Compose styleSheets into `base` styleSheet
     * @param styles Compose target styleSheets
     */
    compose: (...styles: StyleType[]) => {
        /**
         * @description Get className `string`
         */
        class: string

        /**
         * @description Get styleSheet `object`
         */
        style: StyleType
    }
}
export interface StyleGeneratorToggle<StyleType extends NestedObject> {
    /**
     * @param toggleCondition Toggling condition, `true` | `false`
     * @description Get toggled className `string`
     */
    class: (toggleCondition: boolean) => string

    /**
     * @param toggleCondition Toggling condition, `true` | `false`
     * @description Get toggled styleSheet `object`
     */
    style: (toggleCondition: boolean) => StyleType

    /**
     * @description Compose styleSheets into `base` styleSheet
     * @param styles Compose target styleSheets
     */
    compose: (...styles: StyleType[]) => {
        /**
         * @param toggleCondition Toggling condition, `true` | `false`
         * @description Get toggled className `string`
         */
        class: (toggleCondition: boolean) => string

        /**
         * @param toggleCondition Toggling condition, `true` | `false`
         * @description Get toggled styleSheet `object`
         */
        style: (toggleCondition: boolean) => StyleType
    }
}
export interface StyleGeneratorRotary<
    StyleType extends NestedObject,
    RotaryVariant extends string
> {
    /**
     * @description Get rotary variant className `string`
     * @param variant Name of rotary variant `string`
     */
    class: (variant: RotaryVariant) => string

    /**
     * @description Get rotary variant styleSheet `object`
     * @param variant Name of rotary variant `string`
     */
    style: (variant: RotaryVariant) => StyleType

    /**
     * @description Compose styleSheets into `base` styleSheet
     * @param styles Compose target styleSheets
     */
    compose: (...styles: StyleType[]) => {
        /**
         * @description Get rotary variant className `string`
         * @param variant Name of rotary variant `string`
         */
        class: (variant: RotaryVariant) => string

        /**
         * @description Get rotary variant styleSheet `object`
         * @param variant Name of rotary variant `string`
         */
        style: (variant: RotaryVariant) => StyleType
    }
}

export interface StyleGeneratorVariants<
    StyleType extends NestedObject,
    VariantOption
> {
    /**
     * @description Get variant className `string`
     * @param variant Name of variant `string`
     */
    class: (variantOption: VariantOption) => string

    /**
     * @description Get variant styleSheet `object`
     * @param variant Name of variant `string`
     */
    style: (variantOption: VariantOption) => StyleType

    /**
     * @description Compose styleSheets into `base` styleSheet
     * @param styles Compose target styleSheets
     */
    compose: (...styles: StyleType[]) => {
        /**
         * @description Get variant className `string`
         * @param variant Name of variant `string`
         */
        class: (variantOption: VariantOption) => string

        /**
         * @description Get variant styleSheet `object`
         * @param variant Name of variant `string`
         */
        style: (variantOption: VariantOption) => StyleType
    }
}
