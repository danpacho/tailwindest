# Tailwindest Design System E2E Testing Spec

## Goal

Build a single-page design-system fixture that exercises every public
`createTools()` feature through both static and dynamic compiler paths. The
fixture must prove that development, debug, production, and release artifacts
converge to the same result without shipping Tailwindest runtime tools to the
browser.

This is a test specification, not an implementation document. The next
implementer must satisfy every gate here before the critic can approve.

## Scope

Target source API:

- `tw.style(styleRecord)`
- `tw.toggle({ base, truthy, falsy })`
- `tw.rotary({ base, variants })`
- `tw.variants({ base, variants })`
- `tw.join(...classList)`
- `tw.def(classList, ...styleList)`
- `tw.mergeProps(...styleRecords)`
- `tw.mergeRecord(...styleRecords)`
- Styler instance methods returned by `style`, `toggle`, `rotary`, and
  `variants`:
    - `.class(...)`
    - `.style(...)`
    - `.compose(...)`

Target compiler paths:

- Static exact replacement.
- Dynamic lookup replacement for statically known variant tables.
- Unsupported dynamic fallback in unit/integration tests.
- Manifest bridge to Tailwind v4 via `@source inline()` and
  `@source not inline()`.
- Vite dev, Vite build, TanStack Start dev/build, and Next webpack
  precompile/build fixture behavior.

## Fixture Page

Create one shared design-system page that resembles a compact component catalog.
It must be dense enough to expose many states on one screen, similar to the
provided reference image.

The page must have stable test IDs and no marketing content.

Required top-level sections:

- `Button`
- `Form Elements`
- `Checkbox`
- `Radio Button`
- `Toggle`
- `Composite Cards`
- `Debug Matrix`

Required layout characteristics:

- One constrained work surface, minimum desktop viewport `1280x900`.
- Responsive fallback at `390x844`.
- Repeated component tiles may use cards; no nested decorative cards.
- Every generated component must expose:
    - `data-testid`
    - `data-api`
    - `data-case`
    - `data-expected-class`
    - `data-expected-token-group`

## Shared Fixture Data Contract

The fixture must define a single typed Tailwindest instance using
`CreateCompiledTailwindest`. Nested variants must use raw leaf utilities inside
objects, never synthesized value literals.

Required style keys:

- Layout: `display`, `alignItems`, `justifyContent`, `gap`, `width`, `height`,
  `padding`, `margin`, `border`, `borderColor`, `borderRadius`
- Typography: `fontSize`, `fontWeight`, `lineHeight`, `color`, `textAlign`
- Visual: `backgroundColor`, `boxShadow`, `opacity`, `outline`, `ring`,
  `cursor`, `transition`, `transform`
- State and variants: `hover`, `focus`, `active`, `disabled`, `dark`, `group`,
  `peer`, `data-[state=open]`, `data-[invalid=true]`, `aria-[checked=true]`,
  `sm`, `md`

Required nested variant examples:

```ts
tw.style({
    backgroundColor: "bg-slate-50",
    hover: { backgroundColor: "bg-slate-100" },
    focus: { ring: "ring-2" },
    dark: {
        backgroundColor: "bg-slate-900",
        color: "text-white",
        hover: {
            backgroundColor: "bg-slate-800",
            focus: { ring: "ring-sky-300" },
        },
    },
    "data-[state=open]": {
        backgroundColor: "bg-blue-600",
        color: "text-white",
    },
})
```

Expected compiler output must include:

- `bg-slate-50`
- `hover:bg-slate-100`
- `focus:ring-2`
- `dark:bg-slate-900`
- `dark:text-white`
- `dark:hover:bg-slate-800`
- `dark:hover:focus:ring-sky-300`
- `data-[state=open]:bg-blue-600`
- `data-[state=open]:text-white`

Expected raw leaf exclusions must include:

- `bg-slate-100`
- `ring-2`
- `bg-slate-900`
- `text-white`
- `bg-slate-800`
- `ring-sky-300`
- `bg-blue-600`

