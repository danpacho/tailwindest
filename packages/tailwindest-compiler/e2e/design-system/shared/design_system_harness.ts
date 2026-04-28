import fs from "node:fs/promises"
import path from "node:path"
import { type Browser, type Page } from "@playwright/test"
import { expect } from "vitest"
import {
    allExpectedCandidates,
    allExpectedExcludedCandidates,
    expectedDesignSystemCases,
    expectedSectionNames,
    zeroRuntimeForbiddenTokens,
} from "./design_system_expectations"
import {
    cleanPaths,
    findFreePort,
    runCommand,
    startServer,
    withBrowser,
} from "../../shared/framework_harness"

export { cleanPaths, findFreePort, runCommand, startServer, withBrowser }

export interface DesignSystemRunOptions {
    buildDir: string
    devCssPath?: string
    fixtureRoot: string
    framework: "vite" | "tanstack-start" | "next"
    prepare?: () => Promise<void>
    startDev: (
        port: number
    ) => Promise<{ url: string; stop: () => Promise<void> }>
    build: () => Promise<void>
    startProd: (
        port: number
    ) => Promise<{ url: string; stop: () => Promise<void> }>
    zeroRuntimeDir?: string
}

type ComputedSnapshot = Record<string, StyleSnapshot>

interface StyleSnapshot {
    backgroundColor: string
    borderColor: string
    boxShadow: string
    color: string
    cursor: string
    height: string
    opacity: string
    outlineStyle: string
    paddingLeft: string
    paddingRight: string
    width: string
}

const computedTestIds = [
    "case-style-class",
    "dynamic-toggle-preview",
    "dynamic-rotary-preview",
    "dynamic-variants-preview",
    "case-style-compose",
    "case-merge-record",
] as const

export async function runDesignSystemE2E(
    options: DesignSystemRunOptions
): Promise<void> {
    await options.prepare?.()
    const screenshots = await prepareDesignSystemScreenshots(
        options.fixtureRoot,
        options.framework
    )

    const devPort = await findFreePort()
    const prodPort = await findFreePort()
    const dev = await options.startDev(devPort)
    try {
        await options.build()
        const prod = await options.startProd(prodPort)
        try {
            await withBrowser(async (browser) => {
                const devSnapshot = await captureOverview({
                    browser,
                    url: dev.url,
                    screenshotPath: path.join(screenshots, "dev-overview.png"),
                })
                await captureInteractions({
                    browser,
                    url: dev.url,
                    screenshotPath: path.join(
                        screenshots,
                        "dev-interactions.png"
                    ),
                })
                const prodSnapshot = await captureOverview({
                    browser,
                    url: prod.url,
                    screenshotPath: path.join(screenshots, "prod-overview.png"),
                })
                expect(prodSnapshot).toEqual(devSnapshot)
                await captureInteractions({
                    browser,
                    url: prod.url,
                    screenshotPath: path.join(
                        screenshots,
                        "prod-interactions.png"
                    ),
                })
                await captureMobileOverview({
                    browser,
                    url: prod.url,
                    screenshotPath: path.join(
                        screenshots,
                        "mobile-prod-overview.png"
                    ),
                })
                await assertVariantVisualSemantics(browser, prod.url)
                await captureDebugManifestScreenshot(
                    browser,
                    options.fixtureRoot,
                    path.join(screenshots, "debug-manifest.png")
                )
            })
            if (options.devCssPath) {
                await assertDevCssEndpointContract(
                    `${dev.url}${options.devCssPath}`
                )
            }
        } finally {
            await prod.stop()
        }
    } finally {
        await dev.stop()
    }

    await assertDebugManifestContract(options.fixtureRoot)
    await assertBuiltCssContract(options.fixtureRoot, options.buildDir)
    await assertZeroRuntimeClientAssets(
        options.fixtureRoot,
        options.zeroRuntimeDir ?? options.buildDir
    )
    await assertScreenshotSet(screenshots)
}

