# Validation Layer 2: Replacement Safety Gate

## Authority

Validate against `fix_layer_2.md`.

Layer 2 passes only if unsafe replacement is structurally impossible in source
transforms.

## Isolation Requirements

- Run after Layer 1 has passed.
- Work only on analyzer-to-replacement eligibility and tests.
- Do not implement new syntax coverage for stored stylers, compose, or
  destructuring in this layer.
- Do not change candidate semantics except where needed to prevent replacement.

## Required Evidence

The Judge must inspect:

- removal of default trusted `"tw"` replacement behavior;
- explicit analyzer-proven eligibility data flow;
- tests proving fake `tw` preservation;
- tests proving real `createTools()` still compiles.

## Acceptance Criteria

- Fake receivers are never replaced.
- Analyzer `NOT_TAILWINDEST_SYMBOL` prevents replacement.
- Proven direct receivers still compile.
- Unproven but candidate-like literals can be collected only as fallback or
  candidate-only data, not replacement.
- No regression in exact direct-call replacements.

## Rejection Criteria

Reject if:

- any default trusted name remains in replacement eligibility;
- replacement can occur without analyzer provenance;
- fake `tw` changes behavior;
- implementation broadens compile coverage while safety tests are missing;
- diagnostics claim fallback but transformed code changed.

## Validation Commands

Minimum:

```bash
pnpm --filter @tailwindest/compiler test -- src/analyzer src/vite src/transform
pnpm --filter @tailwindest/compiler test -- src/core
```

Add targeted transform probes for fake receiver behavior if tests do not cover
them directly.

## Final Judgment Format

The Judge report must include:

- verdict: pass or fail;
- fake receiver input and output;
- proven receiver input and output;
- analysis of any remaining candidate-only behavior.
