# Critic 4: Manifest Bridge and Vite Adapter Judgment Gate

The Vite adapter decides live-build parity. It must not depend on accidental Tailwind scanner behavior.

## P0 Rejection Conditions

- Tailwind CSS output misses a manifest candidate.
- Initial dev CSS is generated before manifest pre-scan and remains empty.
- HMR style deletion leaves stale CSS.
- Plugin requires Tailwind to scan transformed JS.
- `addUtilities` becomes the primary bridge.

## Required Proof

### C4.1 Manifest Correctness

Required tests:

- add/update/delete per file.
- duplicate candidates across files.
- candidate removal when last owner file removes it.
- stable `revision` increments only on effective changes.
- stable sorted output for CSS injection.

### C4.2 `@source inline()` Injection

Required tests:

- injection occurs exactly once.
- prior Tailwindest block is replaced on re-transform.
- arbitrary value tokens survive escaping.
- stacked variants survive escaping.
- user CSS outside marker block is byte-preserved.
- injection target is a real Tailwind CSS entry, not every CSS file unless configured.

### C4.3 Vite Plugin Order

Required proof:

- `tailwindest()` returns `tailwindest:transform` and `tailwindest:source`.
- both use `enforce: "pre"`.
- docs and tests assume `plugins: [tailwindest(), tailwindcss()]`.
- plugin works in serve and build modes.

### C4.4 HMR Invalidation

Required tests:

- style definition edit invalidates dependent JS modules.
- manifest revision change invalidates CSS entry modules.
- class deletion updates CSS output.
- uncertain dependency graph chooses over-invalidation instead of stale output.

### C4.5 Tailwind v4 E2E

Required e2e:

- run with real `@tailwindcss/vite`.
- generated CSS includes static, dynamic lookup, arbitrary, and stacked-variant candidates.
- dev transform candidate manifest equals build manifest for same fixture.

## Verdict Template

Reject if the evidence only proves JS transform output. The judge needs final Tailwind CSS proof.
