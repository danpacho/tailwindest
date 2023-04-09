import { wind } from "@/wind"
import "./globals.css"

export const metadata = {
    title: "tailwindest + nextJs",
    description: "example of tailwindest and nextJs",
}

const layout = wind({
    position: "relative",

    display: "flex",
    flexDirection: "flex-col",
    alignItems: "items-center",
    justifyContent: "justify-center",

    height: "h-screen",
    minHeight: "min-h-screen",

    paddingY: "py-10",
    "@dark": {
        backgroundColor: "dark:bg-neutral-900",
    },
}).class()

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={layout}>{children}</body>
        </html>
    )
}
