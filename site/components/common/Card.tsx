import { wind } from "wind"

export const cardContainer = wind({
    backgroundColor: "bg-amber-600/10",

    borderRadius: "rounded",
    borderColor: "border-amber-400/20",
    borderWidth: "border",
})

const card = wind({
    display: "flex",
    flexDirection: "flex-col",
    alignItems: "items-start",
    justifyContent: "justify-between",
    gap: "gap-2",

    padding: "p-2",

    ":hover": {
        transformTranslateY: "hover:translate-y-[1.5px]",
        borderColor: "hover:border-transparent",
        opacity: "hover:opacity-100",
    },
    ":active": {
        borderColor: "active:border-amber-400/10",
        opacity: "active:opacity-75",
    },
    transition: "transition-all ease-in",
    transitionDuration: "duration-75",
    userSelect: "select-none",

    "@sm": {
        flexDirection: "sm:flex-row",
        alignItems: "sm:items-center",
        padding: "sm:p-2.5",
    },
})
    .compose(cardContainer.style())
    .class()

const cardIcon = wind({
    width: "w-6",
    height: "h-6",
    minWidth: "min-w-[1.5rem]",
    minHeight: "min-h-[1.5rem]",

    padding: "p-1",

    backgroundImage: "bg-gradient-to-bl",
    backgroundImageGradientStart: "from-amber-700/30",
    backgroundImageGradientEnd: "to-amber-700/50",

    borderColor: "border-amber-400",
    borderWidth: "border",
    borderRadius: "rounded",

    "@md": {
        width: "md:w-7",
        height: "md:h-7",
        minWidth: "md:min-w-[1.75rem]",
        minHeight: "md:min-h-[1.75rem]",

        padding: "md:p-1.5",
    },
}).class()

const Card = ({
    children,
    icon,
    onClick,
    className,
}: {
    children: React.ReactNode
    icon: React.ReactNode
    onClick: () => void
    className?: string
}) => {
    return (
        <button
            className={`${card} ${className}`}
            type="button"
            onClick={onClick}
        >
            <div className={cardIcon}>{icon}</div>
            <div className="font-bold text-sm md:text-base md:font-semibold text-start">
                {children}
            </div>
        </button>
    )
}

export { Card }
