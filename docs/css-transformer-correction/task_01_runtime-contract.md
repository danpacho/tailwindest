# Task 01 Runtime Contract Boundary

## Purpose

Document and test the existing Tailwindest runtime contract needed by the transformer correction. This task must prove that `tw.def`, `tw.join`, and `.class(...literals)` can carry preserved raw class literals plus structured style objects, while Tailwind conflict merging remains optional.

No transformer implementation may start before this task passes.

## Problem

The transformer needs to preserve raw class tokens that cannot become style object leaves:

```ts
tw.def(["group/card"], { display: "flex" })
tw.join(tw.def(["raw"], style.style()), className)
style.class("user-extra")
```

The runtime must not be treated as if `tailwind-merge` is built in. If a caller wants merge behavior, the caller supplies a merger.

## Files

Modify only if required by failing tests:

- `packages/tailwindest/src/tools/__tests__/merger_interface.test.ts`
- `packages/tailwindest-core/src/__tests__/runtime_parity.test.ts`
- `packages/tailwindest/src/tools/create_tools.ts`
- `packages/tailwindest/src/tools/primitive.ts`
- `packages/tailwindest/src/tools/variants.ts`
- `packages/tailwindest/src/tools/rotary.ts`
- `packages/tailwindest-core/src/evaluation_engine.ts`
- `packages/tailwindest-core/src/style_engine.ts`

## Implementation Spec

### Step 1: Add default concatenation tests

Add assertions proving default behavior:

```ts
it("tw.def applies raw tokens before structured style tokens", () => {
    const tw = createTools<any>()

    expect(tw.def(["group/card"], { display: "flex" })).toBe("group/card flex")
})

it("tw.join preserves argument order without a merger", () => {
    const tw = createTools<any>()

    expect(tw.join("group/card", "flex", "text-sm")).toBe(
        "group/card flex text-sm"
    )
})
```

### Step 2: Add optional merger tests

Use `tailwind-merge` only when explicitly supplied:

```ts
import { twMerge } from "tailwind-merge"

it("tw.def with supplied twMerge delegates merge behavior", () => {
    const tw = createTools<any>({ merger: twMerge })

    expect(tw.def(["p-2"], { padding: "p-4" })).toBe(twMerge("p-2", "p-4"))
})

it("style.class appends later-precedence extras", () => {
    const tw = createTools<any>({ merger: twMerge })

    expect(tw.style({ padding: "p-2" }).class("p-4")).toBe(
        twMerge("p-2", "p-4")
    )
})

it("tw.join after tw.def keeps user class precedence", () => {
    const tw = createTools<any>({ merger: twMerge })

    expect(tw.join(tw.def(["p-2"], { padding: "p-4" }), "p-6")).toBe(
        twMerge("p-2", "p-4", "p-6")
    )
})
```

### Step 3: Document custom merger boundaries

Add a spy test. Do not require a single final merger call:

```ts
it("tw.def documents current nested merger boundaries", () => {
    const calls: string[][] = []
    const merger = (...tokens: string[]) => {
        calls.push(tokens)
        return tokens.join("|")
    }
    const tw = createTools<any>({ merger })

    expect(tw.def(["p-2"], { padding: "p-4" })).toBe("p-2|p-4")
    expect(calls).toEqual([["p-4"], ["p-2", "p-4"]])
})
```

### Step 4: Runtime correction constraints

If implementation is required:

1. Keep public API unchanged.
2. Do not add `tw.className`.
3. Do not make `tailwind-merge` a built-in runtime dependency.
4. Preserve `tw.def` as raw-list-before-style.
5. Preserve `.class(extra)` as style-before-extra.
6. Update core parity tests if runtime internals change.

## Test Spec

Run:

```bash
pnpm --filter tailwindest test -- src/tools/__tests__/merger_interface.test.ts
pnpm --filter tailwindest-core test -- src/__tests__/runtime_parity.test.ts
```

## Self-Validation Table

| Requirement                         | Evidence                                   | Status |
| ----------------------------------- | ------------------------------------------ | ------ |
| `tw.def` preserves raw before style | Test checks `group/card flex`              | Passed |
| `tw.join` preserves argument order  | Test checks ordered concat                 | Passed |
| `twMerge` is optional               | Tests pass `twMerge` explicitly            | Passed |
| `.class(extra)` appends extras      | Test compares with `twMerge("p-2", "p-4")` | Passed |
| Custom merger boundary documented   | Spy test records call sequence             | Passed |
| No public API expansion             | Diff review                                | Passed |

## Completion Criteria

Task 01 is complete when required tests pass and no runtime API expansion was introduced.
