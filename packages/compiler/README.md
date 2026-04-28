# @tailwindest/compiler

<div align="center">
<img src="../../images/tailwindest-compiler.png" width="550px" alt="tailwindest compiler banner" />
</div>

Zero-runtime CSS-in-JS compiler for Tailwindest.

`@tailwindest/compiler` evaluates supported Tailwindest `createTools()` calls
at build time and replaces them with static Tailwind class strings, style
objects, or bounded lookup tables. Fully compiled browser bundles do not ship
Tailwindest styler runtime code.

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
            mode: "strict",
            debug: true,
            sourceMap: true,
        }),
        tailwindcss(),
    ],
})
```

The plugin pair performs JavaScript/TypeScript replacement and injects the
Tailwind CSS v4 `@source inline()` candidate manifest into CSS entries.

## Programmatic Usage

```ts
import { compile } from "@tailwindest/compiler"

const result = compile(source, {
    fileName: "/repo/src/button.tsx",
    mode: "strict",
    sourceMap: true,
})

console.log(result.code)
console.log(result.diagnostics)
```

## Strict and Loose Modes

`strict` mode fails when exact compile-time evaluation is not possible. Use it
for CI and production release gates.

`loose` mode preserves unsupported runtime calls while retaining every
statically knowable Tailwind candidate in the manifest. Use it for incremental
migration.

## Nested Variants

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

Unsupported dynamic values either fail in strict mode or remain as runtime
fallbacks in loose mode.

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
pnpm --filter @tailwindest/compiler build
pnpm --filter tailwindest build
pnpm --filter @tailwindest/compiler exec vitest run src
pnpm vitest run packages/tailwindest/src
pnpm --filter @tailwindest/compiler e2e:vite-tailwind-v4
pnpm --filter @tailwindest/compiler e2e:frameworks
pnpm --filter @tailwindest/compiler e2e:design-system
pnpm --filter @tailwindest/compiler pack:dry
git diff --check -- packages/compiler packages/tailwindest pnpm-lock.yaml
```

See `docs/ARCHITECTURE.md` for the full production architecture.
