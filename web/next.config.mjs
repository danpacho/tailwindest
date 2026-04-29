import { createMDX } from "fumadocs-mdx/next"

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    typedRoutes: false,
    webpackDevMiddleware: (config) => {
        config.watchOptions = {
            ...config.watchOptions,
            ignored: [
                "**/.next/**",
                "**/node_modules/**",
                "**/dist/**",
                "**/.turbo/**",
            ],
        }

        return config
    },
}

const withMDX = createMDX()

export default withMDX(config)
