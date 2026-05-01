# CSS Transformer Production Implementation Plan

This plan is the release-oriented implementation contract for
`@tailwindest/css-transformer`. It aligns with `ARCHITECTURE.md` and replaces
loose exploratory milestones as the production reference.

## Goals

- Migrate supported class-string source patterns to Tailwindest object style
  calls.
- Preserve runtime behavior unless exact conversion is proven.
- Support `CreateTailwindest` runtime output as the public path.
- Keep `CreateCompiledTailwindest` output deprecated and internal-only.
- Keep import changes deterministic and local to transformed files.
- Provide strict tests for every supported walker and every known fallback.

## Non-Goals

- Do not compile Tailwindest runtime calls to static class strings. That is
  `@tailwindest/compiler`.
- Do not implement Tailwind CSS utility generation.
- Do not guess unresolved or ambiguous class tokens.
- Do not transform arbitrary dynamic expressions without semantic proof.
- Do not make weak compiler signals switch output mode silently.
- Do not make any compiler signal switch auto mode to compiled output.

## Phase 1: Resolver Integration

Files:

- `packages/css-transformer/src/analyzer/split_utils.ts`
- `packages/css-transformer/src/analyzer/token_analyzer.ts`
- `create-tailwind-type` resolver integration

Requirements:

- Strip variants before resolver lookup.
- Preserve both original and stripped utility token.
- Surface unresolved utilities as warnings.
- Keep resolver ambiguity conservative.

Verification:

- Split utility tests cover arbitrary values and variants.
- Analyzer tests cover resolved and unresolved tokens.
- shadcn registry tests remain stable.

## Phase 2: Output Mode Resolver

Files:

- `packages/css-transformer/src/context/output_mode.ts`
- `packages/css-transformer/src/context/transformer_context.ts`
- `packages/css-transformer/src/index.ts`
- `packages/css-transformer/src/cli.ts`

Requirements:

- Support `runtime`, `compiled`, and `auto`.
- Resolve unknown projects to runtime.
- Treat all compiler evidence as deprecated signals in auto mode.
- Emit diagnostics for deprecated compiler signals.
- Allow explicit mode to override auto detection.

Verification:

- Unit tests cover every detection priority.
- Build declaration generation succeeds.
- CLI exposes `--mode auto|runtime`; compiled remains internal/deprecated.

## Phase 3: Analyzer Object Tree

Files:

- `packages/css-transformer/src/analyzer/token_analyzer.ts`
- analyzer tests

Requirements:

- Build nested variant object paths deterministically.
- Use original token leaves in runtime mode.
- Use raw utility leaves in compiled mode.
- Preserve source order for array-promoted collisions.
- Apply group prefixes only to variant keys.

Verification:

- Runtime and compiled nested variants are both tested.
- Collision tests cover nested variants.
- Group-prefix tests cover compiled mode.

## Phase 4: Walkers

Files:

- `packages/css-transformer/src/walkers/classname_walker.ts`
- `packages/css-transformer/src/walkers/cn_walker.ts`
- `packages/css-transformer/src/walkers/cva_walker.ts`
- walker tests

Requirements:

- Pass context output mode into analyzer calls.
- Preserve dynamic arguments when supported.
- Avoid rewriting unsupported dynamic expressions.
- Register imports through `ImportCollector`.
- Register style constants through `StyleManager`.

Verification:

- Each walker has runtime and compiled nested variant tests.
- Mixed static/dynamic `cn` tests pass.
- `cva` base and variants tests pass.
- Unsupported className expressions remain unchanged.

## Phase 5: Registry and Import Safety

Files:

- `packages/css-transformer/src/registry/transformer_registry.ts`
- `packages/css-transformer/src/context/import_collector.ts`
- `packages/css-transformer/src/context/style_manager.ts`

Requirements:

- Use Collect -> Reverse Execute.
- Keep walker failures isolated to diagnostics.
- Apply import edits once per file.
- Place generated constants before first safe usage.

Verification:

- Registry priority and reverse-order tests pass.
- Import collector tests pass.
- Placement tests pass.
- Golden files remain stable.

## Phase 6: CLI and Programmatic API

Files:

- `packages/css-transformer/src/cli.ts`
- `packages/css-transformer/src/index.ts`

Requirements:

- Programmatic API exposes resolver, output mode, project root, source path,
  walker selection, and threshold config.
- CLI exposes mode selection.
- TUI exposes mode selection with `auto` as the recommended default.
- Diagnostics are not swallowed.

Verification:

- API types build through DTS generation.
- CLI build succeeds.
- Manual smoke testing can run through `tailwindest-transform`.

## Phase 7: Fixture Coverage

Fixtures:

- `packages/css-transformer/tests/fixtures/*`
- `packages/css-transformer/tests/fixtures/shadcn_registry/*`

Requirements:

- Golden fixtures cover representative migration patterns.
- shadcn fixtures cover broad real-world component structures.
- Expected files are updated only when behavior changes are intentional and
  documented.

Verification:

- `pnpm --filter css-transformer test`

## Release Acceptance Checklist

Run before release:

```bash
pnpm --filter css-transformer test
pnpm --filter css-transformer build
git diff --check -- packages/css-transformer
```

Release is blocked by any failure.

## Production Approval Criteria

- Runtime mode preserves existing `CreateTailwindest` behavior.
- Compiled mode emits `CreateCompiledTailwindest`-compatible nested leaves.
- Auto mode does not switch from weak signals.
- All walkers share the same output mode semantics.
- Unsupported input is preserved with diagnostics.
- Declaration generation succeeds.
