# Critic 6: Diagnostics and E2E Judgment Gate

This is the final release gate. Passing unit tests is not enough; the whole Vite + Tailwind v4 pipeline must prove live, debug, and build parity.

## P0 Rejection Conditions

- Strict mode allows an unsupported exact compile.
- Loose mode changes runtime behavior while claiming fallback.
- Debug manifest omits a replacement or candidate.
- Production CSS misses a candidate.
- Production JS retains styler runtime for a fully compiled fixture.
- Dev/build manifest differs for the same source graph.

## Required Proof

### C6.1 Diagnostic Semantics

Required tests:

- diagnostic has stable code, severity, file, span, and message.
- strict mode fail diagnostics stop transform for exact-compile failures.
- loose mode fallback diagnostics preserve source call.
- diagnostics are stable-sorted.
- every diagnostic code from `planes_6_debug_e2e.md` has at least one fixture.

### C6.2 Debug Manifest

Required tests:

- `debug: true` writes stable JSON.
- `debug: false` writes nothing.
- every replacement includes kind, original span, generated text, candidates, and fallback flag.
- manifest candidate list equals candidate manifest global set.
- debug artifact does not change generated code.

### C6.3 Full Pipeline E2E

Required app features:

- static `tw.style`.
- `tw.join` and `tw.def`.
- `tw.toggle` boolean.
- `tw.rotary` key lookup.
- `tw.variants` independent and conflicting axes.
- arbitrary values and stacked variants.
- loose fallback case.

Required assertions:

- Vite build succeeds.
- Tailwind CSS output includes every manifest candidate.
- dev transform manifest equals build transform manifest.
- production bundle excludes styler runtime for fully compiled files.
- source maps are present when enabled.

### C6.4 HMR E2E

Required assertions:

- editing a class changes live JS output.
- editing a class changes live CSS output.
- deleting a class removes it from live CSS.
- changing an imported style file invalidates dependents.

## Required Commands

```bash
pnpm --filter @tailwindest/compiler test
pnpm --filter @tailwindest/compiler build
pnpm --filter @tailwindest/compiler test:e2e
```

## Verdict Template

The final verdict can be "pass" only if the judge can trace one generated CSS rule back to source through the debug manifest and source map, and then prove the same rule exists in build output.
