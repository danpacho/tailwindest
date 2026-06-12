# Checkpoint 02 Plain Walkers

## Checkpoint Purpose

Stop after Task 03 and ensure the correction is stable for non-CVA class sources before changing CVA semantics.

## Required State

1. Runtime contract tests pass.
2. Analyzer lossless-plan tests pass.
3. `ClassNameWalker` and `CnWalker` tests pass.
4. `CvaWalker` has not been changed unless required by shared type/helper updates.

## Inspection Commands

```bash
git status --short
git diff --stat
pnpm --filter tailwindest-css-transform test -- tests/analyzer/token_analyzer.test.ts tests/walkers/classname_walker.test.ts tests/walkers/cn_walker.test.ts
```

## Review Checklist

| Check                             | Required Evidence                          | Result |
| --------------------------------- | ------------------------------------------ | ------ |
| Analyzer is lossless              | `plan()` tests preserve all tokens         | Passed |
| Plain walkers preserve raw tokens | Mixed static tests assert preserved output | Passed |
| Dynamic precedence is correct     | `tw.join(tw.def(...), className)` shape    | Passed |
| Static-after-dynamic guarded      | No silent pooling across dynamic args      | Passed |
| No raw-string special syntax      | No `String.raw` emitted                    | Passed |
| CVA isolated                      | CVA changes deferred to Task 04            | Passed |

## Go/No-Go Rule

Proceed to Task 04 only if all plain walker tests pass and no preservation regression is visible in plain class sources.

## Final Result

Checkpoint 02 passed with:

```bash
pnpm --filter tailwindest-css-transform test tests/analyzer/token_analyzer.test.ts tests/walkers/classname_walker.test.ts tests/walkers/cn_walker.test.ts
```
