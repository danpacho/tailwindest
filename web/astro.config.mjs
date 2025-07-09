// @ts-check
import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import starlightThemeNova from "starlight-theme-nova"
import tailwindcss from "@tailwindcss/vite"
import react from "@astrojs/react"
import vercel from "@astrojs/vercel"

// https://astro.build/config
export default defineConfig({
    output: "static",
    site: "https://tailwindest.vercel.app",
    adapter: vercel({
        webAnalytics: {
            enabled: true,
        },
    }),
    integrations: [
        starlight({
            plugins: [starlightThemeNova()],
            title: "Tailwindest",

            social: [
                {
                    icon: "github",
                    label: "GitHub",
                    href: "https://github.com/danpacho/tailwindest",
                },
            ],
            description:
                "Create tailwind types & Build type-safe tailwind products.",
            logo: {
                src: "/public/favicon.png",
            },
            favicon: "/public/favicon.svg",
            customCss: ["./src/styles/custom.css"],
            sidebar: [
                {
                    label: "Before dive in",
                    items: [
                        {
                            label: "Introduction",
                            link: "/start/introduction/",
                        },
                        { label: "Benefits", link: "/start/benefits/" },
                    ],
                },
                {
                    label: "Setup",
                    link: "/setup/",
                },
                {
                    label: "Create Tailwind Type",
                    link: "/create-tailwind-type/",
                },
                {
                    label: "Recipes",
                    items: [
                        {
                            label: "Basic styling",
                            link: "/recipe/styling/",
                        },
                        {
                            label: "Conditional styling",
                            link: "/recipe/conditional-styling/",
                        },
                        {
                            label: "Customize",
                            link: "/recipe/customize/",
                        },
                        {
                            label: "Utility",
                            link: "/recipe/utility/",
                        },
                    ],
                },
                {
                    label: "API References",
                    autogenerate: { directory: "apis" },
                },
                // {
                //     label: "Examples",
                //     autogenerate: { directory: "examples" },
                // },
            ],
        }),
        react(),
    ],

    vite: {
        plugins: [tailwindcss()],
    },
})
