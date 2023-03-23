import nextra from "nextra"

const withNextra = nextra({
    theme: "nextra-theme-docs",
    themeConfig: "./theme.config.tsx",
    defaultShowCopyCode: true,
    readingTime: true,
    flexsearch: {
        codeblocks: false,
    },
})

export default withNextra({
    reactStrictMode: true,
    eslint: {
        // Eslint behaves weirdly in this monorepo.
        ignoreDuringBuilds: true,
    },
})