Raw leaves must not be emitted as final standalone CSS selectors unless they are
also intentionally used as top-level non-nested utilities elsewhere.

## API Coverage Matrix

### `tw.style`

Static cases:

- `styleRecord.class()` renders a button class string.
- `styleRecord.style()` returns the original style object when compiled to a
  static object.
- `styleRecord.class("extra", ["extra-2"], { "extra-3": true })` follows clsx
  semantics and appends extra tokens.
- Nested raw variant shorthand compiles to prefixed candidates.
- `.compose(extraStyle).class()` deep merges base and extra style.
- `.compose(extraStyle).style()` returns the merged style object.

Dynamic cases:

- A React state toggles `data-state="open"` and the same static class string
  must visually switch through data variants.
- Hover/focus/dark states must be asserted through browser interaction and
  media emulation.

Visual assertions:

- Base button background, text color, border, padding.
- Hover background differs from base.
- Focus ring exists.
- Dark base background differs from light base.
- `dark:hover:focus` ring differs from dark base.
- `data-state=open` background and color differ from closed state.

Compiler assertions:

- Static `.class()` call is replaced with a string literal.
- Static `.style()` call is replaced with an object literal.
- No `PrimitiveStyler` runtime token in client JS.

### `tw.toggle`

Static cases:

- `toggle.class(true)` equals base plus truthy style.
- `toggle.class(false)` equals base plus falsy style.
- `toggle.style(true)` and `toggle.style(false)` return merged records.
- `toggle.compose(extra).class(true)` applies composed base to both branches.
- Extra class tokens are appended and merged.

Dynamic cases:

- A checkbox controls a `pressed` state.
- The rendered toggle button uses `toggle.class(pressed)`.
- The browser test must click the checkbox and verify class/computed-style
  change without reloading.

Visual assertions:

- Off state uses neutral surface.
- On state uses success/primary surface.
- Composed base padding and radius remain identical across both states.

Compiler assertions:

- Dynamic boolean call compiles to a finite branch expression or lookup with no
  Tailwindest runtime imports.
- Both truthy and falsy candidates appear in the manifest.

### `tw.rotary`

Static cases:

- `rotary.class("base")` returns base only.
- `rotary.class("small" | "medium" | "large" | "giant")` returns base plus
  selected size style.
- `rotary.style("small")` returns the selected merged record.
- `rotary.compose(extra).class("medium")` applies extra base across variants.
- Variant key `"base"` must not be accepted as a user variant override in the
  table.

Dynamic cases:

- A segmented control changes `size`.
- The button grid renders all sizes statically, and one live preview renders
  from dynamic state.

Visual assertions:

- Width/height/padding increase monotonically from `tiny` to `giant`.
- The dynamic preview matches the static tile for the selected size.

Compiler assertions:

- Static calls replace to literals.
- Dynamic calls compile to a lookup table whose keys exactly match the variant
  keys plus `base`.
- Every variant candidate is present in the manifest.

### `tw.variants`

Static cases:

- Multi-axis button variant:
    - `size`: `tiny`, `small`, `medium`, `large`, `giant`
    - `status`: `primary`, `success`, `warning`, `danger`, `info`, `control`,
      `basic`
    - `state`: `default`, `hover`, `active`, `focus`, `disabled`
    - `shape`: `button`, `buttonIcon`, `icon`
- `variants.class({ size: "medium", status: "primary" })` returns base plus
  selected axes in object entry order.
- Missing axes fall back to base only for those axes.
- Conflicting component groups are resolved by object entry order when no
  merger is provided.
- `variants.style(props)` returns a deep merged object.
- `.compose(extra).class(props)` applies composed base to all combinations.

Dynamic cases:

- User controls at least two axes at runtime:
    - size select
    - status select
    - disabled checkbox
- Dynamic props must compile to a static finite lookup, not runtime
  `VariantsStyler`.
- The dynamic preview must match the corresponding static matrix cell.

Visual assertions:

