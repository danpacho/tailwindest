# Task 04 CVA Token Preservation

## Purpose

Update `CvaWalker` so CVA base and variant-option preserved tokens are serialized through Tailwindest output while preserving `tw.variants` and `GetVariants` compatibility.

## Problem

CVA is conditional. A preserved token in base always applies. A preserved token in a variant option applies only when that option is selected. Serializing all preserved tokens unconditionally would be incorrect.

## Files

- Modify: `packages/css-transformer/src/walkers/cva_walker.ts`
- Reuse: `packages/css-transformer/src/walkers/utils/class_literal.ts`
- Reuse: `packages/css-transformer/src/walkers/utils/class_source_serializer.ts`
- Test: `packages/css-transformer/tests/walkers/cva_walker.test.ts`

## Implementation Spec

### Step 1: Collect CVA preserved metadata

When parsing the `cva` base string:

```ts
const basePlan = context.analyzer.plan(baseStr)
baseObj = basePlan.styleTree
basePreserved = basePlan.preservedTokens.map((token) => token.original)
```

When parsing each variant option string, store both:

```ts
variantsObj[variantName][optionName] = optionPlan.styleTree
preservedVariants[variantName][optionName] = optionPlan.preservedTokens.map(
    (token) => token.original
)
```

### Step 2: Preserve metadata for call-site rewrite

`rewriteCallSites` needs access to preserved metadata for the variant helper:

```ts
type CvaPreservedPlan = {
    base: string[]
    variants: Record<string, Record<string, string[]>>
}
```

### Step 3: Rewrite call sites with `style()` when preserved tokens exist

If no preserved tokens exist, keep existing `.class(...)` rewrite.

If preserved tokens exist, rewrite:

```ts
buttonVariants({ variant, size, className })
```

to:

```ts
tw.join(
    tw.def(
        [
            ...basePreserved,
            variant === "outline" && "...",
            size === "lg" && "...",
        ],
        buttonVariants.style({ variant, size })
    ),
    className
)
```

This keeps structured variant typing through `tw.variants` while preserving raw class tokens in the final class stream.

### Step 4: Preserve VariantProps migration

`VariantProps<typeof buttonVariants>` must still become `GetVariants<typeof buttonVariants>`. The helper remains `tw.variants`, not a custom wrapper.

### Step 5: Conditional expression generation rules

1. Use strict equality against the selected option value.
2. Use the original variant prop name.
3. If a variant option key is not a valid identifier or is boolean-like, generate a valid expression using the runtime value parsed by `splitVariantCallArgs`.
4. If the call lacks a safe selected value and variant-specific preserved tokens exist, do not guess. Fall back conservatively or emit a diagnostic requiring manual review.

### Step 6: Serialization guard

For shadcn registry fixtures, Task 05 will validate that transformed mixed CVA sources remain equivalent under the test merge oracle. If a future CVA source fails the guard, do not emit a lossy partial conversion.

## Test Spec

### Base preserved token

Input:

```ts
const buttonVariants = cva("peer/menu-button flex text-sm", {
    variants: {
        size: {
            lg: "h-12",
        },
    },
})

const value = buttonVariants({ size, className })
```

Expected contains:

```ts
tw.def(["peer/menu-button"], buttonVariants.style({ size }))
```

and:

```ts
tw.join(..., className)
```

### Variant-specific preserved token

Input:

```ts
const buttonVariants = cva("flex", {
    variants: {
        size: {
            lg: "h-12 group-data-[collapsible=icon]:!p-0",
            sm: "h-7",
        },
    },
})

const value = buttonVariants({ size })
```

Expected contains:

```ts
size === "lg" && "group-data-[collapsible=icon]:!p-0"
```

and:

```ts
buttonVariants.style({ size })
```

### Unsafe condition test

If a call cannot expose a safe selected option value and variant-specific preserved tokens exist, expected behavior is diagnostic or conservative fallback, not unconditional emission.

### No preserved token regression

Existing CVA tests with only structured tokens must keep `.class(...)` output.

Run:

```bash
pnpm --filter tailwindest-css-transform test -- tests/walkers/cva_walker.test.ts
```

## Self-Validation Table

| Requirement                            | Evidence                                          | Status |
| -------------------------------------- | ------------------------------------------------- | ------ |
| Base preserved token always applies    | Test asserts unconditional base token in `tw.def` | Passed |
| Variant preserved token is conditional | Test asserts `size === "lg" && token`             | Passed |
| Structured variants remain typed       | Output remains `tw.variants`                      | Passed |
| `GetVariants` migration preserved      | Existing VariantProps tests pass                  | Passed |
| Unsafe condition not guessed           | Diagnostic/fallback test passes                   | Passed |
| No-preserved CVA output unchanged      | Existing tests pass                               | Passed |

## Completion Criteria

Task 04 is complete when CVA tests pass and preserved tokens are applied under the same base or variant conditions as the original `cva` definition.
