# CSS Transformer Correction Strategy

> Authority document for `<CSS TRANSFORMER CORRECTION>`.

## 1. Objective

The CSS transformer must convert supported static Tailwind class sources into Tailwindest code without dropping class tokens.

For the current correction target, the authority goal is:

```txt
Every supported static input token is present in the generated Tailwindest output.
```

This is intentionally narrower than a universal "preserve arbitrary class order" guarantee. The shadcn registry target is already a complete class-string source. The observed defect is token deletion caused by unresolved Tailwind tokens, not an observed Tailwind conflict-order regression.

## 2. Target Equivalence Model

For shadcn registry fixtures, style-result equivalence is protected by three checks:

1. **Token preservation:** every supported static input token appears in Tailwindest output.
2. **Target stability:** each collected shadcn static source is stable under `tailwind-merge` in tests:

```txt
twMerge(source) == source
```

3. **Serialization guard:** for transformed static sources where the transformer reorders tokens into `tw.def` shape, the generated token stream must remain equivalent under the same test oracle:

```txt
twMerge(inputTokens) == twMerge(serializedTokens)
```

If the guard fails for a future source, the transformer must preserve that source as raw `tw.join("...")`, emit an ordered fallback, or report a diagnostic. It must not silently emit a partial structured conversion that drops tokens.

## 3. Responsibility Boundary

This correction is a `packages/css-transformer` responsibility.

The current Tailwindest runtime APIs are not the root bug:

| Runtime API                       | Contract                                                                                                                            |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `tw.join(...classList)`           | Ordered class stream carrier. Without a merger it concatenates. With a supplied merger it delegates to that merger.                 |
| `tw.def(classList, ...styleList)` | Emits raw class list before structured style list. Suitable as the raw-plus-structured bridge when target-equivalence guard passes. |
| `style.class(...extra)`           | Emits structured style tokens before extra literal tokens. Extra tokens intentionally have later precedence.                        |
| `createTools({ merger })`         | Merger is optional. `tailwind-merge` is not built in.                                                                               |

The transformer bug is that it currently treats resolver failure as deletion. Resolver failure must become preservation metadata.

## 4. Non-Negotiable Invariants

1. No supported static Tailwind token may disappear.
2. Structured style leaves must contain the original Tailwind class literal.
3. Preserved tokens must be emitted as ordinary JavaScript string literals, not `String.raw`.
4. Do not map selector anchors, arbitrary declarations, plugin utilities, or unknown tokens to fake CSS properties.
5. Do not introduce a new public `tw.className` API for this correction.
6. `tw.def` is allowed as the main mixed raw/structured bridge for shadcn-targeted correction.
7. Dynamic/user class arguments keep later precedence.
8. Green snapshots are not sufficient. Preservation specs are the authority.

## 5. Lossless Analyzer Plan

Each supported static class source must produce a lossless plan:

```ts
type StructuredClassToken = {
    kind: "structured"
    index: number
    original: string
    utility: string
    variants: string[]
    property: string
}

type PreservedClassToken = {
    kind: "preserved"
    index: number
    original: string
    utility: string
    variants: string[]
    property: null
    reason:
        | "unresolved-property"
        | "unsafe-serialization"
        | "unsupported-conditional"
}

type ClassSourceToken = StructuredClassToken | PreservedClassToken

type ClassSourcePlan = {
    source: string
    tokens: ClassSourceToken[]
    structuredTokens: StructuredClassToken[]
    preservedTokens: PreservedClassToken[]
    styleTree: Record<string, unknown>
}
```

`tokens` preserves input order for diagnostics and fallback decisions. The primary shadcn acceptance criterion is token preservation, not exact output order preservation.

The lossless condition is:

```txt
plan.tokens.map(t => t.original) == splitClassString(source)
```

## 6. Serialization Rules

### 6.1 No Preserved Tokens

Use the existing structured output shape:

```ts
const rootStyle = tw.style({
    display: "flex",
    padding: "p-4",
})

className={rootStyle.class()}
```

### 6.2 Preserved Tokens in Plain `className`

When a static source has both structured and preserved tokens and crosses `objectThreshold`, emit preserved tokens through `tw.def`:

```ts
className={tw.def(
    ["group/card", "[--card-spacing:--spacing(5)]"],
    cardStyle.style()
)}
```

This is acceptable for the shadcn correction because registry fixtures are verified as `twMerge`-stable and generated streams are checked by the serialization guard.

### 6.3 Preserved Tokens in `cn`, `clsx`, `classNames`

Preserve argument-level precedence. For the common shadcn form:

```ts
cn("static tokens", className)
```

emit:

```ts
tw.join(tw.def(["preserved"], staticStyle.style()), className)
```

If a call has static arguments after dynamic arguments, preserve argument order where feasible:

