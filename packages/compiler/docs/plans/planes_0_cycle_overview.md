# Tailwindest Compiler Cycle Overview Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Define the execution contract for the `[전지적 구현자] -> [전지적 재판관]` cycle across every compiler phase.

**Architecture:** The compiler is built as a deterministic core plus adapters. The core owns evaluation, static resolution, substitution planning, variant optimization, diagnostics, and candidate manifests. The Vite adapter only orchestrates transform order, HMR invalidation, and Tailwind v4 `@source inline()` injection.

**Tech Stack:** TypeScript, ts-morph or TypeScript compiler API, MagicString, Vitest, Vite 8 plugin API, Tailwind CSS v4 `@tailwindcss/vite`, Tailwind `@source inline()`.

---

## Non-negotiable Architecture Contract

- Tailwind integration is `CandidateManifest -> @source inline()`. Do not reintroduce `addUtilities` as the main path.
- Vite plugin output has two layers: `tailwindest:transform` for JS/TS and `tailwindest:source` for CSS.
- Dev/build parity requires the same evaluator, resolver, merger policy, manifest bridge, and invalidation rules.
- Static compilation must be exact. Unknown values are strict errors or loose fallbacks, never silent assumptions.
- Runtime styler classes must disappear from fully compiled production bundles.
- Every public `createTools()` API must have feature, edge, negative, and parity tests.

## Cycle Roles

- `[전지적 구현자]`: implements only the current `planes_N_*.md` scope, creates or updates tests first, records evidence, and fixes only judge feedback that belongs to the same phase.
- `[전지적 재판관]`: judges only against `critic_0_gate_matrix.md` plus the paired `critic_N_*.md`, assigns P0/P1/P2/P3 findings, and must reject when required evidence is missing.
- The 구현자 cannot self-approve. The 재판관 cannot approve from narrative claims; approval requires traceable evidence.

## Phase Map

| Phase | 구현자 spec               | 재판관 gate               |
| ----- | ------------------------- | ------------------------- |
| 1     | `planes_1_evaluation.md`  | `critic_1_evaluation.md`  |
| 2     | `planes_2_detector.md`    | `critic_2_detector.md`    |
| 3     | `planes_3_substitutor.md` | `critic_3_substitutor.md` |
| 4     | `planes_4_vite.md`        | `critic_4_vite.md`        |
| 5     | `planes_5_optimizer.md`   | `critic_5_optimizer.md`   |
| 6     | `planes_6_debug_e2e.md`   | `critic_6_debug_e2e.md`   |

Implementation phases 1-6 run in order. A later phase may inspect earlier artifacts, but it must not start implementation until every earlier phase has a judge verdict of `승인`. Phase 6 is the final diagnostics, debug, HMR, Tailwind v4 E2E, and zero-runtime release gate.

## Per-Phase Controller Loop

Every phase follows this exact loop:

1. `command -> implement`: the parent assigns one `planes_N_*.md` file and its paired `critic_N_*.md`; the 구현자 restates scope, assumptions, and phase-local success checks.
2. `implement`: the 구현자 writes failing tests or fixtures first, implements only the assigned phase, preserves `CandidateManifest -> @source inline()` as the Tailwind path, and does not use `addUtilities` as the primary integration.
3. `evidence`: the 구현자 submits the mandatory evidence package below with exact file names, exact commands, and before/after test status.
4. `judge`: the 재판관 applies `critic_0_gate_matrix.md` first, then the paired phase critic. Any global P0/P1 rule overrides phase-local judgment.
5. `feedback/fix`: if the judge reports P0, P1, P2, or P3 findings, the 구현자 fixes only in the assigned phase scope and resubmits a complete evidence package.
6. `verdict`: the 재판관 returns either `승인` or `반려: P<level> <reason>`. A phase is not complete until the verdict is `승인`.

There is no acceptance without critic gate evidence. Passing tests alone are insufficient when the critic requires manifest, diagnostic, transform, bundle, source map, HMR, or CSS proof.

## Mandatory Evidence Package Per Phase

Each phase must finish with:

- Failing tests committed before implementation.
- Passing tests after implementation.
- Test file names and exact commands run.
- Before/after test status, including the failing status before implementation.
- A fixture matrix that maps every supported API, edge case, negative case, and phase risk to at least one assertion.
- A diagnostic matrix for unsupported cases, including strict error and loose fallback behavior where relevant.
- Candidate manifest diff for class-producing tests, proving the `CandidateManifest -> @source inline()` path.
- A short parity note with "runtime result", "compiled result", and "Tailwind CSS candidate result".
- Bundle or transform proof for zero-runtime claims whenever the phase touches substitution, Vite, optimization, diagnostics, or E2E behavior.
- Any waived or skipped test with the exact reason. Waivers do not bypass P0 or P1.

The 재판관 must not say `승인` if any required evidence item is absent.

## Rejection Handling

- P0 means immediate rejection. The 구현자 must stop feature expansion, identify the silent miscompile, CSS omission, stale HMR class, dev/build divergence, transformed-JS scanning dependency, or `addUtilities` primary-path regression, then resubmit evidence proving removal of that risk.
- P1 means rejection. The 구현자 must add or fix diagnostics, fallback behavior, public API coverage, or zero-runtime proof before requesting another judgment.
- P2 means hold. The phase can continue only after the performance, source map, or debuggability regression has a fix or an explicit judge-accepted bounded follow-up.
- P3 means correction request. Documentation, naming, or evidence wording must be corrected before final approval.
- A rejected phase restarts at `feedback/fix` and returns to `evidence`; it does not skip directly to `verdict`.

## Coverage Definition

`100%` means contract coverage, not just line coverage.

- API coverage: every `createTools()` public function and returned styler method is tested.
- Feature coverage: ordinary static inputs are compiled.
- Edge coverage: nested arrays, falsey class entries, duplicate style paths, deep imports, circular references, arbitrary values, stacked variants, and deletion updates are tested.
- Negative coverage: unsupported mergers, unknown spreads, mutation, side effects, and dynamic values are diagnosed.
- Integration coverage: dev transform, build transform, Tailwind CSS output, and production bundle are tested.

## Global Test Commands

Run phase-local tests first, then global tests.

```bash
pnpm --filter @tailwindest/compiler test
pnpm --filter @tailwindest/compiler build
```

When Vite/Tailwind e2e exists:

```bash
pnpm --filter @tailwindest/compiler test:e2e
```

## Completion Rule

A phase is not complete until `critic_0_gate_matrix.md` and its paired critic document both pass without unresolved P0 or P1 findings. If a waiver is needed for P2 or P3, document it in the phase evidence and add a failing or skipped test with the exact reason.

Final approval wording is exactly:

```text
승인: Phase N satisfies critic_0_gate_matrix.md and critic_N_*.md with evidence.
```

That wording is forbidden when any required command was not run, any required evidence package item is missing, any P0/P1 finding remains open, Tailwind integration relies on transformed JS scanning, or `addUtilities` is reintroduced as the primary Tailwind integration path.
