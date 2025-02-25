import { describe, expect, it } from "vitest"
import { CSSAnalyzer } from "../css_analyzer"

describe("Property Extraction", () => {
    const css = String.raw
    const analyzer = new CSSAnalyzer()

    it("should extract property record", () => {
        const test = css`
        .\\*\\*\\:\\*\\:dark\\:hover\\:active\\:py-2 {
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
              background: black;
              args: calc(var(--x) + 10);
            }
          }
        }
      }
        `

        const declarations = analyzer.parseStyleDefinition(test)
        expect(declarations).toEqual([
            {
                property: "padding-block",
                selector: ".**:*:dark:hover:active:py-2",
                value: "calc(var(--spacing) * 2)",
            },
            {
                property: "background",
                selector: ".**:*:dark:hover:active:py-2",
                value: "black",
            },
            {
                property: "args",
                selector: ".**:*:dark:hover:active:py-2",
                value: "calc(var(--x) + 10)",
            },
            {
                property: "padding-block",
                selector: ":is(&*)",
                value: "calc(var(--spacing) * 2)",
            },
            {
                property: "background",
                selector: ":is(&*)",
                value: "black",
            },
            {
                property: "args",
                selector: ":is(&*)",
                value: "calc(var(--x) + 10)",
            },
            {
                property: "padding-block",
                selector: ":is(&>*)",
                value: "calc(var(--spacing) * 2)",
            },
            {
                property: "background",
                selector: ":is(&>*)",
                value: "black",
            },
            {
                property: "args",
                selector: ":is(&>*)",
                value: "calc(var(--x) + 10)",
            },
            {
                property: "padding-block",
                selector: "&:hover",
                value: "calc(var(--spacing) * 2)",
            },
            {
                property: "padding-block",
                selector: "&:active",
                value: "calc(var(--spacing) * 2)",
            },
        ])

        const styleBlock = analyzer.parseStyleBlock(test)
        expect(styleBlock).toEqual({
            rootSelector: ".**:*:dark:hover:active:py-2",
            styles: {
                "padding-block": "calc(var(--spacing) * 2)",
                background: "black",
                args: "calc(var(--x) + 10)",
            },
        })
    })
})
