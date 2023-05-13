import { Tailwindest, createTools } from "tailwindest"

export type TailwindCustom = Tailwindest<
    {},
    {
        animation: "appear"
    }
>

const tw = createTools<TailwindCustom>()

type Tailwind = Required<TailwindCustom>

declare module "react" {
    interface DOMAttributes<T> {
        /**
         * Styling props for tailwindest
         */
        tw?: TailwindCustom
    }
    interface HTMLAttributes<T>
        extends React.AriaAttributes,
            React.DOMAttributes<T> {}

    type TwPropsWithChildren<P = unknown> = P & {
        children?: ReactNode | undefined
        tw?: TailwindCustom
    }
}

declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            /**
             * Styling props for tailwindest
             */
            tw?: TailwindCustom
        }
    }
}

export { tw, type Tailwind }
