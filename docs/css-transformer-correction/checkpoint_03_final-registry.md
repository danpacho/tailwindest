# Checkpoint 03 Final Registry

## Checkpoint Purpose

Perform final implementation audit after Task 05 before considering `<CSS TRANSFORMER CORRECTION>` complete.

## Required State

1. Runtime contract validated.
2. Lossless analyzer validated.
3. Plain walkers validated.
4. CVA walker validated.
5. Shadcn stability spec passes.
6. Shadcn preservation spec passes.
7. Shadcn snapshots pass.

## Inspection Commands

```bash
git status --short
git diff --stat
pnpm --filter tailwindest-css-transform test
pnpm --filter tailwindest test -- src/tools/__tests__/merger_interface.test.ts
pnpm --filter tailwindest-core test -- src/__tests__/runtime_parity.test.ts
```

## Manual Audit Targets

Review transformed shadcn snapshots for these known historical failures:

| Token Family                 | Required Output Evidence               |
| ---------------------------- | -------------------------------------- |
| `group/name`                 | Present in `tw.def` or raw `tw.join`   |
| `peer/name`                  | Present in `tw.def` or raw `tw.join`   |
| `@container/name`            | Present in `tw.def` or raw `tw.join`   |
| `[--var:value]`              | Present in generated output            |
| `variant:[--var:value]`      | Present with same variant prefix       |
| `data-[side=...]:slide-in-*` | Present if input had it                |
| `**:` chains                 | Present either structured or preserved |
| `xs:w-(--var)`               | Present either structured or preserved |

## Final Review Checklist

| Check                            | Required Evidence                                   | Result |
| -------------------------------- | --------------------------------------------------- | ------ |
| No lossy walker path             | Walkers consume lossless plan                       | Passed |
| No fake property mappings        | No resolver hacks for anchors/declarations          | Passed |
| Runtime API unchanged            | No new public className API                         | Passed |
| Target assumption proven         | Stability spec checks `twMerge(source) === source`  | Passed |
| Missing-token regression blocked | Registry output multiset spec passes                | Passed |
| User class precedence preserved  | Dynamic `className` remains after static expression | Passed |
| Full verification passes         | All commands exit 0                                 | Passed |

## Completion Rule

The correction is complete only if every checklist item passes and no known historical failure family is missing from transformed registry output.

## Final Execution Result

Final implementation reached this checkpoint and passed:

```bash
pnpm --filter tailwindest-css-transform test
pnpm --filter tailwindest-css-transform build
pnpm --filter tailwindest test src/tools/__tests__/merger_interface.test.ts
pnpm --filter tailwindest-core test src/__tests__/runtime_parity.test.ts
```

Additional registry-specific verification passed:

```bash
pnpm --filter tailwindest-css-transform test tests/e2e/shadcn_class_stability.test.ts tests/e2e/shadcn_class_preservation.test.ts tests/e2e/shadcn_registry.test.ts
git diff --exit-code -- packages/css-transformer/tests/fixtures/shadcn_registry packages/css-transformer/tests/fixtures/edge_unresolvable packages/css-transformer/tests/e2e
```

Final commits:

- `49ac393 test(runtime): document class merge contract`
- `66e0f25 feat(css-transformer): add lossless token plan`
- `dbb640a fix(css-transformer): preserve plain class tokens`
- `2288719 fix(css-transformer): preserve cva class tokens`
- `a56895c test(css-transformer): enforce registry class preservation`
