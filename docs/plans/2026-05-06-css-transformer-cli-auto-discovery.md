# CSS Transformer CLI Auto Discovery Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `tailwindest-css-transform` require only the transform target in normal use, while safely inferring Tailwind CSS, Tailwindest import, output mode, walkers, Tailwind package resolution, and dry-run defaults.

**Architecture:** Keep the transformer core unchanged. Move CLI-only discovery and option resolution into a small testable module, then make the CLI call that module before creating the Tailwind resolver and running transforms.

**Tech Stack:** TypeScript, Commander, Clack prompts, Vitest, `create-tailwind-type` exports, `tailwindest-tailwind-internal` discovery and resolution helpers.

---

## Robust-Code Basis

### Assumptions

- The transform target path is the only value the CLI should normally ask for.
- Explicit CLI flags remain valid overrides for automation and unusual projects.
- Automatic inference must be based on project files or existing shared Tailwind discovery helpers, not hard-coded guesses.
- If a value cannot be inferred safely, the CLI should fail with an actionable message instead of silently choosing an unsafe path.
- Programmatic `transform()` behavior should not change.

### Non-Goals

- Do not change walker behavior.
- Do not change generated Tailwindest object output.
- Do not add static output mode.
- Do not implement a broad project framework detector.
- Do not rewrite unrelated README examples except where CLI behavior is documented incorrectly.

### Success Criteria

- Running `tailwindest-transform <target>` performs a non-interactive transform using inferred defaults.
- Running `tailwindest-transform` opens a TUI that asks only for the target path.
- CSS root is inferred with the same `findTailwindCSSRoot()` path used by `create-tailwind-type`.
- Tailwind package base is resolved with `resolveTailwindNodeDir(cssRoot)` and version fallback logic equivalent to `create-tailwind-type`.
- Tailwindest identifier and import path are inferred from the generated Tailwindest tools file when possible.
- `outputMode` defaults to `auto`, walkers default to all supported walkers, and dry-run defaults to `false` without prompting.
- User-provided `--css`, `--identifier`, `--module`, `--mode`, and `--dry-run` override inference.
- Tests cover feature cases and complex edge cases before implementation is considered complete.

---

## Target Behavior

### Interactive CLI

Before:

```text
Where is the file or directory to transform?
Path to your tailwind.css file?
What is your tailwindest identifier?
What is the import path for tailwindest?
Which Tailwindest output mode should be used?
Which walkers would you like to enable?
Dry run?
```

After:

```text
Where is the file or directory to transform?
```

After the target is entered, the CLI prints a short detected-config note:

```text
Tailwind CSS: app/src/styles/tailwind.css
Tailwindest: tw from @/styles
Mode: auto
Walkers: cva, cn, classname
Dry run: false
```

### Non-Interactive CLI

```bash
tailwindest-transform app/src/components/ui
```

This must not open the TUI. It should infer the same configuration and transform the target.

### Override Rules

Explicit flags win:

```bash
tailwindest-transform app/src/components/ui \
  --css app/src/styles/tailwind.css \
  --identifier tw \
  --module @/styles \
  --mode runtime \
  --dry-run
```

Inference only fills missing values.

---

## Discovery Rules

### Tailwind CSS Root

Use `findTailwindCSSRoot(process.cwd())` from `create-tailwind-type`.

Rules:

- If `--css` is provided, resolve that path and use it.
- If `--css` is omitted, call `findTailwindCSSRoot(cwd)`.
- If no CSS root is found, fail before transformation with:

```text
Could not find a Tailwind CSS entry. Pass --css <path>.
```

Verification:

- Test common paths such as `src/styles/tailwind.css`.
- Test fallback glob discovery for a non-common CSS path containing `@import "tailwindcss"`.
- Test missing CSS root fails with the explicit message.

### Tailwind Package Base

Use the same package resolution behavior as `create-tailwind-type`.

Rules:

- Resolve local Tailwind with `resolveTailwindNodeDir(cssRoot)`.
- Check `getTailwindVersion(base)` and `isVersionSufficient(version)`.
- If the local version is below v4, log a warning and call `resolveTailwindNodeDir(undefined, { skipLocal: true })`.
- Do not hard-code `"node_modules/tailwindcss"`.

