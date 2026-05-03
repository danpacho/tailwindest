# Validation Layer 1: Public Contract

## Authority

Validate against `fix_layer_1.md`.

The implemented result must establish one fallback-safe public compiler contract
without relying on later layers.

## Isolation Requirements

- Run in an isolated worktree or branch.
- Include only public contract/API/docs/test updates for Layer 1.
- Do not modify provenance, code generation, candidate logic, or import cleanup
  unless required only to remove public zero-runtime policy behavior.
- Record `git status --short` before and after validation.

## Required Evidence

The Judge must collect:

- public type diff for `CompileOptions`, Vite options, and exported policy types;
- docs diff proving zero-runtime policy language was removed or downgraded;
- test diff proving zero-runtime policy tests were converted to fallback semantics;
- command output for the relevant compiler test suite.

## Acceptance Criteria

- Public TypeScript API no longer exposes a zero-runtime policy switch.
- Runtime unsupported cases preserve the original call.
- No public test for a removed compiler policy remains.
- Exact static replacement tests still pass.
- Existing users cannot enable removed zero-runtime policy behavior through documented API.

## Rejection Criteria

Reject the implementation if any of these are true:

- a zero-runtime policy is still documented as public behavior;
- unsupported values still throw because of removed policy behavior;
- exact static compilation regresses;
- unrelated compiler internals are refactored without need;
- public API removal is incomplete and leaves contradictory docs/types.

## Validation Commands

Minimum:

```bash
pnpm --filter @tailwindest/compiler test -- src/vite src/core src/debug
pnpm --filter @tailwindest/compiler build
```

If type tests exist for compiler public API, run them as well.

## Final Judgment Format

The Judge report must include:

- verdict: pass or fail;
- exact evidence for public policy removal;
- exact unsupported-call behavior evidence;
- remaining risks passed to Layer 2.
