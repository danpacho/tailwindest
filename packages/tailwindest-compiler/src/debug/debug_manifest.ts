import fs from "node:fs/promises"
import path from "node:path"
import type { SourceSpan } from "../analyzer/symbols"
import { sortDiagnostics, type RichCompilerDiagnostic } from "./diagnostics"
import {
    normalizeCandidateRecords,
    type CandidateRecord,
} from "../tailwind/manifest"

/**
 * One source replacement recorded in the debug manifest.
 *
 * @public
 */
export type DebugCompileStatus =
    | "compiled"
    | "runtime-fallback"
    | "candidate-only"
    | "unsafe-skipped"

export interface TailwindestDebugReplacement {
    kind: string
    originalSpan: SourceSpan
    generatedText: string
    candidates: string[]
    candidateRecords: CandidateRecord[]
    status: DebugCompileStatus
    fallback: boolean
    reason?: string
}

/**
 * Per-file debug data emitted by the compiler.
 *
 * @public
 */
export interface TailwindestDebugFile {
    id: string
    hash: string
    replacements: TailwindestDebugReplacement[]
    diagnostics: RichCompilerDiagnostic[]
}

/**
 * Stable debug artifact written by the Vite plugin when `debug: true`.
 *
 * The manifest records generated replacements, fallback diagnostics, the exact
 * Tailwind candidate set, and effective `@source not inline()` exclusions that
 * must be reflected in the CSS build.
 *
 * @public
 */
export interface TailwindestDebugManifest {
    version: 1
    files: TailwindestDebugFile[]
    candidates: string[]
    candidateRecords: CandidateRecord[]
    excludedCandidates: string[]
}

export interface CreateDebugManifestInput {
    files: TailwindestDebugFileInput[]
    candidates: string[]
    candidateRecords?: CandidateRecord[]
    excludedCandidates?: string[]
}

type TailwindestDebugReplacementInput = Omit<
    TailwindestDebugReplacement,
    "status" | "reason" | "candidateRecords"
> &
    Partial<
        Pick<
            TailwindestDebugReplacement,
            "status" | "reason" | "candidateRecords"
        >
    >

type TailwindestDebugFileInput = Omit<TailwindestDebugFile, "replacements"> & {
    replacements: TailwindestDebugReplacementInput[]
}

export interface WriteDebugManifestInput {
    debug: boolean | undefined
    fileName: string
    manifest: TailwindestDebugManifest
    writeFile?: (fileName: string, text: string) => Promise<void>
}

export function createDebugManifest(
    input: CreateDebugManifestInput
): TailwindestDebugManifest {
    const files = [...input.files]
        .map((file) => ({
            id: file.id,
            hash: file.hash,
            replacements: normalizeReplacements(file.replacements),
            diagnostics: sortDiagnostics(file.diagnostics),
        }))
        .sort((left, right) => left.id.localeCompare(right.id))
    const replacementCandidateRecords = files.flatMap((file) =>
        file.replacements.flatMap((replacement) => replacement.candidateRecords)
    )
    return {
        version: 1,
        files,
        candidates: normalizeCandidates(input.candidates),
        candidateRecords: normalizeCandidateRecords(
            candidateRecordsForCandidates(input.candidates, [
                ...replacementCandidateRecords,
                ...(input.candidateRecords ?? []),
            ])
        ),
        excludedCandidates: normalizeCandidates(input.excludedCandidates ?? []),
    }
}

export function stringifyDebugManifest(
    manifest: TailwindestDebugManifest
): string {
    return `${JSON.stringify(createDebugManifest(manifest), null, 2)}\n`
}

export async function writeDebugManifest({
    debug,
    fileName,
    manifest,
    writeFile = defaultWriteFile,
}: WriteDebugManifestInput): Promise<void> {
    if (!debug) {
        return
    }
    await writeFile(fileName, stringifyDebugManifest(manifest))
}

async function defaultWriteFile(fileName: string, text: string): Promise<void> {
    await fs.mkdir(path.dirname(fileName), { recursive: true })
    await fs.writeFile(fileName, text)
}

function normalizeReplacements(
    replacements: TailwindestDebugReplacementInput[]
): TailwindestDebugReplacement[] {
    return [...replacements]
        .map(normalizeReplacement)
        .sort(
            (left, right) =>
                left.originalSpan.fileName.localeCompare(
                    right.originalSpan.fileName
                ) ||
                left.originalSpan.start - right.originalSpan.start ||
                left.originalSpan.end - right.originalSpan.end ||
                left.kind.localeCompare(right.kind)
        )
}

function normalizeReplacement(
    replacement: TailwindestDebugReplacementInput
): TailwindestDebugReplacement {
    const status = replacement.status ?? statusFromLegacyFallback(replacement)
    const reason = reasonForStatus(status, replacement.reason)

    return {
        kind: replacement.kind,
        originalSpan: replacement.originalSpan,
        generatedText: status === "compiled" ? replacement.generatedText : "",
        candidates: normalizeCandidates(replacement.candidates),
        candidateRecords: normalizeCandidateRecords(
            candidateRecordsForCandidates(
                replacement.candidates,
                replacement.candidateRecords ??
                    replacement.candidates.map((candidate) => ({
                        candidate,
                        kind: candidateKindForStatus(status),
                        sourceSpan: replacement.originalSpan,
                    }))
            )
        ),
        status,
        fallback: fallbackForStatus(status),
        ...(reason ? { reason } : {}),
    }
}

function statusFromLegacyFallback(
    replacement: TailwindestDebugReplacementInput
): DebugCompileStatus {
    return replacement.fallback ? "runtime-fallback" : "compiled"
}

function fallbackForStatus(status: DebugCompileStatus): boolean {
    return status === "runtime-fallback" || status === "unsafe-skipped"
}

function candidateKindForStatus(
    status: DebugCompileStatus
): CandidateRecord["kind"] {
    return status === "compiled" ? "exact" : "fallback-known"
}

function candidateRecordsForCandidates(
    candidates: string[],
    records: CandidateRecord[]
): CandidateRecord[] {
    const recordCandidates = new Set(
        records.map((record) => record.candidate.trim()).filter(Boolean)
    )
    return [
        ...records,
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

function reasonForStatus(
    status: DebugCompileStatus,
    reason: string | undefined
): string | undefined {
    if (reason?.trim()) {
        return reason
    }
    if (status === "runtime-fallback") {
        return "Source preserved for runtime evaluation."
    }
    if (status === "candidate-only") {
        return "Candidates collected; no supported replacement was attempted."
    }
    if (status === "unsafe-skipped") {
        return "Replacement skipped by compiler safety gate."
    }
    return undefined
}

function normalizeCandidates(candidates: string[]): string[] {
    return [
        ...new Set(candidates.map((item) => item.trim()).filter(Boolean)),
    ].sort()
}
