# Task 03 Plain Walkers Token Preservation

## Purpose

Update `ClassNameWalker` and `CnWalker` to preserve unresolved static tokens through Tailwindest output while keeping existing structured conversion behavior.

## Problem

Plain class sources currently lose unresolved static tokens when the static object is extracted. The correction must emit a class expression that contains:

```txt
preserved static tokens + structured static tokens + dynamic/user tokens
```

The shadcn target is verified as `twMerge`-stable, so exact static token order is not the primary acceptance criterion. Dynamic/user class precedence still matters.

## Files

- Modify: `packages/css-transformer/src/walkers/classname_walker.ts`
- Modify: `packages/css-transformer/src/walkers/cn_walker.ts`
- Create or modify helper: `packages/css-transformer/src/walkers/utils/class_literal.ts`
- Create or modify helper: `packages/css-transformer/src/walkers/utils/class_source_serializer.ts`
- Test: `packages/css-transformer/tests/walkers/classname_walker.test.ts`
- Test: `packages/css-transformer/tests/walkers/cn_walker.test.ts`

## Implementation Spec

### Step 1: Add string literal serializer helper

Create a helper that emits normal JavaScript string literals:

```ts
export function quoteClassLiteral(value: string): string {
    return JSON.stringify(value)
}
```

Do not emit `String.raw`.

### Step 2: Add class source serializer helper

Create a helper that accepts `ClassSourcePlan` and returns code plus metadata:

```ts
export interface SerializedClassSource {
    code: string
    inputTokens: string[]
    outputTokens: string[]
    mode: "raw" | "style" | "def"
}
```

Rules:

1. `inputTokens` must equal `plan.tokens.map((token) => token.original)`.
2. `outputTokens` must list every static token represented by `code`.
3. If `propertyCount < objectThreshold`, return raw `tw.join("original class string")`.
4. If no structured token exists, return raw `tw.join("original class string")`.
5. If every token is structured, return the existing style constant `.class()` shape.
6. If structured and preserved tokens are mixed, return `tw.def(preservedTokens, styleConst.style())`.
7. Never emit `String.raw`.

### Step 3: ClassNameWalker behavior

Use `context.analyzer.plan(classString)`.

Rules:

1. Empty className behavior stays unchanged.
2. No structured token means decline or raw fallback according to existing walker behavior.
3. Pure structured output keeps existing style constant behavior.
4. Mixed output goes through the shared serializer and must include every preserved token.

Example:

```ts
className={tw.def(["group/card"], rootStyle.style())}
```

### Step 4: CnWalker behavior

Use `context.analyzer.plan(staticClassNames)` for the common static-bucket path.

For static plus dynamic:

```ts
tw.join(tw.def(["preserved"], staticStyle.style()), ...dynamicArgs)
```

For static only:

```ts
tw.def(["preserved"], staticStyle.style())
```

If a `cn` call has static arguments after dynamic arguments, preserve argument order where feasible with `tw.join(...)`. If unsupported, use raw fallback or emit a diagnostic rather than silently changing user precedence.

### Step 5: Import behavior

`tw.def` and `tw.join` are methods on the same `tw` import. No additional named import is required beyond existing `tw`.

## Test Spec

### ClassNameWalker tests

Add:

```ts
it("preserves unresolved static tokens with tw.def when style object is emitted", () => {
    const input = `const a = <div className="group/card flex text-sm bg-accent" />`
    // objectThreshold: 2
    // expected contains: tw.def(["group/card"], globalDiv.style())
})
```

Assert:

```ts
expect(text).toContain(`tw.def(["group/card"]`)
expect(text).not.toContain(`String.raw`)
```

### CnWalker tests

Add:

```ts
it("preserves unresolved static tokens before dynamic user classes", () => {
    const input = `const a = cn("group/card flex text-sm bg-accent", className)`
    // expected contains:
    // tw.join(tw.def(["group/card"], globalDiv.style()), className)
})
```

Add arbitrary declaration case:

```ts
cn("gap-(--card-spacing) [--card-spacing:--spacing(5)]", className)
```

Expected contains:

```ts
tw.join(tw.def(["[--card-spacing:--spacing(5)]"], globalDiv.style()), className)
```

Add argument precedence guard:

```ts
cn("p-2", className, "p-4")
```

Expected: the implementation either preserves argument order or emits a diagnostic/raw fallback. It must not silently pool `"p-4"` before `className`.

Run:

```bash
pnpm --filter tailwindest-css-transform test -- tests/walkers/classname_walker.test.ts tests/walkers/cn_walker.test.ts
```

## Self-Validation Table

| Requirement                                 | Evidence                                                    | Status |
| ------------------------------------------- | ----------------------------------------------------------- | ------ |
| Preserved tokens emitted                    | Walker tests assert `group/card` and `[--var:value]` output | Passed |
| No `String.raw` output                      | Tests assert absence                                        | Passed |
| Dynamic user classes retain precedence      | `tw.join(tw.def(...), className)` output                    | Passed |
| Static-after-dynamic not silently reordered | Guard test exists                                           | Passed |
| Pure structured output unchanged            | Existing tests still pass                                   | Passed |
| Low-threshold raw behavior unchanged        | Existing threshold tests still pass                         | Passed |

## Completion Criteria

Task 03 is complete when both walker test files pass and no plain static token can be lost in object extraction.