```ts
cn("p-2", condition && "opacity-50", "p-4")
```

must not blindly pool all static strings before the dynamic argument. Use `tw.join(...)` in original argument order or raw fallback for unsupported shapes.

### 6.4 Low-Complexity or Unsafe Sources

Use raw fallback when:

1. The source is below `objectThreshold`.
2. No structured token exists.
3. The serialization guard fails.
4. A CVA variant condition cannot be generated safely.
5. The transformer cannot prove token preservation.

Example:

```ts
className={tw.join("top-2 group/card inset-0")}
```

## 7. CVA Strategy

### 7.1 Structured CVA Mode

If base and variant option strings contain only structured tokens, keep the existing `tw.variants` output and `.class(...)` call-site rewrite.

### 7.2 Preserved CVA Tokens

If CVA base contains preserved tokens, apply them unconditionally at call sites:

```ts
tw.join(tw.def(["peer/menu-button"], buttonVariants.style({ size })), className)
```

If a variant option contains preserved tokens, apply them conditionally with the same selected option:

```ts
tw.join(
    tw.def(
        [
            "peer/menu-button",
            size === "lg" && "group-data-[collapsible=icon]:!p-0",
        ],
        buttonVariants.style({ size })
    ),
    className
)
```

The transformer must not emit variant-specific preserved tokens unconditionally.

If a call site does not expose a safe selected variant value, do not guess. Use a conservative fallback or emit a diagnostic.

## 8. Registry Validation Strategy

The registry validation must include three specs.

### 8.1 Input Stability Spec

For every supported static class source collected from shadcn registry inputs:

```txt
twMerge(source) == normalizedSource
```

This proves the target corpus is already conflict-clean under the merge oracle and supports token-preservation-focused correction.

### 8.2 Output Preservation Spec

After transformation, collect tokens from Tailwindest class-producing expressions and assert multiset inclusion:

```txt
for each input token:
    output count(token) >= input count(token)
```

This is the primary regression guard for the observed bug.

### 8.3 Serialization Equivalence Guard

For every helper-generated mixed static source where the transformer exposes serialized token metadata:

```txt
twMerge(inputTokens) == twMerge(serializedTokens)
```

If metadata cannot be collected for a code path, add targeted walker tests for that path.

## 9. Task Order

1. Runtime contract boundary tests.
2. Lossless analyzer token plan.
3. Plain walker token-preservation serialization.
4. CVA token-preservation serialization.
5. Shadcn stability, preservation, and snapshot hardening.

Each task has a paired validation document. Checkpoints are required after runtime contract stabilization, after plain walker stabilization, and after final registry hardening.

## 10. Final Acceptance

The correction is complete only when:

1. Runtime contract tests pass without introducing a new public API.
2. Analyzer plan tests prove no supported static token is deleted.
3. Plain walker tests prove preserved tokens remain in generated output and dynamic precedence is retained.
4. CVA tests prove base and variant-specific preserved tokens apply under the correct conditions.
5. Shadcn input stability spec passes.
6. Shadcn output preservation spec passes.
7. Known historical missing token families are explicitly covered.
8. Existing shadcn snapshots are updated and reviewed.
9. No generated output uses `String.raw`.
10. `pnpm --filter tailwindest-css-transform test` passes.
11. Runtime tests pass if runtime internals were touched.

## 11. Execution Status

This correction has been implemented and validated.

Final commits:

| Task                      | Commit                                                               | Result |
| ------------------------- | -------------------------------------------------------------------- | ------ |
| Runtime contract          | `49ac393 test(runtime): document class merge contract`               | Passed |
| Lossless analyzer plan    | `66e0f25 feat(css-transformer): add lossless token plan`             | Passed |
| Plain walker preservation | `dbb640a fix(css-transformer): preserve plain class tokens`          | Passed |
| CVA preservation          | `2288719 fix(css-transformer): preserve cva class tokens`            | Passed |
| Registry hardening        | `a56895c test(css-transformer): enforce registry class preservation` | Passed |

Final verification:

```bash
pnpm --filter tailwindest-css-transform test
pnpm --filter tailwindest-css-transform build
pnpm --filter tailwindest test src/tools/__tests__/merger_interface.test.ts
pnpm --filter tailwindest-core test src/__tests__/runtime_parity.test.ts
pnpm --filter tailwindest-css-transform test tests/e2e/shadcn_class_stability.test.ts tests/e2e/shadcn_class_preservation.test.ts tests/e2e/shadcn_registry.test.ts
git diff --exit-code -- packages/css-transformer/tests/fixtures/shadcn_registry packages/css-transformer/tests/fixtures/edge_unresolvable packages/css-transformer/tests/e2e
```

Final shadcn transformed snapshots contain the previously missing token
families in `tw.def(...)`, raw `tw.join(...)`, or structured style leaves.
