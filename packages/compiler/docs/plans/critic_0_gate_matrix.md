# Tailwindest Compiler Gate Matrix

This document is the global `[전지적 재판관]` protocol. A phase passes only when the implementation evidence satisfies every gate below.

## Judgment Levels

| Level | Meaning                                                   | Outcome            |
| ----- | --------------------------------------------------------- | ------------------ |
| P0    | Silent miscompile, CSS omission, or live/build divergence | Reject immediately |
| P1    | Unsupported case without diagnostic or fallback           | Reject             |
| P2    | Performance, source map, or debuggability regression      | Hold               |
| P3    | Documentation or naming mismatch                          | Request correction |

## Global Rejection Rules

- Any reliance on Tailwind scanning transformed JS instead of manifest bridge is P0.
- Any reintroduction of `addUtilities` as the primary Tailwind integration is P0.
- Any compile output that differs from runtime output without diagnostic is P0.
- Any stale HMR class after style edit or deletion is P0.
- Any fully compiled production file that still imports styler runtime is P1.
- Any unsupported dynamic value that silently compiles is P1.
- Any missing test for a public `createTools()` API is P1.

## Required Evidence

Every implementation phase must present:

- Test file names and exact commands.
- Before/after test status.
- Fixture matrix that maps APIs, edge cases, and negative cases to assertions.
- Diagnostics emitted for rejected cases.
- Candidate manifest diff for relevant class-producing tests.
- Bundle or transform proof for zero-runtime claims.

## Final Acceptance Bar

The compiler is acceptable only when:

- Core evaluator parity is proven against current runtime fixtures.
- Static detector avoids false positives and known false negatives.
- Substitutor is atomic and source-map compatible.
- Manifest bridge proves Tailwind v4 CSS output includes every candidate.
- Vite dev/build parity is tested.
- Dynamic variants avoid cartesian explosion or fail/fallback explicitly.
- Debug artifacts allow tracing replacement to source.
