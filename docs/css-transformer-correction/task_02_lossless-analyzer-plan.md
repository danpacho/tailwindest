# Task 02 Lossless Analyzer Token Plan

## Purpose

Create a lossless class-source planning API in the CSS transformer analyzer. The analyzer must classify every supported static token as structured or preserved without deleting it.

## Problem

`TokenAnalyzerImpl.buildObjectTree()` currently skips unresolved tokens:

```ts
if (!token.property) continue
```

This may remain for legacy object-tree behavior, but transformer serialization must not use it as the source of truth. Resolver failure is preservation metadata.

## Files

- Modify: `packages/css-transformer/src/analyzer/token_analyzer.ts`
- Modify: `packages/css-transformer/src/types/index.ts`
- Test: `packages/css-transformer/tests/analyzer/token_analyzer.test.ts`

## Implementation Spec

### Step 1: Add plan types

Add types equivalent to:

```ts
export type PreservedTokenReason =
    | "unresolved-property"
    | "unsafe-serialization"
    | "unsupported-conditional"

export interface StructuredClassToken extends ParsedToken {
    kind: "structured"
    index: number
    property: string
}

export interface PreservedClassToken extends ParsedToken {
    kind: "preserved"
    index: number
    property: null
    reason: PreservedTokenReason
}

export type ClassSourceToken = StructuredClassToken | PreservedClassToken

export interface ClassSourcePlan {
    source: string
    tokens: ClassSourceToken[]
    structuredTokens: StructuredClassToken[]
    preservedTokens: PreservedClassToken[]
    styleTree: Record<string, any>
}
```

`tokens` preserves input order for diagnostics and fallback. Token preservation, not exact output order, is the shadcn acceptance target.

### Step 2: Add analyzer method

Add a new method without removing existing methods:

```ts
plan(classNames: string | string[]): ClassSourcePlan
```

Required behavior:

1. Use existing `analyze()` splitting and resolving behavior.
2. Assign `index` from original token position.
3. Convert tokens with `property` to `StructuredClassToken`.
4. Convert tokens without `property` to `PreservedClassToken`.
5. Build `styleTree` from structured tokens only.
6. Preserve all original tokens in `plan.tokens`.

### Step 3: Keep legacy behavior isolated

Do not remove `buildObjectTree()` in this task. Existing tests that expect unresolved tokens to be ignored may remain. Later transformer code must use `plan()` for output decisions.

## Test Spec

Add a lossless plan test:

```ts
it("creates a lossless class source plan", () => {
    const analyzer = new TokenAnalyzerImpl(resolver)
    const plan = analyzer.plan("flex group/card hover:bg-accent unknown-xyz")

    expect(plan.tokens.map((token) => token.original)).toEqual([
        "flex",
        "group/card",
        "hover:bg-accent",
        "unknown-xyz",
    ])
    expect(plan.tokens.map((token) => token.index)).toEqual([0, 1, 2, 3])
    expect(plan.structuredTokens.map((token) => token.original)).toEqual([
        "flex",
        "hover:bg-accent",
    ])
    expect(plan.preservedTokens.map((token) => token.original)).toEqual([
        "group/card",
        "unknown-xyz",
    ])
})
```

Add an arbitrary declaration test:

```ts
it("preserves variant arbitrary declarations when unresolved", () => {
    const analyzer = new TokenAnalyzerImpl(resolver)
    const plan = analyzer.plan(
        "gap-(--card-spacing) data-[size=sm]:[--card-spacing:--spacing(4)]"
    )

    expect(plan.preservedTokens[0]).toMatchObject({
        original: "data-[size=sm]:[--card-spacing:--spacing(4)]",
        utility: "[--card-spacing:--spacing(4)]",
        variants: ["data-[size=sm]"],
        reason: "unresolved-property",
    })
})
```

Run:

```bash
pnpm --filter tailwindest-css-transform test -- tests/analyzer/token_analyzer.test.ts
```

## Self-Validation Table

| Requirement                          | Evidence                                    | Status |
| ------------------------------------ | ------------------------------------------- | ------ |
| Analyzer has lossless API            | `plan().tokens` contains every input token  | Passed |
| Every token is classified            | Each token is structured or preserved       | Passed |
| Preserved tokens include reason      | Test checks `reason: "unresolved-property"` | Passed |
| Style tree excludes preserved tokens | Tests verify `styleTree` structured subset  | Passed |
| Legacy behavior isolated             | `buildObjectTree()` is not repurposed       | Passed |

## Completion Criteria

Task 02 is complete when analyzer tests pass and later walkers can consume `ClassSourcePlan` without inferring missing tokens from emitted object trees.
