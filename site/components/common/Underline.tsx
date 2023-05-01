import { tw } from "wind"

const underline = tw.style({
    fontFamily: "font-mono",
    fontWeight: "font-semibold",
    paddingBottom: "pb-0.5",

    borderRadius: "rounded-none",
    borderBottomWidth: "border-b",
    borderBottomColor: "border-b-orange-400",

    letterSpacing: "tracking-tight",

    "@md": {
        borderBottomWidth: "md:border-b-2",
    },
    "@dark": {
        color: "dark:text-white",
    },
})

const Underline = ({ children }: React.PropsWithChildren) => (
    <code className={underline.class}>{children}</code>
)

export { Underline }
