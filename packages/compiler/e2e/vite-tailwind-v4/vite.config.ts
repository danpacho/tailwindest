import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import { tailwindest } from "../../src/vite"

export default defineConfig({
    root: __dirname,
    logLevel: "error",
    resolve: {
        alias: {
            tailwindest: path.resolve(__dirname, "src/runtime-tailwindest.ts"),
        },
    },
    build: {
        emptyOutDir: true,
        outDir: "dist",
        sourcemap: true,
        rollupOptions: {
            input: {
                app: path.resolve(__dirname, "index.html"),
                compiled: path.resolve(__dirname, "src/compiled-entry.ts"),
            },
        },
    },
    plugins: [
        tailwindest({
            include: [/src\/.*\.[cm]?[jt]sx?$/],
            cssEntries: [/src\/style\.css$/],
            mode: "loose",
            debug: true,
            sourceMap: true,
        }),
        tailwindcss(),
    ],
})
