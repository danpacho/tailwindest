# Tailwindest Compiler Architecture

`@tailwindest/compiler` is the Tailwindest compiler layer for nested variant
lowering and Tailwind CSS v4 candidate manifest bridging. It lowers
`CreateCompiledTailwindest` nested variant authoring into exact Tailwind class
candidates and class strings, then exposes those candidates to Tailwind through
`@source inline()`. It is not a release contract for a general Tailwindest
partial evaluator.

This document defines the production architecture for Vite 8 and Tailwind CSS
4.2.

The compiler intentionally has no public policy switch. Its single production
contract is nested variant lowering plus Tailwind CSS manifest bridging. Exact
class-output call sites may be replaced, and call sites that require runtime
semantics are preserved with diagnostics and manifest candidates.

## Reference Targets

- Vite 8 Plugin API: https://vite.dev/guide/api-plugin
- Tailwind CSS v4 class detection: https://tailwindcss.com/docs/detecting-classes-in-source-files
- Tailwind CSS v4 functions and directives: https://tailwindcss.com/docs/functions-and-directives
- Tailwind CSS v4 Vite installation: https://tailwindcss.com/docs/installation/using-vite
- Tailwind CSS v4 custom styles: https://tailwindcss.com/docs/adding-custom-styles

## Production Decision

The compiler does not inject generated utilities through Tailwind
`addUtilities`. Tailwindest produces candidate class names for built-in
Tailwind utilities; it does not define new CSS utilities. The supported
Tailwind v4 integration is the documented `@source inline()` safelist path.

The Vite integration is implemented as two coordinated plugin layers:

1. `tailwindest:transform` statically transforms JavaScript and TypeScript
   modules.
2. `tailwindest:source` injects the candidate manifest into Tailwind CSS input
   with `@source inline()` and effective exclusions with
   `@source not inline()`.

This avoids relying on the unstable assumption that Tailwind will scan
post-transform JavaScript. Tailwind v4 builds CSS from the CSS transform path,
so Tailwindest exposes generated candidates through that path explicitly.

Tailwind CSS design-system loading lives in `@tailwindest/tailwind-internal`.
Both `create-tailwind-type` and `@tailwindest/compiler` use that package to
derive variant groups from the active Tailwind CSS installation and CSS entry.
The compiler must not carry a hard-coded default variant allowlist.

## Pipeline

```text
Project source files
        |
        v
Tailwindest pre-scan
  - scan configured source roots
  - detect Tailwindest createTools() provenance
  - initialize candidate and exclusion manifests
        |
        +------------------------------+
        |                              |
        v                              v
Vite JS transform                 Vite CSS transform
tailwindest:transform             tailwindest:source
  - Vite hook filter              - detect Tailwind CSS entries
  - include/exclude guard         - inject @source inline(...)
  - lexical gate                  - inject @source not inline(...)
  - TS/TSX semantic detection     - load Tailwind variant metadata
  - nested variant lowering       - keep CSS source maps compatible
  - collect replacements
  - reverse apply with MagicString
  - emit exact class literals or preserve runtime calls
        |                              |
        +--------------+---------------+
                       |
                       v
              Tailwind CSS v4 build
                       |
                       v
        Browser receives exact class strings and Tailwindest runtime calls
```

## Vite 8 Integration

Users must place `tailwindest()` before `tailwindcss()`:

```ts
import tailwindcss from "@tailwindcss/vite"
import { tailwindest } from "@tailwindest/compiler/vite"
import { defineConfig } from "vite"

export default defineConfig({
    plugins: [tailwindest({ debug: true, sourceMap: true }), tailwindcss()],
})
```

Both plugins run in the pre-transform region. Ordering matters because
Tailwindest must inject the candidate manifest before Tailwind CSS consumes the
CSS entry.

The plugin pair shares one `CompilerContext`:

```ts
export function tailwindest(options: TailwindestViteOptions = {}): Plugin[] {
    const context = createCompilerContext(options)

    return [
        {
            name: "tailwindest:transform",
            enforce: "pre",
            buildStart() {
                return context.preScan()
            },
            transform: {
                filter: { id: /\.[cm]?[jt]sx?(?:\?.*)?$/ },
                handler(code, id) {
                    return context.transformJs(code, id)
                },
            },
            hotUpdate(update) {
                return context.hotUpdate(update)
            },
        },
        {
            name: "tailwindest:source",
            enforce: "pre",
            transform: {
                filter: { id: /\.css(?:\?.*)?$/ },
                handler(code, id) {
                    return context.transformCss(code, id)
                },
            },
        },
    ]
}
```

