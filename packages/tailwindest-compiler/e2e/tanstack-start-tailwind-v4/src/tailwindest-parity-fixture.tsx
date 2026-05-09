import { createTools } from "tailwindest"
import type { TailwindNestGroups } from "./tailwind"

type FixtureTailwind = {
    backgroundColor: `bg-red-${string}`
    border: "border"
    borderColor: `border-blue-${string}`
    borderRadius: `rounded-${string}`
    color: `text-${string}`
    padding: `px-${string}`
}

type WithArray<Value extends string> = Value | Value[]

type RawNestedStyle<
    Tailwind extends Record<string, string>,
    NestGroups extends string,
> = {
    [Nest in NestGroups]?: RawNestedStyle<Tailwind, NestGroups>
} & {
    [Property in keyof Tailwind]?: WithArray<Tailwind[Property]>
} & {
    [ArbitraryVariant: `${string}[${string}]`]:
        | RawNestedStyle<Tailwind, NestGroups>
        | undefined
}

type FixtureNestedStyle = RawNestedStyle<FixtureTailwind, TailwindNestGroups>

type FixtureTailwindLiteral = FixtureTailwind[keyof FixtureTailwind]

type FixtureTailwindest = {
    tailwindest: FixtureNestedStyle
    tailwindLiteral: FixtureTailwindLiteral
    useArbitrary: false
    useTypedClassLiteral: true
}

const tw = createTools<FixtureTailwindest>()

const compiledClassName = tw
    .style({
        dark: {
            backgroundColor: "bg-red-900",
            hover: {
                backgroundColor: "bg-red-950",
                focus: { color: "text-white" },
            },
        },
        group: { hover: { borderColor: "border-blue-500" } },
        peer: { focus: { color: "text-sky-600" } },
        "data-open": { padding: "px-6" },
        backgroundColor: "bg-red-50",
        border: "border",
        borderRadius: "rounded-md",
        color: "text-slate-900",
        padding: "px-4",
    })
    .class()

export function TailwindestParityFixture() {
    return (
        <main data-testid="twroot" className="p-4">
            <section data-testid="twgroup" className="group">
                <input
                    data-testid="twpeer"
                    aria-label="Peer focus control"
                    className="peer"
                />
                <button
                    data-testid="twtarget"
                    data-state="open"
                    className={compiledClassName}
                    type="button"
                >
                    Tailwindest parity target
                </button>
            </section>
        </main>
    )
}
