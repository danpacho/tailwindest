type TailwindTransition<
    TransitionProperty extends string,
    TransitionTimingFunction extends string
> = `${TransitionProperty} ${TransitionTimingFunction}` | "transition"

export type TailwindTransitionType<
    TransitionProperty extends string,
    TransitionDuration extends string,
    TransitionTimingFunction extends string,
    TransitionDelay extends string
> = {
    /**
     *@note transition shorthand syntax
     *@note `<property>` `<timing>`
     *@docs [transition](https://tailwindcss.com/docs/transition-property)
     */
    transition: TailwindTransition<TransitionProperty, TransitionTimingFunction>
    /**
     *@note Utilities for controlling which CSS properties transition.
     *@docs [transition-property](https://tailwindcss.com/docs/transition-property)
     */
    transitionProperty: TransitionProperty
    /**
     *@note Utilities for controlling the duration of CSS transitions.
     *@docs [transition-duration](https://tailwindcss.com/docs/transition-duration)
     */
    transitionDuration: TransitionDuration
    /**
     *@note Utilities for controlling the easing of CSS transitions.
     *@docs [transition-timing-function](https://tailwindcss.com/docs/transition-timing-function)
     */
    transitionTimingFunction: TransitionTimingFunction
    /**
     *@note Utilities for controlling the delay of CSS transitions.
     *@docs [transition-delay](https://tailwindcss.com/docs/transition-delay)
     */
    transitionDelay: TransitionDelay
}
