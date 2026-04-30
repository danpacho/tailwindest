# @tailwindest/compiler

<div align="center">
<img src="../../images/tailwindest-compiler.png" width="550px" alt="tailwindest compiler banner" />
</div>

Progressive CSS-in-JS compiler for Tailwindest.

`@tailwindest/compiler` evaluates supported Tailwindest `createTools()` calls
at build time and replaces them with static Tailwind class strings, style
objects, or bounded lookup tables. Calls that cannot be proven static remain as
runtime Tailwindest calls with diagnostics and manifest candidates where they
can be known safely.

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

The plugin pair performs JavaScript/TypeScript replacement and injects the
Tailwind CSS v4 `@source inline()` candidate manifest into CSS entries.
During CSS processing it also loads Tailwind variant metadata through
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

## Progressive Runtime Fallback

The compiler has one public behavior: exact calls are compiled when they can be
proven statically, and unsupported calls are preserved for Tailwindest runtime.
Fallback diagnostics explain why a call remained at runtime, and statically
knowable Tailwind candidates are retained in the manifest.

There is no compiler policy switch. Production builds, development builds,
debug manifests, and programmatic compilation all use this same fallback-safe
contract.

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

## Supported API Surface

The compiler targets the public Tailwindest `createTools()` API:

- `tw.style(...).class()`
- `tw.style(...).style()`
- `tw.style(...).compose()`
- `tw.toggle(...).class()`
- `tw.toggle(...).style()`
- `tw.toggle(...).compose()`
- `tw.rotary(...).class()`
- `tw.rotary(...).style()`
- `tw.rotary(...).compose()`
- `tw.variants(...).class()`
- `tw.variants(...).style()`
- `tw.variants(...).compose()`
- `tw.join(...)`
- `tw.def(...)`
- `tw.mergeProps(...)`
- `tw.mergeRecord(...)`

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