Verification:

- Unit-test the CLI config builder with mocked resolver functions.
- E2E smoke test should no longer depend on a hard-coded `node_modules/tailwindcss` path.

### Tailwindest Definition

Create a CLI discovery helper that finds the Tailwindest tools export.

Candidate files:

- `tailwind.ts`
- `tw.ts`
- `src/tailwind.ts`
- `src/tw.ts`
- `src/styles/tailwind.ts`
- `src/styles/tw.ts`
- files discovered by glob `**/*.{ts,tsx}` excluding `node_modules`, `dist`, `.next`, `.git`, `build`, `.cache`, and `out`

Detection markers:

- file imports or references `createTools`
- file imports or references `CreateTailwindest`
- file has an exported const initialized with `createTools(...)` or `createTools<...>(...)`

Identifier extraction should support:

```ts
export const tw = createTools<Tailwindest>()
export const tw = createTools<{ tailwindest: Tailwindest }>()
export const styles = createTools()
```

Rules:

- Prefer common candidate paths before glob results.
- If exactly one Tailwindest tools export is found, use it.
- If multiple are found, prefer the first common candidate path.
- If none is found, fall back to identifier `tw` and module path `~/tw` only if the user passed no target import override. Log a warning that the import was not inferred.

Verification:

- Test `createTools<T>()` extraction.
- Test `createTools<{...}>()` extraction.
- Test `src/styles/tailwind.ts` is preferred over later glob hits.
- Test no definition returns the legacy fallback plus warning.

### Tailwindest Import Path

Infer the module specifier from the discovered Tailwindest definition.

Rules:

- If the project has `tsconfig.json` or `jsconfig.json` with `compilerOptions.paths`, use the shortest matching alias.
- Support common alias pattern `"@/*": ["./src/*"]`.
- If no alias matches, use a relative path from the transformed source file directory to the Tailwindest definition file.
- Remove the `.ts` or `.tsx` extension from the module specifier.
- Use POSIX separators in imports.

Example:

```text
project root: /repo/app
source file:   /repo/app/src/components/ui/button.tsx
tools file:    /repo/app/src/styles/tailwind.ts
paths:         "@/*": ["./src/*"]
import:        "@/styles/tailwind"
```

If the tools file is `src/styles/index.ts`, the import should be `@/styles`.

Verification:

- Test alias import for `"@/*": ["./src/*"]`.
- Test relative import when no alias exists.
- Test `index.ts` shortens to the directory import.
- Test Windows-style intermediate paths are normalized to POSIX import strings.

---

## Implementation Tasks

### Task 1: Add CLI Auto-Discovery Unit Tests

**Files:**

- Create: `packages/css-transformer/tests/cli/auto_discovery.test.ts`
- Create: `packages/css-transformer/src/cli/auto_discovery.ts`

**Step 1: Write feature-case tests**

Test names:

- `resolves css root with create-tailwind-type discovery`
- `resolves tailwindest identifier from createTools generic export`
- `resolves alias import path from tsconfig paths`
- `uses default mode walkers and dryRun when omitted`
- `keeps explicit CLI overrides`

Expected helper API:

```ts
const config = await resolveCssTransformerCliConfig({
    cwd,
    targetPath: "src/components/ui",
})

expect(config.cssPath).toBe(resolve(cwd, "src/styles/tailwind.css"))
expect(config.tailwindestIdentifier).toBe("tw")
expect(config.tailwindestModulePath).toBe("@/styles/tailwind")
expect(config.outputMode).toBe("auto")
expect(config.walkers).toEqual(["cva", "cn", "classname"])
expect(config.dryRun).toBe(false)
```

**Step 2: Write complex-edge tests**

Test names:

- `fails when css root cannot be inferred`
- `falls back to legacy tailwindest import when no tools export exists`
- `prefers common tools file over later glob result`
- `uses relative import path when no tsconfig alias matches`
- `normalizes index tools file to directory import`

**Step 3: Run tests and verify failure**

Run:

```bash
pnpm --filter tailwindest-css-transform test -- tests/cli/auto_discovery.test.ts
```

Expected:

```text
FAIL auto_discovery.test.ts
```

Failure should be caused by missing `resolveCssTransformerCliConfig` or unimplemented discovery behavior.

### Task 2: Implement Testable CLI Config Resolution

**Files:**

- Modify: `packages/css-transformer/src/cli/auto_discovery.ts`

**Step 1: Define minimal types**

```ts
export interface ResolveCssTransformerCliConfigInput {
    cwd: string
    targetPath: string
    cssPath?: string
    tailwindestIdentifier?: string
    tailwindestModulePath?: string
    outputMode?: CssTransformerOutputMode
    dryRun?: boolean
}

export interface ResolvedCssTransformerCliConfig {
    targetPath: string
    cssPath: string
    tailwindestIdentifier: string
    tailwindestModulePath: string
    outputMode: CssTransformerOutputMode
    walkers: Array<"cva" | "cn" | "classname">
    dryRun: boolean
    warnings: string[]
}
```

**Step 2: Implement CSS root resolution**

Use `findTailwindCSSRoot()` from `create-tailwind-type`.

**Step 3: Implement Tailwindest tools discovery**

Keep parsing simple and scoped:

- Read candidate files.
- Check for `createTools`.
- Extract `export const <name> = createTools`.
- Support generic arguments because the regex only needs to tolerate text between `createTools` and `(`.

Suggested extraction pattern:

```ts
;/export\s+const\s+([A-Za-z_$][\w$]*)\s*=\s*createTools(?:\s*<[\s\S]*?>)?\s*\(/
```

If this becomes brittle in tests, switch only this helper to `ts-morph`; do not add broader AST analysis unless needed.

**Step 4: Implement import path resolution**

Read `tsconfig.json` or `jsconfig.json` with `JSON.parse`.

Support only stable, common path alias forms:

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["./src/*"]
        }
    }
}
```

Use relative imports as the fallback.

**Step 5: Run unit tests**

Run:

```bash
pnpm --filter tailwindest-css-transform test -- tests/cli/auto_discovery.test.ts
```

Expected:

```text
PASS tests/cli/auto_discovery.test.ts
```

### Task 3: Wire CLI to Resolved Config

**Files:**

- Modify: `packages/css-transformer/src/cli.ts`
- Test: `packages/css-transformer/tests/cli/auto_discovery.test.ts`

**Step 1: Remove inline narrow discovery**

Remove the existing `findTailwindestDefinition()` helper from `cli.ts`.

**Step 2: Make TUI ask only target path**

`runTUI()` should prompt only:

```ts
targetPath: () =>
    p.text({
        message: "Where is the file or directory to transform?",
        placeholder: "./src",
        validate: (value) => {
            if (!value) return "Path is required"
        },
    })
```

After that, call `resolveCssTransformerCliConfig()`.

**Step 3: Make non-interactive path work**

Commander action should be:

```ts
if (!targetPath) {
    await runTUI(options)
    return
}

await runTransform({
    targetPath,
    options,
})
```

No TUI should run when `targetPath` is provided.

**Step 4: Use inferred config in `transform()`**

Pass:

```ts
tailwindestIdentifier: config.tailwindestIdentifier,
tailwindestModulePath: config.tailwindestModulePath,
outputMode: config.outputMode,
walkers: config.walkers,
```

**Step 5: Run targeted tests**

Run:

```bash
pnpm --filter tailwindest-css-transform test -- tests/cli/auto_discovery.test.ts
```

Expected:

```text
PASS tests/cli/auto_discovery.test.ts
```

### Task 4: Replace Hard-Coded Tailwind Base

**Files:**

- Modify: `packages/css-transformer/src/cli.ts`
- Test: `packages/css-transformer/tests/cli/auto_discovery.test.ts`

**Step 1: Import shared Tailwind resolution helpers**

Use existing exports from `create-tailwind-type`:

```ts
resolveTailwindNodeDir,
getTailwindVersion,
isVersionSufficient,
```

**Step 2: Resolve Tailwind base before creating `TailwindCompiler`**

```ts
let tailwindNodeDir = await resolveTailwindNodeDir(config.cssPath)
const tailwindVersion = getTailwindVersion(tailwindNodeDir)

