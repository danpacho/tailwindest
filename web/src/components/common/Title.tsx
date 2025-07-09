import { tw } from "../../tw"
import type { Tailwindest } from "../../tw"

const header = tw.style({
    fontWeight: "font-extrabold",
    color: "text-black",
    "@dark": {
        color: "dark:text-neutral-100",
    },
})

const gradientHeader = tw.style({
    color: "text-transparent",
    fontWeight: "font-extrabold",
    backgroundClip: "bg-clip-text",

    backgroundImage: ["bg-linear-to-b", "from-[#D0E33E]", "to-[#FF3C3C]"],
    "@dark": {
        backgroundImage: ["dark:from-[#e9ff4d]", "dark:to-[#ff0707]"],
    },
})

const titleBtn = tw.style({
    display: "flex",
    flexDirection: "flex-row",
    alignItems: "items-center",
    justifyContent: "justify-center",
    gap: "gap-2",

    fontSize: "text-xl",

    transitionProperty: "transition",
    transitionTimingFunction: "ease-out",
    ":hover": {
        opacity: "hover:opacity-90",
    },
    ":active": {
        transformScale: "active:scale-95",
    },
})

const Title = ({
    children,
    tw: twS,
}: React.PropsWithChildren<{
    tw?: Tailwindest
}>) => {
    return (
        <button
            className={
                twS ? tw.mergeProps(titleBtn.style(), twS) : titleBtn.class()
            }
        >
            <div className="flex flex-row gap-0 items-center justify-center">
                <h1 className={header.class()}>Tailwind</h1>
                <h1 className={`${gradientHeader.class()} gradient`}>est</h1>
                {children}
            </div>
        </button>
    )
}

export { Title }