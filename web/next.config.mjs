import { createMDX } from "fumadocs-mdx/next"

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    typedRoutes: false,
}

const withMDX = createMDX()

export default withMDX(config)
