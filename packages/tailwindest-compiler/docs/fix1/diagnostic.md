# Tailwindest Compiler Diagnostic Report

Date: 2026-04-29

## Scope

This report reviews the current `@tailwindest/compiler` logic against:

- `packages/tailwindest-compiler/docs/ARCHITECTURE.md`
- `packages/tailwindest/src/tools/create_tools.ts`
- the compiler transform/evaluator implementation

The review focuses on release-blocking correctness risks where dev, debug,
and build outputs can diverge from actual runtime Tailwindest behavior.

## Current Architectural Tension

The earlier architecture described a user-selectable compiler policy with a
zero-runtime path. In practice, the compiler is not yet complete enough to make
zero-runtime a safe public contract.

The safer product direction is a fallback-safe progressive compiler:

- compile only calls that are statically proven exact;
- preserve runtime Tailwindest calls for unsupported or unsafe cases;
- emit diagnostics/debug manifest entries for every fallback;
- never perform an unsafe replacement.

This direction still requires fixes. The fallback-oriented path can replace
code that should be preserved, and can also report candidates that do not match
the generated class string.

## Release-Blocking Bugs

### P0: Replacement Ignores Provenance Safety

Architecture states that compile eligibility is based on symbol identity, not
variable names:

- `ARCHITECTURE.md`, "Compile eligibility is based on symbol identity"
- `packages/tailwindest-compiler/src/analyzer/detector.ts`

The analyzer checks provenance, but the replacement pass uses its own collector
and starts with `toolNames = new Set(["tw"])` in:

- `packages/tailwindest-compiler/src/vite/compile_transform.ts`

Result: a non-Tailwindest object named `tw` can be replaced.

Example risk:

```ts
const tw = { join: (value: string) => `FAKE:${value}` }
export const cls = tw.join("px-4")
```

Observed behavior:

```ts
const tw = { join: (value: string) => `FAKE:${value}` }
export const cls = "px-4"
```

This is a direct behavior-changing compile bug. Fallback-safe compilation does
not solve this unless replacement is constrained to proven Tailwindest
receivers.

Required invariant:

> A replacement may be emitted only when the receiver is proven to originate
> from `createTools()`.

### P0: Zero-Runtime Policy Was Not Actually Enforced

Several normal public API patterns remained as runtime calls under the former
zero-runtime policy without diagnostics:

- stored styler:

```ts
const button = tw.variants(config)
export const cls = button.class({ tone: "primary" })
```

- destructured tool:

```ts
const { join } = createTools()
export const cls = join("px-4")
```

- imported alias:

```ts
import { tw as designTw } from "./tw"
export const cls = designTw.join("px-4")
```

The analyzer can collect some candidates for these forms, but the replacement
collector only handles direct `tw.method(...)` or direct chained
`tw.style(...).class(...)` forms.

This made the zero-runtime policy misleading. It could report success while
leaving Tailwindest runtime in the output.

Recommended direction:

> Treat zero-runtime as an optimization outcome, not a public compile
> guarantee.

### P0: Mixed Static/Dynamic `variants` Props Lose Static Props

`propsValueOf()` records static props separately, but when any dynamic prop is
present it returns only dynamic entries.

Risk example:

```ts
tw.variants({
    base: { display: "flex" },
    variants: {
        intent: { primary: { color: "text-blue-700" } },
        size: {
            sm: { padding: "px-2" },
            lg: { padding: "px-4" },
        },
    },
}).class({ intent: "primary", size })
```

Observed generated class omits `text-blue-700` and preserves only the dynamic
`size` lookup.

This is especially dangerous because candidates can still include
`text-blue-700`, so the CSS manifest looks correct while the DOM class string is
wrong.

Required invariant:

> Static and dynamic variant props must both participate in generated output.

### P1: Merger Semantics Are Ignored for Styler `.class()`

Runtime `createTools({ merger })` forwards the merger into styler instances.
The compiler models merger policy for `join`, `def`, and `mergeProps`, but
`style.class`, `toggle.class`, `rotary.class`, and `variants.class` use
`defaultMerge` through `styler_model.ts`.

Risk:

```ts
const tw = createTools({ merger: customMerger })
tw.style({ padding: "p-2" }).class("p-4")
```

Runtime output depends on `customMerger`; compiler output currently preserves
plain concatenation semantics unless the merger is provided through compiler
options and supported in that specific call path.

Required invariant:

> If a runtime merger is present and cannot be evaluated exactly, the call must
> remain runtime fallback.

### P1: Import Cleanup Can Delete Public Exports

`cleanupRuntimeImports()` removes single-declaration `createTools()` variable
statements when the local identifier is unused after replacement.

