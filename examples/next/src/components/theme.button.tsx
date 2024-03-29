"use client"

import { tw } from "@/tw"
import { useEffect, useState } from "react"

const themeButton = tw.toggle({
    base: {
        position: "absolute",
        top: "top-4",
        right: "right-4",

        display: "flex",
        alignItems: "items-center",
        justifyContent: "justify-center",
        paddingX: "px-2",
        paddingY: "py-1",
        borderBottomWidth: "border-b",
        borderColor: "border-transparent",
        backgroundColor: "bg-transparent",
        ":hover": {
            opacity: "hover:opacity-75",
        },
        transition: "transition",
    },
    truthy: {
        color: "text-white",
        ":hover": {
            borderColor: "hover:border-gray-200",
        },
    },
    falsy: {
        color: "text-black",
        ":hover": {
            borderColor: "hover:border-gray-800",
        },
    },
})

const ThemeButton = () => {
    const [isDark, setIsDark] = useState(true)

    useEffect(() => {
        setIsDark(window?.matchMedia("(prefers-color-scheme: dark)").matches)
    }, [])

    useEffect(() => {
        window.document.documentElement.classList.remove(
            isDark ? "light" : "dark"
        )
        window.document.documentElement.classList.add(isDark ? "dark" : "light")
    }, [isDark])

    return (
        <button
            type="button"
            className={themeButton.class(isDark)}
            onClick={() => setIsDark((mode) => !mode)}
        >
            {isDark ? "dark" : "light"}
        </button>
    )
}

export { ThemeButton }
