# Validation 02 Lossless Analyzer Token Plan

## Validation Purpose

Verify that Task 02 created an analyzer plan that classifies but never deletes supported static tokens.

## Commands

```bash
git diff -- packages/css-transformer/src/analyzer packages/css-transformer/src/types packages/css-transformer/tests/analyzer
pnpm --filter tailwindest-css-transform test -- tests/analyzer/token_analyzer.test.ts
```

## Code-Level Validation

Check that:

1. A new `plan()` API exists.
2. `plan.tokens` contains every input token and token index.
3. Structured tokens have non-null `property`.
4. Preserved tokens have `property: null` and a reason.
5. `styleTree` is built from structured tokens only.
6. Existing `buildObjectTree()` behavior is not silently repurposed.

## Essential Purpose Validation

The analyzer must answer two questions separately:

1. What can be serialized into a Tailwindest style object?
2. What must be preserved as class literal?

Reject the task if either answer is unavailable from the returned plan.

## Final Validation Table

| Check                   | Pass Condition                                               | Result |
| ----------------------- | ------------------------------------------------------------ | ------ |
| No token deletion       | `plan.tokens.length` equals input token count                | Passed |
| Classification complete | Every token is structured or preserved                       | Passed |
| Style tree scoped       | Preserved tokens do not appear in `styleTree`                | Passed |
| Preservation metadata   | Preserved tokens include original, utility, variants, reason | Passed |
| Analyzer tests pass     | Command exits 0                                              | Passed |

## Rejection Criteria

Reject if a walker would still need to infer missing tokens by comparing input strings to style output.
