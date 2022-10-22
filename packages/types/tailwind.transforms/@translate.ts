import { PluginVariantsWithDirection } from "../plugin"

export type TailwindTranslateType<Translate extends string> = {
    /**
     *@note Utilities for translating elements with transform.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [translate](https://tailwindcss.com/docs/translate)
     */
    transformTranslate: PluginVariantsWithDirection<"translate", Translate>
    /**
     *@note Utilities for translating elements with transform x direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [translate](https://tailwindcss.com/docs/translate)
     */
    transformTranslateX: PluginVariantsWithDirection<"translate-x", Translate>
    /**
     *@note Utilities for translating elements with transform y direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [translate](https://tailwindcss.com/docs/translate)
     */
    transformTranslateY: PluginVariantsWithDirection<"translate-y", Translate>
}
