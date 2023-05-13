<br />

<div align="center">
<img src="./images/tailwindest.banner.png" width="750px" alt="tailwindest banner" />
</div>

<br />

# Start with documentation

**[Let's dive in 🏄‍♂️](https://tailwindest.vercel.app)**

<br />

# Overview

## 1. Define styling tools

```ts
import { createTools, type Tailwindest } from "tailwindest"

export const tw = createTools<Tailwindest>()
```

## 2. Styling tools

### A. Define style - `style`

```tsx
// Define style sheet
const box = tw.style({
    display: "flex",
    alignItems: "items-center",
    justifyContent: "justify-center",

    paddingX: "px-[2.25px]",
    paddingY: "py-1",

    borderColor: "border-transparent",
    borderBottomWidth: "border-b",

    backgroundColor: "bg-transparent",

    transition: "transition",
    transitionDuration: "duration-75",

    ":hover": {
        opacity: "hover:opacity-90",
    },
})

// Use it in component
const Box = ({ children }) => <div className={box.class}>{children}</div>
```

### B. Conditional styling - `toggle`

If you want to change the style based on a **single `boolean` condition**, use `toggle`.

```tsx
// Define toggle style
const themeBtn = tw.toggle({
    truthy: {}, // 🌝 light mode
    falsy: {}, // 🌚 dark mode
    base: {}, // [optional] base style
})

// Use it in component
const ThemeBtn = ({ children }) => {
    const [isLight, setIsLight] = useState(false)
    return <button className={themeBtn.class(isLight)}>{children}</button>
}
```

### C. Conditional styling - `rotary`

If you need to change styles based on **three or more conditions within a single category**, use `rotary`.

```tsx
// Define rotary style
const btn = tw.rotary({
    default: {},
    success: {},
    warning: {},
    base: {}, // [optional] base style
})

// Get rotary type with GetVariants
interface BtnProps {
    onClick: () => void
    children: ReactNode
    type?: GetVariants<typeof btn>
}

// Use it in component
const Btn = ({ onClick, children, type = "default" }: BtnProps) => (
    <button className={btn.class(type)} onClick={onClick}>
        {children}
    </button>
)
```

### D. Conditional styling - `variants`

Use `variants` for **combinations of rotary**, where **each style condition is defined within several categories**.

```tsx
// Define variants style
const btn = tw.variants({
    variants: {
        type: {
            default: {},
            success: {},
            warning: {},
        },
        size: {
            sm: {},
            md: {},
            lg: {},
        },
    },
    base: {}, // [optional] base style
})

// Get variants type with GetVariants
interface BtnProps extends GetVariants<typeof btn> {
    onClick: () => void
    children: ReactNode
}

// Use it in component
const Btn = ({
    children,
    size = "md",
    type = "default",
    onClick,
}: BtnProps) => (
    <button className={btn.class({ size, type })} onClick={onClick}>
        {children}
    </button>
)
```

### E. Utility - `mergeProps`

Use it for merging input `styleSheet`.

```tsx
const text = tw.style({
    color: "text-gray-950",
    fontWeight: "font-bold",
    fontSize: "text-base/normal",
    "@dark": {
        color: "dark:text-gray-100",
    },
})

const Text = ({
    children,
    ...option
}: PropsWithChildren<Pick<Tailwindest, "color" | "fontWeight">>) => {
    return (
        <p
            className={tw.mergeProps(
                text.style,
                option // override color and fontWeight
            )}
        >
            {children}
        </p>
    )
}
```

<br />

# Features

1. Type-safe `tailwind`
2. Supports all platforms
3. Tiny bundle size, `748B`
4. Elegant conditional styling
5. `tailwind` document link embedded
6. Support custom type, defined in `tailwind.config.js`
7. Performant

<br />

# LICENSE

<strong><p style="color:teal">MIT</p></strong>
