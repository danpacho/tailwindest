# @tailwindest/compiler

> **Deprecated / internal experiment**
>
> `@tailwindest/compiler` is private and must not be published to npm. The
> package is retained only for internal experiments and historical validation of
> nested variant materialization. Public projects should use runtime
> Tailwindest authoring with `CreateTailwindest`.

<div align="center">
<img src="../../images/tailwindest-compiler.png" width="550px" alt="tailwindest compiler banner" />
</div>

Deprecated Tailwindest compiler experiment for nested variant lowering and
Tailwind CSS v4 candidate manifest bridging.

`@tailwindest/compiler` was designed to lower `CreateCompiledTailwindest`
nested variant authoring into exact Tailwind class candidates and class strings,
then expose those candidates to Tailwind through `@source inline()`. It is no
longer a release target or a public static optimization contract.

## Status

This package is deprecated and private:

- npm publish is blocked by `private: true`
- `prepublishOnly` fails intentionally if publish is attempted
- package APIs are internal and experimental

No compiler API should be documented or promoted as a stable npm surface.

## Installation

There is no public installation path. Keep any compiler usage inside this
monorepo as an internal experiment.

## Internal Vite Usage

Place `tailwindest()` before `tailwindcss()`:

```ts
import tailwindcss from "@tailwindcss/vite"
import { tailwindest } from "@tailwindest/compiler/vite"
import { defineConfig } from "vite"

export default defineConfig({
    plugins: [
        tailwindest({
            debug: true,
            sourceMap: true,
        }),
        tailwindcss(),
    ],
})
```

The plugin pair performs JavaScript/TypeScript nested variant class lowering
and injects the Tailwind CSS v4 `@source inline()` candidate manifest into CSS
entries. During CSS processing it also loads Tailwind variant metadata through
`@tailwindest/tailwind-internal`, the same internal Tailwind compiler layer used
by `create-tailwind-type`. The compiler does not maintain a hard-coded variant
key list. When CSS variant metadata changes during dev, cached
transform-eligible JavaScript modules are reprocessed before HMR invalidation so
debug, dev, and build output stay aligned.

## Internal Programmatic Usage

```ts
import { compile, compileAsync } from "@tailwindest/compiler"

const result = compile(source, {
    fileName: "/repo/src/button.tsx",
    sourceMap: true,
})

console.log(result.code)
console.log(result.diagnostics)

const cssBacked = await compileAsync(source, {
    fileName: "/repo/src/button.tsx",
    cssRoot: "/repo/src/app.css",
})
```

Use `compileAsync()` with `cssRoot` or `cssSource` when source uses
`CreateCompiledTailwindest` nested shorthand. Plain `compile()` is intentionally
file-local; without Tailwind CSS metadata it preserves shorthand-dependent call
sites as runtime fallbacks instead of guessing variant keys.

## Compile Contract

The compiler has one public behavior: lower nested variant object syntax to
Tailwind class prefixes, then bridge those candidates into Tailwind CSS.

JavaScript replacement is allowed only when the final observable value is a
class string and the compiler can prove the result exactly. Unsupported calls
are preserved for Tailwindest runtime. Diagnostics explain why a call remained
at runtime, and statically knowable Tailwind candidates are retained in the
manifest.

There is no compiler policy switch. Production builds, development builds,
debug manifests, and programmatic compilation all use this same contract.

The manifest records Tailwind candidates as whitespace-delimited tokens. Runtime
class output is preserved exactly, but candidate collection splits embedded
newlines, tabs, and spaces before emitting `@source inline()`.

Relative static imports are resolved only inside the local source graph. Exact
paths are tried first, then `.ts`, `.tsx`, `.mts`, `.cts`, `.js`, `.jsx`,
`.mjs`, `.cjs`, and matching `index.*` files. Package, alias, and
`package.json` resolution remain outside the compiler contract.

## Nested Variants

Nested variant prefix generation is owned by the compiler. Normal Tailwindest
runtime keeps object keys structural and preserves authored leaf class strings.

Nested Tailwind variant keys in `tw.style()` objects are canonical syntax:

```ts
tw.style({
    backgroundColor: "bg-red-50",
    dark: {
        backgroundColor: "bg-red-900",
        hover: {
            backgroundColor: "bg-red-950",
        },
    },
}).class()
// "bg-red-50 dark:bg-red-900 dark:hover:bg-red-950"
```

Explicitly prefixed class strings remain valid and are not double-prefixed, but
new code should prefer nested variant keys for editor clarity and compiler
diagnostics.

Direct string and array leaves at variant-looking keys remain structural
runtime-compatible leaves. They do not infer a variant prefix, even when CSS
metadata is loaded:

```ts
tw.style({ dark: "bg-red-900" }).class()
// "bg-red-900"

tw.style({ dark: "dark:bg-red-900" }).class()
// "dark:bg-red-900"

tw.style({ dark: { backgroundColor: "bg-red-900" } }).class()
// "dark:bg-red-900"
```

Nested shorthand is compile-required class-output syntax. Runtime-visible
object or styler channels such as `*.style()`, `*.compose()`, and
`tw.mergeRecord()` should use runtime-compatible records, including explicitly
prefixed class strings when a runtime object needs variant behavior. If raw
nested shorthand reaches those channels, the compiler preserves the call and
reports `COMPILED_VARIANT_REQUIRES_CLASS_OUTPUT`.

## Release Compile Surface

The compiler recognizes the public Tailwindest `createTools()` API, but the
release compile contract is intentionally smaller than the runtime API.

- `tw.style(...).class()`
- `tw.toggle(...).class()`
- `tw.rotary(...).class()`
- `tw.variants(...).class()`
- `tw.def(...)` and `tw.mergeProps(...)` as exact class-output helpers
- `tw.join(...)` as candidate collection only; no JavaScript replacement
  contract
- runtime-visible object/styler values such as `*.style()`, `*.compose()`, and
  `tw.mergeRecord(...)` are never release replacement targets

Unsupported dynamic values remain runtime fallbacks with diagnostics.

Exact replacement also fails closed for runtime-observable setup and ordering:

- same-file static bindings must be declared before the use site
- local static objects that are mutated or escape through unknown functions are
  not treated as exact compile inputs
- unused `createTools(...)` setup is removed only when erasing the initializer
  cannot skip observable option evaluation
- `.class(...extra)` accepts only the runtime-compatible extra token surface:
  strings and one-level arrays of strings. Object dictionaries remain valid for
  `tw.join()` and `tw.def()`, but not for styler `.class()` extras.

When nested shorthand needs variant metadata and no resolver is available, the
call remains a runtime fallback with `MISSING_COMPILED_VARIANT_METADATA`. The
manifest still keeps the raw structural candidates that runtime would emit; the
compiler does not synthesize guessed prefixes.

## Debug Artifacts

When `debug: true` is enabled, the compiler writes:

```text
.tailwindest/debug-manifest.json
```

The manifest records replacements, candidates, exclusions, fallback status, and
diagnostics. This file is intended for development and CI inspection and should
not be committed by applications.

## Release Verification

The package release gate is:

```bash
pnpm ts:typecheck
pnpm test
pnpm build
pnpm --filter @tailwindest/compiler pack:dry
git diff --check -- packages/tailwindest-compiler packages/tailwindest packages/tailwindest-core packages/tailwind-internal packages/create-tailwind-type pnpm-lock.yaml
```

The root test script runs through Turbo. Package-local Vitest configs own any
required source aliases, and the compiler test runner serializes framework e2e
files so multiple dev/preview servers do not compete inside one package test
process.

See `docs/ARCHITECTURE.md` for the full production architecture.
