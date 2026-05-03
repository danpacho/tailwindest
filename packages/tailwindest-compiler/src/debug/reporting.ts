import type { RichCompilerDiagnostic } from "./diagnostics"
import { sortDiagnostics } from "./diagnostics"

export function formatDiagnostic(diagnostic: RichCompilerDiagnostic): string {
    return [
        diagnostic.severity.toUpperCase(),
        diagnostic.code,
        `${diagnostic.file}:${diagnostic.span.start}-${diagnostic.span.end}`,
        diagnostic.message,
        diagnostic.suggestion ? `Suggestion: ${diagnostic.suggestion}` : "",
    ]
        .filter(Boolean)
        .join(" ")
}

export function formatDiagnostics(
    diagnostics: RichCompilerDiagnostic[]
): string {
    return sortDiagnostics(diagnostics).map(formatDiagnostic).join("\n")
}
