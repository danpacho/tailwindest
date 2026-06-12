# Validation 04 CVA Token Preservation

## Validation Purpose

Verify that CVA transformations preserve raw tokens without breaking variant conditions or type extraction.

## Commands

```bash
git diff -- packages/css-transformer/src/walkers/cva_walker.ts packages/css-transformer/tests/walkers/cva_walker.test.ts
pnpm --filter tailwindest-css-transform test -- tests/walkers/cva_walker.test.ts
```

## Code-Level Validation

Check that:

1. CVA parsing uses the analyzer lossless plan for base and option strings.
2. Preserved base tokens are unconditional.
3. Preserved option tokens are conditional on the selected option.
4. Call sites with preserved tokens use `buttonVariants.style(...)` inside `tw.def`.
5. Call sites without preserved tokens still use `.class(...)`.
6. `VariantProps` to `GetVariants` behavior remains intact.
7. Unsafe variant condition cases do not emit unconditional preserved tokens.

## Essential Purpose Validation

For each preserved CVA token, identify its original scope:

| Scope                    | Required Output                                                        |
| ------------------------ | ---------------------------------------------------------------------- |
| Base string              | Always in `tw.def` classList                                           |
| Variant option string    | Conditional expression tied to selected option                         |
| External `className` arg | Passed after static expression through `tw.join` or `.class` extra arg |

## Final Validation Table

| Check                                 | Pass Condition                                                      | Result |
| ------------------------------------- | ------------------------------------------------------------------- | ------ |
| Base token preserved                  | `peer/menu-button` appears unconditionally                          | Passed |
| Variant token preserved conditionally | `size === "lg" && token` appears                                    | Passed |
| Type API intact                       | `GetVariants<typeof ...>` tests pass                                | Passed |
| Unsafe cases guarded                  | Diagnostic/fallback test passes                                     | Passed |
| No regression for structured CVA      | Existing expected outputs unchanged where no preserved tokens exist | Passed |
| Required command passes               | Command exits 0                                                     | Passed |

## Rejection Criteria

Reject if a variant-specific preserved token is emitted unconditionally or if `tw.variants` is replaced by an untyped custom object.
