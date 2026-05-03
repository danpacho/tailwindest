# CSS Transformer Production Implementation Plan

This plan is the runtime-only implementation contract for
`tailwindest-css-transform`.

## Goals

- Migrate supported class-string source patterns to Tailwindest object style
  calls.
- Preserve runtime behavior unless exact conversion is proven.
- Emit `CreateTailwindest`-compatible runtime output.
- Keep import changes deterministic and local to transformed files.
- Provide strict tests for every supported walker and fallback.

## Non-Goals

- Do not compile Tailwindest runtime calls to static class strings.
- Do not implement Tailwind CSS utility generation.
- Do not guess unresolved or ambiguous class tokens.
- Do not transform arbitrary dynamic expressions without semantic proof.

## Output Mode Resolver

Requirements:

- Support `runtime` and `auto`.
- Resolve `auto` to runtime.
- Reject unsupported modes.

Verification:

- Unit tests cover explicit runtime, auto, and unsupported mode rejection.
- CLI exposes `--mode auto|runtime`.

## Analyzer Object Tree

Requirements:

- Build nested variant object paths deterministically.
- Use original source token leaves.
- Preserve source order for array-promoted collisions.
- Apply group prefixes only to variant keys.

Verification:

- Runtime nested variants are tested.
- Collision tests cover nested variants.
- Group-prefix tests cover runtime output.

## Walkers

Requirements:

- Preserve dynamic arguments when supported.
- Avoid rewriting unsupported dynamic expressions.
- Register imports through `ImportCollector`.
- Register style constants through `StyleManager`.

Verification:

- Each walker has runtime nested variant tests.
- Mixed static/dynamic `cn` tests pass.
- `cva` base and variants tests pass.
- Unsupported className expressions remain unchanged.

## Release Acceptance Checklist

```bash
pnpm --filter css-transformer test
pnpm --filter css-transformer build
git diff --check -- packages/css-transformer
```
