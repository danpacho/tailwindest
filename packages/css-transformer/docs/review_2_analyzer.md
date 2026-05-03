# Phase 2 Review: Analyzer

## Verdict

Approved when analyzer tests prove variant nesting, override order, and
diagnostic preservation.

## Required Evidence

- Static class conversion tests.
- Stacked variant tests.
- Duplicate property override tests.
- Unresolved token diagnostics.

## Release Notes

The analyzer must never hide unsupported classes. Conservative fallback is a
release requirement.
