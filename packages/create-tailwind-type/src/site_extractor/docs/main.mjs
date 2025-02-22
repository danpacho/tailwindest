import process from "node:process"

import { TailwindDocExtractor } from "./doc_generator.mjs"
import { TailwindScraper } from "../scraper.mjs"
import { SITE_URL } from "../constant.mjs"

/**
 * @param {string} filename
 */
export async function main(filename) {
    try {
        console.log("Doc store generation \n")

        const scraper = new TailwindScraper()
        const docExtractor = new TailwindDocExtractor(
            scraper,
            SITE_URL,
            filename
        )

        await docExtractor.generateDocInfo()
        console.log(
            `Documentation info generated at ${new Date().toLocaleDateString()}`
        )
    } catch (error) {
        console.error("Failed to generate Tailwind documentation info:", error)
        process.exit(1)
    }
}
