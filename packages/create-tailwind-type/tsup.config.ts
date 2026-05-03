import { defineConfig } from "tsup"

export default defineConfig((options) => ({
    entry: {
        index: "src/index.ts",
        cli: "src/cli.ts",
    },
    watch: options.watch ? ["src/**/*"] : false,
    external: [
        "tailwindest-tailwind-internal",
        "commander",
        "boxen",
        "chalk",
        "postcss",
        "prettier",
        "prettier-plugin-jsdoc",
        "tailwindcss",
        "@clack/prompts",
        "picocolors",
    ],
    clean: false,
    dts: true,
    outDir: "dist",
    target: "esnext",
    format: ["esm"],
    sourcemap: false,
}))
