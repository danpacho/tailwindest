<br />

# 🛠️ API Reference

Api reference of `tailwindest`

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

-   type: `Tailwindest` or generic `T`
-   usage: Define tailwind style

### Example

```ts
const center = wind({
    display: "flex",
    alignItems: "items-center",
    justifyContent: "justify-center",
})
```

### 3. Returns

-   `class` - returns className `string`

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

-   `style` - returns input stylesheet `object`

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
    const _baseStyle = {
        display: "flex",
        alignItems: "items-center",
    }
    ```

-   `compose` - **compose** `stylesheet` `object`

    ### Usage

    ```ts
    wind(style).compose(...styles)
    ```

    ### Parameter: `...styles`

    -   type: `Array<Tailwindest>` or generic `T[]`
    -   usage: compose `...styles` into one `stylesheet` `object`

    ### Example

    1. Define compose target stylesheet

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
        const _boxClass = "flex items-center justify-center border border-gray-50 rounded-sm bg-white"

        const boxStyle = box.style()
        const _boxStyle = {
            display: "flex",
            alignItems: "items-center",
            justifyContent: "justify-center",
            borderWidth: "border",
            borderColor: "border-gray-50",
            borderRadius: "rounded-sm",
            backgroundColor: "bg-white",
        }
        ```

---

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
-   usage: Define type of variants name

### Example

1.  list of `string`

```ts
const button = wind$(
    "warning",
    "pending",
    "disabled",
    "success"
)(/* variant style */)
```

2. `Array<string> as const` with _**spread (...string[]) operator**_

```ts
const buttonVariants = ["warning", "pending", "disabled", "success"] as const

const button = wind$(...buttonVariants)(/* variant style */)
```

### Parameter: `style`

-   type: `Tailwindest` or generic `T`
-   usage: Define **base** or **common** `stylesheet` of variants

### Example

첫번째 stylesheet인자는 2가지 사용방법이 있습니다.

1.  기본 variant style로 사용

    > **`default` variant를 명시적으로 정의하지 않은 경우**

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

2.  공통 style로 사용

    > **`default` variant를 명시적으로 정의한 경우**

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

    > **Note**
    >
    > `defaultVariant`를 설정하면?
    >
    > `variant`의 기본 인자로 `defaultVariant`가 설정됩니다.
    >
    > ```ts
    > const defaultButtonClass = button.class("default")
    > const defaultButtonClass = button.class()
    > // same
    >
    > const defaultButtonStyle = button.style("default")
    > const defaultButtonStyle = button.style()
    > // same
    > ```

## 3. Returns

_internally `wind` and `wind$` share same core function._

-   `class` - returns className `string`

    ### Usage

    ```ts
    wind$(...variantNames)(style, variantsStyles).class()
    ```

    > Argument will be typed as given variants `string` `literal` type

    ### Example

    ```ts
    const defaultButtonClass = button.class()

    const warningButtonClass = button.class("warning")

    const successButtonClass = button.class("success")
    ```

-   `style` - returns input `stylesheet` `object`

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

-   `compose` - **compose** `stylesheet` `object`

`wind`의 `compose`와 동일한 기능을 수행합니다.

> **Note** 💡
>
> **variant input을 제공받는 경우**, 해당 variant의 stylesheet이 우선순위에 있다는 것을 기억하세요!
>
> ```ts
> const displayGrid = wind({
>     display: "grid",
> })
>
> const variant = wind$("displayFlex")(
>     {},
>     {
>         displayFlex: {
>             display: "flex",
>         },
>     }
> ).compose(displayGrid.style())
>
> const willBeFlex = variant.style("displayFlex")
> const _willBeFlex = {
>     display: "flex",
> }
> ```
>
> `display`는 variant `"displayFlex"`의 "flex"값이 도출됩니다.
>
> 즉 variant의 `stylesheet`이 `compose`의 `stylesheet`를 덮어씁니다!

---

# `createVariants`

## Briefly

복잡한 variants style를 구현하고 싶은 경우에 사용합니다.

## 1. Type Definition

```ts
declare const createVariants: <T extends VariantsStyle>(
    variantsStyle: T
) => (variantsOption: VariantsKeys<T>) => string
```

## 2. Spec - complex variants

### Usage

```ts
createVariants(variantsStyle)(variantsOption)
```

### Parameter: `variantsStyle`

-   type: `Record<string, Tailwindest>` or generic `Record<string, T>`
-   usage: Define complex variants style

### Parameter: `variantsOption`

-   type: `VariantsKeys<T>`
-   usage: Get specific variant combination

### Example

> **Note**🍀
>
> variants를 **작은 단위로 쪼개서** 합성하는 방식을 사용하세요.
>
> 마치 레고 블럭처럼 스타일을 조립할 수 있습니다.

