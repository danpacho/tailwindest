import { tw, Tailwind } from "wind"

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

    gradient: "bg-gradient-to-b",
    gradientStart: "from-[#D0E33E]",
    gradientEnd: "to-[#FF3C3C]",
    "@dark": {
        gradientStart: "dark:from-[#e9ff4d]",
        gradientEnd: "dark:to-[#ff0707]",
    },
})

const Title = ({
    children,
    fontSize = "text-xl",
    mdFontSize = "md:text-2xl",
}: React.PropsWithChildren<{
    fontSize?: Tailwind["fontSize"]
    mdFontSize?: `md:${Tailwind["fontSize"]}`
}>) => {
    const titleBtn = tw.mergeProps(
        {
            display: "flex",
            flexDirection: "flex-row",
            alignItems: "items-center",
            justifyContent: "justify-center",
            gap: "gap-2",

            transition: "transition ease-in",
            ":hover": {
                opacity: "hover:opacity-90",
            },
            ":active": {
                transformScale: "active:scale-95",
            },
        },
        {
            fontSize,
            "@md": {
                fontSize: mdFontSize,
            },
        }
    )

    return (
        <button className={titleBtn}>
            <div className="flex flex-row gap-0 items-center justify-center">
                <h1 className={header.class}>Tailwind</h1>
                <h1 className={`${gradientHeader.class} gradient italic`}>
                    est
                </h1>
                {children}
            </div>
        </button>
    )
}

export { Title }
