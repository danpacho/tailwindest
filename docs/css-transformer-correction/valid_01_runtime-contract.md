# Validation 01 Runtime Contract Boundary

## Validation Purpose

Verify that Task 01 established the runtime contract needed for preserved raw class literals plus structured style objects.

## Required Inputs

- Completed Task 01 diff.
- Test output from Tailwindest runtime packages.

## Commands

```bash
git diff -- packages/tailwindest packages/tailwindest-core
pnpm --filter tailwindest test -- src/tools/__tests__/merger_interface.test.ts
pnpm --filter tailwindest-core test -- src/__tests__/runtime_parity.test.ts
```

## Code-Level Validation

Check that:

1. `tw.def(["group/card"], { display: "flex" })` is tested without merger.
2. `tw.join(...)` is tested as ordered concatenation without merger.
3. `tailwind-merge` is tested only when explicitly supplied.
4. `.class("p-4")` is tested as later precedence than style tokens.
5. `tw.join(tw.def(...), "p-6")` is tested as later precedence than both raw and structured static tokens.
6. A custom merger spy records current call boundaries and does not require a single final call.
7. No new public API such as `tw.className` exists.

## Essential Purpose Validation

The accepted conclusion is:

```txt
Core runtime supports the needed bridge APIs.
The correction remains a css-transformer token-preservation fix.
```

## Final Validation Table

| Check                      | Pass Condition                                                                       | Result |
| -------------------------- | ------------------------------------------------------------------------------------ | ------ |
| Runtime tests exist        | Assertions cover default concat, optional `twMerge`, `.class`, `tw.join`, merger spy | Passed |
| Merge optionality explicit | Tests pass `twMerge` through `createTools({ merger })`                               | Passed |
| Public API unchanged       | No exported new className API                                                        | Passed |
| Required commands pass     | Both commands exit 0                                                                 | Passed |

## Rejection Criteria

Reject if any of the following are true:

1. Runtime behavior changed without tests.
2. A new public API was added for preserved tokens.
3. `tailwind-merge` became built in.
4. Tests assert only final strings without documenting custom merger invocation boundaries.
