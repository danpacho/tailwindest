import fs from "node:fs/promises"
import path from "node:path"
import type { SourceSpan } from "../analyzer/symbols"
import {
    sortDiagnostics,
    type RichCompilerDiagnostic,
    type TailwindestMode,
} from "./diagnostics"

export interface TailwindestDebugReplacement {
    kind: string
    originalSpan: SourceSpan
    generatedText: string
    candidates: string[]
    fallback: boolean
}

export interface TailwindestDebugFile {
    id: string
    hash: string
    replacements: TailwindestDebugReplacement[]
    diagnostics: RichCompilerDiagnostic[]
}

export interface TailwindestDebugManifest {
    version: 1
    mode: TailwindestMode
    files: TailwindestDebugFile[]
    candidates: string[]
}

export interface CreateDebugManifestInput {
    mode: TailwindestMode
    files: TailwindestDebugFile[]
    candidates: string[]
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
    return {
        version: 1,
        mode: input.mode,
        files: [...input.files]
            .map((file) => ({
                id: file.id,
                hash: file.hash,
                replacements: normalizeReplacements(file.replacements),
                diagnostics: sortDiagnostics(file.diagnostics),
            }))
            .sort((left, right) => left.id.localeCompare(right.id)),
        candidates: normalizeCandidates(input.candidates),
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
    replacements: TailwindestDebugReplacement[]
): TailwindestDebugReplacement[] {
    return [...replacements]
        .map((replacement) => ({
            kind: replacement.kind,
            originalSpan: replacement.originalSpan,
            generatedText: replacement.generatedText,
            candidates: normalizeCandidates(replacement.candidates),
            fallback: replacement.fallback,
        }))
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

function normalizeCandidates(candidates: string[]): string[] {
    return [
        ...new Set(candidates.map((item) => item.trim()).filter(Boolean)),
    ].sort()
}
