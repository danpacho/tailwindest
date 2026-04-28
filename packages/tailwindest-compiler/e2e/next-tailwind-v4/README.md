# Next Tailwind v4 Tailwindest Fixture

Real Next 16 App Router fixture for Tailwindest framework parity E2E.

Next is not Vite, so this fixture uses a local precompile bridge:
`precompile-tailwindest.ts` compiles `src/app` into the generated `app`
directory and injects the Tailwindest source manifest into generated
`app/globals.css`. The hard gate runs webpack mode with `next dev --webpack`
and `next build --webpack`. Turbopack is pending a dedicated adapter.
