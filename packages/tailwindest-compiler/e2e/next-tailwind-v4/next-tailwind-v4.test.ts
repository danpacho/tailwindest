import path from "node:path"
import { describe, it } from "vitest"
import {
    assertBuiltCssContract,
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
const nextBin = path.join(repoRoot, "node_modules/.bin/next")
const tsxBin = path.join(repoRoot, "node_modules/.bin/tsx")

describe("Next.js App Router + Tailwind v4 framework parity", () => {
    it("converges webpack dev and production visuals through the Next precompile bridge", async () => {
        await assertFixtureRoot(fixtureRoot)
        await cleanPaths([
            path.join(fixtureRoot, "app"),
            path.join(fixtureRoot, ".next"),
            path.join(fixtureRoot, ".tailwindest"),
        ])
        const screenshots = await prepareScreenshotArtifacts(fixtureRoot)

        await runCommand({
            cwd: fixtureRoot,
            command: tsxBin,
            args: ["precompile-tailwindest.ts"],
        })

        const devPort = await findFreePort()
        const prodPort = await findFreePort()
        const dev = await startServer({
            cwd: fixtureRoot,
            command: nextBin,
            args: [
                "dev",
                "--webpack",
                "-H",
                "127.0.0.1",
                "-p",
                String(devPort),
            ],
            url: `http://127.0.0.1:${devPort}/`,
            timeoutMs: 120_000,
        })
        try {
            await runCommand({
                cwd: fixtureRoot,
                command: nextBin,
                args: ["build", "--webpack"],
                timeoutMs: 180_000,
            })
            const prod = await startServer({
                cwd: fixtureRoot,
                command: nextBin,
                args: ["start", "-H", "127.0.0.1", "-p", String(prodPort)],
                url: `http://127.0.0.1:${prodPort}/`,
                timeoutMs: 90_000,
            })
            try {
                await withBrowser(async (browser) => {
                    const devSnapshot = await captureVisualSnapshot(
                        browser,
                        dev.url,
                        {
                            screenshotPath: path.join(screenshots, "dev.png"),
                        }
                    )
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
        } finally {
            await dev.stop()
        }

        assertManifestContract(await readDebugManifest(fixtureRoot))
        await assertBuiltCssContract(fixtureRoot, ".next")
        await assertZeroRuntimeClientAssets(fixtureRoot, ".next/static")
    }, 240_000)
})
