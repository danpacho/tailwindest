import path from "node:path"
import type { SourceSpan } from "../analyzer/symbols"
import type { CompilerDiagnostic } from "../core/diagnostic_types"

export type CandidateKind = "exact" | "fallback-known"

export interface CandidateRecord {
    candidate: string
    kind: CandidateKind
    sourceSpan?: SourceSpan
}

export interface CandidateManifest {
    version: 1
    byFile: Map<string, FileCandidateRecord>
    all: Set<string>
    candidateRecords: CandidateRecord[]
    excluded: Set<string>
    revision: number
}

export interface FileCandidateRecord {
    id: string
    hash: string
    candidates: string[]
    candidateRecords: CandidateRecord[]
    excludedCandidates: string[]
    diagnostics: CompilerDiagnostic[]
}

export interface UpdateFileCandidatesInput {
    hash: string
    candidates?: string[]
    candidateRecords?: CandidateRecord[]
    excludedCandidates?: string[]
    diagnostics: CompilerDiagnostic[]
}

export function createCandidateManifest(): CandidateManifest {
    return {
        version: 1,
        byFile: new Map(),
        all: new Set(),
        candidateRecords: [],
        excluded: new Set(),
        revision: 0,
    }
}

export function normalizeCandidateFileId(id: string): string {
    const withoutQuery = id.split(/[?#]/, 1)[0] ?? id
    const slashNormalized = withoutQuery.replace(/\\/g, "/")
    const normalized = path.posix.normalize(slashNormalized)
    return normalized.startsWith("/") ? normalized : `/${normalized}`
}

export function updateFileCandidates(
    manifest: CandidateManifest,
    id: string,
    input: UpdateFileCandidatesInput
): boolean {
    const normalized = normalizeCandidateFileId(id)
    const previous = manifest.byFile.get(normalized)
    const candidateRecords = normalizeCandidateRecords(
        recordsForInput(input.candidates ?? [], input.candidateRecords)
    )
    const next: FileCandidateRecord = {
        id: normalized,
        hash: input.hash,
        candidates: normalizeCandidates(
            candidateRecords.map((record) => record.candidate)
        ),
        candidateRecords,
        excludedCandidates: normalizeCandidates(input.excludedCandidates ?? []),
        diagnostics: normalizeDiagnostics(input.diagnostics),
    }

    const effectiveChanged =
        !previous || !recordsEffectivelyEqual(previous, next)
    manifest.byFile.set(normalized, next)

    if (effectiveChanged) {
        manifest.revision += 1
        rebuildGlobalCandidates(manifest)
        return true
    }

    return false
}

export function removeFileCandidates(
    manifest: CandidateManifest,
    id: string
): boolean {
    const normalized = normalizeCandidateFileId(id)
    if (!manifest.byFile.has(normalized)) {
        return false
    }

    manifest.byFile.delete(normalized)
    manifest.revision += 1
    rebuildGlobalCandidates(manifest)
    return true
}

export function getSortedCandidates(manifest: CandidateManifest): string[] {
    return [...manifest.all].sort()
}

export function getSortedCandidateRecords(
    manifest: CandidateManifest
): CandidateRecord[] {
    return normalizeCandidateRecords(manifest.candidateRecords)
}

export function getSortedExcludedCandidates(
    manifest: CandidateManifest
): string[] {
    return [...manifest.excluded].sort()
}

function rebuildGlobalCandidates(manifest: CandidateManifest): void {
    manifest.candidateRecords = normalizeCandidateRecords(
        [...manifest.byFile.values()].flatMap(
            (record) => record.candidateRecords
        )
    )
    manifest.all = new Set(
        manifest.candidateRecords.map((record) => record.candidate).sort()
    )
    manifest.excluded = new Set(
        [...manifest.byFile.values()]
            .flatMap((record) => record.excludedCandidates)
            .filter((candidate) => !manifest.all.has(candidate))
            .sort()
    )
}

function normalizeCandidates(candidates: string[]): string[] {
    return [
        ...new Set(
            candidates.map((candidate) => candidate.trim()).filter(Boolean)
        ),
    ].sort()
}

export function normalizeCandidateRecords(
    records: CandidateRecord[]
): CandidateRecord[] {
    const byKey = new Map<string, CandidateRecord>()
    for (const record of records) {
        const candidate = record.candidate.trim()
        if (!candidate) {
            continue
        }
        const normalized: CandidateRecord = {
            candidate,
            kind: record.kind === "exact" ? "exact" : "fallback-known",
            ...(record.sourceSpan
                ? { sourceSpan: normalizeSourceSpan(record.sourceSpan) }
                : {}),
        }
        byKey.set(candidateRecordKey(normalized), normalized)
    }
    return [...byKey.values()].sort(compareCandidateRecords)
}

function normalizeDiagnostics(
    diagnostics: CompilerDiagnostic[]
): CompilerDiagnostic[] {
    return [...diagnostics].sort(compareDiagnostics)
}

function recordsForInput(
    candidates: string[],
    candidateRecords: CandidateRecord[] | undefined
): CandidateRecord[] {
    if (!candidateRecords) {
        return candidates.map((candidate) => ({
            candidate,
            kind: "fallback-known",
        }))
    }
    const recordCandidates = new Set(
        candidateRecords
            .map((record) => record.candidate.trim())
            .filter(Boolean)
    )
    return [
        ...candidateRecords,
        ...candidates
            .map((candidate) => candidate.trim())
            .filter(
                (candidate) => candidate && !recordCandidates.has(candidate)
            )
            .map((candidate) => ({
                candidate,
                kind: "fallback-known" as const,
            })),
    ]
}

function recordsEffectivelyEqual(
    left: FileCandidateRecord,
    right: FileCandidateRecord
): boolean {
    return (
        arraysEqual(left.candidates, right.candidates) &&
        candidateRecordsEqual(left.candidateRecords, right.candidateRecords) &&
        arraysEqual(left.excludedCandidates, right.excludedCandidates) &&
        diagnosticsEqual(left.diagnostics, right.diagnostics)
    )
}

function candidateRecordsEqual(
    left: CandidateRecord[],
    right: CandidateRecord[]
): boolean {
    return (
        left.length === right.length &&
        left.every(
            (item, index) => compareCandidateRecords(item, right[index]!) === 0
        )
    )
}

function diagnosticsEqual(
    left: CompilerDiagnostic[],
    right: CompilerDiagnostic[]
): boolean {
    if (left.length !== right.length) {
        return false
    }

    return left.every(
        (item, index) => compareDiagnostics(item, right[index]!) === 0
    )
}

function compareDiagnostics(
    left: CompilerDiagnostic,
    right: CompilerDiagnostic
): number {
    return (
        left.code.localeCompare(right.code) ||
        left.message.localeCompare(right.message) ||
        left.severity.localeCompare(right.severity)
    )
}

function arraysEqual(left: string[], right: string[]): boolean {
    return (
        left.length === right.length &&
        left.every((item, index) => item === right[index])
    )
}

function compareCandidateRecords(
    left: CandidateRecord,
    right: CandidateRecord
): number {
    return (
        left.candidate.localeCompare(right.candidate) ||
        left.kind.localeCompare(right.kind) ||
        compareSourceSpans(left.sourceSpan, right.sourceSpan)
    )
}

function compareSourceSpans(
    left: SourceSpan | undefined,
    right: SourceSpan | undefined
): number {
    if (!left && !right) {
        return 0
    }
    if (!left) {
        return -1
    }
    if (!right) {
        return 1
    }
    return (
        left.fileName.localeCompare(right.fileName) ||
        left.start - right.start ||
        left.end - right.end
    )
}

function candidateRecordKey(record: CandidateRecord): string {
    const span = record.sourceSpan
        ? `${record.sourceSpan.fileName}:${record.sourceSpan.start}:${record.sourceSpan.end}`
        : ""
    return `${record.candidate}\0${record.kind}\0${span}`
}

function normalizeSourceSpan(span: SourceSpan): SourceSpan {
    return {
        fileName: normalizeCandidateFileId(span.fileName),
        start: span.start,
        end: span.end,
    }
}