async function captureOverview(input: {
    browser: Browser
    screenshotPath: string
    url: string
}): Promise<ComputedSnapshot> {
    const page = await input.browser.newPage({
        colorScheme: "light",
        viewport: { width: 1280, height: 900 },
    })
    try {
        await page.goto(input.url, { waitUntil: "load" })
        await assertPageContract(page)
        const snapshot = await readComputedSnapshot(page)
        await savePageScreenshot(page, input.screenshotPath)
        return snapshot
    } finally {
        await page.close()
    }
}

async function captureInteractions(input: {
    browser: Browser
    screenshotPath: string
    url: string
}): Promise<void> {
    const page = await input.browser.newPage({
        colorScheme: "light",
        viewport: { width: 1280, height: 900 },
    })
    try {
        await page.goto(input.url, { waitUntil: "load" })
        await assertDynamicControls(page)
        await savePageScreenshot(page, input.screenshotPath)
    } finally {
        await page.close()
    }
}

async function captureMobileOverview(input: {
    browser: Browser
    screenshotPath: string
    url: string
}): Promise<void> {
    const page = await input.browser.newPage({
        colorScheme: "light",
        viewport: { width: 390, height: 844 },
    })
    try {
        await page.goto(input.url, { waitUntil: "load" })
        await page.getByTestId("design-system-root").waitFor({
            state: "visible",
        })
        await savePageScreenshot(page, input.screenshotPath)
    } finally {
        await page.close()
    }
}

async function assertPageContract(page: Page): Promise<void> {
    await page.getByTestId("design-system-root").waitFor({ state: "visible" })
    for (const section of expectedSectionNames) {
        await expectElementCount(
            page,
            `[data-testid="section-${section.toLowerCase().replaceAll(" ", "-")}"]`,
            1
        )
    }

    const caseElements = await page
        .locator("[data-case]")
        .evaluateAll((nodes) =>
            nodes.map((node) => ({
                api: node.getAttribute("data-api"),
                caseId: node.getAttribute("data-case"),
                className: (node as HTMLElement).className,
                expectedClass: node.getAttribute("data-expected-class"),
                tokenGroup: node.getAttribute("data-expected-token-group"),
            }))
        )

    const seenApis = new Set<string>()
    for (const item of caseElements) {
        if (!item.caseId) throw new Error("Missing data-case.")
        const expected =
            expectedDesignSystemCases[
                item.caseId as keyof typeof expectedDesignSystemCases
            ]
        expect(expected).toBeTruthy()
        expect(item.api).toBe(expected.api)
        expect(item.tokenGroup).toBe(expected.tokenGroup)
        expect(item.expectedClass).toBeTruthy()
        seenApis.add(expected.api)
        expect(
            classTokens(item.expectedClass ?? "").every((token) =>
                classTokens(item.className).includes(token)
            ),
            `${item.caseId} className did not contain data-expected-class.`
        ).toBe(true)
    }

    for (const expected of Object.values(expectedDesignSystemCases)) {
        expect(seenApis.has(expected.api), `missing api ${expected.api}`).toBe(
            true
        )
    }

    const pageText = await page.locator("body").textContent()
    for (const token of zeroRuntimeForbiddenTokens) {
        expect(pageText ?? "").not.toContain(token)
    }
}

