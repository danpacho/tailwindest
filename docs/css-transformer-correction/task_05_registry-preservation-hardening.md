# Task 05 Registry Stability and Preservation Hardening

## Purpose

Build shadcn registry specs that prove the correction target is merge-stable and that transformed output contains every supported static class token.

## Problem

Current shadcn snapshots pass despite missing tokens. Snapshot equality alone cannot prove preservation. Strict output order is not the primary target because the registry class strings are already conflict-clean; the required authority is token preservation plus a target stability guard.

## Files

- Create: `packages/css-transformer/tests/e2e/shadcn_class_stability.test.ts`
- Create: `packages/css-transformer/tests/e2e/shadcn_class_preservation.test.ts`
- Modify: `packages/css-transformer/tests/e2e/shadcn_registry.test.ts` only if shared setup extraction is needed.
- Modify snapshots: `packages/css-transformer/tests/fixtures/shadcn_registry/expected_*.txt`

## Implementation Spec

### Step 1: Extract or duplicate real resolver setup

Use the same setup as `shadcn_registry.test.ts`:

```ts
const generator = new TailwindTypeGenerator(...).setGenOptions({
    useDocs: true,
    useExactVariants: false,
    useArbitraryValue: false,
    useSoftVariants: true,
    useStringKindVariantsOnly: false,
    useOptionalProperty: false,
    disableVariants: true,
})
```

Do not use a mock resolver for registry specs.

### Step 2: Implement input class source collector

Collect supported static sources from:

1. JSX `className` string literal.
2. JSX `className` expression string literal.
3. JSX `className` no-substitution template literal.
4. `cn`, `clsx`, `classNames` string or no-substitution template args.
5. `cva` first argument string.
6. `cva` variants option string literals.

For each collected source, retain:

```ts
type CollectedClassSource = {
    file: string
    surface:
        | "className"
        | "cn-arg"
        | "clsx-arg"
        | "classNames-arg"
        | "cva-base"
        | "cva-option"
    source: string
    tokens: string[]
    location: { line: number; column: number }
}
```

Use `splitClassString` for token splitting.

### Step 3: Add shadcn stability spec

Use `tailwind-merge` as a test-only oracle. If it is not available to `tailwindest-css-transform` tests, add it as a dev dependency only.

For every collected source:

```ts
const normalized = source.tokens.join(" ")
expect(twMerge(normalized)).toBe(normalized)
```

Failure message must include:

```txt
file
surface
location
source
twMerge(source)
```

This spec documents the target assumption: shadcn fixture strings are already merge-stable.

### Step 4: Implement transformed output token collector

Collect tokens from Tailwindest class-producing output:

1. String leaves inside `tw.style({...})`.
2. String leaves inside `tw.variants({...})`.
3. Literal items inside `tw.def([...], ...)`.
4. String literal args to `tw.join(...)`.
5. String literal extra args to `.class(...)`.
6. Conditional string literals used for CVA preserved variants.

Do not count import paths, display names, object keys, diagnostics, or non-class strings.

### Step 5: Add output preservation multiset spec

For each file:

```ts
for (const [token, inputCount] of inputCounts) {
    expect(outputCounts.get(token) ?? 0).toBeGreaterThanOrEqual(inputCount)
}
```

Failure message must include:

```txt
file name
missing token
input count
output count
```

### Step 6: Add targeted historical regression assertions

The preservation spec must explicitly check these families when present in input:

```txt
group/name
peer/name
@container/name
[--var:value]
variant:[--var:value]
data-[side=...]:slide-in-*
**: chains
xs:w-(--var)
```

### Step 7: Add serialization equivalence spot checks

For helper paths that expose `SerializedClassSource` metadata, add unit or E2E assertions:

```ts
expect(twMerge(result.inputTokens.join(" "))).toBe(
    twMerge(result.outputTokens.join(" "))
)
```

This guard is not a full order-preservation spec. It verifies that the chosen shadcn serialization shape does not change the merge oracle result.

### Step 8: Update snapshots

After stability and preservation specs pass, update existing shadcn expected files:

```bash
pnpm --filter tailwindest-css-transform exec vitest run tests/e2e/shadcn_registry.test.ts -u
```

Review snapshot changes manually. Expected changes must be limited to preservation serialization such as `tw.def`, raw fallback for unsafe cases, diagnostics, or imports required by those changes.

## Test Spec

Run:

```bash
pnpm --filter tailwindest-css-transform test -- tests/e2e/shadcn_class_stability.test.ts
pnpm --filter tailwindest-css-transform test -- tests/e2e/shadcn_class_preservation.test.ts
pnpm --filter tailwindest-css-transform test -- tests/e2e/shadcn_registry.test.ts
pnpm --filter tailwindest-css-transform test
```

## Self-Validation Table

| Requirement                        | Evidence                                                | Status |
| ---------------------------------- | ------------------------------------------------------- | ------ |
| Every registry fixture checked     | Specs iterate all `input_*.txt`                         | Passed |
| Real resolver used                 | Setup matches `shadcn_registry.test.ts`                 | Passed |
| Target is merge-stable             | `twMerge(source) === source` for every collected source | Passed |
| Output token inclusion enforced    | Multiset spec catches missing tokens                    | Passed |
| Historical failures targeted       | Explicit family assertions exist                        | Passed |
| Snapshots updated after specs pass | `expected_*.txt` reviewed                               | Passed |

## Completion Criteria

Task 05 is complete when the shadcn stability spec, preservation spec, snapshot test, and full css-transformer suite pass.
