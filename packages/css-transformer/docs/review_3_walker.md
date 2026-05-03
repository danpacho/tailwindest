# Phase 3 Review: Walker Registry

## Verdict

Approved when walker unit tests and golden-file E2E tests pass.

## Required Evidence

- Registry ordering tests.
- Walker detection tests.
- Import collector tests.
- Golden fixtures for `className`, `cn`, `clsx`, `cva`, and mixed files.

## Release Notes

The walker layer is allowed to preserve unsupported code. It is not allowed to
produce invalid TypeScript or remove imports still used by preserved code.
