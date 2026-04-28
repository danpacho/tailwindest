import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src/index.ts", "src/vite/index.ts"],
    format: ["esm"],
    external: ["typescript"],
    outDir: "dist",
    outExtension: () => ({ js: ".mjs" }),
    dts: true,
    clean: true,
    target: "esnext",
})
