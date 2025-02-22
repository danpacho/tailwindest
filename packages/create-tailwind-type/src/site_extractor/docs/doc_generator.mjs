import fs from "fs/promises"
import { ensureFileExists } from "../util/fs.mjs"
import { TailwindScraper } from "../scraper.mjs"
import { getTailwindLCP } from "./lcp_class.mjs"
import assert from "assert"

/**
 * @typedef {{title: string, description: string, link: string, classNames: string[], uniqueIdentifier: string[]}} TailwindDocument
 */
export class TailwindDocExtractor {
    /**
     * @param {TailwindScraper} scraper - An instance of TailwindScraper used for fetching pages.
     * @param {string} entryUrl - Base URL for Tailwind documentation, e.g. https://tailwindcss.com/docs.
     * @param {string} outFile - The path where the JSON output will be saved.
     */
    constructor(scraper, entryUrl, outFile) {
        this.scraper = scraper
        this.entryUrl = entryUrl
        this.outFile = outFile
    }

    /**
     * Collects all anchor elements pointing to /docs/ pages from the entry page.
     * @returns {Promise<string[]>} - An array of absolute URLs found on the root doc page.
     */
    async _fetchDocLinks() {
        const doc = await this.scraper.fetchDOM(this.entryUrl)
        if (!doc) {
            console.error(`Failed to fetch ${this.entryUrl}`)
            return []
        }
        const linkElements = doc.querySelectorAll('a[href*="/docs/"]')
        /**
         * @type {string[]}
         */
        const urls = []

        linkElements.forEach((el) => {
            const href = el.getAttribute("href") || ""
            const url = new URL(href, this.entryUrl).href // Make absolute
            urls.push(url)
        })
        return urls
    }

    /**
     * Extracts the doc info (title, description, link) from a page's DOM.
     * @param {Document} document - The JSDOM Document object to parse.
     * @param {string} link - The full URL of the current doc page.
     * @param {string[]} classNames - Tailwind classNames
     * @returns {TailwindDocument}
     */
    _extractDocInfo(document, link, classNames) {
        const titleEl = document.querySelector('h1[data-title="true"]')
        const descEl = document.querySelector('p[data-description="true"]')

        const title = titleEl?.textContent?.trim() || "NOT_FOUNDED"
        const description = descEl?.textContent?.trim() || "NOT_FOUNDED"

        return {
            title,
            description,
            link,
            classNames,
            uniqueIdentifier: getTailwindLCP(classNames),
        }
    }

    /**
     * Scrapes a single doc page for its title and description.
     * @param {string} url - The URL of the doc page to scrape.
     * @returns {Promise<TailwindDocument | null>}
     *  Returns the doc info object, or null if the page is ignored or any error occurs.
     */
    async scrapeDocPage(url) {
        if (this.scraper.isPageIgnored(url)) {
            console.log(`${url} skipped (ignored).`)
            return null
        }

        try {
            const document = await this.scraper.fetchDOM(url)
            const classNameSet = await this.scraper.scrapeClasses(url, true)
            if (!document || !classNameSet) return null

            const classNames = Array.from(classNameSet)
            return this._extractDocInfo(document, url, classNames)
        } catch (err) {
            throw new Error(`Failed to scrape doc info from ${url}:`, {
                cause: err,
            })
        }
    }

    /**
     * Scrapes all doc pages in parallel to collect title, description, and link.
     * @returns {Promise<TailwindDocument[]>}
     *  Resolves to an array of doc info objects.
     */
    async _scrapeAllDocs() {
        const allLinks = await this._fetchDocLinks()

        // Fetch doc info in parallel
        const docInfoResults = await Promise.all(
            allLinks.map(async (link) => this.scrapeDocPage(link))
        )

        // Filter out nulls for ignored/failed pages
        const result = docInfoResults.filter((res) => res !== null)
        // @ts-ignore
        return result
    }

    /**
     * Writes the doc info array as JSON to disk.
     * @param {TailwindDocument[]} docInfos - The doc info objects to store.
     * @returns {Promise<void>}
     */
    async writeDocsToJSON(docInfos) {
        await ensureFileExists(this.outFile)

        const json = JSON.stringify(docInfos, null, 4)
        await fs.writeFile(this.outFile, json, "utf8")

        console.log(`Documentation info JSON written to: ${this.outFile}`)
    }

    /**
     * Filter out final generated doc object
     * @param {TailwindDocument[]} finalDocs - The doc info objects to store.
     */
    _filterDocs(finalDocs) {
        return finalDocs.filter(
            (e) => e.title !== "NOT_FOUNDED" && e.description !== "NOT_FOUNDED"
        )
    }

    /**
     * Check uniqueness of generated doc by uniqueIdentifier
     * @param {TailwindDocument[]} finalDocs
     */
    _checkIdentifierUniqueness(finalDocs) {
        // NOTE: don't do this
        const ident = finalDocs.map((e) => e.uniqueIdentifier).flat()
        console.log(ident)
        const uniqueIdent = Array.from(new Set(ident))
        console.log(uniqueIdent)

        console.log(
            `Ident Length: ${ident.length}, Unique Ident Length: ${uniqueIdent.length}`
        )
        assert(
            ident.length === uniqueIdent.length,
            "Doc info should have unique identifiers"
        )
    }

    /**
     * Orchestrates scraping all doc pages and outputting the JSON file.
     * @returns {Promise<void>}
     */
    async generateDocInfo() {
        const finalDocs = await this._scrapeAllDocs()
        const filteredDocs = this._filterDocs(finalDocs)

        // this._checkIdentifierUniqueness(filteredDocs)

        await this.writeDocsToJSON(filteredDocs)
    }
}
