# Fumadocs Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current Astro Starlight documentation app in `web/` with a Fumadocs-based documentation site generated from `pnpm create fumadocs-app`, while preserving the existing documentation routes, MDX content, images, and monorepo workflows.

**Architecture:** Treat this as a framework migration, not a theme swap. The `web` workspace package becomes a Next.js 16 + Fumadocs UI + Fumadocs MDX app; existing `web/src/content/docs/**/*.mdx` content moves to Fumadocs' `content/docs` source, and route compatibility is handled by explicit Fumadocs page tree metadata plus redirects only where needed.

**Tech Stack:** pnpm workspace, Turbo, Next.js 16, React, Tailwind CSS 4, Fumadocs UI, Fumadocs MDX, Fumadocs Core, TypeScript.

---

## Assumptions

- Use the Next.js template from `pnpm create fumadocs-app`; it is the most documented path and aligns with the current Fumadocs manual installation guide.
- Keep the `web` package name so root scripts like `pnpm web build` and Turbo workspace filtering continue to work.
- Preserve current public URLs such as `/start/introduction/`, `/setup/`, `/recipe/styling/`, `/apis/style/`, and `/create-tailwind-type/` unless Fumadocs forces a `/docs` prefix. If a prefix is required, add redirects.
- Migrate content first, then polish design. Do not attempt a visual redesign in the same pass.
- Existing Astro-only features are migration risks: Starlight frontmatter (`template`, `hero`, `editUrl`), Starlight directives (`:::note`), and imports from `@astrojs/starlight/components` or `astro:assets`.

## Success Criteria

- `pnpm install` completes with the new `web` dependencies and no obsolete Astro dependency required by `web`.
- `pnpm web build` succeeds.
- `pnpm build` succeeds from the monorepo root.
- The following routes render with correct content: `/`, `/start/introduction`, `/setup`, `/create-tailwind-type`, `/recipe/styling`, `/apis/style`.
- Search route works or is intentionally disabled with no broken UI.
- Existing images under `web/public/images` render from MDX.
- No Astro-specific imports, config files, or Starlight-only MDX syntax remain in active `web` source.

## Phase 0: Baseline Audit

**Files:**

- Read: `web/package.json`
- Read: `web/astro.config.mjs`
- Read: `web/src/content.config.ts`
- Read: `web/src/content/docs/**/*.mdx`
- Read: `web/src/styles/global.css`
- Read: `web/src/styles/custom.css`
- Read: `turbo.json`

**Steps:**

1. Record the current route inventory from `web/src/content/docs`.
    - Verify with: `find web/src/content/docs -type f | sort`
    - Expected: current docs include root, setup, start, recipe, examples, and apis pages.

2. Record all Astro/Starlight-only syntax.
    - Run: `rg "astro:|@astrojs|starlight|template:|hero:|editUrl:|:::" web/src`
    - Expected: identify all content and config that need conversion.

3. Run the current build before migration.
    - Run: `pnpm web build`
    - Expected: either PASS, or document existing failures before touching code.

4. Commit baseline only if the working tree is clean and the user wants checkpoint commits.

## Phase 1: Generate Reference Fumadocs App

**Files:**

- Temporary create: outside repo, for example `/tmp/fumadocs-reference`
- Do not modify repo files in this phase.

**Steps:**

1. Generate a fresh reference app.
    - Run from `/tmp`: `pnpm create fumadocs-app fumadocs-reference`
    - Choose: Next.js, Fumadocs MDX.

2. Inspect generated files.
    - Check: `package.json`, `next.config.mjs`, `source.config.ts`, `app/layout.tsx`, `app/docs/layout.tsx`, `app/docs/[[...slug]]/page.tsx`, `app/api/search/route.ts`, `components/mdx.tsx`, `lib/source.ts`, `app/global.css`.

3. Copy only the structural patterns into the plan execution context.
    - Do not copy generated branding or sample docs.

## Phase 2: Replace `web` Framework Shell

**Files:**

- Modify: `web/package.json`
- Delete after replacement: `web/astro.config.mjs`
- Delete after replacement: `web/src/content.config.ts`
- Create: `web/next.config.mjs`
- Create: `web/source.config.ts`
- Modify: `web/tsconfig.json`
- Create: `web/app/layout.tsx`
- Create: `web/app/global.css`
- Create: `web/lib/source.ts`
- Create: `web/lib/layout.shared.tsx`
- Create: `web/components/mdx.tsx`

