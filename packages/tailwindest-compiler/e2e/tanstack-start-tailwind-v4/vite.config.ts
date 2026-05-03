import path from "node:path"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { tailwindest } from "../../src/vite"

const fixtureRoot = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
    root: fixtureRoot,
    logLevel: "error",
    resolve: {
        alias: {
            "tailwindest-core": path.resolve(
                fixtureRoot,
                "../../../tailwindest-core/src/index.ts"
            ),
            tailwindest: path.resolve(
                fixtureRoot,
                "../../../tailwindest/src/index.ts"
            ),
        },
    },
    server: {
        host: "127.0.0.1",
    },
    build: {
        emptyOutDir: true,
        outDir: "dist",
    },
    plugins: [
        tailwindest({
            include: [/src\/.*\.[cm]?[jt]sx?$/],
            cssEntries: [/src\/style\.css$/],
            debug: true,
            sourceMap: true,
        }),
        tailwindcss(),
        tanstackStart(),
        viteReact(),
    ],
})
