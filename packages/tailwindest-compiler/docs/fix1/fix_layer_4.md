# Fix Layer 4: Compiled Subset Semantic Correctness

## Purpose

Guarantee that every call selected for replacement is semantically identical to
runtime Tailwindest.

This layer does not try to compile more patterns. It makes the already compiled
subset correct.

## Problem Definition

Known semantic gaps:

- mixed static/dynamic `variants` props lose static props;
- styler `.class()` APIs ignore runtime merger semantics;
- generated symbols can be invalid identifiers;
- generated lookup declarations emit TypeScript syntax into JavaScript files;
- syntax validation failure can preserve runtime but diagnostics may not clearly
  mark the call as fallback.

Each gap can produce either wrong class strings or misleading build/debug
artifacts.

## Fix Strategy

### Engineering Principles

- Exact means runtime-equivalent for all input states in the supported domain.
- If exactness depends on unknown runtime merger behavior, fallback.
- Generated code must be valid for the source file kind.
- Prefer smaller fallback surface over speculative semantic modeling.

### Interface Strategy

#### Variant Props

Represent mixed static/dynamic props explicitly:

```ts
interface DynamicVariantProps {
    kind: "dynamic-variant-props"
    staticProps: Record<string, unknown>
    entries: Array<{ axis: string; expression: string }>
}
```

`staticProps` may be empty, but it must never be discarded.

#### Merger Policy

Class-producing APIs must receive merger safety information:

- `style.class`
- `toggle.class`
- `rotary.class`
- `variants.class`
- `join`
- `def`
- `mergeProps`

If a runtime `createTools({ merger })` is present and no exact build-time merger
is available, return fallback.

#### Code Generation

Generated symbols must be identifier-safe:

```ts
createGeneratedSymbol(prefix: string)
```

must sanitize `prefix` before building the identifier.

Readonly lookup declarations must avoid TypeScript-only syntax for `.js` and
`.jsx` output.

### Algorithm Strategy

1. Preserve static variant props when dynamic entries exist.
2. For dynamic variant class/style generation:
    - start from `variantsStyleFor(model, staticProps)`;
    - apply dynamic entries on top in runtime object-entry order;
    - preserve existing optional prop behavior.
3. Detect runtime merger use in proven `createTools()` initialization.
4. For class APIs, compile only when merger policy is exactly supported.
5. Sanitize generated identifier prefixes by replacing non-identifier
   characters with `_` and preventing leading digits.
6. Emit JavaScript-compatible lookup declarations unless the source file is
   TypeScript and the existing pipeline requires `as const`.
7. If syntax validation fails, preserve source and record fallback status.

## Test Targets

### Core Logic Coverage

- Mixed static/dynamic `variants.class()` matches runtime.
- Mixed static/dynamic `variants.style()` matches runtime.
- Class APIs with unsupported runtime merger fall back.
- Exact class APIs without merger still compile.
- Sanitized symbols compile for axes like `"data-state"` and `"aria-checked"`.
- Dynamic lookup output is valid in `.js`, `.jsx`, `.ts`, and `.tsx`.

### Edge Case Coverage

- Static props before dynamic props preserve runtime object-entry order.
- Dynamic props before static props preserve runtime object-entry order if the
  source object order differs.
- Falsy dynamic values preserve current runtime missing-prop behavior.
- String `"false"` remains a valid variant key distinct from boolean `false`.
- Numeric variant keys remain addressable.

### Error Case Coverage

- Unsupported merger produces runtime fallback, not wrong concatenation.
- Invalid generated syntax produces fallback diagnostics and no replacement.
- Unknown variant axes do not throw and preserve runtime-compatible behavior.

## 100% Completion Goal

For every call that still gets replaced after Layers 1-3, generated output must
match runtime Tailwindest for all covered static and bounded dynamic states.

If exactness cannot be proven, the call must not be replaced.
