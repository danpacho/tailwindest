import { mergeProps, Tailwindest, wind } from "tailwindest"

const header = wind({
    fontWeight: "font-extrabold",
    color: "text-black",
    "@dark": {
        color: "dark:text-neutral-100",
    },
}).class()

const gradientHeader = wind({
    color: "text-transparent",
    fontWeight: "font-extrabold",
    backgroundClip: "bg-clip-text",
    backgroundImage: "bg-gradient-to-b",
    backgroundImageGradientStart: "from-[#D0E33E]",
    backgroundImageGradientEnd: "to-[#FF3C3C]",
    "@dark": {
        backgroundImageGradientStart: "dark:from-[#e9ff4d]",
        backgroundImageGradientEnd: "dark:to-[#ff0707]",
    },
}).class()

const btn = wind({
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
}).style()

const Title = ({
    children,
    fontSize = "text-xl",
    lgFontSize = "lg:text-2xl",
}: React.PropsWithChildren<{
    fontSize?: Tailwindest["fontSize"]
    lgFontSize?: `lg:${Exclude<Tailwindest["fontSize"], undefined>}`
}>) => {
    const btnWithSize = mergeProps(btn, {
        fontSize,
        "@lg": {
            fontSize: lgFontSize,
        },
    })

    return (
        <button className={btnWithSize}>
            <div className="flex flex-row gap-0 items-center justify-center">
                <h1 className={header}>Tailwind</h1>
                <h1 className={`${gradientHeader} gradient italic`}>est</h1>
                {children}
            </div>
        </button>
    )
}

export { Title }
