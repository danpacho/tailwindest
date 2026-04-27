import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { findTailwindCSSRoot, checkFileForImport } from "../discovery"
import fs from "fs"
import fsPromises from "fs/promises"
import { glob } from "glob"

vi.mock("fs")
vi.mock("fs/promises")
vi.mock("glob")

describe("Tailwind CSS Root Discovery", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe("checkFileForImport", () => {
        const markers = [
            "@import 'tailwindcss'",
            '@import "tailwindcss"',
            "@tailwind",
            "@theme",
            "@plugin",
            "@utility",
            "@variant",
        ]

        it.each(markers)(
            "should return true if file contains marker: %s",
            async (marker) => {
                vi.mocked(fsPromises.readFile).mockResolvedValue(`
                /* some styles */
                ${marker}
                /* more styles */
            `)
                const result = await checkFileForImport("test.css")
                expect(result).toBe(true)
            }
        )

        it("should return false if no markers are present", async () => {
            vi.mocked(fsPromises.readFile).mockResolvedValue(`
                .btn { color: red; }
            `)
            const result = await checkFileForImport("test.css")
            expect(result).toBe(false)
        })

        it("should return false if file read fails", async () => {
            vi.mocked(fsPromises.readFile).mockRejectedValue(
                new Error("File not found")
            )
            const result = await checkFileForImport("missing.css")
            expect(result).toBe(false)
        })
    })

    describe("findTailwindCSSRoot", () => {
        it("should find the root in the fast path (common filename)", async () => {
            // Mock tailwind.css exists and has markers
            vi.mocked(fs.existsSync).mockImplementation((path) =>
                path.toString().endsWith("tailwind.css")
            )
            vi.mocked(fsPromises.readFile).mockResolvedValue(
                "@theme { --color-primary: red; }"
            )

            const result = await findTailwindCSSRoot("/project")
            expect(result).toContain("tailwind.css")
        })

        it("should find the root in src/globals.css", async () => {
            vi.mocked(fs.existsSync).mockImplementation((path) =>
                path.toString().endsWith("src/globals.css")
            )
            vi.mocked(fsPromises.readFile).mockResolvedValue(
                "@import 'tailwindcss';"
            )

            const result = await findTailwindCSSRoot("/project")
            expect(result).toContain("src/globals.css")
        })

        it("should fallback to slow path (glob) if fast path fails", async () => {
            // No common paths exist
            vi.mocked(fs.existsSync).mockReturnValue(false)

            // Glob finds a random css file
            vi.mocked(glob).mockResolvedValue([
                "src/features/ui/entry.pcss",
            ] as any)
            vi.mocked(fsPromises.readFile).mockResolvedValue(
                "@plugin 'some-plugin';"
            )

            const result = await findTailwindCSSRoot("/project")
            expect(result).toContain("src/features/ui/entry.pcss")

            // Verify glob was called with correct ignore patterns
            expect(glob).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    ignore: expect.arrayContaining([
                        "node_modules/**",
                        "dist/**",
                    ]),
                })
            )
        })

        it("should ignore files in excluded directories even if they have markers (handled by glob ignore)", async () => {
            vi.mocked(fs.existsSync).mockReturnValue(false)

            // Glob correctly returns nothing due to ignore (simulated by returning empty)
            vi.mocked(glob).mockResolvedValue([])

            const result = await findTailwindCSSRoot("/project")
            expect(result).toBe(null)
        })

        it("should return null if no tailwind entry point is found", async () => {
            vi.mocked(fs.existsSync).mockReturnValue(false)
            vi.mocked(glob).mockResolvedValue([
                "index.css",
                "styles.css",
            ] as any)
            vi.mocked(fsPromises.readFile).mockResolvedValue(
                ".normal-css { color: blue; }"
            )

            const result = await findTailwindCSSRoot("/project")
            expect(result).toBe(null)
        })
    })
})
