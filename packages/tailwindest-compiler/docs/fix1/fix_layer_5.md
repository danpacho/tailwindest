# Fix Layer 5: Diagnostics and Debug Manifest Taxonomy

## Purpose

Make debug output accurately describe what happened during compilation.

The debug manifest must distinguish exact replacement from preserved runtime
fallback and candidate-only discovery.

## Problem Definition

Current diagnostics can be misleading:

- analyzer may report a provenance diagnostic while replacement still occurs;
- a call may be candidate-only but not represented as such;
- fallback diagnostics do not always identify why source was preserved;
- syntax failure after code generation is not tied clearly to the skipped call.

Loose-only compilation needs diagnostics as a primary user interface.

## Fix Strategy

### Engineering Principles

- Diagnostics must match transformed code.
- Debug manifest is an audit log, not a marketing artifact.
- Keep taxonomy small and stable.
- Every fallback must have a reason that a user can act on.

### Interface Strategy

Extend debug replacement records with a status field:

```ts
type DebugCompileStatus =
    | "compiled"
    | "runtime-fallback"
    | "candidate-only"
    | "unsafe-skipped"

interface TailwindestDebugReplacement {
    status: DebugCompileStatus
    fallback: boolean
    reason?: string
}
```

If changing the existing interface broadly is too invasive, add fields while
preserving `fallback` for compatibility.

Status meaning:

- `compiled`: exact replacement applied.
- `runtime-fallback`: Tailwindest runtime call preserved.
- `candidate-only`: candidates collected, no supported replacement attempted.
- `unsafe-skipped`: replacement was syntactically possible but blocked by
  provenance, merger, generated syntax, or overlap safety.

### Algorithm Strategy

1. Each detected call should produce one debug event unless it is entirely
   outside Tailwindest provenance and candidate collection.
2. Replacement application updates status to `compiled`.
3. Unsupported values update status to `runtime-fallback`.
4. Proven but unsupported call shapes update status to `candidate-only`.
5. Proven or candidate-like calls blocked by safety gates update status to
   `unsafe-skipped`.
6. Diagnostics and manifest candidates must refer to the same status.

## Test Targets

### Core Logic Coverage

- Exact static call appears as `compiled`.
- Dynamic unsupported call appears as `runtime-fallback`.
- Stored styler candidate-only pattern appears as `candidate-only`.
- Fake receiver or unproven receiver appears as `unsafe-skipped` or analyzer
  diagnostic with no replacement.

### Edge Case Coverage

- Overlapping replacement skip is reflected in debug manifest.
- Generated syntax failure is reflected as fallback/unsafe status.
- Files with no Tailwindest calls do not emit fake records.
- Multiple calls in one file keep stable deterministic order.

### Error Case Coverage

- Debug manifest write failure does not change codegen.
- Diagnostic severity is compatible with fallback-safe behavior.
- Missing source spans fall back to file-level diagnostics without replacement.

## 100% Completion Goal

For every transformed file, a reviewer must be able to explain each Tailwindest
call outcome from the debug manifest alone.

No manifest entry may claim exact replacement when the source was preserved, and
no fallback may lack a reason.
