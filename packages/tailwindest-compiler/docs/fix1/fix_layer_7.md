# Fix Layer 7: Safe Compile Coverage Expansion

## Purpose

Increase compile coverage only after the fallback safety foundation is correct.

This layer is intentionally last among behavioral compiler fixes. It may compile
more public Tailwindest patterns, but only when exactness is proven.

## Problem Definition

Common public patterns are currently candidate-only or runtime fallback:

- stored styler variables;
- direct compose chains;
- destructured tool methods;
- imported alias tool bindings;
- imported static style/config bindings;
- some composed `.class()` and `.style()` paths.

These patterns do not have to compile for fallback-safe correctness, but
compiling them improves product value once safety is established.

## Fix Strategy

### Engineering Principles

- Coverage is optional; correctness is mandatory.
- Add one syntax family at a time.
- Every new compiled pattern needs runtime parity tests.
- Prefer preserving runtime over broad symbolic execution.

### Interface Strategy

Represent statically known styler models as compiler values:

```ts
type StaticStylerModel =
    | PrimitiveStyleModel
    | ToggleStyleModel
    | RotaryStyleModel
    | VariantsStyleModel
```

Allow the resolver to bind simple const styler initializers:

```ts
const button = tw.variants(config)
button.class(props)
```

Do not support mutable stylers, reassignment, side-effectful factories, or
runtime-created configs in this layer.

### Algorithm Strategy

Recommended expansion order:

1. Stored styler variables created by direct `const x = tw.style|toggle|rotary|variants(...)`.
2. Direct compose chains where every compose argument is static.
3. Imported alias tool bindings when analyzer already proves provenance.
4. Destructured methods only if binding provenance and receiver-free semantics
   are unambiguous.
5. Imported static style/config bindings already supported by analyzer.

For every pattern:

1. Resolve model only from immutable static inputs.
2. Reuse existing evaluator/styler model functions.
3. Apply merger/fallback rules from Layer 4.
4. Emit replacement only through the Layer 2 safety gate.
5. Emit debug status through Layer 5 taxonomy.

## Test Targets

### Core Logic Coverage

- Stored `const button = tw.variants(config); button.class(...)` compiles when
  all inputs are static/exact.
- Stored primitive/toggle/rotary/variants stylers match runtime.
- Direct compose chains compile only with static compose args.
- Imported alias proven by analyzer compiles or is explicitly fallback-marked.

### Edge Case Coverage

- Reassigned styler variable falls back.
- Mutated config object falls back.
- Compose chain with one dynamic style falls back.
- Local shadowing blocks imported alias compile.
- Destructured methods are compiled only if exact provenance is proven.

### Error Case Coverage

- Unsupported stored styler shape preserves runtime.
- Partial model resolution does not emit partial replacement.
- Any merger uncertainty falls back.

## 100% Completion Goal

Every newly compiled pattern must have runtime parity coverage for class output,
style output, candidates, and debug manifest status.

Patterns not implemented in this layer must remain safe runtime fallback and be
reported as candidate-only or runtime-fallback.
