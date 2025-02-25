<br />

## Tailwindest

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
