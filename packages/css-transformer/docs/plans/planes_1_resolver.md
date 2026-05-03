# Phase 1 Plan: Resolver

This archived plan defines the resolver milestone for the CSS transformer.

## Scope

- Implement token to style-path resolution.
- Return diagnostics for unsupported tokens.
- Preserve arbitrary values when the utility family is known.

## Exit Criteria

- Resolver tests pass.
- Unsupported tokens are never silently omitted.
- The resolver contract is documented in `../details_resolver.md`.
