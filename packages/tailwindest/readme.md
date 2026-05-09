<br />

## Tailwindest

### 1. Create tailwind types

```bash
npx create-tailwind-type
```

This creates `tailwind.ts` and `tailwind_literal.ts`.

### 2. Install package

```bash
npm i tailwindest@latest
```

### 3. Create tools

```ts
import { createTools, type CreateTailwindest } from "tailwindest"

import type { Tailwind, TailwindNestGroups } from "./tailwind"
import type { TailwindLiteral } from "./tailwind_literal"
import { twMerge } from "tailwind-merge"

export type Tailwindest = CreateTailwindest<{
    tailwind: Tailwind
    tailwindNestGroups: TailwindNestGroups
    groupPrefix: "$" // prefix for nest groups, [optional]
    useArbitrary: true // enable arbitrary values, [optional]
}>

export const tw = createTools<{
    tailwindest: Tailwindest
    tailwindLiteral: TailwindLiteral
    useArbitrary: true // enable arbitrary values, [optional]
    useTypedClassLiteral: true // enable typed class literal arguments, [optional]
}>({
    merger: twMerge, // set tailwind-merge as merger, [optional]
})
```

### 4. Use tools

#### Def - `tw.def(classList, ...styleList)`

```tsx
const condition: boolean = true

const container = tw.def(
    // 🚀 Powered by clsx
    [
        // ✅ Statically typed literals
        "flex",
        "size-fit",
        "flex-col",
        "items-center",
        "justify-center",
        "gap-y-12",

        // ✅ Arbitrary strings
        "md:flex-row md:gap-x-7",
        "lg:gap-x-24",

        // ✅ Conditional styling
        condition ? "p-3" : "p-1",

        // ✅ Array-based styling
        ["dark:text-white", "text-black"],
    ],

    // 🚀 Default merging behavior
    {
        // ✅ Record-based styling
        backgroundColor: "bg-white",
        dark: {
            backgroundColor: "dark:bg-black",
        },
    },
    {
        // ✅ Support for infinite record styling
        // Additional styles here...
    }
)

const Box = ({ children }) => <div className={container}>{children}</div>
```

#### Style - `tw.style(stylesheet)`

```tsx
const box = tw.style({
    display: "flex",
    alignItems: "items-center",
    justifyContent: "justify-center",
    padding: ["px-[2.25px]", "py-1"],
    $hover: {
        opacity: "hover:opacity-90",
    },
    $sm: {
        padding: ["sm:px-[4.5px]", "sm:py-2"],
    },
})

const Box = ({ children }) => {
    return <div className={box.class()}>{children}</div>
}

const Box2 = ({ children }) => {
    // pass arbitrary classnames
    return <div className={box.class("some-classnames")}>{children}</div>
}
```

#### Toggle - `tw.toggle({ truthy, falsy, base })`

If you want to change the style based on a **single `boolean` condition**, use `toggle`.

```tsx
const themeBtn = tw.toggle({
    truthy: {}, // › light mode
    falsy: {}, // › dark mode
    base: {}, // [optional] base style
})

const ThemeBtn = ({ children }) => {
    const [isLight, setIsLight] = useState(false)

    return <button className={themeBtn.class(isLight)}>{children}</button>
}
```

#### Rotary - `tw.rotary({ variants, base })`

If you need to change styles based on **three or more conditions within a single category**, use `rotary`.

```tsx
import { type GetVariants } from "tailwindest"

const btn = tw.rotary({
    variants: {
        success: {}, // › success
        warning: {}, // › warning
        error: {}, // › error
    },

    base: {}, // [optional] base style
})

interface BtnProps {
    onClick: () => void
    children: ReactNode
    type?: GetVariants<typeof btn>
}

const Btn = ({ onClick, children, type = "default" }: BtnProps) => (
    <button className={btn.class(type)} onClick={onClick}>
        {children}
    </button>
)
```

#### Variants - `tw.variants({ variants, base })`

```tsx
const btn = tw.variants({
    variants: {
        type: {
            default: {}, // › type.default
            success: {}, // › type.success
            warning: {}, // › type.warning
        },
        size: {
            sm: {}, // › size.sm
            md: {}, // › size.md
            lg: {}, // › size.lg
        },
        border: {
            sm: {}, // › border.sm
            md: {}, // › border.md
            lg: {}, // › border.lg
        },
    },
    base: {}, // [optional] base style
})

interface BtnProps extends GetVariants<typeof btn> {
    onClick: () => void
    children: ReactNode
}

const Btn = ({
    children,
    size = "md",
    border = "md",
    type = "default",
    onClick,
}: BtnProps) => (
    <button className={btn.class({ size, type, border })} onClick={onClick}>
        {children}
    </button>
)
```