if (!isVersionSufficient(tailwindVersion)) {
    p.log.warn(...)
    tailwindNodeDir = await resolveTailwindNodeDir(undefined, {
        skipLocal: true,
    })
}
```

**Step 3: Use the resolved base**

```ts
const compiler = new TailwindCompiler({
    cssRoot: config.cssPath,
    base: tailwindNodeDir,
})
```

**Step 4: Run package tests**

Run:

```bash
pnpm --filter tailwindest-css-transform test
```

Expected:

```text
PASS
```

### Task 5: Add CLI Behavior Smoke Tests

**Files:**

- Create or Modify: `packages/css-transformer/tests/cli/cli_behavior.test.ts`

**Step 1: Test non-interactive path does not enter TUI**

Use a child process against the built or tsx CLI with a temporary fixture project.

Expected:

- Command exits without waiting for prompt input.
- A file in the target directory is transformed.

**Step 2: Test dry-run does not write**

Expected:

- Command exits successfully.
- Target file content is unchanged.

**Step 3: Run smoke tests**

Run:

```bash
pnpm --filter tailwindest-css-transform test -- tests/cli/cli_behavior.test.ts
```

Expected:

```text
PASS tests/cli/cli_behavior.test.ts
```

If child-process testing becomes too brittle, keep this as a single integration test around an exported `runTransform()` function and leave true process testing for a later release. Do not overbuild a CLI harness.

### Task 6: Update Documentation

**Files:**

- Modify: `packages/css-transformer/docs/ARCHITECTURE.md`
- Modify: `web/content/docs/css-transformer.mdx`
- Modify: `packages/css-transformer/README.md`

**Step 1: Update architecture**

Document that CLI config resolution performs:

- target path from user
- CSS root via `findTailwindCSSRoot`
- Tailwind package via `resolveTailwindNodeDir`
- Tailwindest identifier/import via tools-file discovery
- output mode default `auto`
- walkers default all
- dry-run default `false`

**Step 2: Update user docs**

Replace text that says the interactive CLI asks for target path, Tailwind CSS entry, import name, import path, walkers, and dry-run mode.

New baseline:

```bash
npx tailwindest-css-transform src/components
```

Explain that advanced flags are overrides, not required setup.

**Step 3: Run markdown diff check**

Run:

```bash
git diff --check -- packages/css-transformer/docs/ARCHITECTURE.md web/content/docs/css-transformer.mdx packages/css-transformer/README.md
```

Expected:

```text
no output
```

### Task 7: Final Verification

**Files:**

- All modified CLI, test, and documentation files.

**Step 1: Run focused tests**

```bash
pnpm --filter tailwindest-css-transform test -- tests/cli
```

Expected:

```text
PASS
```

**Step 2: Run full package tests**

```bash
pnpm --filter tailwindest-css-transform test
```

Expected:

```text
PASS
```

**Step 3: Run package build**

```bash
pnpm --filter tailwindest-css-transform build
```

Expected:

```text
success
```

**Step 4: Check formatting-sensitive diff**

```bash
git diff --check -- packages/css-transformer docs/plans/2026-05-06-css-transformer-cli-auto-discovery.md web/content/docs/css-transformer.mdx
```

Expected:

```text
no output
```

---

## Risk Controls

- Keep CLI discovery separate from transformer core so existing walker tests protect current behavior.
- Prefer shared `create-tailwind-type` exports over duplicating Tailwind detection.
- Use explicit CLI overrides as the escape hatch for non-standard projects.
- Fail closed when CSS root cannot be inferred.
- Log warnings for Tailwindest import fallback so users know when the tool guessed.
- Avoid broad AST refactors unless regex-based tools export detection fails the planned tests.

## Completion Definition

This fix is complete only when:

- The CLI no longer prompts for questions 2 through 7 in interactive mode.
- Non-interactive target path execution works.
- Automatic discovery is covered by feature-case and edge-case tests.
- Existing transformer tests still pass.
- Documentation describes zero-config default usage and override flags accurately.