async function assertDynamicControls(page: Page): Promise<void> {
    await page.waitForFunction(
        () =>
            (
                window as typeof window & {
                    __tailwindestDesignSystemSync?: boolean
                }
            ).__tailwindestDesignSystemSync === true
    )
    const beforeNavigationCount = await page.evaluate(
        () => performance.getEntriesByType("navigation").length
    )

    const toggle = page.getByTestId("dynamic-toggle-preview")
    const toggleBefore = await toggle.evaluate((node) => node.className)
    const toggleColorBefore = await readStyleByTestId(
        page,
        "dynamic-toggle-preview"
    )
    await page.getByTestId("control-checked").click()
    await page.waitForFunction(
        (previous) =>
            document.querySelector('[data-testid="dynamic-toggle-preview"]')
                ?.className !== previous,
        toggleBefore
    )
    const toggleAfter = await toggle.evaluate((node) => node.className)
    const toggleColorAfter = await readStyleByTestId(
        page,
        "dynamic-toggle-preview"
    )
    expect(toggleAfter).not.toBe(toggleBefore)
    expect(toggleColorAfter.backgroundColor).not.toBe(
        toggleColorBefore.backgroundColor
    )

    await page.getByTestId("control-size").selectOption("giant")
    const rotaryPreview = await page
        .getByTestId("dynamic-rotary-preview")
        .evaluate((node) => node.className)
    const rotaryMatrix = await page
        .getByTestId("matrix-rotary-giant")
        .evaluate((node) => node.className)
    expect(rotaryPreview).toBe(rotaryMatrix)

    await page.getByTestId("control-size").selectOption("medium")
    await page.getByTestId("control-status").selectOption("danger")
    const dangerStyle = await readStyleByTestId(
        page,
        "dynamic-variants-preview"
    )
    await page.getByTestId("control-status").selectOption("primary")
    const primaryStyle = await readStyleByTestId(
        page,
        "dynamic-variants-preview"
    )
    expect(dangerStyle.backgroundColor).not.toBe(primaryStyle.backgroundColor)

    const dynamicClass = await page
        .getByTestId("dynamic-variants-preview")
        .evaluate((node) => node.className)
    const staticClass = await page
        .getByTestId("matrix-button-medium-primary-default")
        .evaluate((node) => node.className)
    expect(dynamicClass).toBe(staticClass)

    await page.getByTestId("control-disabled").click()
    await page.waitForFunction(() =>
        document
            .querySelector('[data-testid="dynamic-variants-preview"]')
            ?.className.includes("opacity-50")
    )
    await page.waitForTimeout(250)
    const disabledStyle = await readStyleByTestId(
        page,
        "dynamic-variants-preview"
    )
    expect(Number(disabledStyle.opacity)).toBeLessThan(1)
    expect(disabledStyle.cursor).toBe("not-allowed")

    await page.getByTestId("control-open").click()
    const openStyle = await readStyleByTestId(page, "case-merge-record")
    expect(openStyle.backgroundColor).not.toBe("rgba(0, 0, 0, 0)")

    const afterNavigationCount = await page.evaluate(
        () => performance.getEntriesByType("navigation").length
    )
    expect(afterNavigationCount).toBe(beforeNavigationCount)
}

async function assertVariantVisualSemantics(
    browser: Browser,
    url: string
): Promise<void> {
    const light = await browser.newPage({
        colorScheme: "light",
        viewport: { width: 1280, height: 900 },
    })
    try {
        await light.goto(url, { waitUntil: "load" })
        await light.waitForFunction(
            () =>
                (
                    window as typeof window & {
                        __tailwindestDesignSystemSync?: boolean
                    }
                ).__tailwindestDesignSystemSync === true
        )
        const base = await readStyleByTestId(light, "case-style-class")
        await light.getByTestId("control-open").click()
        await light.waitForFunction(
            () =>
                document
                    .querySelector('[data-testid="case-style-class"]')
                    ?.getAttribute("data-state") === "open"
        )
        const dataOpen = await readStyleByTestId(light, "case-style-class")
        expect(dataOpen.backgroundColor).not.toBe(base.backgroundColor)

        const composedBase = await readStyleByTestId(
            light,
            "case-style-compose"
        )
        await light.getByTestId("case-style-compose").hover()
        const groupHover = await readStyleByTestId(light, "case-style-compose")
        expect(groupHover.borderColor).not.toBe(composedBase.borderColor)

        await light.getByTestId("peer-focus-control").focus()
        const peerFocus = await readStyleByTestId(light, "case-style-compose")
        expect(peerFocus.color).not.toBe(composedBase.color)

        const checkboxBase = await readStyleByTestId(light, "case-toggle-style")
        await light.getByTestId("control-checked").click()
        await light.waitForFunction(
            () =>
                document
                    .querySelector('[data-testid="case-toggle-style"]')
                    ?.getAttribute("aria-checked") === "true"
        )
        const ariaChecked = await readStyleByTestId(light, "case-toggle-style")
        expect(ariaChecked.backgroundColor).not.toBe(
            checkboxBase.backgroundColor
        )
    } finally {
        await light.close()
    }

    const dark = await browser.newPage({
        colorScheme: "dark",
        viewport: { width: 1280, height: 900 },
    })
    try {
        await dark.goto(url, { waitUntil: "domcontentloaded" })
        const darkBase = await readStyleByTestId(dark, "case-style-class")
        await dark.getByTestId("case-style-class").hover()
        await dark.getByTestId("case-style-class").focus()
        const darkHoverFocus = await readStyleByTestId(dark, "case-style-class")
        expect(darkHoverFocus.backgroundColor).not.toBe(
            darkBase.backgroundColor
        )
        expect(darkHoverFocus.boxShadow).not.toBe("none")
    } finally {
        await dark.close()
    }
}

