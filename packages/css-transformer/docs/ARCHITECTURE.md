# CSS Transformer Architecture

`@tailwindest/css-transformer` converts existing class-string based React code
into Tailwindest object-style calls. It is a migration tool, not a runtime
dependency.

## Purpose

The transformer helps teams move from patterns such as `className`, `cn`,
`clsx`, and `cva` to Tailwindest style objects while preserving source
behavior as much as possible.

## Pipeline

```text
source file
  -> parse with ts-morph
  -> resolve Tailwind tokens
  -> analyze class-string structure
  -> collect transform targets
  -> execute replacements in reverse source order
  -> update imports
  -> return transformed source and diagnostics
```

## Core Components

- `TokenResolver`: maps Tailwind utility tokens into object style paths.
- `TokenAnalyzer`: turns class strings into structured style records.
- `TransformerRegistry`: orders walkers and coordinates replacement.
- `ImportCollector`: adds required Tailwindest imports and removes obsolete
  helper imports when safe.
- Walkers: handle `cva`, `cn`/`clsx`, and literal `className` patterns.

## Safety Model

The transformer uses Collect -> Reverse Execute. AST nodes are used for
detection, but final edits are applied by source range to avoid stale node
mutation issues.

If a node cannot be transformed safely, the transformer preserves the original
code and records a diagnostic. The tool must prefer a conservative no-op over a
behavior-changing rewrite.

## Production Scope

Supported:

- static `className="..."`
- static portions of `cn`, `clsx`, and compatible class helpers
- `cva` base and simple variants
- import insertion and cleanup

Conservative fallback:

- dynamic expressions
- unsupported compound variants
- unknown class tokens
- resolver misses
- ambiguous import ownership

## Release Criteria

- Resolver tests pass.
- Analyzer tests pass.
- Walker and registry tests pass.
- Golden-file E2E tests pass.
- Diagnostics are emitted for every preserved unsupported pattern.
