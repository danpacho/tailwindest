# Compiled Variant Resolver Boundary Plan

**Status:** Corrected strategy. Previous generated-metadata discovery strategy is
rejected.

## Problem

The compiler must not guess Tailwind variant keys, but it also must not depend
on a generated `tailwind.ts` metadata export to learn them.

The previous plan solved the hard-coded allowlist problem by making
`create-tailwind-type` emit:

```ts
export const tailwindNestGroups = ["dark", "hover"] as const
export type TailwindNestGroups = (typeof tailwindNestGroups)[number]
```

and then making the compiler parse that generated file. That makes the compile
result depend on a secondary artifact. It is correct in result only when the
generated file exists, is imported, is resolvable, and is fresh. This is not the
intended architecture.

The authoritative source is already inside the type-generation path:

- `TailwindCompiler.getDesignSystem()`
- `designSystem.getVariants()`
- the `extractVariants()` algorithm currently implemented by
  `TailwindTypeGenerator`

The compiler and `create-tailwind-type` must share that source directly.

## Corrected Decision

Move Tailwind variant extraction into a shared implementation and make both
`create-tailwind-type` and `@tailwindest/compiler` call it directly.

The compiler should derive compiled variant keys from the project Tailwind CSS
design system at compile time:

```ts
const designSystem = await loadDesignSystem(inputCss, { base })
const variantEntries = designSystem.getVariants()
const tailwindNestGroups = extractTailwindNestGroups(variantEntries)
const resolver = createCompiledVariantResolver(tailwindNestGroups)
```

The compiler must not require:

- a generated `tailwind.ts` runtime metadata export
- user-provided `variantKeys`
- type-only import discovery to find variant metadata
- hard-coded Tailwind variant defaults

## Boundary

### tailwind-internal Package

Create a shared internal Tailwind integration package:

```txt
packages/tailwind-internal/src/
```

Package name:

```json
{
    "name": "@tailwindest/tailwind-internal"
}
```

This package is the single authority for Tailwind CSS package resolution,
version detection, design-system loading, CSS compilation helpers, and variant
group extraction. It is intentionally internal to the Tailwindest workspace
contracts, but it is still a normal package so `create-tailwind-type` and
`@tailwindest/compiler` can depend on the same implementation instead of
copying logic.

Public surface:

```ts
export interface ClassItem {
    name: string
    utility: string
    fraction: boolean
    modifiers: string[]
}

export type ClassEntry = [string, { modifiers: string[] }]

export interface TailwindVariantEntry {
    name: string
    isArbitrary: boolean
    values: string[]
    hasDash: boolean
}

export class TailwindCompiler {
    constructor(
        input:
            | { cssRoot: string; base: string }
            | { cssSource: string; base: string }
    )
    compileCss(
        candidates?: string[],
        options?: TailwindCompileOptions
    ): Promise<string>
    getDesignSystem(): Promise<TailwindDesignSystem>
}

export function resolveTailwindNodeDir(
    cssRoot?: string,
    options?: { skipLocal?: boolean }
): Promise<string>

export function getTailwindVersion(baseDir: string): string
export function isVersionSufficient(version: string, minimum?: string): boolean
export function findTailwindCSSRoot(root: string): Promise<string | null>

export function extractTailwindNestGroups(
    variants: readonly TailwindVariantEntry[]
): string[]

export async function loadTailwindNestGroups(input: {
    cssRoot?: string
    cssSource?: string
    base?: string
}): Promise<string[]>
```

Rules:

- `extractTailwindNestGroups()` is pure and has no file-system or Tailwind
  runtime dependency.
- `TailwindCompiler`, `resolveTailwindNodeDir()`, `getTailwindVersion()`,
  `isVersionSufficient()`, and `findTailwindCSSRoot()` are moved out of
  `create-tailwind-type/src/internal`.
- Tailwind CSS version/package selection remains automatic and identical to
  current `create-tailwind-type` behavior:
    - resolve `@tailwindcss/node` near `process.cwd()` and the detected CSS root
    - fall back to the internal package's own dependency only when local
      resolution fails or `skipLocal` is requested
    - use `getTailwindVersion()` and `isVersionSufficient()` before building
      type/compiler artifacts
- `loadTailwindNestGroups()` is a small convenience wrapper around
  `resolveTailwindNodeDir()` when needed + `TailwindCompiler.getDesignSystem()`
    - `extractTailwindNestGroups()`.
- The extraction algorithm must be byte-for-byte equivalent in behavior to the
  current `TailwindTypeGenerator.extractVariants()`:
    - skip values `"group"`, `"peer"`, and `"not"`
    - when `values.length === 0`, emit `entry.name`
    - otherwise emit `${entry.name}${entry.hasDash ? "-" : ""}${value}`
    - preserve Tailwind design-system order

### create-tailwind-type

`create-tailwind-type` becomes a consumer of `@tailwindest/tailwind-internal`.

Required changes:

- remove `src/internal/compiler.ts`, `src/internal/resolution.ts`, and
  duplicated internal exports after moving them into `tailwind-internal`
- import `TailwindCompiler`, `resolveTailwindNodeDir()`,
  `getTailwindVersion()`, `isVersionSufficient()`, and
  `findTailwindCSSRoot()` from `@tailwindest/tailwind-internal`
- remove private `TailwindTypeGenerator.extractVariants()`
- call `extractTailwindNestGroups(this._ds.getVariants())`
- generate `TailwindNestGroups` type from the `tailwind-internal` extractor
  result
- do not rely on any compiler-generated or user-generated metadata file

Generated runtime metadata is no longer required for compiler correctness. The
previous `tailwindNestGroups` const should be removed unless a separate product
decision keeps it as an explicit user-facing feature. For this fix, remove it
to avoid implying that compiler correctness depends on generated output.

### tailwindest-compiler

The compiler becomes a consumer of `@tailwindest/tailwind-internal`.

Compiler responsibilities:

- resolve the Tailwind CSS input source used by the project through the shared
  `findTailwindCSSRoot()`/CSS entry detection path
- resolve the matching `@tailwindcss/node` package through the shared
  `resolveTailwindNodeDir()` logic
- call `loadTailwindNestGroups({ cssRoot, base })` or directly use
  `TailwindCompiler.getDesignSystem()`
- construct `CompiledVariantResolver` from the extracted groups
- use that resolver for:
    - `compileTailwindestCall`
    - evaluator
    - styler model class generation
    - variant optimizer
    - Vite transform candidate collection

The compiler must remove:

- `parseCompiledVariantMetadata`
- `metadataFiles`
- generated module discovery for `tailwindNestGroups`
- type-only import based metadata dependency tracking
- all tests whose only purpose is proving generated metadata parsing

The compiler must keep:

- `MISSING_COMPILED_VARIANT_METADATA` or equivalent fail-closed diagnostic when
  no Tailwind design-system resolver can be built
- no built-in default variant allowlist
- no unsafe exact compile for nested shorthand when resolver is missing

## Tailwind CSS Source Resolution

The compiler needs a deterministic way to load the same Tailwind CSS design
system that Tailwind itself will use.

### Vite Plugin

For normal Vite usage:

1. During `preScan()`, identify Tailwind CSS entry files with the existing
   `isTailwindCssEntry()` logic.
2. For each CSS entry, load the design system through
   `loadTailwindNestGroups({ cssRoot: entryId, base })`, where `base` comes
   from `resolveTailwindNodeDir(entryId)`.
3. Cache a resolver keyed by CSS entry hash and root.
4. Use the resolver for JS transforms.
5. If multiple CSS entries exist:
    - if all yield the same groups, use that resolver
    - if they differ, use the union only if this is documented and tested
    - otherwise emit a diagnostic for ambiguous Tailwind design-system metadata

Conservative default: use a stable union of extracted groups. This avoids
false-negative compilation while still deriving every key from Tailwind.

### Programmatic `compile()`

`compile()` cannot assume there is a Vite CSS module graph.

Replace generated metadata inputs with Tailwind CSS source inputs on the async
API:

```ts
await compileAsync(source, {
    fileName: "/repo/src/button.tsx",
    root: "/repo",
    cssRoot: "/repo/src/app.css",
})
```

or:

```ts
await compileAsync(source, {
    fileName: "/repo/src/button.tsx",
    root: "/repo",
    cssSource: '@import "tailwindcss";',
})
```

Synchronous `compile()` currently cannot await Tailwind design-system loading.
There are two viable paths:

1. Add `compileAsync()` as the fully correct API and keep `compile()` limited to
   flat/explicit candidates unless a resolver is already supplied internally.
2. Make `compile()` accept precomputed `tailwindNestGroups` only as an internal
   testing escape hatch, not as public user API.

Preferred plan: introduce `compileAsync()` for CSS-backed compilation and keep
`compile()` as the current string-only best-effort API with fail-closed nested
shorthand diagnostics.

## Algorithm

Shared extraction algorithm:

```ts
export function extractTailwindNestGroups(entries) {
    const ignoredValues = new Set(["group", "peer", "not"])
    return entries.flatMap((entry) => {
        if (entry.values.length === 0) return [entry.name]
        return entry.values.flatMap((value) =>
            ignoredValues.has(value)
                ? []
                : [`${entry.name}${entry.hasDash ? "-" : ""}${value}`]
        )
    })
}
```

Compiled resolver:

```ts
interface CompiledVariantResolver {
    isVariantKey(key: string): boolean
    tryCombine(parent: string, child: string): string | null
}
```

Rules:

- `isVariantKey(key)` is true only when Tailwind design-system extraction
  produced `key`.
- `tryCombine(parent, child)` returns `${parent}-${child}` only when that
  combined key exists in the extracted set.
- no `dark`, `hover`, `group`, `peer`, etc. in compiler implementation logic
  except test fixtures.
- arbitrary variants are supported only when Tailwind design-system extraction
  produces the corresponding key.

## Migration Steps

1. **tailwind-internal package**
    - Add `packages/tailwind-internal`.
    - Package name: `@tailwindest/tailwind-internal`.
    - Move `create-tailwind-type/src/internal/compiler.ts` there.
    - Move `create-tailwind-type/src/internal/resolution.ts` there.
    - Move CSS discovery helpers there if compiler needs the same automatic CSS
      root detection contract.
    - Add `extractTailwindNestGroups()` there.
    - Add tests for Tailwind package resolution, version detection, compiler
      design-system loading, and pure variant extraction.

2. **create-tailwind-type migration**
    - Depend on `@tailwindest/tailwind-internal`.
    - Replace internal compiler/resolution imports with the new package.
    - Replace private `extractVariants()` with shared
      `extractTailwindNestGroups()`.
    - Keep `TailwindNestGroups` type generation from the extracted string array.
    - Remove generated `tailwindNestGroups` const introduced by the rejected
      metadata-discovery approach.
    - Add a test proving generator output uses the shared extractor result.

3. **compiler loader integration**
    - Depend on `@tailwindest/tailwind-internal`.
    - Add Tailwind design-system loading through the shared package.
    - Preserve automatic Tailwind version/package selection by using
      `resolveTailwindNodeDir()` instead of importing a fixed
      `@tailwindcss/node` instance directly.
    - Vite context builds/caches a resolver from discovered CSS entries.
    - `compileAsync()` builds a resolver from `cssRoot` or `cssSource`.
    - Existing sync `compile()` fails closed for nested shorthand when no
      resolver exists.

4. **remove generated metadata discovery**
    - Delete `compiled_variant_metadata.ts`.
    - Remove `metadataFiles` from public options.
    - Remove `discoverVariantMetadata()` import parsing logic.
    - Remove type-only metadata dependency tests.

5. **preserve current safety fixes**
    - Keep resolver threading through evaluator, API compile, styler model, and
      variant optimizer.
    - Keep all-surface missing-metadata fail-closed tests:
      `style`, `toggle`, `rotary`, `variants`, `def`, `mergeProps`,
      `mergeRecord`.
    - Keep chain tests for `tw.style(...).compose(...).class()`.

