# Critic 1: Evaluation Engine Judgment Gate

The evaluator is the compiler's legal system. If it is wrong, every later optimization is invalid.

## P0 Rejection Conditions

- Evaluator output differs from current `packages/tailwindest/src/tools` runtime for a supported static input.
- Class token order is changed for aesthetic or normalization reasons.
- `deepMerge` semantics differ for strings, arrays, nested objects, or mixed values.
- Candidate list omits any class present in the emitted class string or style record.
- Unsupported merger is treated as exact.

## Required Proof

### C1.1 Runtime Parity Proof

Required tests:

- `flattenRecord(undefined)` returns `[]`.
- nested object flattening preserves object insertion order.
- array values are flattened as runtime currently does.
- `deepMerge` last-win behavior matches runtime for all combinations from `styler.test.ts`.
- `getClassName` matches runtime byte-for-byte.

Evidence command:

```bash
pnpm --filter @tailwindest/compiler test -- src/core/__tests__/evaluator.test.ts
```

### C1.2 `createTools()` Helper Parity

Required tests:

- `join` matches `clsx` behavior for strings, nested arrays, dictionaries, booleans, `null`, `undefined`, numbers, and bigint.
- `def` matches `toDef` ordering: class list first, merged style list after.
- `mergeRecord` and `mergeProps` match runtime output for multi-record overrides.

### C1.3 Merger Safety

Required tests:

- `kind: "none"` uses runtime default merge.
- known merger requires stable config hash.
- unsupported merger emits `UNSUPPORTED_MERGER`.
- strict mode refuses exact compilation with unsupported merger.
- loose mode returns fallback intent and candidates when statically knowable.

### C1.4 Purity Audit

Forbidden imports in evaluator files:

- `ts-morph`
- `typescript`
- `vite`
- `fs`
- `path`
- `process`

The judge must run a source scan or equivalent review. Any violation rejects the phase.

## Edge Cases That Must Exist

- arbitrary values with brackets and parentheses.
- stacked variants as literal tokens.
- empty style object.
- duplicate nested style paths.
- object keys named `base`, `true`, `false`, numeric strings.

## Verdict Template

Pass only if every supported runtime fixture has either:

- exact byte-for-byte parity, or
- a documented compatibility decision with a failing/skipped test that names the intentional gap.
