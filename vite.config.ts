import { defineConfig } from "vite"

import dts from "vite-plugin-dts"

import { resolve } from "path"

export default defineConfig({
    plugins: [dts()],
    build: {
        lib: {
            entry: resolve(__dirname, "packages/index.ts"),
            name: "tailwindest",
            formats: ["es", "umd"],
            fileName: (format: string) => `tailwindest.${format}.js`,
        },
    },
})