Vite hook filters reduce unnecessary JavaScript calls, but they are only the
first guard. The handler still applies include/exclude checks and the lexical
gate before creating TypeScript ASTs.

## Tailwind CSS v4 Bridge

Tailwindest maintains a per-file manifest:

```ts
interface CandidateManifest {
    version: 1
    byFile: Map<string, FileCandidateRecord>
    all: Set<string>
    excluded: Set<string>
    revision: number
}

interface FileCandidateRecord {
    id: string
    hash: string
    candidates: string[]
    excludedCandidates: string[]
    diagnostics: CompilerDiagnostic[]
}
```

CSS entries are rewritten like this:

```css
@import "tailwindcss" source(none);
/* tailwindest:start */
@source inline("bg-blue-500 hover:bg-blue-600 px-2");
@source not inline("bg-blue-600");
/* tailwindest:end */
```

`source(none)` is used in deterministic fixtures that verify the manifest
bridge directly. Application projects may keep Tailwind automatic source
detection enabled; Tailwindest still injects explicit candidates.

`@source not inline()` is used only for effective raw nested leaves that are not
also required as top-level classes. This prevents shorthand leaves such as
`bg-red-900` from leaking when the semantic class is `dark:bg-red-900`.

## Lowering Engine

Dev and production parity requires more than sharing one helper function. The
shared compiler path is constrained to nested variant normalization, class
candidate extraction, exact class-output replacement, and fallback policy. The
following components must be shared:

- static resolver and symbol provenance rules
- nested variant lowering semantics
- merger policy
- candidate and exclusion manifest bridge
- fallback diagnostic policy
- source map and debug manifest policy

The release lowerer boundary is intentionally narrower than the full
Tailwindest runtime API:

```ts
interface LoweringEngine {
    collectCandidates(call: TailwindestCall): CandidateRecord[]
    compileClassOutput(
        call: TailwindestClassOutputCall,
        merger: MergerPolicy
    ): string | RuntimeFallback
}
```

`MergerPolicy` controls exactness:

```ts
type MergerPolicy =
    | { kind: "none" }
    | { kind: "known"; name: "tailwind-merge"; configHash: string }
    | {
          kind: "custom"
          evaluateAtBuildTime: true
          moduleId: string
          exportName: string
      }
    | { kind: "unsupported" }
```

Unsupported mergers remain runtime fallbacks unless a deterministic build-time
merger can be proven.

## Nested Variant Semantics

Nested variant prefix generation is a compiler-layer normalization step for
`CreateCompiledTailwindest` authoring. It is not `@tailwindest/core` runtime
behavior; the runtime package structurally flattens authored leaf strings.

Tailwind variant keys in style objects are semantic prefixes. Property keys such
as `backgroundColor`, `padding`, and `borderColor` do not create prefixes.
Variant keys are loaded from the Tailwind CSS design system through
`@tailwindest/tailwind-internal`. Built-in keys such as `dark`, `hover`,
`focus`, responsive breakpoints, group/peer variants, data/aria variants, and
arbitrary variants are therefore metadata-driven rather than hard-coded.
Recognized variant keys accumulate prefixes for every string leaf below them.

```ts
tw.style({
    dark: {
        backgroundColor: "bg-red-900",
        hover: {
            backgroundColor: "bg-red-950",
        },
    },
    backgroundColor: "bg-red-50",
}).class()
// "dark:bg-red-900 dark:hover:bg-red-950 bg-red-50"
```

Explicitly prefixed leaves remain accepted for compatibility and are not
double-prefixed, but new tests and documentation should prefer nested variant
syntax.

Nested shorthand is valid only where the compiler can lower to class output.
Runtime-visible object and styler channels, including `*.style()`,
`*.compose()`, and `tw.mergeRecord()`, must use runtime-compatible records. Raw
nested shorthand in those channels is preserved and diagnosed with
`COMPILED_VARIANT_REQUIRES_CLASS_OUTPUT`.

When no variant resolver is available and nested compiled shorthand requires
metadata, the compiler preserves the runtime call and emits
`MISSING_COMPILED_VARIANT_METADATA`. Programmatic users should call
`compileAsync({ cssRoot })` or `compileAsync({ cssSource })`; the Vite plugin
loads this metadata automatically from CSS entries.

## Release Compile Surface

The compiler recognizes the public surface of
`packages/tailwindest/src/tools/create_tools.ts`, but the release compile
contract is smaller than the runtime API.

