"use client"

import { useState } from "react"
import { wind, wind$ } from "tailwindest"
import { ThemeButton } from "@/components"

const header = wind({
    fontSize: "text-3xl",
    fontWeight: "font-bold",
    color: "text-neutral-900",
    "@dark": {
        color: "dark:text-neutral-100",
    },
}).class()

const button = wind$("plus", "minus")(
    {
        display: "flex",
        alignItems: "items-center",
        justifyContent: "justify-center",
        padding: "p-2",
        borderRadius: "rounded-md",
        backgroundColor: "bg-white",
        "@dark": {
            backgroundColor: "dark:bg-neutral-900",
        },
        borderWidth: "border",
        borderBottomWidth: "border-b-4",
        ":hover": {
            borderBottomWidth: "hover:border-b-[3px]",
        },
        ":active": {
            opacity: "active:opacity-50",
            transformScale: "active:scale-95",
            transformTranslateY: "active:translate-y-0.5",
            borderBottomWidth: "active:border-b-[2.5px]",
        },

        transition: "transition",
        transitionDuration: "duration-75",
    },
    {
        minus: {
            color: "text-blue-700",
            borderColor: "border-blue-700",
            "@dark": {
                color: "dark:text-blue-300",
                borderColor: "dark:border-blue-300",
                ":hover": {
                    color: "dark:hover:text-blue-700",
                    backgroundColor: "dark:hover:bg-blue-300",
                    borderColor: "dark:hover:border-blue-700",
                },
            },
        },
        plus: {
            color: "text-green-700",
            borderColor: "border-green-700",
            "@dark": {
                color: "dark:text-green-300",
                borderColor: "dark:border-green-300",
                ":hover": {
                    color: "dark:hover:text-green-700",
                    backgroundColor: "dark:hover:bg-green-300",
                    borderColor: "dark:hover:border-green-700",
                },
            },
        },
    }
)

export default function CounterExample() {
    const [count, setCount] = useState(0)

    return (
        <>
            <ThemeButton />

            <h1 className={header}>Counter: {count}</h1>
            <div className="h-10" />

            <div className="flex flex-row gap-2 items-center justify-between">
                <button
                    type="button"
                    className={button.class("minus")}
                    onClick={() => setCount((c) => c - 1)}
                >
                    Minus
                </button>
                <button
                    type="button"
                    className={button.class("plus")}
                    onClick={() => setCount((c) => c + 1)}
                >
                    Plus
                </button>
            </div>
        </>
    )
}

export { CounterExample }
