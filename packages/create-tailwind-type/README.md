## Create Tailwind Type

Generate TypeScript definitions for your Tailwind CSS configuration.

```bash
npx create-tailwind-type
```

> [!IMPORTANT]  
> **Requires Tailwind CSS v4.0.0 or higher.**

---

## Usage Examples

- Use custom plugins

**Should change base directory to `node_modules/tailwindcss`** for your own project.

```bash
npx create-tailwind-type -b node_modules/tailwindcss
```

- Generate exact variants

**Will generate exact variants instead of soft variants.** But slowdown typescript language server, if you use it directly. (Importing subtype will be fine.)

```bash
npx create-tailwind-type -S
```

- Change output filename

**Will generate types in `src/types/tailwind.d.ts` file.**

```bash
npx create-tailwind-type -f src/types/tailwind.d.ts
```

## CLI Options

| Option (Short) | Option (Long)                 | Description                                                                                                                                                | Default Value          | Example Usage                                                                 |
| -------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------- |
| `-b`           | `--base <path>`               | Specifies the base directory for @tailwindcss/node package. If omitted, the tool automatically resolves to the installed `@tailwindcss` package directory. | _None_ (auto-resolved) | `npx create-tailwind-type -b ./custom`                                        |
| `-f`           | `--filename <filename>`       | Sets the output filename for the generated types.                                                                                                          | `tailwind.ts`          | `npx create-tailwind-type -f customTypes.ts`                                  |
| `-d`           | `--docs`                      | Enables documentation comments in the generated types. Use the inverse flag to disable them.                                                               | `true`                 | `npx create-tailwind-type` or `npx create-tailwind-type --docs`               |
| `-D`           | `--no-docs`                   | Disables documentation comments in the generated types.                                                                                                    | N/A                    | `npx create-tailwind-type --no-docs`                                          |
| `-a`           | `--arbitrary-value`           | Allows the generation of arbitrary values in the output types. Use the inverse flag to disable this feature.                                               | `true`                 | `npx create-tailwind-type` or `npx create-tailwind-type --no-arbitrary-value` |
| `-A`           | `--no-arbitrary-value`        | Disables arbitrary value generation.                                                                                                                       | N/A                    | `npx create-tailwind-type --no-arbitrary-value`                               |
| `-s`           | `--soft-variants`             | Enables soft variant generation. When disabled (using the inverse flag), the tool will generate exact variants instead.                                    | `true`                 | `npx create-tailwind-type` or `npx create-tailwind-type --no-soft-variants`   |
| `-S`           | `--no-soft-variants`          | Disables soft variant generation (resulting in exact variant generation).                                                                                  | N/A                    | `npx create-tailwind-type --no-soft-variants`                                 |
| `-k`           | `--string-kind-variants-only` | Limits the generated types to only string kind variants.                                                                                                   | `false`                | `npx create-tailwind-type --string-kind-variants-only`                        |
| `-o`           | `--optional-property`         | Generates optional properties in the output types, which can be useful for partial configurations.                                                         | `false`                | `npx create-tailwind-type --optional-property`                                |
| N/A            | `--version`                   | Displays the current CLI version.                                                                                                                          | N/A                    | `npx create-tailwind-type --version`                                          |
| N/A            | `--help`                      | Displays help and usage information for the CLI tool.                                                                                                      | N/A                    | `npx create-tailwind-type --help`                                             |

---

## Detailed Option Descriptions

### `-b, --base <path>`

Specifies a custom base directory for locating Tailwind CSS files.

- **Default:** Automatically resolves to the installed `@tailwindcss` package directory.
- **Example:**
    ```bash
    npx create-tailwind-type -b ./custom
    ```

### `-f, --filename <filename>`

Determines the output filename for the generated TypeScript types.

- **Default:** `tailwind.ts`
- **Example:**
    ```bash
    npx create-tailwind-type -f customTypes.ts
    ```

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

Toggles support for arbitrary value generation in the output types.

- **Default:** Enabled (`true`)
- **Examples:**
    - To enable (or use the default):
        ```bash
        npx create-tailwind-type --arbitrary-value
        npx create-tailwind-type -a
        ```
    - To disable:
        ```bash
        npx create-tailwind-type --no-arbitrary-value
        npx create-tailwind-type -A
        ```

### `-s, --soft-variants` / `-S, --no-soft-variants`

Manages soft variant generation. Disabling this option will instead produce exact variant types.

- **Default:** Enabled (`true`)
- **Examples:**
    - To enable soft variants (default behavior):
        ```bash
        npx create-tailwind-type --soft-variants
        npx create-tailwind-type -s
        ```
    - To disable soft variants (and generate exact variants):
        ```bash
        npx create-tailwind-type --no-soft-variants
        npx create-tailwind-type -S
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

---

## Usage Examples

### Basic Usage (with defaults)

Generate types using all the default settings:

```bash
npx create-tailwind-type
```

### Specify a Custom Base Directory and Output Filename

Use a custom directory for Tailwind CSS files and specify a custom filename:

```bash
npx create-tailwind-type --base ./custom --filename customTypes.ts
npx create-tailwind-type -b ./custom -f customTypes.ts
```

### Disable Documentation and Arbitrary Value Generation

Generate types without documentation comments and without arbitrary values:

```bash
npx create-tailwind-type --no-docs --no-arbitrary-value
npx create-tailwind-type -D -A
```

### Generate Exact Variants and Enable Optional Properties

Disable soft variants (thus generating exact variants) and produce optional properties in the types:

```bash
npx create-tailwind-type --no-soft-variants --optional-property
npx create-tailwind-type -S -o
```