**Steps:**

1. Update `web/package.json` scripts.
    - Replace `astro dev/build/preview` with `next dev/build/start`.
    - Keep package name as `web`.
    - Remove Astro/Starlight packages.
    - Add Fumadocs and Next dependencies from the generated reference app.

2. Configure Fumadocs MDX.
    - `web/source.config.ts` should define docs from `content/docs`.
    - `web/next.config.mjs` should wrap config with `createMDX` from `fumadocs-mdx/next`.

3. Configure TypeScript path alias for generated collections.
    - Add `collections/*` -> `./.source/*` to `web/tsconfig.json`.

4. Add Fumadocs root provider and global styles.
    - `web/app/layout.tsx` wraps children with `RootProvider` from `fumadocs-ui/provider/next`.
    - `web/app/global.css` imports Tailwind CSS, `fumadocs-ui/css/neutral.css`, and `fumadocs-ui/css/preset.css`.
    - Carry over only necessary custom theme variables from the old Starlight CSS after confirming they apply to Fumadocs.

5. Verify shell compiles before content migration.
    - Run: `pnpm --filter web install` is not valid in this monorepo; run `pnpm install` from root.
    - Run: `pnpm web build`
    - Expected: build may fail only because docs routes/content are not migrated yet. Dependency/config errors must be fixed before continuing.

## Phase 3: Migrate Routes And Page Layout

**Files:**

- Create: `web/app/[[...slug]]/page.tsx` or `web/app/docs/[[...slug]]/page.tsx`
- Create: `web/app/docs/layout.tsx` only if using `/docs` as base URL
- Create: `web/app/api/search/route.ts`
- Modify: `web/lib/source.ts`
- Modify: `web/lib/layout.shared.tsx`

**Steps:**

1. Choose route base.
    - Preferred: root-level docs base (`baseUrl: "/"`) to preserve current URLs.
    - Fallback: Fumadocs default `/docs`, plus redirects from old routes.

2. Implement docs page route using Fumadocs source loader.
    - Generate static params from `source.generateParams()`.
    - Use Fumadocs page components for title, description, table of contents, and MDX body.
    - Return `notFound()` when no page exists.

3. Implement shared layout options.
    - Set nav title to `Tailwindest`.
    - Add GitHub link to `https://github.com/danpacho/tailwindest`.
    - Recreate sidebar order from old `astro.config.mjs`.

4. Add search route.
    - Use the generated Fumadocs reference app pattern first.
    - If Orama configuration requires extra setup, either complete it or temporarily hide search and document the decision.

5. Verify route generation.
    - Run: `pnpm web build`
    - Expected: static generation includes the selected docs route base and no route collision.

## Phase 4: Move And Normalize Content

**Files:**

- Move: `web/src/content/docs/**/*.mdx` -> `web/content/docs/**/*.mdx`
- Create/modify: `web/content/docs/**/meta.json`
- Modify: all moved MDX files with Starlight-only frontmatter or imports

**Steps:**

1. Move docs content to Fumadocs source directory.
    - Preserve folder names so route compatibility stays simple.

2. Convert sidebar ordering to Fumadocs metadata.
    - Create `meta.json` files where needed.
    - Preserve old groups: Before dive in, Setup, Create Tailwind Type, Recipes, API References.

3. Convert unsupported frontmatter.
    - Remove Starlight-only `template`, `editUrl`, and `hero`.
    - Preserve `title` and `description`.
    - Recreate homepage hero as a React page or Fumadocs-compatible MDX component only after the docs build passes.

4. Replace Starlight components.
    - Replace imports from `@astrojs/starlight/components` with Fumadocs MDX defaults or local React components.
    - Convert Starlight admonitions like `:::note` to a Fumadocs-supported callout syntax/component.
    - Remove imports from `astro:assets`.

5. Normalize internal links.
    - Run: `rg "\\]\\(/|href=\"/" web/content/docs`
    - Ensure links match the chosen route base and lowercase route behavior.
    - Pay special attention to existing links like `/apis/mergeprops` vs file names like `mergeProps.mdx`.

