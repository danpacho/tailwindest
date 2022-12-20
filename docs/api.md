<br />

# 🛠️ API Reference

**Api reference** of `tailwindest`

-   [🛠️ API Reference](#️-api-reference)
-   [`wind` - basic styling](#wind---basic-styling)
    -   [Briefly](#briefly)
    -   [1. Type Definition](#1-type-definition)
    -   [2. Spec](#2-spec)
        -   [Usage](#usage)
        -   [Parameter: `style`](#parameter-style)
        -   [Example](#example)
    -   [3. Returns](#3-returns)
-   [`wind$` - conditional styling](#wind---conditional-styling)
    -   [Briefly](#briefly-1)
    -   [1. Type Definition](#1-type-definition-1)
    -   [2. Spec](#2-spec-1)
        -   [Usage](#usage-1)
        -   [Parameter: `...variantNames`](#parameter-variantnames)
        -   [Example](#example-1)
        -   [Parameter: `style`](#parameter-style-1)
        -   [Example](#example-2)
        -   [Parameter: `variantsStyles`](#parameter-variantsstyles)
        -   [Example](#example-3)
    -   [3. Returns](#3-returns-1)
-   [`createVariants`](#createvariants)
    -   [Briefly](#briefly-2)
    -   [1. Type Definition](#1-type-definition-2)
    -   [2. Spec](#2-spec-2)
        -   [Usage](#usage-2)
        -   [Parameter: `variantsStyle`](#parameter-variantsstyle)
        -   [Parameter: `variantsOption`](#parameter-variantsoption)
        -   [Example](#example-4)
    -   [3. Returns](#3-returns-2)
-   [`mergeProps`](#mergeprops)
    -   [Briefly](#briefly-3)
    -   [1. Type definition](#1-type-definition-3)
    -   [2. Spec](#2-spec-3)
        -   [Usage](#usage-3)
        -   [Parameter: `baseStyle`](#parameter-basestyle)
        -   [Parameter: `styleProps`](#parameter-styleprops)
        -   [Example](#example-5)
-   [`Tailwindest`](#tailwindest)
    -   [Briefly](#briefly-4)
    -   [1. Type definition](#1-type-definition-4)
    -   [2. Spec](#2-spec-4)
        -   [Usage](#usage-4)
        -   [Generic Parameter: `TailwindGlobal`](#generic-parameter-tailwindglobal)
        -   [Generic Parameter: `TailwindStyle`](#generic-parameter-tailwindstyle)
        -   [Example](#example-6)
-   [`createWind`](#createwind)
    -   [Briefly](#briefly-5)
    -   [1. Type definition](#1-type-definition-5)
    -   [2. Spec](#2-spec-5)
        -   [Usage](#usage-5)
        -   [Generic Parameter: `StyleType`](#generic-parameter-styletype)
        -   [Example](#example-7)
-   [`WindVariants`](#windvariants)
    -   [Briefly](#briefly-6)
    -   [1. Type definition](#1-type-definition-6)
    -   [2. Spec](#2-spec-6)
        -   [Usage](#usage-6)
        -   [Generic Parameter: `TypeofWind`](#generic-parameter-typeofwind)
        -   [Example](#example-8)

<br />

---

<br />

# `wind` - basic styling

## Briefly

Core style generator `function`, with **no variants**.

## 1. Type Definition

```ts
declare const wind: (style: Tailwindest) => {
    class: () => string
    style: () => Tailwindest
    compose: (...styles: Tailwindest[]) => {
        class: () => string
        style: () => Tailwindest
    }
}
```

## 2. Spec

### Usage

```ts
wind(style)
```

### Parameter: `style`

-   type: `Tailwindest`
-   usage: Define tailwind style

### Example

```ts
const center = wind({
    display: "flex",
    alignItems: "items-center",
    justifyContent: "justify-center",
})
```

## 3. Returns

-   `class` - returns **className `string`**

    ### Usage

    ```ts
    wind(style).class()
    ```

    ### Example

    ```ts
    const center = wind({
        display: "flex",
        alignItems: "items-center",
        justifyContent: "justify-center",
    })

    const centerClass = center.class()
    // flex items-center justify-center
    ```

-   `style` - returns input **stylesheet `object`**

    ### Usage

    ```ts
    wind(style).style()
    ```

    ### Example

    ```ts
    const base = wind({
        display: "flex",
        alignItems: "items-center",
    })

    const baseStyle = base.style()
    /*
    {
        display: "flex",
        alignItems: "items-center",
    }
     */
    ```

-   `compose` - **compose** **`stylesheet`** **`object`**

    ### Usage

    ```ts
    wind(style).compose(...styles)
    ```

    ### Parameter: `...styles`

    -   type: `Array<Tailwindest>`
    -   usage: **compose** `...styles` into **one `stylesheet`** **`object`**

    ### Example

    1. Make `wind` instances

        ```ts
        const center = wind({
            display: "flex",
            alignItems: "items-center",
            justifyContent: "justify-center",
        })

        const border = wind({
            borderWidth: "border",
            borderColor: "border-gray-50",
            borderRadius: "rounded-sm",
        })
        ```

    2. Compose all `stylesheet`

        ```ts
        const box = wind({
            backgroundColor: "bg-white",
        }).compose(center.style(), border.style())
        ```

    3. Get composed result

        ```ts
        const boxClass = box.class() =
        // "flex items-center justify-center border border-gray-50 rounded-sm bg-white"

        const boxStyle = box.style()
        /*
        {
            display: "flex",
            alignItems: "items-center",
            justifyContent: "justify-center",
            borderWidth: "border",
            borderColor: "border-gray-50",
            borderRadius: "rounded-sm",
            backgroundColor: "bg-white",
        }
         */
        ```

<br />

---

<br />

# `wind$` - conditional styling

## Briefly

Core style generator `function`, **with variants**.

## 1. Type Definition

```ts
declare const wind$: <Variant extends string>(
    ...variantNames: Variant[]
) => (
    style: Tailwindest,
    variantsStyles: VariantsStyles<Variant, Tailwindest>
) => {
    class: (variant?: VariantsList<Variant>) => string
    style: (variant?: VariantsList<Variant>) => Tailwindest
    compose: (...styles: Tailwindest[]) => {
        class: (variant?: VariantsList<Variant>) => string
        style: (variant?: VariantsList<Variant>) => Tailwindest
    }
}
```

## 2. Spec

### Usage

```ts
wind$(...variantNames)(style, variantsStyles)
```

### Parameter: `...variantNames`

-   type: `Array<string>`
-   usage: **Define type of variants name**

### Example

1.  List of **`string`** argument

```ts
const button = wind$(
    "warning",
    "pending",
    "disabled",
    "success"
)(/* variant style */)
```

2. **`Array<string> as const`** with **spread (`...string[]`) operator**

```ts
const buttonVariants = ["warning", "pending", "disabled", "success"] as const

const button = wind$(...buttonVariants)(/* variant style */)
```

### Parameter: `style`

-   type: `Tailwindest`
-   usage: Define **base** or **common** `stylesheet` of variants

### Example

The first `stylesheet` factor, `style`, has two ways of using it.

1. **Use as default _variant_ style**

    > **Note**
    >
    > **If default variant is not explicitly defined**

    ```ts
    const button = wind$("warning", "success")(
        {
            /* default button style */
        },
        {
            success: {
                /* success button style */
            },
            warning: {
                /* warning button style */
            },
        }
    )
    ```

2. **Use as a _common_ style**

    > **Note**
    >
    > **Use it, if default variant is explicitly defined**

    ```ts
    const button = wind$(
        "default",
        "warning",
        "success"
    )(
        {
            /* common button style */
        },
        {
            default: {
                /* default button style */
            },
            success: {
                /* success button style */
            },
            warning: {
                /* warning button style */
            },
            defaultVariant: "default",
        }
    )
    ```

    > **Note** What if I set `defaultVariant`?
    >
    > **The default factor for `variant` is set to `defaultVariant`**.
    >
    > ```ts
    > const defaultButtonClass1 = button.class("default")
    > const defaultButtonClass1 = button.class()
    > // defaultButtonClass1 === defaultButtonClass2
    > // same
    >
    > const defaultButtonStyle = button.style("default")
    > const defaultButtonStyle = button.style()
    > // defaultButtonStyle1 === defaultButtonStyle2
    > // same
    > ```

### Parameter: `variantsStyles`

-   type: `VariantsStyles<Variant, Tailwindest>`
-   usage: Define **variant** `stylesheet`

### Example

Define **variant** `stylesheet`

```ts
const button = wind$("warning", "success")(
    {
        // default button styles
        backgroundColor: "bg-white",
        // ...more default styles
    },
    {
        // 🔥 variant name is fully autocompleted!
        success: {
            backgroundColor: "bg-green-100",
            // ...more success variant styles
        },
        warning: {
            backgroundColor: "bg-red-100",
            // ...more warning variant styles
        },
    }
)
```

## 3. Returns

_internally `wind` and `wind$` share same core function._

-   `class` - returns **className `string`**

    ### Usage

    ```ts
    wind$(...variantNames)(style, variantsStyles).class()
    ```

    > **Note**
    >
    > Argument will be typed as given variants `string` `literal` type

    ### Example

    ```ts
    const defaultButtonClass = button.class()

    const warningButtonClass = button.class("warning")

    const successButtonClass = button.class("success")
    ```

-   `style` - returns **input `stylesheet` `object`**

    ### Usage

    ```ts
    wind$(...variantNames)(style, variantsStyles).style()
    ```

    ### Example

    ```ts
    const defaultButtonStyle = button.style()

    const warningButtonStyle = button.style("warning")

    const successButtonStyle = button.style("success")
    ```

-   `compose` - **compose `stylesheet` `object`**

    Performs the same function as `compose` in `wind`.

    > **Note** **When receiving variable input**
    >
    > **Remember that variant's `stylesheet` is the top priority!**
    >
    > ```ts
    > const displayGrid = wind({
    >     display: "grid",
    > })
    >
    > const variant = wind$("shouldBeFlex")(
    >     {},
    >     {
    >         shouldBeFlex: {
    >             display: "flex",
    >         },
    >     }
    > ).compose(displayGrid.style())
    >
    > const IamFlexMan = variant.style("shouldBeFlex")
    > /*
    > {
    >     display: "flex",
    > }
    > */
    > ```
    >
    > `display` is derived from the value of `flex` of variable in `displayFlex`
    >
    > In other words, the variable's `stylesheet` will overwrite the argument of `compose` `stylesheet`!

<br />

---

<br />

# `createVariants`

## Briefly

**If you want to implement a complex variety style**.

## 1. Type Definition

```ts
declare const createVariants: <T extends VariantsStyle>(
    variantsStyle: T
) => (variantsOption: VariantsKeys<T>) => string
```

## 2. Spec

### Usage

```ts
createVariants(variantsStyle)(variantsOption)
```

### Parameter: `variantsStyle`

-   type: `Record<string, typeof wind$>`
-   usage: **Define complex variants** style

### Parameter: `variantsOption`

-   type: `VariantsKeys<T>`
-   usage: **Get** specific **variant combination object**

### Example

> **Note**
>
> Use the method of **splitting variants into smaller units and assembling them**.
>
> You can assemble styles like **Lego blocks**.

In the example below, we will create a button with **`size`** and **`color`** variants.

1.  **size** variants

    ```ts
    const btnSize = wind$(
        "sm",
        "md",
        "lg"
    )(
        {
            borderWidth: "border",
            borderRadius: "rounded",
        },
        {
            lg: {
                padding: "p-4",
            },
            md: {
                padding: "p-2",
            },
            sm: {
                padding: "p-1",
            },
            default: "md",
        }
    )
    ```

2.  **color** variants

    ```ts
    const btnColor = wind$("red", "blue")(
        {
            color: "text-black",
            backgroundColor: "bg-white",
            borderColor: "border-gray-100",
        },
        {
            red: {
                color: "text-white",
                backgroundColor: "bg-red-400",
                borderColor: "border-red-100",
            },
            blue: {
                color: "text-white",
                backgroundColor: "bg-blue-400",
                borderColor: "border-blue-100",
            },
        }
    )
    ```

3.  Create a style that synthesizes **color**, **size** variants

    ```ts
    const btn = createVariants({
        size: btnSize,
        color: btnColor,
    })
    ```

    > **Note** **color, size variant combination count**
    >
    > = (number of color variants) X (number of size variants)
    >
    > = [3 + (1 = factor not provided)] X [2 + (1 = factor not provided)]
    >
    > = 4 X 3 = 12 (Case)

4.  variants

    ```ts
    const btnSm = btn({
        size: "sm",
    })
    // border rounded p-1 text-black bg-white border-gray-100

    const btnMdBlue = btn({
        size: "md",
        color: "blue",
    })
    // border rounded p-2 text-white bg-blue-400 border-blue-100

    const btnDefault = btn()
    const btnMd = btn({
        size: "md",
    })

    // btnMd === btnDefault, same!
    const same = "border rounded p-2 text-black bg-white border-gray-100"
    ```

## 3. Returns

combination of variant **className `string`**

<br />

---

<br />

# `mergeProps`

## Briefly

**Use this if you want to merge `stylesheet`**.

> **Note** usefulness of `mergeProps`
>
> Useful for making certain styles flexible with `prop`.

## 1. Type definition

```ts
declare const mergeProps: <T extends NestedObject>(
    baseStyle: T,
    styleProps: T
) => string
```

## 2. Spec

### Usage

```ts
mergeProps(baseStyle, styleProps)
```

### Parameter: `baseStyle`

-   type: generic `T extends NestedObject`
-   usage: default style for merge targets

### Parameter: `styleProps`

-   type: type `T` inferred as first argument type
-   usage: if the key of `styleProps` is equal to the key of `baseStyle`, the value of `styleProps` is overwritten

### Example

Applying **fontSize** after receiving `size prop` from `Text`.

First, let's define the basic text style.

```tsx
const text = wind({
    color: "text-black",
    fontSize: "text-base",
    fontWeight: "font-medium",
}).style()
```

> **Note**
>
> `text` is `stylesheet` `object`.
>
> It means that first argument of `mergeProps` should be `stylesheet` `object`.

Now let's define a `Text` that can have **variable font size**.

```tsx
interface TextProps {
    children: React.ReactNode
    // type Tailwindest is typeset of tailwindcss classnames
    size: Tailwindest["fontSize"]
}
const Text = ({ children, size = "text-base" }: TextProps) => (
    <p
        className={mergeProps(text, {
            fontSize: size,
        })}
    >
        {children}
    </p>
)
```

`Text` can now adjust the **font size** via **`size props`**.

```tsx
import { Text } from "./text"

const SomeComponent = () => (
    <>
        <Text size="text-9xl">Wow Heading 1</Text>
        <Text size="text-7xl">Wow Heading 2</Text>
        <Text>Wow Text</Text>
    </>
)
```

<br />

---

<br />

# `Tailwindest`

## Briefly

1. Use to create a type with a custom value defined in **`tailwind.config.js`**.
2. Use to **pick the `tailwind` type** for `prop` typing.

## 1. Type definition

```ts
type Tailwindest<
    TailwindGlobal extends TailwindGlobalPlugOption = TailwindDefaultGlobalPlugOption,
    TailwindStyle extends TailwindStylePlugOption = TailwindDefaultStylePlug
> = TailwindGlobal["screens"] extends Record<string, unknown>
    ? Partial<
          TailwindestTypeSet<
              TailwindWithOption<TailwindGlobal, TailwindStyle>,
              TailwindestNestKey<TailwindGlobal["screens"]>,
              TailwindGlobal["screens"]
          >
      >
    : Partial<
          TailwindestTypeSet<
              TailwindWithOption<TailwindGlobal, TailwindStyle>,
              TailwindestNestKey
          >
      >
```

## 2. Spec

### Usage

1. basic tailwind type

    ```ts
    Tailwindest
    ```

2. customized tailwind type

    > Add property at `tailwind.config.js`

    ```ts
    Tailwindest<TailwindGlobal, TailwindStyle>
    ```

### Generic Parameter: `TailwindGlobal`

-   type: all property is **[ optional ]**

    > **Note**
    >
    > type `Custom` = `string literal union`

    ```ts
    type TailwindCustom = {
        color?: Custom
        opacity?: Custom
        sizing?: Custom
        screens?: {
            conditionA?: ShouldBeOneStringLiteral
            conditionB?: ShouldBeOneStringLiteral
            // ...condition C to Z
        }
    }
    ```

-   usage: add **global property**

    -   **`color`**: font color, background color, border color, ring color, ...etc
    -   **`opacity`**: opacity of all color. (bg-gray-100/15 ...etc)
    -   **`sizing`**: padding, margin, ...etc,
    -   **`screens`**: break condition like `@md`, `@lg`, ...etc,

        > **Warning** `ShouldBeOneStringLiteral` type in `screens`
        >
        > ```ts
        > screens: {
        >     conditionA: ShouldBeOneStringLiteral
        >     conditionB: ShouldBeOneStringLiteral
        >     // ...condition C to Z
        > }
        > ```
        >
        > `ShouldBeOneStringLiteral` **SHOULD BE ONLY ONE** `string literal union` type
        >
        > ⭕️ **DO LIKE THIS**
        >
        > ```ts
        > screens: {
        >     conditionA: "@good"
        >     conditionB: "@nice"
        > }
        > ```
        >
        > if you set multiple condition in each conditions, **then typescript can't infer property exactly**.
        >
        > ❌ **DON'T DO LIKE THIS**
        >
        > ```ts
        > screens: {
        >     conditionA: "@don_t" | "@do_this" | "@plz"
        > }
        > ```

### Generic Parameter: `TailwindStyle`

-   type: all property is **[ optional ]**

    > **Note**
    >
    > type `Custom` = `string literal union`

    ```ts
    type TailwindStyle = {
        columns?: Custom
        animation?: Custom
        aspectRatio?: Custom
        backdropBlur?: Custom
        backdropBrightness?: Custom
        backdropContrast?: Custom
        backdropGrayscale?: Custom
        backdropHueRotate?: Custom
        backdropInvert?: Custom
        backdropOpacity?: Custom
        backdropSaturate?: Custom
        backdropSepia?: Custom
        backgroundColor?: Custom
        backgroundImage?: Custom
        backgroundPosition?: Custom
        backgroundSize?: Custom
        blur?: Custom
        brightness?: Custom
        borderColor?: Custom
        borderRadius?: Custom
        borderSpacing?: Custom
        borderWidth?: Custom
        boxShadow?: Custom
        boxShadowColor?: Custom
        caretColor?: Custom
        accentColor?: Custom
        contrast?: Custom
        content?: Custom
        cursor?: Custom
        divideColor?: Custom
        divideWidth?: Custom
        dropShadow?: Custom
        fill?: Custom
        grayscale?: Custom
        hueRotate?: Custom
        invert?: Custom
        flex?: Custom
        flexBasis?: Custom
        flexGrow?: Custom
        flexShrink?: Custom
        fontFamily?: Custom
        fontSize?: Custom
        fontWeight?: Custom
        gap?: Custom
        gradientColorStops?: Custom
        gridAutoColumns?: Custom
        gridAutoRows?: Custom
        gridColumn?: Custom
        gridColumnEnd?: Custom
        gridColumnStart?: Custom
        gridRow?: Custom
        gridRowStart?: Custom
        gridRowEnd?: Custom
        gridTemplateColumns?: Custom
        gridTemplateRows?: Custom
        height?: Custom
        inset?: Custom
        letterSpacing?: Custom
        lineHeight?: Custom
        listStyleType?: Custom
        margin?: Custom
        maxHeight?: Custom
        maxWidth?: Custom
        minHeight?: Custom
        minWidth?: Custom
        objectPosition?: Custom
        order?: Custom
        padding?: Custom
        outlineColor?: Custom
        outlineOffset?: Custom
        outlineWidth?: Custom
        ringColor?: Custom
        ringOffsetColor?: Custom
        ringOffsetWidth?: Custom
        ringWidth?: Custom
        rotate?: Custom
        saturate?: Custom
        scale?: Custom
        scrollMargin?: Custom
        scrollPadding?: Custom
        sepia?: Custom
        skew?: Custom
        space?: Custom
        stroke?: Custom
        strokeWidth?: Custom
        textColor?: Custom
        textDecorationColor?: Custom
        textDecorationThickness?: Custom
        textUnderlineOffset?: Custom
        textIndent?: Custom
        transformOrigin?: Custom
        transitionDelay?: Custom
        transitionDuration?: Custom
        transitionProperty?: Custom
        transitionTimingFunction?: Custom
        translate?: Custom
        width?: Custom
        willChange?: Custom
        zIndex?: Custom
    }
    ```

-   usage:
    -   add specific property

### Example

Define custom tailwind type

```ts
type MyCustom = Tailwindest<
    {
        color: "my-color-1" | "my-color-2" | "my-color-3"
        opacity: "15" | "25" | "35" | "45" | "55"
        sizing: "0.1" | "0.2" | "0.3" | "0.4" | "0.5"
        screens: {
            conditionA: "@iphone7"
            conditionB: "@ipad"
            conditionC: "@mac13"
            conditionD: "@mac14"
            conditionE: "@mac16"
            conditionF: "@imac"
        }
    },
    {
        accentColor: "my-accent-1" | "my-accent-2"
        borderRadius: "my-rad-1" | "my-rad-2"
    }
>
```

Pick specific tailwind value

-   basic type

    ```ts
    type BgColor = Tailwindest["backgroundColor"]
    ```

-   custom type

    ```ts
    type BgColor = MyCustom["backgroundColor"]
    ```

-   use picked type for typing of props

    ```tsx
    interface BoxProps {
        //...
        bg: MyCustom["backgroundColor"]
        //...
    }

    const Box = (props: BoxProps) => <div bg={props.bg}>{...}</div>
    ```

<br />

---

<br />

# `createWind`

## Briefly

**Create `wind` and `wind$` functions** with custom values defined in `tailwind.config.js`.

## 1. Type definition

```ts
declare const createWind: <StyleType>() => {
    wind$: <Variant extends string>(
        ...variantNames: Variant[]
    ) => (
        style: StyleType,
        variantsStyles: VariantsStyles<Variant, StyleType>
    ) => {
        class: (variant?: VariantsList<Variant>) => string
        style: (variant?: VariantsList<Variant>) => StyleType
        compose: (...styles: StyleType[]) => {
            class: (variant?: VariantsList<Variant>) => string
            style: (variant?: VariantsList<Variant>) => StyleType
        }
    }
    wind: (style: StyleType) => {
        class: () => string
        style: () => StyleType
        compose: (...styles: StyleType[]) => {
            class: () => string
            style: () => StyleType
        }
    }
}
```

## 2. Spec

### Usage

```ts
createWind<StyleType>()
```

### Generic Parameter: `StyleType`

-   type: generic `StyleType extends NestedObject`
-   usage: plug customized tailwind type in `wind` and `wind$`

### Example

1. Define **customized `Tailwindest`**

```ts
type MyCustom = Tailwindest<{
    color: "my-color-1" | "my-color-2" | "my-color-3"
}>
```

2. Plug type at the `createWind` generic `StyleType`

```ts
const { wind, wind$ } = createWind<MyCustom>()
```

3. Export with different name

```ts
const { wind: tw, wind$: tw$ } = createWind<MyCustom>()

export { tw, tw$ }
```

4. Import customized `wind`(`tw`) and `wind$`(`tw$`) and use it

> **Note**
>
> functionality of returned `tw` and `tw$` is same as `wind` and `wind$`.

-   `tw`: same as `wind`

    ```ts
    import { tw } from "@style/tailwindest"

    const yeas = tw({
        color: "text-my-color-1",
        backgroundColor: "bg-my-color-2",
        borderColor: "border-my-color-3",
    })

    const yeasClass = yeas.class()
    const yeasStyle = yeas.style()
    ```

-   `tw$`: same as `wind$`

    ```ts
    import { tw$ } from "@style/tailwindest"

    const yeasVar = tw$("oh")(
        {
            color: "text-my-color-1",
            backgroundColor: "bg-my-color-2",
            borderColor: "border-my-color-3",
        },
        {
            oh: {
                color: "text-my-color-2",
            },
        }
    )

    const defaultClass = yeasVar.class()
    const defaultStyle = yeasVar.style()

    const ohClass = yeasVar.class("oh")
    const ohStyle = yeasVar.style("oh")
    ```

<br />

---

<br />

# `WindVariants`

## Briefly

**Extract variants type** of instance of `wind$`, `createVariants`.

## 1. Type definition

```ts
type WindVariants<TypeofWind> = TypeofWind extends {
    style: (variants: infer Variants) => unknown
    class: (variants: infer Variants) => unknown
}
    ? Variants extends string
        ? VariantsList<Variants>
        : never
    : TypeofWind extends (VariantsOption: infer VariantsOption) => unknown
    ? VariantsOption
    : never
```

## 2. Spec

### Usage

```ts
WindVariants<TypeofWind>
```

### Generic Parameter: `TypeofWind`

-   type: generic `TypeofWind` is instance of `typeof wind$` and `createWind`
-   usage: extract variant type

### Example

-   extract instance of `wind$` variant type

    1. Make instance of `wind$`

        ```ts
        const button = wind$("default", "warning", "success")(/* ... */)
        ```

    2. Extract variants type

        ```ts
        type ButtonVariants = WindVariants<typeof button>

        type ButtonVariants = "default" | "warning" | "success"
        ```

-   extract instance of `createVariants` variant type

    1. Make instance of `createVariants`

        ```ts
        const buttonState = wind$("default", "warning", "success")(/* ... */)
        const buttonSize = wind$("sm", "md", "lg")(/* ... */)

        const button = createVariants({
            state: buttonState,
            size: buttonSize,
        })
        ```

    2. Extract variants type

        ```ts
        type ButtonVariants = WindVariants<typeof button>

        // inferred result
        type ButtonVariants = {
            state?: "default" | "warning" | "success" | undefined
            size?: "sm" | "md" | "lg" | undefined
        }
        ```

    3. Plug variants type

        ```tsx
        const Button = (props: React.PropsWithChildren<ButtonVariants>) => {
            const { children, ...btnOption } = props

            return (
                <button className={button(btnOption)}>{props.children}</button>
            )
        }
        ```
