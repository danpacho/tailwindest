import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        root: ".",
        testTimeout: 60_000,
        hookTimeout: 60_000,
    },
})
