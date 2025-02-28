import { describe, it, expect, beforeAll } from "vitest"
import { ClassEntry, TailwindCompiler, VariantEntry } from "./compiler"
import { CSSAnalyzer } from "../generator/css_analyzer"

describe("TailwindCompiler - Internal", () => {
    let compiler: TailwindCompiler
    beforeAll(async () => {
        compiler = new TailwindCompiler({
            cssRoot: `${__dirname}/__mocks__/tailwind.css`,
            base: "packages/create-tailwind-type/node_modules/@tailwindcss",
        })
    })

    it("should get design systems", async () => {
        const ds = await compiler.getDesignSystem()
        expect(ds).toBeDefined()
    })

    it("should get possible classLists", async () => {
        const ds = await compiler.getDesignSystem()
        const possible: Array<ClassEntry> = ds.getClassList()
        const classes = possible.map((e) => e[0])
        expect(classes).toMatchSnapshot()
    })

    it("should get possible classVariants", async () => {
        const ds = await compiler.getDesignSystem()
        const possibleVariants: Array<VariantEntry> = ds.getVariants()

        const fullVariants = possibleVariants
            .map((e) => {
                const merged = e.values.map(
                    (value) => `${e.name}${e.hasDash ? "-" : ""}${value}`
                )
                const arbitrary = `\`${e.name}${e.hasDash ? "-" : ""}[$\{string}]\``
                if (e.isArbitrary) {
                    merged.push(arbitrary)
                }
                return merged
            })
            .flat()

        expect(fullVariants.map((e) => e)).toMatchInlineSnapshot(`
          [
            "not-not",
            "not-group",
            "not-peer",
            "not-first",
            "not-last",
            "not-only",
            "not-odd",
            "not-even",
            "not-first-of-type",
            "not-last-of-type",
            "not-only-of-type",
            "not-visited",
            "not-target",
            "not-open",
            "not-default",
            "not-checked",
            "not-indeterminate",
            "not-placeholder-shown",
            "not-autofill",
            "not-optional",
            "not-required",
            "not-valid",
            "not-invalid",
            "not-in-range",
            "not-out-of-range",
            "not-read-only",
            "not-empty",
            "not-focus-within",
            "not-hover",
            "not-focus",
            "not-focus-visible",
            "not-active",
            "not-enabled",
            "not-disabled",
            "not-inert",
            "not-in",
            "not-has",
            "not-aria",
            "not-data",
            "not-nth",
            "not-nth-last",
            "not-nth-of-type",
            "not-nth-last-of-type",
            "not-supports",
            "not-motion-safe",
            "not-motion-reduce",
            "not-contrast-more",
            "not-contrast-less",
            "not-max",
            "not-sm",
            "not-md",
            "not-lg",
            "not-xl",
            "not-2xl",
            "not-min",
            "not-@max",
            "not-@",
            "not-@min",
            "not-portrait",
            "not-landscape",
            "not-ltr",
            "not-rtl",
            "not-dark",
            "not-print",
            "not-forced-colors",
            "\`not-[\${string}]\`",
            "group-not",
            "group-group",
            "group-peer",
            "group-first",
            "group-last",
            "group-only",
            "group-odd",
            "group-even",
            "group-first-of-type",
            "group-last-of-type",
            "group-only-of-type",
            "group-visited",
            "group-target",
            "group-open",
            "group-default",
            "group-checked",
            "group-indeterminate",
            "group-placeholder-shown",
            "group-autofill",
            "group-optional",
            "group-required",
            "group-valid",
            "group-invalid",
            "group-in-range",
            "group-out-of-range",
            "group-read-only",
            "group-empty",
            "group-focus-within",
            "group-hover",
            "group-focus",
            "group-focus-visible",
            "group-active",
            "group-enabled",
            "group-disabled",
            "group-inert",
            "group-in",
            "group-has",
            "group-aria",
            "group-data",
            "group-nth",
            "group-nth-last",
            "group-nth-of-type",
            "group-nth-last-of-type",
            "group-ltr",
            "group-rtl",
            "\`group-[\${string}]\`",
            "peer-not",
            "peer-group",
            "peer-peer",
            "peer-first",
            "peer-last",
            "peer-only",
            "peer-odd",
            "peer-even",
            "peer-first-of-type",
            "peer-last-of-type",
            "peer-only-of-type",
            "peer-visited",
            "peer-target",
            "peer-open",
            "peer-default",
            "peer-checked",
            "peer-indeterminate",
            "peer-placeholder-shown",
            "peer-autofill",
            "peer-optional",
            "peer-required",
            "peer-valid",
            "peer-invalid",
            "peer-in-range",
            "peer-out-of-range",
            "peer-read-only",
            "peer-empty",
            "peer-focus-within",
            "peer-hover",
            "peer-focus",
            "peer-focus-visible",
            "peer-active",
            "peer-enabled",
            "peer-disabled",
            "peer-inert",
            "peer-in",
            "peer-has",
            "peer-aria",
            "peer-data",
            "peer-nth",
            "peer-nth-last",
            "peer-nth-of-type",
            "peer-nth-last-of-type",
            "peer-ltr",
            "peer-rtl",
            "\`peer-[\${string}]\`",
            "in-not",
            "in-group",
            "in-peer",
            "in-first",
            "in-last",
            "in-only",
            "in-odd",
            "in-even",
            "in-first-of-type",
            "in-last-of-type",
            "in-only-of-type",
            "in-visited",
            "in-target",
            "in-open",
            "in-default",
            "in-checked",
            "in-indeterminate",
            "in-placeholder-shown",
            "in-autofill",
            "in-optional",
            "in-required",
            "in-valid",
            "in-invalid",
            "in-in-range",
            "in-out-of-range",
            "in-read-only",
            "in-empty",
            "in-focus-within",
            "in-hover",
            "in-focus",
            "in-focus-visible",
            "in-active",
            "in-enabled",
            "in-disabled",
            "in-inert",
            "in-in",
            "in-has",
            "in-aria",
            "in-data",
            "in-nth",
            "in-nth-last",
            "in-nth-of-type",
            "in-nth-last-of-type",
            "in-ltr",
            "in-rtl",
            "\`in-[\${string}]\`",
            "has-not",
            "has-group",
            "has-peer",
            "has-first",
            "has-last",
            "has-only",
            "has-odd",
            "has-even",
            "has-first-of-type",
            "has-last-of-type",
            "has-only-of-type",
            "has-visited",
            "has-target",
            "has-open",
            "has-default",
            "has-checked",
            "has-indeterminate",
            "has-placeholder-shown",
            "has-autofill",
            "has-optional",
            "has-required",
            "has-valid",
            "has-invalid",
            "has-in-range",
            "has-out-of-range",
            "has-read-only",
            "has-empty",
            "has-focus-within",
            "has-hover",
            "has-focus",
            "has-focus-visible",
            "has-active",
            "has-enabled",
            "has-disabled",
            "has-inert",
            "has-in",
            "has-has",
            "has-aria",
            "has-data",
            "has-nth",
            "has-nth-last",
            "has-nth-of-type",
            "has-nth-last-of-type",
            "has-ltr",
            "has-rtl",
            "\`has-[\${string}]\`",
            "aria-busy",
            "aria-checked",
            "aria-disabled",
            "aria-expanded",
            "aria-hidden",
            "aria-pressed",
            "aria-readonly",
            "aria-required",
            "aria-selected",
            "\`aria-[\${string}]\`",
            "\`data-[\${string}]\`",
            "\`nth-[\${string}]\`",
            "\`nth-last-[\${string}]\`",
            "\`nth-of-type-[\${string}]\`",
            "\`nth-last-of-type-[\${string}]\`",
            "\`supports-[\${string}]\`",
            "max-sm",
            "max-md",
            "max-lg",
            "max-xl",
            "max-2xl",
            "\`max-[\${string}]\`",
            "min-sm",
            "min-md",
            "min-lg",
            "min-xl",
            "min-2xl",
            "\`min-[\${string}]\`",
            "@max-3xs",
            "@max-2xs",
            "@max-xs",
            "@max-sm",
            "@max-md",
            "@max-lg",
            "@max-xl",
            "@max-2xl",
            "@max-3xl",
            "@max-4xl",
            "@max-5xl",
            "@max-6xl",
            "@max-7xl",
            "\`@max-[\${string}]\`",
            "@3xs",
            "@2xs",
            "@xs",
            "@sm",
            "@md",
            "@lg",
            "@xl",
            "@2xl",
            "@3xl",
            "@4xl",
            "@5xl",
            "@6xl",
            "@7xl",
            "\`@[\${string}]\`",
            "@min-3xs",
            "@min-2xs",
            "@min-xs",
            "@min-sm",
            "@min-md",
            "@min-lg",
            "@min-xl",
            "@min-2xl",
            "@min-3xl",
            "@min-4xl",
            "@min-5xl",
            "@min-6xl",
            "@min-7xl",
            "\`@min-[\${string}]\`",
          ]
        `)
    })

    it("should get css from tw properties", async () => {
        const ds = await compiler.getDesignSystem()
        const css = ds.candidatesToCss([
            "bg-red-100",
            "bg-red-200",
            "dark:bg-red-700",
            "**:*:dark:hover:active:py-2",
            "**:*:dark:hover:active:px-2",
        ])
        expect(css).toMatchInlineSnapshot(`
          [
            ".bg-red-100 {
            background-color: var(--color-red-100);
          }
          ",
            ".bg-red-200 {
            background-color: var(--color-red-200);
          }
          ",
            ".dark\\:bg-red-700 {
            @media (prefers-color-scheme: dark) {
              background-color: var(--color-red-700);
            }
          }
          ",
            ".\\*\\*\\:\\*\\:dark\\:hover\\:active\\:py-2 {
            :is(& *) {
              :is(& > *) {
                @media (prefers-color-scheme: dark) {
                  &:hover {
                    @media (hover: hover) {
                      &:active {
                        padding-block: calc(var(--spacing) * 2);
                      }
                    }
                  }
                }
              }
            }
          }
          ",
            ".\\*\\*\\:\\*\\:dark\\:hover\\:active\\:px-2 {
            :is(& *) {
              :is(& > *) {
                @media (prefers-color-scheme: dark) {
                  &:hover {
                    @media (hover: hover) {
                      &:active {
                        padding-inline: calc(var(--spacing) * 2);
                      }
                    }
                  }
                }
              }
            }
          }
          ",
          ]
        `)
    })

    it("should get css from tw", async () => {
        const ds = await compiler.getDesignSystem()
        const theme = ds.theme
        expect(theme).toBeDefined()
    })

    it("should compile tailwind attributes into CSS raw string", async () => {
        const tokens: Array<string> = ["bg-red-100", "px-2", "opacity-50"]
        const compiled = await compiler.compileCss(tokens, { minify: false })

        expect(compiled).toMatchInlineSnapshot(`
          "/*! tailwindcss v4.0.9 | MIT License | https://tailwindcss.com */
          @layer theme, base, components, utilities;
          @layer theme {
            :root, :host {
              --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
                "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
              --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
                "Courier New", monospace;
              --color-red-100: oklch(0.936 0.032 17.717);
              --spacing: 0.25rem;
              --default-font-family: var(--font-sans);
              --default-font-feature-settings: var(--font-sans--font-feature-settings);
              --default-font-variation-settings: var(
                --font-sans--font-variation-settings
              );
              --default-mono-font-family: var(--font-mono);
              --default-mono-font-feature-settings: var(
                --font-mono--font-feature-settings
              );
              --default-mono-font-variation-settings: var(
                --font-mono--font-variation-settings
              );
            }
          }
          @layer base {
            *, ::after, ::before, ::backdrop, ::file-selector-button {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              border: 0 solid;
            }
            html, :host {
              line-height: 1.5;
              -webkit-text-size-adjust: 100%;
              tab-size: 4;
              font-family: var( --default-font-family, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" );
              font-feature-settings: var(--default-font-feature-settings, normal);
              font-variation-settings: var( --default-font-variation-settings, normal );
              -webkit-tap-highlight-color: transparent;
            }
            body {
              line-height: inherit;
            }
            hr {
              height: 0;
              color: inherit;
              border-top-width: 1px;
            }
            abbr:where([title]) {
              -webkit-text-decoration: underline dotted;
              text-decoration: underline dotted;
            }
            h1, h2, h3, h4, h5, h6 {
              font-size: inherit;
              font-weight: inherit;
            }
            a {
              color: inherit;
              -webkit-text-decoration: inherit;
              text-decoration: inherit;
            }
            b, strong {
              font-weight: bolder;
            }
            code, kbd, samp, pre {
              font-family: var( --default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace );
              font-feature-settings: var( --default-mono-font-feature-settings, normal );
              font-variation-settings: var( --default-mono-font-variation-settings, normal );
              font-size: 1em;
            }
            small {
              font-size: 80%;
            }
            sub, sup {
              font-size: 75%;
              line-height: 0;
              position: relative;
              vertical-align: baseline;
            }
            sub {
              bottom: -0.25em;
            }
            sup {
              top: -0.5em;
            }
            table {
              text-indent: 0;
              border-color: inherit;
              border-collapse: collapse;
            }
            :-moz-focusring {
              outline: auto;
            }
            progress {
              vertical-align: baseline;
            }
            summary {
              display: list-item;
            }
            ol, ul, menu {
              list-style: none;
            }
            img, svg, video, canvas, audio, iframe, embed, object {
              display: block;
              vertical-align: middle;
            }
            img, video {
              max-width: 100%;
              height: auto;
            }
            button, input, select, optgroup, textarea, ::file-selector-button {
              font: inherit;
              font-feature-settings: inherit;
              font-variation-settings: inherit;
              letter-spacing: inherit;
              color: inherit;
              border-radius: 0;
              background-color: transparent;
              opacity: 1;
            }
            :where(select:is([multiple], [size])) optgroup {
              font-weight: bolder;
            }
            :where(select:is([multiple], [size])) optgroup option {
              padding-inline-start: 20px;
            }
            ::file-selector-button {
              margin-inline-end: 4px;
            }
            ::placeholder {
              opacity: 1;
              color: color-mix(in oklab, currentColor 50%, transparent);
            }
            textarea {
              resize: vertical;
            }
            ::-webkit-search-decoration {
              -webkit-appearance: none;
            }
            ::-webkit-date-and-time-value {
              min-height: 1lh;
              text-align: inherit;
            }
            ::-webkit-datetime-edit {
              display: inline-flex;
            }
            ::-webkit-datetime-edit-fields-wrapper {
              padding: 0;
            }
            ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datetime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-datetime-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-datetime-edit-meridiem-field {
              padding-block: 0;
            }
            :-moz-ui-invalid {
              box-shadow: none;
            }
            button, input:where([type="button"], [type="reset"], [type="submit"]), ::file-selector-button {
              appearance: button;
            }
            ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
              height: auto;
            }
            [hidden]:where(:not([hidden="until-found"])) {
              display: none !important;
            }
          }
          @layer utilities {
            .bg-red-100 {
              background-color: var(--color-red-100);
            }
            .px-2 {
              padding-inline: calc(var(--spacing) * 2);
            }
            .opacity-50 {
              opacity: 50%;
            }
          }
          "
        `)
    })

    it("should parse all css defined in tailwind :: postcss", async () => {
        const ds = await compiler.getDesignSystem()
        const analyzer = new CSSAnalyzer()

        const possible = ds.getClassList()
        const failedCases: Array<[string, string]> = []
        for (const e of possible) {
            const [cls] = e as ClassEntry
            const css = ds.candidatesToCss([cls])

            if (css[0]) {
                try {
                    analyzer.parseStyleDefinition(css[0])
                    const res = analyzer.parseStyleBlock(css[0])
                } catch (e) {
                    failedCases.push([cls, css[0]])
                }
            }
        }

        expect(failedCases.length).toBe(0)
    })
})