- Status colors differ and match expected computed background/border/text.
- Disabled state reduces opacity and prevents hover color changes.
- Icon-only button has equal width/height and no text overflow.

Compiler assertions:

- Manifest includes every reachable axis candidate.
- Debug manifest records replacement candidates for the variants call.
- Client JS contains no `VariantsStyler`.
- Lookup size is bounded and deterministic; if table limit is exceeded in a
  dedicated negative test, the runtime call is preserved and all static
  candidates remain in the manifest.

### `tw.join`

Static cases:

- String tokens join in order.
- Nested arrays flatten.
- Object dictionaries honor truthy/falsy values.
- `null`, `undefined`, `false`, and empty strings are omitted.
- Numeric values follow current `clsx` behavior.
- Optional typed class literals compile without widening to arbitrary runtime
  behavior.

Dynamic cases:

- Conditional class object uses a runtime boolean:
  `tw.join("base", { "ring-2": focused })`.
- This must either compile exactly when statically resolvable or remain a
  runtime fallback when not statically knowable. The test must explicitly
  assert the chosen behavior.

Visual assertions:

- Joined utility affects a visible text label and spacing.

Compiler assertions:

- Static join replaces to one string literal.
- Candidate list includes all truthy static class candidates.
- Falsy static branches do not appear in candidates.

### `tw.def`

Static cases:

- `tw.def(["font-semibold"], styleA, styleB)` appends merged style classes after
  classList.
- Style records have higher priority by order when the same style key appears
  later.
- Nested variants in `styleList` compile to prefixed candidates.
- Extra class list supports string, array, and object clsx values.

Dynamic cases:

- A form field status preview uses `tw.def(baseClassList, statusStyle)`, where
  status is selected from a finite static map.
- Dynamic status must compile to finite lookup or explicit supported branch
  expression.

Visual assertions:

- Status border colors for default/primary/success/warning/danger/info match
  static matrix cells.

Compiler assertions:

- Static call replaces to string.
- Candidate manifest includes both classList candidates and styleList
  candidates.
- Raw nested shorthand leaves are excluded.

### `tw.mergeProps`

Static cases:

- Later records override earlier records by style key.
- Nested records deep merge without losing sibling paths.
- Arrays replace prior arrays.
- Empty objects are ignored.
- With a merger configured, duplicate Tailwind groups resolve through the
  merger.

Dynamic cases:

- A composite card combines base, selected status, and selected density through
  `mergeProps`.
- Dynamic selected records must come from finite maps and compile to supported
  lookup output.

Visual assertions:

- Final computed style corresponds to the last selected override, not the first.

Compiler assertions:

- Static `mergeProps` replaces to string.
- Client JS contains no `Styler` or `createTools` token for static calls.
- Dynamic finite map preserves every candidate in the manifest.

### `tw.mergeRecord`

Static cases:

- Later records override earlier records and return an object literal.
- Nested variant records deep merge.
- Arrays replace previous arrays.
- The result can be fed into `tw.style(merged).class()` and compile exactly.

Dynamic cases:

- A form control builds a merged record from base + status map + state map.
- The resulting `.class()` call must still compile to deterministic output or
  remain runtime fallback if unsupported. The expected behavior must be
  captured in the test.

Visual assertions:

- The merged record preview matches the equivalent direct `tw.style()` preview.

Compiler assertions:

- Static `mergeRecord` replacement is an object literal.
- Chained `tw.style(tw.mergeRecord(...)).class()` output equals the direct
  static equivalent.

## Design-System Section Requirements

### Button Section

Render these matrices:

- Size matrix: `giant`, `large`, `medium`, `small`, `tiny`
- Status matrix: `primary`, `success`, `warning`, `danger`, `info`, `control`,
  `basic`
- State matrix: `default`, `hover`, `active`, `focus`, `disabled`
- Type matrix: `button`, `buttonIcon`, `icon`

Each matrix must include at least one cell generated by:

- `style.class`
- `toggle.class`
- `rotary.class`
- `variants.class`
- `join`
- `def`
- `mergeProps`

### Form Elements Section

