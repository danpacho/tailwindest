# TanStack Start Tailwind v4 Tailwindest Fixture

Real TanStack Start fixture for Tailwindest framework parity E2E.

The Vite plugin order keeps Tailwindest candidate injection before Tailwind CSS,
then follows the TanStack Start requirement that `viteReact()` runs after
`tanstackStart()`.
