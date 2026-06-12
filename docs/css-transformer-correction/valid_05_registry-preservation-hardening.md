# Validation 05 Registry Stability and Preservation Hardening

## Validation Purpose

Verify that the final transformer correction targets a merge-stable shadcn corpus and preserves every supported static registry class token.

## Commands

```bash
git diff -- packages/css-transformer/tests/e2e packages/css-transformer/tests/fixtures/shadcn_registry
pnpm --filter tailwindest-css-transform test -- tests/e2e/shadcn_class_stability.test.ts
pnpm --filter tailwindest-css-transform test -- tests/e2e/shadcn_class_preservation.test.ts
pnpm --filter tailwindest-css-transform test -- tests/e2e/shadcn_registry.test.ts
pnpm --filter tailwindest-css-transform test
```

## Code-Level Validation

Check that:

1. The stability and preservation tests use real resolver setup.
2. The tests iterate every `input_*.txt` fixture.
3. Input tokens are collected from supported static class surfaces only.
4. Stability test checks `twMerge(source) === source`.
5. Output tokens are collected from Tailwindest class-producing expressions only.
6. Token counts are compared as multisets.
7. Failure messages identify file and token.
8. Snapshots contain `tw.def` or raw fallback where preserved tokens are mixed with structured style.
9. No `String.raw` appears in newly generated transformer output.

## Essential Purpose Validation

The final correction must prove:

```txt
For every supported shadcn static source:
    source is twMerge-stable

For every transformed shadcn registry file:
    every supported static Tailwind token in the input is present in the output
```

This is the authority over snapshot green status.

## Final Validation Table

| Check                             | Pass Condition                                         | Result |
| --------------------------------- | ------------------------------------------------------ | ------ |
| Stability spec exists             | `shadcn_class_stability.test.ts` present               | Passed |
| Preservation spec exists          | `shadcn_class_preservation.test.ts` present            | Passed |
| All fixtures covered              | Fixture loop count equals all input files              | Passed |
| Multiset token preservation       | No missing token assertion fails                       | Passed |
| Historical token families covered | Known omission families asserted when present          | Passed |
| Snapshot suite passes             | `shadcn_registry.test.ts` exits 0                      | Passed |
| Full package suite passes         | `pnpm --filter tailwindest-css-transform test` exits 0 | Passed |

## Rejection Criteria

Reject if snapshots pass but preservation spec fails, if the stability assumption is not tested, or if the preservation spec ignores CVA variant option strings.
