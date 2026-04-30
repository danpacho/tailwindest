# Fix Layer 2: Replacement Safety Gate

## Purpose

Make unsafe replacement impossible.

This layer ensures the compiler never replaces code unless the receiver is
proven to originate from Tailwindest `createTools()`.

## Problem Definition

The analyzer checks provenance, but the replacement pass uses a separate
collector and trusts a default tool name:

```ts
toolNames = new Set(["tw"])
```

This permits behavior-changing replacement for unrelated objects named `tw`.

The compiler must not trust names. It must trust only analyzer-proven symbol
identity.

## Fix Strategy

### Engineering Principles

- Safety gate first: block replacement before improving coverage.
- Single source of truth: one provenance result must govern candidate and
  replacement behavior.
- Minimal algorithm change: do not broaden supported syntax in this layer.
- Fail closed: uncertain receiver means runtime fallback.

### Interface Strategy

Introduce an explicit replacement eligibility contract between analysis and
compile transform.

Recommended shape:

```ts
interface ProvenTailwindestCall {
    kind: TailwindestCallKind
    span: SourceSpan
}

interface CompileTransformInput {
    provenCalls: ProvenTailwindestCall[]
}
```

Alternative acceptable shape:

```ts
interface CompileTransformInput {
    isReplacementEligible(span: SourceSpan): boolean
}
```

Rules:

- `compileTailwindestSource()` may emit a replacement only for an eligible span.
- Direct low-level `compileTailwindestCall()` may still compile isolated calls,
  but Vite/programmatic source compilation must enforce provenance.
- Remove default trusted `"tw"` names from replacement collection.

### Algorithm Strategy

1. Run analyzer first.
2. Build a span set from analyzer calls that have no provenance diagnostics.
3. Pass the span set into the replacement collector.
4. When the collector finds a syntactically compilable call, verify its span
   exists in the proven set.
5. If span is not proven, do not replace. Emit or preserve a fallback/candidate
   diagnostic depending on Layer 5 taxonomy.
6. Candidate collection may remain best-effort, but replacement must be blocked.

## Test Targets

### Core Logic Coverage

- Fake `tw.join("px-4")` is not replaced.
- Fake `tw.style(...).class()` is not replaced.
- Proven `const tw = createTools(); tw.join("px-4")` is replaced.
- Proven non-`tw` identifier, e.g. `const tools = createTools()`, is replaced
  only if analyzer proves it.

### Edge Case Coverage

- Imported proven `tw` with same local name is eligible.
- Local shadowing of imported `tw` blocks replacement.
- Reassigned or mutated tool binding blocks replacement.
- Destructured methods remain runtime fallback unless explicitly proven and
  supported by this layer.

### Error Case Coverage

- Analyzer diagnostic for `NOT_TAILWINDEST_SYMBOL` always prevents replacement.
- Unresolved import provenance prevents replacement.
- Invalid or overlapping spans prevent replacement without changing source.

## 100% Completion Goal

No source transform path may emit a replacement for a call that is not
analyzer-proven.

The exact regression:

```ts
const tw = { join: (value: string) => `FAKE:${value}` }
export const cls = tw.join("px-4")
```

must preserve the original source.
