<br />

## Build type-safe tailwindcss product

<div align="center">
<img src="./images/tailwindest-banner.png" width="550px" alt="tailwindest banner" />
</div>

<br />

### 1. Create tailwind types

```bash
npx create-tailwind-type -A # disable arbitrary values
```

### 2. Install package

```bash
npm i tailwindest@latest
```

### 3. Create tools

```ts
import { createTools, type CreateTailwindest } from "tailwindest"
import type { Tailwind, TailwindNestGroups } from "./tailwind"
import { twMerge } from "tailwind-merge"

export const tw = createTools<
    CreateTailwindest<{
        tailwind: Tailwind
        tailwindNestGroups: TailwindNestGroups
        groupPrefix: "$" // prefix for nest groups, [optional]
    }>
>({
    merger: twMerge, // set tailwind-merge as merger, [optional]
})
```

## Create Tailwind Type

Generate TypeScript definitions for your Tailwind CSS configuration.

<div align="center">
<img src="./images/create-tailwind-type-banner.png" width="550px" alt="tailwindest banner" />
</div>

```bash
npx create-tailwind-type
```

> [!IMPORTANT]  
> **Requires Tailwind CSS v4.0.0 or higher.**

### CLI Options

| Option (Short) | Option (Long)                 | Description                                                                                                                                               | Default Value          |
| -------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `-b`           | `--base <path>`               | Specifies the base directory to locate Tailwind CSS files. If omitted, the tool automatically resolves to the installed `@tailwindcss` package directory. | _None_ (auto-resolved) |
| `-f`           | `--filename <filename>`       | Sets the output filename for the generated types.                                                                                                         | `tailwind.ts`          |
| `-d`           | `--docs`                      | Enables documentation comments in the generated types. Use the inverse flag to disable them.                                                              | `true`                 |
| `-D`           | `--no-docs`                   | Disables documentation comments in the generated types.                                                                                                   | N/A                    |
| `-a`           | `--arbitrary-value`           | Allows the generation of arbitrary values in the output types. Use the inverse flag to disable this feature.                                              | `true`                 |
| `-A`           | `--no-arbitrary-value`        | Disables arbitrary value generation.                                                                                                                      | N/A                    |
| `-s`           | `--soft-variants`             | Enables soft variant generation. When disabled (using the inverse flag), the tool will generate exact variants instead.                                   | `true`                 |
| `-S`           | `--no-soft-variants`          | Disables soft variant generation (resulting in exact variant generation).                                                                                 | N/A                    |
| `-k`           | `--string-kind-variants-only` | Limits the generated types to only string kind variants.                                                                                                  | `false`                |
| `-o`           | `--optional-property`         | Generates optional properties in the output types, which can be useful for partial configurations.                                                        | `false`                |
| N/A            | `--version`                   | Displays the current CLI version.                                                                                                                         | N/A                    |
| N/A            | `--help`                      | Displays help and usage information for the CLI tool.                                                                                                     | N/A                    |
