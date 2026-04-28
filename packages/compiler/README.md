# @tailwindest/compiler

<div align="center">
<img src="../../images/tailwindest-compiler.png" width="550px" alt="tailwindest-compiler-banner" />
</div>

Zero-runtime CSS-in-JS compiler for Tailwindest.

## Public Modules

### `@tailwindest/compiler`

Programmatic compiler and deterministic evaluator APIs.

```ts
import { compile } from "@tailwindest/compiler"

const result = compile(source, {
    fileName: "/repo/src/button.tsx",
    mode: "strict",
    sourceMap: true,
})
```

### `@tailwindest/compiler/vite`

Vite plugin pair for JavaScript transformation and Tailwind CSS v4
`@source inline()` manifest injection.

```ts
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import { tailwindest } from "@tailwindest/compiler/vite"

export default defineConfig({
    plugins: [
        tailwindest({ mode: "strict", debug: true, sourceMap: true }),
        tailwindcss(),
    ],
})
```

The package intentionally exports only these two public modules. Internal
analyzer, transform, and Tailwind manifest modules are not part of the npm API
surface.

## Nested Variants

Nested Tailwind variant keys in `tw.style()` objects are canonical syntax:

```ts
tw.style({
    dark: {
        backgroundColor: "bg-red-900",
        hover: { backgroundColor: "bg-red-950" },
    },
    backgroundColor: "bg-red-50",
}).class()
// "dark:bg-red-900 dark:hover:bg-red-950 bg-red-50"
```

Nested Tailwind variant keys are canonical syntax. Explicitly prefixed class
strings remain valid and are not double-prefixed, but tests must prefer nested
variant syntax for new fixtures.
