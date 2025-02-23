import { defineConfig } from "tsup"

export default defineConfig((options) => ({
    entry: {
        index: "src/index.ts",
    },
    watch: options.watch ? ["src/**/*"] : false,
    clean: false,
    dts: true,
    outDir: "dist",
    target: "esnext",
    format: ["esm"],
    sourcemap: false,
}))
