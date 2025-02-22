import { JSDOM } from "jsdom"
import { IGNORED, SITE_URL } from "./constant.mjs"

export class TailwindScraper {
    /**
     * @param {number} [maxRetries=10] - Number of retry attempts when loading a page fails.
     * @param {number} [retryDelay=2500] - Delay (ms) before each retry.
     */
    constructor(maxRetries = 10, retryDelay = 2500) {
        this.maxRetries = maxRetries
        this.retryDelay = retryDelay
        this.document = null
    }

    /**
     * Checks if a given doc URL should be ignored.
     * @param {string} url - The documentation URL.
     * @returns {boolean} - True if the page is in the ignored list; otherwise, false.
     */
    isPageIgnored(url) {
        return IGNORED.pages.some(
            (ignored) => url.endsWith(`/${ignored}`) || url.includes(ignored)
        )
    }

    /**
     * @type {Document | null}
     */
    document

    /**
     * Fetches the DOM of a page using JSDOM, with retry logic.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<Document | undefined>} - The DOM Document object.
     * @throws {Error} - If all retries fail.
     */
    async fetchDOM(url) {
        if (this.document) {
            return this.document
        }

        let attempt = 0
        while (attempt < this.maxRetries) {
            try {
                if (attempt === 0) {
                    console.log(`Loading ${url}`)
                }
                const dom = await JSDOM.fromURL(url)
                console.log(`Success parsing ${url}`)
                return dom.window.document
            } catch (error) {
                attempt++
                if (attempt >= this.maxRetries) {
                    throw new Error(
                        `Failed to load ${url} after ${this.maxRetries} attempts.`
                    )
                }
                await new Promise((resolve) =>
                    setTimeout(resolve, this.retryDelay)
                )
            }
        }
    }

    /**
     * Replace <{...}> into ${string}
     * @param {string} className
     */
    _replaceCustomBracketsIntoLiteral(className) {
        const regex = /^<[^<>]+>$/

        if (!regex.test(className)) return className

        return className.replace(regex, "${string}")
    }

    /**
     * Extract textContents recursively
     * @param {Node} node
     * @returns textContents
     */
    _extractTextContent = (node) => {
        let text = ""
        if (node.nodeType === node.TEXT_NODE) {
            text += node.textContent || ""
        }

        if (node.childNodes) {
            node.childNodes.forEach((child) => {
                text += this._extractTextContent(child)
            })
        }

        return this._replaceCustomBracketsIntoLiteral(text)
    }

    /**
     * Scrapes the standard classes from a page by looking at the first cell of a #class-table.
     * @param {Document} document - The DOM Document to scrape.
     * @param {Set<string>} classes - A Set collecting classes found.
     */
    _scrapeClasses(document, classes) {
        const classExtractionTarget = document.querySelectorAll("td > code")

        if (classExtractionTarget.length === 0) {
            console.error(
                `Class target element is null, check ${SITE_URL} html structure again.`
            )
            return classes
        }

        classExtractionTarget.forEach((code) => {
            const className = [...code.childNodes]
                .reduce((acc, node) => {
                    const tw = acc + this._extractTextContent(node)
                    return tw
                }, "")
                .trim()

            if (!IGNORED.classes.has(className)) {
                classes.add(className)
            }
        })
        return classes
    }

    /**
     * Scrapes arbitrary values from the "Arbitrary Values" section.
     * @param {Document} document - The DOM Document to scrape.
     * @param {Set<string>} classes - A Set collecting classes found.
     */
    _scrapeArbitraryValues(document, classes) {
        const arbHeader = document.getElementById("arbitrary-values")
        if (!arbHeader) return

        let node = arbHeader.nextElementSibling
        while (node) {
            // Stop if we hit a new section with an id
            if (node.id) break
            node.querySelectorAll("pre span.code-highlight").forEach((span) => {
                const className = span.textContent?.trim()
                if (className && !IGNORED.classes.has(className)) {
                    classes.add(className)
                }
            })
            node = node.nextElementSibling
        }

        return classes
    }

    /**
     * Scrapes a single Tailwind documentation page for utility classes.
     * @param {string} url - The URL of the page to scrape.
     * @param {boolean} scrapeClasses - Scrape class or not.
     * @returns {Promise<Set<string>|null>} - A Set of classes if successful, or null if skipped.
     */
    async scrapeClasses(url, scrapeClasses) {
        // Skip ignored pages
        if (this.isPageIgnored(url)) {
            console.log(`${url} skipped (ignored).`)
            return null
        }

        // Fetch and parse the DOM
        const document = await this.fetchDOM(url)
        const foundClasses = new Set()

        // Extract classes
        if (!document) return null
        if (!scrapeClasses) return null

        const resClasses = this._scrapeClasses(document, foundClasses)
        // const resArbitrary = this._scrapeArbitraryValues(
        //     document,
        //     resClasses
        // )
        return resClasses
    }
}
