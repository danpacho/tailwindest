## Create Tailwind Type

Generate TypeScript definitions for your Tailwind CSS configuration.

```bash
npx create-tailwind-type
```

By default this writes both `tailwind.ts` and `tailwind_literal.ts`.

- `tailwind.ts` exports `Tailwind` and `TailwindNestGroups`.
- `tailwind_literal.ts` exports the precomputed `TailwindLiteral` union for
  typed class string arguments.

Arbitrary strings are still controlled by `useArbitrary: true` in your
`CreateTailwindest` and `createTools` setup.
Arbitrary and dynamic variant object keys, such as `[&_p]`,
`data-[size=large]`, `aria-invalid`, or `group-aria-invalid`, are controlled
by `useArbitraryNestGroups: true` in `CreateTailwindest`.
Generated arbitrary value template types and slash modifier variant template
types are disabled by default for TypeScript performance. Enable them only when
you specifically need generated patterns such as `bg-[${string}]` or
`ring-${string}/${number}`.

---

## Usage Examples

- Use custom plugins

The CLI automatically resolves your local Tailwind CSS package from the
detected CSS root. Use `--base` only when you need to point at a custom
`@tailwindcss/node` location.

```bash
npx create-tailwind-type -b ./custom-tailwindcss
```

- Generate exact slash modifier variants

**Will generate exact slash modifier variants instead of soft variants.** This
can slow the TypeScript language server if you use it directly. Importing a
small subtype is usually safer.

```bash
npx create-tailwind-type --enable-variants -S
```

- Change output filename

**Will generate types in `src/types/tailwind.d.ts` and
`src/types/tailwind_literal.d.ts`.**

```bash
npx create-tailwind-type -f src/types/tailwind.d.ts
```

## CLI Options

| Option (Short) | Option (Long)                 | Description                                                                                                                                                | Default Value          | Example Usage                                                   |
| -------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------- |
| `-b`           | `--base <path>`               | Specifies the base directory for @tailwindcss/node package. If omitted, the tool automatically resolves to the installed `@tailwindcss` package directory. | _None_ (auto-resolved) | `npx create-tailwind-type -b ./custom`                          |
| `-f`           | `--filename <filename>`       | Sets the output filename for `Tailwind`/`TailwindNestGroups`. The `TailwindLiteral` file is emitted next to it with `_literal` suffix.                     | `tailwind.ts`          | `npx create-tailwind-type -f customTypes.ts`                    |
| `-d`           | `--docs`                      | Enables documentation comments in the generated types. Use the inverse flag to disable them.                                                               | `true`                 | `npx create-tailwind-type` or `npx create-tailwind-type --docs` |
| `-D`           | `--no-docs`                   | Disables documentation comments in the generated types.                                                                                                    | N/A                    | `npx create-tailwind-type --no-docs`                            |
| `-a`           | `--arbitrary-value`           | Enables generated arbitrary value template types such as `bg-[${string}]`. This can slow TypeScript on large projects.                                     | `false`                | `npx create-tailwind-type --arbitrary-value`                    |
| `-A`           | `--no-arbitrary-value`        | Explicitly disables arbitrary value template type generation.                                                                                              | N/A                    | `npx create-tailwind-type --no-arbitrary-value`                 |
| N/A            | `--enable-variants`           | Enables generated slash modifier variant template types such as `ring-${string}/${number}`. This can slow TypeScript on large projects.                    | `false`                | `npx create-tailwind-type --enable-variants`                    |
| `-N`           | `--disable-variants`          | Explicitly disables slash modifier variant template type generation. This is already the default behavior.                                                 | N/A                    | `npx create-tailwind-type --disable-variants`                   |
| `-s`           | `--soft-variants`             | Uses soft slash modifier templates when `--enable-variants` is set.                                                                                        | `true`                 | `npx create-tailwind-type --enable-variants --soft-variants`    |
| `-S`           | `--no-soft-variants`          | Uses exact slash modifier templates when `--enable-variants` is set.                                                                                       | N/A                    | `npx create-tailwind-type --enable-variants --no-soft-variants` |
| `-k`           | `--string-kind-variants-only` | Limits the generated types to only string kind variants.                                                                                                   | `false`                | `npx create-tailwind-type --string-kind-variants-only`          |
| `-o`           | `--optional-property`         | Generates optional properties in the output types, which can be useful for partial configurations.                                                         | `false`                | `npx create-tailwind-type --optional-property`                  |
| N/A            | `--version`                   | Displays the current CLI version.                                                                                                                          | N/A                    | `npx create-tailwind-type --version`                            |
| N/A            | `--help`                      | Displays help and usage information for the CLI tool.                                                                                                      | N/A                    | `npx create-tailwind-type --help`                               |

