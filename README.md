<br />

<div align="center">

<img src="./images/tailwindest.banner.svg" width="550" alt="tailwindest banner" />

</div>

<br />

# Design Goals

> **_Readable_** / **_Reusable_** / **_Flexible_**
>
> **_TypeSafe_** **`tailwind`**

<br />

# Recommended for

1. Fully **typed** **`tailwind`**
2. Build **design system with** **`tailwind`**
3. **CSS in TS like syntax** lover
4. **Typescript** lover
5. **Refactoring** lover

<br />

# Worth it?

## 🏛️ Fully typed

> **Autocompleted** by **`typescript`**, **`tailwind`** is literally insane.

## 💅 Similar to CSS in TS

> Syntax is **very similar to CSS in TS**, meaning **easy to start.**

## 🔮 Variants

> **Variants based conditional styling**, inspired by **`stitches`** & **`vanilla-extract`.**
>
> Practical and Intuitive.

## 🧬 Official Document

> **Hover** the property, you will **get document** **`link`.**
>
> <img src="./images/docs.png" width="420" />

## 🍦 Atomic Size

> Gzip, **`603B`** **_tiny_ library**.
>
> Don’t worry about bundle size.

## 🔌 Custom value? Yeas

> **Support extended custom values**, defined in **`tailwind.config.js`**

## 🤯 Infinite Nest Break Condition

> **Don't write _repeated_ break conditions. Just autocomplete it.**
>
> ```ts
> const ohMyNest = wind({
>     backgroundColor: "bg-red-800",
>     ":hover": {
>         backgroundColor: "hover:bg-red-700",
>         borderColor: "hover:border-red-900",
>         ":active": {
>             backgroundColor: "hover:active:bg-red-500",
>             borderColor: "hover:active:border-red-500",
>             // nest never ends here 🤓...
>             // next nest will be exclude ':hover' | ':active'
>         },
>     },
>
>     "@dark": {
>         backgroundColor: "dark:bg-red-100",
>         borderColor: "dark:border-red-300",
>         ":hover": {
>             backgroundColor: "dark:hover:bg-red-200",
>             borderColor: "dark:hover:border-red-400",
>             ":active": {
>                 backgroundColor: "dark:hover:active:bg-red-500",
>                 borderColor: "dark:hover:active:border-red-500",
>             },
>             // nest never ends here too 🤯...
>             // next nest will be exclude '@dark' | ':hover' | ':active'
>         },
>     },
> })
> ```
>
> Do you still want normal `className`?
>
> ```ts
> const ohMyClassName =
>     "bg-red-800 hover:bg-red-700 hover:border-red-900 hover:active:bg-red-500 hover:active:border-red-500 dark:bg-red-100 dark:border-red-300 dark:hover:bg-red-200 dark:hover:border-red-400 dark:hover:active:bg-red-500 dark:hover:active:border-red-500"
> ```
>
> I don't want it.

## 🌈 Independency of platform

> `Tailwindest` is **just a string generator**.
>
> This means that it is **compatible with any library or framework**.
> Even _Vanilla JavaScript_ doesn't matter!

## 🔥 Combine Power of Inline & Tailwindest

> **Short / Simple style**
> = pure **`inline class`**
>
> **Complex / Conditional style**
> = **`tailwindest`**

<br />

# Boot up, in 3s

```bash
pnpm i tailwindest
```

<br />

# Deep dive
