import path from "node:path"
import { describe, it } from "vitest"
import {
    cleanPaths,
    findFreePort,
    runCommand,
    runDesignSystemE2E,
    startServer,
} from "../design-system/shared/design_system_harness"

const fixtureRoot = path.resolve(__dirname)
const repoRoot = path.resolve(fixtureRoot, "../../../..")
const viteBin = path.join(repoRoot, "node_modules/.bin/vite")

describe("TanStack Start design-system E2E", () => {
    it("compiles every createTools API across dev and production", async () => {
        await runDesignSystemE2E({
            buildDir: "dist",
            devCssPath: "@tanstack-start/styles.css?routes=__root__%2C%2F",
            fixtureRoot,
            framework: "tanstack-start",
            zeroRuntimeDir: "dist/client",
            prepare: () =>
                cleanPaths([
                    path.join(fixtureRoot, "dist"),
                    path.join(fixtureRoot, ".tailwindest"),
                ]),
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
                }),
            build: async () => {
                await runCommand({
                    cwd: fixtureRoot,
                    command: viteBin,
                    args: ["build", "--config", "vite.config.ts"],
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
                }),
        })
    }, 180_000)
})