---

## Detailed Option Descriptions

### `-b, --base <path>`

Specifies a custom base directory for locating `@tailwindcss/node`.

- **Default:** Automatically resolves to the installed `@tailwindcss` package directory.
- **Example:**
    ```bash
    npx create-tailwind-type -b ./custom
    ```

### `-f, --filename <filename>`

Determines the output filename for the generated `Tailwind` and
`TailwindNestGroups` TypeScript types. A sibling `TailwindLiteral` file is
generated automatically.

- **Default:** `tailwind.ts`
- **Example:**
    ```bash
    npx create-tailwind-type -f customTypes.ts
    ```
    This also writes `customTypes_literal.ts`.

### `-d, --docs` / `--no-docs`

Controls whether documentation comments are included in the generated types.

- **Default:** Enabled (`true`)
- **Examples:**
    - To enable (or use the default):
        ```bash
        npx create-tailwind-type --docs
        ```
    - To disable:
        ```bash
        npx create-tailwind-type --no-docs
        ```

### `-a, --arbitrary-value` / `-A, --no-arbitrary-value`

Toggles support for arbitrary value template generation in the output types.

- **Default:** Disabled (`false`)
- **Examples:**
    - To enable generated arbitrary value template types:
        ```bash
        npx create-tailwind-type --arbitrary-value
        npx create-tailwind-type -a
        ```
    - To keep them disabled explicitly:
        ```bash
        npx create-tailwind-type --no-arbitrary-value
        npx create-tailwind-type -A
        ```

### `-s, --soft-variants` / `-S, --no-soft-variants`

Controls slash modifier variant template shape when `--enable-variants` is set.
Soft mode generates broader templates such as
`ring-${string}/${number}`. Exact mode generates templates from known class
groups instead.

- **Default:** Soft mode is enabled (`true`), but slash modifier variant
  generation is disabled unless `--enable-variants` is set.
- **Examples:**
    - To enable soft slash modifier templates:
        ```bash
        npx create-tailwind-type --enable-variants --soft-variants
        npx create-tailwind-type --enable-variants -s
        ```
    - To enable exact slash modifier templates:
        ```bash
        npx create-tailwind-type --enable-variants --no-soft-variants
        npx create-tailwind-type --enable-variants -S
        ```

### `-k, --string-kind-variants-only`

Limits the generated types to only string kind variants, which might be preferred in certain setups.

- **Default:** `false`
- **Example:**
    ```bash
    npx create-tailwind-type --string-kind-variants-only
    npx create-tailwind-type -k
    ```

### `-o, --optional-property`

Instructs the CLI to generate optional properties within the TypeScript definitions.

- **Default:** `false`
- **Example:**
    ```bash
    npx create-tailwind-type --optional-property
    npx create-tailwind-type -o
    ```

### `--enable-variants` / `-N, --disable-variants`

Toggles generated slash modifier variant template types such as
`ring-${string}/${number}`.

- **Default:** Slash modifier variant generation is disabled.
- **Examples:**
    - To enable slash modifier variant templates:
        ```bash
        npx create-tailwind-type --enable-variants
        ```
    - To keep them disabled explicitly:
        ```bash
        npx create-tailwind-type --disable-variants
        npx create-tailwind-type -N
        ```

## Usage Examples

### Basic Usage (with defaults)

Generate types using all the default settings:

```bash
npx create-tailwind-type
```

This creates `tailwind.ts` and `tailwind_literal.ts`.

### Specify a Custom Base Directory and Output Filename

Use a custom directory for Tailwind CSS files and specify a custom filename:

```bash
npx create-tailwind-type --base ./custom --filename customTypes.ts
npx create-tailwind-type -b ./custom -f customTypes.ts
```

### Disable Documentation

Generate types without documentation comments. Arbitrary value template types
are already disabled by default.

```bash
npx create-tailwind-type --no-docs
npx create-tailwind-type -D
```

### Enable Arbitrary Value Template Types

Generate additional arbitrary value template types such as `bg-[${string}]`.
This is opt-in because it can increase TypeScript resource usage.

```bash
npx create-tailwind-type --arbitrary-value
npx create-tailwind-type -a
```

### Enable Exact Slash Modifier Variants and Optional Properties

Enable slash modifier variant generation, use exact modifier templates, and
produce optional properties in the types:

```bash
npx create-tailwind-type --enable-variants --no-soft-variants --optional-property
npx create-tailwind-type --enable-variants -S -o
```
