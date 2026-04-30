# Layer 8 Release Gate Traceability

Primary gate:
`packages/tailwindest-compiler/src/vite/__tests__/release_gate_matrix.test.ts`

## Diagnosed Bug Coverage

| Diagnosed bug                          | Release-gate test                                                                                                                                                                                                                   |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fake `tw` replacement                  | `safe fallback contract > preserves fake tw.join and fake tw.style chains without replacements`                                                                                                                                     |
| Mixed variants lose static props       | `exact createTools runtime parity > direct tw.variants mixed static and dynamic props class plus style calls`                                                                                                                       |
| Exported `tw` removal                  | `safe fallback contract > preserves exported tw declarations when exact imports are cleaned up`                                                                                                                                     |
| Unsupported merger compiles            | `safe fallback contract > preserves runtime createTools mergers instead of compiling class-producing APIs`                                                                                                                          |
| Invalid JS codegen emitted             | `marks invalid generated replacement syntax as unsafe runtime fallback` and `emits parseable dynamic lookup output for JS, JSX, TS, and TSX source kinds`                                                                           |
| Debug/candidate manifest contradiction | `keeps debug statuses and candidate record kinds aligned for mixed outcomes`                                                                                                                                                        |
| Stale candidates survive update/delete | `removes stale manifest candidates on update and delete`; full HMR invalidation remains covered by `vite_plugin.test.ts > updates manifest from hot-update reads, removes deleted candidates from CSS, and invalidates CSS entries` |

## createTools Usage Matrix

| Usage family                                  | Release-gate test                                                                                                                                                                                                                               |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Token definitions                             | `exact createTools runtime parity > tw.join with token definitions`                                                                                                                                                                             |
| Style config definitions                      | `exact createTools runtime parity > tw.def with classList and style config definitions`, `tw.mergeProps and tw.mergeRecord with shared style configs`, `direct tw.style class and style calls`                                                  |
| `compose` fallback                            | `safe fallback contract > keeps compose chains candidate-only rather than compiling them`                                                                                                                                                       |
| `.class()` / `.style()` direct calls          | `direct tw.style class and style calls`, `direct tw.toggle dynamic and static class plus style calls`, `direct tw.rotary dynamic and static class plus style calls`, `direct tw.variants mixed static and dynamic props class plus style calls` |
| Spread operators                              | `safe fallback contract > keeps unknown spreads as fallback-known candidates without compiling`                                                                                                                                                 |
| `join` / `def` / `mergeProps` / `mergeRecord` | `tw.join with token definitions`, `tw.def with classList and style config definitions`, `tw.mergeProps and tw.mergeRecord with shared style configs`                                                                                            |
| Stored stylers                                | `stored tw.style styler class and style calls`, `stored toggle rotary and variants stylers`, `safe fallback contract > preserves exported stored stylers as runtime values`                                                                     |
| Aliases and shadowing                         | `aliased createTools import with non-tw receiver`, `safe fallback contract > preserves unproven aliases and shadowed receivers`                                                                                                                 |
| Source-kind variants                          | `emits parseable dynamic lookup output for JS, JSX, TS, and TSX source kinds`                                                                                                                                                                   |
| Runtime fallback diagnostics                  | `preserves unknown dynamic class and style values with runtime fallback diagnostics`, `preserves runtime createTools mergers instead of compiling class-producing APIs`                                                                         |

## Release Commands

Minimum Layer 8 validation:

```bash
pnpm --filter @tailwindest/compiler test
pnpm --filter @tailwindest/compiler test
pnpm --filter @tailwindest/compiler build
git diff --check -- packages/tailwindest-compiler/src/vite/__tests__/release_gate_matrix.test.ts packages/tailwindest-compiler/docs/fix1/layer8_traceability.md
```
