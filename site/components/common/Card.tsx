import { TailwindCustom, tw } from "wind"
import { Underline } from "./Underline"
import Link from "next/link"

export const cardContainer = tw.style({
    backgroundColor: "bg-amber-700/5",

    borderRadius: "rounded-lg",
    borderColor: "border-amber-400/10",
    borderWidth: "border",
})

const card = tw
    .style({
        display: "flex",
        flexDirection: "flex-col",
        alignItems: "items-start",
        justifyContent: "justify-between",
        gap: "gap-4",

        padding: "p-3",

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
            padding: "sm:p-5",
        },
    })
    .compose(cardContainer.style())

const cardIcon = tw.style({
    width: "w-6",
    height: "h-6",
    minWidth: "min-w-[1.5rem]",
    minHeight: "min-h-[1.5rem]",

    padding: "p-1",

    gradient: "bg-gradient-to-bl",
    gradientStart: "from-amber-700/30",
    gradientEnd: "to-amber-700/50",

    borderColor: "border-amber-400",
    borderWidth: "border-[0.1px]",
    borderRadius: "rounded",

    "@md": {
        width: "md:w-7",
        height: "md:h-7",
        minWidth: "md:min-w-[1.75rem]",
        minHeight: "md:min-h-[1.75rem]",

        padding: "md:p-1.5",
    },
})

const CardIcon = ({ icon }: { icon: React.ReactNode }) => (
    <div className={cardIcon.class()}>{icon}</div>
)

const CardHeader = ({
    icon,
    title,
}: {
    title: React.ReactNode
    icon: React.ReactNode
}) => (
    <div className="flex flex-row md:gap-4 gap-2 items-center justify-between">
        <CardIcon icon={icon} />
        <div className="font-bold text-sm md:text-base md:font-semibold text-start">
            <Underline>{title}</Underline>
        </div>
    </div>
)

const Card = ({
    title,
    description,
    icon,
    href,
    tw: twS,
    children,
}: React.PropsWithChildren<{
    title: React.ReactNode
    description: React.ReactNode
    icon: React.ReactNode
    href: string
    tw?: TailwindCustom
}>) => {
    return (
        <Link
            className={twS ? tw.mergeProps(card.style(), twS) : card.class()}
            type="button"
            href={href}
        >
            <CardHeader icon={icon} title={title} />
            <p className="text-amber-100/50 text-start">{description}</p>
            {children}
        </Link>
    )
}

export { Card, CardIcon, CardHeader }
