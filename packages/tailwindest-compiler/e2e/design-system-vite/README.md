# Tailwindest Design System Vite E2E

Vite baseline target for the shared Tailwindest design-system E2E page.

## Purpose

This fixture proves that the Vite plugin pair compiles every public
`createTools()` API and converges between development and production builds.

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
- Zero-runtime client bundle checks.
- Screenshot artifacts under
  `packages/tailwindest-compiler/e2e/.artifacts/design-system-screenshots/vite/`.
