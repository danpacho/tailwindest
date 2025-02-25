import { tw } from "wind"
import { LinkButton, CopyButton, Card, Divider } from "~components/common"
import { util } from "~components/utils"

const subtitle = tw.style({
    marginTop: "mt-14",
    color: "text-gray-300",
    fontWeight: "font-normal",
    fontSize: "text-base",
    letterSpacing: "tracking-wide",
    "@md": {
        fontSize: "md:text-lg",
    },
    "@lg": {
        fontSize: "lg:text-xl",
    },
})

const titleText = tw.style({
    fontSize: "text-5xl",
    "@md": {
        fontSize: "md:text-6xl",
    },
    fontWeight: "font-bold",
})

const gradientText = tw
    .style({
        color: "text-transparent",
        fontWeight: "font-bold",
        backgroundClip: "bg-clip-text",
    })
    .compose(titleText.style(), util.goldGradient.style())

const MainHeader = () => {
    return (
        <>
            <div className="w-full flex flex-col gap-14 md:gap-25 items-center justify-center pt-16 pb-4">
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex flex-col items-start md:items-center justify-center gap-1 md:gap-2 mb-12">
                        <div className="flex gap-1.5 flex-wrap w-fit items-center">
                            <h1 className={titleText.class()}>Write</h1>
                            <h1 className={gradientText.class()}>Typesafe</h1>
                        </div>
                        <h1 className={titleText.class()}>Tailwindcss</h1>
                        <h1 className={subtitle.class()}>
                            powered by typescript
                        </h1>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-row items-center justify-center gap-2 md:gap-3">
                <LinkButton to="/start/introduction" type="fill">
                    Documentation
                </LinkButton>
                <CopyButton
                    copiedText={<p className="font-mono">type is ready</p>}
                    defaultText={<p className="font-mono">npm i tailwindest</p>}
                    text="npm i tailwindest"
                    timeout={7000}
                />
            </div>
        </>
    )
}

const featureGrid = tw.style({
    position: "relative",
    display: "grid",
    gridTemplateColumns: "grid-cols-1",
    gapX: "gap-x-3",
    gapY: "gap-y-6",

    "@md": {
        gridTemplateColumns: "md:grid-cols-2",
        gapX: "md:gap-x-4",
        gapY: "md:gap-y-3",
    },

    width: "w-full",
    marginY: "my-6",
})

const MainFeatures = ({
    features,
}: {
    features: Record<
        string,
        {
            href: string
            icon: React.ReactNode
            title: React.ReactNode
            description: React.ReactNode
        }
    >
}) => {
    return (
        <div className={featureGrid.class()}>
            {Object.entries(features).map((value) => {
                const [featureKey, component] = value
                const { icon, title, description, href } = component

                return (
                    <Card
                        key={featureKey}
                        href={href}
                        icon={icon}
                        title={title}
                        description={description}
                    />
                )
            })}
        </div>
    )
}

export { MainHeader, MainFeatures }
