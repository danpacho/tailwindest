# tailwindest-css-transform

<div align="center">
<img src="../../images/tailwind-transform.png" width="550px" alt="tailwindest-transformer-banner" />
</div>

Automate your migration from standard Tailwind CSS to type-safe **Tailwindest** objects.

## Features

- **Zero-Config Migration**: Automatically detects your `tailwindest` setup (namespace, paths) from your project.
- **Smart Auto-Import**: Inserts necessary import statements into transformed files automatically.
- **Source-Safe**: Uses AST (Abstract Syntax Tree) traversal to ensure code logic remains untouched.
- **Type-Safe**: Generates objects that are 100% compatible with `tailwindest` types.

## Installation

```bash
# Run directly with npx
npx tailwindest-css-transform <target> [options]

# Or install globally
npm install -g tailwindest-css-transform
```

## Usage

```bash
# Transform a single file
npx tailwindest-css-transform src/components/Button.tsx

# Transform an entire directory recursively
npx tailwindest-css-transform src/pages

# Preview changes without modifying files
npx tailwindest-css-transform src --dry-run

# Override auto-discovered config when needed
npx tailwindest-css-transform src \
    --css src/styles/tailwind.css \
    --identifier tw \
    --module @/styles/tailwind \
    --mode runtime
```

Running `npx tailwindest-css-transform` without a target opens an interactive
prompt that asks only for the file or directory to transform. The CLI then
detects the Tailwind CSS entry, Tailwindest `createTools` export, import path,
mode, walkers, and dry-run setting.

## CLI Options

| Option                | Alias | Default        | Description                                     |
| :-------------------- | :---- | :------------- | :---------------------------------------------- |
| `--css <path>`        | `-c`  | auto-detected  | Tailwind CSS entry used to initialize Tailwind. |
| `--identifier <name>` | `-i`  | auto or `tw`   | Tailwindest import identifier.                  |
| `--module <path>`     | `-m`  | auto or `~/tw` | Tailwindest module import path.                 |
| `--dry-run`           | `-d`  | `false`        | Preview changes without modifying files.        |
| `--mode <mode>`       | -     | `auto`         | Output mode: `auto` or `runtime`.               |
| `--help`              | `-h`  | -              | Display help for command.                       |

Auto discovery uses the same Tailwind CSS root and Tailwind package resolution
helpers as `create-tailwind-type`. If a local Tailwind package is older than v4,
the CLI warns and falls back to the internal Tailwind v4 engine.

## Example

**Before:**

```tsx
const className =
    "flex items-center justify-center p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
```

**After:**

```tsx
const style = tw.def({
    display: "flex",
    alignItems: "items-center",
    justifyContent: "justify-center",
    padding: "p-4",
    backgroundColor: "bg-blue-500",
    hover: {
        backgroundColor: "hover:bg-blue-600",
    },
    color: "text-white",
    borderRadius: "rounded-lg",
    transitionProperty: "transition-colors",
})
```

---

For more details, visit our [official documentation](https://tailwindest.vercel.app/css-transformer).
