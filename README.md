# Boost up tailwindcss DX

<div align="center">

<img src="./assets/tailwindest.banner.png" width="525" alt="tailwindest banner" />

<br />
<br />

**Fully typed className package** for the **`tailwindcss`**

<br />

</div>

```ts
const helloBox = wind({
    display: "flex",
    alignItems: "items-center",
    justifyContent: "justify-center",

    padding: "p-4",
    margin: "m-4",

    borderRadius: "rounded-md",
    backgroundColor: "bg-white",
    "@dark": {
        backgroundColor: "dark:bg-neutral-900",
    },
}).class()
```

<br />

# Design Goals

> Make
> <span style="color:tomato">**_Readable_**</span> / <span style="color:tomato">**_Reusable_**</span> / <span style="color:tomato">**_Flexible_**</span>
> className

<br />

# Recommended for

1. Strictly **typed** **`tailwind`**
2. Love **css in js like syntax**
3. Make **design system with** **`tailwind`**
4. **Refactoring** lover

<br />

# Worth it?

## 🏛️ Fully typed

> **Autocompleted** by <span style="color:tomato">**`typescript`**</span>, <span style="color:tomato">**`tailwind`**</span> is literally insane.

## 💅 Similar to css in js

> Syntax is **very similar to css in js**, meaning **easy to use it.**

## 🔮 Variants

> **Variants based conditional styling**, Inspitomato by <span style="color:tomato">**`stitches`**</span> & <span style="color:tomato">**`vanilla-extract`**</span>
>
> Practical and Intuitive.

## 🧬 Official Document

> **Hover** the property, you will **get document** <span style="color:tomato">**`link`**</span>
>
> <img src="./assets/docs.png" width="420" />

## 🍦 Atomic Size

> Gzip, <span style="color:tomato">**`614B`**</span> **_tiny_ library**.
>
> Don’t worry about bundle size.

## 🔌 Custom value? Yeas.

> **Support extended custom values**, defined in <span style="color:tomato">**`tailwind.config.js`**</span>

## 🔥 Combine Power of Inline & Tailwindest

> **Short / Simple style**
> = pure <span style="color:tomato">**`inline class`**</span>
>
> **Complex / Conditional style**
> = <span style="color:tomato">**`tailwindest`**</span>

<br />

# Start

```bash
pnpm i tailwindest
```
