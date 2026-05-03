import { defineConfig } from "tsup"

export default defineConfig((options) => ({
    entry: {
        index: "src/index.ts",
        cli: "src/cli.ts",
    },
    watch: options.watch ? ["src/**/*"] : false,
    noExternal: ["@tailwindest/tailwind-internal"],
    clean: false,
    dts: true,
    outDir: "dist",
    target: "esnext",
    format: ["esm"],
    sourcemap: false,
}))
