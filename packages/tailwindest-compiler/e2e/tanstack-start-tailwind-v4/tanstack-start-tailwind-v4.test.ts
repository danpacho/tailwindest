import path from "node:path"
import { describe, it } from "vitest"
import {
    assertBuiltCssContract,
    assertDevCssEndpointContract,
    assertFixtureRoot,
    assertManifestContract,
    assertVisualParity,
    assertZeroRuntimeClientAssets,
    captureDebugManifestScreenshot,
    captureVisualSnapshot,
    cleanPaths,
    findFreePort,
    prepareScreenshotArtifacts,
    readDebugManifest,
    runCommand,
    startServer,
    withBrowser,
} from "../shared/framework_harness"

const fixtureRoot = path.resolve(__dirname)
const repoRoot = path.resolve(fixtureRoot, "../../../..")
const viteBin = path.join(repoRoot, "node_modules/.bin/vite")
const viteSourceConfigEnv = {
    NODE_OPTIONS: [process.env.NODE_OPTIONS, "--import tsx"]
        .filter(Boolean)
        .join(" "),
    TSX_TSCONFIG_PATH: path.join(repoRoot, "tsconfig.json"),
}

describe("TanStack Start + Tailwind v4 framework parity", () => {
    it("converges dev and production visuals with class-output lowering", async () => {
        await assertFixtureRoot(fixtureRoot)
        await cleanPaths([
            path.join(fixtureRoot, "dist"),
            path.join(fixtureRoot, ".tailwindest"),
        ])
        const screenshots = await prepareScreenshotArtifacts(fixtureRoot)

        const devPort = await findFreePort()
        const dev = await startServer({
            cwd: fixtureRoot,
            command: viteBin,
            args: [
                "--host",
                "127.0.0.1",
                "--port",
                String(devPort),
                "--strictPort",
                "--config",
                "vite.config.ts",
                "--configLoader",
                "native",
            ],
            env: viteSourceConfigEnv,
            url: `http://127.0.0.1:${devPort}/`,
        })
        const devSnapshot = await (async () => {
            try {
                await assertDevCssEndpointContract(
                    `${dev.url}@tanstack-start/styles.css?routes=__root__%2C%2F`
                )
                return await withBrowser((browser) =>
                    captureVisualSnapshot(browser, dev.url, {
                        screenshotPath: path.join(screenshots, "dev.png"),
                    })
                )
            } finally {
                await dev.stop()
            }
        })()

        await runCommand({
            cwd: fixtureRoot,
            command: viteBin,
            args: [
                "build",
                "--config",
                "vite.config.ts",
                "--configLoader",
                "native",
            ],
            env: viteSourceConfigEnv,
        })

        const prodPort = await findFreePort()
        const prod = await startServer({
            cwd: fixtureRoot,
            command: viteBin,
            args: [
                "preview",
                "--host",
                "127.0.0.1",
                "--port",
                String(prodPort),
                "--strictPort",
                "--config",
                "vite.config.ts",
                "--configLoader",
                "native",
            ],
            env: viteSourceConfigEnv,
            url: `http://127.0.0.1:${prodPort}/`,
        })
        try {
            await withBrowser(async (browser) => {
                const prodSnapshot = await captureVisualSnapshot(
                    browser,
                    prod.url,
                    {
                        screenshotPath: path.join(screenshots, "prod.png"),
                    }
                )
                assertVisualParity(devSnapshot, prodSnapshot)
                await captureDebugManifestScreenshot(
                    browser,
                    fixtureRoot,
                    path.join(screenshots, "debug.png")
                )
            })
        } finally {
            await prod.stop()
        }

        assertManifestContract(await readDebugManifest(fixtureRoot))
        await assertBuiltCssContract(fixtureRoot, "dist")
        await assertZeroRuntimeClientAssets(fixtureRoot, "dist")
    }, 180_000)
})
