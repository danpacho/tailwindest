# Tailwindest Design System TanStack Start E2E

TanStack Start target for the shared Tailwindest design-system E2E page.

## Purpose

This fixture verifies the Tailwindest Vite integration inside a TanStack Start
application. It protects dev/build parity for framework routing, server output,
client output, Tailwind CSS generation, and dynamic browser interactions.

## Command

```bash
pnpm --filter @tailwindest/compiler e2e:design-system-tanstack-start
```

## Verified Output

- Shared design-system page completeness.
- Class-output lowering plus runtime-preserved `createTools()` API coverage.
- Dev and production computed-style parity.
- Tailwind candidate and exclusion manifest.
- Runtime-preserved API behavior for `tw.join`, `*.style()`, `*.compose()`,
  and `tw.mergeRecord()`.
- Screenshot artifacts under
  `packages/tailwindest-compiler/e2e/.artifacts/design-system-screenshots/tanstack-start/`.
