import { describe, expect, it } from "vitest"
import {
    createDebugManifest,
    stringifyDebugManifest,
    writeDebugManifest,
} from "../debug_manifest"
import { createRichDiagnostic } from "../diagnostics"

const replacement = {
    kind: "style",
    originalSpan: { fileName: "/src/app.tsx", start: 20, end: 54 },
    generatedText: '"flex px-4"',
    candidates: ["px-4", "flex"],
    status: "compiled" as const,
    fallback: false,
}

describe("debug manifest", () => {
    it("serializes stable JSON with sorted files, replacements, diagnostics, and candidates", () => {
        const manifest = createDebugManifest({
            files: [
                {
                    id: "/src/z.tsx",
                    hash: "b",
                    replacements: [],
                    diagnostics: [],
                },
                {
                    id: "/src/app.tsx",
                    hash: "a",
                    replacements: [replacement],
                    diagnostics: [
                        createRichDiagnostic({
                            code: "UNSUPPORTED_DYNAMIC_VALUE",
                            severity: "warning",
                            fallbackBehavior: "runtime-fallback",
                            file: "/src/app.tsx",
                            span: {
                                fileName: "/src/app.tsx",
                                start: 2,
                                end: 3,
                            },
                            message: "fallback",
                        }),
                    ],
                },
            ],
            candidates: ["px-4", "flex"],
            excludedCandidates: ["raw-flex"],
        })

        expect(stringifyDebugManifest(manifest)).toMatchInlineSnapshot(`
          "{
            "version": 1,
            "files": [
              {
                "id": "/src/app.tsx",
                "hash": "a",
                "replacements": [
                  {
                    "kind": "style",
                    "originalSpan": {
                      "fileName": "/src/app.tsx",
                      "start": 20,
                      "end": 54
                    },
                    "generatedText": "\\"flex px-4\\"",
                    "candidates": [
                      "flex",
                      "px-4"
                    ],
                    "candidateRecords": [
                      {
                        "candidate": "flex",
                        "kind": "exact",
                        "sourceSpan": {
                          "fileName": "/src/app.tsx",
                          "start": 20,
                          "end": 54
                        }
                      },
                      {
                        "candidate": "px-4",
                        "kind": "exact",
                        "sourceSpan": {
                          "fileName": "/src/app.tsx",
                          "start": 20,
                          "end": 54
                        }
                      }
                    ],
                    "status": "compiled",
                    "fallback": false
                  }
                ],
                "diagnostics": [
                  {
                    "code": "UNSUPPORTED_DYNAMIC_VALUE",
                    "severity": "warning",
                    "fallbackBehavior": "runtime-fallback",
                    "file": "/src/app.tsx",
                    "span": {
                      "fileName": "/src/app.tsx",
                      "start": 2,
                      "end": 3
                    },
                    "message": "fallback"
                  }
                ]
              },
              {
                "id": "/src/z.tsx",
                "hash": "b",
                "replacements": [],
                "diagnostics": []
              }
            ],
            "candidates": [
              "flex",
              "px-4"
            ],
            "candidateRecords": [
              {
                "candidate": "flex",
                "kind": "exact",
                "sourceSpan": {
                  "fileName": "/src/app.tsx",
                  "start": 20,
                  "end": 54
                }
              },
              {
                "candidate": "px-4",
                "kind": "exact",
                "sourceSpan": {
                  "fileName": "/src/app.tsx",
                  "start": 20,
                  "end": 54
                }
              }
            ],
            "excludedCandidates": [
              "raw-flex"
            ]
          }
          "
        `)
    })

    it("writes only when debug mode is enabled", async () => {
        const writes: Array<{ fileName: string; text: string }> = []
        const manifest = createDebugManifest({
            files: [
                {
                    id: "/src/app.tsx",
                    hash: "a",
                    replacements: [replacement],
                    diagnostics: [],
                },
            ],
            candidates: ["flex", "px-4"],
            excludedCandidates: [],
        })

        await writeDebugManifest({
            debug: false,
            fileName: "/tmp/manifest.json",
            manifest,
            writeFile: async (fileName, text) => {
                writes.push({ fileName, text })
            },
        })
        expect(writes).toEqual([])

        await writeDebugManifest({
            debug: true,
            fileName: "/tmp/manifest.json",
            manifest,
            writeFile: async (fileName, text) => {
                writes.push({ fileName, text })
            },
        })
        expect(writes).toHaveLength(1)
        expect(writes[0]?.fileName).toBe("/tmp/manifest.json")
        expect(writes[0]?.text).toBe(stringifyDebugManifest(manifest))
    })

    it("keeps generated code separate from debug artifact serialization", () => {
        const generatedCode = 'export const cls = "flex px-4"'
        const manifest = createDebugManifest({
            files: [
                {
                    id: "/src/app.tsx",
                    hash: "a",
                    replacements: [replacement],
                    diagnostics: [],
                },
            ],
            candidates: ["flex", "px-4"],
            excludedCandidates: [],
        })

        stringifyDebugManifest(manifest)

        expect(generatedCode).toBe('export const cls = "flex px-4"')
        expect(manifest.candidates).toEqual(["flex", "px-4"])
        expect(manifest.excludedCandidates).toEqual([])
        expect(manifest.files[0]?.replacements[0]).toMatchObject({
            kind: "style",
            originalSpan: { fileName: "/src/app.tsx", start: 20, end: 54 },
            generatedText: '"flex px-4"',
            candidates: ["flex", "px-4"],
            status: "compiled",
            fallback: false,
        })
    })

    it("serializes candidate provenance records while preserving string candidates", () => {
        const manifest = createDebugManifest({
            files: [
                {
                    id: "/src/app.tsx",
                    hash: "a",
                    replacements: [
                        replacement,
                        {
                            kind: "join",
                            originalSpan: {
                                fileName: "/src/app.tsx",
                                start: 80,
                                end: 120,
                            },
                            generatedText: "",
                            candidates: ["runtime-only"],
                            status: "runtime-fallback",
                            fallback: true,
                        },
                    ],
                    diagnostics: [],
                },
            ],
            candidates: ["px-4", "flex", "runtime-only"],
            candidateRecords: [
                {
                    candidate: "px-4",
                    kind: "exact",
                    sourceSpan: replacement.originalSpan,
                },
                {
                    candidate: "runtime-only",
                    kind: "fallback-known",
                    sourceSpan: {
                        fileName: "/src/app.tsx",
                        start: 80,
                        end: 120,
                    },
                },
            ],
            excludedCandidates: [],
        })

        expect(manifest.candidates).toEqual(["flex", "px-4", "runtime-only"])
        expect(manifest.candidateRecords).toEqual([
            {
                candidate: "flex",
                kind: "exact",
                sourceSpan: replacement.originalSpan,
            },
            {
                candidate: "px-4",
                kind: "exact",
                sourceSpan: replacement.originalSpan,
            },
            {
                candidate: "runtime-only",
                kind: "fallback-known",
                sourceSpan: {
                    fileName: "/src/app.tsx",
                    start: 80,
                    end: 120,
                },
            },
        ])
        expect(manifest.files[0]?.replacements[0]).toMatchObject({
            candidates: ["flex", "px-4"],
            candidateRecords: [
                {
                    candidate: "flex",
                    kind: "exact",
                    sourceSpan: replacement.originalSpan,
                },
                {
                    candidate: "px-4",
                    kind: "exact",
                    sourceSpan: replacement.originalSpan,
                },
            ],
        })
        expect(manifest.files[0]?.replacements[1]).toMatchObject({
            candidates: ["runtime-only"],
            candidateRecords: [
                {
                    candidate: "runtime-only",
                    kind: "fallback-known",
                    sourceSpan: {
                        fileName: "/src/app.tsx",
                        start: 80,
                        end: 120,
                    },
                },
            ],
        })
        expect(stringifyDebugManifest(manifest)).toContain(
            `"kind": "fallback-known"`
        )
    })

    it("normalizes replacement status taxonomy and legacy fallback records", () => {
        const span = (start: number, end = start + 5) => ({
            fileName: "/src/app.tsx",
            start,
            end,
        })
        const manifest = createDebugManifest({
            files: [
                {
                    id: "/src/app.tsx",
                    hash: "a",
                    replacements: [
                        {
                            kind: "join",
                            originalSpan: span(40),
                            generatedText: "",
                            candidates: ["px-4"],
                            status: "runtime-fallback",
                            fallback: true,
                            reason: "Unsupported dynamic value: dynamicClass",
                        },
                        {
                            kind: "style",
                            originalSpan: span(10),
                            generatedText: '"flex"',
                            candidates: ["flex"],
                            status: "compiled",
                            fallback: false,
                        },
                        {
                            kind: "variants",
                            originalSpan: span(80),
                            generatedText: "",
                            candidates: ["text-red-700"],
                            status: "unsafe-skipped",
                            fallback: true,
                            reason: "Generated replacement code contains a syntax error.",
                        },
                        {
                            kind: "style",
                            originalSpan: span(60),
                            generatedText: "",
                            candidates: ["text-blue-700"],
                            status: "candidate-only",
                            fallback: false,
                            reason: "Candidates collected; no supported replacement was attempted.",
                        },
                        {
                            kind: "join",
                            originalSpan: span(100),
                            generatedText: "",
                            candidates: ["legacy"],
                            fallback: true,
                        },
                    ],
                    diagnostics: [],
                },
            ],
            candidates: [],
            excludedCandidates: [],
        })

        expect(manifest.files[0]?.replacements).toEqual([
            expect.objectContaining({
                kind: "style",
                status: "compiled",
                fallback: false,
            }),
            expect.objectContaining({
                kind: "join",
                status: "runtime-fallback",
                fallback: true,
                reason: "Unsupported dynamic value: dynamicClass",
            }),
            expect.objectContaining({
                kind: "style",
                status: "candidate-only",
                fallback: false,
                reason: "Candidates collected; no supported replacement was attempted.",
            }),
            expect.objectContaining({
                kind: "variants",
                status: "unsafe-skipped",
                fallback: true,
                reason: "Generated replacement code contains a syntax error.",
            }),
            expect.objectContaining({
                kind: "join",
                status: "runtime-fallback",
                fallback: true,
                reason: "Source preserved for runtime evaluation.",
            }),
        ])
    })
})
