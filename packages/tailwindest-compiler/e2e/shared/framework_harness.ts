import { spawn, type ChildProcessByStdio } from "node:child_process"
import fs from "node:fs/promises"
import net from "node:net"
import path from "node:path"
import { type Readable } from "node:stream"
import { chromium, type Browser, type Page } from "@playwright/test"
import { expect } from "vitest"

export interface ServerHandle {
    url: string
    stop: () => Promise<void>
}

export interface VisualSnapshot {
    className: string
    light: {
        base: StyleSnapshot
        groupHover: StyleSnapshot
        peerFocus: StyleSnapshot
    }
    dark: {
        base: StyleSnapshot
        hoverFocus: StyleSnapshot
    }
}

export interface StyleSnapshot {
    backgroundColor: string
    borderColor: string
    color: string
    paddingLeft: string
    paddingRight: string
}

export interface VisualCaptureOptions {
    screenshotPath?: string
}

const RUNTIME_TOKENS = [
    "createTools",
    "PrimitiveStyler",
    "ToggleStyler",
    "RotaryStyler",
    "VariantsStyler",
]
const RAW_NESTED_LEAF_CANDIDATES = [
    "bg-red-900",
    "bg-red-950",
    "border-blue-500",
    "px-6",
    "text-sky-600",
    "text-white",
]

type PipedChildProcess = ChildProcessByStdio<null, Readable, Readable>

export async function assertFixtureRoot(fixtureRoot: string): Promise<void> {
    await expectPath(path.join(fixtureRoot, "README.md"))
}

export async function cleanPaths(paths: string[]): Promise<void> {
    await Promise.all(
        paths.map((target) =>
            fs.rm(target, {
                recursive: true,
                force: true,
            })
        )
    )
}

export async function prepareScreenshotArtifacts(
    fixtureRoot: string
): Promise<string> {
    const outputDir = path.join(
        fixtureRoot,
        "..",
        ".artifacts",
        "framework-screenshots",
        path.basename(fixtureRoot)
    )
    await fs.rm(outputDir, { recursive: true, force: true })
    await fs.mkdir(outputDir, { recursive: true })
    return outputDir
}

export async function findFreePort(): Promise<number> {
    return new Promise((resolve, reject) => {
        const server = net.createServer()
        server.once("error", reject)
        server.listen(0, "127.0.0.1", () => {
            const address = server.address()
            if (!address || typeof address === "string") {
                server.close(() =>
                    reject(new Error("Unable to allocate a TCP port."))
                )
                return
            }
            const port = address.port
            server.close(() => resolve(port))
        })
    })
}

export async function runCommand(input: {
    cwd: string
    command: string
    args: string[]
    env?: NodeJS.ProcessEnv
    timeoutMs?: number
}): Promise<string> {
    const child = spawn(input.command, input.args, {
        cwd: input.cwd,
        env: { ...process.env, ...input.env },
        stdio: ["ignore", "pipe", "pipe"],
    })
    return collectProcess(child, input.timeoutMs ?? 120_000)
}

export async function startServer(input: {
    cwd: string
    command: string
    args: string[]
    url: string
    env?: NodeJS.ProcessEnv
    timeoutMs?: number
}): Promise<ServerHandle> {
    const child = spawn(input.command, input.args, {
        cwd: input.cwd,
        env: { ...process.env, ...input.env },
        stdio: ["ignore", "pipe", "pipe"],
    })
    const logs: string[] = []
    child.stdout.on("data", (chunk) => logs.push(String(chunk)))
    child.stderr.on("data", (chunk) => logs.push(String(chunk)))

    try {
        await waitForUrl(input.url, input.timeoutMs ?? 60_000)
    } catch (error) {
        await stopProcess(child)
        throw new Error(
            `Server did not become ready at ${input.url}.\n${formatLogs(logs)}\n${String(
                error
            )}`
        )
    }

    return {
        url: input.url,
        stop: async () => {
            await stopProcess(child)
        },
    }
}

export async function withBrowser<T>(
    callback: (browser: Browser) => Promise<T>
): Promise<T> {
    const browser = await chromium.launch()
    try {
        return await callback(browser)
    } finally {
        await browser.close()
    }
}

