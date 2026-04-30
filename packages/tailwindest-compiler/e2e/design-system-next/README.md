# Tailwindest Design System Next E2E

Next.js App Router webpack target for the shared Tailwindest design-system E2E
page.

## Purpose

This fixture verifies the current Next.js production path through the
Tailwindest precompile bridge. It is intentionally scoped to App Router webpack.
Turbopack remains out of scope until a native adapter is implemented.

## Command

```bash
pnpm --filter @tailwindest/compiler e2e:design-system-next
```

## Verified Output

- Precompiled App Router source.
- Shared design-system page completeness.
- Dev and production computed-style parity.
- Tailwind candidate and exclusion manifest.
- Zero-runtime client bundle checks.
- Screenshot artifacts under
  `packages/tailwindest-compiler/e2e/.artifacts/design-system-screenshots/next/`.
