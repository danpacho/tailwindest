import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src/index.ts", "src/cli.ts"],
    format: ["esm"],
    outDir: "dist",
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    bundle: true,
    shims: true,
    treeshake: true,
    platform: "node",
    // Mark ALL dependencies as external to avoid bundling issues with dynamic requires
    external: [
        "ts-morph",
        "prettier",
        "commander",
        "@clack/prompts",
        "picocolors",
        "tailwindcss",
        "lightningcss",
        "postcss",
        "jiti",
        "enhanced-resolve",
        "graceful-fs",
        "create-tailwind-type", // Externalize the workspace package too
    ],
})