export async function captureVisualSnapshot(
    browser: Browser,
    url: string,
    options: VisualCaptureOptions = {}
): Promise<VisualSnapshot> {
    const lightPage = await browser.newPage({ colorScheme: "light" })
    try {
        await lightPage.goto(url, { waitUntil: "domcontentloaded" })
        const target = lightPage.getByTestId("twtarget")
        await target.waitFor({ state: "visible" })
        const className = await target.evaluate((node) => node.className)
        const base = await readTargetStyle(lightPage)

        await hoverByMouse(lightPage, "twpeer")
        const groupHover = await readTargetStyle(lightPage)

        await lightPage.mouse.move(0, 0)
        await focusByKeyboard(lightPage, 1)
        const peerFocus = await readTargetStyle(lightPage)

        const darkPage = await browser.newPage({ colorScheme: "dark" })
        try {
            await darkPage.goto(url, { waitUntil: "domcontentloaded" })
            await darkPage.getByTestId("twtarget").waitFor({ state: "visible" })
            const darkBase = await readTargetStyle(darkPage)
            await hoverByMouse(darkPage, "twtarget")
            await focusByKeyboard(darkPage, 2)
            const hoverFocus = await readTargetStyle(darkPage)
            if (options.screenshotPath) {
                await savePageScreenshot(darkPage, options.screenshotPath)
            }

            return {
                className,
                light: {
                    base,
                    groupHover,
                    peerFocus,
                },
                dark: {
                    base: darkBase,
                    hoverFocus,
                },
            }
        } finally {
            await darkPage.close()
        }
    } finally {
        await lightPage.close()
    }
}