아래 예제에서는 **size**와 **color** variant를 가지는 버튼을 만들어봅니다.

1.  **size** variants 정의

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

2.  **color** variants 정의

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

3.  **color**, **size** variants를 합성하는 스타일 생성

    ```ts
    const btn = createVariants({
        size: btnSize,
        color: btnColor,
    })
    ```

    > **Note**
    >
    > **color, size variants 조합 갯수**
    >
    > = [3 + (1 = 인자를 제공하지 않는 경우)] X [2 + (1 = 인자를 제공하지 않는 경우)]
    >
    > = 4 X 3 = 12 (가지)

4.  variants 지정하기

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
    if (btnMd === btnDefault) {
        const weAreSame =
            "border rounded p-2 text-black bg-white border-gray-100"
    }
    ```

## 3. Returns

variant class `string`

---

# `mergeProps`

## Briefly

**`stylesheet` `object`를 병합**하고 싶은 경우 사용합니다.

prop으로 특정 스타일을 유연하게 변경할 수 있게 만들때 유용합니다.

## 1. Type definition

```ts
declare const mergeProps: <T>(baseStyle: T, styleProps: T) => string
```

## 2. Spec

### Usage

```ts
mergeProps(baseStyle, styleProps)
```

### Parameter: `baseStyle`

-   type: generic `T`
-   usage: default style for merge targets

### Parameter: `styleProps`

-   type: generic `T`
-   usage: if the key of `styleProps` is equal to the key of `baseStyle`, the value of `styleProps` is overwritten

### Example

`Text` component가 **font size**를 유동적으로 변경하는 props를 받는 예제입니다.

먼저 기본적인 text style을 정의하겠습니다.

```tsx
const text = wind({
    color: "text-black",
    fontSize: "text-base",
    fontWeight: "font-medium",
}).style()
```

`text`는 `stylesheet` `object`입니다.

이제 **가변적인 font size**를 가질 수 있는 Text component를 정의해보겠습니다.

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

이제 Text component는 `size` props를 통해 font size를 자유롭게 조정할 수 있습니다.

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

---

# `Tailwindest`

## Briefly

`tailwind.config.js`에 정의된 custom value가 추가된 타입을 제작할 때 사용합니다. 혹은 props로 전달할 타입을 pick할 때 사용합니다.

## 1. Type definition

```ts
type Tailwindest<
    TailwindCustom extends TailwindGlobalPlugOption = TailwindDefaultGlobalPlugOption,
    CustomExtends extends TailwindStylePlugOption = TailwindDefaultStylePlug
> = TailwindCustom["screens"] extends Record<string, unknown>
    ? Partial<
          TailwindestTypeSet<
              TailwindWithOption<TailwindCustom, CustomExtends>,
              TailwindestNestKey<TailwindCustom["screens"]>,
              TailwindCustom["screens"]
          >
      >
    : Partial<
          TailwindestTypeSet<
              TailwindWithOption<TailwindCustom, CustomExtends>,
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

    ```ts
    Tailwindest<TailwindCustom, CustomExtends>
    ```

### Generic Parameter: `TailwindCustom`

-   type: all property is **optional**
    ```ts
    type TailwindCustom = {
        color: TailwindCustom
        opacity: TailwindCustom
        sizing: TailwindCustom
        screens: {
            conditionA: BreakConditionA
            conditionB: BreakConditionB
            // ...condition C to Z
        }
    }
    ```
-   usage: add global property

    -   `color`: font color, background color, border color, ring color, ...etc
    -   `opacity`: opacity of all color. (bg-gray-100/15 ...etc)
    -   `sizing`: padding, margin, ...etc,
    -   `screens`: break condition like `@md`, `@lg`, ...etc,

        > **Warning**
        >
        > `screens` type
        >
        > ```ts
        > screens: {
        >     conditionA: BreakConditionA
        >     conditionB: BreakConditionB
        >     // ...condition C to Z
        > }
        > ```
        >
        > All condition **SHOULD BE** **ONLY ONE** `string literal union`
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
        > ❌ **DON'T DO LIKE THIS**
        >
        > ```ts
        > screens: {
        >     conditionA: "@don_t" | "@do_this" | "@plz"
        > }
        > ```

### Generic Parameter: `CustomExtends`

