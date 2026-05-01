# @tailwindest/compiler

<div align="center">
<img src="../../images/tailwindest-compiler.png" width="550px" alt="tailwindest compiler banner" />
</div>

Tailwindest compiler for nested variant lowering and Tailwind CSS v4 candidate
manifest bridging.

`@tailwindest/compiler` lowers `CreateCompiledTailwindest` nested variant
authoring into exact Tailwind class candidates and class strings, then exposes
those candidates to Tailwind through `@source inline()`. It is not a public
contract for general static optimization of every Tailwindest runtime value.
Calls that require runtime semantics remain Tailwindest runtime calls with
diagnostics and manifest candidates where they can be known safely.

## Status

This package is prepared for production packaging with a deliberately small
public API surface:

- `@tailwindest/compiler`
- `@tailwindest/compiler/vite`

Internal analyzer, resolver, transform, and Tailwind manifest modules are not
public npm APIs.

## Installation

```bash
pnpm add -D @tailwindest/compiler
pnpm add tailwindest tailwindcss @tailwindcss/vite vite
```

Tailwind CSS and Vite are peer dependencies because applications own their
framework and Tailwind versions.

## Vite Usage

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
key list.

## Programmatic Usage

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