Render:

- Text input states: default, input text, hover, focus, disabled.
- Input with icon.
- Select.
- Text area.
- Status input: default, primary, success, warning, danger, info.

Required API mapping:

- Base field: `tw.style`
- Status field: `tw.variants`
- Input adornment: `tw.def`
- Disabled/invalid switch: `tw.toggle`
- Runtime selected status preview: dynamic `tw.variants.class`

### Checkbox, Radio Button, Toggle

Render controlled and uncontrolled-looking visual states:

- unchecked/default
- checked
- focus
- disabled
- invalid

Required API mapping:

- Checkbox: `toggle` plus `aria-[checked=true]` nested variants.
- Radio: `rotary` for option color/size and `toggle` for selected state.
- Toggle: `variants` with `size`, `checked`, and `disabled` axes.

### Composite Cards

Render a grid of small cards to prove composition and merge behavior:

- `mergeRecord` creates the base card record.
- `mergeProps` emits the final card class string.
- `style.compose`, `rotary.compose`, `toggle.compose`, and `variants.compose`
  each produce one visible card.
- Cards must include nested `group-hover`, `peer-focus`, `dark`, and
  `data-[state=open]` behavior.

## Static vs Dynamic Expected Outputs

Every API must have both:

- `static expected class`: exact literal string or object after compilation.
- `dynamic expected class`: output for at least two runtime states.

The test fixture must export an expectation table:

```ts
export const expectedDesignSystemCases = {
    "button.variants.primary.medium.default": {
        api: "variants.class",
        staticClass: "...",
        dynamicStates: {
            primary: "...",
            danger: "...",
        },
        candidates: ["...", "..."],
        excludedCandidates: ["...", "..."],
    },
}
```

The E2E test must consume this table. Hard-coded expectations hidden inside the
test body are not enough.

## Browser Assertion Requirements

For each framework target, run:

- dev server
- production build
- production preview/start
- screenshot capture
- DOM assertions
- computed style assertions
- CSS artifact assertions
- debug manifest assertions
- static replacement JS assertions

Required screenshots:

- `dev-overview.png`
- `debug-manifest.png`
- `prod-overview.png`
- `dev-interactions.png`
- `prod-interactions.png`
- `mobile-prod-overview.png`

Store under:

```text
packages/tailwindest-compiler/e2e/.artifacts/design-system-screenshots/<framework>/
```

Required browser interactions:

- hover button cell
- focus input cell
- click toggle
- change size select
- change status select
- enable disabled checkbox
- emulate dark color scheme
- resize to mobile viewport

Required DOM assertions:

- Every `data-expected-class` is a substring of the rendered className unless
  the case is explicitly marked as object-output only.
- Dynamic preview className changes when controls change.
- Static matrix cell and dynamic preview are identical for matching selected
  state.
- No generated element contains `createTools`, `PrimitiveStyler`,
  `ToggleStyler`, `RotaryStyler`, or `VariantsStyler` in text/script content.

Required computed style assertions:

- background color
- text color
- border color
- opacity
- padding left/right
- width/height for icon buttons
- outline/ring-visible effect
- cursor for disabled state

Computed styles must compare dev and prod snapshots exactly for normalized
properties.

## CSS and Manifest Assertions

The final CSS, dev style endpoint, and debug manifest must prove:

- All expected prefixed candidates exist.
- Raw nested shorthand leaves do not exist as standalone selectors.
- `@source inline()` contains every compiler-generated candidate.
- `@source not inline()` contains every excluded raw shorthand leaf that is not
  otherwise intentionally used.
- Tailwind package CSS entry re-serve path does not regenerate excluded raw
  leaves.
- Candidate ordering is deterministic across dev and prod.

The test must inspect:

- `.tailwindest/debug-manifest.json`
- built CSS files
- dev CSS endpoint for frameworks that expose one
- client JS bundles

## Zero-Runtime Assertions

Client JS bundles must not contain:

- `createTools`
- `PrimitiveStyler`
- `ToggleStyler`
- `RotaryStyler`
- `VariantsStyler`
- `Styler.deepMerge`
- `flattenStyleRecord`
- `toClass`
- `toDef`

Allowed:

- Static class strings.
- Static lookup objects or branch expressions generated by the compiler.
- Framework runtime code.

## Type/DX Assertions

Create a dedicated type test for the design-system fixture:

- `CreateCompiledTailwindest` accepts raw nested leaves:
    - `dark: { backgroundColor: "bg-slate-900" }`
    - `hover: { backgroundColor: "bg-slate-100" }`
- `CreateCompiledTailwindest` rejects synthesized nested values:
    - `dark: { backgroundColor: "dark:bg-slate-900" }`
    - `dark: { hover: { backgroundColor: "dark:hover:bg-slate-800" } }`
- Top-level class literals still accept normal non-nested utilities.
- `CreateTailwindest` legacy type still keeps synthesized nested behavior.
- `variants`, `rotary`, and `toggle` dynamic keys preserve autocompletion.

## Negative Tests

Add fallback negative tests:

- Unknown dynamic class variable passed to `tw.join(dynamicClass)`.
- Dynamic style object passed to `tw.style(dynamicStyle).class()`.
- Runtime-generated variant table key that cannot be statically enumerated.
- Variant table exceeding configured table limit.
- Chained call where receiver provenance is not proven to come from
  `createTools()`.

- Unsupported call remains runtime fallback.
- All statically knowable candidates still enter the manifest.
- Diagnostic appears in debug manifest.

## Framework Targets

### Vite Baseline

Use a Vite fixture to validate compiler artifacts without framework noise:

- build output JS/CSS
- source map
- debug manifest
- CSS source bridge
- HMR invalidation for changed design-system source

### TanStack Start

Use real TanStack Start app:

- dev server
- production build
- production preview
- dev style endpoint leakage check
- screenshot artifacts

This target must keep the regression for `tailwindcss/index.css` framework dev
aggregation. Raw nested leaves must not reappear from the Tailwind package CSS
entry.

### Next.js

Use real Next App Router webpack path:

- fixture-local precompile bridge before `next dev --webpack`
- `next build --webpack`
- `next start`
- screenshot artifacts

Turbopack remains out of scope until a real adapter exists. The test must say
this explicitly and must not pretend the Vite plugin covers Turbopack.

## Acceptance Checklist

The critic must reject the implementation if any item below is missing:

- Single design-system page exists and is used by all framework E2E targets.
- Every `createTools()` public method is represented visually.
- Every styler instance method `.class`, `.style`, `.compose` is represented.
- Every API has static and dynamic expected output assertions.
- Deep nested variant shorthand is tested in at least three APIs.
- Raw nested shorthand leakage is tested in manifest, dev CSS, and built CSS.
- Dev/prod computed style snapshots are equal.
- Screenshots are generated for dev/debug/prod and interaction/mobile states.
- Static replacement bundle assertions include all runtime tool tokens for
  fully compiled cases.
- Type/DX tests cover `CreateCompiledTailwindest` and legacy
  `CreateTailwindest`.
- Fallback negative tests exist.
- `pnpm ts:typecheck` passes.
- `pnpm test` passes.
- `pnpm build` passes.
- `pnpm --filter @tailwindest/compiler pack:dry` passes.
- `git diff --check -- packages/tailwindest-compiler packages/tailwindest packages/tailwindest-core packages/tailwind-internal packages/create-tailwind-type pnpm-lock.yaml`
  passes.

## Critic Review Procedure

The critic must inspect:

1. The design-system source page and expectation table.
2. The transformed output and debug manifest.
3. Browser screenshots for dev/debug/prod/interaction/mobile.
4. Final CSS selector presence and raw leakage absence.
5. Client JS bundle for static replacement tokens.
6. Type tests for compiled-vs-legacy nested variant authoring.
7. Negative fallback diagnostics.

Approval is only allowed when the implementation proves semantic equivalence
between runtime Tailwindest behavior and compiler output across all APIs.
