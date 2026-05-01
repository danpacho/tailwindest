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
const nextBin = path.join(repoRoot, "node_modules/.bin/next")
const tsxBin = path.join(repoRoot, "node_modules/.bin/tsx")

describe("Next App Router design-system E2E", () => {
    it("validates class-output lowering and runtime-preserved APIs across webpack dev and production", async () => {
        await runDesignSystemE2E({
            buildDir: ".next",
            fixtureRoot,
            framework: "next",
            prepare: async () => {
                await cleanPaths([
                    path.join(fixtureRoot, "app"),
                    path.join(fixtureRoot, ".next"),
                    path.join(fixtureRoot, ".tailwindest"),
                ])
                await runCommand({
                    cwd: fixtureRoot,
                    command: tsxBin,
                    args: ["precompile-tailwindest.ts"],
                })
            },
            startDev: async (port) =>
                startServer({
                    cwd: fixtureRoot,
                    command: nextBin,
                    args: [
                        "dev",
                        "--webpack",
                        "-H",
                        "127.0.0.1",
                        "-p",
                        String(port),
                    ],
                    url: `http://127.0.0.1:${port}/`,
                    timeoutMs: 120_000,
                }),
            build: async () => {
                await runCommand({
                    cwd: fixtureRoot,
                    command: nextBin,
                    args: ["build", "--webpack"],
                    timeoutMs: 180_000,
                })
            },
            startProd: async (port) =>
                startServer({
                    cwd: fixtureRoot,
                    command: nextBin,
                    args: ["start", "-H", "127.0.0.1", "-p", String(port)],
                    url: `http://127.0.0.1:${port}/`,
                    timeoutMs: 90_000,
                }),
        })
    }, 240_000)
})
