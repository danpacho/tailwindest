import path from "node:path"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import { tailwindest } from "../../src/vite"

const fixtureRoot = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
    root: fixtureRoot,
    logLevel: "error",
    resolve: {
        alias: {
            "@tailwindest/core": path.resolve(
                fixtureRoot,
                "../../../tailwindest-core/src/index.ts"
            ),
            tailwindest: path.resolve(
                fixtureRoot,
                "src/runtime-tailwindest.ts"
            ),
        },
    },
    build: {
        emptyOutDir: true,
        outDir: "dist",
        sourcemap: true,
        rollupOptions: {
            input: {
                app: path.resolve(fixtureRoot, "index.html"),
                compiled: path.resolve(fixtureRoot, "src/compiled-entry.ts"),
            },
        },
    },
    plugins: [
        tailwindest({
            include: [/src\/.*\.[cm]?[jt]sx?$/],
            cssEntries: [/src\/style\.css$/],
            debug: true,
            sourceMap: true,
        }),
        tailwindcss(),
    ],
})