Risk:

```ts
import { createTools } from "tailwindest"
export const tw = createTools()
export const cls = tw.join("px-4")
```

Observed output removes `export const tw = createTools()`.

This breaks downstream modules that import `tw`. Local unused analysis is not
enough to remove exported declarations.

Required invariant:

> Never remove exported declarations during runtime import cleanup.

## Fragile Points

### Analyzer and Replacer Use Different Truth Sources

The Vite context first runs `analyzeJs()` for candidates, provenance, and
diagnostics, then separately runs `compileTailwindestSource()` for replacements.

This split causes mismatches:

- analyzer may reject a receiver, but replacer still replaces it;
- analyzer may collect candidates for a call shape that replacer cannot compile;
- debug diagnostics may not correspond to the transformed code.

Required direction:

> Replacement must consume analyzer-proven call sites or share the same resolver
> and provenance model.

### Generated Code Emits TypeScript Syntax Into JavaScript Files

`emitReadonlyConst()` emits `as const`. This is valid in TS/TSX but invalid in
plain JS/JSX. Dynamic lookup replacements in `.js` can therefore fail syntax
validation and silently keep runtime calls.

Runtime fallback is acceptable, but the diagnostic model must make this
explicit, and the compiler must not pretend zero-runtime success.

With the public zero-runtime policy removed, this becomes a fallback diagnostic
rather than a hard correctness target.

### Generated Symbol Names Are Not Sanitized

Generated symbols use raw axis names:

```ts
createGeneratedSymbol(`${axis}_class`)
```

Axis names such as `"data-state"` can generate invalid identifiers like:

```ts
__tw_data - state_class_1
```

This causes syntax failure and fallback even when the logic is otherwise
statically knowable.

Required invariant:

> Generated symbols must be derived from sanitized identifier-safe prefixes.

## Logic Incompleteness

### `compose()` Is in the Public Compile Surface but Not Replaced

Architecture lists:

- `tw.style(obj).compose(...styles)`
- `tw.toggle(config).compose(...styles)`
- `tw.rotary(config).compose(...styles)`
- `tw.variants(config).compose(...styles)`

The low-level compiler returns exact generated metadata for compose, but uses
`exactWithoutReplacement()`, so no replacement plan is emitted.

Direct chain example:

```ts
tw.style(base).compose(extra).class()
```

Currently remains runtime.

Under fallback-safe compilation this is not necessarily fatal. It must be
documented as fallback until composed styler metadata can be safely represented
and reused by following `.class()`/`.style()` calls.

### Common Public API Patterns Are Candidate-Only

The compiler often collects candidates but does not replace:

- stored styler variables;
- alias imports;
- destructured methods;
- chained compose;
- some imported static bindings;
- runtime merger cases.

In fallback-safe design, this is acceptable only if:

- runtime calls are preserved exactly;
- debug manifest marks them as fallback or candidate-only;
- zero-runtime is not promised for these patterns.

## Recommended Product Decision

Remove public zero-runtime policy selection and reposition the compiler as a
fallback-safe progressive optimizer.

Recommended public contract:

1. Proven exact Tailwindest calls are compiled to static strings, records, or
   bounded lookups.
2. Unsupported, ambiguous, unsafe, or runtime-dependent calls are preserved.
3. The compiler must never replace a call when provenance, semantics, generated
   syntax, or merger behavior are uncertain.
4. The debug manifest is the source of truth for compiled vs fallback calls.
5. Tailwind CSS candidates are best-effort for fallback calls and exact for
   compiled calls.

## Minimum Fix Set Before Continuing

1. Remove public zero-runtime policy selection.
2. Make replacement require analyzer-proven provenance.
3. Stop defaulting `"tw"` as a trusted tool name.
4. Preserve static props when dynamic `variants` props are present.
5. Treat unsupported merger usage as runtime fallback for every `.class()` API.
6. Do not remove exported `createTools()` declarations in import cleanup.
7. Sanitize generated symbol names.
8. Mark candidate-only/runtime fallback calls explicitly in debug manifest.

## Success Criteria

The fallback-safe compiler is safe when these checks hold:

- fake `tw.join()` is never replaced;
- unproven receiver calls are preserved;
- stored styler/destructured/alias patterns are either compiled exactly or
  marked fallback without behavior change;
- mixed static/dynamic variants output matches runtime;
- runtime merger calls are preserved unless an exact build-time merger exists;
- exported `tw` declarations are not removed;
- generated JS is valid for `.js`, `.jsx`, `.ts`, and `.tsx`;
- debug manifest distinguishes exact replacement from fallback/candidate-only
  collection.