6. **docs**
    - Document that the compiler reads Tailwind CSS design-system data directly.
    - Remove instructions that require generated `tailwind.ts` runtime metadata.
    - Explain `compileAsync({ cssRoot/cssSource })` for programmatic usage.
    - Explain fail-closed behavior when CSS design-system loading is absent.

## Validation Criteria

Reject implementation if any of the following are true:

- compiler reads `tailwindNestGroups` from generated `tailwind.ts`
- public compiler API requires `metadataFiles` or user-supplied `variantKeys`
- `create-tailwind-type` and compiler have duplicated Tailwind compiler,
  resolution, version detection, or variant extraction logic
- compiler imports `@tailwindcss/node` directly instead of going through
  `@tailwindest/tailwind-internal`
- compiler contains a default variant allowlist
- nested shorthand exact-compiles without a resolver
- `tw.style(...).compose(...).class()` loses variant prefixes
- programmatic CSS-backed compile cannot compile custom Tailwind variants
- Vite dev/build produce different candidates for the same CSS design system

## Required Tests

### tailwind-internal

- resolves local `@tailwindcss/node` from CSS root before falling back
- detects Tailwind version from the resolved package
- rejects insufficient Tailwind versions consistently with
  `create-tailwind-type`
- loads design-system through `TailwindCompiler.getDesignSystem()`
- emits plain variant when `values.length === 0`
- joins `name + "-" + value` when `hasDash`
- joins `name + value` when `!hasDash`
- skips values `"group"`, `"peer"`, `"not"`
- preserves input order
- handles custom variant entries

### create-tailwind-type

- generated `TailwindNestGroups` contains shared extractor output
- generated type does not depend on runtime metadata const
- snapshot/order stability for variants

### compiler core

- no resolver + nested shorthand => fail closed across all createTools APIs
- resolver from extracted groups prefixes custom variants
- `group.hover` combines only if extracted groups include `group-hover`
- `default` does not prefix unless extracted groups include `default`
- `style.compose().class()` preserves prefixing

### Vite/compiler integration

- Vite loads resolver from Tailwind CSS entry without importing `tailwind.ts`
- custom variant in CSS design system compiles in dev and build
- CSS entry change invalidates/rebuilds resolver
- multiple CSS entries are deterministic
- generated `tailwind.ts` absent: compiler still compiles nested shorthand when
  CSS entry exists

### Programmatic API

- `compile()` without CSS input fails closed for nested shorthand
- `compileAsync({ cssRoot })` compiles nested shorthand
- `compileAsync({ cssSource })` compiles nested shorthand
- no `metadataFiles` API remains

## Verification Commands

```bash
pnpm --filter @tailwindest/tailwind-internal test
pnpm --filter create-tailwind-type test
pnpm --filter @tailwindest/core test
pnpm --filter tailwindest test
pnpm --filter @tailwindest/compiler test
pnpm --filter @tailwindest/compiler test
pnpm --filter @tailwindest/compiler test
pnpm --filter @tailwindest/tailwind-internal build
pnpm --filter create-tailwind-type build
pnpm --filter @tailwindest/core build
pnpm --filter tailwindest build
pnpm --filter @tailwindest/compiler build
pnpm --filter @tailwindest/compiler pack:dry
```

Static checks:

```bash
rg "DEFAULT_COMPILED_VARIANT_KEYS|DEFAULT_VARIANT_KEYS" packages
rg "tailwindNestGroups|metadataFiles|parseCompiledVariantMetadata" packages/tailwindest-compiler/src
rg "@tailwindcss/node" packages/tailwindest-compiler/src packages/create-tailwind-type/src
rg "dark|hover|group|peer" packages/tailwindest-compiler/src/core/compiled_style_normalizer.ts packages/tailwindest-compiler/src/core/compiled_variant_resolver.ts
```

Expected:

- first check: no implementation hits
- second check: no compiler generated-metadata discovery path
- third check: no direct Tailwind package import outside
  `@tailwindest/tailwind-internal`
- fourth check: no hard-coded variant policy in core implementation
