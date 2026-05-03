# Tailwindest Compiler Architecture Decision Review

> **Deprecated / internal experiment**
>
> This review is retained only as historical decision context.
> `@tailwindest/compiler` is private, deprecated, and must not be published.

This document records the historical decisions behind `@tailwindest/compiler`.
It is no longer a public release decision log.

## Executive Summary

| Topic                | Decision                                  | Rationale                                                                                                                          |
| -------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Dev/prod parity      | Conditional, adapter-scoped               | A shared evaluator is necessary but not sufficient. Resolver, merger, manifest bridge, and invalidation rules must also be shared. |
| Tailwind integration | Use `@source inline()`                    | Tailwindest emits candidate names, not new utilities. `@source inline()` is the documented Tailwind v4 safelist path.              |
| `addUtilities`       | Rejected                                  | It registers new utilities and can drift from built-in Tailwind semantics.                                                         |
| AST replacement      | Collect -> Reverse Execute                | Span-based replacement is safer than mutating AST nodes.                                                                           |
| Parsing strategy     | Hook filter + lexical gate + semantic AST | This keeps HMR fast while preventing false exact compilation.                                                                      |
| Dynamic variants     | Conflict graph with table limit           | This preserves deep merge semantics without unbounded cartesian output.                                                            |
| Unsupported values   | Progressive runtime fallback              | Silent partial compilation can produce CSS/runtime mismatch.                                                                       |

## 1. Dev and Production Parity

Vite dev and production builds use similar plugin hooks, but they are not
identical environments. Dev mode has server-only state and HMR invalidation.
Production build has different ordering and output phases. Therefore parity is
guaranteed only within an adapter contract that shares:

- static resolver behavior
- evaluator behavior
- merger policy
- manifest bridge behavior
- diagnostic policy
- dependency invalidation behavior

Vite parity is defined as:

```text
preScan -> transformJs -> transformCss
```

using the same `CompilerContext` rules in serve and build modes.

Next.js parity is currently covered through a precompile bridge for App Router
webpack builds. Turbopack is not covered until a native adapter exists.

## 2. Tailwind CSS v4 Integration

The rejected design was to inject generated classes through Tailwind plugin
APIs such as `addUtilities`. That approach is incorrect for Tailwindest because
Tailwindest is not creating new CSS rules; it is asking Tailwind to generate
existing built-in utility candidates.

The accepted design is:

```css
@source inline("inline-flex px-2 hover:bg-blue-600");
```

with optional exclusions:

```css
@source not inline("bg-blue-600");
```

This path is CSS-first, documented by Tailwind v4, and independent of whether
Tailwind scans transformed JavaScript.

## 3. AST Transformation Safety

The compiler uses ASTs for detection, static value resolution, and span
calculation. It does not keep mutable AST nodes as the replacement authority.

Rules:

- collect replacements as `{ start, end, text }`
- discard ambiguous overlapping replacements
- apply replacements in reverse source order
- keep original source when runtime fallback is required
- report source-map issues as diagnostics instead of corrupting output

Memory target per file is:

```text
O(file size + replacement count + candidate count)
```

Long-lived caches must avoid retaining TypeScript node objects.

## 4. Parsing Strategy

The original two-tier design became a three-stage design for Vite 8:

1. Vite hook filter rejects irrelevant file extensions before handler entry.
2. Lexical gate skips AST creation for files without Tailwindest sentinels.
3. Semantic AST analysis proves `createTools()` provenance and static values.

The lexical gate may allow false positives. It must not create false negatives
for valid Tailwindest usage.

## 5. Dynamic Variants

`tw.variants()` cannot always be lowered to simple string concatenation because
Tailwindest style merging has override semantics. It also cannot always be
lowered to a full cartesian table because table size may explode.

The production algorithm:

1. Compute touched style paths per axis.
2. Emit independent axes as additive maps.
3. Group conflicting axes into components.
4. Precompute component tables only within `variantTableLimit`.
5. Preserve runtime calls on overflow.
6. Always retain statically knowable candidates in the Tailwind manifest.

## 6. Public API Coverage

The compiler recognizes the public `createTools()` surface, but exact
JavaScript replacement is intentionally limited to class-output positions where
the final observable value can be proven.

Release replacement targets are:

- `tw.style(...).class()`
- `tw.toggle(...).class()`
- `tw.rotary(...).class()`
- `tw.variants(...).class()`
- `tw.def(...)`
- `tw.mergeProps(...)`

`tw.join(...)` is candidate collection only. Runtime-visible object or styler
channels such as `*.style()`, `*.compose()`, and `tw.mergeRecord(...)` are
preserved as runtime calls while retaining statically knowable manifest
candidates and diagnostics.

The design-system E2E fixture exists to prove this coverage in a realistic page
instead of only isolated unit snippets.

## 7. Risk Register

| Risk                                              | Impact                            | Mitigation                                                                                       |
| ------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------ |
| Tailwind does not scan transformed JS             | Missing CSS                       | Manifest bridge through CSS                                                                      |
| CSS transform runs before manifest initialization | Missing initial CSS               | Pre-scan and shared context                                                                      |
| HMR keeps stale candidates                        | Dev/prod divergence               | Reverse dependency invalidation and CSS metadata-triggered JS reprocessing                       |
| CSS text changes without metadata changes         | Unnecessary HMR churn             | Compare effective variant metadata before cached JS reprocessing                                 |
| Extensionless local imports resolve differently   | Missed static values/provenance   | Exact-path-first local resolver with source extension and `index.*` matrix                       |
| Dynamic variant lookup key collisions             | Wrong class table entry           | Structural JSON tuple keys for dynamic `variants().class()` lookups                              |
| Whitespace inside class strings enters safelist   | Invalid `@source inline()` groups | Split manifest candidates on all whitespace while preserving runtime output                      |
| Direct variant-looking string leaves drift        | Metadata-dependent class output   | Treat direct string/array leaves as structural; infer prefixes only from object-valued shorthand |
| Missing variant metadata drops fallback CSS       | Dev/debug/build manifest drift    | Preserve runtime structural candidates while keeping `MISSING_COMPILED_VARIANT_METADATA`         |
| Declaration-before-use is compiled away           | Runtime TDZ or ordering mismatch  | Require same-file bindings to be declared before each static use site                            |
| Runtime setup side effects are cleaned up         | Removed observable behavior       | Erase unused `createTools()` setup only when the initializer is side-effect-free                 |
| Escaped `.class(...extra)` inputs act like `join` | Runtime/compiler class mismatch   | Limit styler `.class()` extras to strings and one-level string arrays                            |
| Custom merger is not deterministic                | Wrong classes                     | Exact compile only for supported mergers                                                         |
| Variant table explosion                           | Bundle bloat                      | Conflict graph and table limit                                                                   |
| Unsupported value is silently skipped             | Runtime/CSS mismatch              | Fallback diagnostics and runtime preservation                                                    |
| Raw nested leaves leak                            | Extra CSS and semantic confusion  | Effective exclusions with `@source not inline()`                                                 |
| Next/TanStack adapter drift                       | Framework mismatch                | Dedicated E2E fixtures and screenshots                                                           |

## Final Decision

The production architecture is:

```text
shared evaluator
  + semantic static resolver
  + deterministic substitution
  + candidate/exclusion manifest
  + Tailwind @source inline() bridge
  + framework-specific adapter validation
```

This was the former release baseline for `@tailwindest/compiler`; it is now
historical context only.
