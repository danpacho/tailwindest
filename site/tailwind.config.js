/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./theme.config.tsx",
    ],
    theme: {
        extend: {
            animation: {
                appear: "appear 1.25s ease",
            },
        },
    },
    plugins: [],
    darkMode: "class",
}
