import { useRouter } from "next/router"
import type { DocsThemeConfig } from "nextra-theme-docs"
import { useConfig } from "nextra-theme-docs"
import { Title } from "~components/common"

const tailwindestLogo = (
    <>
        <div>
            <Title>
                <svg
                    width="35"
                    height="35"
                    viewBox="0 0 35 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g clipPath="url(#clip0_302_46)">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M22.723 10.4105C26.5572 12.5134 27.9239 15.5955 26.8228 19.6558C25.171 25.7464 20.3412 25.2837 18.7448 28.125C17.6803 30.0193 17.9691 31.9996 19.6112 34.0663C15.777 31.9634 14.4103 28.8813 15.5114 24.8211C17.1632 18.7305 21.993 19.1931 23.5894 16.3518C24.6539 14.4575 24.3651 12.4772 22.723 10.4105ZM15.5411 0.349332C19.3753 2.45221 20.7419 5.53431 19.6408 9.59455C17.9891 15.6852 13.1593 15.2225 11.5628 18.0638C10.4984 19.9581 10.7872 21.9384 12.4292 24.0051C8.59502 21.9022 7.22836 18.8201 8.32949 14.7598C9.98124 8.66925 14.811 9.1319 16.4075 6.2906C17.4719 4.39628 17.1831 2.41602 15.5411 0.349332Z"
                            fill="url(#paint0_linear_302_46)"
                        />
                    </g>
                    <defs>
                        <linearGradient
                            id="paint0_linear_302_46"
                            x1="17.4568"
                            y1="39.2509"
                            x2="17.4568"
                            y2="-4.62544"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#FF0000" />
                            <stop offset="1" stopColor="#FFED4D" />
                        </linearGradient>
                        <clipPath id="clip0_302_46">
                            <rect width="35" height="35" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </Title>
        </div>
        <style jsx>{`
            div {
                transition: mask-position 0.75s ease,
                    -webkit-mask-position 0.75s ease;
                mask-image: linear-gradient(
                    75deg,
                    red 25%,
                    rgba(0, 0, 0, 0.1) 50%,
                    red 75%
                );
                mask-size: 500%;
                mask-position: 0%;
                filter: brightness(1.15);
            }
            div:hover {
                mask-position: 100%;
            }
            div:active {
                transform: scale(0.95);
            }
        `}</style>
    </>
)

const config: DocsThemeConfig = {
    project: {
        link: "https://github.com/danpacho/tailwindest",
    },
    docsRepositoryBase:
        "https://github.com/danpacho/tailwindest/blob/master/web",
    useNextSeoProps() {
        const { asPath } = useRouter()
        if (asPath !== "/") {
            return {
                titleTemplate: "%s – Tailwindest",
            }
        }
    },
    logo: tailwindestLogo,
    head: function useHead() {
        const { title } = useConfig()

        return (
            <>
                <meta name="msapplication-TileColor" content="#fff" />
                <meta name="theme-color" content="#000000" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta httpEquiv="Content-Language" content="en" />
                <meta name="description" content="Fully typed tailwindcss" />
                <meta name="og:description" content="Fully typed tailwindcss" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site:domain" content="tailwindest.site" />
                <meta
                    name="twitter:url"
                    content="https://tailwindest.vercel.app"
                />
                <meta
                    name="og:title"
                    content={title ? title + " – Tailwindest" : "Tailwindest"}
                />
                <meta name="og:image" content={""} />
                <meta name="apple-mobile-web-app-title" content="Tailwindest" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="icon" href="/favicon.png" type="image/png" />
                <link
                    rel="icon"
                    href="/favicon.svg"
                    type="image/svg+xml"
                    media="(prefers-color-scheme: dark)"
                />
            </>
        )
    },
    banner: {
        key: "Document released!",
        text: (
            <p>
                🎉 Documentation site is released. Support api docs only, right
                now!
            </p>
        ),
    },
    editLink: {
        text: "Edit this page on GitHub →",
    },
    feedback: {
        content: "Question on Github! →",
        labels: "feedback",
    },
    sidebar: {
        titleComponent({ title, type }) {
            if (type === "separator") {
                return <span className="cursor-default">{title}</span>
            }
            return <>{title}</>
        },
        defaultMenuCollapseLevel: 1,
        toggleButton: true,
    },
    footer: {
        text: (
            <div className="flex w-full flex-col items-center sm:items-start text-xs">
                <p className=" text-amber-400 font-mono">MIT</p>
                <p>©{new Date().getFullYear()} danpacho.</p>
            </div>
        ),
    },
    darkMode: false,
    nextThemes: {
        defaultTheme: "dark",
        forcedTheme: "dark",
    },
    primaryHue: {
        dark: 25,
        light: 30,
    },
}

export default config
