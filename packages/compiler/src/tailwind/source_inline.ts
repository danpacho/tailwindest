import {
    getSortedExcludedCandidates,
    getSortedCandidates,
    normalizeCandidateFileId,
    type CandidateManifest,
} from "./manifest"

export interface SourceInlineInput {
    id: string
    code: string
    manifest: CandidateManifest
    cssEntries?: Array<string | RegExp> | undefined
}

export interface SourceInlineResult {
    code: string
    changed: boolean
}

const START_MARKER = "/* tailwindest:start */"
const END_MARKER = "/* tailwindest:end */"
const BLOCK_PATTERN = String.raw`\/\* tailwindest:start \*\/\r?\n@source inline\("(?:\\.|[^"\\])*"\);\r?\n(?:@source not inline\("(?:\\.|[^"\\])*"\);\r?\n)?\/\* tailwindest:end \*\/`
const BLOCK_RE = new RegExp(BLOCK_PATTERN, "g")
const IMPORT_ADJACENT_BLOCK_RE = new RegExp(
    String.raw`(@import\s+(?:url\(\s*)?["']tailwindcss["'](?:\s*\))?(?:\s+source\(\s*none\s*\))?\s*;?)\r?\n${BLOCK_PATTERN}`,
    "g"
)
const TAILWIND_IMPORT_RE =
    /@import\s+(?:url\(\s*)?["']tailwindcss["'](?:\s*\))?(?:\s+source\(\s*none\s*\))?\s*;?/m
const TAILWIND_PACKAGE_ENTRY_RE =
    /(?:^|\/)node_modules\/(?:\.pnpm\/tailwindcss@[^/]+\/node_modules\/)?tailwindcss\/index\.css$/

export function injectSourceInlineBlock(
    input: SourceInlineInput
): SourceInlineResult {
    const stripped = stripTailwindestBlocks(input.code)
    const importMatch = TAILWIND_IMPORT_RE.exec(stripped)
    const explicitEntry = matchesAny(
        normalizeCandidateFileId(input.id),
        input.cssEntries ?? []
    )
    const packageEntry = isTailwindPackageCssEntry(input.id)

    if (!importMatch && !explicitEntry && !packageEntry) {
        return { code: input.code, changed: false }
    }

    const block = createSourceInlineBlock(input.manifest)
    const next = importMatch
        ? insertAfterImport(stripped, importMatch, block)
        : `${block}${startsWithNewline(stripped) ? "" : "\n"}${stripped}`

    return {
        code: next,
        changed: next !== input.code,
    }
}

export function isTailwindCssEntry(
    id: string,
    code: string,
    cssEntries: Array<string | RegExp> = []
): boolean {
    return (
        TAILWIND_IMPORT_RE.test(code) ||
        isTailwindPackageCssEntry(id) ||
        matchesAny(normalizeCandidateFileId(id), cssEntries)
    )
}

function createSourceInlineBlock(manifest: CandidateManifest): string {
    const source = getSortedCandidates(manifest)
        .map(escapeSourceInlineCandidate)
        .join(" ")
    const excludedSource = getSortedExcludedCandidates(manifest)
        .map(escapeSourceInlineCandidate)
        .join(" ")
    const exclusions =
        excludedSource.length > 0
            ? `\n@source not inline("${excludedSource}");`
            : ""
    return `${START_MARKER}\n@source inline("${source}");${exclusions}\n${END_MARKER}`
}

function stripTailwindestBlocks(code: string): string {
    return code.replace(IMPORT_ADJACENT_BLOCK_RE, "$1").replace(BLOCK_RE, "")
}

function insertAfterImport(
    code: string,
    importMatch: RegExpExecArray,
    block: string
): string {
    const insertAt = importMatch.index + importMatch[0].length
    const after = code.slice(insertAt)
    return `${code.slice(0, insertAt)}\n${block}${startsWithNewline(after) ? "" : "\n"}${after}`
}

function startsWithNewline(value: string): boolean {
    return value.startsWith("\n") || value.startsWith("\r\n")
}

export function isTailwindPackageCssEntry(id: string): boolean {
    return TAILWIND_PACKAGE_ENTRY_RE.test(
        normalizeCandidateFileId(id).replace(/^\/@fs\/+/, "/")
    )
}

function escapeSourceInlineCandidate(candidate: string): string {
    return candidate.replace(/\\/g, "\\\\").replace(/"/g, String.raw`\"`)
}

function matchesAny(id: string, patterns: Array<string | RegExp>): boolean {
    return patterns.some((pattern) => {
        if (typeof pattern === "string") {
            return (
                normalizeCandidateFileId(pattern) === id || id.endsWith(pattern)
            )
        }
        return pattern.test(id)
    })
}