async function readComputedSnapshot(page: Page): Promise<ComputedSnapshot> {
    const entries = await Promise.all(
        computedTestIds.map(async (testId) => [
            testId,
            await readStyleByTestId(page, testId),
        ])
    )
    return Object.fromEntries(entries)
}

async function readStyleByTestId(
    page: Page,
    testId: string
): Promise<StyleSnapshot> {
    return page.getByTestId(testId).evaluate((node) => {
        const style = getComputedStyle(node)
        return {
            backgroundColor: style.backgroundColor,
            borderColor: style.borderColor,
            boxShadow: style.boxShadow,
            color: style.color,
            cursor: style.cursor,
            height: style.height,
            opacity: style.opacity,
            outlineStyle: style.outlineStyle,
            paddingLeft: style.paddingLeft,
            paddingRight: style.paddingRight,
            width: style.width,
        }
    })
}

export async function assertDebugManifestContract(
    fixtureRoot: string
): Promise<void> {
    const manifest = await readDebugManifest(fixtureRoot)
    const diagnostics = manifest.files.flatMap((file) => file.diagnostics)
    expect(
        diagnostics.filter(
            (item) =>
                item.severity === "error" ||
                item.modeBehavior === "strict-fails"
        ),
        "debug manifest contains strict diagnostics"
    ).toEqual([])
    expect(manifest.candidates).toEqual(
        expect.arrayContaining(allExpectedCandidates)
    )
    expect(manifest.excludedCandidates).toEqual(
        expect.arrayContaining(allExpectedExcludedCandidates)
    )
}

export async function assertBuiltCssContract(
    fixtureRoot: string,
    buildDir: string
): Promise<void> {
    const css = await readFilesByExtension(
        path.join(fixtureRoot, buildDir),
        ".css"
    )
    assertCssContract(css)
}

export async function assertDevCssEndpointContract(url: string): Promise<void> {
    const css = await fetchText(url)
    assertCssContract(css.replace(/\\\\/g, "\\"))
}

function assertCssContract(css: string): void {
    for (const candidate of allExpectedCandidates) {
        expect(css, `missing selector ${candidate}`).toContain(
            cssSelector(candidate)
        )
    }
    for (const candidate of allExpectedExcludedCandidates) {
        expect(css, `leaked raw selector ${candidate}`).not.toContain(
            cssSelector(candidate)
        )
    }
}

export async function assertZeroRuntimeClientAssets(
    fixtureRoot: string,
    buildDir: string
): Promise<void> {
    const js = await readFilesByExtension(
        path.join(fixtureRoot, buildDir),
        ".js"
    )
    for (const token of zeroRuntimeForbiddenTokens) {
        expect(js, `client JS contains ${token}`).not.toContain(token)
    }
}

async function captureDebugManifestScreenshot(
    browser: Browser,
    fixtureRoot: string,
    screenshotPath: string
): Promise<void> {
    const manifest = await readDebugManifest(fixtureRoot)
    const page = await browser.newPage({
        colorScheme: "light",
        viewport: { width: 1180, height: 860 },
    })
    try {
        await page.setContent(renderDebugManifestHtml(manifest), {
            waitUntil: "load",
        })
        await savePageScreenshot(page, screenshotPath)
    } finally {
        await page.close()
    }
}