6. Verify content compile.
    - Run: `pnpm web build`
    - Expected: no MDX compile errors and no missing component imports.

## Phase 5: Migrate Styling And Local Components

**Files:**

- Review: `web/src/components/common/*.tsx`
- Review: `web/src/components/pages/*.tsx`
- Review: `web/src/tw.ts`
- Review: `web/src/tailwind.ts`
- Modify or move only components still used by MDX or homepage

**Steps:**

1. Identify used custom components.
    - Run: `rg "from ['\\\"](\\.\\./|@/|~\/|../../).*components|<Main|<LinkButton|<CopyButton|<Card" web/content web/app web/components web/src`

2. Decide per component.
    - If unused after Fumadocs migration, leave it untouched until cleanup phase.
    - If used by homepage or MDX, move it under `web/components` and update imports.

3. Ensure client components are marked.
    - Components using hooks, clipboard, or browser APIs need `"use client"`.

4. Reintroduce Tailwindest-generated typing only if needed.
    - Keep `web/src/tw.ts` and `web/src/tailwind.ts` if components still depend on them.
    - Otherwise defer cleanup; do not delete working code speculatively.

5. Verify style output visually.
    - Run: `pnpm web dev`
    - Open key pages and inspect desktop/mobile.
    - Expected: pages are readable, images load, no obvious layout overlap.

## Phase 6: Deployment And Monorepo Integration

**Files:**

- Modify: `turbo.json` only if Next output paths differ from existing outputs
- Review: `web/.gitignore`
- Review: Vercel project settings if present outside repository

**Steps:**

1. Confirm Turbo outputs.
    - Current `turbo.json` already includes `.next/**` and excludes `.next/cache/**`, so no change should be needed unless the generated template requires another output.

2. Confirm ignored generated files.
    - Ensure `.next`, `.source`, and Next generated type files are ignored if appropriate.

3. Verify root workflows.
    - Run: `pnpm build`
    - Run: `pnpm test`
    - Expected: package builds/tests unaffected by web migration.

4. Verify production start if needed.
    - Run: `pnpm web start` after `pnpm web build`
    - Expected: Next production server starts.

## Phase 7: Cleanup

**Files:**

- Delete only after successful build: `web/src/content.config.ts`
- Delete only after successful build: `web/astro.config.mjs`
- Delete only after successful build: old Astro-only CSS imports
- Remove unused dependencies from `web/package.json`

**Steps:**

1. Remove obsolete Astro/Starlight files and dependencies.
    - Run: `rg "astro|starlight|@astrojs" web package.json pnpm-lock.yaml`
    - Expected: no active references remain, except historical docs if intentionally retained.

2. Run install and lockfile update.
    - Run: `pnpm install`
    - Expected: `pnpm-lock.yaml` reflects Fumadocs/Next dependencies and removes unused Astro packages.

3. Final verification.
    - Run: `pnpm web build`
    - Run: `pnpm build`
    - Run: `pnpm test`

4. Optional browser smoke test.
    - Run: `pnpm web dev`
    - Visit `/`, `/start/introduction`, `/recipe/styling`, `/apis/style`.

## Main Risks

- Fumadocs route base may make root-level documentation less natural than `/docs`. Decide this early because it affects every internal link.
- Starlight frontmatter and components will not be understood by Fumadocs MDX without conversion.
- Case-sensitive API filenames such as `CreateTailwindest.mdx` and links like `/apis/mergeprops` may produce broken routes on case-sensitive deploy environments.
- The current homepage uses Starlight splash frontmatter; Fumadocs will need an explicit homepage implementation if the same landing experience is required.
- `@source not "../tailwind.ts"` in the old Tailwind CSS is tied to the current file location; it must be revisited after moving global CSS.

## Recommended First Implementation PR Scope

Do only these items first:

1. Generate reference app.
2. Replace `web` shell with Next.js/Fumadocs.
3. Migrate docs content with minimal visual fidelity.
4. Preserve routes or add redirects.
5. Build and smoke test.

Defer these items:

1. Visual redesign.
2. Advanced search customization.
3. OG image generation.
4. AI/LLM docs integrations.
5. Deep component library showcase.
