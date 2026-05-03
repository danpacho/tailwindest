import path from "node:path"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { tailwindest } from "../../src/vite"

const fixtureRoot = fileURLToPath(new URL(".", import.meta.url))
const e2eRoot = path.resolve(fixtureRoot, "..")
const sharedRoot = path.resolve(fixtureRoot, "../design-system/shared")

export default defineConfig({
    root: fixtureRoot,
    logLevel: "error",
    resolve: {
        alias: {
            "tailwindest-core": path.resolve(
                fixtureRoot,
                "../../../tailwindest-core/src/index.ts"
            ),
            react: path.resolve(fixtureRoot, "../../../../node_modules/react"),
            "react/jsx-runtime": path.resolve(
                fixtureRoot,
                "../../../../node_modules/react/jsx-runtime.js"
            ),
            "react-dom": path.resolve(
                fixtureRoot,
                "../../../../node_modules/react-dom"
            ),
            "react-dom/client": path.resolve(
                fixtureRoot,
                "../../../../node_modules/react-dom/client.js"
            ),
            tailwindest: path.resolve(
                fixtureRoot,
                "../../../tailwindest/src/index.ts"
            ),
        },
        dedupe: ["react", "react-dom"],
    },
    server: {
        host: "127.0.0.1",
        fs: {
            allow: [e2eRoot, path.resolve(fixtureRoot, "../../../..")],
        },
        watch: {
            ignored: ["**/.tailwindest/**"],
        },
    },
    build: {
        emptyOutDir: true,
        outDir: "dist",
    },
    plugins: [
        tailwindest({
            include: [
                /design-system-vite\/src\/.*\.[cm]?[jt]sx?$/,
                /design-system\/shared\/design_system_fixture\.tsx$/,
            ],
            cssEntries: [/design-system-vite\/src\/style\.css$/],
            scanRoots: [path.resolve(fixtureRoot, "src"), sharedRoot],
            debug: true,
            sourceMap: true,
            collectStringLiteralCandidates: false,
        }),
        tailwindcss(),
        react(),
    ],
})
