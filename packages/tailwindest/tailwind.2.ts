/**
 * Tailwind nest groups
 *
 * @see {@link https://tailwindcss.com/docs Tailwind docs}
 */
export type TailwindNestGroups =
    | "*"
    | "**"
    | "not-first"
    | "not-last"
    | "not-only"
    | "not-odd"
    | "not-even"
    | "not-first-of-type"
    | "not-last-of-type"
    | "not-only-of-type"
    | "not-visited"
    | "not-target"
    | "not-open"
    | "not-default"
    | "not-checked"
    | "not-indeterminate"
    | "not-placeholder-shown"
    | "not-autofill"
    | "not-optional"
    | "not-required"
    | "not-valid"
    | "not-invalid"
    | "not-user-valid"
    | "not-user-invalid"
    | "not-in-range"
    | "not-out-of-range"
    | "not-read-only"
    | "not-empty"
    | "not-focus-within"
    | "not-hover"
    | "not-focus"
    | "not-focus-visible"
    | "not-active"
    | "not-enabled"
    | "not-disabled"
    | "not-inert"
    | "not-in"
    | "not-has"
    | "not-aria"
    | "not-data"
    | "not-nth"
    | "not-nth-last"
    | "not-nth-of-type"
    | "not-nth-last-of-type"
    | "not-supports"
    | "not-motion-safe"
    | "not-motion-reduce"
    | "not-contrast-more"
    | "not-contrast-less"
    | "not-max"
    | "not-sm"
    | "not-md"
    | "not-lg"
    | "not-xl"
    | "not-2xl"
    | "not-min"
    | "not-@max"
    | "not-@"
    | "not-@min"
    | "not-portrait"
    | "not-landscape"
    | "not-ltr"
    | "not-rtl"
    | "not-dark"
    | "not-print"
    | "not-forced-colors"
    | "not-inverted-colors"
    | "not-pointer-none"
    | "not-pointer-coarse"
    | "not-pointer-fine"
    | "not-any-pointer-none"
    | "not-any-pointer-coarse"
    | "not-any-pointer-fine"
    | "not-noscript"
    | "not-data-open"
    | "not-data-closed"
    | "not-data-checked"
    | "not-data-unchecked"
    | "not-data-selected"
    | "not-data-disabled"
    | "not-data-active"
    | "not-data-horizontal"
    | "not-data-vertical"
    | "group-first"
    | "group-last"
    | "group-only"
    | "group-odd"
    | "group-even"
    | "group-first-of-type"
    | "group-last-of-type"
    | "group-only-of-type"
    | "group-visited"
    | "group-target"
    | "group-open"
    | "group-default"
    | "group-checked"
    | "group-indeterminate"
    | "group-placeholder-shown"
    | "group-autofill"
    | "group-optional"
    | "group-required"
    | "group-valid"
    | "group-invalid"
    | "group-user-valid"
    | "group-user-invalid"
    | "group-in-range"
    | "group-out-of-range"
    | "group-read-only"
    | "group-empty"
    | "group-focus-within"
    | "group-hover"
    | "group-focus"
    | "group-focus-visible"
    | "group-active"
    | "group-enabled"
    | "group-disabled"
    | "group-inert"
    | "group-in"
    | "group-has"
    | "group-aria"
    | "group-data"
    | "group-nth"
    | "group-nth-last"
    | "group-nth-of-type"
    | "group-nth-last-of-type"
    | "group-ltr"
    | "group-rtl"
    | "group-dark"
    | "group-data-open"
    | "group-data-closed"
    | "group-data-checked"
    | "group-data-unchecked"
    | "group-data-selected"
    | "group-data-disabled"
    | "group-data-active"
    | "group-data-horizontal"
    | "group-data-vertical"
    | "peer-first"
    | "peer-last"
    | "peer-only"
    | "peer-odd"
    | "peer-even"
    | "peer-first-of-type"
    | "peer-last-of-type"
    | "peer-only-of-type"
    | "peer-visited"
    | "peer-target"
    | "peer-open"
    | "peer-default"
    | "peer-checked"
    | "peer-indeterminate"
    | "peer-placeholder-shown"
    | "peer-autofill"
    | "peer-optional"
    | "peer-required"
    | "peer-valid"
    | "peer-invalid"
    | "peer-user-valid"
    | "peer-user-invalid"
    | "peer-in-range"
    | "peer-out-of-range"
    | "peer-read-only"
    | "peer-empty"
    | "peer-focus-within"
    | "peer-hover"
    | "peer-focus"
    | "peer-focus-visible"
    | "peer-active"
    | "peer-enabled"
    | "peer-disabled"
    | "peer-inert"
    | "peer-in"
    | "peer-has"
    | "peer-aria"
    | "peer-data"
    | "peer-nth"
    | "peer-nth-last"
    | "peer-nth-of-type"
    | "peer-nth-last-of-type"
    | "peer-ltr"
    | "peer-rtl"
    | "peer-dark"
    | "peer-data-open"
    | "peer-data-closed"
    | "peer-data-checked"
    | "peer-data-unchecked"
    | "peer-data-selected"
    | "peer-data-disabled"
    | "peer-data-active"
    | "peer-data-horizontal"
    | "peer-data-vertical"
    | "first-letter"
    | "first-line"
    | "marker"
    | "selection"
    | "file"
    | "placeholder"
    | "backdrop"
    | "details-content"
    | "before"
    | "after"
    | "first"
    | "last"
    | "only"
    | "odd"
    | "even"
    | "first-of-type"
    | "last-of-type"
    | "only-of-type"
    | "visited"
    | "target"
    | "open"
    | "default"
    | "checked"
    | "indeterminate"
    | "placeholder-shown"
    | "autofill"
    | "optional"
    | "required"
    | "valid"
    | "invalid"
    | "user-valid"
    | "user-invalid"
    | "in-range"
    | "out-of-range"
    | "read-only"
    | "empty"
    | "focus-within"
    | "hover"
    | "focus"
    | "focus-visible"
    | "active"
    | "enabled"
    | "disabled"
    | "inert"
    | "in-first"
    | "in-last"
    | "in-only"
    | "in-odd"
    | "in-even"
    | "in-first-of-type"
    | "in-last-of-type"
    | "in-only-of-type"
    | "in-visited"
    | "in-target"
    | "in-open"
    | "in-default"
    | "in-checked"
    | "in-indeterminate"
    | "in-placeholder-shown"
    | "in-autofill"
    | "in-optional"
    | "in-required"
    | "in-valid"
    | "in-invalid"
    | "in-user-valid"
    | "in-user-invalid"
    | "in-in-range"
    | "in-out-of-range"
    | "in-read-only"
    | "in-empty"
    | "in-focus-within"
    | "in-hover"
    | "in-focus"
    | "in-focus-visible"
    | "in-active"
    | "in-enabled"
    | "in-disabled"
    | "in-inert"
    | "in-in"
    | "in-has"
    | "in-aria"
    | "in-data"
    | "in-nth"
    | "in-nth-last"
    | "in-nth-of-type"
    | "in-nth-last-of-type"
    | "in-ltr"
    | "in-rtl"
    | "in-dark"
    | "in-data-open"
    | "in-data-closed"
    | "in-data-checked"
    | "in-data-unchecked"
    | "in-data-selected"
    | "in-data-disabled"
    | "in-data-active"
    | "in-data-horizontal"
    | "in-data-vertical"
    | "has-first"
    | "has-last"
    | "has-only"
    | "has-odd"
    | "has-even"
    | "has-first-of-type"
    | "has-last-of-type"
    | "has-only-of-type"
    | "has-visited"
    | "has-target"
    | "has-open"
    | "has-default"
    | "has-checked"
    | "has-indeterminate"
    | "has-placeholder-shown"
    | "has-autofill"
    | "has-optional"
    | "has-required"
    | "has-valid"
    | "has-invalid"
    | "has-user-valid"
    | "has-user-invalid"
    | "has-in-range"
    | "has-out-of-range"
    | "has-read-only"
    | "has-empty"
    | "has-focus-within"
    | "has-hover"
    | "has-focus"
    | "has-focus-visible"
    | "has-active"
    | "has-enabled"
    | "has-disabled"
    | "has-inert"
    | "has-in"
    | "has-has"
    | "has-aria"
    | "has-data"
    | "has-nth"
    | "has-nth-last"
    | "has-nth-of-type"
    | "has-nth-last-of-type"
    | "has-ltr"
    | "has-rtl"
    | "has-dark"
    | "has-data-open"
    | "has-data-closed"
    | "has-data-checked"
    | "has-data-unchecked"
    | "has-data-selected"
    | "has-data-disabled"
    | "has-data-active"
    | "has-data-horizontal"
    | "has-data-vertical"
    | "aria-busy"
    | "aria-checked"
    | "aria-disabled"
    | "aria-expanded"
    | "aria-hidden"
    | "aria-pressed"
    | "aria-readonly"
    | "aria-required"
    | "aria-selected"
    | "data"
    | "nth"
    | "nth-last"
    | "nth-of-type"
    | "nth-last-of-type"
    | "supports"
    | "motion-safe"
    | "motion-reduce"
    | "contrast-more"
    | "contrast-less"
    | "max-sm"
    | "max-md"
    | "max-lg"
    | "max-xl"
    | "max-2xl"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "min-sm"
    | "min-md"
    | "min-lg"
    | "min-xl"
    | "min-2xl"
    | "@max-3xs"
    | "@max-2xs"
    | "@max-xs"
    | "@max-sm"
    | "@max-md"
    | "@max-lg"
    | "@max-xl"
    | "@max-2xl"
    | "@max-3xl"
    | "@max-4xl"
    | "@max-5xl"
    | "@max-6xl"
    | "@max-7xl"
    | "@3xs"
    | "@2xs"
    | "@xs"
    | "@sm"
    | "@md"
    | "@lg"
    | "@xl"
    | "@2xl"
    | "@3xl"
    | "@4xl"
    | "@5xl"
    | "@6xl"
    | "@7xl"
    | "@min-3xs"
    | "@min-2xs"
    | "@min-xs"
    | "@min-sm"
    | "@min-md"
    | "@min-lg"
    | "@min-xl"
    | "@min-2xl"
    | "@min-3xl"
    | "@min-4xl"
    | "@min-5xl"
    | "@min-6xl"
    | "@min-7xl"
    | "portrait"
    | "landscape"
    | "ltr"
    | "rtl"
    | "dark"
    | "starting"
    | "print"
    | "forced-colors"
    | "inverted-colors"
    | "pointer-none"
    | "pointer-coarse"
    | "pointer-fine"
    | "any-pointer-none"
    | "any-pointer-coarse"
    | "any-pointer-fine"
    | "noscript"
    | "data-open"
    | "data-closed"
    | "data-checked"
    | "data-unchecked"
    | "data-selected"
    | "data-disabled"
    | "data-active"
    | "data-horizontal"
    | "data-vertical"
/** Tailwind global color property */
export type TailwindGlobalColor =
    | "red-50"
    | "red-100"
    | "red-200"
    | "red-300"
    | "red-400"
    | "red-500"
    | "red-600"
    | "red-700"
    | "red-800"
    | "red-900"
    | "red-950"
    | "orange-50"
    | "orange-100"
    | "orange-200"
    | "orange-300"
    | "orange-400"
    | "orange-500"
    | "orange-600"
    | "orange-700"
    | "orange-800"
    | "orange-900"
    | "orange-950"
    | "amber-50"
    | "amber-100"
    | "amber-200"
    | "amber-300"
    | "amber-400"
    | "amber-500"
    | "amber-600"
    | "amber-700"
    | "amber-800"
    | "amber-900"
    | "amber-950"
    | "yellow-50"
    | "yellow-100"
    | "yellow-200"
    | "yellow-300"
    | "yellow-400"
    | "yellow-500"
    | "yellow-600"
    | "yellow-700"
    | "yellow-800"
    | "yellow-900"
    | "yellow-950"
    | "lime-50"
    | "lime-100"
    | "lime-200"
    | "lime-300"
    | "lime-400"
    | "lime-500"
    | "lime-600"
    | "lime-700"
    | "lime-800"
    | "lime-900"
    | "lime-950"
    | "green-50"
    | "green-100"
    | "green-200"
    | "green-300"
    | "green-400"
    | "green-500"
    | "green-600"
    | "green-700"
    | "green-800"
    | "green-900"
    | "green-950"
    | "emerald-50"
    | "emerald-100"
    | "emerald-200"
    | "emerald-300"
    | "emerald-400"
    | "emerald-500"
    | "emerald-600"
    | "emerald-700"
    | "emerald-800"
    | "emerald-900"
    | "emerald-950"
    | "teal-50"
    | "teal-100"
    | "teal-200"
    | "teal-300"
    | "teal-400"
    | "teal-500"
    | "teal-600"
    | "teal-700"
    | "teal-800"
    | "teal-900"
    | "teal-950"
    | "cyan-50"
    | "cyan-100"
    | "cyan-200"
    | "cyan-300"
    | "cyan-400"
    | "cyan-500"
    | "cyan-600"
    | "cyan-700"
    | "cyan-800"
    | "cyan-900"
    | "cyan-950"
    | "sky-50"
    | "sky-100"
    | "sky-200"
    | "sky-300"
    | "sky-400"
    | "sky-500"
    | "sky-600"
    | "sky-700"
    | "sky-800"
    | "sky-900"
    | "sky-950"
    | "blue-50"
    | "blue-100"
    | "blue-200"
    | "blue-300"
    | "blue-400"
    | "blue-500"
    | "blue-600"
    | "blue-700"
    | "blue-800"
    | "blue-900"
    | "blue-950"
    | "indigo-50"
    | "indigo-100"
    | "indigo-200"
    | "indigo-300"
    | "indigo-400"
    | "indigo-500"
    | "indigo-600"
    | "indigo-700"
    | "indigo-800"
    | "indigo-900"
    | "indigo-950"
    | "violet-50"
    | "violet-100"
    | "violet-200"
    | "violet-300"
    | "violet-400"
    | "violet-500"
    | "violet-600"
    | "violet-700"
    | "violet-800"
    | "violet-900"
    | "violet-950"
    | "purple-50"
    | "purple-100"
    | "purple-200"
    | "purple-300"
    | "purple-400"
    | "purple-500"
    | "purple-600"
    | "purple-700"
    | "purple-800"
    | "purple-900"
    | "purple-950"
    | "fuchsia-50"
    | "fuchsia-100"
    | "fuchsia-200"
    | "fuchsia-300"
    | "fuchsia-400"
    | "fuchsia-500"
    | "fuchsia-600"
    | "fuchsia-700"
    | "fuchsia-800"
    | "fuchsia-900"
    | "fuchsia-950"
    | "pink-50"
    | "pink-100"
    | "pink-200"
    | "pink-300"
    | "pink-400"
    | "pink-500"
    | "pink-600"
    | "pink-700"
    | "pink-800"
    | "pink-900"
    | "pink-950"
    | "rose-50"
    | "rose-100"
    | "rose-200"
    | "rose-300"
    | "rose-400"
    | "rose-500"
    | "rose-600"
    | "rose-700"
    | "rose-800"
    | "rose-900"
    | "rose-950"
    | "slate-50"
    | "slate-100"
    | "slate-200"
    | "slate-300"
    | "slate-400"
    | "slate-500"
    | "slate-600"
    | "slate-700"
    | "slate-800"
    | "slate-900"
    | "slate-950"
    | "gray-50"
    | "gray-100"
    | "gray-200"
    | "gray-300"
    | "gray-400"
    | "gray-500"
    | "gray-600"
    | "gray-700"
    | "gray-800"
    | "gray-900"
    | "gray-950"
    | "zinc-50"
    | "zinc-100"
    | "zinc-200"
    | "zinc-300"
    | "zinc-400"
    | "zinc-500"
    | "zinc-600"
    | "zinc-700"
    | "zinc-800"
    | "zinc-900"
    | "zinc-950"
    | "neutral-50"
    | "neutral-100"
    | "neutral-200"
    | "neutral-300"
    | "neutral-400"
    | "neutral-500"
    | "neutral-600"
    | "neutral-700"
    | "neutral-800"
    | "neutral-900"
    | "neutral-950"
    | "stone-50"
    | "stone-100"
    | "stone-200"
    | "stone-300"
    | "stone-400"
    | "stone-500"
    | "stone-600"
    | "stone-700"
    | "stone-800"
    | "stone-900"
    | "stone-950"
    | "mauve-50"
    | "mauve-100"
    | "mauve-200"
    | "mauve-300"
    | "mauve-400"
    | "mauve-500"
    | "mauve-600"
    | "mauve-700"
    | "mauve-800"
    | "mauve-900"
    | "mauve-950"
    | "olive-50"
    | "olive-100"
    | "olive-200"
    | "olive-300"
    | "olive-400"
    | "olive-500"
    | "olive-600"
    | "olive-700"
    | "olive-800"
    | "olive-900"
    | "olive-950"
    | "mist-50"
    | "mist-100"
    | "mist-200"
    | "mist-300"
    | "mist-400"
    | "mist-500"
    | "mist-600"
    | "mist-700"
    | "mist-800"
    | "mist-900"
    | "mist-950"
    | "taupe-50"
    | "taupe-100"
    | "taupe-200"
    | "taupe-300"
    | "taupe-400"
    | "taupe-500"
    | "taupe-600"
    | "taupe-700"
    | "taupe-800"
    | "taupe-900"
    | "taupe-950"
    | "black"
    | "white"
type Variants1316686d =
    | "oklab"
    | "oklch"
    | "srgb"
    | "hsl"
    | "longer"
    | "shorter"
    | "increasing"
    | "decreasing"
    | "0"
    | "5"
    | "10"
    | "15"
    | "20"
    | "25"
    | "30"
    | "35"
    | "40"
    | "45"
    | "50"
    | "55"
    | "60"
    | "65"
    | "70"
    | "75"
    | "80"
    | "85"
    | "90"
    | "95"
    | "100"
    | (`${number}` & {})
type VariantsA91e8ba1 =
    | "0"
    | "5"
    | "10"
    | "15"
    | "20"
    | "25"
    | "30"
    | "35"
    | "40"
    | "45"
    | "50"
    | "55"
    | "60"
    | "65"
    | "70"
    | "75"
    | "80"
    | "85"
    | "90"
    | "95"
    | "100"
    | (`${number}` & {})
type Variants1e76e759 = "tight" | "snug" | "normal" | "relaxed" | "loose"
type BackgroundImageRef1 =
    | "0"
    | "30"
    | "60"
    | "90"
    | "120"
    | "150"
    | "180"
    | "210"
    | "240"
    | "270"
    | "300"
    | "330"
type BackgroundImageRef2 = "b" | "bl" | "br" | "l" | "r" | "t" | "tl" | "tr"
type BackgroundImageRef3 = "foreground"
type BackgroundImageRef4 = "1" | "2" | "3" | "4" | "5"
type BackgroundImageRef5 = "foreground"
type BackgroundImageRef6 =
    | "accent"
    | "accent-foreground"
    | "border"
    | "foreground"
    | "primary"
    | "primary-foreground"
    | "ring"
type BackgroundImageRef7 = "foreground"
type BackgroundImageRef8 = "1" | "2" | "3" | "4" | "5"
type BackgroundImageRef9 = "foreground"
type BackgroundImageRef10 = "foreground"
type BackgroundImageRef11 = "1" | "2" | "3" | "4" | "5"
type BackgroundImageRef12 = "foreground"
type BackgroundImageRef13 = "conic" | "none" | "radial"
type BackgroundImageRef14 =
    | "0%"
    | "5%"
    | "10%"
    | "15%"
    | "20%"
    | "25%"
    | "30%"
    | "35%"
    | "40%"
    | "45%"
    | "50%"
    | "55%"
    | "60%"
    | "65%"
    | "70%"
    | "75%"
    | "80%"
    | "85%"
    | "90%"
    | "95%"
    | "100%"
    | "accent"
    | "background"
    | "border"
    | "card"
    | "card-foreground"
    | "current"
    | "destructive"
    | "foreground"
    | "inherit"
    | "input"
    | "muted"
    | "muted-foreground"
    | "popover"
    | "popover-foreground"
    | "primary"
    | "ring"
    | "secondary"
    | "secondary-foreground"
    | "sidebar"
    | "transparent"
    | TailwindGlobalColor
type BottomRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
    | "full"
    | "px"
    | "auto"
type GridColumnRef1 =
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "13"
    | "auto"
type GridColumnRef2 =
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "full"
type GridColumnRef3 = "auto"
type EndRef1 = "full" | "px" | "auto"
type EndRef2 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
    | "full"
    | "px"
    | "auto"
type TextIndentRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "px"
type InsetRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
    | "full"
    | "px"
    | "auto"
type StartRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
    | "full"
    | "px"
    | "auto"
type StartRef2 = "full" | "px" | "auto"
type LeftRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
    | "full"
    | "px"
    | "auto"
type MarginRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "px"
    | "auto"
type MarginRef2 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "px"
    | "reverse"
type MaskImageRef1 = "foreground"
type MaskImageRef2 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef3 = "foreground"
type MaskImageRef4 =
    | "accent"
    | "accent-foreground"
    | "border"
    | "foreground"
    | "primary"
    | "primary-foreground"
    | "ring"
type MaskImageRef5 = "foreground"
type MaskImageRef6 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef7 = "foreground"
type MaskImageRef8 = "foreground"
type MaskImageRef9 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef10 = "foreground"
type MaskImageRef11 = "foreground"
type MaskImageRef12 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef13 = "foreground"
type MaskImageRef14 = "foreground"
type MaskImageRef15 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef16 = "foreground"
type MaskImageRef17 = "foreground"
type MaskImageRef18 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef19 = "foreground"
type MaskImageRef20 = "foreground"
type MaskImageRef21 = "foreground"
type MaskImageRef22 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef23 = "foreground"
type MaskImageRef24 = "foreground"
type MaskImageRef25 = "foreground"
type MaskImageRef26 = "foreground"
type MaskImageRef27 = "foreground"
type MaskImageRef28 = "foreground"
type MaskImageRef29 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef30 = "foreground"
type MaskImageRef31 = "foreground"
type MaskImageRef32 = "foreground"
type MaskImageRef33 = "foreground"
type MaskImageRef34 = "foreground"
type MaskImageRef35 = "foreground"
type MaskImageRef36 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef37 = "foreground"
type MaskImageRef38 = "foreground"
type MaskImageRef39 = "foreground"
type MaskImageRef40 = "foreground"
type MaskImageRef41 = "foreground"
type MaskImageRef42 = "foreground"
type MaskImageRef43 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef44 = "foreground"
type MaskImageRef45 = "foreground"
type MaskImageRef46 = "foreground"
type MaskImageRef47 = "foreground"
type MaskImageRef48 = "left" | "right"
type MaskImageRef49 = "left" | "right"
type MaskImageRef50 = "foreground"
type MaskImageRef51 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef52 = "foreground"
type MaskImageRef53 = "foreground"
type MaskImageRef54 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef55 = "foreground"
type MaskImageRef56 = "foreground"
type MaskImageRef57 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef58 = "foreground"
type MaskImageRef59 = "foreground"
type MaskImageRef60 = "foreground"
type MaskImageRef61 = "foreground"
type MaskImageRef62 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef63 = "foreground"
type MaskImageRef64 = "foreground"
type MaskImageRef65 = "foreground"
type MaskImageRef66 = "foreground"
type MaskImageRef67 = "foreground"
type MaskImageRef68 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef69 = "foreground"
type MaskImageRef70 = "foreground"
type MaskImageRef71 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef72 = "foreground"
type MaskImageRef73 = "foreground"
type MaskImageRef74 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef75 = "foreground"
type MaskImageRef76 = "foreground"
type MaskImageRef77 = "foreground"
type MaskImageRef78 = "1" | "2" | "3" | "4" | "5"
type MaskImageRef79 = "foreground"
type MaskImageRef80 = "foreground"
type MaskImageRef81 = "bottom" | "center" | "left" | "right" | "top"
type MaskImageRef82 =
    | "0"
    | "0%"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "5%"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "10%"
    | "11"
    | "12"
    | "14"
    | "15%"
    | "16"
    | "20"
    | "20%"
    | "24"
    | "25%"
    | "28"
    | "30%"
    | "32"
    | "35%"
    | "36"
    | "40"
    | "40%"
    | "44"
    | "45%"
    | "48"
    | "50%"
    | "52"
    | "55%"
    | "56"
    | "60"
    | "60%"
    | "64"
    | "65%"
    | "70%"
    | "72"
    | "75%"
    | "80"
    | "80%"
    | "85%"
    | "90%"
    | "95%"
    | "96"
    | "100%"
    | "accent"
    | "background"
    | "border"
    | "card"
    | "current"
    | "destructive"
    | "foreground"
    | "inherit"
    | "input"
    | "muted"
    | "popover"
    | "primary"
    | "ring"
    | "secondary"
    | "sidebar"
    | "transparent"
    | TailwindGlobalColor
type MaskImageRef83 =
    | "closest-corner"
    | "closest-side"
    | "farthest-corner"
    | "farthest-side"
type MaskImageRef84 = "0" | "1" | "2" | "3" | "6" | "12" | "45" | "90" | "180"
type MaskImageRef85 = "circle" | "ellipse" | "none"
type OrderRef1 =
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "first"
    | "last"
type OutlineOffsetRef1 = "0" | "1" | "2" | "4" | "8"
type RightRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
    | "full"
    | "px"
    | "auto"
type RotateRef1 = "0" | "1" | "2" | "3" | "6" | "12" | "45" | "90" | "180"
type GridRowRef1 =
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "13"
    | "auto"
type GridRowRef2 =
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "full"
type GridRowRef3 = "auto"
type ScaleRef1 =
    | "0"
    | "50"
    | "75"
    | "90"
    | "95"
    | "100"
    | "105"
    | "110"
    | "125"
    | "150"
    | "200"
type ScrollMarginRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "px"
type SkewRef1 = "0" | "1" | "2" | "3" | "6" | "12"
type CustomRef1 = "in" | "out"
type CustomRef2 =
    | "0"
    | "5"
    | "10"
    | "15"
    | "20"
    | "25"
    | "30"
    | "35"
    | "40"
    | "45"
    | "50"
    | "55"
    | "60"
    | "65"
    | "70"
    | "75"
    | "80"
    | "85"
    | "90"
    | "95"
    | "100"
    | "translate-full"
type CustomRef3 = "2xl" | "3xl" | "lg" | "md" | "sm" | "xl" | "xs"
type CustomRef4 = "in" | "out"
type CustomRef5 = "in" | "out"
type CustomRef6 = "in" | "out"
type CustomRef7 = "bottom" | "end" | "left" | "right" | "start" | "top"
type TopRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
    | "full"
    | "px"
    | "auto"
type LetterSpacingRef1 =
    | "normal"
    | "tight"
    | "tighter"
    | "wide"
    | "wider"
    | "widest"
type TranslateRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "px"
type TextUnderlineOffsetRef1 = "0" | "1" | "2" | "4" | "8" | "auto"
type ZIndexRef1 = "0" | "10" | "20" | "30" | "40" | "50" | "auto"
type AccentColorRef1 = "1" | "2" | "3" | "4" | "5"
type AccentColorRef2 = "foreground"
type AccentColorRef3 =
    | "accent"
    | "accent-foreground"
    | "border"
    | "foreground"
    | "primary"
    | "primary-foreground"
    | "ring"
type AccentColorRef4 =
    | "accent"
    | "accent-foreground"
    | "auto"
    | "background"
    | "border"
    | "card"
    | "card-foreground"
    | "current"
    | "destructive"
    | "foreground"
    | "inherit"
    | "input"
    | "muted"
    | "muted-foreground"
    | "popover"
    | "popover-foreground"
    | "primary"
    | "ring"
    | "secondary"
    | "secondary-foreground"
    | "sidebar"
    | "transparent"
    | TailwindGlobalColor
type VerticalAlignRef1 =
    | "baseline"
    | "bottom"
    | "middle"
    | "sub"
    | "super"
    | "text-bottom"
    | "text-top"
    | "top"
type AnimationRef1 =
    | "accordion-down"
    | "accordion-up"
    | "bounce"
    | "caret-blink"
    | "collapsible-down"
    | "collapsible-up"
    | "in"
    | "none"
    | "out"
    | "ping"
    | "pulse"
    | "spin"
type AspectRatioRef1 = "auto" | "square" | "video"
type GridAutoColumnsRef1 = "auto" | "fr" | "max" | "min"
type GridAutoRowsRef1 = "auto" | "fr" | "max" | "min"
type BackdropFilterRef1 =
    | "2xl"
    | "3xl"
    | "lg"
    | "md"
    | "none"
    | "sm"
    | "xl"
    | "xs"
type BackdropFilterRef2 = "0" | "50" | "75" | "100" | "125" | "150" | "200"
type BackdropFilterRef3 = "0" | "25" | "50" | "75" | "100"
type BackdropFilterRef4 = "0" | "15" | "30" | "60" | "90" | "180"
type BackdropFilterRef5 = "0" | "25" | "50" | "75" | "100"
type BackdropFilterRef6 =
    | "0"
    | "5"
    | "10"
    | "15"
    | "20"
    | "25"
    | "30"
    | "35"
    | "40"
    | "45"
    | "50"
    | "55"
    | "60"
    | "65"
    | "70"
    | "75"
    | "80"
    | "85"
    | "90"
    | "95"
    | "100"
type BackdropFilterRef7 = "0" | "50" | "100" | "150" | "200"
type BackdropFilterRef8 = "0" | "50" | "100"
type BackdropFilterRef9 = "grayscale" | "invert" | "sepia"
type FlexBasisRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "2xl"
    | "2xs"
    | "3"
    | "3.5"
    | "3xl"
    | "3xs"
    | "4"
    | "4xl"
    | "5"
    | "5xl"
    | "6"
    | "6xl"
    | "7"
    | "7xl"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "auto"
    | "full"
    | "lg"
    | "md"
    | "px"
    | "sm"
    | "xl"
    | "xs"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
type BackgroundColorRef1 = "foreground"
type BackgroundColorRef2 = "1" | "2" | "3" | "4" | "5"
type BackgroundColorRef3 = "foreground"
type BackgroundColorRef4 =
    | "accent"
    | "accent-foreground"
    | "border"
    | "foreground"
    | "primary"
    | "primary-foreground"
    | "ring"
type BackgroundColorRef5 =
    | "accent"
    | "background"
    | "border"
    | "card"
    | "card-foreground"
    | "current"
    | "destructive"
    | "foreground"
    | "inherit"
    | "input"
    | "muted"
    | "muted-foreground"
    | "popover"
    | "popover-foreground"
    | "primary"
    | "ring"
    | "secondary"
    | "secondary-foreground"
    | "sidebar"
    | "transparent"
    | TailwindGlobalColor
type BackgroundSizeRef1 = "auto" | "contain" | "cover"
type BackgroundBlendModeRef1 =
    | "color"
    | "darken"
    | "difference"
    | "exclusion"
    | "hard-light"
    | "hue"
    | "lighten"
    | "luminosity"
    | "multiply"
    | "normal"
    | "overlay"
    | "saturation"
    | "screen"
    | "soft-light"
type BackgroundBlendModeRef2 = "burn" | "dodge"
type BackgroundPositionRef1 = "left" | "right"
type BackgroundPositionRef2 = "left" | "right"
type BackgroundPositionRef3 = "bottom" | "center" | "left" | "right" | "top"
type BackgroundClipRef1 = "border" | "content" | "padding" | "text"
type BackgroundAttachmentRef1 = "fixed" | "local" | "scroll"
type BackgroundRepeatRef1 = "round" | "space" | "x" | "y"
type BackgroundRepeatRef2 = "no-repeat" | "repeat"
type BackgroundOriginRef1 = "border" | "content" | "padding"
type DisplayRef1 = "block" | "flex" | "grid" | "table"
type DisplayRef2 =
    | "caption"
    | "cell"
    | "column"
    | "column-group"
    | "footer-group"
    | "header-group"
    | "row"
    | "row-group"
type BlockSizeRef1 =
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
    | "auto"
    | "dvh"
    | "fit"
    | "full"
    | "lh"
    | "lvh"
    | "max"
    | "min"
    | "px"
    | "screen"
    | "svh"
type FilterRef1 = "2xl" | "3xl" | "lg" | "md" | "none" | "sm" | "xl" | "xs"
type FilterRef2 = "0" | "50" | "75" | "100" | "125" | "150" | "200"
type FilterRef3 = "foreground"
type FilterRef4 = "1" | "2" | "3" | "4" | "5"
type FilterRef5 = "foreground"
type FilterRef6 =
    | "accent"
    | "accent-foreground"
    | "border"
    | "foreground"
    | "primary"
    | "primary-foreground"
    | "ring"
type FilterRef7 = "0" | "25" | "50" | "75" | "100"
type FilterRef8 = "0" | "15" | "30" | "60" | "90" | "180"
type FilterRef9 = "0" | "25" | "50" | "75" | "100"
type FilterRef10 = "0" | "50" | "100" | "150" | "200"
type FilterRef11 = "0" | "50" | "100"
type FilterRef12 =
    | "2xl"
    | "accent"
    | "background"
    | "border"
    | "card"
    | "card-foreground"
    | "current"
    | "destructive"
    | "foreground"
    | "inherit"
    | "input"
    | "lg"
    | "md"
    | "muted"
    | "muted-foreground"
    | "none"
    | "popover"
    | "popover-foreground"
    | "primary"
    | "ring"
    | "secondary"
    | "secondary-foreground"
    | "sidebar"
    | "sm"
    | "transparent"
    | "xl"
    | "xs"
    | TailwindGlobalColor
type BorderWidthRef1 = "foreground"
type BorderWidthRef2 =
    | "accent"
    | "accent-foreground"
    | "border"
    | "foreground"
    | "primary"
    | "primary-foreground"
    | "ring"
type BorderWidthRef3 = "foreground"
type BorderWidthRef4 = "1" | "2" | "3" | "4" | "5"
type BorderWidthRef5 = "foreground"
type BorderWidthRef6 = "foreground"
type BorderWidthRef7 = "foreground"
type BorderWidthRef8 = "foreground"
type BorderWidthRef9 = "0" | "2" | "4" | "8" | "reverse"
type BorderWidthRef10 = "0" | "2" | "4" | "8" | "reverse"
type BorderWidthRef11 =
    | "0"
    | "2"
    | "4"
    | "8"
    | "accent"
    | "b"
    | "background"
    | "be"
    | "border"
    | "bs"
    | "card"
    | "destructive"
    | "e"
    | "foreground"
    | "input"
    | "l"
    | "muted"
    | "popover"
    | "primary"
    | "r"
    | "ring"
    | "s"
    | "secondary"
    | "sidebar"
    | "t"
    | "x"
    | "y"
type BorderWidthRef12 = "x" | "y"
type BorderColorRef1 =
    | "current"
    | "inherit"
    | "transparent"
    | TailwindGlobalColor
type BorderColorRef2 = "foreground"
type BorderColorRef3 = "1" | "2" | "3" | "4" | "5"
type BorderColorRef4 = "foreground"
type BorderColorRef5 =
    | "accent"
    | "accent-foreground"
    | "border"
    | "foreground"
    | "primary"
    | "primary-foreground"
    | "ring"
type BorderStyleRef1 =
    | "dashed"
    | "dotted"
    | "double"
    | "hidden"
    | "none"
    | "solid"
type BorderStyleRef2 = "dashed" | "dotted" | "double" | "none" | "solid"
type BorderSpacingRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "px"
type BreakAfterRef1 =
    | "all"
    | "auto"
    | "avoid"
    | "avoid-page"
    | "column"
    | "left"
    | "page"
    | "right"
type WordBreakRef1 = "all" | "keep" | "normal"
type BreakBeforeRef1 =
    | "all"
    | "auto"
    | "avoid"
    | "avoid-page"
    | "column"
    | "left"
    | "page"
    | "right"
type BreakInsideRef1 = "auto" | "avoid"
type BreakInsideRef2 = "column" | "page"
type CaretColorRef1 = "foreground"
type CaretColorRef2 = "1" | "2" | "3" | "4" | "5"
type CaretColorRef3 = "foreground"
type CaretColorRef4 =
    | "accent"
    | "accent-foreground"
    | "border"
    | "foreground"
    | "primary"
    | "primary-foreground"
    | "ring"
type CaretColorRef5 =
    | "accent"
    | "background"
    | "border"
    | "card"
    | "card-foreground"
    | "current"
    | "destructive"
    | "foreground"
    | "inherit"
    | "input"
    | "muted"
    | "muted-foreground"
    | "popover"
    | "popover-foreground"
    | "primary"
    | "ring"
    | "secondary"
    | "secondary-foreground"
    | "sidebar"
    | "transparent"
    | TailwindGlobalColor
type ClearRef1 = "both" | "end" | "left" | "none" | "right" | "start"
type ColumnsRef1 =
    | "1"
    | "2"
    | "2xl"
    | "2xs"
    | "3"
    | "3xl"
    | "3xs"
    | "4"
    | "4xl"
    | "5"
    | "5xl"
    | "6"
    | "6xl"
    | "7"
    | "7xl"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "auto"
    | "lg"
    | "md"
    | "sm"
    | "xl"
    | "xs"
type ContainRef1 =
    | "content"
    | "inline-size"
    | "layout"
    | "none"
    | "paint"
    | "size"
    | "strict"
    | "style"
type MaxWidthRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "2xl"
    | "2xs"
    | "3"
    | "3.5"
    | "3xl"
    | "3xs"
    | "4"
    | "4xl"
    | "5"
    | "5xl"
    | "6"
    | "6xl"
    | "7"
    | "7xl"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "dvh"
    | "dvw"
    | "fit"
    | "full"
    | "lg"
    | "lvh"
    | "lvw"
    | "max"
    | "md"
    | "min"
    | "none"
    | "prose"
    | "px"
    | "sm"
    | "svh"
    | "svw"
    | "xl"
    | "xs"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
type AlignContentRef1 =
    | "around"
    | "baseline"
    | "between"
    | "center"
    | "end"
    | "evenly"
    | "normal"
    | "start"
    | "stretch"
type ContentRef1 = "center-safe" | "end-safe" | "none"
type CursorRef1 = "resize"
type CursorRef2 = "resize"
type CursorRef3 = "resize"
type CursorRef4 = "drop"
type CursorRef5 = "resize"
type CursorRef6 = "resize"
type CursorRef7 =
    | "alias"
    | "all-scroll"
    | "auto"
    | "cell"
    | "col-resize"
    | "context-menu"
    | "copy"
    | "crosshair"
    | "default"
    | "ew-resize"
    | "grab"
    | "grabbing"
    | "help"
    | "move"
    | "nesw-resize"
    | "none"
    | "not-allowed"
    | "ns-resize"
    | "nw-resize"
    | "nwse-resize"
    | "pointer"
    | "progress"
    | "row-resize"
    | "se-resize"
    | "sw-resize"
    | "text"
    | "vertical-text"
    | "wait"
    | "zoom-in"
    | "zoom-out"
type TextDecorationThicknessRef1 = "foreground"
type TextDecorationThicknessRef2 = "1" | "2" | "3" | "4" | "5"
type TextDecorationThicknessRef3 = "foreground"
type TextDecorationThicknessRef4 =
    | "accent"
    | "accent-foreground"
    | "border"
    | "foreground"
    | "primary"
    | "primary-foreground"
    | "ring"
type TextDecorationThicknessRef5 =
    | "0"
    | "1"
    | "2"
    | "accent"
    | "auto"
    | "background"
    | "border"
    | "card"
    | "card-foreground"
    | "destructive"
    | "foreground"
    | "from-font"
    | "input"
    | "muted"
    | "muted-foreground"
    | "popover"
    | "popover-foreground"
    | "primary"
    | "ring"
    | "secondary"
    | "secondary-foreground"
    | "sidebar"
type TextDecorationColorRef1 =
    | "current"
    | "inherit"
    | "transparent"
    | TailwindGlobalColor
type TextDecorationStyleRef1 = "dashed" | "dotted" | "double" | "solid" | "wavy"
type TransitionDelayRef1 =
    | "0"
    | "75"
    | "100"
    | "150"
    | "200"
    | "300"
    | "500"
    | "700"
    | "1000"
    | "initial"
type AnimationDirectionRef1 =
    | "alternate"
    | "alternate-reverse"
    | "initial"
    | "normal"
    | "reverse"
type TransitionDurationRef1 =
    | "75"
    | "100"
    | "150"
    | "200"
    | "300"
    | "500"
    | "700"
    | "1000"
    | "initial"
type TransitionTimingFunctionRef1 = "out"
type TransitionTimingFunctionRef2 = "in" | "initial" | "linear" | "out"
type FillRef1 = "foreground"
type FillRef2 = "1" | "2" | "3" | "4" | "5"
type FillRef3 = "backwards" | "both" | "forwards" | "initial" | "none"
type FillRef4 = "foreground"
type FillRef5 =
    | "accent"
    | "accent-foreground"
    | "border"
    | "foreground"
    | "primary"
    | "primary-foreground"
    | "ring"
type FillRef6 =
    | "accent"
    | "background"
    | "border"
    | "card"
    | "card-foreground"
    | "current"
    | "destructive"
    | "foreground"
    | "inherit"
    | "input"
    | "muted"
    | "muted-foreground"
    | "none"
    | "popover"
    | "popover-foreground"
    | "primary"
    | "ring"
    | "secondary"
    | "secondary-foreground"
    | "sidebar"
    | "transparent"
    | TailwindGlobalColor
type FlexRef1 =
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
    | "auto"
    | "initial"
    | "none"
type FlexDirectionRef1 = "col" | "col-reverse" | "row" | "row-reverse"
type FlexWrapRef1 = "reverse"
type FlexWrapRef2 = "nowrap" | "wrap"
type FloatRef1 = "end" | "left" | "none" | "right" | "start"
type FontWeightRef1 =
    | "black"
    | "bold"
    | "extrabold"
    | "extralight"
    | "light"
    | "medium"
    | "normal"
    | "semibold"
    | "thin"
type FontFamilyRef1 = "heading" | "mono" | "sans" | "serif"
type FontStretchRef1 =
    | "50%"
    | "75%"
    | "90%"
    | "95%"
    | "100%"
    | "105%"
    | "110%"
    | "125%"
    | "150%"
    | "200%"
    | "condensed"
    | "expanded"
    | "extra-condensed"
    | "extra-expanded"
    | "normal"
    | "semi-condensed"
    | "semi-expanded"
    | "ultra-condensed"
    | "ultra-expanded"
type GapRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "px"
type GridTemplateColumnsRef1 =
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "none"
    | "subgrid"
type GridAutoFlowRef1 = "col" | "col-dense" | "dense" | "row" | "row-dense"
type GridTemplateRowsRef1 =
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "none"
    | "subgrid"
type HeightRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
    | "auto"
    | "dvh"
    | "dvw"
    | "fit"
    | "full"
    | "lvh"
    | "lvw"
    | "max"
    | "min"
    | "px"
    | "svh"
    | "svw"
type HyphensRef1 = "auto" | "manual" | "none"
type InlineSizeRef1 =
    | "2xl"
    | "2xs"
    | "3xl"
    | "3xs"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "auto"
    | "dvw"
    | "fit"
    | "full"
    | "lg"
    | "lvw"
    | "max"
    | "md"
    | "min"
    | "px"
    | "screen"
    | "sm"
    | "svw"
    | "xl"
    | "xs"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
type BoxShadowRef1 =
    | "ring"
    | "ring-0"
    | "ring-1"
    | "ring-2"
    | "ring-4"
    | "ring-8"
    | "ring-accent"
    | "ring-accent-foreground"
    | "ring-amber-50"
    | "ring-amber-100"
    | "ring-amber-200"
    | "ring-amber-300"
    | "ring-amber-400"
    | "ring-amber-500"
    | "ring-amber-600"
    | "ring-amber-700"
    | "ring-amber-800"
    | "ring-amber-900"
    | "ring-amber-950"
    | "ring-background"
    | "ring-black"
    | "ring-blue-50"
    | "ring-blue-100"
    | "ring-blue-200"
    | "ring-blue-300"
    | "ring-blue-400"
    | "ring-blue-500"
    | "ring-blue-600"
    | "ring-blue-700"
    | "ring-blue-800"
    | "ring-blue-900"
    | "ring-blue-950"
    | "ring-border"
    | "ring-card"
    | "ring-card-foreground"
    | "ring-chart-1"
    | "ring-chart-2"
    | "ring-chart-3"
    | "ring-chart-4"
    | "ring-chart-5"
    | "ring-current"
    | "ring-cyan-50"
    | "ring-cyan-100"
    | "ring-cyan-200"
    | "ring-cyan-300"
    | "ring-cyan-400"
    | "ring-cyan-500"
    | "ring-cyan-600"
    | "ring-cyan-700"
    | "ring-cyan-800"
    | "ring-cyan-900"
    | "ring-cyan-950"
    | "ring-destructive"
    | "ring-emerald-50"
    | "ring-emerald-100"
    | "ring-emerald-200"
    | "ring-emerald-300"
    | "ring-emerald-400"
    | "ring-emerald-500"
    | "ring-emerald-600"
    | "ring-emerald-700"
    | "ring-emerald-800"
    | "ring-emerald-900"
    | "ring-emerald-950"
    | "ring-foreground"
    | "ring-fuchsia-50"
    | "ring-fuchsia-100"
    | "ring-fuchsia-200"
    | "ring-fuchsia-300"
    | "ring-fuchsia-400"
    | "ring-fuchsia-500"
    | "ring-fuchsia-600"
    | "ring-fuchsia-700"
    | "ring-fuchsia-800"
    | "ring-fuchsia-900"
    | "ring-fuchsia-950"
    | "ring-gray-50"
    | "ring-gray-100"
    | "ring-gray-200"
    | "ring-gray-300"
    | "ring-gray-400"
    | "ring-gray-500"
    | "ring-gray-600"
    | "ring-gray-700"
    | "ring-gray-800"
    | "ring-gray-900"
    | "ring-gray-950"
    | "ring-green-50"
    | "ring-green-100"
    | "ring-green-200"
    | "ring-green-300"
    | "ring-green-400"
    | "ring-green-500"
    | "ring-green-600"
    | "ring-green-700"
    | "ring-green-800"
    | "ring-green-900"
    | "ring-green-950"
    | "ring-indigo-50"
    | "ring-indigo-100"
    | "ring-indigo-200"
    | "ring-indigo-300"
    | "ring-indigo-400"
    | "ring-indigo-500"
    | "ring-indigo-600"
    | "ring-indigo-700"
    | "ring-indigo-800"
    | "ring-indigo-900"
    | "ring-indigo-950"
    | "ring-inherit"
    | "ring-input"
    | "ring-lime-50"
    | "ring-lime-100"
    | "ring-lime-200"
    | "ring-lime-300"
    | "ring-lime-400"
    | "ring-lime-500"
    | "ring-lime-600"
    | "ring-lime-700"
    | "ring-lime-800"
    | "ring-lime-900"
    | "ring-lime-950"
    | "ring-mauve-50"
    | "ring-mauve-100"
    | "ring-mauve-200"
    | "ring-mauve-300"
    | "ring-mauve-400"
    | "ring-mauve-500"
    | "ring-mauve-600"
    | "ring-mauve-700"
    | "ring-mauve-800"
    | "ring-mauve-900"
    | "ring-mauve-950"
    | "ring-mist-50"
    | "ring-mist-100"
    | "ring-mist-200"
    | "ring-mist-300"
    | "ring-mist-400"
    | "ring-mist-500"
    | "ring-mist-600"
    | "ring-mist-700"
    | "ring-mist-800"
    | "ring-mist-900"
    | "ring-mist-950"
    | "ring-muted"
    | "ring-muted-foreground"
    | "ring-neutral-50"
    | "ring-neutral-100"
    | "ring-neutral-200"
    | "ring-neutral-300"
    | "ring-neutral-400"
    | "ring-neutral-500"
    | "ring-neutral-600"
    | "ring-neutral-700"
    | "ring-neutral-800"
    | "ring-neutral-900"
    | "ring-neutral-950"
    | "ring-olive-50"
    | "ring-olive-100"
    | "ring-olive-200"
    | "ring-olive-300"
    | "ring-olive-400"
    | "ring-olive-500"
    | "ring-olive-600"
    | "ring-olive-700"
    | "ring-olive-800"
    | "ring-olive-900"
    | "ring-olive-950"
    | "ring-orange-50"
    | "ring-orange-100"
    | "ring-orange-200"
    | "ring-orange-300"
    | "ring-orange-400"
    | "ring-orange-500"
    | "ring-orange-600"
    | "ring-orange-700"
    | "ring-orange-800"
    | "ring-orange-900"
    | "ring-orange-950"
    | "ring-pink-50"
    | "ring-pink-100"
    | "ring-pink-200"
    | "ring-pink-300"
    | "ring-pink-400"
    | "ring-pink-500"
    | "ring-pink-600"
    | "ring-pink-700"
    | "ring-pink-800"
    | "ring-pink-900"
    | "ring-pink-950"
    | "ring-popover"
    | "ring-popover-foreground"
    | "ring-primary"
    | "ring-primary-foreground"
    | "ring-purple-50"
    | "ring-purple-100"
    | "ring-purple-200"
    | "ring-purple-300"
    | "ring-purple-400"
    | "ring-purple-500"
    | "ring-purple-600"
    | "ring-purple-700"
    | "ring-purple-800"
    | "ring-purple-900"
    | "ring-purple-950"
    | "ring-red-50"
    | "ring-red-100"
    | "ring-red-200"
    | "ring-red-300"
    | "ring-red-400"
    | "ring-red-500"
    | "ring-red-600"
    | "ring-red-700"
    | "ring-red-800"
    | "ring-red-900"
    | "ring-red-950"
    | "ring-ring"
    | "ring-rose-50"
    | "ring-rose-100"
    | "ring-rose-200"
    | "ring-rose-300"
    | "ring-rose-400"
    | "ring-rose-500"
    | "ring-rose-600"
    | "ring-rose-700"
    | "ring-rose-800"
    | "ring-rose-900"
    | "ring-rose-950"
    | "ring-secondary"
    | "ring-secondary-foreground"
    | "ring-sidebar"
    | "ring-sidebar-accent"
    | "ring-sidebar-accent-foreground"
    | "ring-sidebar-border"
    | "ring-sidebar-foreground"
    | "ring-sidebar-primary"
    | "ring-sidebar-primary-foreground"
    | "ring-sidebar-ring"
    | "ring-sky-50"
    | "ring-sky-100"
    | "ring-sky-200"
    | "ring-sky-300"
    | "ring-sky-400"
    | "ring-sky-500"
    | "ring-sky-600"
    | "ring-sky-700"
    | "ring-sky-800"
    | "ring-sky-900"
    | "ring-sky-950"
    | "ring-slate-50"
    | "ring-slate-100"
    | "ring-slate-200"
    | "ring-slate-300"
    | "ring-slate-400"
    | "ring-slate-500"
    | "ring-slate-600"
    | "ring-slate-700"
    | "ring-slate-800"
    | "ring-slate-900"
    | "ring-slate-950"
    | "ring-stone-50"
    | "ring-stone-100"
    | "ring-stone-200"
    | "ring-stone-300"
    | "ring-stone-400"
    | "ring-stone-500"
    | "ring-stone-600"
    | "ring-stone-700"
    | "ring-stone-800"
    | "ring-stone-900"
    | "ring-stone-950"
    | "ring-taupe-50"
    | "ring-taupe-100"
    | "ring-taupe-200"
    | "ring-taupe-300"
    | "ring-taupe-400"
    | "ring-taupe-500"
    | "ring-taupe-600"
    | "ring-taupe-700"
    | "ring-taupe-800"
    | "ring-taupe-900"
    | "ring-taupe-950"
    | "ring-teal-50"
    | "ring-teal-100"
    | "ring-teal-200"
    | "ring-teal-300"
    | "ring-teal-400"
    | "ring-teal-500"
    | "ring-teal-600"
    | "ring-teal-700"
    | "ring-teal-800"
    | "ring-teal-900"
    | "ring-teal-950"
    | "ring-transparent"
    | "ring-violet-50"
    | "ring-violet-100"
    | "ring-violet-200"
    | "ring-violet-300"
    | "ring-violet-400"
    | "ring-violet-500"
    | "ring-violet-600"
    | "ring-violet-700"
    | "ring-violet-800"
    | "ring-violet-900"
    | "ring-violet-950"
    | "ring-white"
    | "ring-yellow-50"
    | "ring-yellow-100"
    | "ring-yellow-200"
    | "ring-yellow-300"
    | "ring-yellow-400"
    | "ring-yellow-500"
    | "ring-yellow-600"
    | "ring-yellow-700"
    | "ring-yellow-800"
    | "ring-yellow-900"
    | "ring-yellow-950"
    | "ring-zinc-50"
    | "ring-zinc-100"
    | "ring-zinc-200"
    | "ring-zinc-300"
    | "ring-zinc-400"
    | "ring-zinc-500"
    | "ring-zinc-600"
    | "ring-zinc-700"
    | "ring-zinc-800"
    | "ring-zinc-900"
    | "ring-zinc-950"
    | "shadow-2xs"
    | "shadow-accent"
    | "shadow-accent-foreground"
    | "shadow-amber-50"
    | "shadow-amber-100"
    | "shadow-amber-200"
    | "shadow-amber-300"
    | "shadow-amber-400"
    | "shadow-amber-500"
    | "shadow-amber-600"
    | "shadow-amber-700"
    | "shadow-amber-800"
    | "shadow-amber-900"
    | "shadow-amber-950"
    | "shadow-background"
    | "shadow-black"
    | "shadow-blue-50"
    | "shadow-blue-100"
    | "shadow-blue-200"
    | "shadow-blue-300"
    | "shadow-blue-400"
    | "shadow-blue-500"
    | "shadow-blue-600"
    | "shadow-blue-700"
    | "shadow-blue-800"
    | "shadow-blue-900"
    | "shadow-blue-950"
    | "shadow-border"
    | "shadow-card"
    | "shadow-card-foreground"
    | "shadow-chart-1"
    | "shadow-chart-2"
    | "shadow-chart-3"
    | "shadow-chart-4"
    | "shadow-chart-5"
    | "shadow-current"
    | "shadow-cyan-50"
    | "shadow-cyan-100"
    | "shadow-cyan-200"
    | "shadow-cyan-300"
    | "shadow-cyan-400"
    | "shadow-cyan-500"
    | "shadow-cyan-600"
    | "shadow-cyan-700"
    | "shadow-cyan-800"
    | "shadow-cyan-900"
    | "shadow-cyan-950"
    | "shadow-destructive"
    | "shadow-emerald-50"
    | "shadow-emerald-100"
    | "shadow-emerald-200"
    | "shadow-emerald-300"
    | "shadow-emerald-400"
    | "shadow-emerald-500"
    | "shadow-emerald-600"
    | "shadow-emerald-700"
    | "shadow-emerald-800"
    | "shadow-emerald-900"
    | "shadow-emerald-950"
    | "shadow-foreground"
    | "shadow-fuchsia-50"
    | "shadow-fuchsia-100"
    | "shadow-fuchsia-200"
    | "shadow-fuchsia-300"
    | "shadow-fuchsia-400"
    | "shadow-fuchsia-500"
    | "shadow-fuchsia-600"
    | "shadow-fuchsia-700"
    | "shadow-fuchsia-800"
    | "shadow-fuchsia-900"
    | "shadow-fuchsia-950"
    | "shadow-gray-50"
    | "shadow-gray-100"
    | "shadow-gray-200"
    | "shadow-gray-300"
    | "shadow-gray-400"
    | "shadow-gray-500"
    | "shadow-gray-600"
    | "shadow-gray-700"
    | "shadow-gray-800"
    | "shadow-gray-900"
    | "shadow-gray-950"
    | "shadow-green-50"
    | "shadow-green-100"
    | "shadow-green-200"
    | "shadow-green-300"
    | "shadow-green-400"
    | "shadow-green-500"
    | "shadow-green-600"
    | "shadow-green-700"
    | "shadow-green-800"
    | "shadow-green-900"
    | "shadow-green-950"
    | "shadow-indigo-50"
    | "shadow-indigo-100"
    | "shadow-indigo-200"
    | "shadow-indigo-300"
    | "shadow-indigo-400"
    | "shadow-indigo-500"
    | "shadow-indigo-600"
    | "shadow-indigo-700"
    | "shadow-indigo-800"
    | "shadow-indigo-900"
    | "shadow-indigo-950"
    | "shadow-inherit"
    | "shadow-initial"
    | "shadow-input"
    | "shadow-lime-50"
    | "shadow-lime-100"
    | "shadow-lime-200"
    | "shadow-lime-300"
    | "shadow-lime-400"
    | "shadow-lime-500"
    | "shadow-lime-600"
    | "shadow-lime-700"
    | "shadow-lime-800"
    | "shadow-lime-900"
    | "shadow-lime-950"
    | "shadow-mauve-50"
    | "shadow-mauve-100"
    | "shadow-mauve-200"
    | "shadow-mauve-300"
    | "shadow-mauve-400"
    | "shadow-mauve-500"
    | "shadow-mauve-600"
    | "shadow-mauve-700"
    | "shadow-mauve-800"
    | "shadow-mauve-900"
    | "shadow-mauve-950"
    | "shadow-mist-50"
    | "shadow-mist-100"
    | "shadow-mist-200"
    | "shadow-mist-300"
    | "shadow-mist-400"
    | "shadow-mist-500"
    | "shadow-mist-600"
    | "shadow-mist-700"
    | "shadow-mist-800"
    | "shadow-mist-900"
    | "shadow-mist-950"
    | "shadow-muted"
    | "shadow-muted-foreground"
    | "shadow-neutral-50"
    | "shadow-neutral-100"
    | "shadow-neutral-200"
    | "shadow-neutral-300"
    | "shadow-neutral-400"
    | "shadow-neutral-500"
    | "shadow-neutral-600"
    | "shadow-neutral-700"
    | "shadow-neutral-800"
    | "shadow-neutral-900"
    | "shadow-neutral-950"
    | "shadow-none"
    | "shadow-olive-50"
    | "shadow-olive-100"
    | "shadow-olive-200"
    | "shadow-olive-300"
    | "shadow-olive-400"
    | "shadow-olive-500"
    | "shadow-olive-600"
    | "shadow-olive-700"
    | "shadow-olive-800"
    | "shadow-olive-900"
    | "shadow-olive-950"
    | "shadow-orange-50"
    | "shadow-orange-100"
    | "shadow-orange-200"
    | "shadow-orange-300"
    | "shadow-orange-400"
    | "shadow-orange-500"
    | "shadow-orange-600"
    | "shadow-orange-700"
    | "shadow-orange-800"
    | "shadow-orange-900"
    | "shadow-orange-950"
    | "shadow-pink-50"
    | "shadow-pink-100"
    | "shadow-pink-200"
    | "shadow-pink-300"
    | "shadow-pink-400"
    | "shadow-pink-500"
    | "shadow-pink-600"
    | "shadow-pink-700"
    | "shadow-pink-800"
    | "shadow-pink-900"
    | "shadow-pink-950"
    | "shadow-popover"
    | "shadow-popover-foreground"
    | "shadow-primary"
    | "shadow-primary-foreground"
    | "shadow-purple-50"
    | "shadow-purple-100"
    | "shadow-purple-200"
    | "shadow-purple-300"
    | "shadow-purple-400"
    | "shadow-purple-500"
    | "shadow-purple-600"
    | "shadow-purple-700"
    | "shadow-purple-800"
    | "shadow-purple-900"
    | "shadow-purple-950"
    | "shadow-red-50"
    | "shadow-red-100"
    | "shadow-red-200"
    | "shadow-red-300"
    | "shadow-red-400"
    | "shadow-red-500"
    | "shadow-red-600"
    | "shadow-red-700"
    | "shadow-red-800"
    | "shadow-red-900"
    | "shadow-red-950"
    | "shadow-ring"
    | "shadow-rose-50"
    | "shadow-rose-100"
    | "shadow-rose-200"
    | "shadow-rose-300"
    | "shadow-rose-400"
    | "shadow-rose-500"
    | "shadow-rose-600"
    | "shadow-rose-700"
    | "shadow-rose-800"
    | "shadow-rose-900"
    | "shadow-rose-950"
    | "shadow-secondary"
    | "shadow-secondary-foreground"
    | "shadow-sidebar"
    | "shadow-sidebar-accent"
    | "shadow-sidebar-accent-foreground"
    | "shadow-sidebar-border"
    | "shadow-sidebar-foreground"
    | "shadow-sidebar-primary"
    | "shadow-sidebar-primary-foreground"
    | "shadow-sidebar-ring"
    | "shadow-sky-50"
    | "shadow-sky-100"
    | "shadow-sky-200"
    | "shadow-sky-300"
    | "shadow-sky-400"
    | "shadow-sky-500"
    | "shadow-sky-600"
    | "shadow-sky-700"
    | "shadow-sky-800"
    | "shadow-sky-900"
    | "shadow-sky-950"
    | "shadow-slate-50"
    | "shadow-slate-100"
    | "shadow-slate-200"
    | "shadow-slate-300"
    | "shadow-slate-400"
    | "shadow-slate-500"
    | "shadow-slate-600"
    | "shadow-slate-700"
    | "shadow-slate-800"
    | "shadow-slate-900"
    | "shadow-slate-950"
    | "shadow-sm"
    | "shadow-stone-50"
    | "shadow-stone-100"
    | "shadow-stone-200"
    | "shadow-stone-300"
    | "shadow-stone-400"
    | "shadow-stone-500"
    | "shadow-stone-600"
    | "shadow-stone-700"
    | "shadow-stone-800"
    | "shadow-stone-900"
    | "shadow-stone-950"
    | "shadow-taupe-50"
    | "shadow-taupe-100"
    | "shadow-taupe-200"
    | "shadow-taupe-300"
    | "shadow-taupe-400"
    | "shadow-taupe-500"
    | "shadow-taupe-600"
    | "shadow-taupe-700"
    | "shadow-taupe-800"
    | "shadow-taupe-900"
    | "shadow-taupe-950"
    | "shadow-teal-50"
    | "shadow-teal-100"
    | "shadow-teal-200"
    | "shadow-teal-300"
    | "shadow-teal-400"
    | "shadow-teal-500"
    | "shadow-teal-600"
    | "shadow-teal-700"
    | "shadow-teal-800"
    | "shadow-teal-900"
    | "shadow-teal-950"
    | "shadow-transparent"
    | "shadow-violet-50"
    | "shadow-violet-100"
    | "shadow-violet-200"
    | "shadow-violet-300"
    | "shadow-violet-400"
    | "shadow-violet-500"
    | "shadow-violet-600"
    | "shadow-violet-700"
    | "shadow-violet-800"
    | "shadow-violet-900"
    | "shadow-violet-950"
    | "shadow-white"
    | "shadow-xs"
    | "shadow-yellow-50"
    | "shadow-yellow-100"
    | "shadow-yellow-200"
    | "shadow-yellow-300"
    | "shadow-yellow-400"
    | "shadow-yellow-500"
    | "shadow-yellow-600"
    | "shadow-yellow-700"
    | "shadow-yellow-800"
    | "shadow-yellow-900"
    | "shadow-yellow-950"
    | "shadow-zinc-50"
    | "shadow-zinc-100"
    | "shadow-zinc-200"
    | "shadow-zinc-300"
    | "shadow-zinc-400"
    | "shadow-zinc-500"
    | "shadow-zinc-600"
    | "shadow-zinc-700"
    | "shadow-zinc-800"
    | "shadow-zinc-900"
    | "shadow-zinc-950"
type BoxShadowRef2 = "foreground"
type BoxShadowRef3 = "foreground"
type BoxShadowRef4 = "1" | "2" | "3" | "4" | "5"
type BoxShadowRef5 = "foreground"
type BoxShadowRef6 =
    | "accent"
    | "accent-foreground"
    | "border"
    | "foreground"
    | "primary"
    | "primary-foreground"
    | "ring"
type BoxShadowRef7 = "foreground"
type BoxShadowRef8 = "foreground"
type BoxShadowRef9 = "foreground"
type BoxShadowRef10 = "foreground"
type BoxShadowRef11 = "foreground"
type BoxShadowRef12 = "1" | "2" | "3" | "4" | "5"
type BoxShadowRef13 = "foreground"
type BoxShadowRef14 = "foreground"
type BoxShadowRef15 = "foreground"
type BoxShadowRef16 = "foreground"
type BoxShadowRef17 =
    | "0"
    | "1"
    | "2"
    | "4"
    | "8"
    | "accent"
    | "background"
    | "border"
    | "card"
    | "current"
    | "destructive"
    | "foreground"
    | "inherit"
    | "input"
    | "inset"
    | "muted"
    | "popover"
    | "primary"
    | "ring"
    | "secondary"
    | "sidebar"
    | "transparent"
    | TailwindGlobalColor
type BoxShadowRef18 =
    | "2xl"
    | "2xs"
    | "accent"
    | "background"
    | "border"
    | "card"
    | "current"
    | "destructive"
    | "foreground"
    | "inherit"
    | "initial"
    | "inner"
    | "input"
    | "lg"
    | "md"
    | "muted"
    | "none"
    | "popover"
    | "primary"
    | "ring"
    | "secondary"
    | "sidebar"
    | "sm"
    | "transparent"
    | "xl"
    | "xs"
    | TailwindGlobalColor
type AlignItemsRef1 =
    | "baseline"
    | "baseline-last"
    | "center"
    | "center-safe"
    | "end"
    | "end-safe"
    | "start"
    | "stretch"
type JustifyContentRef1 =
    | "around"
    | "baseline"
    | "between"
    | "center"
    | "center-safe"
    | "end"
    | "end-safe"
    | "evenly"
    | "normal"
    | "start"
    | "stretch"
type JustifyItemsRef1 =
    | "center"
    | "center-safe"
    | "end"
    | "end-safe"
    | "normal"
    | "start"
    | "stretch"
type JustifySelfRef1 =
    | "auto"
    | "center"
    | "center-safe"
    | "end"
    | "end-safe"
    | "start"
    | "stretch"
type LineHeightRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "loose"
    | "none"
    | "normal"
    | "px"
    | "relaxed"
    | "snug"
    | "tight"
type LineClampRef1 = "1" | "2" | "3" | "4" | "5" | "6" | "none"
type TextDecorationLineRef1 = "through"
type ListStyleTypeRef1 = "decimal" | "disc" | "none"
type MaskCompositeRef1 = "add" | "exclude" | "intersect" | "subtract"
type MaskModeRef1 = "alpha" | "luminance" | "match"
type MaskSizeRef1 = "auto" | "contain" | "cover"
type MaskPositionRef1 = "left" | "right"
type MaskPositionRef2 = "left" | "right"
type MaskPositionRef3 = "bottom" | "center" | "left" | "right" | "top"
type MaskClipRef1 =
    | "border"
    | "content"
    | "fill"
    | "padding"
    | "stroke"
    | "view"
type MaskClipRef2 = "no-clip"
type MaskRepeatRef1 = "round" | "space" | "x" | "y"
type MaskRepeatRef2 = "no-repeat" | "repeat"
type MaskOriginRef1 =
    | "border"
    | "content"
    | "fill"
    | "padding"
    | "stroke"
    | "view"
type MaxBlockSizeRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
    | "dvh"
    | "fit"
    | "full"
    | "lh"
    | "lvh"
    | "max"
    | "min"
    | "none"
    | "px"
    | "screen"
    | "svh"
type MaxHeightRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
    | "dvh"
    | "dvw"
    | "fit"
    | "full"
    | "lh"
    | "lvh"
    | "lvw"
    | "max"
    | "min"
    | "none"
    | "px"
    | "screen"
    | "svh"
    | "svw"
type MaxInlineSizeRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "2xl"
    | "2xs"
    | "3"
    | "3.5"
    | "3xl"
    | "3xs"
    | "4"
    | "4xl"
    | "5"
    | "5xl"
    | "6"
    | "6xl"
    | "7"
    | "7xl"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "dvw"
    | "fit"
    | "full"
    | "lg"
    | "lvw"
    | "max"
    | "md"
    | "min"
    | "none"
    | "px"
    | "screen"
    | "sm"
    | "svw"
    | "xl"
    | "xs"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
type MinBlockSizeRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
    | "auto"
    | "dvh"
    | "fit"
    | "full"
    | "lh"
    | "lvh"
    | "max"
    | "min"
    | "px"
    | "screen"
    | "svh"
type MinHeightRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
    | "auto"
    | "dvh"
    | "dvw"
    | "fit"
    | "full"
    | "lh"
    | "lvh"
    | "lvw"
    | "max"
    | "min"
    | "px"
    | "screen"
    | "svh"
    | "svw"
type MinInlineSizeRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "2xl"
    | "2xs"
    | "3"
    | "3.5"
    | "3xl"
    | "3xs"
    | "4"
    | "4xl"
    | "5"
    | "5xl"
    | "6"
    | "6xl"
    | "7"
    | "7xl"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "auto"
    | "dvw"
    | "fit"
    | "full"
    | "lg"
    | "lvw"
    | "max"
    | "md"
    | "min"
    | "px"
    | "screen"
    | "sm"
    | "svw"
    | "xl"
    | "xs"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
type MinWidthRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "2xl"
    | "2xs"
    | "3"
    | "3.5"
    | "3xl"
    | "3xs"
    | "4"
    | "4xl"
    | "5"
    | "5xl"
    | "6"
    | "6xl"
    | "7"
    | "7xl"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "auto"
    | "dvh"
    | "dvw"
    | "fit"
    | "full"
    | "lg"
    | "lvh"
    | "lvw"
    | "max"
    | "md"
    | "min"
    | "px"
    | "screen"
    | "sm"
    | "svh"
    | "svw"
    | "xl"
    | "xs"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
type MixBlendModeRef1 =
    | "color"
    | "darken"
    | "difference"
    | "exclusion"
    | "hard-light"
    | "hue"
    | "lighten"
    | "luminosity"
    | "multiply"
    | "normal"
    | "overlay"
    | "plus-darker"
    | "plus-lighter"
    | "saturation"
    | "screen"
    | "soft-light"
type MixBlendModeRef2 = "burn" | "dodge"
type ObjectPositionRef1 = "left" | "right"
type ObjectPositionRef2 = "left" | "right"
type ObjectPositionRef3 = "bottom" | "center" | "left" | "right" | "top"
type ObjectFitRef1 = "contain" | "cover" | "fill" | "none" | "scale-down"
type OpacityRef1 =
    | "0"
    | "5"
    | "10"
    | "15"
    | "20"
    | "25"
    | "30"
    | "35"
    | "40"
    | "45"
    | "50"
    | "55"
    | "60"
    | "65"
    | "70"
    | "75"
    | "80"
    | "85"
    | "90"
    | "95"
    | "100"
type TransformOriginRef1 = "left" | "right"
type TransformOriginRef2 = "left" | "right"
type TransformOriginRef3 = "bottom" | "center" | "left" | "right" | "top"
type OutlineWidthRef1 = "foreground"
type OutlineWidthRef2 = "1" | "2" | "3" | "4" | "5"
type OutlineWidthRef3 = "foreground"
type OutlineWidthRef4 =
    | "accent"
    | "accent-foreground"
    | "border"
    | "foreground"
    | "primary"
    | "primary-foreground"
    | "ring"
type OutlineWidthRef5 =
    | "0"
    | "1"
    | "2"
    | "4"
    | "8"
    | "accent"
    | "background"
    | "border"
    | "card"
    | "card-foreground"
    | "destructive"
    | "foreground"
    | "input"
    | "muted"
    | "muted-foreground"
    | "popover"
    | "popover-foreground"
    | "primary"
    | "ring"
    | "secondary"
    | "secondary-foreground"
    | "sidebar"
type OutlineColorRef1 =
    | "current"
    | "inherit"
    | "transparent"
    | TailwindGlobalColor
type OutlineStyleRef1 =
    | "dashed"
    | "dotted"
    | "double"
    | "hidden"
    | "none"
    | "solid"
type OverflowRef1 = "auto" | "clip" | "hidden" | "scroll" | "visible"
type OverflowRef2 = "auto" | "clip" | "hidden" | "scroll" | "visible"
type OverflowRef3 = "auto" | "clip" | "hidden" | "scroll" | "visible"
type OverscrollBehaviorRef1 = "auto" | "contain" | "none"
type OverscrollBehaviorRef2 = "auto" | "contain" | "none"
type OverscrollBehaviorRef3 = "auto" | "contain" | "none"
type PaddingRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "px"
type PerspectiveRef1 =
    | "distant"
    | "dramatic"
    | "midrange"
    | "near"
    | "none"
    | "normal"
type PerspectiveOriginRef1 = "left" | "right"
type PerspectiveOriginRef2 = "left" | "right"
type PerspectiveOriginRef3 = "bottom" | "center" | "left" | "right" | "top"
type PlaceContentRef1 =
    | "around"
    | "baseline"
    | "between"
    | "center"
    | "center-safe"
    | "end"
    | "end-safe"
    | "evenly"
    | "start"
    | "stretch"
type PlaceItemsRef1 =
    | "baseline"
    | "center"
    | "center-safe"
    | "end"
    | "end-safe"
    | "start"
    | "stretch"
type PlaceSelfRef1 =
    | "auto"
    | "center"
    | "center-safe"
    | "end"
    | "end-safe"
    | "start"
    | "stretch"
type ColorRef1 = "foreground"
type ColorRef2 = "1" | "2" | "3" | "4" | "5"
type ColorRef3 = "foreground"
type ColorRef4 =
    | "accent"
    | "accent-foreground"
    | "border"
    | "foreground"
    | "primary"
    | "primary-foreground"
    | "ring"
type ColorRef5 = "foreground"
type ColorRef6 = "1" | "2" | "3" | "4" | "5"
type ColorRef7 = "foreground"
type ColorRef8 =
    | "accent"
    | "background"
    | "border"
    | "card"
    | "card-foreground"
    | "current"
    | "destructive"
    | "foreground"
    | "inherit"
    | "input"
    | "muted"
    | "muted-foreground"
    | "popover"
    | "popover-foreground"
    | "primary"
    | "ring"
    | "secondary"
    | "secondary-foreground"
    | "sidebar"
    | "transparent"
    | TailwindGlobalColor
type AnimationIterationCountRef1 = "0" | "1" | "infinite" | "initial"
type ResizeRef1 = "none" | "x" | "y"
type BorderRadiusRef1 =
    | "2xl"
    | "3xl"
    | "4xl"
    | "full"
    | "lg"
    | "md"
    | "none"
    | "sm"
    | "xl"
    | "xs"
type ColorSchemeRef1 = "dark"
type ColorSchemeRef2 = "dark" | "light" | "normal" | "only-dark" | "only-light"
type ScrollPaddingRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "px"
type UserSelectRef1 = "all" | "auto" | "none" | "text"
type AlignSelfRef1 =
    | "auto"
    | "baseline"
    | "baseline-last"
    | "center"
    | "center-safe"
    | "end"
    | "end-safe"
    | "start"
    | "stretch"
type WidthRef1 =
    | "0"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96"
    | "1/2"
    | "1/3"
    | "1/4"
    | "1/5"
    | "1/6"
    | "1/12"
    | "2/3"
    | "2/4"
    | "2/5"
    | "2/6"
    | "2/12"
    | "3/4"
    | "3/5"
    | "3/6"
    | "3/12"
    | "4/5"
    | "4/6"
    | "4/12"
    | "5/6"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
    | "auto"
    | "dvh"
    | "dvw"
    | "fit"
    | "full"
    | "lvh"
    | "lvw"
    | "max"
    | "min"
    | "px"
    | "svh"
    | "svw"
type ScrollSnapAlignRef1 = "align-none" | "center" | "end" | "start"
type ScrollSnapTypeRef1 =
    | "both"
    | "mandatory"
    | "none"
    | "proximity"
    | "x"
    | "y"
type StrokeWidthRef1 = "foreground"
type StrokeWidthRef2 = "1" | "2" | "3" | "4" | "5"
type StrokeWidthRef3 = "foreground"
type StrokeWidthRef4 =
    | "accent"
    | "accent-foreground"
    | "border"
    | "foreground"
    | "primary"
    | "primary-foreground"
    | "ring"
type StrokeWidthRef5 =
    | "0"
    | "1"
    | "2"
    | "3"
    | "accent"
    | "background"
    | "border"
    | "card"
    | "card-foreground"
    | "destructive"
    | "foreground"
    | "input"
    | "muted"
    | "muted-foreground"
    | "popover"
    | "popover-foreground"
    | "primary"
    | "ring"
    | "secondary"
    | "secondary-foreground"
    | "sidebar"
type StrokeRef1 =
    | "current"
    | "inherit"
    | "none"
    | "transparent"
    | TailwindGlobalColor
type FontSizeRef1 =
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl"
    | "base"
    | "lg"
    | "sm"
    | "xl"
    | "xs"
type TextWrapRef1 = "balance" | "nowrap" | "pretty" | "wrap"
type TextAlignRef1 = "center" | "end" | "justify" | "left" | "right" | "start"
type TextShadowRef1 = "foreground"
type TextShadowRef2 = "1" | "2" | "3" | "4" | "5"
type TextShadowRef3 = "foreground"
type TextShadowRef4 =
    | "accent"
    | "accent-foreground"
    | "border"
    | "foreground"
    | "primary"
    | "primary-foreground"
    | "ring"
type TextShadowRef5 =
    | "2xs"
    | "accent"
    | "background"
    | "border"
    | "card"
    | "card-foreground"
    | "current"
    | "destructive"
    | "foreground"
    | "inherit"
    | "initial"
    | "input"
    | "lg"
    | "md"
    | "muted"
    | "muted-foreground"
    | "none"
    | "popover"
    | "popover-foreground"
    | "primary"
    | "ring"
    | "secondary"
    | "secondary-foreground"
    | "sidebar"
    | "sm"
    | "transparent"
    | "xs"
    | TailwindGlobalColor
type TouchActionRef1 = "down" | "left" | "right" | "up" | "x" | "y"
type TouchActionRef2 = "auto" | "manipulation" | "none" | "pinch-zoom"
type TransformRef1 = "cpu" | "gpu" | "none"
type TransformBoxRef1 = "border" | "content" | "fill" | "stroke" | "view"
type TransitionPropertyRef1 =
    | "all"
    | "colors"
    | "none"
    | "opacity"
    | "shadow"
    | "transform"
type WhiteSpaceRef1 = "line" | "wrap"
type WhiteSpaceRef2 = "break-spaces" | "normal" | "nowrap" | "pre"
type WillChangeRef1 = "auto" | "contents" | "scroll" | "transform"
type OverflowWrapRef1 = "anywhere" | "break-word" | "normal"
type BackgroundImageBgconicLiteral = `bg-conic-${BackgroundImageRef1}`
type BackgroundImageBgconicLiteralWithSign =
    | BackgroundImageBgconicLiteral
    | `-${BackgroundImageBgconicLiteral}`
type BackgroundImageBglinearLiteral = `bg-linear-${BackgroundImageRef1}`
type BackgroundImageBglinearLiteralWithSign =
    | BackgroundImageBglinearLiteral
    | `-${BackgroundImageBglinearLiteral}`
type BackgroundImageBglineartoLiteral = `bg-linear-to-${BackgroundImageRef2}`
type BackgroundImageBglineartoLiteralWithSign =
    | BackgroundImageBglineartoLiteral
    | `-${BackgroundImageBglineartoLiteral}`
type BackgroundImageFromaccentLiteral = `from-accent-${BackgroundImageRef3}`
type BackgroundImageFromaccentLiteralWithSign =
    | BackgroundImageFromaccentLiteral
    | `-${BackgroundImageFromaccentLiteral}`
type BackgroundImageFromchartLiteral = `from-chart-${BackgroundImageRef4}`
type BackgroundImageFromchartLiteralWithSign =
    | BackgroundImageFromchartLiteral
    | `-${BackgroundImageFromchartLiteral}`
type BackgroundImageFromprimaryLiteral = `from-primary-${BackgroundImageRef5}`
type BackgroundImageFromprimaryLiteralWithSign =
    | BackgroundImageFromprimaryLiteral
    | `-${BackgroundImageFromprimaryLiteral}`
type BackgroundImageFromsidebarLiteral = `from-sidebar-${BackgroundImageRef6}`
type BackgroundImageFromsidebarLiteralWithSign =
    | BackgroundImageFromsidebarLiteral
    | `-${BackgroundImageFromsidebarLiteral}`
type BackgroundImageToaccentLiteral = `to-accent-${BackgroundImageRef7}`
type BackgroundImageToaccentLiteralWithSign =
    | BackgroundImageToaccentLiteral
    | `-${BackgroundImageToaccentLiteral}`
type BackgroundImageTochartLiteral = `to-chart-${BackgroundImageRef8}`
type BackgroundImageTochartLiteralWithSign =
    | BackgroundImageTochartLiteral
    | `-${BackgroundImageTochartLiteral}`
type BackgroundImageToprimaryLiteral = `to-primary-${BackgroundImageRef9}`
type BackgroundImageToprimaryLiteralWithSign =
    | BackgroundImageToprimaryLiteral
    | `-${BackgroundImageToprimaryLiteral}`
type BackgroundImageTosidebarLiteral = `to-sidebar-${BackgroundImageRef6}`
type BackgroundImageTosidebarLiteralWithSign =
    | BackgroundImageTosidebarLiteral
    | `-${BackgroundImageTosidebarLiteral}`
type BackgroundImageViaaccentLiteral = `via-accent-${BackgroundImageRef10}`
type BackgroundImageViaaccentLiteralWithSign =
    | BackgroundImageViaaccentLiteral
    | `-${BackgroundImageViaaccentLiteral}`
type BackgroundImageViachartLiteral = `via-chart-${BackgroundImageRef11}`
type BackgroundImageViachartLiteralWithSign =
    | BackgroundImageViachartLiteral
    | `-${BackgroundImageViachartLiteral}`
type BackgroundImageViaprimaryLiteral = `via-primary-${BackgroundImageRef12}`
type BackgroundImageViaprimaryLiteralWithSign =
    | BackgroundImageViaprimaryLiteral
    | `-${BackgroundImageViaprimaryLiteral}`
type BackgroundImageViasidebarLiteral = `via-sidebar-${BackgroundImageRef6}`
type BackgroundImageViasidebarLiteralWithSign =
    | BackgroundImageViasidebarLiteral
    | `-${BackgroundImageViasidebarLiteral}`
type BackgroundImageBgLiteral = `bg-${BackgroundImageRef13}`
type BackgroundImageBgLiteralWithSign =
    | BackgroundImageBgLiteral
    | `-${BackgroundImageBgLiteral}`
type BackgroundImageFromLiteral = `from-${BackgroundImageRef14}`
type BackgroundImageFromLiteralWithSign =
    | BackgroundImageFromLiteral
    | `-${BackgroundImageFromLiteral}`
type BackgroundImageToLiteral = `to-${BackgroundImageRef14}`
type BackgroundImageToLiteralWithSign =
    | BackgroundImageToLiteral
    | `-${BackgroundImageToLiteral}`
type BackgroundImageViaLiteral = `via-${BackgroundImageRef14}` | "via-none"
type BackgroundImageViaLiteralWithSign =
    | BackgroundImageViaLiteral
    | `-${BackgroundImageViaLiteral}`
type BackgroundImageProperty =
    | BackgroundImageBgconicLiteralWithSign
    | BackgroundImageBglinearLiteralWithSign
    | BackgroundImageBglineartoLiteralWithSign
    | BackgroundImageFromaccentLiteralWithSign
    | BackgroundImageFromchartLiteralWithSign
    | BackgroundImageFromprimaryLiteralWithSign
    | BackgroundImageFromsidebarLiteralWithSign
    | BackgroundImageToaccentLiteralWithSign
    | BackgroundImageTochartLiteralWithSign
    | BackgroundImageToprimaryLiteralWithSign
    | BackgroundImageTosidebarLiteralWithSign
    | BackgroundImageViaaccentLiteralWithSign
    | BackgroundImageViachartLiteralWithSign
    | BackgroundImageViaprimaryLiteralWithSign
    | BackgroundImageViasidebarLiteralWithSign
    | BackgroundImageBgLiteralWithSign
    | BackgroundImageFromLiteralWithSign
    | BackgroundImageToLiteralWithSign
    | BackgroundImageViaLiteralWithSign
type BackgroundImageArbitraryValue =
    | (`bg-conic-${number}` & {})
    | (`bg-conic-${number}` & {})
    | (`-bg-conic-${number}` & {})
    | (`bg-conic-(${string})` & {})
    | (`bg-conic-[${string}]` & {})
    | (`bg-linear-${number}` & {})
    | (`bg-linear-${number}` & {})
    | (`-bg-linear-${number}` & {})
    | (`bg-linear-(${string})` & {})
    | (`bg-linear-[${string}]` & {})
    | (`bg-[${string}]` & {})
    | (`bg-(${string})` & {})
    | (`bg-${number}` & {})
    | (`bg-${number}` & {})
    | (`-bg-${number}` & {})
    | (`from-${number}` & {})
    | (`from-(${string})` & {})
    | (`from-[${string}]` & {})
    | (`to-${number}` & {})
    | (`to-(${string})` & {})
    | (`to-[${string}]` & {})
    | (`via-${number}` & {})
    | (`via-(${string})` & {})
    | (`via-[${string}]` & {})
type BackgroundImageValue =
    | BackgroundImageProperty
    | (`bg-conic-${string}/${Variants1316686d}` & {})
    | (`bg-linear-${string}/${Variants1316686d}` & {})
    | (`bg-linear-to-${string}/${Variants1316686d}` & {})
    | (`from-accent-${string}/${Variants1316686d}` & {})
    | (`from-chart-${string}/${Variants1316686d}` & {})
    | (`from-primary-${string}/${Variants1316686d}` & {})
    | (`from-sidebar-${string}/${Variants1316686d}` & {})
    | (`to-accent-${string}/${Variants1316686d}` & {})
    | (`to-chart-${string}/${Variants1316686d}` & {})
    | (`to-primary-${string}/${Variants1316686d}` & {})
    | (`to-sidebar-${string}/${Variants1316686d}` & {})
    | (`via-accent-${string}/${Variants1316686d}` & {})
    | (`via-chart-${string}/${Variants1316686d}` & {})
    | (`via-primary-${string}/${Variants1316686d}` & {})
    | (`via-sidebar-${string}/${Variants1316686d}` & {})
    | (`bg-${string}/${Variants1316686d}` & {})
    | (`from-${string}/${Variants1316686d}` & {})
    | (`to-${string}/${Variants1316686d}` & {})
    | (`via-${string}/${Variants1316686d}` & {})
    | BackgroundImageArbitraryValue
interface TailwindBackgroundImage {
    /**
     * `BackgroundImage`
     *
     * Utilities for controlling an element's background image.
     *
     * Arbitrary support
     *
     * `bg-conic-<number>`, `-bg-conic-<number>`, `bg-conic-(<var-name>)`,
     * `bg-conic-[<arbitrary-value>]`, `bg-linear-<number>` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/background-image Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-image , MDN docs}
     */
    backgroundImage: BackgroundImageValue
}
type BottomLiteral = `bottom-${BottomRef1}`
type BottomLiteralWithSign = BottomLiteral | `-${BottomLiteral}`
type BottomProperty = BottomLiteralWithSign
type BottomArbitraryValue =
    | (`bottom-${number}` & {})
    | (`bottom-${number}` & {})
    | (`-bottom-${number}` & {})
    | (`bottom-(${string})` & {})
    | (`bottom-[${string}]` & {})
type BottomValue = BottomProperty | BottomArbitraryValue
interface TailwindBottom {
    /**
     * `Bottom`
     *
     * Utilities for controlling the placement of positioned elements.
     *
     * Arbitrary support
     *
     * `bottom-<number>`, `-bottom-<number>`, `bottom-(<var-name>)`,
     * `bottom-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/top-right-bottom-left Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/bottom , MDN docs}
     */
    bottom: BottomValue
}
type GridColumnColendLiteral = `col-end-${GridColumnRef1}`
type GridColumnColendLiteralWithSign =
    | GridColumnColendLiteral
    | `-${GridColumnColendLiteral}`
type GridColumnColstartLiteral = `col-start-${GridColumnRef1}`
type GridColumnColstartLiteralWithSign =
    | GridColumnColstartLiteral
    | `-${GridColumnColstartLiteral}`
type GridColumnColspanLiteral = `col-span-${GridColumnRef2}`
type GridColumnColspanLiteralWithSign =
    | GridColumnColspanLiteral
    | `-${GridColumnColspanLiteral}`
type GridColumnColLiteral = `col-${GridColumnRef3}`
type GridColumnColLiteralWithSign =
    | GridColumnColLiteral
    | `-${GridColumnColLiteral}`
type GridColumnProperty =
    | GridColumnColendLiteralWithSign
    | GridColumnColstartLiteralWithSign
    | GridColumnColspanLiteralWithSign
    | GridColumnColLiteralWithSign
type GridColumnArbitraryValue =
    | (`col-end-${number}` & {})
    | (`col-end-${number}` & {})
    | (`-col-end-${number}` & {})
    | (`col-end-(${string})` & {})
    | (`col-end-[${string}]` & {})
    | (`col-start-${number}` & {})
    | (`col-start-${number}` & {})
    | (`-col-start-${number}` & {})
    | (`col-start-(${string})` & {})
    | (`col-start-[${string}]` & {})
    | (`col-span-${number}` & {})
    | (`col-span-(${string})` & {})
    | (`col-span-[${string}]` & {})
    | (`col-${number}` & {})
    | (`col-(${string})` & {})
    | (`col-[${string}]` & {})
    | (`col-${number}` & {})
    | (`-col-${number}` & {})
type GridColumnValue = GridColumnProperty | GridColumnArbitraryValue
interface TailwindGridColumn {
    /**
     * `GridColumn`
     *
     * Utilities for controlling how elements are sized and placed across grid
     * columns.
     *
     * Arbitrary support
     *
     * `col-end-<number>`, `-col-end-<number>`, `col-end-(<var-name>)`,
     * `col-end-[<arbitrary-value>]`, `col-start-<number>` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/grid-column Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column , MDN docs}
     */
    gridColumn: GridColumnValue
}
type EndLiteral = `end-${EndRef1}`
type EndLiteralWithSign = EndLiteral | `-${EndLiteral}`
type EndInsetbeLiteral = `inset-be-${EndRef2}`
type EndInsetbeLiteralWithSign = EndInsetbeLiteral | `-${EndInsetbeLiteral}`
type EndValue = EndLiteralWithSign | EndInsetbeLiteralWithSign
interface TailwindEnd {
    /**
     * `End`
     *
     * @see
     * {@link https://tailwindcss.com/docs Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/end , MDN docs}
     */
    end: EndValue
}
type TextIndentIndentLiteral = `indent-${TextIndentRef1}`
type TextIndentIndentLiteralWithSign =
    | TextIndentIndentLiteral
    | `-${TextIndentIndentLiteral}`
type TextIndentProperty = TextIndentIndentLiteralWithSign
type TextIndentArbitraryValue =
    | (`indent-${number}` & {})
    | (`indent-${number}` & {})
    | (`-indent-${number}` & {})
    | (`indent-(${string})` & {})
    | (`indent-[${string}]` & {})
type TextIndentValue = TextIndentProperty | TextIndentArbitraryValue
interface TailwindTextIndent {
    /**
     * `TextIndent`
     *
     * Utilities for controlling the amount of empty space shown before text in a
     * block.
     *
     * Arbitrary support
     *
     * `indent-<number>`, `-indent-<number>`, `indent-(<var-name>)`,
     * `indent-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/text-indent Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/text-indent , MDN docs}
     */
    textIndent: TextIndentValue
}
type InsetELiteral = `inset-e-${InsetRef1}`
type InsetELiteralWithSign = InsetELiteral | `-${InsetELiteral}`
type InsetSLiteral = `inset-s-${InsetRef1}`
type InsetSLiteralWithSign = InsetSLiteral | `-${InsetSLiteral}`
type InsetXLiteral = `inset-x-${InsetRef1}`
type InsetXLiteralWithSign = InsetXLiteral | `-${InsetXLiteral}`
type InsetYLiteral = `inset-y-${InsetRef1}`
type InsetYLiteralWithSign = InsetYLiteral | `-${InsetYLiteral}`
type InsetLiteral = `inset-${InsetRef1}`
type InsetLiteralWithSign = InsetLiteral | `-${InsetLiteral}`
type InsetValue =
    | InsetELiteralWithSign
    | InsetSLiteralWithSign
    | InsetXLiteralWithSign
    | InsetYLiteralWithSign
    | InsetLiteralWithSign
interface TailwindInset {
    /**
     * `Inset`
     *
     * @see
     * {@link https://tailwindcss.com/docs Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/inset , MDN docs}
     */
    inset: InsetValue
}
type StartInsetbsLiteral = `inset-bs-${StartRef1}`
type StartInsetbsLiteralWithSign =
    | StartInsetbsLiteral
    | `-${StartInsetbsLiteral}`
type StartLiteral = `start-${StartRef2}`
type StartLiteralWithSign = StartLiteral | `-${StartLiteral}`
type StartValue = StartInsetbsLiteralWithSign | StartLiteralWithSign
interface TailwindStart {
    /**
     * `Start`
     *
     * @see
     * {@link https://tailwindcss.com/docs Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/start , MDN docs}
     */
    start: StartValue
}
type LeftLiteral = `left-${LeftRef1}`
type LeftLiteralWithSign = LeftLiteral | `-${LeftLiteral}`
type LeftProperty = LeftLiteralWithSign
type LeftArbitraryValue =
    | (`left-${number}` & {})
    | (`left-${number}` & {})
    | (`-left-${number}` & {})
    | (`left-(${string})` & {})
    | (`left-[${string}]` & {})
type LeftValue = LeftProperty | LeftArbitraryValue
interface TailwindLeft {
    /**
     * `Left`
     *
     * Utilities for controlling the placement of positioned elements.
     *
     * Arbitrary support
     *
     * `left-<number>`, `-left-<number>`, `left-(<var-name>)`,
     * `left-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/top-right-bottom-left Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/left , MDN docs}
     */
    left: LeftValue
}
type MarginMLiteral = `m-${MarginRef1}`
type MarginMLiteralWithSign = MarginMLiteral | `-${MarginMLiteral}`
type MarginMbLiteral = `mb-${MarginRef1}`
type MarginMbLiteralWithSign = MarginMbLiteral | `-${MarginMbLiteral}`
type MarginMbeLiteral = `mbe-${MarginRef1}`
type MarginMbeLiteralWithSign = MarginMbeLiteral | `-${MarginMbeLiteral}`
type MarginMbsLiteral = `mbs-${MarginRef1}`
type MarginMbsLiteralWithSign = MarginMbsLiteral | `-${MarginMbsLiteral}`
type MarginMeLiteral = `me-${MarginRef1}`
type MarginMeLiteralWithSign = MarginMeLiteral | `-${MarginMeLiteral}`
type MarginMlLiteral = `ml-${MarginRef1}`
type MarginMlLiteralWithSign = MarginMlLiteral | `-${MarginMlLiteral}`
type MarginMrLiteral = `mr-${MarginRef1}`
type MarginMrLiteralWithSign = MarginMrLiteral | `-${MarginMrLiteral}`
type MarginMsLiteral = `ms-${MarginRef1}`
type MarginMsLiteralWithSign = MarginMsLiteral | `-${MarginMsLiteral}`
type MarginMtLiteral = `mt-${MarginRef1}`
type MarginMtLiteralWithSign = MarginMtLiteral | `-${MarginMtLiteral}`
type MarginMxLiteral = `mx-${MarginRef1}`
type MarginMxLiteralWithSign = MarginMxLiteral | `-${MarginMxLiteral}`
type MarginMyLiteral = `my-${MarginRef1}`
type MarginMyLiteralWithSign = MarginMyLiteral | `-${MarginMyLiteral}`
type MarginSpacexLiteral = `space-x-${MarginRef2}`
type MarginSpacexLiteralWithSign =
    | MarginSpacexLiteral
    | `-${MarginSpacexLiteral}`
type MarginSpaceyLiteral = `space-y-${MarginRef2}`
type MarginSpaceyLiteralWithSign =
    | MarginSpaceyLiteral
    | `-${MarginSpaceyLiteral}`
type MarginProperty =
    | MarginMLiteralWithSign
    | MarginMbLiteralWithSign
    | MarginMbeLiteralWithSign
    | MarginMbsLiteralWithSign
    | MarginMeLiteralWithSign
    | MarginMlLiteralWithSign
    | MarginMrLiteralWithSign
    | MarginMsLiteralWithSign
    | MarginMtLiteralWithSign
    | MarginMxLiteralWithSign
    | MarginMyLiteralWithSign
    | MarginSpacexLiteralWithSign
    | MarginSpaceyLiteralWithSign
type MarginArbitraryValue =
    | (`m-${number}` & {})
    | (`m-${number}` & {})
    | (`-m-${number}` & {})
    | (`m-(${string})` & {})
    | (`m-[${string}]` & {})
    | (`mb-${number}` & {})
    | (`mb-${number}` & {})
    | (`-mb-${number}` & {})
    | (`mb-(${string})` & {})
    | (`mb-[${string}]` & {})
    | (`mbe-${number}` & {})
    | (`mbe-${number}` & {})
    | (`-mbe-${number}` & {})
    | (`mbe-(${string})` & {})
    | (`mbe-[${string}]` & {})
    | (`mbs-${number}` & {})
    | (`mbs-${number}` & {})
    | (`-mbs-${number}` & {})
    | (`mbs-(${string})` & {})
    | (`mbs-[${string}]` & {})
    | (`me-${number}` & {})
    | (`me-${number}` & {})
    | (`-me-${number}` & {})
    | (`me-(${string})` & {})
    | (`me-[${string}]` & {})
    | (`ml-${number}` & {})
    | (`ml-${number}` & {})
    | (`-ml-${number}` & {})
    | (`ml-(${string})` & {})
    | (`ml-[${string}]` & {})
    | (`mr-${number}` & {})
    | (`mr-${number}` & {})
    | (`-mr-${number}` & {})
    | (`mr-(${string})` & {})
    | (`mr-[${string}]` & {})
    | (`ms-${number}` & {})
    | (`ms-${number}` & {})
    | (`-ms-${number}` & {})
    | (`ms-(${string})` & {})
    | (`ms-[${string}]` & {})
    | (`mt-${number}` & {})
    | (`mt-${number}` & {})
    | (`-mt-${number}` & {})
    | (`mt-(${string})` & {})
    | (`mt-[${string}]` & {})
    | (`mx-${number}` & {})
    | (`mx-${number}` & {})
    | (`-mx-${number}` & {})
    | (`mx-(${string})` & {})
    | (`mx-[${string}]` & {})
    | (`my-${number}` & {})
    | (`my-${number}` & {})
    | (`-my-${number}` & {})
    | (`my-(${string})` & {})
    | (`my-[${string}]` & {})
    | (`space-x-${number}` & {})
    | (`space-x-${number}` & {})
    | (`-space-x-${number}` & {})
    | (`space-x-(${string})` & {})
    | (`space-x-[${string}]` & {})
    | (`space-y-${number}` & {})
    | (`space-y-${number}` & {})
    | (`-space-y-${number}` & {})
    | (`space-y-(${string})` & {})
    | (`space-y-[${string}]` & {})
type MarginValue = MarginProperty | MarginArbitraryValue
interface TailwindMargin {
    /**
     * `Margin`
     *
     * Utilities for controlling an element's margin.
     *
     * Arbitrary support
     *
     * `m-<number>`, `-m-<number>`, `m-(<var-name>)`, `m-[<arbitrary-value>]`,
     * `mb-<number>` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/margin Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/margin , MDN docs}
     */
    margin: MarginValue
}
type MaskImageMaskconicfromaccentLiteral =
    `mask-conic-from-accent-${MaskImageRef1}`
type MaskImageMaskconicfromaccentLiteralWithSign =
    | MaskImageMaskconicfromaccentLiteral
    | `-${MaskImageMaskconicfromaccentLiteral}`
type MaskImageMaskconicfromchartLiteral =
    `mask-conic-from-chart-${MaskImageRef2}`
type MaskImageMaskconicfromchartLiteralWithSign =
    | MaskImageMaskconicfromchartLiteral
    | `-${MaskImageMaskconicfromchartLiteral}`
type MaskImageMaskconicfromprimaryLiteral =
    `mask-conic-from-primary-${MaskImageRef3}`
type MaskImageMaskconicfromprimaryLiteralWithSign =
    | MaskImageMaskconicfromprimaryLiteral
    | `-${MaskImageMaskconicfromprimaryLiteral}`
type MaskImageMaskconicfromsidebarLiteral =
    `mask-conic-from-sidebar-${MaskImageRef4}`
type MaskImageMaskconicfromsidebarLiteralWithSign =
    | MaskImageMaskconicfromsidebarLiteral
    | `-${MaskImageMaskconicfromsidebarLiteral}`
type MaskImageMaskconictoaccentLiteral = `mask-conic-to-accent-${MaskImageRef5}`
type MaskImageMaskconictoaccentLiteralWithSign =
    | MaskImageMaskconictoaccentLiteral
    | `-${MaskImageMaskconictoaccentLiteral}`
type MaskImageMaskconictochartLiteral = `mask-conic-to-chart-${MaskImageRef6}`
type MaskImageMaskconictochartLiteralWithSign =
    | MaskImageMaskconictochartLiteral
    | `-${MaskImageMaskconictochartLiteral}`
type MaskImageMaskconictoprimaryLiteral =
    `mask-conic-to-primary-${MaskImageRef7}`
type MaskImageMaskconictoprimaryLiteralWithSign =
    | MaskImageMaskconictoprimaryLiteral
    | `-${MaskImageMaskconictoprimaryLiteral}`
type MaskImageMaskconictosidebarLiteral =
    `mask-conic-to-sidebar-${MaskImageRef4}`
type MaskImageMaskconictosidebarLiteralWithSign =
    | MaskImageMaskconictosidebarLiteral
    | `-${MaskImageMaskconictosidebarLiteral}`
type MaskImageMasklinearfromaccentLiteral =
    `mask-linear-from-accent-${MaskImageRef8}`
type MaskImageMasklinearfromaccentLiteralWithSign =
    | MaskImageMasklinearfromaccentLiteral
    | `-${MaskImageMasklinearfromaccentLiteral}`
type MaskImageMasklinearfromchartLiteral =
    `mask-linear-from-chart-${MaskImageRef9}`
type MaskImageMasklinearfromchartLiteralWithSign =
    | MaskImageMasklinearfromchartLiteral
    | `-${MaskImageMasklinearfromchartLiteral}`
type MaskImageMasklinearfromprimaryLiteral =
    `mask-linear-from-primary-${MaskImageRef10}`
type MaskImageMasklinearfromprimaryLiteralWithSign =
    | MaskImageMasklinearfromprimaryLiteral
    | `-${MaskImageMasklinearfromprimaryLiteral}`
type MaskImageMasklinearfromsidebarLiteral =
    `mask-linear-from-sidebar-${MaskImageRef4}`
type MaskImageMasklinearfromsidebarLiteralWithSign =
    | MaskImageMasklinearfromsidebarLiteral
    | `-${MaskImageMasklinearfromsidebarLiteral}`
type MaskImageMasklineartoaccentLiteral =
    `mask-linear-to-accent-${MaskImageRef11}`
type MaskImageMasklineartoaccentLiteralWithSign =
    | MaskImageMasklineartoaccentLiteral
    | `-${MaskImageMasklineartoaccentLiteral}`
type MaskImageMasklineartochartLiteral =
    `mask-linear-to-chart-${MaskImageRef12}`
type MaskImageMasklineartochartLiteralWithSign =
    | MaskImageMasklineartochartLiteral
    | `-${MaskImageMasklineartochartLiteral}`
type MaskImageMasklineartoprimaryLiteral =
    `mask-linear-to-primary-${MaskImageRef13}`
type MaskImageMasklineartoprimaryLiteralWithSign =
    | MaskImageMasklineartoprimaryLiteral
    | `-${MaskImageMasklineartoprimaryLiteral}`
type MaskImageMasklineartosidebarLiteral =
    `mask-linear-to-sidebar-${MaskImageRef4}`
type MaskImageMasklineartosidebarLiteralWithSign =
    | MaskImageMasklineartosidebarLiteral
    | `-${MaskImageMasklineartosidebarLiteral}`
type MaskImageMaskbfromaccentLiteral = `mask-b-from-accent-${MaskImageRef14}`
type MaskImageMaskbfromaccentLiteralWithSign =
    | MaskImageMaskbfromaccentLiteral
    | `-${MaskImageMaskbfromaccentLiteral}`
type MaskImageMaskbfromchartLiteral = `mask-b-from-chart-${MaskImageRef15}`
type MaskImageMaskbfromchartLiteralWithSign =
    | MaskImageMaskbfromchartLiteral
    | `-${MaskImageMaskbfromchartLiteral}`
type MaskImageMaskbfromprimaryLiteral = `mask-b-from-primary-${MaskImageRef16}`
type MaskImageMaskbfromprimaryLiteralWithSign =
    | MaskImageMaskbfromprimaryLiteral
    | `-${MaskImageMaskbfromprimaryLiteral}`
type MaskImageMaskbfromsidebarLiteral = `mask-b-from-sidebar-${MaskImageRef4}`
type MaskImageMaskbfromsidebarLiteralWithSign =
    | MaskImageMaskbfromsidebarLiteral
    | `-${MaskImageMaskbfromsidebarLiteral}`
type MaskImageMaskbtoaccentLiteral = `mask-b-to-accent-${MaskImageRef17}`
type MaskImageMaskbtoaccentLiteralWithSign =
    | MaskImageMaskbtoaccentLiteral
    | `-${MaskImageMaskbtoaccentLiteral}`
type MaskImageMaskbtochartLiteral = `mask-b-to-chart-${MaskImageRef18}`
type MaskImageMaskbtochartLiteralWithSign =
    | MaskImageMaskbtochartLiteral
    | `-${MaskImageMaskbtochartLiteral}`
type MaskImageMaskbtoprimaryLiteral = `mask-b-to-primary-${MaskImageRef19}`
type MaskImageMaskbtoprimaryLiteralWithSign =
    | MaskImageMaskbtoprimaryLiteral
    | `-${MaskImageMaskbtoprimaryLiteral}`
type MaskImageMaskbtosidebarLiteral = `mask-b-to-sidebar-${MaskImageRef4}`
type MaskImageMaskbtosidebarLiteralWithSign =
    | MaskImageMaskbtosidebarLiteral
    | `-${MaskImageMaskbtosidebarLiteral}`
type MaskImageMasklfromaccentLiteral = `mask-l-from-accent-${MaskImageRef20}`
type MaskImageMasklfromaccentLiteralWithSign =
    | MaskImageMasklfromaccentLiteral
    | `-${MaskImageMasklfromaccentLiteral}`
type MaskImageMasklfromcardLiteral = `mask-l-from-card-${MaskImageRef21}`
type MaskImageMasklfromcardLiteralWithSign =
    | MaskImageMasklfromcardLiteral
    | `-${MaskImageMasklfromcardLiteral}`
type MaskImageMasklfromchartLiteral = `mask-l-from-chart-${MaskImageRef22}`
type MaskImageMasklfromchartLiteralWithSign =
    | MaskImageMasklfromchartLiteral
    | `-${MaskImageMasklfromchartLiteral}`
type MaskImageMasklfrommutedLiteral = `mask-l-from-muted-${MaskImageRef23}`
type MaskImageMasklfrommutedLiteralWithSign =
    | MaskImageMasklfrommutedLiteral
    | `-${MaskImageMasklfrommutedLiteral}`
type MaskImageMasklfrompopoverLiteral = `mask-l-from-popover-${MaskImageRef24}`
type MaskImageMasklfrompopoverLiteralWithSign =
    | MaskImageMasklfrompopoverLiteral
    | `-${MaskImageMasklfrompopoverLiteral}`
type MaskImageMasklfromprimaryLiteral = `mask-l-from-primary-${MaskImageRef25}`
type MaskImageMasklfromprimaryLiteralWithSign =
    | MaskImageMasklfromprimaryLiteral
    | `-${MaskImageMasklfromprimaryLiteral}`
type MaskImageMasklfromsecondaryLiteral =
    `mask-l-from-secondary-${MaskImageRef26}`
type MaskImageMasklfromsecondaryLiteralWithSign =
    | MaskImageMasklfromsecondaryLiteral
    | `-${MaskImageMasklfromsecondaryLiteral}`
type MaskImageMasklfromsidebarLiteral = `mask-l-from-sidebar-${MaskImageRef4}`
type MaskImageMasklfromsidebarLiteralWithSign =
    | MaskImageMasklfromsidebarLiteral
    | `-${MaskImageMasklfromsidebarLiteral}`
type MaskImageMaskltoaccentLiteral = `mask-l-to-accent-${MaskImageRef27}`
type MaskImageMaskltoaccentLiteralWithSign =
    | MaskImageMaskltoaccentLiteral
    | `-${MaskImageMaskltoaccentLiteral}`
type MaskImageMaskltocardLiteral = `mask-l-to-card-${MaskImageRef28}`
type MaskImageMaskltocardLiteralWithSign =
    | MaskImageMaskltocardLiteral
    | `-${MaskImageMaskltocardLiteral}`
type MaskImageMaskltochartLiteral = `mask-l-to-chart-${MaskImageRef29}`
type MaskImageMaskltochartLiteralWithSign =
    | MaskImageMaskltochartLiteral
    | `-${MaskImageMaskltochartLiteral}`
type MaskImageMaskltomutedLiteral = `mask-l-to-muted-${MaskImageRef30}`
type MaskImageMaskltomutedLiteralWithSign =
    | MaskImageMaskltomutedLiteral
    | `-${MaskImageMaskltomutedLiteral}`
type MaskImageMaskltopopoverLiteral = `mask-l-to-popover-${MaskImageRef31}`
type MaskImageMaskltopopoverLiteralWithSign =
    | MaskImageMaskltopopoverLiteral
    | `-${MaskImageMaskltopopoverLiteral}`
type MaskImageMaskltoprimaryLiteral = `mask-l-to-primary-${MaskImageRef32}`
type MaskImageMaskltoprimaryLiteralWithSign =
    | MaskImageMaskltoprimaryLiteral
    | `-${MaskImageMaskltoprimaryLiteral}`
type MaskImageMaskltosecondaryLiteral = `mask-l-to-secondary-${MaskImageRef33}`
type MaskImageMaskltosecondaryLiteralWithSign =
    | MaskImageMaskltosecondaryLiteral
    | `-${MaskImageMaskltosecondaryLiteral}`
type MaskImageMaskltosidebarLiteral = `mask-l-to-sidebar-${MaskImageRef4}`
type MaskImageMaskltosidebarLiteralWithSign =
    | MaskImageMaskltosidebarLiteral
    | `-${MaskImageMaskltosidebarLiteral}`
type MaskImageMaskrfromaccentLiteral = `mask-r-from-accent-${MaskImageRef34}`
type MaskImageMaskrfromaccentLiteralWithSign =
    | MaskImageMaskrfromaccentLiteral
    | `-${MaskImageMaskrfromaccentLiteral}`
type MaskImageMaskrfromcardLiteral = `mask-r-from-card-${MaskImageRef35}`
type MaskImageMaskrfromcardLiteralWithSign =
    | MaskImageMaskrfromcardLiteral
    | `-${MaskImageMaskrfromcardLiteral}`
type MaskImageMaskrfromchartLiteral = `mask-r-from-chart-${MaskImageRef36}`
type MaskImageMaskrfromchartLiteralWithSign =
    | MaskImageMaskrfromchartLiteral
    | `-${MaskImageMaskrfromchartLiteral}`
type MaskImageMaskrfrommutedLiteral = `mask-r-from-muted-${MaskImageRef37}`
type MaskImageMaskrfrommutedLiteralWithSign =
    | MaskImageMaskrfrommutedLiteral
    | `-${MaskImageMaskrfrommutedLiteral}`
type MaskImageMaskrfrompopoverLiteral = `mask-r-from-popover-${MaskImageRef38}`
type MaskImageMaskrfrompopoverLiteralWithSign =
    | MaskImageMaskrfrompopoverLiteral
    | `-${MaskImageMaskrfrompopoverLiteral}`
type MaskImageMaskrfromprimaryLiteral = `mask-r-from-primary-${MaskImageRef39}`
type MaskImageMaskrfromprimaryLiteralWithSign =
    | MaskImageMaskrfromprimaryLiteral
    | `-${MaskImageMaskrfromprimaryLiteral}`
type MaskImageMaskrfromsecondaryLiteral =
    `mask-r-from-secondary-${MaskImageRef40}`
type MaskImageMaskrfromsecondaryLiteralWithSign =
    | MaskImageMaskrfromsecondaryLiteral
    | `-${MaskImageMaskrfromsecondaryLiteral}`
type MaskImageMaskrfromsidebarLiteral = `mask-r-from-sidebar-${MaskImageRef4}`
type MaskImageMaskrfromsidebarLiteralWithSign =
    | MaskImageMaskrfromsidebarLiteral
    | `-${MaskImageMaskrfromsidebarLiteral}`
type MaskImageMaskrtoaccentLiteral = `mask-r-to-accent-${MaskImageRef41}`
type MaskImageMaskrtoaccentLiteralWithSign =
    | MaskImageMaskrtoaccentLiteral
    | `-${MaskImageMaskrtoaccentLiteral}`
type MaskImageMaskrtocardLiteral = `mask-r-to-card-${MaskImageRef42}`
type MaskImageMaskrtocardLiteralWithSign =
    | MaskImageMaskrtocardLiteral
    | `-${MaskImageMaskrtocardLiteral}`
type MaskImageMaskrtochartLiteral = `mask-r-to-chart-${MaskImageRef43}`
type MaskImageMaskrtochartLiteralWithSign =
    | MaskImageMaskrtochartLiteral
    | `-${MaskImageMaskrtochartLiteral}`
type MaskImageMaskrtomutedLiteral = `mask-r-to-muted-${MaskImageRef44}`
type MaskImageMaskrtomutedLiteralWithSign =
    | MaskImageMaskrtomutedLiteral
    | `-${MaskImageMaskrtomutedLiteral}`
type MaskImageMaskrtopopoverLiteral = `mask-r-to-popover-${MaskImageRef45}`
type MaskImageMaskrtopopoverLiteralWithSign =
    | MaskImageMaskrtopopoverLiteral
    | `-${MaskImageMaskrtopopoverLiteral}`
type MaskImageMaskrtoprimaryLiteral = `mask-r-to-primary-${MaskImageRef46}`
type MaskImageMaskrtoprimaryLiteralWithSign =
    | MaskImageMaskrtoprimaryLiteral
    | `-${MaskImageMaskrtoprimaryLiteral}`
type MaskImageMaskrtosecondaryLiteral = `mask-r-to-secondary-${MaskImageRef47}`
type MaskImageMaskrtosecondaryLiteralWithSign =
    | MaskImageMaskrtosecondaryLiteral
    | `-${MaskImageMaskrtosecondaryLiteral}`
type MaskImageMaskrtosidebarLiteral = `mask-r-to-sidebar-${MaskImageRef4}`
type MaskImageMaskrtosidebarLiteralWithSign =
    | MaskImageMaskrtosidebarLiteral
    | `-${MaskImageMaskrtosidebarLiteral}`
type MaskImageMaskradialatbottomLiteral =
    `mask-radial-at-bottom-${MaskImageRef48}`
type MaskImageMaskradialatbottomLiteralWithSign =
    | MaskImageMaskradialatbottomLiteral
    | `-${MaskImageMaskradialatbottomLiteral}`
type MaskImageMaskradialattopLiteral = `mask-radial-at-top-${MaskImageRef49}`
type MaskImageMaskradialattopLiteralWithSign =
    | MaskImageMaskradialattopLiteral
    | `-${MaskImageMaskradialattopLiteral}`
type MaskImageMaskradialfromaccentLiteral =
    `mask-radial-from-accent-${MaskImageRef50}`
type MaskImageMaskradialfromaccentLiteralWithSign =
    | MaskImageMaskradialfromaccentLiteral
    | `-${MaskImageMaskradialfromaccentLiteral}`
type MaskImageMaskradialfromchartLiteral =
    `mask-radial-from-chart-${MaskImageRef51}`
type MaskImageMaskradialfromchartLiteralWithSign =
    | MaskImageMaskradialfromchartLiteral
    | `-${MaskImageMaskradialfromchartLiteral}`
type MaskImageMaskradialfromprimaryLiteral =
    `mask-radial-from-primary-${MaskImageRef52}`
type MaskImageMaskradialfromprimaryLiteralWithSign =
    | MaskImageMaskradialfromprimaryLiteral
    | `-${MaskImageMaskradialfromprimaryLiteral}`
type MaskImageMaskradialfromsidebarLiteral =
    `mask-radial-from-sidebar-${MaskImageRef4}`
type MaskImageMaskradialfromsidebarLiteralWithSign =
    | MaskImageMaskradialfromsidebarLiteral
    | `-${MaskImageMaskradialfromsidebarLiteral}`
type MaskImageMaskradialtoaccentLiteral =
    `mask-radial-to-accent-${MaskImageRef53}`
type MaskImageMaskradialtoaccentLiteralWithSign =
    | MaskImageMaskradialtoaccentLiteral
    | `-${MaskImageMaskradialtoaccentLiteral}`
type MaskImageMaskradialtochartLiteral =
    `mask-radial-to-chart-${MaskImageRef54}`
type MaskImageMaskradialtochartLiteralWithSign =
    | MaskImageMaskradialtochartLiteral
    | `-${MaskImageMaskradialtochartLiteral}`
type MaskImageMaskradialtoprimaryLiteral =
    `mask-radial-to-primary-${MaskImageRef55}`
type MaskImageMaskradialtoprimaryLiteralWithSign =
    | MaskImageMaskradialtoprimaryLiteral
    | `-${MaskImageMaskradialtoprimaryLiteral}`
type MaskImageMaskradialtosidebarLiteral =
    `mask-radial-to-sidebar-${MaskImageRef4}`
type MaskImageMaskradialtosidebarLiteralWithSign =
    | MaskImageMaskradialtosidebarLiteral
    | `-${MaskImageMaskradialtosidebarLiteral}`
type MaskImageMasktfromaccentLiteral = `mask-t-from-accent-${MaskImageRef56}`
type MaskImageMasktfromaccentLiteralWithSign =
    | MaskImageMasktfromaccentLiteral
    | `-${MaskImageMasktfromaccentLiteral}`
type MaskImageMasktfromchartLiteral = `mask-t-from-chart-${MaskImageRef57}`
type MaskImageMasktfromchartLiteralWithSign =
    | MaskImageMasktfromchartLiteral
    | `-${MaskImageMasktfromchartLiteral}`
type MaskImageMasktfrommutedLiteral = `mask-t-from-muted-${MaskImageRef58}`
type MaskImageMasktfrommutedLiteralWithSign =
    | MaskImageMasktfrommutedLiteral
    | `-${MaskImageMasktfrommutedLiteral}`
type MaskImageMasktfromprimaryLiteral = `mask-t-from-primary-${MaskImageRef59}`
type MaskImageMasktfromprimaryLiteralWithSign =
    | MaskImageMasktfromprimaryLiteral
    | `-${MaskImageMasktfromprimaryLiteral}`
type MaskImageMasktfromsidebarLiteral = `mask-t-from-sidebar-${MaskImageRef4}`
type MaskImageMasktfromsidebarLiteralWithSign =
    | MaskImageMasktfromsidebarLiteral
    | `-${MaskImageMasktfromsidebarLiteral}`
type MaskImageMaskttoaccentLiteral = `mask-t-to-accent-${MaskImageRef60}`
type MaskImageMaskttoaccentLiteralWithSign =
    | MaskImageMaskttoaccentLiteral
    | `-${MaskImageMaskttoaccentLiteral}`
type MaskImageMaskttocardLiteral = `mask-t-to-card-${MaskImageRef61}`
type MaskImageMaskttocardLiteralWithSign =
    | MaskImageMaskttocardLiteral
    | `-${MaskImageMaskttocardLiteral}`
type MaskImageMaskttochartLiteral = `mask-t-to-chart-${MaskImageRef62}`
type MaskImageMaskttochartLiteralWithSign =
    | MaskImageMaskttochartLiteral
    | `-${MaskImageMaskttochartLiteral}`
type MaskImageMaskttomutedLiteral = `mask-t-to-muted-${MaskImageRef63}`
type MaskImageMaskttomutedLiteralWithSign =
    | MaskImageMaskttomutedLiteral
    | `-${MaskImageMaskttomutedLiteral}`
type MaskImageMaskttopopoverLiteral = `mask-t-to-popover-${MaskImageRef64}`
type MaskImageMaskttopopoverLiteralWithSign =
    | MaskImageMaskttopopoverLiteral
    | `-${MaskImageMaskttopopoverLiteral}`
type MaskImageMaskttoprimaryLiteral = `mask-t-to-primary-${MaskImageRef65}`
type MaskImageMaskttoprimaryLiteralWithSign =
    | MaskImageMaskttoprimaryLiteral
    | `-${MaskImageMaskttoprimaryLiteral}`
type MaskImageMaskttosecondaryLiteral = `mask-t-to-secondary-${MaskImageRef66}`
type MaskImageMaskttosecondaryLiteralWithSign =
    | MaskImageMaskttosecondaryLiteral
    | `-${MaskImageMaskttosecondaryLiteral}`
type MaskImageMaskttosidebarLiteral = `mask-t-to-sidebar-${MaskImageRef4}`
type MaskImageMaskttosidebarLiteralWithSign =
    | MaskImageMaskttosidebarLiteral
    | `-${MaskImageMaskttosidebarLiteral}`
type MaskImageMaskxfromaccentLiteral = `mask-x-from-accent-${MaskImageRef67}`
type MaskImageMaskxfromaccentLiteralWithSign =
    | MaskImageMaskxfromaccentLiteral
    | `-${MaskImageMaskxfromaccentLiteral}`
type MaskImageMaskxfromchartLiteral = `mask-x-from-chart-${MaskImageRef68}`
type MaskImageMaskxfromchartLiteralWithSign =
    | MaskImageMaskxfromchartLiteral
    | `-${MaskImageMaskxfromchartLiteral}`
type MaskImageMaskxfromprimaryLiteral = `mask-x-from-primary-${MaskImageRef69}`
type MaskImageMaskxfromprimaryLiteralWithSign =
    | MaskImageMaskxfromprimaryLiteral
    | `-${MaskImageMaskxfromprimaryLiteral}`
type MaskImageMaskxfromsidebarLiteral = `mask-x-from-sidebar-${MaskImageRef4}`
type MaskImageMaskxfromsidebarLiteralWithSign =
    | MaskImageMaskxfromsidebarLiteral
    | `-${MaskImageMaskxfromsidebarLiteral}`
type MaskImageMaskxtoaccentLiteral = `mask-x-to-accent-${MaskImageRef70}`
type MaskImageMaskxtoaccentLiteralWithSign =
    | MaskImageMaskxtoaccentLiteral
    | `-${MaskImageMaskxtoaccentLiteral}`
type MaskImageMaskxtochartLiteral = `mask-x-to-chart-${MaskImageRef71}`
type MaskImageMaskxtochartLiteralWithSign =
    | MaskImageMaskxtochartLiteral
    | `-${MaskImageMaskxtochartLiteral}`
type MaskImageMaskxtoprimaryLiteral = `mask-x-to-primary-${MaskImageRef72}`
type MaskImageMaskxtoprimaryLiteralWithSign =
    | MaskImageMaskxtoprimaryLiteral
    | `-${MaskImageMaskxtoprimaryLiteral}`
type MaskImageMaskxtosidebarLiteral = `mask-x-to-sidebar-${MaskImageRef4}`
type MaskImageMaskxtosidebarLiteralWithSign =
    | MaskImageMaskxtosidebarLiteral
    | `-${MaskImageMaskxtosidebarLiteral}`
type MaskImageMaskyfromaccentLiteral = `mask-y-from-accent-${MaskImageRef73}`
type MaskImageMaskyfromaccentLiteralWithSign =
    | MaskImageMaskyfromaccentLiteral
    | `-${MaskImageMaskyfromaccentLiteral}`
type MaskImageMaskyfromchartLiteral = `mask-y-from-chart-${MaskImageRef74}`
type MaskImageMaskyfromchartLiteralWithSign =
    | MaskImageMaskyfromchartLiteral
    | `-${MaskImageMaskyfromchartLiteral}`
type MaskImageMaskyfromprimaryLiteral = `mask-y-from-primary-${MaskImageRef75}`
type MaskImageMaskyfromprimaryLiteralWithSign =
    | MaskImageMaskyfromprimaryLiteral
    | `-${MaskImageMaskyfromprimaryLiteral}`
type MaskImageMaskyfromsecondaryLiteral =
    `mask-y-from-secondary-${MaskImageRef76}`
type MaskImageMaskyfromsecondaryLiteralWithSign =
    | MaskImageMaskyfromsecondaryLiteral
    | `-${MaskImageMaskyfromsecondaryLiteral}`
type MaskImageMaskyfromsidebarLiteral = `mask-y-from-sidebar-${MaskImageRef4}`
type MaskImageMaskyfromsidebarLiteralWithSign =
    | MaskImageMaskyfromsidebarLiteral
    | `-${MaskImageMaskyfromsidebarLiteral}`
type MaskImageMaskytoaccentLiteral = `mask-y-to-accent-${MaskImageRef77}`
type MaskImageMaskytoaccentLiteralWithSign =
    | MaskImageMaskytoaccentLiteral
    | `-${MaskImageMaskytoaccentLiteral}`
type MaskImageMaskytochartLiteral = `mask-y-to-chart-${MaskImageRef78}`
type MaskImageMaskytochartLiteralWithSign =
    | MaskImageMaskytochartLiteral
    | `-${MaskImageMaskytochartLiteral}`
type MaskImageMaskytoprimaryLiteral = `mask-y-to-primary-${MaskImageRef79}`
type MaskImageMaskytoprimaryLiteralWithSign =
    | MaskImageMaskytoprimaryLiteral
    | `-${MaskImageMaskytoprimaryLiteral}`
type MaskImageMaskytosecondaryLiteral = `mask-y-to-secondary-${MaskImageRef80}`
type MaskImageMaskytosecondaryLiteralWithSign =
    | MaskImageMaskytosecondaryLiteral
    | `-${MaskImageMaskytosecondaryLiteral}`
type MaskImageMaskytosidebarLiteral = `mask-y-to-sidebar-${MaskImageRef4}`
type MaskImageMaskytosidebarLiteralWithSign =
    | MaskImageMaskytosidebarLiteral
    | `-${MaskImageMaskytosidebarLiteral}`
type MaskImageMaskradialatLiteral = `mask-radial-at-${MaskImageRef81}`
type MaskImageMaskradialatLiteralWithSign =
    | MaskImageMaskradialatLiteral
    | `-${MaskImageMaskradialatLiteral}`
type MaskImageMasklinearfromLiteral =
    | `mask-linear-from-${MaskImageRef82}`
    | "mask-linear-from-card-foreground"
    | "mask-linear-from-muted-foreground"
    | "mask-linear-from-popover-foreground"
    | "mask-linear-from-secondary-foreground"
type MaskImageMasklinearfromLiteralWithSign =
    | MaskImageMasklinearfromLiteral
    | `-${MaskImageMasklinearfromLiteral}`
type MaskImageMaskradialLiteral = `mask-radial-${MaskImageRef83}`
type MaskImageMaskradialLiteralWithSign =
    | MaskImageMaskradialLiteral
    | `-${MaskImageMaskradialLiteral}`
type MaskImageMasklinearLiteral = `mask-linear-${MaskImageRef84}`
type MaskImageMasklinearLiteralWithSign =
    | MaskImageMasklinearLiteral
    | `-${MaskImageMasklinearLiteral}`
type MaskImageMaskLiteral = `mask-${MaskImageRef85}`
type MaskImageMaskLiteralWithSign =
    | MaskImageMaskLiteral
    | `-${MaskImageMaskLiteral}`
type MaskImageMaskconicfromLiteral =
    | `mask-conic-from-${MaskImageRef82}`
    | "mask-conic-from-card-foreground"
    | "mask-conic-from-muted-foreground"
    | "mask-conic-from-popover-foreground"
    | "mask-conic-from-secondary-foreground"
type MaskImageMaskconicfromLiteralWithSign =
    | MaskImageMaskconicfromLiteral
    | `-${MaskImageMaskconicfromLiteral}`
type MaskImageMaskconicLiteral = `mask-conic-${MaskImageRef84}`
type MaskImageMaskconicLiteralWithSign =
    | MaskImageMaskconicLiteral
    | `-${MaskImageMaskconicLiteral}`
type MaskImageMaskconictoLiteral =
    | `mask-conic-to-${MaskImageRef82}`
    | "mask-conic-to-card-foreground"
    | "mask-conic-to-muted-foreground"
    | "mask-conic-to-popover-foreground"
    | "mask-conic-to-secondary-foreground"
type MaskImageMaskconictoLiteralWithSign =
    | MaskImageMaskconictoLiteral
    | `-${MaskImageMaskconictoLiteral}`
type MaskImageMasklineartoLiteral =
    | `mask-linear-to-${MaskImageRef82}`
    | "mask-linear-to-card-foreground"
    | "mask-linear-to-muted-foreground"
    | "mask-linear-to-popover-foreground"
    | "mask-linear-to-secondary-foreground"
type MaskImageMasklineartoLiteralWithSign =
    | MaskImageMasklineartoLiteral
    | `-${MaskImageMasklineartoLiteral}`
type MaskImageMaskbfromLiteral =
    | `mask-b-from-${MaskImageRef82}`
    | "mask-b-from-card-foreground"
    | "mask-b-from-muted-foreground"
    | "mask-b-from-popover-foreground"
    | "mask-b-from-secondary-foreground"
type MaskImageMaskbfromLiteralWithSign =
    | MaskImageMaskbfromLiteral
    | `-${MaskImageMaskbfromLiteral}`
type MaskImageMaskbtoLiteral =
    | `mask-b-to-${MaskImageRef82}`
    | "mask-b-to-card-foreground"
    | "mask-b-to-muted-foreground"
    | "mask-b-to-popover-foreground"
    | "mask-b-to-secondary-foreground"
type MaskImageMaskbtoLiteralWithSign =
    | MaskImageMaskbtoLiteral
    | `-${MaskImageMaskbtoLiteral}`
type MaskImageMasklfromLiteral = `mask-l-from-${MaskImageRef82}`
type MaskImageMasklfromLiteralWithSign =
    | MaskImageMasklfromLiteral
    | `-${MaskImageMasklfromLiteral}`
type MaskImageMaskltoLiteral = `mask-l-to-${MaskImageRef82}`
type MaskImageMaskltoLiteralWithSign =
    | MaskImageMaskltoLiteral
    | `-${MaskImageMaskltoLiteral}`
type MaskImageMaskrfromLiteral = `mask-r-from-${MaskImageRef82}`
type MaskImageMaskrfromLiteralWithSign =
    | MaskImageMaskrfromLiteral
    | `-${MaskImageMaskrfromLiteral}`
type MaskImageMaskrtoLiteral = `mask-r-to-${MaskImageRef82}`
type MaskImageMaskrtoLiteralWithSign =
    | MaskImageMaskrtoLiteral
    | `-${MaskImageMaskrtoLiteral}`
type MaskImageMaskradialfromLiteral =
    | `mask-radial-from-${MaskImageRef82}`
    | "mask-radial-from-card-foreground"
    | "mask-radial-from-muted-foreground"
    | "mask-radial-from-popover-foreground"
    | "mask-radial-from-secondary-foreground"
type MaskImageMaskradialfromLiteralWithSign =
    | MaskImageMaskradialfromLiteral
    | `-${MaskImageMaskradialfromLiteral}`
type MaskImageMaskradialtoLiteral =
    | `mask-radial-to-${MaskImageRef82}`
    | "mask-radial-to-card-foreground"
    | "mask-radial-to-muted-foreground"
    | "mask-radial-to-popover-foreground"
    | "mask-radial-to-secondary-foreground"
type MaskImageMaskradialtoLiteralWithSign =
    | MaskImageMaskradialtoLiteral
    | `-${MaskImageMaskradialtoLiteral}`
type MaskImageMasktfromLiteral =
    | `mask-t-from-${MaskImageRef82}`
    | "mask-t-from-card-foreground"
    | "mask-t-from-popover-foreground"
    | "mask-t-from-secondary-foreground"
type MaskImageMasktfromLiteralWithSign =
    | MaskImageMasktfromLiteral
    | `-${MaskImageMasktfromLiteral}`
type MaskImageMaskttoLiteral = `mask-t-to-${MaskImageRef82}`
type MaskImageMaskttoLiteralWithSign =
    | MaskImageMaskttoLiteral
    | `-${MaskImageMaskttoLiteral}`
type MaskImageMaskxfromLiteral =
    | `mask-x-from-${MaskImageRef82}`
    | "mask-x-from-card-foreground"
    | "mask-x-from-muted-foreground"
    | "mask-x-from-popover-foreground"
    | "mask-x-from-secondary-foreground"
type MaskImageMaskxfromLiteralWithSign =
    | MaskImageMaskxfromLiteral
    | `-${MaskImageMaskxfromLiteral}`
type MaskImageMaskxtoLiteral =
    | `mask-x-to-${MaskImageRef82}`
    | "mask-x-to-card-foreground"
    | "mask-x-to-muted-foreground"
    | "mask-x-to-popover-foreground"
    | "mask-x-to-secondary-foreground"
type MaskImageMaskxtoLiteralWithSign =
    | MaskImageMaskxtoLiteral
    | `-${MaskImageMaskxtoLiteral}`
type MaskImageMaskyfromLiteral =
    | `mask-y-from-${MaskImageRef82}`
    | "mask-y-from-card-foreground"
    | "mask-y-from-muted-foreground"
    | "mask-y-from-popover-foreground"
type MaskImageMaskyfromLiteralWithSign =
    | MaskImageMaskyfromLiteral
    | `-${MaskImageMaskyfromLiteral}`
type MaskImageMaskytoLiteral =
    | `mask-y-to-${MaskImageRef82}`
    | "mask-y-to-card-foreground"
    | "mask-y-to-muted-foreground"
    | "mask-y-to-popover-foreground"
type MaskImageMaskytoLiteralWithSign =
    | MaskImageMaskytoLiteral
    | `-${MaskImageMaskytoLiteral}`
type MaskImageProperty =
    | MaskImageMaskconicfromaccentLiteralWithSign
    | MaskImageMaskconicfromchartLiteralWithSign
    | MaskImageMaskconicfromprimaryLiteralWithSign
    | MaskImageMaskconicfromsidebarLiteralWithSign
    | MaskImageMaskconictoaccentLiteralWithSign
    | MaskImageMaskconictochartLiteralWithSign
    | MaskImageMaskconictoprimaryLiteralWithSign
    | MaskImageMaskconictosidebarLiteralWithSign
    | MaskImageMasklinearfromaccentLiteralWithSign
    | MaskImageMasklinearfromchartLiteralWithSign
    | MaskImageMasklinearfromprimaryLiteralWithSign
    | MaskImageMasklinearfromsidebarLiteralWithSign
    | MaskImageMasklineartoaccentLiteralWithSign
    | MaskImageMasklineartochartLiteralWithSign
    | MaskImageMasklineartoprimaryLiteralWithSign
    | MaskImageMasklineartosidebarLiteralWithSign
    | MaskImageMaskbfromaccentLiteralWithSign
    | MaskImageMaskbfromchartLiteralWithSign
    | MaskImageMaskbfromprimaryLiteralWithSign
    | MaskImageMaskbfromsidebarLiteralWithSign
    | MaskImageMaskbtoaccentLiteralWithSign
    | MaskImageMaskbtochartLiteralWithSign
    | MaskImageMaskbtoprimaryLiteralWithSign
    | MaskImageMaskbtosidebarLiteralWithSign
    | MaskImageMasklfromaccentLiteralWithSign
    | MaskImageMasklfromcardLiteralWithSign
    | MaskImageMasklfromchartLiteralWithSign
    | MaskImageMasklfrommutedLiteralWithSign
    | MaskImageMasklfrompopoverLiteralWithSign
    | MaskImageMasklfromprimaryLiteralWithSign
    | MaskImageMasklfromsecondaryLiteralWithSign
    | MaskImageMasklfromsidebarLiteralWithSign
    | MaskImageMaskltoaccentLiteralWithSign
    | MaskImageMaskltocardLiteralWithSign
    | MaskImageMaskltochartLiteralWithSign
    | MaskImageMaskltomutedLiteralWithSign
    | MaskImageMaskltopopoverLiteralWithSign
    | MaskImageMaskltoprimaryLiteralWithSign
    | MaskImageMaskltosecondaryLiteralWithSign
    | MaskImageMaskltosidebarLiteralWithSign
    | MaskImageMaskrfromaccentLiteralWithSign
    | MaskImageMaskrfromcardLiteralWithSign
    | MaskImageMaskrfromchartLiteralWithSign
    | MaskImageMaskrfrommutedLiteralWithSign
    | MaskImageMaskrfrompopoverLiteralWithSign
    | MaskImageMaskrfromprimaryLiteralWithSign
    | MaskImageMaskrfromsecondaryLiteralWithSign
    | MaskImageMaskrfromsidebarLiteralWithSign
    | MaskImageMaskrtoaccentLiteralWithSign
    | MaskImageMaskrtocardLiteralWithSign
    | MaskImageMaskrtochartLiteralWithSign
    | MaskImageMaskrtomutedLiteralWithSign
    | MaskImageMaskrtopopoverLiteralWithSign
    | MaskImageMaskrtoprimaryLiteralWithSign
    | MaskImageMaskrtosecondaryLiteralWithSign
    | MaskImageMaskrtosidebarLiteralWithSign
    | MaskImageMaskradialatbottomLiteralWithSign
    | MaskImageMaskradialattopLiteralWithSign
    | MaskImageMaskradialfromaccentLiteralWithSign
    | MaskImageMaskradialfromchartLiteralWithSign
    | MaskImageMaskradialfromprimaryLiteralWithSign
    | MaskImageMaskradialfromsidebarLiteralWithSign
    | MaskImageMaskradialtoaccentLiteralWithSign
    | MaskImageMaskradialtochartLiteralWithSign
    | MaskImageMaskradialtoprimaryLiteralWithSign
    | MaskImageMaskradialtosidebarLiteralWithSign
    | MaskImageMasktfromaccentLiteralWithSign
    | MaskImageMasktfromchartLiteralWithSign
    | MaskImageMasktfrommutedLiteralWithSign
    | MaskImageMasktfromprimaryLiteralWithSign
    | MaskImageMasktfromsidebarLiteralWithSign
    | MaskImageMaskttoaccentLiteralWithSign
    | MaskImageMaskttocardLiteralWithSign
    | MaskImageMaskttochartLiteralWithSign
    | MaskImageMaskttomutedLiteralWithSign
    | MaskImageMaskttopopoverLiteralWithSign
    | MaskImageMaskttoprimaryLiteralWithSign
    | MaskImageMaskttosecondaryLiteralWithSign
    | MaskImageMaskttosidebarLiteralWithSign
    | MaskImageMaskxfromaccentLiteralWithSign
    | MaskImageMaskxfromchartLiteralWithSign
    | MaskImageMaskxfromprimaryLiteralWithSign
    | MaskImageMaskxfromsidebarLiteralWithSign
    | MaskImageMaskxtoaccentLiteralWithSign
    | MaskImageMaskxtochartLiteralWithSign
    | MaskImageMaskxtoprimaryLiteralWithSign
    | MaskImageMaskxtosidebarLiteralWithSign
    | MaskImageMaskyfromaccentLiteralWithSign
    | MaskImageMaskyfromchartLiteralWithSign
    | MaskImageMaskyfromprimaryLiteralWithSign
    | MaskImageMaskyfromsecondaryLiteralWithSign
    | MaskImageMaskyfromsidebarLiteralWithSign
    | MaskImageMaskytoaccentLiteralWithSign
    | MaskImageMaskytochartLiteralWithSign
    | MaskImageMaskytoprimaryLiteralWithSign
    | MaskImageMaskytosecondaryLiteralWithSign
    | MaskImageMaskytosidebarLiteralWithSign
    | MaskImageMaskradialatLiteralWithSign
    | MaskImageMasklinearfromLiteralWithSign
    | MaskImageMaskradialLiteralWithSign
    | MaskImageMasklinearLiteralWithSign
    | MaskImageMaskLiteralWithSign
    | MaskImageMaskconicfromLiteralWithSign
    | MaskImageMaskconicLiteralWithSign
    | MaskImageMaskconictoLiteralWithSign
    | MaskImageMasklineartoLiteralWithSign
    | MaskImageMaskbfromLiteralWithSign
    | MaskImageMaskbtoLiteralWithSign
    | MaskImageMasklfromLiteralWithSign
    | MaskImageMaskltoLiteralWithSign
    | MaskImageMaskrfromLiteralWithSign
    | MaskImageMaskrtoLiteralWithSign
    | MaskImageMaskradialfromLiteralWithSign
    | MaskImageMaskradialtoLiteralWithSign
    | MaskImageMasktfromLiteralWithSign
    | MaskImageMaskttoLiteralWithSign
    | MaskImageMaskxfromLiteralWithSign
    | MaskImageMaskxtoLiteralWithSign
    | MaskImageMaskyfromLiteralWithSign
    | MaskImageMaskytoLiteralWithSign
type MaskImageArbitraryValue =
    | (`mask-linear-from-${number}` & {})
    | (`mask-linear-from-(${string})` & {})
    | (`mask-linear-from-[${string}]` & {})
    | (`mask-radial-[${string}]` & {})
    | (`mask-radial-${number}` & {})
    | (`mask-radial-(${string})` & {})
    | (`mask-linear-${number}` & {})
    | (`mask-linear-${number}` & {})
    | (`-mask-linear-${number}` & {})
    | (`mask-linear-(${string})` & {})
    | (`mask-linear-[${string}]` & {})
    | (`mask-[${string}]` & {})
    | (`mask-(${string})` & {})
    | (`mask-${number}` & {})
    | (`mask-${number}` & {})
    | (`-mask-${number}` & {})
    | (`mask-conic-from-${number}` & {})
    | (`mask-conic-from-(${string})` & {})
    | (`mask-conic-from-[${string}]` & {})
    | (`mask-conic-${number}` & {})
    | (`mask-conic-${number}` & {})
    | (`-mask-conic-${number}` & {})
    | (`mask-conic-(${string})` & {})
    | (`mask-conic-[${string}]` & {})
    | (`mask-conic-to-${number}` & {})
    | (`mask-conic-to-(${string})` & {})
    | (`mask-conic-to-[${string}]` & {})
    | (`mask-linear-to-${number}` & {})
    | (`mask-linear-to-(${string})` & {})
    | (`mask-linear-to-[${string}]` & {})
    | (`mask-b-from-${number}` & {})
    | (`mask-b-from-(${string})` & {})
    | (`mask-b-from-[${string}]` & {})
    | (`mask-b-to-${number}` & {})
    | (`mask-b-to-(${string})` & {})
    | (`mask-b-to-[${string}]` & {})
    | (`mask-l-from-${number}` & {})
    | (`mask-l-from-(${string})` & {})
    | (`mask-l-from-[${string}]` & {})
    | (`mask-l-to-${number}` & {})
    | (`mask-l-to-(${string})` & {})
    | (`mask-l-to-[${string}]` & {})
    | (`mask-r-from-${number}` & {})
    | (`mask-r-from-(${string})` & {})
    | (`mask-r-from-[${string}]` & {})
    | (`mask-r-to-${number}` & {})
    | (`mask-r-to-(${string})` & {})
    | (`mask-r-to-[${string}]` & {})
    | (`mask-radial-from-${number}` & {})
    | (`mask-radial-from-(${string})` & {})
    | (`mask-radial-from-[${string}]` & {})
    | (`mask-radial-to-${number}` & {})
    | (`mask-radial-to-(${string})` & {})
    | (`mask-radial-to-[${string}]` & {})
    | (`mask-t-from-${number}` & {})
    | (`mask-t-from-(${string})` & {})
    | (`mask-t-from-[${string}]` & {})
    | (`mask-t-to-${number}` & {})
    | (`mask-t-to-(${string})` & {})
    | (`mask-t-to-[${string}]` & {})
    | (`mask-x-from-${number}` & {})
    | (`mask-x-from-(${string})` & {})
    | (`mask-x-from-[${string}]` & {})
    | (`mask-x-to-${number}` & {})
    | (`mask-x-to-(${string})` & {})
    | (`mask-x-to-[${string}]` & {})
    | (`mask-y-from-${number}` & {})
    | (`mask-y-from-(${string})` & {})
    | (`mask-y-from-[${string}]` & {})
    | (`mask-y-to-${number}` & {})
    | (`mask-y-to-(${string})` & {})
    | (`mask-y-to-[${string}]` & {})
type MaskImageValue =
    | MaskImageProperty
    | (`mask-conic-from-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-conic-from-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-conic-from-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-conic-from-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-conic-to-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-conic-to-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-conic-to-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-conic-to-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-linear-from-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-linear-from-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-linear-from-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-linear-from-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-linear-to-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-linear-to-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-linear-to-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-linear-to-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-b-from-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-b-from-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-b-from-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-b-from-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-b-to-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-b-to-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-b-to-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-b-to-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-from-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-from-card-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-from-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-from-muted-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-from-popover-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-from-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-from-secondary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-from-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-to-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-to-card-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-to-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-to-muted-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-to-popover-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-to-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-to-secondary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-to-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-from-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-from-card-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-from-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-from-muted-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-from-popover-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-from-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-from-secondary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-from-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-to-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-to-card-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-to-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-to-muted-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-to-popover-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-to-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-to-secondary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-to-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-radial-at-bottom-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-radial-at-top-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-radial-from-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-radial-from-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-radial-from-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-radial-from-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-radial-to-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-radial-to-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-radial-to-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-radial-to-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-t-from-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-t-from-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-t-from-muted-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-t-from-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-t-from-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-t-to-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-t-to-card-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-t-to-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-t-to-muted-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-t-to-popover-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-t-to-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-t-to-secondary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-t-to-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-x-from-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-x-from-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-x-from-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-x-from-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-x-to-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-x-to-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-x-to-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-x-to-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-y-from-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-y-from-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-y-from-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-y-from-secondary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-y-from-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-y-to-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-y-to-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-y-to-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-y-to-secondary-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-y-to-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-radial-at-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-linear-from-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-radial-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-linear-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-conic-from-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-conic-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-conic-to-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-linear-to-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-b-from-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-b-to-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-from-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-l-to-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-from-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-r-to-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-radial-from-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-radial-to-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-t-from-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-t-to-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-x-from-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-x-to-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-y-from-${string}/${VariantsA91e8ba1}` & {})
    | (`mask-y-to-${string}/${VariantsA91e8ba1}` & {})
    | MaskImageArbitraryValue
interface TailwindMaskImage {
    /**
     * `MaskImage`
     *
     * Utilities for controlling an element's mask image.
     *
     * Arbitrary support
     *
     * `mask-linear-from-<number>`, `mask-linear-from-(<var-name>)`,
     * `mask-linear-from-[<arbitrary-value>]`, `mask-radial-[<arbitrary-value>]`,
     * `mask-radial-<number>` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/mask-image Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image , MDN docs}
     */
    maskImage: MaskImageValue
}
type OrderLiteral = `order-${OrderRef1}`
type OrderLiteralWithSign = OrderLiteral | `-${OrderLiteral}`
type OrderProperty = OrderLiteralWithSign
type OrderArbitraryValue =
    | (`order-${number}` & {})
    | (`order-${number}` & {})
    | (`-order-${number}` & {})
    | (`order-(${string})` & {})
    | (`order-[${string}]` & {})
type OrderValue = OrderProperty | OrderArbitraryValue
interface TailwindOrder {
    /**
     * `Order`
     *
     * Utilities for controlling the order of flex and grid items.
     *
     * Arbitrary support
     *
     * `order-<number>`, `-order-<number>`, `order-(<var-name>)`,
     * `order-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/order Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/order , MDN docs}
     */
    order: OrderValue
}
type OutlineOffsetLiteral = `outline-offset-${OutlineOffsetRef1}`
type OutlineOffsetLiteralWithSign =
    | OutlineOffsetLiteral
    | `-${OutlineOffsetLiteral}`
type OutlineOffsetProperty = OutlineOffsetLiteralWithSign
type OutlineOffsetArbitraryValue =
    | (`outline-offset-${number}` & {})
    | (`outline-offset-${number}` & {})
    | (`-outline-offset-${number}` & {})
    | (`outline-offset-(${string})` & {})
    | (`outline-offset-[${string}]` & {})
type OutlineOffsetValue = OutlineOffsetProperty | OutlineOffsetArbitraryValue
interface TailwindOutlineOffset {
    /**
     * `OutlineOffset`
     *
     * Utilities for controlling the offset of an element's outline.
     *
     * Arbitrary support
     *
     * `outline-offset-<number>`, `-outline-offset-<number>`,
     * `outline-offset-(<var-name>)`, `outline-offset-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/outline-offset Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/outline-offset , MDN docs}
     */
    outlineOffset: OutlineOffsetValue
}
type RightLiteral = `right-${RightRef1}`
type RightLiteralWithSign = RightLiteral | `-${RightLiteral}`
type RightProperty = RightLiteralWithSign
type RightArbitraryValue =
    | (`right-${number}` & {})
    | (`right-${number}` & {})
    | (`-right-${number}` & {})
    | (`right-(${string})` & {})
    | (`right-[${string}]` & {})
type RightValue = RightProperty | RightArbitraryValue
interface TailwindRight {
    /**
     * `Right`
     *
     * Utilities for controlling the placement of positioned elements.
     *
     * Arbitrary support
     *
     * `right-<number>`, `-right-<number>`, `right-(<var-name>)`,
     * `right-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/top-right-bottom-left Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/right , MDN docs}
     */
    right: RightValue
}
type RotateXLiteral = `rotate-x-${RotateRef1}`
type RotateXLiteralWithSign = RotateXLiteral | `-${RotateXLiteral}`
type RotateYLiteral = `rotate-y-${RotateRef1}`
type RotateYLiteralWithSign = RotateYLiteral | `-${RotateYLiteral}`
type RotateZLiteral = `rotate-z-${RotateRef1}`
type RotateZLiteralWithSign = RotateZLiteral | `-${RotateZLiteral}`
type RotateLiteral = `rotate-${RotateRef1}` | "rotate-none"
type RotateLiteralWithSign = RotateLiteral | `-${RotateLiteral}`
type RotateProperty =
    | RotateXLiteralWithSign
    | RotateYLiteralWithSign
    | RotateZLiteralWithSign
    | RotateLiteralWithSign
type RotateArbitraryValue =
    | (`rotate-x-${number}` & {})
    | (`rotate-x-${number}` & {})
    | (`-rotate-x-${number}` & {})
    | (`rotate-x-(${string})` & {})
    | (`rotate-x-[${string}]` & {})
    | (`rotate-y-${number}` & {})
    | (`rotate-y-${number}` & {})
    | (`-rotate-y-${number}` & {})
    | (`rotate-y-(${string})` & {})
    | (`rotate-y-[${string}]` & {})
    | (`rotate-z-${number}` & {})
    | (`rotate-z-${number}` & {})
    | (`-rotate-z-${number}` & {})
    | (`rotate-z-(${string})` & {})
    | (`rotate-z-[${string}]` & {})
    | (`rotate-${number}` & {})
    | (`rotate-${number}` & {})
    | (`-rotate-${number}` & {})
    | (`rotate-(${string})` & {})
    | (`rotate-[${string}]` & {})
type RotateValue = RotateProperty | RotateArbitraryValue
interface TailwindRotate {
    /**
     * `Rotate`
     *
     * Utilities for rotating elements.
     *
     * Arbitrary support
     *
     * `rotate-x-<number>`, `-rotate-x-<number>`, `rotate-x-(<var-name>)`,
     * `rotate-x-[<arbitrary-value>]`, `rotate-y-<number>` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/rotate Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/rotate , MDN docs}
     */
    rotate: RotateValue
}
type GridRowRowendLiteral = `row-end-${GridRowRef1}`
type GridRowRowendLiteralWithSign =
    | GridRowRowendLiteral
    | `-${GridRowRowendLiteral}`
type GridRowRowstartLiteral = `row-start-${GridRowRef1}`
type GridRowRowstartLiteralWithSign =
    | GridRowRowstartLiteral
    | `-${GridRowRowstartLiteral}`
type GridRowRowspanLiteral = `row-span-${GridRowRef2}`
type GridRowRowspanLiteralWithSign =
    | GridRowRowspanLiteral
    | `-${GridRowRowspanLiteral}`
type GridRowRowLiteral = `row-${GridRowRef3}`
type GridRowRowLiteralWithSign = GridRowRowLiteral | `-${GridRowRowLiteral}`
type GridRowProperty =
    | GridRowRowendLiteralWithSign
    | GridRowRowstartLiteralWithSign
    | GridRowRowspanLiteralWithSign
    | GridRowRowLiteralWithSign
type GridRowArbitraryValue =
    | (`row-end-${number}` & {})
    | (`row-end-${number}` & {})
    | (`-row-end-${number}` & {})
    | (`row-end-(${string})` & {})
    | (`row-end-[${string}]` & {})
    | (`row-start-${number}` & {})
    | (`row-start-${number}` & {})
    | (`-row-start-${number}` & {})
    | (`row-start-(${string})` & {})
    | (`row-start-[${string}]` & {})
    | (`row-span-${number}` & {})
    | (`row-span-(${string})` & {})
    | (`row-span-[${string}]` & {})
    | (`row-${number}` & {})
    | (`row-(${string})` & {})
    | (`row-[${string}]` & {})
    | (`row-${number}` & {})
    | (`-row-${number}` & {})
type GridRowValue = GridRowProperty | GridRowArbitraryValue
interface TailwindGridRow {
    /**
     * `GridRow`
     *
     * Utilities for controlling how elements are sized and placed across grid
     * rows.
     *
     * Arbitrary support
     *
     * `row-end-<number>`, `-row-end-<number>`, `row-end-(<var-name>)`,
     * `row-end-[<arbitrary-value>]`, `row-start-<number>` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/grid-row Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row , MDN docs}
     */
    gridRow: GridRowValue
}
type ScaleXLiteral = `scale-x-${ScaleRef1}`
type ScaleXLiteralWithSign = ScaleXLiteral | `-${ScaleXLiteral}`
type ScaleYLiteral = `scale-y-${ScaleRef1}`
type ScaleYLiteralWithSign = ScaleYLiteral | `-${ScaleYLiteral}`
type ScaleZLiteral = `scale-z-${ScaleRef1}`
type ScaleZLiteralWithSign = ScaleZLiteral | `-${ScaleZLiteral}`
type ScaleLiteral = `scale-${ScaleRef1}` | "scale-3d" | "scale-none"
type ScaleLiteralWithSign = ScaleLiteral | `-${ScaleLiteral}`
type ScaleProperty =
    | ScaleXLiteralWithSign
    | ScaleYLiteralWithSign
    | ScaleZLiteralWithSign
    | ScaleLiteralWithSign
type ScaleArbitraryValue =
    | (`scale-x-${number}` & {})
    | (`scale-x-${number}` & {})
    | (`-scale-x-${number}` & {})
    | (`scale-x-(${string})` & {})
    | (`scale-x-[${string}]` & {})
    | (`scale-y-${number}` & {})
    | (`scale-y-${number}` & {})
    | (`-scale-y-${number}` & {})
    | (`scale-y-(${string})` & {})
    | (`scale-y-[${string}]` & {})
    | (`scale-z-${number}` & {})
    | (`scale-z-${number}` & {})
    | (`-scale-z-${number}` & {})
    | (`scale-z-(${string})` & {})
    | (`scale-z-[${string}]` & {})
    | (`scale-${number}` & {})
    | (`scale-${number}` & {})
    | (`-scale-${number}` & {})
    | (`scale-(${string})` & {})
    | (`scale-[${string}]` & {})
type ScaleValue = ScaleProperty | ScaleArbitraryValue
interface TailwindScale {
    /**
     * `Scale`
     *
     * Utilities for scaling elements.
     *
     * Arbitrary support
     *
     * `scale-x-<number>`, `-scale-x-<number>`, `scale-x-(<var-name>)`,
     * `scale-x-[<arbitrary-value>]`, `scale-y-<number>` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/scale Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/scale , MDN docs}
     */
    scale: ScaleValue
}
type ScrollMarginScrollmLiteral = `scroll-m-${ScrollMarginRef1}`
type ScrollMarginScrollmLiteralWithSign =
    | ScrollMarginScrollmLiteral
    | `-${ScrollMarginScrollmLiteral}`
type ScrollMarginScrollmbLiteral = `scroll-mb-${ScrollMarginRef1}`
type ScrollMarginScrollmbLiteralWithSign =
    | ScrollMarginScrollmbLiteral
    | `-${ScrollMarginScrollmbLiteral}`
type ScrollMarginScrollmbeLiteral = `scroll-mbe-${ScrollMarginRef1}`
type ScrollMarginScrollmbeLiteralWithSign =
    | ScrollMarginScrollmbeLiteral
    | `-${ScrollMarginScrollmbeLiteral}`
type ScrollMarginScrollmbsLiteral = `scroll-mbs-${ScrollMarginRef1}`
type ScrollMarginScrollmbsLiteralWithSign =
    | ScrollMarginScrollmbsLiteral
    | `-${ScrollMarginScrollmbsLiteral}`
type ScrollMarginScrollmeLiteral = `scroll-me-${ScrollMarginRef1}`
type ScrollMarginScrollmeLiteralWithSign =
    | ScrollMarginScrollmeLiteral
    | `-${ScrollMarginScrollmeLiteral}`
type ScrollMarginScrollmlLiteral = `scroll-ml-${ScrollMarginRef1}`
type ScrollMarginScrollmlLiteralWithSign =
    | ScrollMarginScrollmlLiteral
    | `-${ScrollMarginScrollmlLiteral}`
type ScrollMarginScrollmrLiteral = `scroll-mr-${ScrollMarginRef1}`
type ScrollMarginScrollmrLiteralWithSign =
    | ScrollMarginScrollmrLiteral
    | `-${ScrollMarginScrollmrLiteral}`
type ScrollMarginScrollmsLiteral = `scroll-ms-${ScrollMarginRef1}`
type ScrollMarginScrollmsLiteralWithSign =
    | ScrollMarginScrollmsLiteral
    | `-${ScrollMarginScrollmsLiteral}`
type ScrollMarginScrollmtLiteral = `scroll-mt-${ScrollMarginRef1}`
type ScrollMarginScrollmtLiteralWithSign =
    | ScrollMarginScrollmtLiteral
    | `-${ScrollMarginScrollmtLiteral}`
type ScrollMarginScrollmxLiteral = `scroll-mx-${ScrollMarginRef1}`
type ScrollMarginScrollmxLiteralWithSign =
    | ScrollMarginScrollmxLiteral
    | `-${ScrollMarginScrollmxLiteral}`
type ScrollMarginScrollmyLiteral = `scroll-my-${ScrollMarginRef1}`
type ScrollMarginScrollmyLiteralWithSign =
    | ScrollMarginScrollmyLiteral
    | `-${ScrollMarginScrollmyLiteral}`
type ScrollMarginProperty =
    | ScrollMarginScrollmLiteralWithSign
    | ScrollMarginScrollmbLiteralWithSign
    | ScrollMarginScrollmbeLiteralWithSign
    | ScrollMarginScrollmbsLiteralWithSign
    | ScrollMarginScrollmeLiteralWithSign
    | ScrollMarginScrollmlLiteralWithSign
    | ScrollMarginScrollmrLiteralWithSign
    | ScrollMarginScrollmsLiteralWithSign
    | ScrollMarginScrollmtLiteralWithSign
    | ScrollMarginScrollmxLiteralWithSign
    | ScrollMarginScrollmyLiteralWithSign
type ScrollMarginArbitraryValue =
    | (`scroll-m-${number}` & {})
    | (`scroll-m-${number}` & {})
    | (`-scroll-m-${number}` & {})
    | (`scroll-m-(${string})` & {})
    | (`scroll-m-[${string}]` & {})
    | (`scroll-mb-${number}` & {})
    | (`scroll-mb-${number}` & {})
    | (`-scroll-mb-${number}` & {})
    | (`scroll-mb-(${string})` & {})
    | (`scroll-mb-[${string}]` & {})
    | (`scroll-mbe-${number}` & {})
    | (`scroll-mbe-${number}` & {})
    | (`-scroll-mbe-${number}` & {})
    | (`scroll-mbe-(${string})` & {})
    | (`scroll-mbe-[${string}]` & {})
    | (`scroll-mbs-${number}` & {})
    | (`scroll-mbs-${number}` & {})
    | (`-scroll-mbs-${number}` & {})
    | (`scroll-mbs-(${string})` & {})
    | (`scroll-mbs-[${string}]` & {})
    | (`scroll-me-${number}` & {})
    | (`scroll-me-${number}` & {})
    | (`-scroll-me-${number}` & {})
    | (`scroll-me-(${string})` & {})
    | (`scroll-me-[${string}]` & {})
    | (`scroll-ml-${number}` & {})
    | (`scroll-ml-${number}` & {})
    | (`-scroll-ml-${number}` & {})
    | (`scroll-ml-(${string})` & {})
    | (`scroll-ml-[${string}]` & {})
    | (`scroll-mr-${number}` & {})
    | (`scroll-mr-${number}` & {})
    | (`-scroll-mr-${number}` & {})
    | (`scroll-mr-(${string})` & {})
    | (`scroll-mr-[${string}]` & {})
    | (`scroll-ms-${number}` & {})
    | (`scroll-ms-${number}` & {})
    | (`-scroll-ms-${number}` & {})
    | (`scroll-ms-(${string})` & {})
    | (`scroll-ms-[${string}]` & {})
    | (`scroll-mt-${number}` & {})
    | (`scroll-mt-${number}` & {})
    | (`-scroll-mt-${number}` & {})
    | (`scroll-mt-(${string})` & {})
    | (`scroll-mt-[${string}]` & {})
    | (`scroll-mx-${number}` & {})
    | (`scroll-mx-${number}` & {})
    | (`-scroll-mx-${number}` & {})
    | (`scroll-mx-(${string})` & {})
    | (`scroll-mx-[${string}]` & {})
    | (`scroll-my-${number}` & {})
    | (`scroll-my-${number}` & {})
    | (`-scroll-my-${number}` & {})
    | (`scroll-my-(${string})` & {})
    | (`scroll-my-[${string}]` & {})
type ScrollMarginValue = ScrollMarginProperty | ScrollMarginArbitraryValue
interface TailwindScrollMargin {
    /**
     * `ScrollMargin`
     *
     * Utilities for controlling the scroll offset around items in a snap
     * container.
     *
     * Arbitrary support
     *
     * `scroll-m-<number>`, `-scroll-m-<number>`, `scroll-m-(<var-name>)`,
     * `scroll-m-[<arbitrary-value>]`, `scroll-mb-<number>` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/scroll-margin Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin , MDN docs}
     */
    scrollMargin: ScrollMarginValue
}
type SkewXLiteral = `skew-x-${SkewRef1}`
type SkewXLiteralWithSign = SkewXLiteral | `-${SkewXLiteral}`
type SkewYLiteral = `skew-y-${SkewRef1}`
type SkewYLiteralWithSign = SkewYLiteral | `-${SkewYLiteral}`
type SkewLiteral = `skew-${SkewRef1}`
type SkewLiteralWithSign = SkewLiteral | `-${SkewLiteral}`
type SkewProperty =
    | SkewXLiteralWithSign
    | SkewYLiteralWithSign
    | SkewLiteralWithSign
type SkewArbitraryValue =
    | (`skew-x-${number}` & {})
    | (`skew-x-${number}` & {})
    | (`-skew-x-${number}` & {})
    | (`skew-x-(${string})` & {})
    | (`skew-x-[${string}]` & {})
    | (`skew-y-${number}` & {})
    | (`skew-y-${number}` & {})
    | (`-skew-y-${number}` & {})
    | (`skew-y-(${string})` & {})
    | (`skew-y-[${string}]` & {})
    | (`skew-${number}` & {})
    | (`skew-${number}` & {})
    | (`-skew-${number}` & {})
    | (`skew-(${string})` & {})
    | (`skew-[${string}]` & {})
type SkewValue = SkewProperty | SkewArbitraryValue
interface TailwindSkew {
    /**
     * `Skew`
     *
     * Utilities for skewing elements with transform.
     *
     * Arbitrary support
     *
     * `skew-x-<number>`, `-skew-x-<number>`, `skew-x-(<var-name>)`,
     * `skew-x-[<arbitrary-value>]`, `skew-y-<number>` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/skew Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/skew , MDN docs}
     */
    skew: SkewValue
}
type CustomSpinLiteral = `spin-${CustomRef1}`
type CustomSpinLiteralWithSign = CustomSpinLiteral | `-${CustomSpinLiteral}`
type CustomZoominLiteral = `zoom-in-${CustomRef2}`
type CustomZoominLiteralWithSign =
    | CustomZoominLiteral
    | `-${CustomZoominLiteral}`
type CustomZoomoutLiteral = `zoom-out-${CustomRef2}`
type CustomZoomoutLiteralWithSign =
    | CustomZoomoutLiteral
    | `-${CustomZoomoutLiteral}`
type CustomBlurinLiteral = `blur-in-${CustomRef3}`
type CustomBlurinLiteralWithSign =
    | CustomBlurinLiteral
    | `-${CustomBlurinLiteral}`
type CustomBluroutLiteral = `blur-out-${CustomRef3}`
type CustomBluroutLiteralWithSign =
    | CustomBluroutLiteral
    | `-${CustomBluroutLiteral}`
type CustomFadeinLiteral = `fade-in-${CustomRef2}`
type CustomFadeinLiteralWithSign =
    | CustomFadeinLiteral
    | `-${CustomFadeinLiteral}`
type CustomFadeoutLiteral = `fade-out-${CustomRef2}`
type CustomFadeoutLiteralWithSign =
    | CustomFadeoutLiteral
    | `-${CustomFadeoutLiteral}`
type CustomSlideinfrombottomLiteral =
    | `slide-in-from-bottom-${CustomRef2}`
    | "slide-in-from-bottom-full"
type CustomSlideinfrombottomLiteralWithSign =
    | CustomSlideinfrombottomLiteral
    | `-${CustomSlideinfrombottomLiteral}`
type CustomSlideinfromendLiteral =
    | `slide-in-from-end-${CustomRef2}`
    | "slide-in-from-end-full"
type CustomSlideinfromendLiteralWithSign =
    | CustomSlideinfromendLiteral
    | `-${CustomSlideinfromendLiteral}`
type CustomSlideinfromleftLiteral =
    | `slide-in-from-left-${CustomRef2}`
    | "slide-in-from-left-full"
type CustomSlideinfromleftLiteralWithSign =
    | CustomSlideinfromleftLiteral
    | `-${CustomSlideinfromleftLiteral}`
type CustomSlideinfromrightLiteral =
    | `slide-in-from-right-${CustomRef2}`
    | "slide-in-from-right-full"
type CustomSlideinfromrightLiteralWithSign =
    | CustomSlideinfromrightLiteral
    | `-${CustomSlideinfromrightLiteral}`
type CustomSlideinfromstartLiteral =
    | `slide-in-from-start-${CustomRef2}`
    | "slide-in-from-start-full"
type CustomSlideinfromstartLiteralWithSign =
    | CustomSlideinfromstartLiteral
    | `-${CustomSlideinfromstartLiteral}`
type CustomSlideinfromtopLiteral =
    | `slide-in-from-top-${CustomRef2}`
    | "slide-in-from-top-full"
type CustomSlideinfromtopLiteralWithSign =
    | CustomSlideinfromtopLiteral
    | `-${CustomSlideinfromtopLiteral}`
type CustomSlideouttobottomLiteral =
    | `slide-out-to-bottom-${CustomRef2}`
    | "slide-out-to-bottom-full"
type CustomSlideouttobottomLiteralWithSign =
    | CustomSlideouttobottomLiteral
    | `-${CustomSlideouttobottomLiteral}`
type CustomSlideouttoendLiteral =
    | `slide-out-to-end-${CustomRef2}`
    | "slide-out-to-end-full"
type CustomSlideouttoendLiteralWithSign =
    | CustomSlideouttoendLiteral
    | `-${CustomSlideouttoendLiteral}`
type CustomSlideouttoleftLiteral =
    | `slide-out-to-left-${CustomRef2}`
    | "slide-out-to-left-full"
type CustomSlideouttoleftLiteralWithSign =
    | CustomSlideouttoleftLiteral
    | `-${CustomSlideouttoleftLiteral}`
type CustomSlideouttorightLiteral =
    | `slide-out-to-right-${CustomRef2}`
    | "slide-out-to-right-full"
type CustomSlideouttorightLiteralWithSign =
    | CustomSlideouttorightLiteral
    | `-${CustomSlideouttorightLiteral}`
type CustomSlideouttostartLiteral =
    | `slide-out-to-start-${CustomRef2}`
    | "slide-out-to-start-full"
type CustomSlideouttostartLiteralWithSign =
    | CustomSlideouttostartLiteral
    | `-${CustomSlideouttostartLiteral}`
type CustomSlideouttotopLiteral =
    | `slide-out-to-top-${CustomRef2}`
    | "slide-out-to-top-full"
type CustomSlideouttotopLiteralWithSign =
    | CustomSlideouttotopLiteral
    | `-${CustomSlideouttotopLiteral}`
type CustomZoomLiteral = `zoom-${CustomRef4}`
type CustomZoomLiteralWithSign = CustomZoomLiteral | `-${CustomZoomLiteral}`
type CustomBlurLiteral = `blur-${CustomRef5}`
type CustomBlurLiteralWithSign = CustomBlurLiteral | `-${CustomBlurLiteral}`
type CustomFadeLiteral = `fade-${CustomRef6}`
type CustomFadeLiteralWithSign = CustomFadeLiteral | `-${CustomFadeLiteral}`
type CustomSlideinfromLiteral = `slide-in-from-${CustomRef7}`
type CustomSlideinfromLiteralWithSign =
    | CustomSlideinfromLiteral
    | `-${CustomSlideinfromLiteral}`
type CustomSlideouttoLiteral = `slide-out-to-${CustomRef7}`
type CustomSlideouttoLiteralWithSign =
    | CustomSlideouttoLiteral
    | `-${CustomSlideouttoLiteral}`
type CustomValue =
    | "no-scrollbar"
    | CustomSpinLiteralWithSign
    | CustomZoominLiteralWithSign
    | CustomZoomoutLiteralWithSign
    | CustomBlurinLiteralWithSign
    | CustomBluroutLiteralWithSign
    | CustomFadeinLiteralWithSign
    | CustomFadeoutLiteralWithSign
    | CustomSlideinfrombottomLiteralWithSign
    | CustomSlideinfromendLiteralWithSign
    | CustomSlideinfromleftLiteralWithSign
    | CustomSlideinfromrightLiteralWithSign
    | CustomSlideinfromstartLiteralWithSign
    | CustomSlideinfromtopLiteralWithSign
    | CustomSlideouttobottomLiteralWithSign
    | CustomSlideouttoendLiteralWithSign
    | CustomSlideouttoleftLiteralWithSign
    | CustomSlideouttorightLiteralWithSign
    | CustomSlideouttostartLiteralWithSign
    | CustomSlideouttotopLiteralWithSign
    | CustomZoomLiteralWithSign
    | CustomBlurLiteralWithSign
    | CustomFadeLiteralWithSign
    | CustomSlideinfromLiteralWithSign
    | CustomSlideouttoLiteralWithSign
interface TailwindCustom {
    /**
     * `Custom`
     *
     * Custom properties, defined by user.
     */
    custom: CustomValue
}
type TopLiteral = `top-${TopRef1}`
type TopLiteralWithSign = TopLiteral | `-${TopLiteral}`
type TopProperty = TopLiteralWithSign
type TopArbitraryValue =
    | (`top-${number}` & {})
    | (`top-${number}` & {})
    | (`-top-${number}` & {})
    | (`top-(${string})` & {})
    | (`top-[${string}]` & {})
type TopValue = TopProperty | TopArbitraryValue
interface TailwindTop {
    /**
     * `Top`
     *
     * Utilities for controlling the placement of positioned elements.
     *
     * Arbitrary support
     *
     * `top-<number>`, `-top-<number>`, `top-(<var-name>)`,
     * `top-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/top-right-bottom-left Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/top , MDN docs}
     */
    top: TopValue
}
type LetterSpacingTrackingLiteral = `tracking-${LetterSpacingRef1}`
type LetterSpacingTrackingLiteralWithSign =
    | LetterSpacingTrackingLiteral
    | `-${LetterSpacingTrackingLiteral}`
type LetterSpacingProperty = LetterSpacingTrackingLiteralWithSign
type LetterSpacingArbitraryValue =
    | (`tracking-(${string})` & {})
    | (`tracking-[${string}]` & {})
type LetterSpacingValue = LetterSpacingProperty | LetterSpacingArbitraryValue
interface TailwindLetterSpacing {
    /**
     * `LetterSpacing`
     *
     * Utilities for controlling the tracking, or letter spacing, of an element.
     *
     * Arbitrary support
     *
     * `tracking-(<var-name>)`, `tracking-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/letter-spacing Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing , MDN docs}
     */
    letterSpacing: LetterSpacingValue
}
type TranslateXLiteral =
    | `translate-x-${TranslateRef1}`
    | "translate-x-1/2"
    | "translate-x-1/3"
    | "translate-x-1/4"
    | "translate-x-1/5"
    | "translate-x-1/6"
    | "translate-x-1/12"
    | "translate-x-2/3"
    | "translate-x-2/4"
    | "translate-x-2/5"
    | "translate-x-2/6"
    | "translate-x-2/12"
    | "translate-x-3/4"
    | "translate-x-3/5"
    | "translate-x-3/6"
    | "translate-x-3/12"
    | "translate-x-4/5"
    | "translate-x-4/6"
    | "translate-x-4/12"
    | "translate-x-5/6"
    | "translate-x-5/12"
    | "translate-x-6/12"
    | "translate-x-7/12"
    | "translate-x-8/12"
    | "translate-x-9/12"
    | "translate-x-10/12"
    | "translate-x-11/12"
    | "translate-x-full"
type TranslateXLiteralWithSign = TranslateXLiteral | `-${TranslateXLiteral}`
type TranslateYLiteral =
    | `translate-y-${TranslateRef1}`
    | "translate-y-1/2"
    | "translate-y-1/3"
    | "translate-y-1/4"
    | "translate-y-1/5"
    | "translate-y-1/6"
    | "translate-y-1/12"
    | "translate-y-2/3"
    | "translate-y-2/4"
    | "translate-y-2/5"
    | "translate-y-2/6"
    | "translate-y-2/12"
    | "translate-y-3/4"
    | "translate-y-3/5"
    | "translate-y-3/6"
    | "translate-y-3/12"
    | "translate-y-4/5"
    | "translate-y-4/6"
    | "translate-y-4/12"
    | "translate-y-5/6"
    | "translate-y-5/12"
    | "translate-y-6/12"
    | "translate-y-7/12"
    | "translate-y-8/12"
    | "translate-y-9/12"
    | "translate-y-10/12"
    | "translate-y-11/12"
    | "translate-y-full"
type TranslateYLiteralWithSign = TranslateYLiteral | `-${TranslateYLiteral}`
type TranslateZLiteral = `translate-z-${TranslateRef1}`
type TranslateZLiteralWithSign = TranslateZLiteral | `-${TranslateZLiteral}`
type TranslateLiteral =
    | `translate-${TranslateRef1}`
    | "translate-1/2"
    | "translate-1/3"
    | "translate-1/4"
    | "translate-1/5"
    | "translate-1/6"
    | "translate-1/12"
    | "translate-2/3"
    | "translate-2/4"
    | "translate-2/5"
    | "translate-2/6"
    | "translate-2/12"
    | "translate-3/4"
    | "translate-3/5"
    | "translate-3/6"
    | "translate-3/12"
    | "translate-4/5"
    | "translate-4/6"
    | "translate-4/12"
    | "translate-5/6"
    | "translate-5/12"
    | "translate-6/12"
    | "translate-7/12"
    | "translate-8/12"
    | "translate-9/12"
    | "translate-10/12"
    | "translate-11/12"
    | "translate-full"
    | "translate-3d"
    | "translate-none"
type TranslateLiteralWithSign = TranslateLiteral | `-${TranslateLiteral}`
type TranslateProperty =
    | TranslateXLiteralWithSign
    | TranslateYLiteralWithSign
    | TranslateZLiteralWithSign
    | TranslateLiteralWithSign
type TranslateArbitraryValue =
    | (`translate-x-${number}` & {})
    | (`translate-x-${number}` & {})
    | (`-translate-x-${number}` & {})
    | (`translate-x-(${string})` & {})
    | (`translate-x-[${string}]` & {})
    | (`translate-y-${number}` & {})
    | (`translate-y-${number}` & {})
    | (`-translate-y-${number}` & {})
    | (`translate-y-(${string})` & {})
    | (`translate-y-[${string}]` & {})
    | (`translate-z-${number}` & {})
    | (`translate-z-${number}` & {})
    | (`-translate-z-${number}` & {})
    | (`translate-z-(${string})` & {})
    | (`translate-z-[${string}]` & {})
    | (`translate-${number}` & {})
    | (`translate-${number}` & {})
    | (`-translate-${number}` & {})
    | (`translate-(${string})` & {})
    | (`translate-[${string}]` & {})
type TranslateValue = TranslateProperty | TranslateArbitraryValue
interface TailwindTranslate {
    /**
     * `Translate`
     *
     * Utilities for translating elements.
     *
     * Arbitrary support
     *
     * `translate-x-<number>`, `-translate-x-<number>`,
     * `translate-x-(<var-name>)`, `translate-x-[<arbitrary-value>]`,
     * `translate-y-<number>` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/translate Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/translate , MDN docs}
     */
    translate: TranslateValue
}
type TextUnderlineOffsetUnderlineoffsetLiteral =
    `underline-offset-${TextUnderlineOffsetRef1}`
type TextUnderlineOffsetUnderlineoffsetLiteralWithSign =
    | TextUnderlineOffsetUnderlineoffsetLiteral
    | `-${TextUnderlineOffsetUnderlineoffsetLiteral}`
type TextUnderlineOffsetProperty =
    TextUnderlineOffsetUnderlineoffsetLiteralWithSign
type TextUnderlineOffsetArbitraryValue =
    | (`underline-offset-${number}` & {})
    | (`underline-offset-${number}` & {})
    | (`-underline-offset-${number}` & {})
    | (`underline-offset-(${string})` & {})
    | (`underline-offset-[${string}]` & {})
type TextUnderlineOffsetValue =
    | TextUnderlineOffsetProperty
    | TextUnderlineOffsetArbitraryValue
interface TailwindTextUnderlineOffset {
    /**
     * `TextUnderlineOffset`
     *
     * Utilities for controlling the offset of a text underline.
     *
     * Arbitrary support
     *
     * `underline-offset-<number>`, `-underline-offset-<number>`,
     * `underline-offset-(<var-name>)`, `underline-offset-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/text-underline-offset Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/text-underline-offset , MDN docs}
     */
    textUnderlineOffset: TextUnderlineOffsetValue
}
type ZIndexZLiteral = `z-${ZIndexRef1}`
type ZIndexZLiteralWithSign = ZIndexZLiteral | `-${ZIndexZLiteral}`
type ZIndexProperty = ZIndexZLiteralWithSign
type ZIndexArbitraryValue =
    | (`z-${number}` & {})
    | (`z-[${string}]` & {})
    | (`z-(${string})` & {})
type ZIndexValue = ZIndexProperty | ZIndexArbitraryValue
interface TailwindZIndex {
    /**
     * `ZIndex`
     *
     * Utilities for controlling the stack order of an element.
     *
     * Arbitrary support
     *
     * `z-<number>`, `z-[<arbitrary-value>]`, `z-(<var-name>)`
     *
     * @see
     * {@link https://tailwindcss.com/docs/z-index Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/z-index , MDN docs}
     */
    zIndex: ZIndexValue
}
type ContainerTypeValue =
    | "@container"
    | "@container-normal"
    | "@container"
    | "@container-normal"
interface TailwindContainerType {
    /**
     * `ContainerType`
     *
     * @see
     * {@link https://tailwindcss.com/docs Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/container-type , MDN docs}
     */
    containerType: ContainerTypeValue
}
type PositionValue =
    | "absolute"
    | "fixed"
    | "relative"
    | "static"
    | "sticky"
    | "absolute"
    | "fixed"
    | "relative"
    | "static"
    | "sticky"
interface TailwindPosition {
    /**
     * `Position`
     *
     * Utilities for controlling how an element is positioned in the document.
     *
     * @see
     * {@link https://tailwindcss.com/docs/position Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/position , MDN docs}
     */
    position: PositionValue
}
type AccentColorAccentchartLiteral = `accent-chart-${AccentColorRef1}`
type AccentColorAccentprimaryLiteral = `accent-primary-${AccentColorRef2}`
type AccentColorAccentsidebarLiteral = `accent-sidebar-${AccentColorRef3}`
type AccentColorAccentLiteral = `accent-${AccentColorRef4}`
type AccentColorProperty =
    | AccentColorAccentchartLiteral
    | AccentColorAccentprimaryLiteral
    | AccentColorAccentsidebarLiteral
    | AccentColorAccentLiteral
type AccentColorArbitraryValue =
    | (`accent-(${string})` & {})
    | (`accent-[${string}]` & {})
type AccentColorValue =
    | AccentColorProperty
    | (`accent-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`accent-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`accent-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`accent-${string}/${VariantsA91e8ba1}` & {})
    | AccentColorArbitraryValue
interface TailwindAccentColor {
    /**
     * `AccentColor`
     *
     * Utilities for controlling the accented color of a form control.
     *
     * Arbitrary support
     *
     * `accent-(<var-name>)`, `accent-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/accent-color Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/accent-color , MDN docs}
     */
    accentColor: AccentColorValue
}
type VerticalAlignAlignLiteral = `align-${VerticalAlignRef1}`
type VerticalAlignProperty = VerticalAlignAlignLiteral
type VerticalAlignArbitraryValue =
    | (`align-(${string})` & {})
    | (`align-[${string}]` & {})
type VerticalAlignValue = VerticalAlignProperty | VerticalAlignArbitraryValue
interface TailwindVerticalAlign {
    /**
     * `VerticalAlign`
     *
     * Utilities for controlling the vertical alignment of an inline or table-cell
     * box.
     *
     * Arbitrary support
     *
     * `align-(<var-name>)`, `align-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/vertical-align Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/vertical-align , MDN docs}
     */
    verticalAlign: VerticalAlignValue
}
type AnimationAnimateLiteral = `animate-${AnimationRef1}`
type AnimationProperty = AnimationAnimateLiteral
type AnimationArbitraryValue =
    | (`animate-(${string})` & {})
    | (`animate-[${string}]` & {})
type AnimationValue = AnimationProperty | AnimationArbitraryValue
interface TailwindAnimation {
    /**
     * `Animation`
     *
     * Utilities for animating elements with CSS animations.
     *
     * Arbitrary support
     *
     * `animate-(<var-name>)`, `animate-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/animation Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/animation , MDN docs}
     */
    animation: AnimationValue
}
type AnimationDurationValue =
    | "animation-duration-initial"
    | "animation-duration-initial"
interface TailwindAnimationDuration {
    /**
     * `AnimationDuration`
     *
     * @see
     * {@link https://tailwindcss.com/docs Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/animation-duration , MDN docs}
     */
    animationDuration: AnimationDurationValue
}
type FontSmoothingValue =
    | "antialiased"
    | "subpixel-antialiased"
    | "antialiased"
    | "subpixel-antialiased"
interface TailwindFontSmoothing {
    /**
     * `FontSmoothing`
     *
     * Utilities for controlling the font smoothing of an element.
     *
     * @see
     * {@link https://tailwindcss.com/docs/font-smoothing Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-smoothing , MDN docs}
     */
    fontSmoothing: FontSmoothingValue
}
type AppearanceValue =
    | "appearance-auto"
    | "appearance-none"
    | "appearance-auto"
    | "appearance-none"
interface TailwindAppearance {
    /**
     * `Appearance`
     *
     * Utilities for suppressing native form control styling.
     *
     * @see
     * {@link https://tailwindcss.com/docs/appearance Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/appearance , MDN docs}
     */
    appearance: AppearanceValue
}
type AspectRatioAspectLiteral = `aspect-${AspectRatioRef1}`
type AspectRatioProperty = AspectRatioAspectLiteral
type AspectRatioArbitraryValue =
    | (`aspect-${number}` & {})
    | (`aspect-(${string})` & {})
    | (`aspect-[${string}]` & {})
type AspectRatioValue = AspectRatioProperty | AspectRatioArbitraryValue
interface TailwindAspectRatio {
    /**
     * `AspectRatio`
     *
     * Utilities for controlling the aspect ratio of an element.
     *
     * Arbitrary support
     *
     * `aspect-<number>`, `aspect-(<var-name>)`, `aspect-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/aspect-ratio Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio , MDN docs}
     */
    aspectRatio: AspectRatioValue
}
type GridAutoColumnsAutocolsLiteral = `auto-cols-${GridAutoColumnsRef1}`
type GridAutoColumnsProperty = GridAutoColumnsAutocolsLiteral
type GridAutoColumnsArbitraryValue =
    | (`auto-cols-(${string})` & {})
    | (`auto-cols-[${string}]` & {})
type GridAutoColumnsValue =
    | GridAutoColumnsProperty
    | GridAutoColumnsArbitraryValue
interface TailwindGridAutoColumns {
    /**
     * `GridAutoColumns`
     *
     * Utilities for controlling the size of implicitly-created grid columns.
     *
     * Arbitrary support
     *
     * `auto-cols-(<var-name>)`, `auto-cols-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/grid-auto-columns Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-columns , MDN docs}
     */
    gridAutoColumns: GridAutoColumnsValue
}
type GridAutoRowsAutorowsLiteral = `auto-rows-${GridAutoRowsRef1}`
type GridAutoRowsProperty = GridAutoRowsAutorowsLiteral
type GridAutoRowsArbitraryValue =
    | (`auto-rows-(${string})` & {})
    | (`auto-rows-[${string}]` & {})
type GridAutoRowsValue = GridAutoRowsProperty | GridAutoRowsArbitraryValue
interface TailwindGridAutoRows {
    /**
     * `GridAutoRows`
     *
     * Utilities for controlling the size of implicitly-created grid rows.
     *
     * Arbitrary support
     *
     * `auto-rows-(<var-name>)`, `auto-rows-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/grid-auto-rows Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-rows , MDN docs}
     */
    gridAutoRows: GridAutoRowsValue
}
type BackdropFilterBackdropblurLiteral = `backdrop-blur-${BackdropFilterRef1}`
type BackdropFilterBackdropbrightnessLiteral =
    | `backdrop-brightness-${BackdropFilterRef2}`
    | "backdrop-brightness-90"
    | "backdrop-brightness-95"
    | "backdrop-brightness-105"
    | "backdrop-brightness-110"
type BackdropFilterBackdropcontrastLiteral =
    `backdrop-contrast-${BackdropFilterRef2}`
type BackdropFilterBackdropgrayscaleLiteral =
    `backdrop-grayscale-${BackdropFilterRef3}`
type BackdropFilterBackdrophuerotateLiteral =
    `backdrop-hue-rotate-${BackdropFilterRef4}`
type BackdropFilterBackdropinvertLiteral =
    `backdrop-invert-${BackdropFilterRef5}`
type BackdropFilterBackdropopacityLiteral =
    `backdrop-opacity-${BackdropFilterRef6}`
type BackdropFilterBackdropsaturateLiteral =
    `backdrop-saturate-${BackdropFilterRef7}`
type BackdropFilterBackdropsepiaLiteral = `backdrop-sepia-${BackdropFilterRef8}`
type BackdropFilterBackdropLiteral = `backdrop-${BackdropFilterRef9}`
type BackdropFilterProperty =
    | BackdropFilterBackdropblurLiteral
    | BackdropFilterBackdropbrightnessLiteral
    | BackdropFilterBackdropcontrastLiteral
    | BackdropFilterBackdropgrayscaleLiteral
    | BackdropFilterBackdrophuerotateLiteral
    | BackdropFilterBackdropinvertLiteral
    | BackdropFilterBackdropopacityLiteral
    | BackdropFilterBackdropsaturateLiteral
    | BackdropFilterBackdropsepiaLiteral
    | BackdropFilterBackdropLiteral
type BackdropFilterArbitraryValue =
    | (`backdrop-(${string})` & {})
    | (`backdrop-[${string}]` & {})
type BackdropFilterValue = BackdropFilterProperty | BackdropFilterArbitraryValue
interface TailwindBackdropFilter {
    /**
     * `BackdropFilter`
     *
     * Utilities for applying backdrop filters to an element.
     *
     * Arbitrary support
     *
     * `backdrop-(<var-name>)`, `backdrop-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/backdrop-filter Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter , MDN docs}
     */
    backdropFilter: BackdropFilterValue
}
type BackfaceVisibilityValue =
    | "backface-hidden"
    | "backface-visible"
    | "backface-hidden"
    | "backface-visible"
interface TailwindBackfaceVisibility {
    /**
     * `BackfaceVisibility`
     *
     * Utilities for controlling if an element's backface is visible.
     *
     * @see
     * {@link https://tailwindcss.com/docs/backface-visibility Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/backface-visibility , MDN docs}
     */
    backfaceVisibility: BackfaceVisibilityValue
}
type FlexBasisBasisLiteral = `basis-${FlexBasisRef1}`
type FlexBasisProperty = FlexBasisBasisLiteral
type FlexBasisArbitraryValue =
    | (`basis-${number}` & {})
    | (`basis-(${string})` & {})
    | (`basis-[${string}]` & {})
type FlexBasisValue = FlexBasisProperty | FlexBasisArbitraryValue
interface TailwindFlexBasis {
    /**
     * `FlexBasis`
     *
     * Utilities for controlling the initial size of flex items.
     *
     * Arbitrary support
     *
     * `basis-<number>`, `basis-(<var-name>)`, `basis-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/flex-basis Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/flex-basis , MDN docs}
     */
    flexBasis: FlexBasisValue
}
type BackgroundColorBgaccentLiteral = `bg-accent-${BackgroundColorRef1}`
type BackgroundColorBgchartLiteral = `bg-chart-${BackgroundColorRef2}`
type BackgroundColorBgprimaryLiteral = `bg-primary-${BackgroundColorRef3}`
type BackgroundColorBgsidebarLiteral = `bg-sidebar-${BackgroundColorRef4}`
type BackgroundColorBgLiteral = `bg-${BackgroundColorRef5}`
type BackgroundColorProperty =
    | BackgroundColorBgaccentLiteral
    | BackgroundColorBgchartLiteral
    | BackgroundColorBgprimaryLiteral
    | BackgroundColorBgsidebarLiteral
    | BackgroundColorBgLiteral
type BackgroundColorArbitraryValue =
    | (`bg-(${string})` & {})
    | (`bg-[${string}]` & {})
type BackgroundColorValue =
    | BackgroundColorProperty
    | (`bg-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`bg-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`bg-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`bg-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`bg-${string}/${VariantsA91e8ba1}` & {})
    | BackgroundColorArbitraryValue
interface TailwindBackgroundColor {
    /**
     * `BackgroundColor`
     *
     * Utilities for controlling an element's background color.
     *
     * Arbitrary support
     *
     * `bg-(<var-name>)`, `bg-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/background-color Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-color , MDN docs}
     */
    backgroundColor: BackgroundColorValue
}
type BackgroundSizeBgLiteral = `bg-${BackgroundSizeRef1}`
type BackgroundSizeProperty = BackgroundSizeBgLiteral
type BackgroundSizeArbitraryValue =
    | (`bg-(${string})` & {})
    | (`bg-[${string}]` & {})
type BackgroundSizeValue = BackgroundSizeProperty | BackgroundSizeArbitraryValue
interface TailwindBackgroundSize {
    /**
     * `BackgroundSize`
     *
     * Utilities for controlling the background size of an element's background
     * image.
     *
     * Arbitrary support
     *
     * `bg-(<var-name>)`, `bg-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/background-size Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-size , MDN docs}
     */
    backgroundSize: BackgroundSizeValue
}
type BackgroundBlendModeBgblendLiteral = `bg-blend-${BackgroundBlendModeRef1}`
type BackgroundBlendModeBgblendcolorLiteral =
    `bg-blend-color-${BackgroundBlendModeRef2}`
type BackgroundBlendModeValue =
    | BackgroundBlendModeBgblendLiteral
    | BackgroundBlendModeBgblendcolorLiteral
interface TailwindBackgroundBlendMode {
    /**
     * `BackgroundBlendMode`
     *
     * Utilities for controlling how an element's background image should blend
     * with its background color.
     *
     * @see
     * {@link https://tailwindcss.com/docs/background-blend-mode Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-blend-mode , MDN docs}
     */
    backgroundBlendMode: BackgroundBlendModeValue
}
type BackgroundPositionBgbottomLiteral = `bg-bottom-${BackgroundPositionRef1}`
type BackgroundPositionBgtopLiteral = `bg-top-${BackgroundPositionRef2}`
type BackgroundPositionBgLiteral = `bg-${BackgroundPositionRef3}`
type BackgroundPositionProperty =
    | BackgroundPositionBgbottomLiteral
    | BackgroundPositionBgtopLiteral
    | BackgroundPositionBgLiteral
type BackgroundPositionArbitraryValue =
    | (`bg-(${string})` & {})
    | (`bg-[${string}]` & {})
type BackgroundPositionValue =
    | BackgroundPositionProperty
    | BackgroundPositionArbitraryValue
interface TailwindBackgroundPosition {
    /**
     * `BackgroundPosition`
     *
     * Utilities for controlling the position of an element's background image.
     *
     * Arbitrary support
     *
     * `bg-(<var-name>)`, `bg-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/background-position Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-position , MDN docs}
     */
    backgroundPosition: BackgroundPositionValue
}
type BackgroundClipBgclipLiteral = `bg-clip-${BackgroundClipRef1}`
type BackgroundClipValue = BackgroundClipBgclipLiteral
interface TailwindBackgroundClip {
    /**
     * `BackgroundClip`
     *
     * Utilities for controlling the bounding box of an element's background.
     *
     * @see
     * {@link https://tailwindcss.com/docs/background-clip Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip , MDN docs}
     */
    backgroundClip: BackgroundClipValue
}
type BackgroundAttachmentBgLiteral = `bg-${BackgroundAttachmentRef1}`
type BackgroundAttachmentValue = BackgroundAttachmentBgLiteral
interface TailwindBackgroundAttachment {
    /**
     * `BackgroundAttachment`
     *
     * Utilities for controlling how a background image behaves when scrolling.
     *
     * @see
     * {@link https://tailwindcss.com/docs/background-attachment Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-attachment , MDN docs}
     */
    backgroundAttachment: BackgroundAttachmentValue
}
type BackgroundRepeatBgrepeatLiteral = `bg-repeat-${BackgroundRepeatRef1}`
type BackgroundRepeatBgLiteral = `bg-${BackgroundRepeatRef2}`
type BackgroundRepeatValue =
    | BackgroundRepeatBgrepeatLiteral
    | BackgroundRepeatBgLiteral
interface TailwindBackgroundRepeat {
    /**
     * `BackgroundRepeat`
     *
     * Utilities for controlling the repetition of an element's background image.
     *
     * @see
     * {@link https://tailwindcss.com/docs/background-repeat Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat , MDN docs}
     */
    backgroundRepeat: BackgroundRepeatValue
}
type BackgroundOriginBgoriginLiteral = `bg-origin-${BackgroundOriginRef1}`
type BackgroundOriginValue = BackgroundOriginBgoriginLiteral
interface TailwindBackgroundOrigin {
    /**
     * `BackgroundOrigin`
     *
     * Utilities for controlling how an element's background is positioned
     * relative to borders, padding, and content.
     *
     * @see
     * {@link https://tailwindcss.com/docs/background-origin Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-origin , MDN docs}
     */
    backgroundOrigin: BackgroundOriginValue
}
type DisplayInlineLiteral = `inline-${DisplayRef1}`
type DisplayTableLiteral = `table-${DisplayRef2}`
type DisplayValue =
    | "block"
    | "contents"
    | "flex"
    | "flow-root"
    | "grid"
    | "hidden"
    | "inline"
    | "list-item"
    | "not-sr-only"
    | "sr-only"
    | "table"
    | DisplayInlineLiteral
    | DisplayTableLiteral
interface TailwindDisplay {
    /**
     * `Display`
     *
     * Utilities for controlling the display box type of an element.
     *
     * @see
     * {@link https://tailwindcss.com/docs/display Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/display , MDN docs}
     */
    display: DisplayValue
}
type BlockSizeBlockLiteral = `block-${BlockSizeRef1}`
type BlockSizeProperty = BlockSizeBlockLiteral
type BlockSizeArbitraryValue =
    | (`block-${number}` & {})
    | (`block-(${string})` & {})
    | (`block-[${string}]` & {})
type BlockSizeValue = BlockSizeProperty | BlockSizeArbitraryValue
interface TailwindBlockSize {
    /**
     * `BlockSize`
     *
     * Utilities for setting the block size of an element.
     *
     * Arbitrary support
     *
     * `block-<number>`, `block-(<var-name>)`, `block-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/block-size Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/block-size , MDN docs}
     */
    blockSize: BlockSizeValue
}
type FilterBlurLiteral = `blur-${FilterRef1}`
type FilterBrightnessLiteral =
    | `brightness-${FilterRef2}`
    | "brightness-90"
    | "brightness-95"
    | "brightness-105"
    | "brightness-110"
type FilterContrastLiteral = `contrast-${FilterRef2}`
type FilterDropshadowaccentLiteral = `drop-shadow-accent-${FilterRef3}`
type FilterDropshadowchartLiteral = `drop-shadow-chart-${FilterRef4}`
type FilterDropshadowprimaryLiteral = `drop-shadow-primary-${FilterRef5}`
type FilterDropshadowsidebarLiteral = `drop-shadow-sidebar-${FilterRef6}`
type FilterGrayscaleLiteral = `grayscale-${FilterRef7}`
type FilterHuerotateLiteral = `hue-rotate-${FilterRef8}`
type FilterInvertLiteral = `invert-${FilterRef9}`
type FilterSaturateLiteral = `saturate-${FilterRef10}`
type FilterSepiaLiteral = `sepia-${FilterRef11}`
type FilterDropshadowLiteral = `drop-shadow-${FilterRef12}`
type FilterProperty =
    | "grayscale"
    | "invert"
    | "sepia"
    | FilterBlurLiteral
    | FilterBrightnessLiteral
    | FilterContrastLiteral
    | FilterDropshadowaccentLiteral
    | FilterDropshadowchartLiteral
    | FilterDropshadowprimaryLiteral
    | FilterDropshadowsidebarLiteral
    | FilterGrayscaleLiteral
    | FilterHuerotateLiteral
    | FilterInvertLiteral
    | FilterSaturateLiteral
    | FilterSepiaLiteral
    | FilterDropshadowLiteral
type FilterValue =
    | FilterProperty
    | (`blur-${string}/${VariantsA91e8ba1}` & {})
    | (`brightness-${string}/${VariantsA91e8ba1}` & {})
    | (`contrast-${string}/${VariantsA91e8ba1}` & {})
    | (`drop-shadow-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`drop-shadow-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`drop-shadow-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`drop-shadow-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`grayscale-${string}/${VariantsA91e8ba1}` & {})
    | (`hue-rotate-${string}/${VariantsA91e8ba1}` & {})
    | (`invert-${string}/${VariantsA91e8ba1}` & {})
    | (`saturate-${string}/${VariantsA91e8ba1}` & {})
    | (`sepia-${string}/${VariantsA91e8ba1}` & {})
    | (`drop-shadow-${string}/${VariantsA91e8ba1}` & {})
interface TailwindFilter {
    /**
     * `Filter`
     *
     * Utilities for applying filters to an element.
     *
     * @see
     * {@link https://tailwindcss.com/docs/filter Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/filter , MDN docs}
     */
    filter: FilterValue
}
type BorderWidthBorderaccentLiteral = `border-accent-${BorderWidthRef1}`
type BorderWidthBorderbLiteral =
    | `border-b-${BorderWidthRef2}`
    | "border-b-0"
    | "border-b-2"
    | "border-b-4"
    | "border-b-8"
    | "border-b-background"
    | "border-b-card"
    | "border-b-card-foreground"
    | "border-b-chart-1"
    | "border-b-chart-2"
    | "border-b-chart-3"
    | "border-b-chart-4"
    | "border-b-chart-5"
    | "border-b-destructive"
    | "border-b-input"
    | "border-b-muted"
    | "border-b-muted-foreground"
    | "border-b-popover"
    | "border-b-popover-foreground"
    | "border-b-secondary"
    | "border-b-secondary-foreground"
    | "border-b-sidebar"
    | "border-b-sidebar-accent"
    | "border-b-sidebar-accent-foreground"
    | "border-b-sidebar-border"
    | "border-b-sidebar-foreground"
    | "border-b-sidebar-primary"
    | "border-b-sidebar-primary-foreground"
    | "border-b-sidebar-ring"
type BorderWidthBorderbeLiteral =
    | `border-be-${BorderWidthRef2}`
    | "border-be-0"
    | "border-be-2"
    | "border-be-4"
    | "border-be-8"
    | "border-be-background"
    | "border-be-card"
    | "border-be-card-foreground"
    | "border-be-chart-1"
    | "border-be-chart-2"
    | "border-be-chart-3"
    | "border-be-chart-4"
    | "border-be-chart-5"
    | "border-be-destructive"
    | "border-be-input"
    | "border-be-muted"
    | "border-be-muted-foreground"
    | "border-be-popover"
    | "border-be-popover-foreground"
    | "border-be-secondary"
    | "border-be-secondary-foreground"
    | "border-be-sidebar"
    | "border-be-sidebar-accent"
    | "border-be-sidebar-accent-foreground"
    | "border-be-sidebar-border"
    | "border-be-sidebar-foreground"
    | "border-be-sidebar-primary"
    | "border-be-sidebar-primary-foreground"
    | "border-be-sidebar-ring"
type BorderWidthBorderbsLiteral =
    | `border-bs-${BorderWidthRef2}`
    | "border-bs-0"
    | "border-bs-2"
    | "border-bs-4"
    | "border-bs-8"
    | "border-bs-background"
    | "border-bs-card"
    | "border-bs-card-foreground"
    | "border-bs-chart-1"
    | "border-bs-chart-2"
    | "border-bs-chart-3"
    | "border-bs-chart-4"
    | "border-bs-chart-5"
    | "border-bs-destructive"
    | "border-bs-input"
    | "border-bs-muted"
    | "border-bs-muted-foreground"
    | "border-bs-popover"
    | "border-bs-popover-foreground"
    | "border-bs-secondary"
    | "border-bs-secondary-foreground"
    | "border-bs-sidebar"
    | "border-bs-sidebar-accent"
    | "border-bs-sidebar-accent-foreground"
    | "border-bs-sidebar-border"
    | "border-bs-sidebar-foreground"
    | "border-bs-sidebar-primary"
    | "border-bs-sidebar-primary-foreground"
    | "border-bs-sidebar-ring"
type BorderWidthBordercardLiteral = `border-card-${BorderWidthRef3}`
type BorderWidthBorderchartLiteral = `border-chart-${BorderWidthRef4}`
type BorderWidthBorderlLiteral =
    | `border-l-${BorderWidthRef2}`
    | "border-l-0"
    | "border-l-2"
    | "border-l-4"
    | "border-l-8"
    | "border-l-background"
    | "border-l-card"
    | "border-l-card-foreground"
    | "border-l-chart-1"
    | "border-l-chart-2"
    | "border-l-chart-3"
    | "border-l-chart-4"
    | "border-l-chart-5"
    | "border-l-destructive"
    | "border-l-input"
    | "border-l-muted"
    | "border-l-muted-foreground"
    | "border-l-popover"
    | "border-l-popover-foreground"
    | "border-l-secondary"
    | "border-l-secondary-foreground"
    | "border-l-sidebar"
    | "border-l-sidebar-accent"
    | "border-l-sidebar-accent-foreground"
    | "border-l-sidebar-border"
    | "border-l-sidebar-foreground"
    | "border-l-sidebar-primary"
    | "border-l-sidebar-primary-foreground"
    | "border-l-sidebar-ring"
type BorderWidthBordermutedLiteral = `border-muted-${BorderWidthRef5}`
type BorderWidthBorderpopoverLiteral = `border-popover-${BorderWidthRef6}`
type BorderWidthBorderprimaryLiteral = `border-primary-${BorderWidthRef7}`
type BorderWidthBordersecondaryLiteral = `border-secondary-${BorderWidthRef8}`
type BorderWidthBordersidebarLiteral = `border-sidebar-${BorderWidthRef2}`
type BorderWidthBordertLiteral =
    | `border-t-${BorderWidthRef2}`
    | "border-t-0"
    | "border-t-2"
    | "border-t-4"
    | "border-t-8"
    | "border-t-background"
    | "border-t-card"
    | "border-t-card-foreground"
    | "border-t-chart-1"
    | "border-t-chart-2"
    | "border-t-chart-3"
    | "border-t-chart-4"
    | "border-t-chart-5"
    | "border-t-destructive"
    | "border-t-input"
    | "border-t-muted"
    | "border-t-muted-foreground"
    | "border-t-popover"
    | "border-t-popover-foreground"
    | "border-t-secondary"
    | "border-t-secondary-foreground"
    | "border-t-sidebar"
    | "border-t-sidebar-accent"
    | "border-t-sidebar-accent-foreground"
    | "border-t-sidebar-border"
    | "border-t-sidebar-foreground"
    | "border-t-sidebar-primary"
    | "border-t-sidebar-primary-foreground"
    | "border-t-sidebar-ring"
type BorderWidthBorderxLiteral =
    | `border-x-${BorderWidthRef2}`
    | "border-x-0"
    | "border-x-2"
    | "border-x-4"
    | "border-x-8"
    | "border-x-background"
    | "border-x-card"
    | "border-x-card-foreground"
    | "border-x-chart-1"
    | "border-x-chart-2"
    | "border-x-chart-3"
    | "border-x-chart-4"
    | "border-x-chart-5"
    | "border-x-destructive"
    | "border-x-input"
    | "border-x-muted"
    | "border-x-muted-foreground"
    | "border-x-popover"
    | "border-x-popover-foreground"
    | "border-x-secondary"
    | "border-x-secondary-foreground"
    | "border-x-sidebar"
    | "border-x-sidebar-accent"
    | "border-x-sidebar-accent-foreground"
    | "border-x-sidebar-border"
    | "border-x-sidebar-foreground"
    | "border-x-sidebar-primary"
    | "border-x-sidebar-primary-foreground"
    | "border-x-sidebar-ring"
type BorderWidthBorderyLiteral =
    | `border-y-${BorderWidthRef2}`
    | "border-y-0"
    | "border-y-2"
    | "border-y-4"
    | "border-y-8"
    | "border-y-background"
    | "border-y-card"
    | "border-y-card-foreground"
    | "border-y-chart-1"
    | "border-y-chart-2"
    | "border-y-chart-3"
    | "border-y-chart-4"
    | "border-y-chart-5"
    | "border-y-destructive"
    | "border-y-input"
    | "border-y-muted"
    | "border-y-muted-foreground"
    | "border-y-popover"
    | "border-y-popover-foreground"
    | "border-y-secondary"
    | "border-y-secondary-foreground"
    | "border-y-sidebar"
    | "border-y-sidebar-accent"
    | "border-y-sidebar-accent-foreground"
    | "border-y-sidebar-border"
    | "border-y-sidebar-foreground"
    | "border-y-sidebar-primary"
    | "border-y-sidebar-primary-foreground"
    | "border-y-sidebar-ring"
type BorderWidthDividexLiteral = `divide-x-${BorderWidthRef9}`
type BorderWidthDivideyLiteral = `divide-y-${BorderWidthRef10}`
type BorderWidthBorderLiteral = `border-${BorderWidthRef11}`
type BorderWidthBordereLiteral =
    | `border-e-${BorderWidthRef2}`
    | "border-e-0"
    | "border-e-2"
    | "border-e-4"
    | "border-e-8"
    | "border-e-background"
    | "border-e-card"
    | "border-e-card-foreground"
    | "border-e-chart-1"
    | "border-e-chart-2"
    | "border-e-chart-3"
    | "border-e-chart-4"
    | "border-e-chart-5"
    | "border-e-destructive"
    | "border-e-input"
    | "border-e-muted"
    | "border-e-muted-foreground"
    | "border-e-popover"
    | "border-e-popover-foreground"
    | "border-e-secondary"
    | "border-e-secondary-foreground"
    | "border-e-sidebar"
    | "border-e-sidebar-accent"
    | "border-e-sidebar-accent-foreground"
    | "border-e-sidebar-border"
    | "border-e-sidebar-foreground"
    | "border-e-sidebar-primary"
    | "border-e-sidebar-primary-foreground"
    | "border-e-sidebar-ring"
type BorderWidthBorderrLiteral =
    | `border-r-${BorderWidthRef2}`
    | "border-r-0"
    | "border-r-2"
    | "border-r-4"
    | "border-r-8"
    | "border-r-background"
    | "border-r-card"
    | "border-r-card-foreground"
    | "border-r-chart-1"
    | "border-r-chart-2"
    | "border-r-chart-3"
    | "border-r-chart-4"
    | "border-r-chart-5"
    | "border-r-destructive"
    | "border-r-input"
    | "border-r-muted"
    | "border-r-muted-foreground"
    | "border-r-popover"
    | "border-r-popover-foreground"
    | "border-r-secondary"
    | "border-r-secondary-foreground"
    | "border-r-sidebar"
    | "border-r-sidebar-accent"
    | "border-r-sidebar-accent-foreground"
    | "border-r-sidebar-border"
    | "border-r-sidebar-foreground"
    | "border-r-sidebar-primary"
    | "border-r-sidebar-primary-foreground"
    | "border-r-sidebar-ring"
type BorderWidthBordersLiteral =
    | `border-s-${BorderWidthRef2}`
    | "border-s-0"
    | "border-s-2"
    | "border-s-4"
    | "border-s-8"
    | "border-s-background"
    | "border-s-card"
    | "border-s-card-foreground"
    | "border-s-chart-1"
    | "border-s-chart-2"
    | "border-s-chart-3"
    | "border-s-chart-4"
    | "border-s-chart-5"
    | "border-s-destructive"
    | "border-s-input"
    | "border-s-muted"
    | "border-s-muted-foreground"
    | "border-s-popover"
    | "border-s-popover-foreground"
    | "border-s-secondary"
    | "border-s-secondary-foreground"
    | "border-s-sidebar"
    | "border-s-sidebar-accent"
    | "border-s-sidebar-accent-foreground"
    | "border-s-sidebar-border"
    | "border-s-sidebar-foreground"
    | "border-s-sidebar-primary"
    | "border-s-sidebar-primary-foreground"
    | "border-s-sidebar-ring"
type BorderWidthDivideLiteral = `divide-${BorderWidthRef12}`
type BorderWidthProperty =
    | "border"
    | BorderWidthBorderaccentLiteral
    | BorderWidthBorderbLiteral
    | BorderWidthBorderbeLiteral
    | BorderWidthBorderbsLiteral
    | BorderWidthBordercardLiteral
    | BorderWidthBorderchartLiteral
    | BorderWidthBorderlLiteral
    | BorderWidthBordermutedLiteral
    | BorderWidthBorderpopoverLiteral
    | BorderWidthBorderprimaryLiteral
    | BorderWidthBordersecondaryLiteral
    | BorderWidthBordersidebarLiteral
    | BorderWidthBordertLiteral
    | BorderWidthBorderxLiteral
    | BorderWidthBorderyLiteral
    | BorderWidthDividexLiteral
    | BorderWidthDivideyLiteral
    | BorderWidthBorderLiteral
    | BorderWidthBordereLiteral
    | BorderWidthBorderrLiteral
    | BorderWidthBordersLiteral
    | BorderWidthDivideLiteral
type BorderWidthArbitraryValue =
    | (`border-${number}` & {})
    | (`border-(${string})` & {})
    | (`border-[${string}]` & {})
    | (`border-b-${number}` & {})
    | (`border-b-(${string})` & {})
    | (`border-b-[${string}]` & {})
    | (`border-be-${number}` & {})
    | (`border-be-(${string})` & {})
    | (`border-be-[${string}]` & {})
    | (`border-bs-${number}` & {})
    | (`border-bs-(${string})` & {})
    | (`border-bs-[${string}]` & {})
    | (`border-l-${number}` & {})
    | (`border-l-(${string})` & {})
    | (`border-l-[${string}]` & {})
    | (`border-t-${number}` & {})
    | (`border-t-(${string})` & {})
    | (`border-t-[${string}]` & {})
    | (`border-x-${number}` & {})
    | (`border-x-(${string})` & {})
    | (`border-x-[${string}]` & {})
    | (`border-y-${number}` & {})
    | (`border-y-(${string})` & {})
    | (`border-y-[${string}]` & {})
    | (`divide-x-${number}` & {})
    | (`divide-x-(${string})` & {})
    | (`divide-x-[${string}]` & {})
    | (`divide-y-${number}` & {})
    | (`divide-y-(${string})` & {})
    | (`divide-y-[${string}]` & {})
    | (`border-e-${number}` & {})
    | (`border-e-(${string})` & {})
    | (`border-e-[${string}]` & {})
    | (`border-r-${number}` & {})
    | (`border-r-(${string})` & {})
    | (`border-r-[${string}]` & {})
    | (`border-s-${number}` & {})
    | (`border-s-(${string})` & {})
    | (`border-s-[${string}]` & {})
    | (`divide-${number}` & {})
    | (`divide-(${string})` & {})
    | (`divide-[${string}]` & {})
type BorderWidthValue =
    | BorderWidthProperty
    | (`border-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`border-b-${string}/${VariantsA91e8ba1}` & {})
    | (`border-be-${string}/${VariantsA91e8ba1}` & {})
    | (`border-bs-${string}/${VariantsA91e8ba1}` & {})
    | (`border-card-${string}/${VariantsA91e8ba1}` & {})
    | (`border-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`border-l-${string}/${VariantsA91e8ba1}` & {})
    | (`border-muted-${string}/${VariantsA91e8ba1}` & {})
    | (`border-popover-${string}/${VariantsA91e8ba1}` & {})
    | (`border-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`border-secondary-${string}/${VariantsA91e8ba1}` & {})
    | (`border-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`border-t-${string}/${VariantsA91e8ba1}` & {})
    | (`border-x-${string}/${VariantsA91e8ba1}` & {})
    | (`border-y-${string}/${VariantsA91e8ba1}` & {})
    | (`divide-x-${string}/${VariantsA91e8ba1}` & {})
    | (`divide-y-${string}/${VariantsA91e8ba1}` & {})
    | (`border-${string}/${VariantsA91e8ba1}` & {})
    | (`border-e-${string}/${VariantsA91e8ba1}` & {})
    | (`border-r-${string}/${VariantsA91e8ba1}` & {})
    | (`border-s-${string}/${VariantsA91e8ba1}` & {})
    | (`divide-${string}/${VariantsA91e8ba1}` & {})
    | BorderWidthArbitraryValue
interface TailwindBorderWidth {
    /**
     * `BorderWidth`
     *
     * Utilities for controlling the width of an element's borders.
     *
     * Arbitrary support
     *
     * `border-<number>`, `border-(<var-name>)`, `border-[<arbitrary-value>]`,
     * `border-b-<number>`, `border-b-(<var-name>)` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/border-width Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/border-width , MDN docs}
     */
    borderWidth: BorderWidthValue
}
type BorderColorBorderbLiteral = `border-b-${BorderColorRef1}`
type BorderColorBorderbeLiteral = `border-be-${BorderColorRef1}`
type BorderColorBorderbsLiteral = `border-bs-${BorderColorRef1}`
type BorderColorBorderlLiteral = `border-l-${BorderColorRef1}`
type BorderColorBorderrLiteral = `border-r-${BorderColorRef1}`
type BorderColorBordertLiteral = `border-t-${BorderColorRef1}`
type BorderColorBorderxLiteral = `border-x-${BorderColorRef1}`
type BorderColorBorderyLiteral = `border-y-${BorderColorRef1}`
type BorderColorDivideaccentLiteral = `divide-accent-${BorderColorRef2}`
type BorderColorDividechartLiteral = `divide-chart-${BorderColorRef3}`
type BorderColorDivideprimaryLiteral = `divide-primary-${BorderColorRef4}`
type BorderColorDividesidebarLiteral = `divide-sidebar-${BorderColorRef5}`
type BorderColorBorderLiteral = `border-${BorderColorRef1}`
type BorderColorBordereLiteral = `border-e-${BorderColorRef1}`
type BorderColorBordersLiteral = `border-s-${BorderColorRef1}`
type BorderColorDivideLiteral =
    | `divide-${BorderColorRef1}`
    | "divide-accent"
    | "divide-background"
    | "divide-border"
    | "divide-card"
    | "divide-card-foreground"
    | "divide-destructive"
    | "divide-foreground"
    | "divide-input"
    | "divide-muted"
    | "divide-muted-foreground"
    | "divide-popover"
    | "divide-popover-foreground"
    | "divide-primary"
    | "divide-ring"
    | "divide-secondary"
    | "divide-secondary-foreground"
    | "divide-sidebar"
type BorderColorProperty =
    | BorderColorBorderbLiteral
    | BorderColorBorderbeLiteral
    | BorderColorBorderbsLiteral
    | BorderColorBorderlLiteral
    | BorderColorBorderrLiteral
    | BorderColorBordertLiteral
    | BorderColorBorderxLiteral
    | BorderColorBorderyLiteral
    | BorderColorDivideaccentLiteral
    | BorderColorDividechartLiteral
    | BorderColorDivideprimaryLiteral
    | BorderColorDividesidebarLiteral
    | BorderColorBorderLiteral
    | BorderColorBordereLiteral
    | BorderColorBordersLiteral
    | BorderColorDivideLiteral
type BorderColorArbitraryValue =
    | (`border-b-(${string})` & {})
    | (`border-b-[${string}]` & {})
    | (`border-be-(${string})` & {})
    | (`border-be-[${string}]` & {})
    | (`border-bs-(${string})` & {})
    | (`border-bs-[${string}]` & {})
    | (`border-l-(${string})` & {})
    | (`border-l-[${string}]` & {})
    | (`border-r-(${string})` & {})
    | (`border-r-[${string}]` & {})
    | (`border-t-(${string})` & {})
    | (`border-t-[${string}]` & {})
    | (`border-x-(${string})` & {})
    | (`border-x-[${string}]` & {})
    | (`border-y-(${string})` & {})
    | (`border-y-[${string}]` & {})
    | (`border-(${string})` & {})
    | (`border-[${string}]` & {})
    | (`border-e-(${string})` & {})
    | (`border-e-[${string}]` & {})
    | (`border-s-(${string})` & {})
    | (`border-s-[${string}]` & {})
    | (`divide-(${string})` & {})
    | (`divide-[${string}]` & {})
type BorderColorValue =
    | BorderColorProperty
    | (`border-b-${string}/${VariantsA91e8ba1}` & {})
    | (`border-be-${string}/${VariantsA91e8ba1}` & {})
    | (`border-bs-${string}/${VariantsA91e8ba1}` & {})
    | (`border-l-${string}/${VariantsA91e8ba1}` & {})
    | (`border-r-${string}/${VariantsA91e8ba1}` & {})
    | (`border-t-${string}/${VariantsA91e8ba1}` & {})
    | (`border-x-${string}/${VariantsA91e8ba1}` & {})
    | (`border-y-${string}/${VariantsA91e8ba1}` & {})
    | (`divide-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`divide-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`divide-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`divide-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`border-${string}/${VariantsA91e8ba1}` & {})
    | (`border-e-${string}/${VariantsA91e8ba1}` & {})
    | (`border-s-${string}/${VariantsA91e8ba1}` & {})
    | (`divide-${string}/${VariantsA91e8ba1}` & {})
    | BorderColorArbitraryValue
interface TailwindBorderColor {
    /**
     * `BorderColor`
     *
     * Utilities for controlling the color of an element's borders.
     *
     * Arbitrary support
     *
     * `border-b-(<var-name>)`, `border-b-[<arbitrary-value>]`,
     * `border-be-(<var-name>)`, `border-be-[<arbitrary-value>]`,
     * `border-bs-(<var-name>)` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/border-color Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/border-color , MDN docs}
     */
    borderColor: BorderColorValue
}
type BorderCollapseValue =
    | "border-collapse"
    | "border-separate"
    | "border-collapse"
    | "border-separate"
interface TailwindBorderCollapse {
    /**
     * `BorderCollapse`
     *
     * Utilities for controlling whether table borders should collapse or be
     * separated.
     *
     * @see
     * {@link https://tailwindcss.com/docs/border-collapse Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/border-collapse , MDN docs}
     */
    borderCollapse: BorderCollapseValue
}
type BorderStyleBorderLiteral = `border-${BorderStyleRef1}`
type BorderStyleDivideLiteral = `divide-${BorderStyleRef2}`
type BorderStyleValue = BorderStyleBorderLiteral | BorderStyleDivideLiteral
interface TailwindBorderStyle {
    /**
     * `BorderStyle`
     *
     * Utilities for controlling the style of an element's borders.
     *
     * @see
     * {@link https://tailwindcss.com/docs/border-style Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/border-style , MDN docs}
     */
    borderStyle: BorderStyleValue
}
type BorderSpacingXLiteral = `border-spacing-x-${BorderSpacingRef1}`
type BorderSpacingYLiteral = `border-spacing-y-${BorderSpacingRef1}`
type BorderSpacingLiteral = `border-spacing-${BorderSpacingRef1}`
type BorderSpacingProperty =
    | BorderSpacingXLiteral
    | BorderSpacingYLiteral
    | BorderSpacingLiteral
type BorderSpacingArbitraryValue =
    | (`border-spacing-x-${number}` & {})
    | (`border-spacing-x-(${string})` & {})
    | (`border-spacing-x-[${string}]` & {})
    | (`border-spacing-y-${number}` & {})
    | (`border-spacing-y-(${string})` & {})
    | (`border-spacing-y-[${string}]` & {})
    | (`border-spacing-${number}` & {})
    | (`border-spacing-(${string})` & {})
    | (`border-spacing-[${string}]` & {})
type BorderSpacingValue = BorderSpacingProperty | BorderSpacingArbitraryValue
interface TailwindBorderSpacing {
    /**
     * `BorderSpacing`
     *
     * Utilities for controlling the spacing between table borders.
     *
     * Arbitrary support
     *
     * `border-spacing-x-<number>`, `border-spacing-x-(<var-name>)`,
     * `border-spacing-x-[<arbitrary-value>]`, `border-spacing-y-<number>`,
     * `border-spacing-y-(<var-name>)` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/border-spacing Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/border-spacing , MDN docs}
     */
    borderSpacing: BorderSpacingValue
}
type BoxSizingValue =
    | "box-border"
    | "box-content"
    | "box-border"
    | "box-content"
interface TailwindBoxSizing {
    /**
     * `BoxSizing`
     *
     * Utilities for controlling how the browser should calculate an element's
     * total size.
     *
     * @see
     * {@link https://tailwindcss.com/docs/box-sizing Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing , MDN docs}
     */
    boxSizing: BoxSizingValue
}
type BoxDecorationBreakValue =
    | "box-decoration-clone"
    | "box-decoration-slice"
    | "box-decoration-clone"
    | "box-decoration-slice"
interface TailwindBoxDecorationBreak {
    /**
     * `BoxDecorationBreak`
     *
     * Utilities for controlling how element fragments should be rendered across
     * multiple lines, columns, or pages.
     *
     * @see
     * {@link https://tailwindcss.com/docs/box-decoration-break Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/box-decoration-break , MDN docs}
     */
    boxDecorationBreak: BoxDecorationBreakValue
}
type BreakAfterLiteral = `break-after-${BreakAfterRef1}`
type BreakAfterValue = BreakAfterLiteral
interface TailwindBreakAfter {
    /**
     * `BreakAfter`
     *
     * Utilities for controlling how a column or page should break after an
     * element.
     *
     * @see
     * {@link https://tailwindcss.com/docs/break-after Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/break-after , MDN docs}
     */
    breakAfter: BreakAfterValue
}
type WordBreakBreakLiteral = `break-${WordBreakRef1}`
type WordBreakValue = WordBreakBreakLiteral
interface TailwindWordBreak {
    /**
     * `WordBreak`
     *
     * Utilities for controlling word breaks in an element.
     *
     * @see
     * {@link https://tailwindcss.com/docs/word-break Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/word-break , MDN docs}
     */
    wordBreak: WordBreakValue
}
type BreakBeforeLiteral = `break-before-${BreakBeforeRef1}`
type BreakBeforeValue = BreakBeforeLiteral
interface TailwindBreakBefore {
    /**
     * `BreakBefore`
     *
     * Utilities for controlling how a column or page should break before an
     * element.
     *
     * @see
     * {@link https://tailwindcss.com/docs/break-before Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/break-before , MDN docs}
     */
    breakBefore: BreakBeforeValue
}
type BreakInsideLiteral = `break-inside-${BreakInsideRef1}`
type BreakInsideAvoidLiteral = `break-inside-avoid-${BreakInsideRef2}`
type BreakInsideValue = BreakInsideLiteral | BreakInsideAvoidLiteral
interface TailwindBreakInside {
    /**
     * `BreakInside`
     *
     * Utilities for controlling how a column or page should break within an
     * element.
     *
     * @see
     * {@link https://tailwindcss.com/docs/break-inside Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/break-inside , MDN docs}
     */
    breakInside: BreakInsideValue
}
type TextTransformValue =
    | "capitalize"
    | "lowercase"
    | "normal-case"
    | "uppercase"
    | "capitalize"
    | "lowercase"
    | "normal-case"
    | "uppercase"
interface TailwindTextTransform {
    /**
     * `TextTransform`
     *
     * Utilities for controlling the capitalization of text.
     *
     * @see
     * {@link https://tailwindcss.com/docs/text-transform Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform , MDN docs}
     */
    textTransform: TextTransformValue
}
type CaptionSideValue =
    | "caption-bottom"
    | "caption-top"
    | "caption-bottom"
    | "caption-top"
interface TailwindCaptionSide {
    /**
     * `CaptionSide`
     *
     * Utilities for controlling the alignment of a caption element inside of a
     * table.
     *
     * @see
     * {@link https://tailwindcss.com/docs/caption-side Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/caption-side , MDN docs}
     */
    captionSide: CaptionSideValue
}
type CaretColorCaretaccentLiteral = `caret-accent-${CaretColorRef1}`
type CaretColorCaretchartLiteral = `caret-chart-${CaretColorRef2}`
type CaretColorCaretprimaryLiteral = `caret-primary-${CaretColorRef3}`
type CaretColorCaretsidebarLiteral = `caret-sidebar-${CaretColorRef4}`
type CaretColorCaretLiteral = `caret-${CaretColorRef5}`
type CaretColorProperty =
    | CaretColorCaretaccentLiteral
    | CaretColorCaretchartLiteral
    | CaretColorCaretprimaryLiteral
    | CaretColorCaretsidebarLiteral
    | CaretColorCaretLiteral
type CaretColorArbitraryValue =
    | (`caret-${number}` & {})
    | (`caret-[${string}]` & {})
type CaretColorValue =
    | CaretColorProperty
    | (`caret-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`caret-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`caret-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`caret-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`caret-${string}/${VariantsA91e8ba1}` & {})
    | CaretColorArbitraryValue
interface TailwindCaretColor {
    /**
     * `CaretColor`
     *
     * Utilities for controlling the color of the text input cursor.
     *
     * Arbitrary support
     *
     * `caret-<number>`, `caret-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/caret-color Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/caret-color , MDN docs}
     */
    caretColor: CaretColorValue
}
type ClearLiteral = `clear-${ClearRef1}`
type ClearValue = ClearLiteral
interface TailwindClear {
    /**
     * `Clear`
     *
     * Utilities for controlling the wrapping of content around an element.
     *
     * @see
     * {@link https://tailwindcss.com/docs/clear Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/clear , MDN docs}
     */
    clear: ClearValue
}
type VisibilityValue =
    | "collapse"
    | "invisible"
    | "visible"
    | "collapse"
    | "invisible"
    | "visible"
interface TailwindVisibility {
    /**
     * `Visibility`
     *
     * Utilities for controlling the visibility of an element.
     *
     * @see
     * {@link https://tailwindcss.com/docs/visibility Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/visibility , MDN docs}
     */
    visibility: VisibilityValue
}
type ColumnsLiteral = `columns-${ColumnsRef1}`
type ColumnsProperty = ColumnsLiteral
type ColumnsArbitraryValue =
    | (`columns-${number}` & {})
    | (`columns-(${string})` & {})
    | (`columns-[${string}]` & {})
type ColumnsValue = ColumnsProperty | ColumnsArbitraryValue
interface TailwindColumns {
    /**
     * `Columns`
     *
     * Utilities for controlling the number of columns within an element.
     *
     * Arbitrary support
     *
     * `columns-<number>`, `columns-(<var-name>)`, `columns-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/columns Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/columns , MDN docs}
     */
    columns: ColumnsValue
}
type ContainLiteral = `contain-${ContainRef1}`
type ContainValue = ContainLiteral
interface TailwindContain {
    /**
     * `Contain`
     *
     * @see
     * {@link https://tailwindcss.com/docs Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/contain , MDN docs}
     */
    contain: ContainValue
}
type MaxWidthMaxwLiteral = `max-w-${MaxWidthRef1}`
type MaxWidthProperty = "container" | MaxWidthMaxwLiteral
type MaxWidthArbitraryValue =
    | (`max-w-${number}` & {})
    | (`max-w-(${string})` & {})
    | (`max-w-[${string}]` & {})
type MaxWidthValue = MaxWidthProperty | MaxWidthArbitraryValue
interface TailwindMaxWidth {
    /**
     * `MaxWidth`
     *
     * Utilities for setting the maximum width of an element.
     *
     * Arbitrary support
     *
     * `max-w-<number>`, `max-w-(<var-name>)`, `max-w-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/max-width Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/max-width , MDN docs}
     */
    maxWidth: MaxWidthValue
}
type AlignContentContentLiteral = `content-${AlignContentRef1}`
type AlignContentValue = AlignContentContentLiteral
interface TailwindAlignContent {
    /**
     * `AlignContent`
     *
     * Utilities for controlling how rows are positioned in multi-row flex and
     * grid containers.
     *
     * @see
     * {@link https://tailwindcss.com/docs/align-content Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/align-content , MDN docs}
     */
    alignContent: AlignContentValue
}
type ContentLiteral = `content-${ContentRef1}`
type ContentProperty = ContentLiteral
type ContentArbitraryValue =
    | (`content-[${string}]` & {})
    | (`content-(${string})` & {})
type ContentValue = ContentProperty | ContentArbitraryValue
interface TailwindContent {
    /**
     * `Content`
     *
     * Utilities for controlling the content of the before and after
     * pseudo-elements.
     *
     * Arbitrary support
     *
     * `content-[<arbitrary-value>]`, `content-(<var-name>)`
     *
     * @see
     * {@link https://tailwindcss.com/docs/content Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/content , MDN docs}
     */
    content: ContentValue
}
type CursorELiteral = `cursor-e-${CursorRef1}`
type CursorNLiteral = `cursor-n-${CursorRef2}`
type CursorNeLiteral = `cursor-ne-${CursorRef3}`
type CursorNoLiteral = `cursor-no-${CursorRef4}`
type CursorSLiteral = `cursor-s-${CursorRef5}`
type CursorWLiteral = `cursor-w-${CursorRef6}`
type CursorLiteral = `cursor-${CursorRef7}`
type CursorProperty =
    | CursorELiteral
    | CursorNLiteral
    | CursorNeLiteral
    | CursorNoLiteral
    | CursorSLiteral
    | CursorWLiteral
    | CursorLiteral
type CursorArbitraryValue =
    | (`cursor-(${string})` & {})
    | (`cursor-[${string}]` & {})
type CursorValue = CursorProperty | CursorArbitraryValue
interface TailwindCursor {
    /**
     * `Cursor`
     *
     * Utilities for controlling the cursor style when hovering over an element.
     *
     * Arbitrary support
     *
     * `cursor-(<var-name>)`, `cursor-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/cursor Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/cursor , MDN docs}
     */
    cursor: CursorValue
}
type TextDecorationThicknessDecorationaccentLiteral =
    `decoration-accent-${TextDecorationThicknessRef1}`
type TextDecorationThicknessDecorationchartLiteral =
    `decoration-chart-${TextDecorationThicknessRef2}`
type TextDecorationThicknessDecorationprimaryLiteral =
    `decoration-primary-${TextDecorationThicknessRef3}`
type TextDecorationThicknessDecorationsidebarLiteral =
    `decoration-sidebar-${TextDecorationThicknessRef4}`
type TextDecorationThicknessDecorationLiteral =
    `decoration-${TextDecorationThicknessRef5}`
type TextDecorationThicknessProperty =
    | TextDecorationThicknessDecorationaccentLiteral
    | TextDecorationThicknessDecorationchartLiteral
    | TextDecorationThicknessDecorationprimaryLiteral
    | TextDecorationThicknessDecorationsidebarLiteral
    | TextDecorationThicknessDecorationLiteral
type TextDecorationThicknessArbitraryValue =
    | (`decoration-${number}` & {})
    | (`decoration-(${string})` & {})
    | (`decoration-[${string}]` & {})
type TextDecorationThicknessValue =
    | TextDecorationThicknessProperty
    | (`decoration-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`decoration-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`decoration-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`decoration-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`decoration-${string}/${VariantsA91e8ba1}` & {})
    | TextDecorationThicknessArbitraryValue
interface TailwindTextDecorationThickness {
    /**
     * `TextDecorationThickness`
     *
     * Utilities for controlling the thickness of text decorations.
     *
     * Arbitrary support
     *
     * `decoration-<number>`, `decoration-(<var-name>)`,
     * `decoration-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/text-decoration-thickness Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-thickness , MDN docs}
     */
    textDecorationThickness: TextDecorationThicknessValue
}
type TextDecorationColorDecorationLiteral =
    `decoration-${TextDecorationColorRef1}`
type TextDecorationColorProperty = TextDecorationColorDecorationLiteral
type TextDecorationColorArbitraryValue =
    | (`decoration-(${string})` & {})
    | (`decoration-[${string}]` & {})
type TextDecorationColorValue =
    | TextDecorationColorProperty
    | (`decoration-${string}/${VariantsA91e8ba1}` & {})
    | TextDecorationColorArbitraryValue
interface TailwindTextDecorationColor {
    /**
     * `TextDecorationColor`
     *
     * Utilities for controlling the color of text decorations.
     *
     * Arbitrary support
     *
     * `decoration-(<var-name>)`, `decoration-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/text-decoration-color Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-color , MDN docs}
     */
    textDecorationColor: TextDecorationColorValue
}
type TextDecorationStyleDecorationLiteral =
    `decoration-${TextDecorationStyleRef1}`
type TextDecorationStyleValue = TextDecorationStyleDecorationLiteral
interface TailwindTextDecorationStyle {
    /**
     * `TextDecorationStyle`
     *
     * Utilities for controlling the style of text decorations.
     *
     * @see
     * {@link https://tailwindcss.com/docs/text-decoration-style Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-style , MDN docs}
     */
    textDecorationStyle: TextDecorationStyleValue
}
type TransitionDelayDelayLiteral = `delay-${TransitionDelayRef1}`
type TransitionDelayProperty = TransitionDelayDelayLiteral
type TransitionDelayArbitraryValue =
    | (`delay-${number}` & {})
    | (`delay-(${string})` & {})
    | (`delay-[${string}]` & {})
type TransitionDelayValue =
    | TransitionDelayProperty
    | TransitionDelayArbitraryValue
interface TailwindTransitionDelay {
    /**
     * `TransitionDelay`
     *
     * Utilities for controlling the delay of CSS transitions.
     *
     * Arbitrary support
     *
     * `delay-<number>`, `delay-(<var-name>)`, `delay-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/transition-delay Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/transition-delay , MDN docs}
     */
    transitionDelay: TransitionDelayValue
}
type FontVariantNumericValue =
    | "diagonal-fractions"
    | "lining-nums"
    | "normal-nums"
    | "oldstyle-nums"
    | "ordinal"
    | "proportional-nums"
    | "slashed-zero"
    | "stacked-fractions"
    | "tabular-nums"
    | "diagonal-fractions"
    | "lining-nums"
    | "normal-nums"
    | "oldstyle-nums"
    | "ordinal"
    | "proportional-nums"
    | "slashed-zero"
    | "stacked-fractions"
    | "tabular-nums"
interface TailwindFontVariantNumeric {
    /**
     * `FontVariantNumeric`
     *
     * Utilities for controlling the variant of numbers.
     *
     * @see
     * {@link https://tailwindcss.com/docs/font-variant-numeric Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric , MDN docs}
     */
    fontVariantNumeric: FontVariantNumericValue
}
type AnimationDirectionDirectionLiteral = `direction-${AnimationDirectionRef1}`
type AnimationDirectionValue = AnimationDirectionDirectionLiteral
interface TailwindAnimationDirection {
    /**
     * `AnimationDirection`
     *
     * @see
     * {@link https://tailwindcss.com/docs Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/animation-direction , MDN docs}
     */
    animationDirection: AnimationDirectionValue
}
type TransitionDurationDurationLiteral = `duration-${TransitionDurationRef1}`
type TransitionDurationProperty = TransitionDurationDurationLiteral
type TransitionDurationArbitraryValue =
    | (`duration-${number}` & {})
    | (`duration-(${string})` & {})
    | (`duration-[${string}]` & {})
type TransitionDurationValue =
    | TransitionDurationProperty
    | TransitionDurationArbitraryValue
interface TailwindTransitionDuration {
    /**
     * `TransitionDuration`
     *
     * Utilities for controlling the duration of CSS transitions.
     *
     * Arbitrary support
     *
     * `duration-<number>`, `duration-(<var-name>)`,
     * `duration-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/transition-duration Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/transition-duration , MDN docs}
     */
    transitionDuration: TransitionDurationValue
}
type TransitionTimingFunctionEaseinLiteral =
    `ease-in-${TransitionTimingFunctionRef1}`
type TransitionTimingFunctionEaseLiteral =
    `ease-${TransitionTimingFunctionRef2}`
type TransitionTimingFunctionProperty =
    | TransitionTimingFunctionEaseinLiteral
    | TransitionTimingFunctionEaseLiteral
type TransitionTimingFunctionArbitraryValue =
    | (`ease-(${string})` & {})
    | (`ease-[${string}]` & {})
type TransitionTimingFunctionValue =
    | TransitionTimingFunctionProperty
    | TransitionTimingFunctionArbitraryValue
interface TailwindTransitionTimingFunction {
    /**
     * `TransitionTimingFunction`
     *
     * Utilities for controlling the easing of CSS transitions.
     *
     * Arbitrary support
     *
     * `ease-(<var-name>)`, `ease-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/transition-timing-function Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function , MDN docs}
     */
    transitionTimingFunction: TransitionTimingFunctionValue
}
type FieldSizingValue =
    | "field-sizing-content"
    | "field-sizing-fixed"
    | "field-sizing-content"
    | "field-sizing-fixed"
interface TailwindFieldSizing {
    /**
     * `FieldSizing`
     *
     * Utilities for controlling the sizing of form controls.
     *
     * @see
     * {@link https://tailwindcss.com/docs/field-sizing Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing , MDN docs}
     */
    fieldSizing: FieldSizingValue
}
type FillAccentLiteral = `fill-accent-${FillRef1}`
type FillChartLiteral = `fill-chart-${FillRef2}`
type FillModeLiteral = `fill-mode-${FillRef3}`
type FillPrimaryLiteral = `fill-primary-${FillRef4}`
type FillSidebarLiteral = `fill-sidebar-${FillRef5}`
type FillLiteral = `fill-${FillRef6}`
type FillProperty =
    | FillAccentLiteral
    | FillChartLiteral
    | FillModeLiteral
    | FillPrimaryLiteral
    | FillSidebarLiteral
    | FillLiteral
type FillArbitraryValue = (`fill-(${string})` & {}) | (`fill-[${string}]` & {})
type FillValue =
    | FillProperty
    | (`fill-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`fill-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`fill-mode-${string}/${VariantsA91e8ba1}` & {})
    | (`fill-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`fill-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`fill-${string}/${VariantsA91e8ba1}` & {})
    | FillArbitraryValue
interface TailwindFill {
    /**
     * `Fill`
     *
     * Utilities for styling the fill of SVG elements.
     *
     * Arbitrary support
     *
     * `fill-(<var-name>)`, `fill-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/fill Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/fill , MDN docs}
     */
    fill: FillValue
}
type FlexLiteral = `flex-${FlexRef1}`
type FlexProperty = FlexLiteral
type FlexArbitraryValue =
    | (`flex-${number}` & {})
    | (`flex-(${string})` & {})
    | (`flex-[${string}]` & {})
type FlexValue = FlexProperty | FlexArbitraryValue
interface TailwindFlex {
    /**
     * `Flex`
     *
     * Utilities for controlling how flex items both grow and shrink.
     *
     * Arbitrary support
     *
     * `flex-<number>`, `flex-(<var-name>)`, `flex-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/flex Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/flex , MDN docs}
     */
    flex: FlexValue
}
type FlexDirectionFlexLiteral = `flex-${FlexDirectionRef1}`
type FlexDirectionValue = FlexDirectionFlexLiteral
interface TailwindFlexDirection {
    /**
     * `FlexDirection`
     *
     * Utilities for controlling the direction of flex items.
     *
     * @see
     * {@link https://tailwindcss.com/docs/flex-direction Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction , MDN docs}
     */
    flexDirection: FlexDirectionValue
}
type FlexWrapLiteral = `flex-wrap-${FlexWrapRef1}`
type FlexWrapFlexLiteral = `flex-${FlexWrapRef2}`
type FlexWrapValue = FlexWrapLiteral | FlexWrapFlexLiteral
interface TailwindFlexWrap {
    /**
     * `FlexWrap`
     *
     * Utilities for controlling how flex items wrap.
     *
     * @see
     * {@link https://tailwindcss.com/docs/flex-wrap Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap , MDN docs}
     */
    flexWrap: FlexWrapValue
}
type FloatLiteral = `float-${FloatRef1}`
type FloatValue = FloatLiteral
interface TailwindFloat {
    /**
     * `Float`
     *
     * Utilities for controlling the wrapping of content around an element.
     *
     * @see
     * {@link https://tailwindcss.com/docs/float Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/float , MDN docs}
     */
    float: FloatValue
}
type FontWeightFontLiteral = `font-${FontWeightRef1}`
type FontWeightProperty = FontWeightFontLiteral
type FontWeightArbitraryValue =
    | (`font-(${string})` & {})
    | (`font-[${string}]` & {})
type FontWeightValue = FontWeightProperty | FontWeightArbitraryValue
interface TailwindFontWeight {
    /**
     * `FontWeight`
     *
     * Utilities for controlling the font weight of an element.
     *
     * Arbitrary support
     *
     * `font-(<var-name>)`, `font-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/font-weight Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight , MDN docs}
     */
    fontWeight: FontWeightValue
}
type FontFamilyFontLiteral = `font-${FontFamilyRef1}`
type FontFamilyProperty = FontFamilyFontLiteral
type FontFamilyArbitraryValue =
    | (`font-(${string})` & {})
    | (`font-[${string}]` & {})
type FontFamilyValue = FontFamilyProperty | FontFamilyArbitraryValue
interface TailwindFontFamily {
    /**
     * `FontFamily`
     *
     * Utilities for controlling the font family of an element.
     *
     * Arbitrary support
     *
     * `font-(<var-name>)`, `font-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/font-family Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-family , MDN docs}
     */
    fontFamily: FontFamilyValue
}
type FontStretchLiteral = `font-stretch-${FontStretchRef1}`
type FontStretchProperty = FontStretchLiteral
type FontStretchArbitraryValue =
    | (`font-stretch-${number}` & {})
    | (`font-stretch-(${string})` & {})
    | (`font-stretch-[${string}]` & {})
type FontStretchValue = FontStretchProperty | FontStretchArbitraryValue
interface TailwindFontStretch {
    /**
     * `FontStretch`
     *
     * Utilities for selecting the width of a font face.
     *
     * Arbitrary support
     *
     * `font-stretch-<number>`, `font-stretch-(<var-name>)`,
     * `font-stretch-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/font-stretch Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch , MDN docs}
     */
    fontStretch: FontStretchValue
}
type ForcedColorAdjustValue =
    | "forced-color-adjust-auto"
    | "forced-color-adjust-none"
    | "forced-color-adjust-auto"
    | "forced-color-adjust-none"
interface TailwindForcedColorAdjust {
    /**
     * `ForcedColorAdjust`
     *
     * Utilities for opting in and out of forced colors.
     *
     * @see
     * {@link https://tailwindcss.com/docs/forced-color-adjust Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/forced-color-adjust , MDN docs}
     */
    forcedColorAdjust: ForcedColorAdjustValue
}
type GapXLiteral = `gap-x-${GapRef1}`
type GapYLiteral = `gap-y-${GapRef1}`
type GapLiteral = `gap-${GapRef1}`
type GapProperty = GapXLiteral | GapYLiteral | GapLiteral
type GapArbitraryValue =
    | (`gap-x-${number}` & {})
    | (`gap-x-(${string})` & {})
    | (`gap-x-[${string}]` & {})
    | (`gap-y-${number}` & {})
    | (`gap-y-(${string})` & {})
    | (`gap-y-[${string}]` & {})
    | (`gap-${number}` & {})
    | (`gap-(${string})` & {})
    | (`gap-[${string}]` & {})
type GapValue = GapProperty | GapArbitraryValue
interface TailwindGap {
    /**
     * `Gap`
     *
     * Utilities for controlling gutters between grid and flexbox items.
     *
     * Arbitrary support
     *
     * `gap-x-<number>`, `gap-x-(<var-name>)`, `gap-x-[<arbitrary-value>]`,
     * `gap-y-<number>`, `gap-y-(<var-name>)` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/gap Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/gap , MDN docs}
     */
    gap: GapValue
}
type GridTemplateColumnsGridcolsLiteral = `grid-cols-${GridTemplateColumnsRef1}`
type GridTemplateColumnsProperty = GridTemplateColumnsGridcolsLiteral
type GridTemplateColumnsArbitraryValue =
    | (`grid-cols-${number}` & {})
    | (`grid-cols-[${string}]` & {})
    | (`grid-cols-(${string})` & {})
type GridTemplateColumnsValue =
    | GridTemplateColumnsProperty
    | GridTemplateColumnsArbitraryValue
interface TailwindGridTemplateColumns {
    /**
     * `GridTemplateColumns`
     *
     * Utilities for specifying the columns in a grid layout.
     *
     * Arbitrary support
     *
     * `grid-cols-<number>`, `grid-cols-[<arbitrary-value>]`,
     * `grid-cols-(<var-name>)`
     *
     * @see
     * {@link https://tailwindcss.com/docs/grid-template-columns Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns , MDN docs}
     */
    gridTemplateColumns: GridTemplateColumnsValue
}
type GridAutoFlowGridflowLiteral = `grid-flow-${GridAutoFlowRef1}`
type GridAutoFlowValue = GridAutoFlowGridflowLiteral
interface TailwindGridAutoFlow {
    /**
     * `GridAutoFlow`
     *
     * Utilities for controlling how elements in a grid are auto-placed.
     *
     * @see
     * {@link https://tailwindcss.com/docs/grid-auto-flow Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-flow , MDN docs}
     */
    gridAutoFlow: GridAutoFlowValue
}
type GridTemplateRowsGridrowsLiteral = `grid-rows-${GridTemplateRowsRef1}`
type GridTemplateRowsProperty = GridTemplateRowsGridrowsLiteral
type GridTemplateRowsArbitraryValue =
    | (`grid-rows-${number}` & {})
    | (`grid-rows-[${string}]` & {})
    | (`grid-rows-(${string})` & {})
type GridTemplateRowsValue =
    | GridTemplateRowsProperty
    | GridTemplateRowsArbitraryValue
interface TailwindGridTemplateRows {
    /**
     * `GridTemplateRows`
     *
     * Utilities for specifying the rows in a grid layout.
     *
     * Arbitrary support
     *
     * `grid-rows-<number>`, `grid-rows-[<arbitrary-value>]`,
     * `grid-rows-(<var-name>)`
     *
     * @see
     * {@link https://tailwindcss.com/docs/grid-template-rows Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-rows , MDN docs}
     */
    gridTemplateRows: GridTemplateRowsValue
}
type FlexGrowProperty = "grow" | "grow-0" | "grow" | "grow-0"
type FlexGrowArbitraryValue =
    | (`grow-${number}` & {})
    | (`grow-[${string}]` & {})
    | (`grow-(${string})` & {})
type FlexGrowValue = FlexGrowProperty | FlexGrowArbitraryValue
interface TailwindFlexGrow {
    /**
     * `FlexGrow`
     *
     * Utilities for controlling how flex items grow.
     *
     * Arbitrary support
     *
     * `grow-<number>`, `grow-[<arbitrary-value>]`, `grow-(<var-name>)`
     *
     * @see
     * {@link https://tailwindcss.com/docs/flex-grow Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow , MDN docs}
     */
    flexGrow: FlexGrowValue
}
type HeightHLiteral = `h-${HeightRef1}` | "h-lh" | "h-screen"
type HeightSizeLiteral = `size-${HeightRef1}`
type HeightProperty = HeightHLiteral | HeightSizeLiteral
type HeightArbitraryValue =
    | (`h-${number}` & {})
    | (`h-(${string})` & {})
    | (`h-[${string}]` & {})
    | (`size-${number}` & {})
    | (`size-(${string})` & {})
    | (`size-[${string}]` & {})
type HeightValue = HeightProperty | HeightArbitraryValue
interface TailwindHeight {
    /**
     * `Height`
     *
     * Utilities for setting the height of an element.
     *
     * Arbitrary support
     *
     * `h-<number>`, `h-(<var-name>)`, `h-[<arbitrary-value>]`, `size-<number>`,
     * `size-(<var-name>)` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/height Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/height , MDN docs}
     */
    height: HeightValue
}
type HyphensLiteral = `hyphens-${HyphensRef1}`
type HyphensValue = HyphensLiteral
interface TailwindHyphens {
    /**
     * `Hyphens`
     *
     * Utilities for controlling how words should be hyphenated.
     *
     * @see
     * {@link https://tailwindcss.com/docs/hyphens Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens , MDN docs}
     */
    hyphens: HyphensValue
}
type InlineSizeInlineLiteral = `inline-${InlineSizeRef1}`
type InlineSizeProperty = InlineSizeInlineLiteral
type InlineSizeArbitraryValue =
    | (`inline-${number}` & {})
    | (`inline-(${string})` & {})
    | (`inline-[${string}]` & {})
type InlineSizeValue = InlineSizeProperty | InlineSizeArbitraryValue
interface TailwindInlineSize {
    /**
     * `InlineSize`
     *
     * Utilities for setting the inline size of an element.
     *
     * Arbitrary support
     *
     * `inline-<number>`, `inline-(<var-name>)`, `inline-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/inline-size Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/inline-size , MDN docs}
     */
    inlineSize: InlineSizeValue
}
type BoxShadowInsetLiteral = `inset-${BoxShadowRef1}`
type BoxShadowRingaccentLiteral = `ring-accent-${BoxShadowRef2}`
type BoxShadowRingcardLiteral = `ring-card-${BoxShadowRef3}`
type BoxShadowRingchartLiteral = `ring-chart-${BoxShadowRef4}`
type BoxShadowRingmutedLiteral = `ring-muted-${BoxShadowRef5}`
type BoxShadowRingoffsetLiteral =
    | `ring-offset-${BoxShadowRef6}`
    | "ring-offset-0"
    | "ring-offset-1"
    | "ring-offset-2"
    | "ring-offset-4"
    | "ring-offset-8"
    | "ring-offset-amber-50"
    | "ring-offset-amber-100"
    | "ring-offset-amber-200"
    | "ring-offset-amber-300"
    | "ring-offset-amber-400"
    | "ring-offset-amber-500"
    | "ring-offset-amber-600"
    | "ring-offset-amber-700"
    | "ring-offset-amber-800"
    | "ring-offset-amber-900"
    | "ring-offset-amber-950"
    | "ring-offset-background"
    | "ring-offset-black"
    | "ring-offset-blue-50"
    | "ring-offset-blue-100"
    | "ring-offset-blue-200"
    | "ring-offset-blue-300"
    | "ring-offset-blue-400"
    | "ring-offset-blue-500"
    | "ring-offset-blue-600"
    | "ring-offset-blue-700"
    | "ring-offset-blue-800"
    | "ring-offset-blue-900"
    | "ring-offset-blue-950"
    | "ring-offset-card"
    | "ring-offset-card-foreground"
    | "ring-offset-chart-1"
    | "ring-offset-chart-2"
    | "ring-offset-chart-3"
    | "ring-offset-chart-4"
    | "ring-offset-chart-5"
    | "ring-offset-current"
    | "ring-offset-cyan-50"
    | "ring-offset-cyan-100"
    | "ring-offset-cyan-200"
    | "ring-offset-cyan-300"
    | "ring-offset-cyan-400"
    | "ring-offset-cyan-500"
    | "ring-offset-cyan-600"
    | "ring-offset-cyan-700"
    | "ring-offset-cyan-800"
    | "ring-offset-cyan-900"
    | "ring-offset-cyan-950"
    | "ring-offset-destructive"
    | "ring-offset-emerald-50"
    | "ring-offset-emerald-100"
    | "ring-offset-emerald-200"
    | "ring-offset-emerald-300"
    | "ring-offset-emerald-400"
    | "ring-offset-emerald-500"
    | "ring-offset-emerald-600"
    | "ring-offset-emerald-700"
    | "ring-offset-emerald-800"
    | "ring-offset-emerald-900"
    | "ring-offset-emerald-950"
    | "ring-offset-fuchsia-50"
    | "ring-offset-fuchsia-100"
    | "ring-offset-fuchsia-200"
    | "ring-offset-fuchsia-300"
    | "ring-offset-fuchsia-400"
    | "ring-offset-fuchsia-500"
    | "ring-offset-fuchsia-600"
    | "ring-offset-fuchsia-700"
    | "ring-offset-fuchsia-800"
    | "ring-offset-fuchsia-900"
    | "ring-offset-fuchsia-950"
    | "ring-offset-gray-50"
    | "ring-offset-gray-100"
    | "ring-offset-gray-200"
    | "ring-offset-gray-300"
    | "ring-offset-gray-400"
    | "ring-offset-gray-500"
    | "ring-offset-gray-600"
    | "ring-offset-gray-700"
    | "ring-offset-gray-800"
    | "ring-offset-gray-900"
    | "ring-offset-gray-950"
    | "ring-offset-green-50"
    | "ring-offset-green-100"
    | "ring-offset-green-200"
    | "ring-offset-green-300"
    | "ring-offset-green-400"
    | "ring-offset-green-500"
    | "ring-offset-green-600"
    | "ring-offset-green-700"
    | "ring-offset-green-800"
    | "ring-offset-green-900"
    | "ring-offset-green-950"
    | "ring-offset-indigo-50"
    | "ring-offset-indigo-100"
    | "ring-offset-indigo-200"
    | "ring-offset-indigo-300"
    | "ring-offset-indigo-400"
    | "ring-offset-indigo-500"
    | "ring-offset-indigo-600"
    | "ring-offset-indigo-700"
    | "ring-offset-indigo-800"
    | "ring-offset-indigo-900"
    | "ring-offset-indigo-950"
    | "ring-offset-inherit"
    | "ring-offset-input"
    | "ring-offset-lime-50"
    | "ring-offset-lime-100"
    | "ring-offset-lime-200"
    | "ring-offset-lime-300"
    | "ring-offset-lime-400"
    | "ring-offset-lime-500"
    | "ring-offset-lime-600"
    | "ring-offset-lime-700"
    | "ring-offset-lime-800"
    | "ring-offset-lime-900"
    | "ring-offset-lime-950"
    | "ring-offset-mauve-50"
    | "ring-offset-mauve-100"
    | "ring-offset-mauve-200"
    | "ring-offset-mauve-300"
    | "ring-offset-mauve-400"
    | "ring-offset-mauve-500"
    | "ring-offset-mauve-600"
    | "ring-offset-mauve-700"
    | "ring-offset-mauve-800"
    | "ring-offset-mauve-900"
    | "ring-offset-mauve-950"
    | "ring-offset-mist-50"
    | "ring-offset-mist-100"
    | "ring-offset-mist-200"
    | "ring-offset-mist-300"
    | "ring-offset-mist-400"
    | "ring-offset-mist-500"
    | "ring-offset-mist-600"
    | "ring-offset-mist-700"
    | "ring-offset-mist-800"
    | "ring-offset-mist-900"
    | "ring-offset-mist-950"
    | "ring-offset-muted"
    | "ring-offset-muted-foreground"
    | "ring-offset-neutral-50"
    | "ring-offset-neutral-100"
    | "ring-offset-neutral-200"
    | "ring-offset-neutral-300"
    | "ring-offset-neutral-400"
    | "ring-offset-neutral-500"
    | "ring-offset-neutral-600"
    | "ring-offset-neutral-700"
    | "ring-offset-neutral-800"
    | "ring-offset-neutral-900"
    | "ring-offset-neutral-950"
    | "ring-offset-olive-50"
    | "ring-offset-olive-100"
    | "ring-offset-olive-200"
    | "ring-offset-olive-300"
    | "ring-offset-olive-400"
    | "ring-offset-olive-500"
    | "ring-offset-olive-600"
    | "ring-offset-olive-700"
    | "ring-offset-olive-800"
    | "ring-offset-olive-900"
    | "ring-offset-olive-950"
    | "ring-offset-orange-50"
    | "ring-offset-orange-100"
    | "ring-offset-orange-200"
    | "ring-offset-orange-300"
    | "ring-offset-orange-400"
    | "ring-offset-orange-500"
    | "ring-offset-orange-600"
    | "ring-offset-orange-700"
    | "ring-offset-orange-800"
    | "ring-offset-orange-900"
    | "ring-offset-orange-950"
    | "ring-offset-pink-50"
    | "ring-offset-pink-100"
    | "ring-offset-pink-200"
    | "ring-offset-pink-300"
    | "ring-offset-pink-400"
    | "ring-offset-pink-500"
    | "ring-offset-pink-600"
    | "ring-offset-pink-700"
    | "ring-offset-pink-800"
    | "ring-offset-pink-900"
    | "ring-offset-pink-950"
    | "ring-offset-popover"
    | "ring-offset-popover-foreground"
    | "ring-offset-purple-50"
    | "ring-offset-purple-100"
    | "ring-offset-purple-200"
    | "ring-offset-purple-300"
    | "ring-offset-purple-400"
    | "ring-offset-purple-500"
    | "ring-offset-purple-600"
    | "ring-offset-purple-700"
    | "ring-offset-purple-800"
    | "ring-offset-purple-900"
    | "ring-offset-purple-950"
    | "ring-offset-red-50"
    | "ring-offset-red-100"
    | "ring-offset-red-200"
    | "ring-offset-red-300"
    | "ring-offset-red-400"
    | "ring-offset-red-500"
    | "ring-offset-red-600"
    | "ring-offset-red-700"
    | "ring-offset-red-800"
    | "ring-offset-red-900"
    | "ring-offset-red-950"
    | "ring-offset-rose-50"
    | "ring-offset-rose-100"
    | "ring-offset-rose-200"
    | "ring-offset-rose-300"
    | "ring-offset-rose-400"
    | "ring-offset-rose-500"
    | "ring-offset-rose-600"
    | "ring-offset-rose-700"
    | "ring-offset-rose-800"
    | "ring-offset-rose-900"
    | "ring-offset-rose-950"
    | "ring-offset-secondary"
    | "ring-offset-secondary-foreground"
    | "ring-offset-sidebar"
    | "ring-offset-sidebar-accent"
    | "ring-offset-sidebar-accent-foreground"
    | "ring-offset-sidebar-border"
    | "ring-offset-sidebar-foreground"
    | "ring-offset-sidebar-primary"
    | "ring-offset-sidebar-primary-foreground"
    | "ring-offset-sidebar-ring"
    | "ring-offset-sky-50"
    | "ring-offset-sky-100"
    | "ring-offset-sky-200"
    | "ring-offset-sky-300"
    | "ring-offset-sky-400"
    | "ring-offset-sky-500"
    | "ring-offset-sky-600"
    | "ring-offset-sky-700"
    | "ring-offset-sky-800"
    | "ring-offset-sky-900"
    | "ring-offset-sky-950"
    | "ring-offset-slate-50"
    | "ring-offset-slate-100"
    | "ring-offset-slate-200"
    | "ring-offset-slate-300"
    | "ring-offset-slate-400"
    | "ring-offset-slate-500"
    | "ring-offset-slate-600"
    | "ring-offset-slate-700"
    | "ring-offset-slate-800"
    | "ring-offset-slate-900"
    | "ring-offset-slate-950"
    | "ring-offset-stone-50"
    | "ring-offset-stone-100"
    | "ring-offset-stone-200"
    | "ring-offset-stone-300"
    | "ring-offset-stone-400"
    | "ring-offset-stone-500"
    | "ring-offset-stone-600"
    | "ring-offset-stone-700"
    | "ring-offset-stone-800"
    | "ring-offset-stone-900"
    | "ring-offset-stone-950"
    | "ring-offset-taupe-50"
    | "ring-offset-taupe-100"
    | "ring-offset-taupe-200"
    | "ring-offset-taupe-300"
    | "ring-offset-taupe-400"
    | "ring-offset-taupe-500"
    | "ring-offset-taupe-600"
    | "ring-offset-taupe-700"
    | "ring-offset-taupe-800"
    | "ring-offset-taupe-900"
    | "ring-offset-taupe-950"
    | "ring-offset-teal-50"
    | "ring-offset-teal-100"
    | "ring-offset-teal-200"
    | "ring-offset-teal-300"
    | "ring-offset-teal-400"
    | "ring-offset-teal-500"
    | "ring-offset-teal-600"
    | "ring-offset-teal-700"
    | "ring-offset-teal-800"
    | "ring-offset-teal-900"
    | "ring-offset-teal-950"
    | "ring-offset-transparent"
    | "ring-offset-violet-50"
    | "ring-offset-violet-100"
    | "ring-offset-violet-200"
    | "ring-offset-violet-300"
    | "ring-offset-violet-400"
    | "ring-offset-violet-500"
    | "ring-offset-violet-600"
    | "ring-offset-violet-700"
    | "ring-offset-violet-800"
    | "ring-offset-violet-900"
    | "ring-offset-violet-950"
    | "ring-offset-white"
    | "ring-offset-yellow-50"
    | "ring-offset-yellow-100"
    | "ring-offset-yellow-200"
    | "ring-offset-yellow-300"
    | "ring-offset-yellow-400"
    | "ring-offset-yellow-500"
    | "ring-offset-yellow-600"
    | "ring-offset-yellow-700"
    | "ring-offset-yellow-800"
    | "ring-offset-yellow-900"
    | "ring-offset-yellow-950"
    | "ring-offset-zinc-50"
    | "ring-offset-zinc-100"
    | "ring-offset-zinc-200"
    | "ring-offset-zinc-300"
    | "ring-offset-zinc-400"
    | "ring-offset-zinc-500"
    | "ring-offset-zinc-600"
    | "ring-offset-zinc-700"
    | "ring-offset-zinc-800"
    | "ring-offset-zinc-900"
    | "ring-offset-zinc-950"
type BoxShadowRingpopoverLiteral = `ring-popover-${BoxShadowRef7}`
type BoxShadowRingprimaryLiteral = `ring-primary-${BoxShadowRef8}`
type BoxShadowRingsecondaryLiteral = `ring-secondary-${BoxShadowRef9}`
type BoxShadowRingsidebarLiteral = `ring-sidebar-${BoxShadowRef6}`
type BoxShadowShadowaccentLiteral = `shadow-accent-${BoxShadowRef10}`
type BoxShadowShadowcardLiteral = `shadow-card-${BoxShadowRef11}`
type BoxShadowShadowchartLiteral = `shadow-chart-${BoxShadowRef12}`
type BoxShadowShadowmutedLiteral = `shadow-muted-${BoxShadowRef13}`
type BoxShadowShadowpopoverLiteral = `shadow-popover-${BoxShadowRef14}`
type BoxShadowShadowprimaryLiteral = `shadow-primary-${BoxShadowRef15}`
type BoxShadowShadowsecondaryLiteral = `shadow-secondary-${BoxShadowRef16}`
type BoxShadowShadowsidebarLiteral = `shadow-sidebar-${BoxShadowRef6}`
type BoxShadowRingLiteral = `ring-${BoxShadowRef17}`
type BoxShadowShadowLiteral = `shadow-${BoxShadowRef18}`
type BoxShadowProperty =
    | "ring"
    | "shadow"
    | BoxShadowInsetLiteral
    | BoxShadowRingaccentLiteral
    | BoxShadowRingcardLiteral
    | BoxShadowRingchartLiteral
    | BoxShadowRingmutedLiteral
    | BoxShadowRingoffsetLiteral
    | BoxShadowRingpopoverLiteral
    | BoxShadowRingprimaryLiteral
    | BoxShadowRingsecondaryLiteral
    | BoxShadowRingsidebarLiteral
    | BoxShadowShadowaccentLiteral
    | BoxShadowShadowcardLiteral
    | BoxShadowShadowchartLiteral
    | BoxShadowShadowmutedLiteral
    | BoxShadowShadowpopoverLiteral
    | BoxShadowShadowprimaryLiteral
    | BoxShadowShadowsecondaryLiteral
    | BoxShadowShadowsidebarLiteral
    | BoxShadowRingLiteral
    | BoxShadowShadowLiteral
type BoxShadowArbitraryValue =
    | (`ring-${number}` & {})
    | (`ring-(${string})` & {})
    | (`ring-[${string}]` & {})
    | (`shadow-(${string})` & {})
    | (`shadow-[${string}]` & {})
    | (`inset-(${string})` & {})
    | (`inset-[${string}]` & {})
    | (`inset-${number}` & {})
type BoxShadowValue =
    | BoxShadowProperty
    | (`inset-${string}/${VariantsA91e8ba1}` & {})
    | (`ring-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`ring-card-${string}/${VariantsA91e8ba1}` & {})
    | (`ring-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`ring-muted-${string}/${VariantsA91e8ba1}` & {})
    | (`ring-offset-${string}/${VariantsA91e8ba1}` & {})
    | (`ring-popover-${string}/${VariantsA91e8ba1}` & {})
    | (`ring-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`ring-secondary-${string}/${VariantsA91e8ba1}` & {})
    | (`ring-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`shadow-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`shadow-card-${string}/${VariantsA91e8ba1}` & {})
    | (`shadow-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`shadow-muted-${string}/${VariantsA91e8ba1}` & {})
    | (`shadow-popover-${string}/${VariantsA91e8ba1}` & {})
    | (`shadow-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`shadow-secondary-${string}/${VariantsA91e8ba1}` & {})
    | (`shadow-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`ring-${string}/${VariantsA91e8ba1}` & {})
    | (`shadow-${string}/${VariantsA91e8ba1}` & {})
    | BoxShadowArbitraryValue
interface TailwindBoxShadow {
    /**
     * `BoxShadow`
     *
     * Utilities for controlling the box shadow of an element.
     *
     * Arbitrary support
     *
     * `ring-<number>`, `ring-(<var-name>)`, `ring-[<arbitrary-value>]`,
     * `shadow-(<var-name>)`, `shadow-[<arbitrary-value>]` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/box-shadow Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow , MDN docs}
     */
    boxShadow: BoxShadowValue
}
type IsolationValue =
    | "isolate"
    | "isolation-auto"
    | "isolate"
    | "isolation-auto"
interface TailwindIsolation {
    /**
     * `Isolation`
     *
     * Utilities for controlling whether an element should explicitly create a new
     * stacking context.
     *
     * @see
     * {@link https://tailwindcss.com/docs/isolation Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/isolation , MDN docs}
     */
    isolation: IsolationValue
}
type FontStyleValue = "italic" | "not-italic" | "italic" | "not-italic"
interface TailwindFontStyle {
    /**
     * `FontStyle`
     *
     * Utilities for controlling the style of text.
     *
     * @see
     * {@link https://tailwindcss.com/docs/font-style Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-style , MDN docs}
     */
    fontStyle: FontStyleValue
}
type AlignItemsItemsLiteral = `items-${AlignItemsRef1}`
type AlignItemsValue = AlignItemsItemsLiteral
interface TailwindAlignItems {
    /**
     * `AlignItems`
     *
     * Utilities for controlling how flex and grid items are positioned along a
     * container's cross axis.
     *
     * @see
     * {@link https://tailwindcss.com/docs/align-items Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/align-items , MDN docs}
     */
    alignItems: AlignItemsValue
}
type JustifyContentJustifyLiteral = `justify-${JustifyContentRef1}`
type JustifyContentValue = JustifyContentJustifyLiteral
interface TailwindJustifyContent {
    /**
     * `JustifyContent`
     *
     * Utilities for controlling how flex and grid items are positioned along a
     * container's main axis.
     *
     * @see
     * {@link https://tailwindcss.com/docs/justify-content Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content , MDN docs}
     */
    justifyContent: JustifyContentValue
}
type JustifyItemsLiteral = `justify-items-${JustifyItemsRef1}`
type JustifyItemsValue = JustifyItemsLiteral
interface TailwindJustifyItems {
    /**
     * `JustifyItems`
     *
     * Utilities for controlling how grid items are aligned along their inline
     * axis.
     *
     * @see
     * {@link https://tailwindcss.com/docs/justify-items Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/justify-items , MDN docs}
     */
    justifyItems: JustifyItemsValue
}
type JustifySelfLiteral = `justify-self-${JustifySelfRef1}`
type JustifySelfValue = JustifySelfLiteral
interface TailwindJustifySelf {
    /**
     * `JustifySelf`
     *
     * Utilities for controlling how an individual grid item is aligned along its
     * inline axis.
     *
     * @see
     * {@link https://tailwindcss.com/docs/justify-self Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/justify-self , MDN docs}
     */
    justifySelf: JustifySelfValue
}
type LineHeightLeadingLiteral = `leading-${LineHeightRef1}`
type LineHeightProperty = LineHeightLeadingLiteral
type LineHeightArbitraryValue =
    | (`leading-${number}` & {})
    | (`leading-(${string})` & {})
    | (`leading-[${string}]` & {})
type LineHeightValue = LineHeightProperty | LineHeightArbitraryValue
interface TailwindLineHeight {
    /**
     * `LineHeight`
     *
     * Utilities for controlling the leading, or line height, of an element.
     *
     * Arbitrary support
     *
     * `leading-<number>`, `leading-(<var-name>)`, `leading-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/line-height Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/line-height , MDN docs}
     */
    lineHeight: LineHeightValue
}
type LineClampLiteral = `line-clamp-${LineClampRef1}`
type LineClampProperty = LineClampLiteral
type LineClampArbitraryValue =
    | (`line-clamp-${number}` & {})
    | (`line-clamp-(${string})` & {})
    | (`line-clamp-[${string}]` & {})
type LineClampValue = LineClampProperty | LineClampArbitraryValue
interface TailwindLineClamp {
    /**
     * `LineClamp`
     *
     * Utilities for clamping text to a specific number of lines.
     *
     * Arbitrary support
     *
     * `line-clamp-<number>`, `line-clamp-(<var-name>)`,
     * `line-clamp-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/line-clamp Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp , MDN docs}
     */
    lineClamp: LineClampValue
}
type TextDecorationLineLineLiteral = `line-${TextDecorationLineRef1}`
type TextDecorationLineValue =
    | "no-underline"
    | "overline"
    | "underline"
    | TextDecorationLineLineLiteral
interface TailwindTextDecorationLine {
    /**
     * `TextDecorationLine`
     *
     * Utilities for controlling the decoration of text.
     *
     * @see
     * {@link https://tailwindcss.com/docs/text-decoration-line Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-line , MDN docs}
     */
    textDecorationLine: TextDecorationLineValue
}
type ListStyleTypeListLiteral = `list-${ListStyleTypeRef1}`
type ListStyleTypeProperty = ListStyleTypeListLiteral
type ListStyleTypeArbitraryValue =
    | (`list-(${string})` & {})
    | (`list-[${string}]` & {})
type ListStyleTypeValue = ListStyleTypeProperty | ListStyleTypeArbitraryValue
interface TailwindListStyleType {
    /**
     * `ListStyleType`
     *
     * Utilities for controlling the marker style of a list.
     *
     * Arbitrary support
     *
     * `list-(<var-name>)`, `list-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/list-style-type Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type , MDN docs}
     */
    listStyleType: ListStyleTypeValue
}
type ListStyleImageValue = "list-image-none" | "list-image-none"
interface TailwindListStyleImage {
    /**
     * `ListStyleImage`
     *
     * Utilities for controlling the marker images for list items.
     *
     * @see
     * {@link https://tailwindcss.com/docs/list-style-image Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-image , MDN docs}
     */
    listStyleImage: ListStyleImageValue
}
type ListStylePositionValue =
    | "list-inside"
    | "list-outside"
    | "list-inside"
    | "list-outside"
interface TailwindListStylePosition {
    /**
     * `ListStylePosition`
     *
     * Utilities for controlling the position of bullets and numbers in lists.
     *
     * @see
     * {@link https://tailwindcss.com/docs/list-style-position Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-position , MDN docs}
     */
    listStylePosition: ListStylePositionValue
}
type MaskCompositeMaskLiteral = `mask-${MaskCompositeRef1}`
type MaskCompositeValue = MaskCompositeMaskLiteral
interface TailwindMaskComposite {
    /**
     * `MaskComposite`
     *
     * Utilities for controlling how multiple masks are combined together.
     *
     * @see
     * {@link https://tailwindcss.com/docs/mask-composite Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/mask-composite , MDN docs}
     */
    maskComposite: MaskCompositeValue
}
type MaskModeMaskLiteral = `mask-${MaskModeRef1}`
type MaskModeValue = MaskModeMaskLiteral
interface TailwindMaskMode {
    /**
     * `MaskMode`
     *
     * Utilities for controlling an element's mask mode.
     *
     * @see
     * {@link https://tailwindcss.com/docs/mask-mode Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/mask-mode , MDN docs}
     */
    maskMode: MaskModeValue
}
type MaskSizeMaskLiteral = `mask-${MaskSizeRef1}`
type MaskSizeProperty = MaskSizeMaskLiteral
type MaskSizeArbitraryValue =
    | (`mask-(${string})` & {})
    | (`mask-[${string}]` & {})
type MaskSizeValue = MaskSizeProperty | MaskSizeArbitraryValue
interface TailwindMaskSize {
    /**
     * `MaskSize`
     *
     * Utilities for controlling the size of an element's mask image.
     *
     * Arbitrary support
     *
     * `mask-(<var-name>)`, `mask-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/mask-size Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/mask-size , MDN docs}
     */
    maskSize: MaskSizeValue
}
type MaskPositionMaskbottomLiteral = `mask-bottom-${MaskPositionRef1}`
type MaskPositionMasktopLiteral = `mask-top-${MaskPositionRef2}`
type MaskPositionMaskLiteral = `mask-${MaskPositionRef3}`
type MaskPositionProperty =
    | MaskPositionMaskbottomLiteral
    | MaskPositionMasktopLiteral
    | MaskPositionMaskLiteral
type MaskPositionArbitraryValue =
    | (`mask-(${string})` & {})
    | (`mask-[${string}]` & {})
type MaskPositionValue = MaskPositionProperty | MaskPositionArbitraryValue
interface TailwindMaskPosition {
    /**
     * `MaskPosition`
     *
     * Utilities for controlling the position of an element's mask image.
     *
     * Arbitrary support
     *
     * `mask-(<var-name>)`, `mask-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/mask-position Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/mask-position , MDN docs}
     */
    maskPosition: MaskPositionValue
}
type MaskClipLiteral = `mask-clip-${MaskClipRef1}`
type MaskClipMaskLiteral = `mask-${MaskClipRef2}`
type MaskClipValue = MaskClipLiteral | MaskClipMaskLiteral
interface TailwindMaskClip {
    /**
     * `MaskClip`
     *
     * Utilities for controlling the bounding box of an element's mask.
     *
     * @see
     * {@link https://tailwindcss.com/docs/mask-clip Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/mask-clip , MDN docs}
     */
    maskClip: MaskClipValue
}
type MaskRepeatLiteral = `mask-repeat-${MaskRepeatRef1}`
type MaskRepeatMaskLiteral = `mask-${MaskRepeatRef2}`
type MaskRepeatValue = MaskRepeatLiteral | MaskRepeatMaskLiteral
interface TailwindMaskRepeat {
    /**
     * `MaskRepeat`
     *
     * Utilities for controlling the repetition of an element's mask image.
     *
     * @see
     * {@link https://tailwindcss.com/docs/mask-repeat Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/mask-repeat , MDN docs}
     */
    maskRepeat: MaskRepeatValue
}
type MaskOriginLiteral = `mask-origin-${MaskOriginRef1}`
type MaskOriginValue = MaskOriginLiteral
interface TailwindMaskOrigin {
    /**
     * `MaskOrigin`
     *
     * Utilities for controlling how an element's mask image is positioned
     * relative to borders, padding, and content.
     *
     * @see
     * {@link https://tailwindcss.com/docs/mask-origin Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/mask-origin , MDN docs}
     */
    maskOrigin: MaskOriginValue
}
type MaskTypeValue =
    | "mask-type-alpha"
    | "mask-type-luminance"
    | "mask-type-alpha"
    | "mask-type-luminance"
interface TailwindMaskType {
    /**
     * `MaskType`
     *
     * Utilities for controlling how an SVG mask is interpreted.
     *
     * @see
     * {@link https://tailwindcss.com/docs/mask-type Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/mask-type , MDN docs}
     */
    maskType: MaskTypeValue
}
type MaxBlockSizeMaxblockLiteral = `max-block-${MaxBlockSizeRef1}`
type MaxBlockSizeProperty = MaxBlockSizeMaxblockLiteral
type MaxBlockSizeArbitraryValue =
    | (`max-block-${number}` & {})
    | (`max-block-(${string})` & {})
    | (`max-block-[${string}]` & {})
type MaxBlockSizeValue = MaxBlockSizeProperty | MaxBlockSizeArbitraryValue
interface TailwindMaxBlockSize {
    /**
     * `MaxBlockSize`
     *
     * Utilities for setting the maximum block size of an element.
     *
     * Arbitrary support
     *
     * `max-block-<number>`, `max-block-(<var-name>)`,
     * `max-block-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/max-block-size Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/max-block-size , MDN docs}
     */
    maxBlockSize: MaxBlockSizeValue
}
type MaxHeightMaxhLiteral = `max-h-${MaxHeightRef1}`
type MaxHeightProperty = MaxHeightMaxhLiteral
type MaxHeightArbitraryValue =
    | (`max-h-${number}` & {})
    | (`max-h-(${string})` & {})
    | (`max-h-[${string}]` & {})
type MaxHeightValue = MaxHeightProperty | MaxHeightArbitraryValue
interface TailwindMaxHeight {
    /**
     * `MaxHeight`
     *
     * Utilities for setting the maximum height of an element.
     *
     * Arbitrary support
     *
     * `max-h-<number>`, `max-h-(<var-name>)`, `max-h-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/max-height Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/max-height , MDN docs}
     */
    maxHeight: MaxHeightValue
}
type MaxInlineSizeMaxinlineLiteral = `max-inline-${MaxInlineSizeRef1}`
type MaxInlineSizeProperty = MaxInlineSizeMaxinlineLiteral
type MaxInlineSizeArbitraryValue =
    | (`max-inline-${number}` & {})
    | (`max-inline-(${string})` & {})
    | (`max-inline-[${string}]` & {})
type MaxInlineSizeValue = MaxInlineSizeProperty | MaxInlineSizeArbitraryValue
interface TailwindMaxInlineSize {
    /**
     * `MaxInlineSize`
     *
     * Utilities for setting the maximum inline size of an element.
     *
     * Arbitrary support
     *
     * `max-inline-<number>`, `max-inline-(<var-name>)`,
     * `max-inline-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/max-inline-size Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/max-inline-size , MDN docs}
     */
    maxInlineSize: MaxInlineSizeValue
}
type MinBlockSizeMinblockLiteral = `min-block-${MinBlockSizeRef1}`
type MinBlockSizeProperty = MinBlockSizeMinblockLiteral
type MinBlockSizeArbitraryValue =
    | (`min-block-${number}` & {})
    | (`min-block-(${string})` & {})
    | (`min-block-[${string}]` & {})
type MinBlockSizeValue = MinBlockSizeProperty | MinBlockSizeArbitraryValue
interface TailwindMinBlockSize {
    /**
     * `MinBlockSize`
     *
     * Utilities for setting the minimum block size of an element.
     *
     * Arbitrary support
     *
     * `min-block-<number>`, `min-block-(<var-name>)`,
     * `min-block-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/min-block-size Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/min-block-size , MDN docs}
     */
    minBlockSize: MinBlockSizeValue
}
type MinHeightMinhLiteral = `min-h-${MinHeightRef1}`
type MinHeightProperty = MinHeightMinhLiteral
type MinHeightArbitraryValue =
    | (`min-h-${number}` & {})
    | (`min-h-(${string})` & {})
    | (`min-h-[${string}]` & {})
type MinHeightValue = MinHeightProperty | MinHeightArbitraryValue
interface TailwindMinHeight {
    /**
     * `MinHeight`
     *
     * Utilities for setting the minimum height of an element.
     *
     * Arbitrary support
     *
     * `min-h-<number>`, `min-h-(<var-name>)`, `min-h-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/min-height Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/min-height , MDN docs}
     */
    minHeight: MinHeightValue
}
type MinInlineSizeMininlineLiteral = `min-inline-${MinInlineSizeRef1}`
type MinInlineSizeProperty = MinInlineSizeMininlineLiteral
type MinInlineSizeArbitraryValue =
    | (`min-inline-${number}` & {})
    | (`min-inline-(${string})` & {})
    | (`min-inline-[${string}]` & {})
type MinInlineSizeValue = MinInlineSizeProperty | MinInlineSizeArbitraryValue
interface TailwindMinInlineSize {
    /**
     * `MinInlineSize`
     *
     * Utilities for setting the minimum inline size of an element.
     *
     * Arbitrary support
     *
     * `min-inline-<number>`, `min-inline-(<var-name>)`,
     * `min-inline-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/min-inline-size Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/min-inline-size , MDN docs}
     */
    minInlineSize: MinInlineSizeValue
}
type MinWidthMinwLiteral = `min-w-${MinWidthRef1}`
type MinWidthProperty = MinWidthMinwLiteral
type MinWidthArbitraryValue =
    | (`min-w-${number}` & {})
    | (`min-w-(${string})` & {})
    | (`min-w-[${string}]` & {})
type MinWidthValue = MinWidthProperty | MinWidthArbitraryValue
interface TailwindMinWidth {
    /**
     * `MinWidth`
     *
     * Utilities for setting the minimum width of an element.
     *
     * Arbitrary support
     *
     * `min-w-<number>`, `min-w-(<var-name>)`, `min-w-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/min-width Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/min-width , MDN docs}
     */
    minWidth: MinWidthValue
}
type MixBlendModeMixblendLiteral = `mix-blend-${MixBlendModeRef1}`
type MixBlendModeMixblendcolorLiteral = `mix-blend-color-${MixBlendModeRef2}`
type MixBlendModeValue =
    | MixBlendModeMixblendLiteral
    | MixBlendModeMixblendcolorLiteral
interface TailwindMixBlendMode {
    /**
     * `MixBlendMode`
     *
     * Utilities for controlling how an element should blend with the background.
     *
     * @see
     * {@link https://tailwindcss.com/docs/mix-blend-mode Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode , MDN docs}
     */
    mixBlendMode: MixBlendModeValue
}
type ObjectPositionObjectbottomLiteral = `object-bottom-${ObjectPositionRef1}`
type ObjectPositionObjecttopLiteral = `object-top-${ObjectPositionRef2}`
type ObjectPositionObjectLiteral = `object-${ObjectPositionRef3}`
type ObjectPositionProperty =
    | ObjectPositionObjectbottomLiteral
    | ObjectPositionObjecttopLiteral
    | ObjectPositionObjectLiteral
type ObjectPositionArbitraryValue =
    | (`object-(${string})` & {})
    | (`object-[${string}]` & {})
type ObjectPositionValue = ObjectPositionProperty | ObjectPositionArbitraryValue
interface TailwindObjectPosition {
    /**
     * `ObjectPosition`
     *
     * Utilities for controlling how a replaced element's content should be
     * positioned within its container.
     *
     * Arbitrary support
     *
     * `object-(<var-name>)`, `object-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/object-position Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/object-position , MDN docs}
     */
    objectPosition: ObjectPositionValue
}
type ObjectFitObjectLiteral = `object-${ObjectFitRef1}`
type ObjectFitValue = ObjectFitObjectLiteral
interface TailwindObjectFit {
    /**
     * `ObjectFit`
     *
     * Utilities for controlling how a replaced element's content should be
     * resized.
     *
     * @see
     * {@link https://tailwindcss.com/docs/object-fit Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit , MDN docs}
     */
    objectFit: ObjectFitValue
}
type OpacityLiteral = `opacity-${OpacityRef1}`
type OpacityProperty = OpacityLiteral
type OpacityArbitraryValue =
    | (`opacity-${number}` & {})
    | (`opacity-(${string})` & {})
    | (`opacity-[${string}]` & {})
type OpacityValue = OpacityProperty | OpacityArbitraryValue
interface TailwindOpacity {
    /**
     * `Opacity`
     *
     * Utilities for controlling the opacity of an element.
     *
     * Arbitrary support
     *
     * `opacity-<number>`, `opacity-(<var-name>)`, `opacity-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/opacity Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/opacity , MDN docs}
     */
    opacity: OpacityValue
}
type TransformOriginOriginbottomLiteral = `origin-bottom-${TransformOriginRef1}`
type TransformOriginOrigintopLiteral = `origin-top-${TransformOriginRef2}`
type TransformOriginOriginLiteral = `origin-${TransformOriginRef3}`
type TransformOriginProperty =
    | TransformOriginOriginbottomLiteral
    | TransformOriginOrigintopLiteral
    | TransformOriginOriginLiteral
type TransformOriginArbitraryValue =
    | (`origin-(${string})` & {})
    | (`origin-[${string}]` & {})
type TransformOriginValue =
    | TransformOriginProperty
    | TransformOriginArbitraryValue
interface TailwindTransformOrigin {
    /**
     * `TransformOrigin`
     *
     * Utilities for specifying the origin for an element's transformations.
     *
     * Arbitrary support
     *
     * `origin-(<var-name>)`, `origin-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/transform-origin Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/transform-origin , MDN docs}
     */
    transformOrigin: TransformOriginValue
}
type OutlineWidthOutlineaccentLiteral = `outline-accent-${OutlineWidthRef1}`
type OutlineWidthOutlinechartLiteral = `outline-chart-${OutlineWidthRef2}`
type OutlineWidthOutlineprimaryLiteral = `outline-primary-${OutlineWidthRef3}`
type OutlineWidthOutlinesidebarLiteral = `outline-sidebar-${OutlineWidthRef4}`
type OutlineWidthOutlineLiteral = `outline-${OutlineWidthRef5}`
type OutlineWidthProperty =
    | "outline"
    | OutlineWidthOutlineaccentLiteral
    | OutlineWidthOutlinechartLiteral
    | OutlineWidthOutlineprimaryLiteral
    | OutlineWidthOutlinesidebarLiteral
    | OutlineWidthOutlineLiteral
type OutlineWidthArbitraryValue =
    | (`outline-${number}` & {})
    | (`outline-(${string})` & {})
    | (`outline-[${string}]` & {})
type OutlineWidthValue =
    | OutlineWidthProperty
    | (`outline-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`outline-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`outline-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`outline-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`outline-${string}/${VariantsA91e8ba1}` & {})
    | OutlineWidthArbitraryValue
interface TailwindOutlineWidth {
    /**
     * `OutlineWidth`
     *
     * Utilities for controlling the width of an element's outline.
     *
     * Arbitrary support
     *
     * `outline-<number>`, `outline-(<var-name>)`, `outline-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/outline-width Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/outline-width , MDN docs}
     */
    outlineWidth: OutlineWidthValue
}
type OutlineColorOutlineLiteral = `outline-${OutlineColorRef1}`
type OutlineColorProperty = OutlineColorOutlineLiteral
type OutlineColorArbitraryValue =
    | (`outline-(${string})` & {})
    | (`outline-[${string}]` & {})
type OutlineColorValue =
    | OutlineColorProperty
    | (`outline-${string}/${VariantsA91e8ba1}` & {})
    | OutlineColorArbitraryValue
interface TailwindOutlineColor {
    /**
     * `OutlineColor`
     *
     * Utilities for controlling the color of an element's outline.
     *
     * Arbitrary support
     *
     * `outline-(<var-name>)`, `outline-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/outline-color Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/outline-color , MDN docs}
     */
    outlineColor: OutlineColorValue
}
type OutlineStyleOutlineLiteral = `outline-${OutlineStyleRef1}`
type OutlineStyleValue = OutlineStyleOutlineLiteral
interface TailwindOutlineStyle {
    /**
     * `OutlineStyle`
     *
     * Utilities for controlling the style of an element's outline.
     *
     * @see
     * {@link https://tailwindcss.com/docs/outline-style Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/outline-style , MDN docs}
     */
    outlineStyle: OutlineStyleValue
}
type OverflowXLiteral = `overflow-x-${OverflowRef1}`
type OverflowYLiteral = `overflow-y-${OverflowRef2}`
type OverflowLiteral = `overflow-${OverflowRef3}`
type OverflowValue = OverflowXLiteral | OverflowYLiteral | OverflowLiteral
interface TailwindOverflow {
    /**
     * `Overflow`
     *
     * Utilities for controlling how an element handles content that is too large
     * for the container.
     *
     * @see
     * {@link https://tailwindcss.com/docs/overflow Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/overflow , MDN docs}
     */
    overflow: OverflowValue
}
type OverscrollBehaviorOverscrollxLiteral =
    `overscroll-x-${OverscrollBehaviorRef1}`
type OverscrollBehaviorOverscrollyLiteral =
    `overscroll-y-${OverscrollBehaviorRef2}`
type OverscrollBehaviorOverscrollLiteral =
    `overscroll-${OverscrollBehaviorRef3}`
type OverscrollBehaviorValue =
    | OverscrollBehaviorOverscrollxLiteral
    | OverscrollBehaviorOverscrollyLiteral
    | OverscrollBehaviorOverscrollLiteral
interface TailwindOverscrollBehavior {
    /**
     * `OverscrollBehavior`
     *
     * Utilities for controlling how the browser behaves when reaching the
     * boundary of a scrolling area.
     *
     * @see
     * {@link https://tailwindcss.com/docs/overscroll-behavior Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior , MDN docs}
     */
    overscrollBehavior: OverscrollBehaviorValue
}
type PaddingPbeLiteral = `pbe-${PaddingRef1}`
type PaddingPLiteral = `p-${PaddingRef1}`
type PaddingPbLiteral = `pb-${PaddingRef1}`
type PaddingPbsLiteral = `pbs-${PaddingRef1}`
type PaddingPeLiteral = `pe-${PaddingRef1}`
type PaddingPlLiteral = `pl-${PaddingRef1}`
type PaddingPrLiteral = `pr-${PaddingRef1}`
type PaddingPsLiteral = `ps-${PaddingRef1}`
type PaddingPtLiteral = `pt-${PaddingRef1}`
type PaddingPxLiteral = `px-${PaddingRef1}`
type PaddingPyLiteral = `py-${PaddingRef1}`
type PaddingProperty =
    | PaddingPbeLiteral
    | PaddingPLiteral
    | PaddingPbLiteral
    | PaddingPbsLiteral
    | PaddingPeLiteral
    | PaddingPlLiteral
    | PaddingPrLiteral
    | PaddingPsLiteral
    | PaddingPtLiteral
    | PaddingPxLiteral
    | PaddingPyLiteral
type PaddingArbitraryValue =
    | (`pbe-${number}` & {})
    | (`pbe-(${string})` & {})
    | (`pbe-[${string}]` & {})
    | (`p-${number}` & {})
    | (`p-(${string})` & {})
    | (`p-[${string}]` & {})
    | (`pb-${number}` & {})
    | (`pb-(${string})` & {})
    | (`pb-[${string}]` & {})
    | (`pbs-${number}` & {})
    | (`pbs-(${string})` & {})
    | (`pbs-[${string}]` & {})
    | (`pe-${number}` & {})
    | (`pe-(${string})` & {})
    | (`pe-[${string}]` & {})
    | (`pl-${number}` & {})
    | (`pl-(${string})` & {})
    | (`pl-[${string}]` & {})
    | (`pr-${number}` & {})
    | (`pr-(${string})` & {})
    | (`pr-[${string}]` & {})
    | (`ps-${number}` & {})
    | (`ps-(${string})` & {})
    | (`ps-[${string}]` & {})
    | (`pt-${number}` & {})
    | (`pt-(${string})` & {})
    | (`pt-[${string}]` & {})
    | (`px-${number}` & {})
    | (`px-(${string})` & {})
    | (`px-[${string}]` & {})
    | (`py-${number}` & {})
    | (`py-(${string})` & {})
    | (`py-[${string}]` & {})
type PaddingValue = PaddingProperty | PaddingArbitraryValue
interface TailwindPadding {
    /**
     * `Padding`
     *
     * Utilities for controlling an element's padding.
     *
     * Arbitrary support
     *
     * `pbe-<number>`, `pbe-(<var-name>)`, `pbe-[<arbitrary-value>]`,
     * `p-<number>`, `p-(<var-name>)` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/padding Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/padding , MDN docs}
     */
    padding: PaddingValue
}
type AnimationPlayStateValue =
    | "paused"
    | "play-state-initial"
    | "running"
    | "paused"
    | "play-state-initial"
    | "running"
interface TailwindAnimationPlayState {
    /**
     * `AnimationPlayState`
     *
     * @see
     * {@link https://tailwindcss.com/docs Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/animation-play-state , MDN docs}
     */
    animationPlayState: AnimationPlayStateValue
}
type PerspectiveLiteral = `perspective-${PerspectiveRef1}`
type PerspectiveProperty = PerspectiveLiteral
type PerspectiveArbitraryValue =
    | (`perspective-(${string})` & {})
    | (`perspective-[${string}]` & {})
type PerspectiveValue = PerspectiveProperty | PerspectiveArbitraryValue
interface TailwindPerspective {
    /**
     * `Perspective`
     *
     * Utilities for controlling an element's perspective when placed in 3D space.
     *
     * Arbitrary support
     *
     * `perspective-(<var-name>)`, `perspective-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/perspective Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/perspective , MDN docs}
     */
    perspective: PerspectiveValue
}
type PerspectiveOriginBottomLiteral =
    `perspective-origin-bottom-${PerspectiveOriginRef1}`
type PerspectiveOriginTopLiteral =
    `perspective-origin-top-${PerspectiveOriginRef2}`
type PerspectiveOriginLiteral = `perspective-origin-${PerspectiveOriginRef3}`
type PerspectiveOriginProperty =
    | PerspectiveOriginBottomLiteral
    | PerspectiveOriginTopLiteral
    | PerspectiveOriginLiteral
type PerspectiveOriginArbitraryValue =
    | (`perspective-origin-(${string})` & {})
    | (`perspective-origin-[${string}]` & {})
type PerspectiveOriginValue =
    | PerspectiveOriginProperty
    | PerspectiveOriginArbitraryValue
interface TailwindPerspectiveOrigin {
    /**
     * `PerspectiveOrigin`
     *
     * Utilities for controlling an element's perspective origin when placed in 3D
     * space.
     *
     * Arbitrary support
     *
     * `perspective-origin-(<var-name>)`, `perspective-origin-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/perspective-origin Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/perspective-origin , MDN docs}
     */
    perspectiveOrigin: PerspectiveOriginValue
}
type PlaceContentLiteral = `place-content-${PlaceContentRef1}`
type PlaceContentValue = PlaceContentLiteral
interface TailwindPlaceContent {
    /**
     * `PlaceContent`
     *
     * Utilities for controlling how content is justified and aligned at the same
     * time.
     *
     * @see
     * {@link https://tailwindcss.com/docs/place-content Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/place-content , MDN docs}
     */
    placeContent: PlaceContentValue
}
type PlaceItemsLiteral = `place-items-${PlaceItemsRef1}`
type PlaceItemsValue = PlaceItemsLiteral
interface TailwindPlaceItems {
    /**
     * `PlaceItems`
     *
     * Utilities for controlling how items are justified and aligned at the same
     * time.
     *
     * @see
     * {@link https://tailwindcss.com/docs/place-items Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/place-items , MDN docs}
     */
    placeItems: PlaceItemsValue
}
type PlaceSelfLiteral = `place-self-${PlaceSelfRef1}`
type PlaceSelfValue = PlaceSelfLiteral
interface TailwindPlaceSelf {
    /**
     * `PlaceSelf`
     *
     * Utilities for controlling how an individual item is justified and aligned
     * at the same time.
     *
     * @see
     * {@link https://tailwindcss.com/docs/place-self Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/place-self , MDN docs}
     */
    placeSelf: PlaceSelfValue
}
type ColorPlaceholderaccentLiteral = `placeholder-accent-${ColorRef1}`
type ColorPlaceholderchartLiteral = `placeholder-chart-${ColorRef2}`
type ColorPlaceholderprimaryLiteral = `placeholder-primary-${ColorRef3}`
type ColorPlaceholdersidebarLiteral = `placeholder-sidebar-${ColorRef4}`
type ColorTextaccentLiteral = `text-accent-${ColorRef5}`
type ColorTextchartLiteral = `text-chart-${ColorRef6}`
type ColorTextprimaryLiteral = `text-primary-${ColorRef7}`
type ColorTextsidebarLiteral = `text-sidebar-${ColorRef4}`
type ColorPlaceholderLiteral = `placeholder-${ColorRef8}`
type ColorTextLiteral = `text-${ColorRef8}`
type ColorProperty =
    | ColorPlaceholderaccentLiteral
    | ColorPlaceholderchartLiteral
    | ColorPlaceholderprimaryLiteral
    | ColorPlaceholdersidebarLiteral
    | ColorTextaccentLiteral
    | ColorTextchartLiteral
    | ColorTextprimaryLiteral
    | ColorTextsidebarLiteral
    | ColorPlaceholderLiteral
    | ColorTextLiteral
type ColorArbitraryValue = (`text-(${string})` & {}) | (`text-[${string}]` & {})
type ColorValue =
    | ColorProperty
    | (`placeholder-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`placeholder-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`placeholder-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`placeholder-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`text-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`text-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`text-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`text-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`placeholder-${string}/${VariantsA91e8ba1}` & {})
    | (`text-${string}/${VariantsA91e8ba1}` & {})
    | ColorArbitraryValue
interface TailwindColor {
    /**
     * `Color`
     *
     * Utilities for controlling the text color of an element.
     *
     * Arbitrary support
     *
     * `text-(<var-name>)`, `text-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/color Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/color , MDN docs}
     */
    color: ColorValue
}
type PointerEventsValue =
    | "pointer-events-auto"
    | "pointer-events-none"
    | "pointer-events-auto"
    | "pointer-events-none"
interface TailwindPointerEvents {
    /**
     * `PointerEvents`
     *
     * Utilities for controlling whether an element responds to pointer events.
     *
     * @see
     * {@link https://tailwindcss.com/docs/pointer-events Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events , MDN docs}
     */
    pointerEvents: PointerEventsValue
}
type AnimationIterationCountRepeatLiteral =
    `repeat-${AnimationIterationCountRef1}`
type AnimationIterationCountValue = AnimationIterationCountRepeatLiteral
interface TailwindAnimationIterationCount {
    /**
     * `AnimationIterationCount`
     *
     * @see
     * {@link https://tailwindcss.com/docs Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/animation-iteration-count , MDN docs}
     */
    animationIterationCount: AnimationIterationCountValue
}
type ResizeLiteral = `resize-${ResizeRef1}`
type ResizeValue = "resize" | ResizeLiteral
interface TailwindResize {
    /**
     * `Resize`
     *
     * Utilities for controlling how an element can be resized.
     *
     * @see
     * {@link https://tailwindcss.com/docs/resize Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/resize , MDN docs}
     */
    resize: ResizeValue
}
type BorderRadiusRoundedbLiteral = `rounded-b-${BorderRadiusRef1}`
type BorderRadiusRoundedblLiteral = `rounded-bl-${BorderRadiusRef1}`
type BorderRadiusRoundedbrLiteral = `rounded-br-${BorderRadiusRef1}`
type BorderRadiusRoundedeLiteral = `rounded-e-${BorderRadiusRef1}`
type BorderRadiusRoundedeeLiteral = `rounded-ee-${BorderRadiusRef1}`
type BorderRadiusRoundedesLiteral = `rounded-es-${BorderRadiusRef1}`
type BorderRadiusRoundedlLiteral = `rounded-l-${BorderRadiusRef1}`
type BorderRadiusRoundedrLiteral = `rounded-r-${BorderRadiusRef1}`
type BorderRadiusRoundedsLiteral = `rounded-s-${BorderRadiusRef1}`
type BorderRadiusRoundedseLiteral = `rounded-se-${BorderRadiusRef1}`
type BorderRadiusRoundedssLiteral = `rounded-ss-${BorderRadiusRef1}`
type BorderRadiusRoundedtLiteral = `rounded-t-${BorderRadiusRef1}`
type BorderRadiusRoundedtlLiteral = `rounded-tl-${BorderRadiusRef1}`
type BorderRadiusRoundedtrLiteral = `rounded-tr-${BorderRadiusRef1}`
type BorderRadiusRoundedLiteral = `rounded-${BorderRadiusRef1}`
type BorderRadiusProperty =
    | BorderRadiusRoundedbLiteral
    | BorderRadiusRoundedblLiteral
    | BorderRadiusRoundedbrLiteral
    | BorderRadiusRoundedeLiteral
    | BorderRadiusRoundedeeLiteral
    | BorderRadiusRoundedesLiteral
    | BorderRadiusRoundedlLiteral
    | BorderRadiusRoundedrLiteral
    | BorderRadiusRoundedsLiteral
    | BorderRadiusRoundedseLiteral
    | BorderRadiusRoundedssLiteral
    | BorderRadiusRoundedtLiteral
    | BorderRadiusRoundedtlLiteral
    | BorderRadiusRoundedtrLiteral
    | BorderRadiusRoundedLiteral
type BorderRadiusArbitraryValue =
    | (`rounded-b-(${string})` & {})
    | (`rounded-b-[${string}]` & {})
    | (`rounded-bl-(${string})` & {})
    | (`rounded-bl-[${string}]` & {})
    | (`rounded-br-(${string})` & {})
    | (`rounded-br-[${string}]` & {})
    | (`rounded-e-(${string})` & {})
    | (`rounded-e-[${string}]` & {})
    | (`rounded-ee-(${string})` & {})
    | (`rounded-ee-[${string}]` & {})
    | (`rounded-es-(${string})` & {})
    | (`rounded-es-[${string}]` & {})
    | (`rounded-l-(${string})` & {})
    | (`rounded-l-[${string}]` & {})
    | (`rounded-r-(${string})` & {})
    | (`rounded-r-[${string}]` & {})
    | (`rounded-s-(${string})` & {})
    | (`rounded-s-[${string}]` & {})
    | (`rounded-se-(${string})` & {})
    | (`rounded-se-[${string}]` & {})
    | (`rounded-ss-(${string})` & {})
    | (`rounded-ss-[${string}]` & {})
    | (`rounded-t-(${string})` & {})
    | (`rounded-t-[${string}]` & {})
    | (`rounded-tl-(${string})` & {})
    | (`rounded-tl-[${string}]` & {})
    | (`rounded-tr-(${string})` & {})
    | (`rounded-tr-[${string}]` & {})
    | (`rounded-(${string})` & {})
    | (`rounded-[${string}]` & {})
type BorderRadiusValue = BorderRadiusProperty | BorderRadiusArbitraryValue
interface TailwindBorderRadius {
    /**
     * `BorderRadius`
     *
     * Utilities for controlling the border radius of an element.
     *
     * Arbitrary support
     *
     * `rounded-b-(<var-name>)`, `rounded-b-[<arbitrary-value>]`,
     * `rounded-bl-(<var-name>)`, `rounded-bl-[<arbitrary-value>]`,
     * `rounded-br-(<var-name>)` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/border-radius Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius , MDN docs}
     */
    borderRadius: BorderRadiusValue
}
type ColorSchemeSchemelightLiteral = `scheme-light-${ColorSchemeRef1}`
type ColorSchemeSchemeLiteral = `scheme-${ColorSchemeRef2}`
type ColorSchemeValue = ColorSchemeSchemelightLiteral | ColorSchemeSchemeLiteral
interface TailwindColorScheme {
    /**
     * `ColorScheme`
     *
     * Utilities for controlling the color scheme of an element.
     *
     * @see
     * {@link https://tailwindcss.com/docs/color-scheme Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme , MDN docs}
     */
    colorScheme: ColorSchemeValue
}
type ScrollBehaviorValue =
    | "scroll-auto"
    | "scroll-smooth"
    | "scroll-auto"
    | "scroll-smooth"
interface TailwindScrollBehavior {
    /**
     * `ScrollBehavior`
     *
     * Utilities for controlling the scroll behavior of an element.
     *
     * @see
     * {@link https://tailwindcss.com/docs/scroll-behavior Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior , MDN docs}
     */
    scrollBehavior: ScrollBehaviorValue
}
type ScrollPaddingScrollpLiteral = `scroll-p-${ScrollPaddingRef1}`
type ScrollPaddingScrollpbLiteral = `scroll-pb-${ScrollPaddingRef1}`
type ScrollPaddingScrollpbeLiteral = `scroll-pbe-${ScrollPaddingRef1}`
type ScrollPaddingScrollpbsLiteral = `scroll-pbs-${ScrollPaddingRef1}`
type ScrollPaddingScrollpeLiteral = `scroll-pe-${ScrollPaddingRef1}`
type ScrollPaddingScrollplLiteral = `scroll-pl-${ScrollPaddingRef1}`
type ScrollPaddingScrollprLiteral = `scroll-pr-${ScrollPaddingRef1}`
type ScrollPaddingScrollpsLiteral = `scroll-ps-${ScrollPaddingRef1}`
type ScrollPaddingScrollptLiteral = `scroll-pt-${ScrollPaddingRef1}`
type ScrollPaddingScrollpxLiteral = `scroll-px-${ScrollPaddingRef1}`
type ScrollPaddingScrollpyLiteral = `scroll-py-${ScrollPaddingRef1}`
type ScrollPaddingProperty =
    | ScrollPaddingScrollpLiteral
    | ScrollPaddingScrollpbLiteral
    | ScrollPaddingScrollpbeLiteral
    | ScrollPaddingScrollpbsLiteral
    | ScrollPaddingScrollpeLiteral
    | ScrollPaddingScrollplLiteral
    | ScrollPaddingScrollprLiteral
    | ScrollPaddingScrollpsLiteral
    | ScrollPaddingScrollptLiteral
    | ScrollPaddingScrollpxLiteral
    | ScrollPaddingScrollpyLiteral
type ScrollPaddingArbitraryValue =
    | (`scroll-p-${number}` & {})
    | (`scroll-p-${number}` & {})
    | (`-scroll-p-${number}` & {})
    | (`scroll-p-(${string})` & {})
    | (`scroll-p-[${string}]` & {})
    | (`scroll-pb-${number}` & {})
    | (`scroll-pb-${number}` & {})
    | (`-scroll-pb-${number}` & {})
    | (`scroll-pb-(${string})` & {})
    | (`scroll-pb-[${string}]` & {})
    | (`scroll-pbe-${number}` & {})
    | (`scroll-pbe-${number}` & {})
    | (`-scroll-pbe-${number}` & {})
    | (`scroll-pbe-(${string})` & {})
    | (`scroll-pbe-[${string}]` & {})
    | (`scroll-pbs-${number}` & {})
    | (`scroll-pbs-${number}` & {})
    | (`-scroll-pbs-${number}` & {})
    | (`scroll-pbs-(${string})` & {})
    | (`scroll-pbs-[${string}]` & {})
    | (`scroll-pe-${number}` & {})
    | (`scroll-pe-${number}` & {})
    | (`-scroll-pe-${number}` & {})
    | (`scroll-pe-(${string})` & {})
    | (`scroll-pe-[${string}]` & {})
    | (`scroll-pl-${number}` & {})
    | (`scroll-pl-${number}` & {})
    | (`-scroll-pl-${number}` & {})
    | (`scroll-pl-(${string})` & {})
    | (`scroll-pl-[${string}]` & {})
    | (`scroll-pr-${number}` & {})
    | (`scroll-pr-${number}` & {})
    | (`-scroll-pr-${number}` & {})
    | (`scroll-pr-(${string})` & {})
    | (`scroll-pr-[${string}]` & {})
    | (`scroll-ps-${number}` & {})
    | (`scroll-ps-${number}` & {})
    | (`-scroll-ps-${number}` & {})
    | (`scroll-ps-(${string})` & {})
    | (`scroll-ps-[${string}]` & {})
    | (`scroll-pt-${number}` & {})
    | (`scroll-pt-${number}` & {})
    | (`-scroll-pt-${number}` & {})
    | (`scroll-pt-(${string})` & {})
    | (`scroll-pt-[${string}]` & {})
    | (`scroll-px-${number}` & {})
    | (`scroll-px-${number}` & {})
    | (`-scroll-px-${number}` & {})
    | (`scroll-px-(${string})` & {})
    | (`scroll-px-[${string}]` & {})
    | (`scroll-py-${number}` & {})
    | (`scroll-py-${number}` & {})
    | (`-scroll-py-${number}` & {})
    | (`scroll-py-(${string})` & {})
    | (`scroll-py-[${string}]` & {})
type ScrollPaddingValue = ScrollPaddingProperty | ScrollPaddingArbitraryValue
interface TailwindScrollPadding {
    /**
     * `ScrollPadding`
     *
     * Utilities for controlling an element's scroll offset within a snap
     * container.
     *
     * Arbitrary support
     *
     * `scroll-p-<number>`, `-scroll-p-<number>`, `scroll-p-(<var-name>)`,
     * `scroll-p-[<arbitrary-value>]`, `scroll-pb-<number>` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/scroll-padding Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding , MDN docs}
     */
    scrollPadding: ScrollPaddingValue
}
type UserSelectSelectLiteral = `select-${UserSelectRef1}`
type UserSelectValue = UserSelectSelectLiteral
interface TailwindUserSelect {
    /**
     * `UserSelect`
     *
     * Utilities for controlling whether the user can select text in an element.
     *
     * @see
     * {@link https://tailwindcss.com/docs/user-select Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/user-select , MDN docs}
     */
    userSelect: UserSelectValue
}
type AlignSelfSelfLiteral = `self-${AlignSelfRef1}`
type AlignSelfValue = AlignSelfSelfLiteral
interface TailwindAlignSelf {
    /**
     * `AlignSelf`
     *
     * Utilities for controlling how an individual flex or grid item is positioned
     * along its container's cross axis.
     *
     * @see
     * {@link https://tailwindcss.com/docs/align-self Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/align-self , MDN docs}
     */
    alignSelf: AlignSelfValue
}
type FlexShrinkProperty = "shrink" | "shrink-0" | "shrink" | "shrink-0"
type FlexShrinkArbitraryValue =
    | (`shrink-${number}` & {})
    | (`shrink-[${string}]` & {})
    | (`shrink-(${string})` & {})
type FlexShrinkValue = FlexShrinkProperty | FlexShrinkArbitraryValue
interface TailwindFlexShrink {
    /**
     * `FlexShrink`
     *
     * Utilities for controlling how flex items shrink.
     *
     * Arbitrary support
     *
     * `shrink-<number>`, `shrink-[<arbitrary-value>]`, `shrink-(<var-name>)`
     *
     * @see
     * {@link https://tailwindcss.com/docs/flex-shrink Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/flex-shrink , MDN docs}
     */
    flexShrink: FlexShrinkValue
}
type WidthSizeLiteral = `size-${WidthRef1}`
type WidthWLiteral =
    | `w-${WidthRef1}`
    | "w-2xl"
    | "w-2xs"
    | "w-3xl"
    | "w-3xs"
    | "w-4xl"
    | "w-5xl"
    | "w-6xl"
    | "w-7xl"
    | "w-lg"
    | "w-md"
    | "w-screen"
    | "w-sm"
    | "w-xl"
    | "w-xs"
type WidthProperty = WidthSizeLiteral | WidthWLiteral
type WidthArbitraryValue =
    | (`size-${number}` & {})
    | (`size-(${string})` & {})
    | (`size-[${string}]` & {})
    | (`w-${number}` & {})
    | (`w-(${string})` & {})
    | (`w-[${string}]` & {})
type WidthValue = WidthProperty | WidthArbitraryValue
interface TailwindWidth {
    /**
     * `Width`
     *
     * Utilities for setting the width of an element.
     *
     * Arbitrary support
     *
     * `size-<number>`, `size-(<var-name>)`, `size-[<arbitrary-value>]`,
     * `w-<number>`, `w-(<var-name>)` ...
     *
     * @see
     * {@link https://tailwindcss.com/docs/width Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/width , MDN docs}
     */
    width: WidthValue
}
type ScrollSnapAlignSnapLiteral = `snap-${ScrollSnapAlignRef1}`
type ScrollSnapAlignValue = ScrollSnapAlignSnapLiteral
interface TailwindScrollSnapAlign {
    /**
     * `ScrollSnapAlign`
     *
     * Utilities for controlling the scroll snap alignment of an element.
     *
     * @see
     * {@link https://tailwindcss.com/docs/scroll-snap-align Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-align , MDN docs}
     */
    scrollSnapAlign: ScrollSnapAlignValue
}
type ScrollSnapStopValue =
    | "snap-always"
    | "snap-normal"
    | "snap-always"
    | "snap-normal"
interface TailwindScrollSnapStop {
    /**
     * `ScrollSnapStop`
     *
     * Utilities for controlling whether you can skip past possible snap
     * positions.
     *
     * @see
     * {@link https://tailwindcss.com/docs/scroll-snap-stop Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-stop , MDN docs}
     */
    scrollSnapStop: ScrollSnapStopValue
}
type ScrollSnapTypeSnapLiteral = `snap-${ScrollSnapTypeRef1}`
type ScrollSnapTypeValue = ScrollSnapTypeSnapLiteral
interface TailwindScrollSnapType {
    /**
     * `ScrollSnapType`
     *
     * Utilities for controlling how strictly snap points are enforced in a snap
     * container.
     *
     * @see
     * {@link https://tailwindcss.com/docs/scroll-snap-type Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type , MDN docs}
     */
    scrollSnapType: ScrollSnapTypeValue
}
type StrokeWidthStrokeaccentLiteral = `stroke-accent-${StrokeWidthRef1}`
type StrokeWidthStrokechartLiteral = `stroke-chart-${StrokeWidthRef2}`
type StrokeWidthStrokeprimaryLiteral = `stroke-primary-${StrokeWidthRef3}`
type StrokeWidthStrokesidebarLiteral = `stroke-sidebar-${StrokeWidthRef4}`
type StrokeWidthStrokeLiteral = `stroke-${StrokeWidthRef5}`
type StrokeWidthProperty =
    | StrokeWidthStrokeaccentLiteral
    | StrokeWidthStrokechartLiteral
    | StrokeWidthStrokeprimaryLiteral
    | StrokeWidthStrokesidebarLiteral
    | StrokeWidthStrokeLiteral
type StrokeWidthArbitraryValue =
    | (`stroke-${number}` & {})
    | (`stroke-(${string})` & {})
    | (`stroke-[${string}]` & {})
type StrokeWidthValue =
    | StrokeWidthProperty
    | (`stroke-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`stroke-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`stroke-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`stroke-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`stroke-${string}/${VariantsA91e8ba1}` & {})
    | StrokeWidthArbitraryValue
interface TailwindStrokeWidth {
    /**
     * `StrokeWidth`
     *
     * Utilities for styling the stroke width of SVG elements.
     *
     * Arbitrary support
     *
     * `stroke-<number>`, `stroke-(<var-name>)`, `stroke-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/stroke-width Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/stroke-width , MDN docs}
     */
    strokeWidth: StrokeWidthValue
}
type StrokeLiteral = `stroke-${StrokeRef1}`
type StrokeProperty = StrokeLiteral
type StrokeArbitraryValue =
    | (`stroke-(${string})` & {})
    | (`stroke-[${string}]` & {})
type StrokeValue =
    | StrokeProperty
    | (`stroke-${string}/${VariantsA91e8ba1}` & {})
    | StrokeArbitraryValue
interface TailwindStroke {
    /**
     * `Stroke`
     *
     * Utilities for styling the stroke of SVG elements.
     *
     * Arbitrary support
     *
     * `stroke-(<var-name>)`, `stroke-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/stroke Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/stroke , MDN docs}
     */
    stroke: StrokeValue
}
type TableLayoutValue =
    | "table-auto"
    | "table-fixed"
    | "table-auto"
    | "table-fixed"
interface TailwindTableLayout {
    /**
     * `TableLayout`
     *
     * Utilities for controlling the table layout algorithm.
     *
     * @see
     * {@link https://tailwindcss.com/docs/table-layout Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout , MDN docs}
     */
    tableLayout: TableLayoutValue
}
type FontSizeTextLiteral = `text-${FontSizeRef1}`
type FontSizeProperty = FontSizeTextLiteral
type FontSizeArbitraryValue =
    | (`text-(${string})` & {})
    | (`text-[${string}]` & {})
type FontSizeValue =
    | FontSizeProperty
    | (`text-${string}/${Variants1e76e759}` & {})
    | FontSizeArbitraryValue
interface TailwindFontSize {
    /**
     * `FontSize`
     *
     * Utilities for controlling the font size of an element.
     *
     * Arbitrary support
     *
     * `text-(<var-name>)`, `text-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/font-size Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-size , MDN docs}
     */
    fontSize: FontSizeValue
}
type TextWrapTextLiteral = `text-${TextWrapRef1}`
type TextWrapValue = TextWrapTextLiteral
interface TailwindTextWrap {
    /**
     * `TextWrap`
     *
     * Utilities for controlling how text wraps within an element.
     *
     * @see
     * {@link https://tailwindcss.com/docs/text-wrap Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap , MDN docs}
     */
    textWrap: TextWrapValue
}
type TextAlignTextLiteral = `text-${TextAlignRef1}`
type TextAlignValue = TextAlignTextLiteral
interface TailwindTextAlign {
    /**
     * `TextAlign`
     *
     * Utilities for controlling the alignment of text.
     *
     * @see
     * {@link https://tailwindcss.com/docs/text-align Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/text-align , MDN docs}
     */
    textAlign: TextAlignValue
}
type TextOverflowValue =
    | "text-clip"
    | "text-ellipsis"
    | "truncate"
    | "text-clip"
    | "text-ellipsis"
    | "truncate"
interface TailwindTextOverflow {
    /**
     * `TextOverflow`
     *
     * Utilities for controlling how the text of an element overflows.
     *
     * @see
     * {@link https://tailwindcss.com/docs/text-overflow Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow , MDN docs}
     */
    textOverflow: TextOverflowValue
}
type TextShadowAccentLiteral = `text-shadow-accent-${TextShadowRef1}`
type TextShadowChartLiteral = `text-shadow-chart-${TextShadowRef2}`
type TextShadowPrimaryLiteral = `text-shadow-primary-${TextShadowRef3}`
type TextShadowSidebarLiteral = `text-shadow-sidebar-${TextShadowRef4}`
type TextShadowLiteral = `text-shadow-${TextShadowRef5}`
type TextShadowProperty =
    | TextShadowAccentLiteral
    | TextShadowChartLiteral
    | TextShadowPrimaryLiteral
    | TextShadowSidebarLiteral
    | TextShadowLiteral
type TextShadowArbitraryValue =
    | (`text-shadow-(${string})` & {})
    | (`text-shadow-[${string}]` & {})
type TextShadowValue =
    | TextShadowProperty
    | (`text-shadow-accent-${string}/${VariantsA91e8ba1}` & {})
    | (`text-shadow-chart-${string}/${VariantsA91e8ba1}` & {})
    | (`text-shadow-primary-${string}/${VariantsA91e8ba1}` & {})
    | (`text-shadow-sidebar-${string}/${VariantsA91e8ba1}` & {})
    | (`text-shadow-${string}/${VariantsA91e8ba1}` & {})
    | TextShadowArbitraryValue
interface TailwindTextShadow {
    /**
     * `TextShadow`
     *
     * Utilities for controlling the shadow of a text element.
     *
     * Arbitrary support
     *
     * `text-shadow-(<var-name>)`, `text-shadow-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/text-shadow Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow , MDN docs}
     */
    textShadow: TextShadowValue
}
type TouchActionTouchpanLiteral = `touch-pan-${TouchActionRef1}`
type TouchActionTouchLiteral = `touch-${TouchActionRef2}`
type TouchActionValue = TouchActionTouchpanLiteral | TouchActionTouchLiteral
interface TailwindTouchAction {
    /**
     * `TouchAction`
     *
     * Utilities for controlling how an element can be scrolled and zoomed on
     * touchscreens.
     *
     * @see
     * {@link https://tailwindcss.com/docs/touch-action Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action , MDN docs}
     */
    touchAction: TouchActionValue
}
type TransformLiteral = `transform-${TransformRef1}`
type TransformProperty = "transform" | TransformLiteral
type TransformArbitraryValue =
    | (`transform-(${string})` & {})
    | (`transform-[${string}]` & {})
type TransformValue = TransformProperty | TransformArbitraryValue
interface TailwindTransform {
    /**
     * `Transform`
     *
     * Utilities for transforming elements.
     *
     * Arbitrary support
     *
     * `transform-(<var-name>)`, `transform-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/transform Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/transform , MDN docs}
     */
    transform: TransformValue
}
type TransformStyleValue =
    | "transform-3d"
    | "transform-flat"
    | "transform-3d"
    | "transform-flat"
interface TailwindTransformStyle {
    /**
     * `TransformStyle`
     *
     * Utilities for controlling if an elements children are placed in 3D space.
     *
     * @see
     * {@link https://tailwindcss.com/docs/transform-style Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/transform-style , MDN docs}
     */
    transformStyle: TransformStyleValue
}
type TransformBoxTransformLiteral = `transform-${TransformBoxRef1}`
type TransformBoxValue = TransformBoxTransformLiteral
interface TailwindTransformBox {
    /**
     * `TransformBox`
     *
     * @see
     * {@link https://tailwindcss.com/docs Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/transform-box , MDN docs}
     */
    transformBox: TransformBoxValue
}
type TransitionPropertyTransitionLiteral =
    `transition-${TransitionPropertyRef1}`
type TransitionPropertyProperty =
    | "transition"
    | TransitionPropertyTransitionLiteral
type TransitionPropertyArbitraryValue =
    | (`transition-(${string})` & {})
    | (`transition-[${string}]` & {})
type TransitionPropertyValue =
    | TransitionPropertyProperty
    | TransitionPropertyArbitraryValue
interface TailwindTransitionProperty {
    /**
     * `TransitionProperty`
     *
     * Utilities for controlling which CSS properties transition.
     *
     * Arbitrary support
     *
     * `transition-(<var-name>)`, `transition-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/transition-property Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/transition-property , MDN docs}
     */
    transitionProperty: TransitionPropertyValue
}
type TransitionBehaviorValue =
    | "transition-discrete"
    | "transition-normal"
    | "transition-discrete"
    | "transition-normal"
interface TailwindTransitionBehavior {
    /**
     * `TransitionBehavior`
     *
     * Utilities to control the behavior of CSS transitions.
     *
     * @see
     * {@link https://tailwindcss.com/docs/transition-behavior Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior , MDN docs}
     */
    transitionBehavior: TransitionBehaviorValue
}
type WhiteSpacePreLiteral = `whitespace-pre-${WhiteSpaceRef1}`
type WhiteSpaceLiteral = `whitespace-${WhiteSpaceRef2}`
type WhiteSpaceValue = WhiteSpacePreLiteral | WhiteSpaceLiteral
interface TailwindWhiteSpace {
    /**
     * `WhiteSpace`
     *
     * Utilities for controlling an element's white-space property.
     *
     * @see
     * {@link https://tailwindcss.com/docs/white-space Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/white-space , MDN docs}
     */
    whiteSpace: WhiteSpaceValue
}
type WillChangeLiteral = `will-change-${WillChangeRef1}`
type WillChangeProperty = WillChangeLiteral
type WillChangeArbitraryValue =
    | (`will-change-${number}` & {})
    | (`will-change-[${string}]` & {})
type WillChangeValue = WillChangeProperty | WillChangeArbitraryValue
interface TailwindWillChange {
    /**
     * `WillChange`
     *
     * Utilities for optimizing upcoming animations of elements that are expected
     * to change.
     *
     * Arbitrary support
     *
     * `will-change-<number>`, `will-change-[<arbitrary-value>]`
     *
     * @see
     * {@link https://tailwindcss.com/docs/will-change Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/will-change , MDN docs}
     */
    willChange: WillChangeValue
}
type OverflowWrapWrapLiteral = `wrap-${OverflowWrapRef1}`
type OverflowWrapValue = OverflowWrapWrapLiteral
interface TailwindOverflowWrap {
    /**
     * `OverflowWrap`
     *
     * Utilities for controlling line breaks within words in an overflowing
     * element.
     *
     * @see
     * {@link https://tailwindcss.com/docs/overflow-wrap Tailwind docs}
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap , MDN docs}
     */
    overflowWrap: OverflowWrapValue
}
export interface Tailwind
    extends
        TailwindBackgroundImage,
        TailwindBottom,
        TailwindGridColumn,
        TailwindEnd,
        TailwindTextIndent,
        TailwindInset,
        TailwindStart,
        TailwindLeft,
        TailwindMargin,
        TailwindMaskImage,
        TailwindOrder,
        TailwindOutlineOffset,
        TailwindRight,
        TailwindRotate,
        TailwindGridRow,
        TailwindScale,
        TailwindScrollMargin,
        TailwindSkew,
        TailwindCustom,
        TailwindTop,
        TailwindLetterSpacing,
        TailwindTranslate,
        TailwindTextUnderlineOffset,
        TailwindZIndex,
        TailwindContainerType,
        TailwindPosition,
        TailwindAccentColor,
        TailwindVerticalAlign,
        TailwindAnimation,
        TailwindAnimationDuration,
        TailwindFontSmoothing,
        TailwindAppearance,
        TailwindAspectRatio,
        TailwindGridAutoColumns,
        TailwindGridAutoRows,
        TailwindBackdropFilter,
        TailwindBackfaceVisibility,
        TailwindFlexBasis,
        TailwindBackgroundColor,
        TailwindBackgroundSize,
        TailwindBackgroundBlendMode,
        TailwindBackgroundPosition,
        TailwindBackgroundClip,
        TailwindBackgroundAttachment,
        TailwindBackgroundRepeat,
        TailwindBackgroundOrigin,
        TailwindDisplay,
        TailwindBlockSize,
        TailwindFilter,
        TailwindBorderWidth,
        TailwindBorderColor,
        TailwindBorderCollapse,
        TailwindBorderStyle,
        TailwindBorderSpacing,
        TailwindBoxSizing,
        TailwindBoxDecorationBreak,
        TailwindBreakAfter,
        TailwindWordBreak,
        TailwindBreakBefore,
        TailwindBreakInside,
        TailwindTextTransform,
        TailwindCaptionSide,
        TailwindCaretColor,
        TailwindClear,
        TailwindVisibility,
        TailwindColumns,
        TailwindContain,
        TailwindMaxWidth,
        TailwindAlignContent,
        TailwindContent,
        TailwindCursor,
        TailwindTextDecorationThickness,
        TailwindTextDecorationColor,
        TailwindTextDecorationStyle,
        TailwindTransitionDelay,
        TailwindFontVariantNumeric,
        TailwindAnimationDirection,
        TailwindTransitionDuration,
        TailwindTransitionTimingFunction,
        TailwindFieldSizing,
        TailwindFill,
        TailwindFlex,
        TailwindFlexDirection,
        TailwindFlexWrap,
        TailwindFloat,
        TailwindFontWeight,
        TailwindFontFamily,
        TailwindFontStretch,
        TailwindForcedColorAdjust,
        TailwindGap,
        TailwindGridTemplateColumns,
        TailwindGridAutoFlow,
        TailwindGridTemplateRows,
        TailwindFlexGrow,
        TailwindHeight,
        TailwindHyphens,
        TailwindInlineSize,
        TailwindBoxShadow,
        TailwindIsolation,
        TailwindFontStyle,
        TailwindAlignItems,
        TailwindJustifyContent,
        TailwindJustifyItems,
        TailwindJustifySelf,
        TailwindLineHeight,
        TailwindLineClamp,
        TailwindTextDecorationLine,
        TailwindListStyleType,
        TailwindListStyleImage,
        TailwindListStylePosition,
        TailwindMaskComposite,
        TailwindMaskMode,
        TailwindMaskSize,
        TailwindMaskPosition,
        TailwindMaskClip,
        TailwindMaskRepeat,
        TailwindMaskOrigin,
        TailwindMaskType,
        TailwindMaxBlockSize,
        TailwindMaxHeight,
        TailwindMaxInlineSize,
        TailwindMinBlockSize,
        TailwindMinHeight,
        TailwindMinInlineSize,
        TailwindMinWidth,
        TailwindMixBlendMode,
        TailwindObjectPosition,
        TailwindObjectFit,
        TailwindOpacity,
        TailwindTransformOrigin,
        TailwindOutlineWidth,
        TailwindOutlineColor,
        TailwindOutlineStyle,
        TailwindOverflow,
        TailwindOverscrollBehavior,
        TailwindPadding,
        TailwindAnimationPlayState,
        TailwindPerspective,
        TailwindPerspectiveOrigin,
        TailwindPlaceContent,
        TailwindPlaceItems,
        TailwindPlaceSelf,
        TailwindColor,
        TailwindPointerEvents,
        TailwindAnimationIterationCount,
        TailwindResize,
        TailwindBorderRadius,
        TailwindColorScheme,
        TailwindScrollBehavior,
        TailwindScrollPadding,
        TailwindUserSelect,
        TailwindAlignSelf,
        TailwindFlexShrink,
        TailwindWidth,
        TailwindScrollSnapAlign,
        TailwindScrollSnapStop,
        TailwindScrollSnapType,
        TailwindStrokeWidth,
        TailwindStroke,
        TailwindTableLayout,
        TailwindFontSize,
        TailwindTextWrap,
        TailwindTextAlign,
        TailwindTextOverflow,
        TailwindTextShadow,
        TailwindTouchAction,
        TailwindTransform,
        TailwindTransformStyle,
        TailwindTransformBox,
        TailwindTransitionProperty,
        TailwindTransitionBehavior,
        TailwindWhiteSpace,
        TailwindWillChange,
        TailwindOverflowWrap {}
