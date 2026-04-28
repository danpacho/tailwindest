import path from "node:path"
import { describe, it } from "vitest"
import {
    cleanPaths,
    runCommand,
    runDesignSystemE2E,
    startServer,
} from "../design-system/shared/design_system_harness"

const fixtureRoot = path.resolve(__dirname)
const repoRoot = path.resolve(fixtureRoot, "../../../..")
const viteBin = path.join(repoRoot, "node_modules/.bin/vite")

describe("Vite design-system E2E", () => {
    it("compiles every createTools API across dev and production", async () => {
        await cleanPaths([
            path.join(fixtureRoot, "dist"),
            path.join(fixtureRoot, ".tailwindest"),
        ])

        await runDesignSystemE2E({
            fixtureRoot,
            framework: "vite",
            buildDir: "dist",
            devCssPath: "src/style.css",
            startDev: async (port) =>
                startServer({
                    cwd: fixtureRoot,
                    command: viteBin,
                    args: [
                        "--host",
                        "127.0.0.1",
                        "--port",
                        String(port),
                        "--strictPort",
                        "--config",
                        "vite.config.ts",
                    ],
                    url: `http://127.0.0.1:${port}/`,
                    timeoutMs: 90_000,
                }),
            build: async () => {
                await runCommand({
                    cwd: fixtureRoot,
                    command: viteBin,
                    args: ["build", "--config", "vite.config.ts"],
                    timeoutMs: 120_000,
                })
            },
            startProd: async (port) =>
                startServer({
                    cwd: fixtureRoot,
                    command: viteBin,
                    args: [
                        "preview",
                        "--host",
                        "127.0.0.1",
                        "--port",
                        String(port),
                        "--strictPort",
                        "--config",
                        "vite.config.ts",
                    ],
                    url: `http://127.0.0.1:${port}/`,
                    timeoutMs: 60_000,
                }),
        })
    }, 240_000)
})
