import { PluginVariantsWithDirection } from "../plugin"

export type TailwindTranslateType<Translate extends string> = {
    /**
     *@description Utilities for translating elements with transform.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/translate translate}
     */
    transformTranslate: PluginVariantsWithDirection<"translate", Translate>
    /**
     *@description Utilities for translating elements with transform x direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/translate translate-x}
     */
    transformTranslateX: PluginVariantsWithDirection<"translate-x", Translate>
    /**
     *@description Utilities for translating elements with transform y direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/translate translate-y}
     */
    transformTranslateY: PluginVariantsWithDirection<"translate-y", Translate>
}
