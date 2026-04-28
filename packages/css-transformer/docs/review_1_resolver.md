# Phase 1 Review: Resolver

## Verdict

Approved for the next phase when resolver tests pass and unsupported tokens are
diagnosed instead of dropped.

## Required Evidence

- Resolver unit tests.
- Unsupported token diagnostics.
- Arbitrary value preservation.
- Stable output for supported utility families.

## Release Notes

The resolver is a production-critical component because every later transform
depends on its path mapping. Changes to resolver tables must be reviewed with
golden fixtures.
