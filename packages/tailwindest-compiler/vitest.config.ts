import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
    resolve: {
        alias: {
            "tailwindest-core": fileURLToPath(
                new URL("../tailwindest-core/src/index.ts", import.meta.url)
            ),
            "tailwindest-tailwind-internal": fileURLToPath(
                new URL("../tailwind-internal/src/index.ts", import.meta.url)
            ),
        },
    },
    test: {
        root: ".",
        fileParallelism: false,
        testTimeout: 60_000,
        hookTimeout: 60_000,
    },
})
