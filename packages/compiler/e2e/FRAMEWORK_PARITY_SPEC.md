# Tailwindest Framework Parity E2E Spec

## Goal

Validate that the Tailwindest compiler converges to the same visual result in
real framework dev and production modes, and that `CreateCompiledTailwindest`
keeps compiler-oriented authoring types aligned with the runtime compiler
contract.

## Target Frameworks

- TanStack Start latest Vite path: real TanStack Start app using
  `tanstackStart()` from `@tanstack/react-start/plugin/vite`, `viteReact()`
  after it, Tailwind CSS v4 through the Vite integration, and
  `@tailwindest/compiler/vite` before Tailwind CSS so source candidates are
  injected before Tailwind scans CSS.
- Next.js latest App Router path: real Next 16 App Router app using
  `@tailwindcss/postcss`. Next is not Vite, so the Vite plugin cannot apply.
  This fixture must use a framework-specific bridge, adapter, or precompile
  bridge that feeds Tailwindest candidates into the Next/PostCSS pipeline.

## Gates

- Hard gate: TanStack Start dev server, production build, production server,
  browser visual parity, dev style endpoint leakage, debug manifest, CSS
  selector leakage, zero-runtime client asset checks.
- Hard gate: Next App Router in webpack mode using `next dev --webpack`,
  `next build --webpack`, `next start`, browser visual parity, debug manifest,
  CSS selector leakage, zero-runtime client asset checks.
- Experimental gate: Next Turbopack. Next 16 defaults to Turbopack, but the
  Tailwindest Vite plugin cannot run there and the webpack/precompile bridge is
  the current hard gate. Turbopack support requires a dedicated bridge and is
  documented as pending until implemented and tested honestly.

## Test Contract

Each framework fixture must render a target element whose className is produced
from `createTools()` and a `CreateCompiledTailwindest`-typed style object. The
style must cover:

- Deeply nested variants:
  `dark.hover.focus` must compile from raw leaf utilities into prefixed
  candidates such as `dark:hover:focus:text-white`.
- Group, peer, and arbitrary variants:
  `group.hover`, `peer.focus`, and `data-[state=open]` must affect computed
  border, color, and padding in the browser.
- Raw shorthand CSS leakage prevention:
  raw nested shorthand selectors such as `.bg-red-900` and `.bg-red-950` must
  be excluded with `@source not inline()` semantics and must not appear as final
  built CSS selectors.
- Framework dev aggregation:
  framework style endpoints that re-serve `tailwindcss/index.css` separately
  from the project CSS must still receive the Tailwindest source bridge. This
  prevents raw nested shorthand utilities from being regenerated later in the
  same `@layer utilities` cascade and overriding prefixed dark/group/peer
  variants in dev only.
- Dev/prod visual convergence:
  dev and production pages must expose the same DOM className and matching
  computed style snapshots for background, color, border color, and padding in
  base, group-hover, peer-focus, and dark hover/focus states.
- Debug manifest:
  `.tailwindest/debug-manifest.json` must include expected candidates and
  `excludedCandidates`.
- Screenshot artifacts:
  each framework gate must save `dev.png`, `debug.png`, and `prod.png` under
  `packages/compiler/e2e/.artifacts/framework-screenshots/<fixture>/` so the
  rendered dev page, debug manifest summary, and production page can be
  inspected after the test run.
- Zero-runtime JS:
  built client assets must not include `createTools`, `PrimitiveStyler`,
  `ToggleStyler`, `RotaryStyler`, or `VariantsStyler`.
- DX type validation:
  `CreateCompiledTailwindest` must accept raw nested leaf utilities and reject
  nested synthesized prefixes such as `dark:bg-*`; `CreateTailwindest` must keep
  its legacy synthesized nested value behavior.

## Expected Commands

Run the baseline compiler and Tailwindest checks:

```bash
pnpm ts:typecheck
pnpm vitest run packages/tailwindest/src
pnpm --filter @tailwindest/compiler test -- e2e/vite-tailwind-v4/vite-tailwind-v4.test.ts
pnpm --filter @tailwindest/compiler test:e2e
pnpm --filter @tailwindest/compiler build
```

Run individual framework gates when narrowing failures:

```bash
pnpm --filter @tailwindest/compiler e2e:tanstack-start
pnpm --filter @tailwindest/compiler e2e:next
pnpm --filter @tailwindest/compiler e2e:frameworks
```

## Known Limitation

Next.js latest is not Vite. The public `@tailwindest/compiler/vite` plugin owns
Vite transform state, HMR invalidation, and Tailwind CSS `@source inline()`
injection, so it cannot be applied to Next directly. The Next hard gate must
therefore use a Next-specific adapter or fixture-local precompile bridge until
there is a production-ready Next/Turbopack integration. This limitation is part
of the test contract and must not be hidden by running only a generic Vite
fixture.
