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
npx tailwindest-css-transform src/pages --recursive

# Preview changes without modifying files
npx tailwindest-css-transform src --dry-run
```

## CLI Options

| Option        | Alias | Default | Description                                    |
| :------------ | :---- | :------ | :--------------------------------------------- |
| `--recursive` | `-r`  | `false` | Recursively transform files in subdirectories. |
| `--dry-run`   | `-d`  | `false` | Preview changes without modifying files.       |
| `--exclude`   | `-e`  | `[]`    | List of patterns or directories to exclude.    |
| `--version`   | `-V`  | -       | Output the version number.                     |
| `--help`      | `-h`  | -       | Display help for command.                      |

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
