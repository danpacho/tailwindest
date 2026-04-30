# Tailwindest Compiler Production Implementation Plan

This plan is the release-oriented implementation contract for
`@tailwindest/compiler`. It replaces earlier exploratory notes and is aligned
with the final architecture in `ARCHITECTURE.md`.

## Goals

- Compile the public `createTools()` API where exact static evaluation is
  possible.
- Preserve runtime behavior through fallback when exact compilation is
  not possible.
- Feed Tailwind CSS v4 through the documented `@source inline()` manifest
  bridge.
- Keep dev, debug, build, and release workflows reproducible.
- Provide fallback tests for every feature and every known failure mode.

## Non-Goals

- Do not implement Tailwind CSS utilities with `addUtilities`.
- Do not depend on Tailwind scanning transformed JavaScript.
- Do not silently drop unsupported dynamic values.
- Do not expose analyzer, resolver, transform, or manifest internals as stable
  npm modules.

## Phase 1: Shared Evaluation Engine

Files:

- `packages/tailwindest-core/src/*`
- `packages/tailwindest-compiler/src/core/evaluator.ts`
- `packages/tailwindest-compiler/src/core/static_value.ts`
- `packages/tailwindest-compiler/src/core/merger.ts`
- `packages/tailwindest-compiler/src/core/compiled_style_normalizer.ts`
- `packages/tailwindest-compiler/src/core/compiled_variant_resolver.ts`
- `packages/tailwindest-compiler/src/core/__tests__/*`

Requirements:

- Match Tailwindest runtime behavior for `flattenRecord`, `deepMerge`, class
  joining, and structural style object normalization through
  `@tailwindest/core`.
- Keep compiler-only nested variant prefixing in
  `compiled_style_normalizer.ts`, backed by Tailwind variant metadata rather
  than a hard-coded allowlist.
- Support `join`, `def`, `mergeProps`, and `mergeRecord`.
- Separate exact compilation from unsupported runtime fallback.

Verification:

- Unit tests mirror the important cases in
  `packages/tailwindest/src/tools/create_tools.ts`.
- Tests include arrays, falsey class values, dictionary class values, nested
  variants, duplicate properties, and empty objects.
- Compiler shorthand tests cover missing variant metadata fallback and
  metadata-backed prefix generation.

## Phase 2: Static Resolver and Detector

Files:

- `packages/tailwindest-compiler/src/analyzer/detector.ts`
- `packages/tailwindest-compiler/src/analyzer/symbols.ts`
- analyzer tests

Requirements:

- Prove that receivers originate from `createTools()`.
- Support aliases, imports, re-exports, exported constants, destructuring, and
  styler variables.
- Parse `.ts`, `.tsx`, `.js`, and `.jsx` with the correct TypeScript script
  kind.
- Detect unsupported static values with actionable diagnostics.

Verification:

- Compile receivers that are not named `tw` when provenance is proven.
- Reject fake receivers even when method names match Tailwindest methods.
- Cover cross-file imports and circular reference protection.

## Phase 3: API Compile Surface

Files:

- `packages/tailwindest-compiler/src/core/api_compile.ts`
- `packages/tailwindest-compiler/src/core/variant_optimizer.ts`
- corresponding tests

Required API coverage:

- `style().class`, `style().style`, `style().compose`
- `toggle().class`, `toggle().style`, `toggle().compose`
- `rotary().class`, `rotary().style`, `rotary().compose`
- `variants().class`, `variants().style`, `variants().compose`
- `join`, `def`, `mergeProps`, `mergeRecord`

Dynamic strategy:

- `toggle` emits ternaries when the condition is dynamic but bounded.
- `rotary` emits lookup maps for dynamic keys.
- `variants` emits additive maps and conflict tables when bounded by
  `variantTableLimit`.
- Overflow preserves the runtime call with manifest retention.

Verification:

- Static expected output tests exist for every API.
- Dynamic expected output tests exist for every bounded dynamic API.
- Negative tests cover unknown dynamic class values, dynamic style objects,
  runtime-generated variant keys, table overflow, and unproven receivers.

## Phase 4: Substitution

Files:

- `packages/tailwindest-compiler/src/transform/substitutor.ts`
- `packages/tailwindest-compiler/src/transform/replacement.ts`
- source map tests