export async function captureDebugManifestScreenshot(
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

export function assertVisualParity(
    dev: VisualSnapshot,
    prod: VisualSnapshot
): void {
    expect(prod).toEqual(dev)
    expect(dev.className).toContain("dark:bg-red-900")
    expect(dev.className).toContain("dark:hover:bg-red-950")
    expect(dev.className).toContain("dark:hover:focus:text-white")
    expect(dev.className).toContain("group-hover:border-blue-500")
    expect(dev.className).toContain("peer-focus:text-sky-600")
    expect(dev.className).toContain("data-[state=open]:px-6")
    expect(dev.light.base.paddingLeft).toBe("24px")
    expect(dev.light.base.paddingRight).toBe("24px")
    expect(dev.light.groupHover.borderColor).not.toBe(
        dev.light.base.borderColor
    )
    expect(dev.light.peerFocus.color).not.toBe(dev.light.base.color)
    expect(dev.dark.base.backgroundColor).not.toBe(
        dev.light.base.backgroundColor
    )
    expect(dev.dark.hoverFocus.backgroundColor).not.toBe(
        dev.dark.base.backgroundColor
    )
    expect(dev.dark.hoverFocus.color).not.toBe(dev.dark.base.color)
}

export async function readDebugManifest(fixtureRoot: string): Promise<{
    candidates: string[]
    excludedCandidates: string[]
}> {
    return JSON.parse(
        await fs.readFile(
            path.join(fixtureRoot, ".tailwindest/debug-manifest.json"),
            "utf8"
        )
    )
}

export function assertManifestContract(manifest: {
    candidates: string[]
    excludedCandidates: string[]
}): void {
    expect(manifest.candidates).toEqual(
        expect.arrayContaining([
            "bg-red-50",
            "dark:bg-red-900",
            "dark:hover:bg-red-950",
            "dark:hover:focus:text-white",
            "group-hover:border-blue-500",
            "peer-focus:text-sky-600",
            "data-[state=open]:px-6",
        ])
    )
    expect(manifest.excludedCandidates).toEqual(
        expect.arrayContaining(RAW_NESTED_LEAF_CANDIDATES)
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
    assertCssContract(css)
}

function assertCssContract(css: string): void {
    expect(css).toContain(cssSelector("dark:bg-red-900"))
    expect(css).toContain(cssSelector("dark:hover:bg-red-950"))
    expect(css).toContain(cssSelector("group-hover:border-blue-500"))
    expect(css).toContain(cssSelector("peer-focus:text-sky-600"))
    expect(css).toContain(cssSelector("data-[state=open]:px-6"))
    for (const candidate of RAW_NESTED_LEAF_CANDIDATES) {
        expect(css).not.toContain(cssSelector(candidate))
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
    for (const token of RUNTIME_TOKENS) {
        expect(js).not.toContain(token)
    }
}

async function readTargetStyle(page: Page): Promise<StyleSnapshot> {
    return page.getByTestId("twtarget").evaluate((node) => {
        const style = getComputedStyle(node)
        return {
            backgroundColor: style.backgroundColor,
            borderColor: style.borderColor,
            color: style.color,
            paddingLeft: style.paddingLeft,
            paddingRight: style.paddingRight,
        }
    })
}

async function hoverByMouse(page: Page, testId: string): Promise<void> {
    const box = await page.getByTestId(testId).boundingBox()
    if (!box) {
        throw new Error(`Unable to locate visible test id: ${testId}`)
    }
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
}

async function focusByKeyboard(page: Page, tabPresses: number): Promise<void> {
    for (let index = 0; index < tabPresses; index += 1) {
        await page.keyboard.press("Tab")
    }
}

async function savePageScreenshot(
    page: Page,
    screenshotPath: string
): Promise<void> {
    await fs.mkdir(path.dirname(screenshotPath), { recursive: true })
    await page.screenshot({ path: screenshotPath, fullPage: true })
}

function renderDebugManifestHtml(manifest: {
    candidates: string[]
    excludedCandidates: string[]
}): string {
    const candidateItems = manifest.candidates
        .map((candidate) => `<li>${escapeHtml(candidate)}</li>`)
        .join("")
    const excludedItems = manifest.excludedCandidates
        .map((candidate) => `<li>${escapeHtml(candidate)}</li>`)
        .join("")
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Tailwindest Debug Manifest</title>
<style>
body {
    margin: 0;
    padding: 32px;
    background: #f8fafc;
    color: #0f172a;
    font-family: ui-sans-serif, system-ui, sans-serif;
}
main { max-width: 1080px; }
h1 { margin: 0 0 8px; font-size: 30px; }
p { margin: 0 0 24px; color: #475569; }
.grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}
section {
    background: white;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 20px;
}
h2 { margin: 0 0 12px; font-size: 18px; }
ul { margin: 0; padding-left: 20px; line-height: 1.8; }
li { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.count {
    display: inline-block;
    margin-left: 8px;
    color: #64748b;
    font-size: 14px;
}
</style>
</head>
<body>
<main>
<h1>Tailwindest Debug Manifest</h1>
<p>Generated by the framework parity E2E test from the active compiler manifest.</p>
<div class="grid">
<section>
<h2>Candidates <span class="count">${manifest.candidates.length}</span></h2>
<ul>${candidateItems}</ul>
</section>
<section>
<h2>Excluded Raw Leaves <span class="count">${manifest.excludedCandidates.length}</span></h2>
<ul>${excludedItems}</ul>
</section>
</div>
</main>
</body>
</html>`
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
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

async function expectPath(target: string): Promise<void> {
    try {
        await fs.access(target)
    } catch {
        throw new Error(`Expected fixture file to exist: ${target}`)
    }
}

async function waitForUrl(url: string, timeoutMs: number): Promise<void> {
    const start = Date.now()
    let lastError: unknown
    while (Date.now() - start < timeoutMs) {
        try {
            const response = await fetch(url)
            if (response.status < 500) {
                return
            }
            lastError = new Error(`HTTP ${response.status}`)
        } catch (error) {
            lastError = error
        }
        await delay(250)
    }
    throw lastError ?? new Error(`Timed out waiting for ${url}`)
}

async function fetchText(url: string): Promise<string> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: HTTP ${response.status}`)
    }
    return response.text()
}

async function collectProcess(
    child: PipedChildProcess,
    timeoutMs: number
): Promise<string> {
    const logs: string[] = []
    child.stdout.on("data", (chunk) => logs.push(String(chunk)))
    child.stderr.on("data", (chunk) => logs.push(String(chunk)))
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            stopProcess(child).then(() =>
                reject(
                    new Error(
                        `Command timed out after ${timeoutMs}ms.\n${formatLogs(
                            logs
                        )}`
                    )
                )
            )
        }, timeoutMs)
        child.on("error", (error) => {
            clearTimeout(timeout)
            reject(error)
        })
        child.on("close", (code) => {
            clearTimeout(timeout)
            const output = formatLogs(logs)
            if (code === 0) {
                resolve(output)
            } else {
                reject(
                    new Error(
                        `Command failed with exit code ${code}.\n${output}`
                    )
                )
            }
        })
    })
}

async function stopProcess(child: PipedChildProcess): Promise<void> {
    if (child.exitCode !== null || child.killed) {
        return
    }
    child.kill("SIGTERM")
    const exited = await Promise.race([
        new Promise<boolean>((resolve) =>
            child.once("close", () => resolve(true))
        ),
        delay(5_000).then(() => false),
    ])
    if (!exited && child.exitCode === null && !child.killed) {
        child.kill("SIGKILL")
    }
}

function formatLogs(logs: string[]): string {
    return logs.join("").trim()
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
