import { describe, expect, it } from "vitest"
import type { SourceSpan } from "../../analyzer/symbols"
import {
    REQUIRED_DIAGNOSTIC_CODES,
    createRichDiagnostic,
    diagnosticsForMode,
    sortDiagnostics,
} from "../diagnostics"
import { formatDiagnostic } from "../reporting"

const span = (
    fileName: string,
    start: number,
    end = start + 1
): SourceSpan => ({
    fileName,
    start,
    end,
})

describe("rich diagnostics", () => {
    it("creates diagnostics with the stable Phase 6 contract fields", () => {
        const diagnostic = createRichDiagnostic({
            code: "UNSUPPORTED_DYNAMIC_VALUE",
            severity: "warning",
            modeBehavior: "loose-fallback",
            file: "/src/app.tsx",
            span: span("/src/app.tsx", 12, 18),
            message: "Dynamic class value cannot be compiled exactly.",
            suggestion: "Keep this call at runtime or make the value static.",
        })

        expect(diagnostic).toEqual({
            code: "UNSUPPORTED_DYNAMIC_VALUE",
            severity: "warning",
            modeBehavior: "loose-fallback",
            file: "/src/app.tsx",
            span: { fileName: "/src/app.tsx", start: 12, end: 18 },
            message: "Dynamic class value cannot be compiled exactly.",
            suggestion: "Keep this call at runtime or make the value static.",
        })
    })

    it("makes strict-fails diagnostics stop strict mode while loose fallback continues", () => {
        const diagnostics = [
            createRichDiagnostic({
                code: "UNSUPPORTED_DYNAMIC_VALUE",
                severity: "error",
                modeBehavior: "strict-fails",
                file: "/src/app.tsx",
                span: span("/src/app.tsx", 4),
                message: "Dynamic input is unsupported.",
            }),
            createRichDiagnostic({
                code: "TAILWIND_SOURCE_INJECTION_FAILED",
                severity: "info",
                modeBehavior: "informational",
                file: "/src/app.css",
                span: span("/src/app.css", 0),
                message: "Source injection was skipped.",
            }),
        ]

        expect(diagnosticsForMode(diagnostics, "strict")).toMatchObject({
            shouldFail: true,
            shouldFallback: false,
        })
        expect(diagnosticsForMode(diagnostics, "loose")).toMatchObject({
            shouldFail: false,
            shouldFallback: true,
        })
    })

    it("keeps informational diagnostics non-failing in both modes", () => {
        const diagnostics = [
            createRichDiagnostic({
                code: "HMR_INVALIDATION_UNCERTAIN",
                severity: "info",
                modeBehavior: "informational",
                file: "/src/app.tsx",
                span: span("/src/app.tsx", 0),
                message: "Invalidated the full graph.",
            }),
        ]

        expect(diagnosticsForMode(diagnostics, "strict")).toMatchObject({
            shouldFail: false,
            shouldFallback: false,
        })
        expect(diagnosticsForMode(diagnostics, "loose")).toMatchObject({
            shouldFail: false,
            shouldFallback: false,
        })
    })

    it("stable-sorts diagnostics by file, span start, span end, then code", () => {
        const diagnostics = [
            createRichDiagnostic({
                code: "UNKNOWN_SPREAD",
                severity: "error",
                modeBehavior: "strict-fails",
                file: "/src/b.tsx",
                span: span("/src/b.tsx", 1),
                message: "b",
            }),
            createRichDiagnostic({
                code: "MUTATED_BINDING",
                severity: "error",
                modeBehavior: "strict-fails",
                file: "/src/a.tsx",
                span: span("/src/a.tsx", 4),
                message: "a4",
            }),
            createRichDiagnostic({
                code: "CIRCULAR_STATIC_REFERENCE",
                severity: "error",
                modeBehavior: "strict-fails",
                file: "/src/a.tsx",
                span: span("/src/a.tsx", 4),
                message: "a4b",
            }),
            createRichDiagnostic({
                code: "OVERLAPPING_REPLACEMENT",
                severity: "warning",
                modeBehavior: "loose-fallback",
                file: "/src/a.tsx",
                span: span("/src/a.tsx", 2),
                message: "a2",
            }),
        ]

        expect(sortDiagnostics(diagnostics).map((item) => item.code)).toEqual([
            "OVERLAPPING_REPLACEMENT",
            "CIRCULAR_STATIC_REFERENCE",
            "MUTATED_BINDING",
            "UNKNOWN_SPREAD",
        ])
    })

    it("keeps a full rich diagnostic fixture for every required Phase 6 code", () => {
        const fixtures = REQUIRED_DIAGNOSTIC_CODES.map((code, index) =>
            createRichDiagnostic({
                code,
                severity:
                    index % 3 === 0
                        ? "info"
                        : index % 2 === 0
                          ? "warning"
                          : "error",
                modeBehavior:
                    index % 3 === 0
                        ? "informational"
                        : index % 2 === 0
                          ? "loose-fallback"
                          : "strict-fails",
                file: `/src/${code}.tsx`,
                span: span(`/src/${code}.tsx`, index, index + 1),
                message: `${code} fixture`,
                suggestion: `Check ${code}`,
            })
        )

        expect(fixtures.map((fixture) => fixture.code)).toEqual([
            "UNSUPPORTED_DYNAMIC_VALUE",
            "UNSUPPORTED_MERGER",
            "UNKNOWN_SPREAD",
            "MUTATED_BINDING",
            "CIRCULAR_STATIC_REFERENCE",
            "OVERLAPPING_REPLACEMENT",
            "SOURCE_MAP_FAILED",
            "VARIANT_TABLE_LIMIT_EXCEEDED",
            "TAILWIND_SOURCE_INJECTION_FAILED",
            "HMR_INVALIDATION_UNCERTAIN",
        ])
        for (const fixture of fixtures) {
            expect(fixture).toMatchObject({
                code: expect.any(String),
                severity: expect.stringMatching(/^(error|warning|info)$/),
                modeBehavior: expect.stringMatching(
                    /^(strict-fails|loose-fallback|informational)$/
                ),
                file: expect.any(String),
                span: {
                    fileName: fixture.file,
                    start: expect.any(Number),
                    end: expect.any(Number),
                },
                message: expect.any(String),
                suggestion: expect.any(String),
            })
            expect(formatDiagnostic(fixture)).toContain(fixture.code)
        }
        expect(
            sortDiagnostics(fixtures)
                .map((fixture) => fixture.code)
                .sort()
        ).toEqual([...REQUIRED_DIAGNOSTIC_CODES].sort())
    })
})
