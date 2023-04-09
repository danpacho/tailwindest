import { wind } from "wind"
import { Title, LinkButton, Underline, CopyButton } from "~components/common"
import { Card, cardContainer } from "~components/common/Card"
import {
    BoltIcon,
    CpuChipIcon,
    DocumentCheckIcon,
    Square3Stack3DIcon,
    WrenchScrewdriverIcon,
    CodeBracketIcon,
} from "@heroicons/react/24/solid"
import { useState } from "react"

const subtitle = wind({
    color: "text-neutral-400",
    fontWeight: "font-medium",
    fontSize: "text-base",
    letterSpacing: "tracking-wide",
    "@md": {
        fontSize: "md:text-lg",
    },
    "@lg": {
        fontSize: "lg:text-xl",
    },
}).class()

const MainHeader = () => {
    return (
        <>
            <div className="w-full flex flex-col gap-14 md:gap-25 items-center justify-center py-16">
                <Title fontSize="text-5xl" mdFontSize="md:text-[3.5rem]" />
                <div className="flex flex-col items-center justify-center gap-1">
                    <p className={subtitle}>
                        Build <Underline>fully‒typed</Underline>{" "}
                        <Underline>tailwindcss</Underline> product
                    </p>
                    <p className={subtitle}>
                        Using the power of <Underline>typescript</Underline>
                    </p>
                </div>
            </div>
            <div className="w-full flex flex-row items-center justify-center gap-4">
                <LinkButton to="/1-start/setup">Getting Started</LinkButton>
                <CopyButton
                    copiedText={<p className="font-mono">type is ready</p>}
                    defaultText={
                        <div className="flex flex-row gap-1.5 items-center justify-center">
                            <div className="p-1 w-5 h-5 stroke md:stroke-2 stroke-amber-400 bg-transparent">
                                <CodeBracketIcon />
                            </div>
                            <p className="font-mono">npm i tailwindest</p>
                        </div>
                    }
                    text="npm i tailwindest"
                    timeout={7000}
                />
            </div>
        </>
    )
}

const code = wind({
    color: "text-neutral-300",
    fontWeight: "font-semibold",
    fontSize: "text-sm",
    borderWidth: "border",
    borderColor: "border-amber-400/30",
    backgroundColor: "bg-amber-900/10",
    paddingX: "px-0.5",
    paddingY: "py-0",
    borderRadius: "rounded-sm",

    "@md": {
        padding: "md:p-0",
        paddingX: "md:px-0.5",
        paddingY: "md:py-[0.25px]",
        borderRadius: "md:rounded",
    },
}).class()

const Code = ({ children }: React.PropsWithChildren) => (
    <code className={code}>{children}</code>
)

const features = {
    fullyTyped: {
        featureTitle: "Fully-typed",
        featureIcon: <CpuChipIcon />,
        title: <>Fully typed tailwind</>,
        description: (
            <>
                Type-safety and autocompletion magics,
                <p>
                    will give you the best <Code>tailwindcss</Code> DX.
                </p>
            </>
        ),
    },
    customizable: {
        featureTitle: "Customizable",
        featureIcon: <WrenchScrewdriverIcon />,
        title: <>Support custom type</>,
        description: (
            <>
                Define custom type definition, defined in{" "}
                <Code>tailwind.config.js</Code>
            </>
        ),
    },
    variantsAPI: {
        featureTitle: "Variants API",
        featureIcon: <CpuChipIcon />,
        title: <>Level up conditional styling</>,
        description: (
            <>
                Variants based conditional styling, alike <Code>stitches</Code>{" "}
                & <Code>vanilla-extract</Code>.
            </>
        ),
    },
    tiny: {
        featureTitle: (
            <>
                Tiny, <Underline>638B</Underline>
            </>
        ),
        featureIcon: <Square3Stack3DIcon />,
        title: <>Tiny bundle size</>,
        description: (
            <>
                Don't have to worry about heavy bundle size. It is just{" "}
                <Code>638B</Code> tiny lib.
            </>
        ),
    },
    performant: {
        featureTitle: "Performant",
        featureIcon: <BoltIcon />,
        title: <>Styles are cached</>,
        description: (
            <>All operation is optimized and styles are cached by default.</>
        ),
    },
    docsLink: {
        featureTitle: "Document link",
        featureIcon: <DocumentCheckIcon />,
        title: <>Document embedded</>,
        description: (
            <>
                Hover the property,{" "}
                <p className="font-semibold">
                    you will get the official <Code>tailwindcss</Code> document
                    link
                </p>
            </>
        ),
    },
} satisfies Readonly<
    Record<
        string,
        {
            featureTitle: React.ReactNode
            featureIcon: React.ReactNode
            title: React.ReactNode
            description: React.ReactNode
        }
    >
>

const moreInfo = wind({
    display: "flex",
    flexDirection: "flex-col",
    alignItems: "items-start",
    justifyContent: "justify-center",
    gap: "gap-4",

    width: "w-full",
    padding: "p-2",

    transition: "transition",
    transitionDuration: "duration-300",

    borderLeftWidth: "border-l-8",
    borderTopLeftRadius: "rounded-tl-sm",
    borderBottomLeftRadius: "rounded-bl-sm",

    transformGPU: "transform-gpu",
})
    .compose(cardContainer.style())
    .class()

const MainFeatures = () => {
    const [focusedFeature, setFocusedFeature] = useState<
        keyof typeof features | null
    >(null)

    const isMoreInfoOpened = focusedFeature !== null
    return (
        <div className="w-full flex flex-col items-center justify-center gap-2">
            <div className="w-full py-2 md:py-6 grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-4 md:gap-y-6">
                {Object.entries(features).map((value) => {
                    const [featureKey, component] = value
                    const { featureIcon, featureTitle } = component
                    const activated =
                        focusedFeature == featureKey || focusedFeature == null
                    return (
                        <Card
                            icon={featureIcon}
                            key={featureKey}
                            onClick={() =>
                                setFocusedFeature(
                                    featureKey as keyof typeof features
                                )
                            }
                            className={activated ? "opacity-100" : "opacity-20"}
                        >
                            {featureTitle}
                        </Card>
                    )
                })}
            </div>
            <div
                className={`${moreInfo} ${
                    isMoreInfoOpened
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                }`}
            >
                {focusedFeature !== null && (
                    <>
                        <div className="text-base md:text-lg font-bold">
                            <Underline>
                                {features[focusedFeature].title}
                            </Underline>
                        </div>
                        <div className="text-sm md:text-base text-neutral-200 tracking">
                            {features[focusedFeature].description}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export { MainHeader, MainFeatures }
