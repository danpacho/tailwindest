import fs from "fs/promises"
import path from "path"

const components = [
    "accordion",
    "alert",
    "alert-dialog",
    "aspect-ratio",
    "avatar",
    "badge",
    "breadcrumb",
    "button",
    "calendar",
    "card",
    "carousel",
    "chart",
    "checkbox",
    "collapsible",
    "command",
    "context-menu",
    "dialog",
    "drawer",
    "dropdown-menu",
    "hover-card",
    "input",
    "input-otp",
    "label",
    "menubar",
    "navigation-menu",
    "pagination",
    "popover",
    "progress",
    "radio-group",
    "resizable",
    "scroll-area",
    "select",
    "separator",
    "sheet",
    "sidebar",
    "skeleton",
    "slider",
    "sonner",
    "switch",
    "table",
    "tabs",
    "textarea",
    "toast",
    "toggle",
    "toggle-group",
    "tooltip",
]

const outputDir = path.join(
    import.meta.dirname,
    "../tests/fixtures/shadcn_registry"
)

async function fetchJsonWithRetry(
    url: string,
    retries = 3,
    delay = 1000
): Promise<any> {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url)
            if (res.ok) return await res.json()
            if (res.status >= 500) {
                // Server error, worth retrying
                console.warn(
                    `Retry ${i + 1}/${retries} for ${url} (Status: ${res.status})`
                )
                if (i < retries - 1)
                    await new Promise((resolve) => setTimeout(resolve, delay))
                continue
            }
            throw new Error(`Fetch failed: ${res.status} ${res.statusText}`)
        } catch (e) {
            if (i === retries - 1) throw e
            console.warn(
                `Retry ${i + 1}/${retries} for ${url} (Error: ${e instanceof Error ? e.message : String(e)})`
            )
            await new Promise((resolve) => setTimeout(resolve, delay))
        }
    }
}

async function downloadComponent(name: string) {
    try {
        const data = await fetchJsonWithRetry(
            `https://ui.shadcn.com/r/styles/new-york/${name}.json`
        )
        const files = data.files
        if (!files || files.length === 0) {
            console.error(`No files found for ${name}`)
            return false
        }

        await Promise.all(
            files.map(async (file: any) => {
                const baseName = path.basename(
                    file.path,
                    path.extname(file.path)
                )
                const outPath = path.join(
                    outputDir,
                    `input_${name}_${baseName}.txt`
                )
                await fs.writeFile(outPath, file.content, "utf-8")
            })
        )

        console.log(`✅ Downloaded ${name}`)
        return true
    } catch (e) {
        console.error(
            `❌ Failed to download ${name}:`,
            e instanceof Error ? e.message : String(e)
        )
        return false
    }
}

async function run() {
    await fs.mkdir(outputDir, { recursive: true })
    console.log(
        `🚀 Downloading ${components.length} components with parallel requests & retries...`
    )

    const results = await Promise.all(components.map(downloadComponent))

    const successCount = results.filter(Boolean).length
    const failedCount = components.length - successCount

    console.log(`\n✨ Finished.`)
    console.log(`✅ Success: ${successCount}`)
    if (failedCount > 0) {
        console.log(`❌ Failed: ${failedCount}`)
    }
}

run().catch(console.error)
