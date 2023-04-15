import { wind, mergeProps, type Tailwind } from "wind"

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

const Title = ({
    children,
    fontSize = "text-xl",
    mdFontSize = "md:text-2xl",
}: React.PropsWithChildren<{
    fontSize?: Tailwind["fontSize"]
    mdFontSize?: `md:${Tailwind["fontSize"]}`
}>) => {
    const btnWithSize = mergeProps(
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
