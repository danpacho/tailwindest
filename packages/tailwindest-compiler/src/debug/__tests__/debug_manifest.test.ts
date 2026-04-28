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
    fallback: false,
}

describe("debug manifest", () => {
    it("serializes stable JSON with sorted files, replacements, diagnostics, and candidates", () => {
        const manifest = createDebugManifest({
            mode: "strict",
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
                            modeBehavior: "loose-fallback",
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
            "mode": "strict",
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
                    "fallback": false
                  }
                ],
                "diagnostics": [
                  {
                    "code": "UNSUPPORTED_DYNAMIC_VALUE",
                    "severity": "warning",
                    "modeBehavior": "loose-fallback",
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
            mode: "loose",
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
            mode: "strict",
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
            fallback: false,
        })
    })
})
