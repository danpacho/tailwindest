# Tailwindest Design System Vite E2E

Vite baseline target for the shared Tailwindest design-system E2E page.

## Purpose

This fixture proves that the Vite plugin pair lowers nested variant
class-output calls, preserves runtime-visible Tailwindest APIs, and converges
between development and production builds.

## Command

```bash
pnpm --filter @tailwindest/compiler e2e:design-system-vite
```

## Verified Output

- DOM expected class table.
- Dynamic interaction parity.
- Dev and production computed-style parity.
- Tailwind candidate and exclusion manifest.
- Built CSS and dev CSS raw-leak checks.
- Runtime-preserved API behavior for `tw.join`, `*.style()`, `*.compose()`,
  and `tw.mergeRecord()`.
- Screenshot artifacts under
  `packages/tailwindest-compiler/e2e/.artifacts/design-system-screenshots/vite/`.
