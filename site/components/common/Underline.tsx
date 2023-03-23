import { wind } from "tailwindest"

const underline = wind({
    fontFamily: "font-mono",
    fontWeight: "font-semibold",
    paddingBottom: "pb-0.5",

    borderRadius: "rounded-none",
    borderBottomWidth: "border-b-2",
    borderBottomColor: "border-b-orange-400",

    letterSpacing: "tracking-tight",

    "@dark": {
        color: "dark:text-white",
    },
}).class()

const Underline = ({ children }: React.PropsWithChildren) => (
    <code className={underline}>{children}</code>
)

export { Underline }
