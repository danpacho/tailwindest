import { describe, expect, it } from "vitest"
import {
    createCandidateManifest,
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
})
