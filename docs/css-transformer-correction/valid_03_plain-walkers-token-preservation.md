# Validation 03 Plain Walkers Token Preservation

## Validation Purpose

Verify that plain `className` and `cn` transformations preserve unresolved static tokens through generated Tailwindest output.

## Commands

```bash
git diff -- packages/css-transformer/src/walkers packages/css-transformer/tests/walkers
pnpm --filter tailwindest-css-transform test -- tests/walkers/classname_walker.test.ts tests/walkers/cn_walker.test.ts
```

## Code-Level Validation

Check that:

1. Walkers consume `context.analyzer.plan(...)`.
2. Walkers do not reconstruct missing tokens from emitted object trees.
3. `tw.def([...], styleConst.style())` is used for mixed preserved and structured static tokens where safe.
4. Dynamic args are appended through `tw.join(..., dynamicArgs...)` for common shadcn shapes.
5. Static-after-dynamic calls are not silently reordered across dynamic args.
6. No `String.raw` output exists.

## Essential Purpose Validation

For each transformed plain class source:

```txt
original preserved tokens are present in Tailwindest output
structured tokens are present in style object leaves
dynamic user args retain later precedence
```

## Final Validation Table

| Check                                    | Pass Condition                                                     | Result |
| ---------------------------------------- | ------------------------------------------------------------------ | ------ |
| ClassNameWalker preserves anchors        | Test includes `group/card` in output                               | Passed |
| CnWalker preserves arbitrary declaration | Test includes `[--var:value]` in output                            | Passed |
| Dynamic precedence intact                | Output shape is `tw.join(tw.def(...), className)` for common shape | Passed |
| Static-after-dynamic guarded             | Test prevents silent pooling across dynamic arg                    | Passed |
| Serialization uses normal strings        | No `String.raw` in output tests                                    | Passed |
| Required tests pass                      | Command exits 0                                                    | Passed |

## Rejection Criteria

Reject if preserved tokens are omitted, appended after user `className` for common shadcn shapes, or serialized only as `.class()` without raw preservation.
