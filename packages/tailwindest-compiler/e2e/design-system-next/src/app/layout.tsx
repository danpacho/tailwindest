import type { ReactNode } from "react"
import "./globals.css"

export const metadata = {
    title: "Tailwindest Design System Next",
}

export default function RootLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
