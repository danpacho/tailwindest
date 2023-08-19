type TailwindTransition<
    TransitionProperty extends string,
    TransitionTimingFunction extends string,
> = `${TransitionProperty} ${TransitionTimingFunction}` | "transition"

export type TailwindTransitionType<
    TransitionProperty extends string,
    TransitionDuration extends string,
    TransitionTimingFunction extends string,
    TransitionDelay extends string,
> = {
    /**
     *@description transition shorthand syntax
     *@description `<property>` `<timing>`
     *@see {@link https://tailwindcss.com/docs/transition-property transition}
     */
    transition: TailwindTransition<TransitionProperty, TransitionTimingFunction>
    /**
     *@description Utilities for controlling which CSS properties transition.
     *@see {@link https://tailwindcss.com/docs/transition-property transition property}
     */
    transitionProperty: TransitionProperty
    /**
     *@description Utilities for controlling the duration of CSS transitions.
     *@see {@link https://tailwindcss.com/docs/transition-duration transition duration}
     */
    transitionDuration: TransitionDuration
    /**
     *@description Utilities for controlling the easing of CSS transitions.
     *@see {@link https://tailwindcss.com/docs/transition-timing-function transition timing function}
     */
    transitionTimingFunction: TransitionTimingFunction
    /**
     *@description Utilities for controlling the delay of CSS transitions.
     *@see {@link https://tailwindcss.com/docs/transition-delay transition delay}
     */
    transitionDelay: TransitionDelay
}
