# Runtime And Compiler Normalizer Boundary Plan

**Status:** Approved strategy, implementation not yet started.

**Decision:** `tailwindest` runtime semantics are authoritative. The current
`packages/tailwindest-core/src/style_normalizer.ts` contains compiler-oriented
nested variant prefix generation and must be split. `@tailwindest/core` may own
structural runtime flattening, but it must not decide Tailwind variant keys or
generate prefixes from object paths.

## Assumptions

- `CreateTailwindest` is the runtime-oriented style type. Nested values already
  include any required Tailwind prefixes such as `dark:` or `hover:`.
- Compiler-style nested objects are compiler-oriented. Nested object keys express
  variant paths and leaf values are raw Tailwind utilities.
- A preserved runtime fallback must execute with correct semantics. Therefore,
  raw compiler-style objects cannot be blindly preserved as normal `tailwindest`
  runtime calls when their correctness depends on compiled prefix generation.
- `@tailwindest/core` should contain only behavior that both runtime and
  compiler can share without semantic policy leakage.

## Current Failure

`packages/tailwindest-core/src/style_normalizer.ts` currently contains:

- `DEFAULT_VARIANT_KEYS`
- `COMPOUND_VARIANT_KEYS`
- `isVariantKey`
- `applyVariantPrefix`
- explicit-prefix detection tied to Tailwind variant syntax

That makes core flattening depend on a hard-coded Tailwind variant classifier.
This is wrong for runtime because the runtime package does not receive
`tailwindNestGroups`, `groupPrefix`, or generated variant metadata at execution
time.

Concrete incorrect behavior:

```ts
flattenStyleRecord({ "group-hover": { color: "text-blue-600" } })
// current: ["text-blue-600"]
// compiler-oriented expectation may be ["group-hover:text-blue-600"]

flattenStyleRecord({ default: { color: "text-zinc-900" } })
// current: ["default:text-zinc-900"]
// runtime structural expectation is ["text-zinc-900"] unless the leaf is
// explicitly prefixed by the user

flattenStyleRecord({ "#hover": { color: "text-red-500" } })
// current: ["text-red-500"]
// hard-coded classifier cannot honor configured groupPrefix
```

## Target Boundary

### `@tailwindest/core`

Owns runtime-authoritative shared mechanics:

- `toClass`
- `mergeClassNames`
- `deepMerge`
- structural `flattenStyleRecord`
- structural `flattenRecord`
- structural `getClassName`
- `createEvaluationEngine`
- primitive/toggle/rotary/variants model composition

Core structural flattening:

```ts
function flattenStyleRecord(value: unknown): string[] {
    if (!value) return []
    if (typeof value === "string") return splitClassTokens(value)
    if (Array.isArray(value)) return value.flatMap(flattenStyleRecord)
    if (typeof value === "object") {
        return Object.values(value as Record<string, unknown>).flatMap(
            flattenStyleRecord
        )
    }
    return []
}
```

Core must not contain:

- `DEFAULT_VARIANT_KEYS`
- `isVariantKey`
- `COMPOUND_VARIANT_KEYS`
- `applyVariantPrefix`
- Tailwind variant allowlists
- `group` / `peer` special prefix generation
- arbitrary variant syntax classification

### `tailwindest`

Uses `@tailwindest/core` structural semantics. Runtime object keys are grouping
keys only; runtime leaf strings are preserved as authored.

Examples:

```ts
tw.style({
    dark: {
        backgroundColor: "dark:bg-red-900",
    },
}).class()
// "dark:bg-red-900"

tw.style({
    dark: {
        backgroundColor: "bg-red-900",
    },
}).class()
// "bg-red-900"
```

The second example is correct runtime behavior even though it is not valid
compiler-oriented authoring for final CSS semantics.

### `@tailwindest/compiler`

Owns compiled-style normalization:

- Converts compiler-style object paths into Tailwind prefixes.
- Keeps current exact/fallback diagnostics and candidate provenance.
- Does not expose the compiled normalizer through `@tailwindest/core`.
- Fails closed when compiled prefix generation cannot be proven.

Acceptable short-term implementation:

- Move the current prefixing logic from core into a compiler-owned module such
  as `packages/tailwindest-compiler/src/core/compiled_style_normalizer.ts`.
- Rename the hard-coded set to an explicitly compiler-scoped name such as
  `DEFAULT_COMPILED_VARIANT_KEYS`.
- Use this only on compiler exact paths and compiler candidate collection.

Required longer-term improvement:

- Replace hard-coded variant keys with generated metadata, explicit compiler
  option injection, or type-informed analyzer metadata.

## Fallback Safety Rule

Any call that depends on raw compiler-style nested variant normalization must
satisfy one of these conditions:

