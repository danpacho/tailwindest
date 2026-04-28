# Tailwindest Static Detector Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Identify real `createTools()` usage and recover static value graphs without relying on variable names or text-only heuristics.

**Architecture:** Detection is three-tiered: Vite hook filter, lexical gate, then semantic analysis. Only the semantic layer may declare a call compileable. The resolver produces immutable `StaticValue` graphs and dependency edges for later HMR invalidation.

**Tech Stack:** TypeScript compiler API or ts-morph, Vitest, fixture modules, tsconfig-aware path resolution.

---

## Files

- Create: `packages/compiler/src/analyzer/lexical_gate.ts`
- Create: `packages/compiler/src/analyzer/detector.ts`
- Create: `packages/compiler/src/analyzer/static_resolver.ts`
- Create: `packages/compiler/src/analyzer/symbols.ts`
- Create: `packages/compiler/src/analyzer/dependency_graph.ts`
- Test: `packages/compiler/src/analyzer/__tests__/lexical_gate.test.ts`
- Test: `packages/compiler/src/analyzer/__tests__/detector.test.ts`
- Test: `packages/compiler/src/analyzer/__tests__/static_resolver.test.ts`
- Test fixture dir: `packages/compiler/src/analyzer/__fixtures__/`

## Public Contract

```ts
export interface DetectionResult {
    calls: TailwindestCallSite[]
    dependencies: string[]
    diagnostics: CompilerDiagnostic[]
}

export interface TailwindestCallSite {
    kind:
        | "style"
        | "toggle"
        | "rotary"
        | "variants"
        | "join"
        | "def"
        | "mergeProps"
        | "mergeRecord"
        | "compose"
    span: SourceSpan
    receiver: TailwindestSymbol
    arguments: StaticValue[]
}
```

## Implementation Steps

### Step 1: Write lexical gate tests

The lexical gate must:

- Return false for files without Tailwindest sentinels.
- Return true for `createTools`, `.style(`, `.toggle(`, `.rotary(`, `.variants(`, `.join(`, `.def(`, `.mergeProps(`, `.mergeRecord(`.
- Prefer false positives over false negatives.
- Ignore comments only if doing so cannot create false negatives.

Run:

```bash
pnpm --filter @tailwindest/compiler test -- src/analyzer/__tests__/lexical_gate.test.ts
```

### Step 2: Write symbol identity tests

Required cases:

- `const tw = createTools()` is detected.
- `const styles = createTools()` is detected.
- imported `tw` from another module is detected.
- re-exported `tw` is detected.
- destructuring returned tools is detected only when symbol identity remains provable.
- local `const tw = otherFactory()` is not detected.
- a method named `style` on another object is not detected.
- shadowed `tw` inside a local scope is not detected as Tailwindest.

### Step 3: Implement `createTools()` provenance tracking

Rules:

- Track direct imports from `tailwindest` package entrypoints and local wrapper modules.
- Resolve aliases through `const x = tw`, `export { tw as css }`, and import re-exports.
- Do not use only `TailwindestInterface` type name as proof. Type-only structural compatibility can cause false positives.
- Prefer explicit call provenance: symbol originates from `createTools()` invocation.

### Step 4: Write static resolver tests

Static accepted:

- object, array, string, boolean, number, bigint literals.
- `as const`, `satisfies`, parenthesized expressions.
- imported `export const` values through at least three files.
- object spreads where every spread source is static.
- computed property names only when the key resolves to a static string.

Static rejected:

- function calls, getters, class instances, `new`, `Date`, `Math.random`, `process.env`.
- mutation after declaration.
- unknown spread.
- conditional value unless both branches are static and the condition is static.
- circular references.

### Step 5: Implement dependency graph output

Rules:

- Every resolved imported value adds a dependency edge.
- Circular references stop with `CIRCULAR_STATIC_REFERENCE`.
- Unknown values produce a local diagnostic and do not poison unrelated call sites.
- The resolver must not mutate AST.

## Required Diagnostics

- `NOT_TAILWINDEST_SYMBOL`
- `UNRESOLVED_STATIC_VALUE`
- `UNSUPPORTED_DYNAMIC_VALUE`
- `UNKNOWN_SPREAD`
- `MUTATED_BINDING`
- `CIRCULAR_STATIC_REFERENCE`
- `SIDE_EFFECTFUL_INITIALIZER`

## Completion Criteria

- Detector tests prove no false positive for non-Tailwindest `tw`.
- Static resolver tests cover accepted and rejected values.
- Dependency graph tests expose reverse dependency data needed by Vite HMR.
- Resolver performance test handles at least 500 fixture modules without unbounded recursion.
