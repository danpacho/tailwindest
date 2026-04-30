import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src/index.ts", "src/vite/index.ts"],
    format: ["esm"],
    external: [
        "@tailwindest/core",
        "@tailwindest/tailwind-internal",
        "typescript",
    ],
    outDir: "dist",
    outExtension: () => ({ js: ".mjs" }),
    dts: true,
    clean: true,
    target: "esnext",
    tsconfig: "tsconfig.build.json",
})