-   type: all property is **optional**

    ```ts
    type CustomExtends = {
        columns: Custom
        animation: Custom
        aspectRatio: Custom
        backdropBlur: Custom
        backdropBrightness: Custom
        backdropContrast: Custom
        backdropGrayscale: Custom
        backdropHueRotate: Custom
        backdropInvert: Custom
        backdropOpacity: Custom
        backdropSaturate: Custom
        backdropSepia: Custom
        backgroundColor: Custom
        backgroundImage: Custom
        backgroundPosition: Custom
        backgroundSize: Custom
        blur: Custom
        brightness: Custom
        borderColor: Custom
        borderRadius: Custom
        borderSpacing: Custom
        borderWidth: Custom
        boxShadow: Custom
        boxShadowColor: Custom
        caretColor: Custom
        accentColor: Custom
        contrast: Custom
        content: Custom
        cursor: Custom
        divideColor: Custom
        divideWidth: Custom
        dropShadow: Custom
        fill: Custom
        grayscale: Custom
        hueRotate: Custom
        invert: Custom
        flex: Custom
        flexBasis: Custom
        flexGrow: Custom
        flexShrink: Custom
        fontFamily: Custom
        fontSize: Custom
        fontWeight: Custom
        gap: Custom
        gradientColorStops: Custom
        gridAutoColumns: Custom
        gridAutoRows: Custom
        gridColumn: Custom
        gridColumnEnd: Custom
        gridColumnStart: Custom
        gridRow: Custom
        gridRowStart: Custom
        gridRowEnd: Custom
        gridTemplateColumns: Custom
        gridTemplateRows: Custom
        height: Custom
        inset: Custom
        letterSpacing: Custom
        lineHeight: Custom
        listStyleType: Custom
        margin: Custom
        maxHeight: Custom
        maxWidth: Custom
        minHeight: Custom
        minWidth: Custom
        objectPosition: Custom
        opacity: Custom
        order: Custom
        padding: Custom
        outlineColor: Custom
        outlineOffset: Custom
        outlineWidth: Custom
        ringColor: Custom
        ringOffsetColor: Custom
        ringOffsetWidth: Custom
        ringWidth: Custom
        rotate: Custom
        saturate: Custom
        scale: Custom
        scrollMargin: Custom
        scrollPadding: Custom
        sepia: Custom
        skew: Custom
        space: Custom
        stroke: Custom
        strokeWidth: Custom
        textColor: Custom
        textDecorationColor: Custom
        textDecorationThickness: Custom
        textUnderlineOffset: Custom
        textIndent: Custom
        transformOrigin: Custom
        transitionDelay: Custom
        transitionDuration: Custom
        transitionProperty: Custom
        transitionTimingFunction: Custom
        translate: Custom
        width: Custom
        willChange: Custom
        zIndex: Custom
    }
    ```

-   usage:
    -   add specific property
    -   `Custom` is `string literal union`

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

---

# `createWind`

## Briefly

`tailwind.config.js`에 정의된 custom value이 추가된 `wind` 및 `wind$` 함수를 제작하고 싶은경우 사용합니다.

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
createWind<CustomTailwindestType>()
```

### Generic Parameter: `CustomTailwindestType`

-   type: customized `Tailwindest`
-   usage: plug customized tailwind type in `wind` and `wind$`

### Example

1. Define customized `Tailwindest`

```ts
type MyCustom = Tailwindest<{
    color: "my-color-1" | "my-color-2" | "my-color-3"
}>
```

2. Plug type at the `createWind` generic `CustomTailwindestType`

```ts
const { wind, wind$ } = createWind<MyCustom>()
```

3. Export with different name

```ts
const { wind: tw, wind$: tw$ } = createWind<MyCustom>()

export { tw, tw$ }
```

4. Import customized `wind`(`tw`) and `wind$`(`tw$`) and use it

> functionality of returned `tw` and `tw$` is same as `wind` and `wind$`.

-   `tw`: export name you want to.

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

-   `tw$`: export name you want to.

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

# `WindVariants`

## Briefly

`wind$` 와 `createVariants`의 **variant type을 추출하고 싶은 경우**에 사용합니다.

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

-   type: `typeof` `wind$` and `createWind` instance
-   usage: extract variant type

### Example

-   extract `wind$` instance's variant type

    1. Make instance of `wind$`

        ```ts
        const button = wind$("default", "warning", "success")(/* ... */)
        ```

    2. Extract variants type

        ```ts
        type ButtonVariants = WindVariants<typeof button>

        type ButtonVariants = "default" | "warning" | "success"
        ```

-   extract `createVariants` instance's variant type

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

        type ButtonVariants = {
            state: "default" | "warning" | "success"
            size: "sm" | "md" | "lg"
        }
        ```

    3. Plug to prop types

        ```tsx
        const Button = (props: React.PropsWithChildren<ButtonVariants>) => {
            const { children, ...btnOption } = props

            return (
                <button className={button(btnOption)}>{props.children}</button>
            )
        }
        ```
