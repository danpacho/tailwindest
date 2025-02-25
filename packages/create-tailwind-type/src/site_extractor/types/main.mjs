import process from "node:process"

import { TailwindDocumentationGenerator } from "./type_generator.mjs"
import { TailwindScraper } from "../scraper.mjs"
import { SITE_URL } from "../constant.mjs"

/**
 * @param {string} filename
 */
export async function main(filename) {
    try {
        console.log("Type generation \n")

        const scraper = new TailwindScraper()
        const generator = new TailwindDocumentationGenerator(
            scraper,
            SITE_URL,
            filename
        )

        await generator.generate()
        console.log(`Classname generated at ${new Date().toLocaleString()}`)
    } catch (error) {
        console.error("Failed to generate Tailwind types:", error)
        process.exit(1)
    }
}