| API group                                      | Release role                                      |
| ---------------------------------------------- | ------------------------------------------------- |
| `tw.style(obj).class(...extra)`                | exact nested variant class-output lowering        |
| `tw.toggle(config).class(condition)`           | exact class-output lowering when condition proves |
| `tw.rotary(config).class(key)`                 | exact class-output lowering when key proves       |
| `tw.variants(config).class(props)`             | exact class-output lowering when props prove      |
| `tw.def(...)` and `tw.mergeProps(...)`         | class-output helpers when all inputs prove exact  |
| `tw.join(...)`                                 | candidate collection only; no JS replacement      |
| `*.style()`, `*.compose()`, `tw.mergeRecord()` | runtime-visible values; never replacements        |

Compile eligibility is based on symbol identity, not variable names. A variable
named `tw` is not enough; the receiver must be proven to originate from
`createTools()`.

## Static Resolver Rules

Supported static values:

- literals and `as const` object/array structures
- local `const` bindings
- imported side-effect-free `const` objects and strings
- static class/style inputs needed by nested variant class-output lowering

Unsupported exact values:

- function call results, getters, class instances, `Date`, `Math.random`, and
  environment values
- mutated objects
- unknown spreads
- values that depend on runtime control flow
- unproven receiver provenance

Unsupported exact values preserve the runtime call and record every statically
knowable candidate in the manifest.

## Replacement Safety

AST replacement uses the Collect -> Reverse Execute pattern.

1. Traverse the AST and collect replacement candidates.
2. Record source span, generated text, candidates, exclusions, and diagnostics.
3. Choose one replacement for overlapping spans.
4. Apply replacements in descending source order with `MagicString`.
5. If exact replacement fails, keep the original file and emit diagnostics.

Target memory is `O(file size + replacement count + candidate count)` per file.
Long-lived caches store source text, hashes, manifests, and dependency edges,
not TypeScript node references.

## Dynamic Variant Boundary

Exact nested variant class-output replacement is allowed only when the variant
props can be proven or when a bounded lookup table is exact and
collision-safe. Otherwise the runtime call is preserved and statically knowable
candidates are retained in the manifest.

The dynamic class-output path uses a conflict graph:

1. Compute the style path set touched by each variant axis.
2. Emit independent axes as additive maps.
3. Group overlapping axes into conflict components.
4. Precompute a component table when the table size is within
   `variantTableLimit`.
5. When the table would exceed the limit, preserve the runtime call and still
   record all static candidates.

This preserves Tailwindest deep merge semantics while keeping lookup generation
inside the class-output boundary.

## Debug Manifest

Debug mode writes `.tailwindest/debug-manifest.json` with:

- transformed file ids and hashes
- replacement spans
- generated text
- candidates and exclusions
- fallback status
- rich diagnostics with fallback behavior

The debug manifest is the primary production support artifact for explaining
why a call compiled or fell back.

## Programmatic API Boundary

The stable package exports are `@tailwindest/compiler` and
`@tailwindest/compiler/vite`.

- `compile()` is a file-local transform. It does not read Tailwind CSS files.
- `compileAsync()` loads Tailwind design-system variant metadata from `cssRoot`
  or `cssSource` before running the same transform.
- The Vite plugin owns graph-wide manifest state, CSS `@source inline()`
  injection, debug manifest writing, and HMR invalidation.

Build tools that use `compile()` or `compileAsync()` directly must forward
returned candidates into their Tailwind CSS build themselves.

## E2E Coverage

Release validation covers:

- Vite + Tailwind v4 fixture
- TanStack Start + Tailwind v4 fixture
- Next.js App Router webpack fixture through the precompile bridge
- dense design-system page with legacy coverage across public `createTools()`
  APIs
- dev/prod computed-style parity
- screenshot artifacts for dev, debug, prod, interactions, and mobile
- class-output bundle assertions for class-output-only cases
- raw nested leaf leakage assertions
- fallback negative tests
- root Turbo test/build execution, with package-local Vitest configuration and
  serialized compiler framework e2e files

## Production Guarantees

The compiler guarantees exact nested variant class-output replacement only when
all inputs are statically known and the merger policy is supported. It does not
guarantee exact compilation for arbitrary runtime code or runtime-visible
object/styler values. Unsupported cases are surfaced through runtime fallbacks
with manifest retention.

The supported production architecture is:

```text
shared lowering pipeline
  + semantic static resolver
  + deterministic class-output substitution
  + candidate/exclusion manifest
  + Tailwind @source inline() bridge
  + framework-specific adapter contract
```
