import { resolve } from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
    resolve: {
        alias: {
            "create-tailwind-type": resolve(
                __dirname,
                "../create-tailwind-type/src/index.ts"
            ),
        },
    },
    test: {
        root: ".",
        testTimeout: 60_000,
        hookTimeout: 60_000,
    },
})
