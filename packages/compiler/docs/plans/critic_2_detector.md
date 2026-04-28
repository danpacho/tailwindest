# Critic 2: Static Detector Judgment Gate

The detector must prove identity, not guess names. A false positive corrupts user code; a false negative silently keeps runtime cost.

## P0 Rejection Conditions

- A non-Tailwindest object named `tw` is compiled.
- A real `createTools()` instance under another name is missed in a supported pattern.
- A dynamic value is accepted as static without proof.
- Circular reference causes infinite traversal.
- Dependency edges needed for HMR are missing.

## Required Proof

### C2.1 Symbol Identity

Required tests:

- direct `const tw = createTools()`.
- alias `const css = tw`.
- imported and re-exported tools.
- local shadowing of `tw`.
- unrelated object with `.style()` method.
- type-only structural compatibility without `createTools()` provenance.

Judgment rule: symbol provenance must be based on `createTools()` origin, not variable name alone.

### C2.2 Static Value Resolver

Accepted fixture tests:

- inline object literal.
- imported `export const` through three modules.
- static spreads.
- `as const` and `satisfies`.
- static computed key.

Rejected fixture tests:

- function calls.
- getters.
- class instances.
- `new`.
- mutation after declaration.
- unknown spread.
- `process.env`.
- circular reference.

Every rejected fixture must emit a specific diagnostic code.

### C2.3 Dependency Graph

Required tests:

- importing a style object records the style file as dependency.
- three-hop imports record all relevant dependency edges.
- circular references record visited files and terminate.
- dependency graph can produce reverse dependencies for consumer invalidation.

### C2.4 Performance Guard

Required benchmark or bounded test:

- At least 500 small fixture modules are scanned without unbounded recursion.
- Re-scanning a changed file does not force full project semantic reconstruction unless config changed.

## Required Diagnostics

- `UNRESOLVED_STATIC_VALUE`
- `UNSUPPORTED_DYNAMIC_VALUE`
- `UNKNOWN_SPREAD`
- `MUTATED_BINDING`
- `CIRCULAR_STATIC_REFERENCE`
- `SIDE_EFFECTFUL_INITIALIZER`

## Verdict Template

Reject unless every unsupported input has an explicit diagnostic and every supported alias/import pattern is detected by symbol identity.
