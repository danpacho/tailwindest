# Fix Layer 3: Runtime Preservation and Import Cleanup Safety

## Purpose

Ensure runtime fallback remains executable.

Loose-only compilation is safe only if every unsupported runtime call keeps the
imports, declarations, and bindings it needs.

## Problem Definition

Import cleanup can remove Tailwindest runtime declarations after exact
replacement. This is valid only when all runtime use is gone and the declaration
is not part of the module's public surface.

Known risk:

```ts
import { createTools } from "tailwindest"
export const tw = createTools()
export const cls = tw.join("px-4")
```

After replacing `tw.join("px-4")`, cleanup can remove `export const tw`.
That breaks downstream imports.

Fallback cases also require imports and declarations to remain.

## Fix Strategy

### Engineering Principles

- Runtime preservation is part of correctness.
- Import cleanup must be conservative.
- Never remove public exports as a local optimization.
- Never remove declarations that any fallback span depends on.

### Interface Strategy

Augment cleanup with preservation facts from the transform:

```ts
interface ImportCleanupInput {
    fileName: string
    code: string
    preservedRuntimeBindings?: Set<string>
    hasRuntimeFallback?: boolean
}
```

Acceptable alternative: compute the same facts from final code after
replacement, but exported declarations must still be protected explicitly.

Required protected nodes:

- exported `createTools()` declarations;
- bindings used by preserved runtime calls;
- imports used by protected declarations;
- imports used by non-compiled Tailwindest calls;
- any declaration whose removal changes public module exports.

### Algorithm Strategy

1. Apply exact replacements first.
2. Compute remaining identifier usage in final code.
3. Identify fallback-preserved Tailwindest calls and their receiver bindings.
4. Mark exported declarations as non-removable.
5. Remove `createTools` imports only if:
    - no runtime Tailwindest binding remains;
    - no protected exported declaration depends on it;
    - no fallback call depends on it.
6. Remove local `const tw = createTools()` only when:
    - it is not exported;
    - it has no remaining identifier usage;
    - all calls that used it were exact replaced.

## Test Targets

### Core Logic Coverage

- Exact-only local `const tw = createTools()` can be removed.
- Exported `export const tw = createTools()` is never removed.
- Fallback dynamic call keeps import and declaration.
- Mixed exact and fallback calls keep runtime dependencies.

### Edge Case Coverage

- Multiple declarations in one variable statement are not partially removed
  unless the edit is proven syntax-safe.
- Aliased import `import { createTools as createTw }` is preserved when needed.
- Type-only imports remain untouched.
- Non-Tailwindest imports from the same import declaration are preserved.

### Error Case Coverage

- Cleanup failure returns original code with diagnostic.
- Syntax error after cleanup reverts to original transformed code or original
  source according to existing substitutor policy.
- Export removal is treated as validation failure.

## 100% Completion Goal

Every runtime fallback must execute with the same runtime dependencies it had
before transform.

No exported declaration may be removed by Tailwindest runtime cleanup.
