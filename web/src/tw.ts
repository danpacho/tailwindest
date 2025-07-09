import { type CreateTailwindest, createTools } from "tailwindest"

import type { Tailwind, TailwindNestGroups } from "./tailwind"
import type { CreateTailwindLiteral } from "tailwindest"

export type Tailwindest = CreateTailwindest<{
    tailwind: Tailwind
    tailwindNestGroups: TailwindNestGroups
    useArbitrary: true
    groupPrefix: "@"
}>
export type TailwindLiteral = CreateTailwindLiteral<Tailwind>

const tw = createTools<{
    tailwindest: Tailwindest
    tailwindLiteral: TailwindLiteral
    useArbitrary: true
    useTypedClassLiteral: true
}>()

declare module "react" {
    interface DOMAttributes<T> {
        /**
         * Styling props for tailwindest
         */
        tw?: Tailwindest
    }
    interface HTMLAttributes<T>
        extends React.AriaAttributes,
            React.DOMAttributes<T> {}

    type TwPropsWithChildren<P = unknown> = P & {
        children?: ReactNode | undefined
        tw?: Tailwindest
    }
}

declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            /**
             * Styling props for tailwindest
             */
            tw?: Tailwindest
        }
    }
}

export { tw, type Tailwind }
