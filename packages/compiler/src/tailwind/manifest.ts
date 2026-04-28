import path from "node:path"
import type { CompilerDiagnostic } from "../core/diagnostic_types"

export interface CandidateManifest {
    version: 1
    byFile: Map<string, FileCandidateRecord>
    all: Set<string>
    excluded: Set<string>
    revision: number
}

export interface FileCandidateRecord {
    id: string
    hash: string
    candidates: string[]
    excludedCandidates: string[]
    diagnostics: CompilerDiagnostic[]
}

export interface UpdateFileCandidatesInput {
    hash: string
    candidates: string[]
    excludedCandidates?: string[]
    diagnostics: CompilerDiagnostic[]
}

export function createCandidateManifest(): CandidateManifest {
    return {
        version: 1,
        byFile: new Map(),
        all: new Set(),
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
    const next: FileCandidateRecord = {
        id: normalized,
        hash: input.hash,
        candidates: normalizeCandidates(input.candidates),
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

export function getSortedExcludedCandidates(
    manifest: CandidateManifest
): string[] {
    return [...manifest.excluded].sort()
}

function rebuildGlobalCandidates(manifest: CandidateManifest): void {
    manifest.all = new Set(
        [...manifest.byFile.values()]
            .flatMap((record) => record.candidates)
            .sort()
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

function normalizeDiagnostics(
    diagnostics: CompilerDiagnostic[]
): CompilerDiagnostic[] {
    return [...diagnostics].sort(compareDiagnostics)
}

function recordsEffectivelyEqual(
    left: FileCandidateRecord,
    right: FileCandidateRecord
): boolean {
    return (
        arraysEqual(left.candidates, right.candidates) &&
        arraysEqual(left.excludedCandidates, right.excludedCandidates) &&
        diagnosticsEqual(left.diagnostics, right.diagnostics)
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
