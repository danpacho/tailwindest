# Validation Layer 4: Compiled Subset Semantic Correctness

## Authority

Validate against `fix_layer_4.md`.

Layer 4 passes only if every replaced call in the supported subset is
runtime-equivalent.

## Isolation Requirements

- Run after Layers 1-3 pass.
- Work only on semantic correctness for already compiled call shapes.
- Do not add new compile coverage for stored stylers or compose chains.
- Keep fallback behavior conservative.

## Required Evidence

The Judge must collect:

- runtime parity tests for mixed static/dynamic variants;
- merger fallback tests for every class-producing API;
- generated symbol sanitization tests;
- `.js` and `.tsx` generated syntax tests;
- before/after examples for exact and fallback behavior.

## Acceptance Criteria

- Mixed variant props no longer lose static classes/styles.
- Unsupported merger never compiles into plain concatenation.
- Generated lookup code parses in JavaScript and TypeScript source kinds.
- Invalid generated syntax results in preserved source and fallback diagnostic.
- Existing exact no-merger cases still compile.

## Rejection Criteria

Reject if:

- any replaced output differs from runtime for tested bounded states;
- merger behavior is approximated instead of falling back;
- symbol sanitization can still emit invalid identifiers;
- `.js` output contains TypeScript-only `as const`;
- implementation expands coverage without tests for the existing subset.

## Validation Commands

Minimum:

```bash
pnpm --filter @tailwindest/compiler test -- src/core
pnpm --filter @tailwindest/compiler test -- src/vite
pnpm --filter @tailwindest/compiler test -- src/transform
pnpm --filter @tailwindest/compiler build
```

The Judge may add targeted `compile()` probes for source-kind-specific syntax.

## Final Judgment Format

The Judge report must include:

- verdict: pass or fail;
- runtime parity matrix for variants;
- merger fallback matrix for class APIs;
- generated syntax evidence for JS and TS;
- remaining semantic risks for Layer 5.
