## Create tailwind type

```bash
npx create-tailwind-type
```

> Note : support after tailwindcss `v4.0.0`

## CLI Options

| Option (Short) | Option (Long)                     | Description                              | Default Value                         | Effect When Present          | Example Usage                          |
| -------------- | --------------------------------- | ---------------------------------------- | ------------------------------------- | ---------------------------- | -------------------------------------- |
| `-b`           | `--base <path>`                   | Base directory for Tailwind CSS files    | None (resolves to `@tailwindcss` dir) | Sets custom base directory   | `npx create-tailwind-type -b ./custom` |
| `-f`           | `--filename <filename>`           | Output filename for generated types      | `tailwind.ts`                         | Sets custom output filename  | `npx create-tailwind-type -f types.ts` |
| `-d`           | `--use-docs`                      | Generate types with documentation        | `true`                                | Enables documentation        | `npx create-tailwind-type -d`          |
| `-D`           | `--no-docs`                       | Disable documentation in generated types | N/A                                   | Disables documentation       | `npx create-tailwind-type -D`          |
| `-e`           | `--use-exact-variants`            | Use exact variant generation             | `false`                               | Enables exact variants       | `npx create-tailwind-type -e`          |
| `-a`           | `--use-arbitrary-value`           | Allow arbitrary value generation         | `true`                                | Enables arbitrary values     | `npx create-tailwind-type -a`          |
| `-A`           | `--no-arbitrary-value`            | Disallow arbitrary value generation      | N/A                                   | Disables arbitrary values    | `npx create-tailwind-type -A`          |
| `-s`           | `--use-soft-variants`             | Enable soft variant generation           | `true`                                | Enables soft variants        | `npx create-tailwind-type -s`          |
| `-S`           | `--no-soft-variants`              | Disable soft variant generation          | N/A                                   | Disables soft variants       | `npx create-tailwind-type -S`          |
| `-k`           | `--use-string-kind-variants-only` | Use only string kind variants            | `false`                               | Enables string-only variants | `npx create-tailwind-type -k`          |
| `-o`           | `--use-optional-property`         | Generate optional properties             | `false`                               | Enables optional properties  | `npx create-tailwind-type -o`          |
| N/A            | `--version`                       | Display CLI version                      | N/A                                   | Shows version and exits      | `npx create-tailwind-type --version`   |
| N/A            | `--help`                          | Display help information                 | N/A                                   | Shows help and exits         | `npx create-tailwind-type --help`      |

### Notes

- **Boolean Options:**

    - Flags like `-d`/`--use-docs`, `-e`/`--use-exact-variants`, `-a`/`--use-arbitrary-value`, `-s`/`--use-soft-variants`, `-k`/`--use-string-kind-variants-only`, and `-o`/`--use-optional-property` set their respective options to `true` when present.
    - Inverse flags (`-D`/`--no-docs`, `-A`/`--no-arbitrary-value`, `-S`/`--no-soft-variants`) disable their counterparts when present, overriding the default or enabling flag if both are specified (e.g., `-d -D` results in `useDocs: false`).
    - If no flag is provided, the default value applies.

- **Required Tailwind Version:**
    - The CLI requires Tailwind CSS v4.0.0 or higher. If a lower version is detected, it will log an error and exit:
