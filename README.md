<br />

<div align="center">
<img src="./images/tailwindest.banner.png" width="700px" alt="tailwindest banner" />
</div>

<br />
<br />

# Start with documentation

**[Let's dive in 🏄‍♂️](https://tailwindest.vercel.app)**

<br />

# Overview

## 1. Define style functions

```ts
import { createWind, type Tailwindest } from "tailwindest"

const { wind, wind$ } = createWind<Tailwindest>()
```

<br />

## 2. Make complex `tailwind` style

```ts
const themeBtn = wind$("dark", "light")(
    {
        position: "absolute",
        top: "top-4",
        right: "right-4",

        display: "flex",
        alignItems: "items-center",
        justifyContent: "justify-center",

        paddingX: "px-[2.25px]",
        paddingY: "py-1",

        borderColor: "border-transparent",
        borderBottomWidth: "border-b",

        backgroundColor: "bg-transparent",
        ":hover": {
            opacity: "hover:opacity-75",
        },

        transition: "transition",
    },
    {
        dark: {
            color: "text-white",
            ":hover": {
                borderColor: "hover:border-gray-200/50",
            },
        },
        light: {
            color: "text-black",
            ":hover": {
                borderColor: "hover:border-gray-800",
            },
        },
    }
)
```

<br />

## 3. Use it in components

> `tailwindest` is just a function that generates classnames like `clsx`, meaning it's **platform independent** 🏖️.

### React

```tsx
// themeBtn style is here

const ThemeButton = () => {
    const [isDark, setIsDark] = useState(true)

    return (
        <button
            className={themeBtn.class(isDark ? "dark" : "light")}
            onClick={() => setIsDark((mode) => !mode)}
        >
            {isDark ? "dark" : "light"}
        </button>
    )
}
```

## Svelte

```tsx
<script>
    /* themeBtn style is here */

    let isDarkMode = false;
</script>

<button
    class={themeBtn.class(isDarkMode ? "dark" : "light")}
    on:click={() => {
        isDarkMode = !isDarkMode
    }}
>
    {isDarkMode ? "light" : "dark"}
</button>
```

## Vanilla Js

```js
/* themeBtn style is here */

const btn = document.getElementById("themeBtn")

let isDarkMode = false

btn.classList.add(themeBtn.class(isDarkMode ? "dark" : "light"))
```

<br />

# Features

1. Fully-typed `tailwind`
2. Support custom type
3. Level up conditional styling with variants API
4. Tiny bundle size, `638B`
5. Performant
6. Document link embedded
7. Platform free

<br />

# LICENSE

MIT
