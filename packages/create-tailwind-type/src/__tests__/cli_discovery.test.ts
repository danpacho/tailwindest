import { describe, it, expect, vi, beforeEach } from "vitest"
import {
    resolveTailwindNodeDir,
    getTailwindVersion,
    isVersionSufficient,
} from "../internal/resolution"
import { existsSync, readFileSync } from "fs"
import { join } from "path"
import { createRequire } from "module"

vi.mock("fs", () => ({
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
}))

vi.mock("module", () => ({
    createRequire: vi.fn(() => ({
        resolve: vi.fn(),
    })),
}))

const mockRequireResolve = vi.fn()
vi.mocked(createRequire).mockReturnValue({
    resolve: mockRequireResolve,
} as any)

describe("CLI Discovery & Resolution", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe("getTailwindVersion", () => {
        it("should find version in the current directory", () => {
            const baseDir = "/project/node_modules/@tailwindcss/node"
            vi.mocked(existsSync).mockImplementation(
                (p) => p === join(baseDir, "package.json")
            )
            vi.mocked(readFileSync).mockImplementation(() =>
                JSON.stringify({
                    name: "@tailwindcss/node",
                    version: "4.0.1",
                })
            )

            expect(getTailwindVersion(baseDir)).toBe("4.0.1")
        })

        it("should find version by searching upwards (monorepo case)", () => {
            const pkgDir = "/monorepo/node_modules/@tailwindcss/node"
            const subDir = join(pkgDir, "dist/internal")

            vi.mocked(existsSync).mockImplementation(
                (p) => p === join(pkgDir, "package.json")
            )
            vi.mocked(readFileSync).mockImplementation(() =>
                JSON.stringify({
                    name: "@tailwindcss/node",
                    version: "4.0.0-alpha.25",
                })
            )

            expect(getTailwindVersion(subDir)).toBe("4.0.0-alpha.25")
        })

        it("should support 'tailwindcss' package name as well", () => {
            const pkgDir = "/project/node_modules/tailwindcss"
            vi.mocked(existsSync).mockImplementation(
                (p) => p === join(pkgDir, "package.json")
            )
            vi.mocked(readFileSync).mockImplementation(() =>
                JSON.stringify({
                    name: "tailwindcss",
                    version: "4.0.5",
                })
            )

            expect(getTailwindVersion(pkgDir)).toBe("4.0.5")
        })

        it("should throw error if package.json is not found anywhere upwards", () => {
            vi.mocked(existsSync).mockReturnValue(false)
            expect(() => getTailwindVersion("/some/random/path")).toThrow()
        })
    })

    describe("isVersionSufficient", () => {
        it("should accept versions >= 4.0.0", () => {
            expect(isVersionSufficient("4.0.0")).toBe(true)
            expect(isVersionSufficient("4.0.1")).toBe(true)
            expect(isVersionSufficient("4.1.0")).toBe(true)
            expect(isVersionSufficient("5.0.0")).toBe(true)
        })

        it("should reject versions < 4.0.0", () => {
            expect(isVersionSufficient("3.4.15")).toBe(false)
            expect(isVersionSufficient("2.2.19")).toBe(false)
        })
    })

    describe("resolveTailwindNodeDir", () => {
        it("should respect skipLocal option", async () => {
            mockRequireResolve.mockReturnValue(
                "/cli/node_modules/@tailwindcss/node/dist/index.js"
            )

            const result = await resolveTailwindNodeDir(undefined, {
                skipLocal: true,
            })

            expect(result).toBe("/cli/node_modules/@tailwindcss/node/dist")
            expect(mockRequireResolve).toHaveBeenCalledWith("@tailwindcss/node")
        })

        it("should use search paths when skipLocal is false", async () => {
            mockRequireResolve.mockReturnValue(
                "/project/node_modules/@tailwindcss/node/dist/index.js"
            )

            const result = await resolveTailwindNodeDir("/project/src/app.css")

            expect(result).toBe("/project/node_modules/@tailwindcss/node/dist")
            expect(mockRequireResolve).toHaveBeenCalledWith(
                "@tailwindcss/node",
                expect.objectContaining({
                    paths: expect.arrayContaining([
                        process.cwd(),
                        "/project/src",
                    ]),
                })
            )
        })
    })
})