async function readDebugManifest(fixtureRoot: string): Promise<{
    candidates: string[]
    excludedCandidates: string[]
    files: Array<{
        diagnostics: Array<{
            modeBehavior?: string
            severity?: string
        }>
    }>
}> {
    return JSON.parse(
        await fs.readFile(
            path.join(fixtureRoot, ".tailwindest/debug-manifest.json"),
            "utf8"
        )
    )
}

async function prepareDesignSystemScreenshots(
    fixtureRoot: string,
    framework: string
): Promise<string> {
    const outputDir = path.join(
        fixtureRoot,
        "..",
        ".artifacts",
        "design-system-screenshots",
        framework
    )
    await fs.rm(outputDir, { recursive: true, force: true })
    await fs.mkdir(outputDir, { recursive: true })
    return outputDir
}

async function assertScreenshotSet(directory: string): Promise<void> {
    for (const fileName of [
        "dev-overview.png",
        "debug-manifest.png",
        "prod-overview.png",
        "dev-interactions.png",
        "prod-interactions.png",
        "mobile-prod-overview.png",
    ]) {
        const file = path.join(directory, fileName)
        const stat = await fs.stat(file)
        expect(stat.size).toBeGreaterThan(1000)
    }
}

async function savePageScreenshot(
    page: Page,
    screenshotPath: string
): Promise<void> {
    await fs.mkdir(path.dirname(screenshotPath), { recursive: true })
    await page.screenshot({ path: screenshotPath, fullPage: true })
}

async function expectElementCount(
    page: Page,
    selector: string,
    count: number
): Promise<void> {
    expect(await page.locator(selector).count(), selector).toBe(count)
}

function renderDebugManifestHtml(manifest: {
    candidates: string[]
    excludedCandidates: string[]
}): string {
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Tailwindest Design System Manifest</title>
<style>
body{margin:0;padding:24px;background:#f8fafc;color:#0f172a;font-family:ui-sans-serif,system-ui,sans-serif}
main{max-width:1120px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
section{border:1px solid #cbd5e1;background:white;border-radius:8px;padding:16px}
li{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;line-height:1.6}
</style>
</head>
<body>
<main>
<h1>Tailwindest Design System Manifest</h1>
<div class="grid">
<section><h2>Candidates ${manifest.candidates.length}</h2><ul>${manifest.candidates
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("")}</ul></section>
<section><h2>Excluded ${manifest.excludedCandidates.length}</h2><ul>${manifest.excludedCandidates
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("")}</ul></section>
</div>
</main>
</body>
</html>`
}

async function readFilesByExtension(
    root: string,
    extension: string
): Promise<string> {
    const files: string[] = []
    await walk(root, extension, files)
    const contents = await Promise.all(
        files.map((file) => fs.readFile(file, "utf8"))
    )
    return contents.join("\n")
}

async function walk(
    directory: string,
    extension: string,
    files: string[]
): Promise<void> {
    const entries = await fs.readdir(directory, { withFileTypes: true })
    for (const entry of entries) {
        const resolved = path.join(directory, entry.name)
        if (entry.isDirectory()) {
            await walk(resolved, extension, files)
        } else if (entry.isFile() && resolved.endsWith(extension)) {
            files.push(resolved)
        }
    }
}

async function fetchText(url: string): Promise<string> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: HTTP ${response.status}`)
    }
    return response.text()
}

function classTokens(className: string): string[] {
    return className.split(/\s+/).filter(Boolean)
}

function cssSelector(candidate: string): string {
    return `.${candidate
        .replace(/\\/g, "\\\\")
        .replace(/:/g, "\\:")
        .replace(/\[/g, "\\[")
        .replace(/\]/g, "\\]")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)")
        .replace(/=/g, "\\=")}`
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}
