import path from "node:path"

// stored at /.../store
export const STORE_ROOT = path.join(process.cwd(), "$store$")

// site
export const SITE_URL = "https://tailwindcss.com/docs"

export const IGNORED = {
    pages: [
        "installation",
        "compatibility",
        "editor-setup",
        "using-with-preprocessors",
        "optimizing-for-production",
        "browser-support",
        "upgrade-guide",
        "utility-first",
        "hover-focus-and-other-states",
        "responsive-design",
        "dark-mode",
        "reusing-styles",
        "adding-custom-styles",
        "functions-and-directives",
        "configuration",
        "content-configuration",
        "detecting-classes-in-source-files",
        "theme",
        "screens",
        "styling",
        "customizing",
        "colors",
        "plugins",
        "presets",
        "preflight",
    ],

    classes: new Set([
        // From https://tailwindcss.com/docs/container
        "2xl",
        "lg",
        "md",
        "sm",
        "xl",
    ]),
}
