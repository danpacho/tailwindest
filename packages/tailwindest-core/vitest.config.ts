import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
    resolve: {
        alias: {
            "tailwindest-core": fileURLToPath(
                new URL("./src/index.ts", import.meta.url)
            ),
            tailwindest: fileURLToPath(
                new URL("../tailwindest/src/index.ts", import.meta.url)
            ),
        },
    },
    test: {
        root: ".",
        testTimeout: 60_000,
        hookTimeout: 60_000,
    },
})