1. The compiler emits an exact static replacement using compiler-owned
   compiled-style normalization.
2. The compiler preserves a runtime path that explicitly calls a compiler-owned
   runtime helper with compiled-style normalization.
3. The compiler refuses replacement and emits diagnostics that explain why the
   preserved runtime call may not represent compiled semantics.

Do not silently preserve a raw compiled-style object as ordinary `tailwindest`
runtime when the object path is required to generate prefixes.

## Implementation Plan

### Step 1: Add regression tests first

Core/runtime tests:

- `flattenStyleRecord({ dark: { color: "text-white" } })` returns
  `["text-white"]`.
- `flattenStyleRecord({ hover: { color: "text-blue-500" } })` returns
  `["text-blue-500"]`.
- `flattenStyleRecord({ "group-hover": { color: "text-blue-500" } })` returns
  `["text-blue-500"]`.
- `flattenStyleRecord({ default: { color: "text-zinc-900" } })` returns
  `["text-zinc-900"]`.
- `flattenStyleRecord({ "#hover": { color: "text-red-500" } })` returns
  `["text-red-500"]`.
- Runtime-prefixed leaves remain untouched:
  `{ dark: { color: "dark:text-white" } }` returns `["dark:text-white"]`.

Compiler tests:

- Compiled normalizer maps `{ dark: { color: "text-white" } }` to
  `["dark:text-white"]`.
- Compiled normalizer maps nested `group.hover` to
  `["group-hover:<utility>"]`.
- Compiled normalizer supports explicitly configured or known compiled variant
  keys such as `group-hover` only in the compiler layer.
- Unsupported/custom variant keys do not get guessed silently; they either stay
  structural with diagnostics or force fallback according to the compiler
  exactness policy.

### Step 2: Split the modules

- Replace `packages/tailwindest-core/src/style_normalizer.ts` with structural
  flattening only.
- Remove `DEFAULT_VARIANT_KEYS` and `StyleNormalizationOptions` from core public
  exports unless another core consumer truly requires them.
- Add compiler-owned `compiled_style_normalizer.ts` with the current
  prefix-generation algorithm.
- Update compiler imports that need compiled normalization to use the compiler
  module, not `@tailwindest/core` style normalization.
- Keep `packages/tailwindest/src/tools/style_normalizer.ts` as a re-export of
  the structural core normalizer.

### Step 3: Re-evaluate compiler fallback behavior

- Audit exact compilation paths for `.class()`, `.style()`, `.compose()`,
  `mergeProps`, `mergeRecord`, `def`, and stored stylers.
- For each fallback path, classify whether the preserved call is ordinary
  runtime-safe or compiled-style-dependent.
- Add diagnostics when a preserved call may not have compiled semantics.
- Prefer conservative fallback with clear diagnostics over speculative prefix
  generation.

### Step 4: Update documentation

- `packages/tailwindest-compiler/docs/ARCHITECTURE.md` must state that compiled
  nested variant normalization is a compiler layer, not core runtime behavior.
- `packages/tailwindest-compiler/README.md` and
  `web/content/docs/compiler.mdx` must distinguish `CreateTailwindest` runtime
  leaf-prefix semantics from compiler path-prefix semantics.
- The core extraction plan must not claim that variant-prefix normalization is
  shared runtime core.

## Verification

Run after implementation:

```bash
pnpm --filter @tailwindest/core test
pnpm --filter tailwindest test
pnpm --filter @tailwindest/compiler test
pnpm --filter @tailwindest/compiler test
pnpm --filter @tailwindest/compiler test
pnpm --filter @tailwindest/core build
pnpm --filter tailwindest build
pnpm --filter @tailwindest/compiler build
pnpm --filter @tailwindest/compiler pack:dry
```

Expected:

- Core/runtime tests prove structural flattening.
- Compiler tests prove compiled prefix generation remains compiler-owned.
- Full compiler suite proves dev/debug/build convergence remains intact.
- Build and pack checks prove package boundaries and declaration output are
  valid.

## Rejection Conditions

Reject the implementation if any of these are true:

- `@tailwindest/core` still exports or depends on a Tailwind variant allowlist.
- `tailwindest` runtime generates prefixes from object keys.
- Compiler exact output changes without a matching intentional test update.
- A raw compiled-style object can be preserved as normal runtime while requiring
  path-derived prefixes for correctness.
- Tests only compare runtime to core after both share the same wrong behavior.
- Documentation suggests runtime and compiler nested style semantics are the
  same.

## Open Risk

The current hard-coded compiler classifier can preserve existing behavior only
as a short-term bridge. It still cannot be the final source of truth for custom
`tailwindNestGroups` or `groupPrefix`. A later layer must replace it with
metadata or explicit configuration.
