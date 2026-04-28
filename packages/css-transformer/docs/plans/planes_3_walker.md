# Phase 3 Plan: Walker Registry

This archived plan defines the walker and registry milestone for the CSS
transformer.

## Scope

- Implement the registry.
- Implement `CvaWalker`, `CnWalker`, and `ClassNameWalker`.
- Implement import collection.
- Add golden-file E2E tests.

## Exit Criteria

- Walkers preserve unsupported dynamic code.
- Import changes are safe.
- Golden fixtures pass.
- The walker contract is documented in `../details_walker.md`.