Requirements:

- Use Collect -> Reverse Execute with deterministic ordering.
- Use source spans, not mutable AST nodes, for final replacement.
- Preserve source maps at call-site fidelity.
- Preserve the original source for unsupported runtime fallbacks.

Verification:

- Nested calls do not corrupt spans.
- Comments and surrounding whitespace remain valid.
- Fallback calls remain byte-for-byte safe enough for Vite HMR.

## Phase 5: Tailwind Candidate Manifest Bridge

Files:

- `packages/tailwindest-compiler/src/tailwind/manifest.ts`
- `packages/tailwindest-compiler/src/tailwind/source_inline.ts`
- `packages/tailwind-internal/src/*`
- Tailwind manifest tests

Requirements:

- Maintain per-file candidates, global candidates, and effective exclusions.
- Inject exactly one Tailwindest block into each CSS entry.
- Load Tailwind variant groups from the active CSS entry through
  `@tailwindest/tailwind-internal`.
- Preserve arbitrary values, stacked variants, data/aria variants, and escaped
  characters.
- Support `@import "tailwindcss" source(none);`.

Verification:

- Removing a source file removes stale candidates.
- Nested raw leaves appear in exclusions only when they are not also needed as
  top-level candidates.
- `compileAsync({ cssRoot })` and `compileAsync({ cssSource })` compile nested
  shorthand from metadata loaded by the same internal layer as
  `create-tailwind-type`.
- CSS bridge output is stable across dev and build.

## Phase 6: Vite Adapter

Files:

- `packages/tailwindest-compiler/src/vite/index.ts`
- `packages/tailwindest-compiler/src/vite/context.ts`
- `packages/tailwindest-compiler/src/vite/cache.ts`
- Vite plugin tests

Requirements:

- Provide the `tailwindest()` plugin pair.
- Run pre-scan during build and dev startup.
- Invalidate dependent modules and CSS entries during HMR.
- Normalize paths to POSIX form before manifest operations.
- Expose only documented public options.

Verification:

- Serve and build contexts derive identical manifests for identical files.
- Include and exclude filters work in both transform handlers.
- Debug manifests contain fallback diagnostic behavior.
- Framework e2e files run serially within the compiler package to avoid
  multiple dev/preview servers competing inside one Vitest worker pool.

## Phase 7: Framework E2E

Fixtures:

- `packages/tailwindest-compiler/e2e/vite-tailwind-v4`
- `packages/tailwindest-compiler/e2e/tanstack-start-tailwind-v4`
- `packages/tailwindest-compiler/e2e/next-tailwind-v4`
- `packages/tailwindest-compiler/e2e/design-system-*`

Requirements:

- Vite uses the native plugin pair.
- TanStack Start uses the Vite integration.
- Next.js App Router webpack uses the precompile bridge until a native adapter
  exists.
- Turbopack remains out of scope until a real adapter is implemented.

Verification:

- Dev and production computed styles match.
- Debug manifests contain expected candidates and exclusions.
- Client bundles do not contain Tailwindest styler runtime tokens for fully
  compiled cases.
- Screenshots are generated for manual release inspection.

## Phase 8: Packaging and Public API

Files:

- `packages/tailwindest-compiler/src/index.ts`
- `packages/tailwindest-compiler/src/vite/index.ts`
- `packages/tailwindest-compiler/package.json`
- `packages/tailwindest-compiler/README.md`

Requirements:

- Export only `@tailwindest/compiler` and `@tailwindest/compiler/vite`.
- Generate `.d.mts` files for ESM consumers.
- Keep internal modules private.
- Document public options with TSDoc.

Verification:

```bash
pnpm ts:typecheck
pnpm test
pnpm build
pnpm --filter @tailwindest/compiler pack:dry
```

## Release Acceptance Checklist

Run before publishing:

```bash
pnpm ts:typecheck
pnpm test
pnpm build
pnpm --filter @tailwindest/compiler pack:dry
git diff --check -- packages/tailwindest-compiler packages/tailwindest packages/tailwindest-core packages/tailwind-internal packages/create-tailwind-type pnpm-lock.yaml
```

Release is blocked by any failure in the checklist.
