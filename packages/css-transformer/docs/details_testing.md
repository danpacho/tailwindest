# CSS Transformer Testing Strategy

The transformer is a migration tool. Incorrect rewrites can change application
behavior, so tests must prove both successful conversion and conservative
fallback.

## Test Layers

1. Resolver unit tests.
2. Analyzer unit tests.
3. Walker unit tests.
4. Import collector tests.
5. Registry integration tests.
6. Golden-file E2E tests.

## Resolver Tests

Verify that individual Tailwind tokens map to the expected Tailwindest style
paths. Include unresolved token diagnostics.

## Analyzer Tests

Verify class string to style object conversion. Include variants, duplicate
properties, arbitrary values, and unresolved tokens.

## Walker Tests

Each walker must prove:

- it detects only supported nodes
- it preserves unsupported nodes
- it emits diagnostics when fallback is required
- it produces stable source output

## Golden-File E2E

Golden fixtures should contain:

- `input.tsx`
- `expected.tsx`
- optional `diagnostics.json`

The E2E runner transforms `input.tsx` and compares the result with
`expected.tsx`.

## Required Fixtures

- static `className`
- `cn` with static and dynamic arguments
- `clsx` compatible call
- `cva` base and variants
- mixed patterns in one file
- unsupported dynamic fallback

## Release Gate

Release is blocked unless every test layer passes and `git diff --check`
reports no whitespace errors.
