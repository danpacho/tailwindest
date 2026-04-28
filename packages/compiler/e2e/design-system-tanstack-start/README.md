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
- Static and dynamic `createTools()` API coverage.
- Dev and production computed-style parity.
- Tailwind candidate and exclusion manifest.
- Zero-runtime client bundle checks.
- Screenshot artifacts under
  `packages/compiler/e2e/.artifacts/design-system-screenshots/tanstack-start/`.
