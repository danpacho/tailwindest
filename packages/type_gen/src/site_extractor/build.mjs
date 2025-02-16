import { fileExists } from "./util/fs.mjs"
import { main as execDocs } from "./docs/main.mjs"
import { main as execType } from "./types/main.mjs"
import { join } from "node:path"
import { STORE_ROOT } from "./constant.mjs"

/**
 * @param {string} filename
 * @param {boolean} forceUpdate
 * @returns {Promise<boolean>}
 */
const shouldUpdate = async (filename, forceUpdate = false) => {
    return !(await fileExists(filename)) || forceUpdate
}

/**
 * @param {Array<{ type: "doc" | "type", filename: string, forceUpdate?: boolean }>} generateOptions
 */
async function prepareStore(generateOptions) {
    for (const gen of generateOptions) {
        if (await shouldUpdate(gen.filename, gen.forceUpdate)) {
            console.log("START")
            switch (gen.type) {
                case "doc":
                    execDocs(gen.filename)
                case "type":
                    execType(gen.filename)
            }
            console.log("FIN")
        }
    }
}

async function main() {
    const DOC_STORE = join(STORE_ROOT, "docs.json")
    const TYPE_STORE = join(STORE_ROOT, "types.d.ts")

    await prepareStore([
        { type: "doc", filename: DOC_STORE, forceUpdate: true },
        { type: "type", filename: TYPE_STORE, forceUpdate: false },
    ])
}

await main()
