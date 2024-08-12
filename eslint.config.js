// eslint.config.js
import js from "@eslint/js"
import typescript from "@typescript-eslint/eslint-plugin"
import typescriptParser from "@typescript-eslint/parser"
import importPlugin from "eslint-plugin-import"
import prettier from "eslint-plugin-prettier"

/**
 * @type {import("eslint").Linter.Config}
 */
export default [
    {
        name: "tailwindest-files",
        ignores: ["**/*.js", "site/*", "examples/*", "dist/*"],
    },
    js.configs.recommended,
    {
        name: "tailwindest-eslint",
        languageOptions: {
            parser: typescriptParser,
            ecmaVersion: "latest",
        },
        plugins: {
            prettier,
            import: importPlugin,
            "@typescript-eslint": typescript,
        },
        rules: {
            eqeqeq: "error",
            "no-var": "error",
            "prefer-const": "error",
            "no-console": "warn",
            "prettier/prettier": ["error", { endOfLine: "auto" }],
            "import/order": [
                "error",
                {
                    alphabetize: { order: "asc", caseInsensitive: true },
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                        "object",
                    ],
                    "newlines-between": "never",
                    pathGroupsExcludedImportTypes: ["builtin"],
                },
            ],
            "sort-imports": [
                "error",
                {
                    ignoreDeclarationSort: true,
                },
            ],
        },
        settings: {
            "import/resolver": {
                node: {
                    extensions: [".js", ".ts"],
                },
            },
        },
    },
]
