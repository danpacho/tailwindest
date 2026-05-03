import { describe, expect, it } from "vitest"
import {
    createCandidateManifest,
    getSortedExcludedCandidates,
    getSortedCandidateRecords,
    getSortedCandidates,
    normalizeCandidateFileId,
    removeFileCandidates,
    updateFileCandidates,
} from "../manifest"
import type { CompilerDiagnostic } from "../../core/diagnostic_types"

const warning: CompilerDiagnostic = {
    code: "UNSUPPORTED_DYNAMIC_VALUE",
    message: "dynamic value kept at runtime",
    severity: "warning",
}

describe("CandidateManifest", () => {
    it("normalizes exact and fallback-known candidate records while preserving sorted string candidates", () => {
        const manifest = createCandidateManifest()
        const span = { fileName: "/src/app.tsx", start: 12, end: 30 }

        updateFileCandidates(manifest, "/src/app.tsx", {
            hash: "one",
            candidates: [],
            candidateRecords: [
                { candidate: " py-2 ", kind: "fallback-known" },
                { candidate: "px-4", kind: "exact", sourceSpan: span },
                { candidate: "px-4", kind: "exact", sourceSpan: span },
                { candidate: "", kind: "exact" },
            ],
            diagnostics: [],
        })

        expect(manifest.byFile.get("/src/app.tsx")?.candidateRecords).toEqual([
            { candidate: "px-4", kind: "exact", sourceSpan: span },
            { candidate: "py-2", kind: "fallback-known" },
        ])
        expect(getSortedCandidates(manifest)).toEqual(["px-4", "py-2"])
        expect(getSortedCandidateRecords(manifest)).toEqual([
            { candidate: "px-4", kind: "exact", sourceSpan: span },
            { candidate: "py-2", kind: "fallback-known" },
        ])
    })

    it("treats provenance changes as effective updates but ignores equivalent ordering and hash-only changes", () => {
        const manifest = createCandidateManifest()

        updateFileCandidates(manifest, "/src/app.tsx", {
            hash: "one",
            candidates: [],
            candidateRecords: [
                { candidate: "py-2", kind: "fallback-known" },
                { candidate: "px-4", kind: "exact" },
            ],
            diagnostics: [warning],
        })
        const firstRevision = manifest.revision

        expect(
            updateFileCandidates(manifest, "/src/app.tsx", {
                hash: "two",
                candidates: [],
                candidateRecords: [
                    { candidate: "px-4", kind: "exact" },
                    { candidate: "py-2", kind: "fallback-known" },
                    { candidate: "py-2", kind: "fallback-known" },
                ],
                diagnostics: [warning],
            })
        ).toBe(false)
        expect(manifest.revision).toBe(firstRevision)

        expect(
            updateFileCandidates(manifest, "/src/app.tsx", {
                hash: "three",
                candidates: [],
                candidateRecords: [
                    { candidate: "px-4", kind: "fallback-known" },
                    { candidate: "py-2", kind: "fallback-known" },
                ],
                diagnostics: [warning],
            })
        ).toBe(true)
        expect(manifest.revision).toBe(firstRevision + 1)
    })

    it("removes stale exact and fallback-known records when file ownership is removed", () => {
        const manifest = createCandidateManifest()

        updateFileCandidates(manifest, "/src/a.ts", {
            hash: "a1",
            candidates: [],
            candidateRecords: [
                { candidate: "shared", kind: "exact" },
                { candidate: "only-a", kind: "fallback-known" },
            ],
            diagnostics: [],
        })
        updateFileCandidates(manifest, "/src/b.ts", {
            hash: "b1",
            candidates: [],
            candidateRecords: [{ candidate: "shared", kind: "fallback-known" }],
            diagnostics: [],
        })

        expect(removeFileCandidates(manifest, "/src/a.ts?mtime=1")).toBe(true)

        expect(getSortedCandidates(manifest)).toEqual(["shared"])
        expect(getSortedCandidateRecords(manifest)).toEqual([
            { candidate: "shared", kind: "fallback-known" },
        ])
    })

    it("keeps deterministic record order and does not exclude a raw nested leaf also included at top level", () => {
        const manifest = createCandidateManifest()

        updateFileCandidates(manifest, "/src/shorthand.ts", {
            hash: "a1",
            candidates: [],
            candidateRecords: [
                { candidate: "dark:bg-red-900", kind: "fallback-known" },
                { candidate: "bg-red-900", kind: "exact" },
                {
                    candidate: "bg-red-900",
                    kind: "fallback-known",
                    sourceSpan: {
                        fileName: "/src/shorthand.ts",
                        start: 40,
                        end: 70,
                    },
                },
            ],
            excludedCandidates: ["bg-red-900"],
            diagnostics: [],
        })

        expect(getSortedCandidateRecords(manifest)).toEqual([
            { candidate: "bg-red-900", kind: "exact" },
            {
                candidate: "bg-red-900",
                kind: "fallback-known",
                sourceSpan: {
                    fileName: "/src/shorthand.ts",
                    start: 40,
                    end: 70,
                },
            },
            { candidate: "dark:bg-red-900", kind: "fallback-known" },
        ])
        expect(getSortedExcludedCandidates(manifest)).toEqual([])
    })

    it("normalizes file ids and keeps stable sorted global candidates", () => {
        const manifest = createCandidateManifest()

        const changed = updateFileCandidates(
            manifest,
            "C:\\repo\\src\\button.tsx?direct#hash",
            {
                hash: "one",
                candidates: ["py-2", "px-4", "py-2", "hover:bg-blue-500"],
                diagnostics: [],
            }
        )

        expect(changed).toBe(true)
        expect(manifest.revision).toBe(1)
        expect([...manifest.byFile.keys()]).toEqual(["/C:/repo/src/button.tsx"])
        expect(normalizeCandidateFileId("src\\button.tsx?raw")).toBe(
            "/src/button.tsx"
        )
        expect(getSortedCandidates(manifest)).toEqual([
            "hover:bg-blue-500",
            "px-4",
            "py-2",
        ])
        expect([...manifest.all]).toEqual(["hover:bg-blue-500", "px-4", "py-2"])
    })

    it("does not increment revision for equivalent candidates, diagnostics, or hash-only updates", () => {
        const manifest = createCandidateManifest()

        updateFileCandidates(manifest, "/src/app.tsx", {
            hash: "one",
            candidates: ["px-4", "py-2"],
            diagnostics: [warning],
        })
        const firstRevision = manifest.revision

        expect(
            updateFileCandidates(manifest, "/src/app.tsx?import", {
                hash: "one",
                candidates: ["py-2", "px-4", "px-4"],
                diagnostics: [warning],
            })
        ).toBe(false)
        expect(manifest.revision).toBe(firstRevision)

        expect(
            updateFileCandidates(manifest, "/src/app.tsx", {
                hash: "two",
                candidates: ["py-2", "px-4"],
                diagnostics: [warning],
            })
        ).toBe(false)
        expect(manifest.revision).toBe(firstRevision)
        expect(manifest.byFile.get("/src/app.tsx")?.hash).toBe("two")
    })

    it("updates and removes per-file ownership without deleting candidates still owned elsewhere", () => {
        const manifest = createCandidateManifest()

        updateFileCandidates(manifest, "/src/a.ts", {
            hash: "a1",
            candidates: ["shared", "only-a"],
            diagnostics: [],
        })
        updateFileCandidates(manifest, "/src/b.ts", {
            hash: "b1",
            candidates: ["shared", "only-b"],
            diagnostics: [],
        })

        expect(getSortedCandidates(manifest)).toEqual([
            "only-a",
            "only-b",
            "shared",
        ])
        expect(manifest.revision).toBe(2)

        expect(
            updateFileCandidates(manifest, "/src/a.ts", {
                hash: "a2",
                candidates: ["shared", "new-a"],
                diagnostics: [],
            })
        ).toBe(true)
        expect(getSortedCandidates(manifest)).toEqual([
            "new-a",
            "only-b",
            "shared",
        ])
        expect(manifest.revision).toBe(3)

        expect(removeFileCandidates(manifest, "/src/a.ts?mtime=1")).toBe(true)
        expect(getSortedCandidates(manifest)).toEqual(["only-b", "shared"])
        expect(manifest.revision).toBe(4)

        expect(removeFileCandidates(manifest, "/src/a.ts")).toBe(false)
        expect(manifest.revision).toBe(4)
    })

    it("keeps effective exclusions only when not required by global candidates", () => {
        const manifest = createCandidateManifest()

        updateFileCandidates(manifest, "/src/shorthand.ts", {
            hash: "a1",
            candidates: ["bg-red-50", "dark:bg-red-900"],
            excludedCandidates: ["bg-red-900", "bg-red-50"],
            diagnostics: [],
        })
        updateFileCandidates(manifest, "/src/explicit.ts", {
            hash: "b1",
            candidates: ["bg-red-900"],
            excludedCandidates: [],
            diagnostics: [],
        })

        expect(getSortedCandidates(manifest)).toEqual([
            "bg-red-50",
            "bg-red-900",
            "dark:bg-red-900",
        ])
        expect(getSortedExcludedCandidates(manifest)).toEqual([])

        updateFileCandidates(manifest, "/src/explicit.ts", {
            hash: "b2",
            candidates: ["text-blue-600"],
            excludedCandidates: [],
            diagnostics: [],
        })

        expect(getSortedExcludedCandidates(manifest)).toEqual(["bg-red-900"])
    })
})
