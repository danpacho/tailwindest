import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    outDir: "dist",
    dts: true,
    clean: true,
    target: "esnext",
})
