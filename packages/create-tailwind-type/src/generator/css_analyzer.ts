import postcss, { Root, Rule, Declaration, ChildNode } from "postcss"

export interface StyleDefinition {
    selector: string
    property: string
    value: string
}

export type StyleSheet = Record<string, string>
export interface StyleBlock {
    /**
     * Root selector of current css
     */
    rootSelector: string
    /**
     * Property-Value map
     */
    styles: StyleSheet
}

type DeclPurifier = (decl: string) => string
export class CSSAnalyzer {
    private static defaultDeclPurifier: DeclPurifier = (decl) => {
        return decl.replaceAll(/[\\\s]+/g, "")
    }
    private _declPurifier: DeclPurifier
    public declPurifier(decl: string): string {
        if (this.usePureDecl) return decl
        return this._declPurifier(decl)
    }
    public readonly usePureDecl: boolean = false
    public constructor(
        opts: {
            usePureDecl?: boolean
            declPurifier?: (decl: string) => string
        } = {
            usePureDecl: false,
        }
    ) {
        this._declPurifier =
            opts?.declPurifier ?? CSSAnalyzer.defaultDeclPurifier
    }

    /**
     * Parse raw css (`postcss`)
     * @returns css AST Root node
     */
    public parseCSS(cssString: string): Root {
        const root: Root = postcss.parse(cssString)
        return root
    }

    /**
     * Parse css style definitions, all selectors.
     */
    public parseStyleDefinition(cssString: string): Array<StyleDefinition> {
        const root = this.parseCSS(cssString)

        const results: Array<StyleDefinition> = []

        root.walkRules((rule: Rule) => {
            const currentSelector = this.declPurifier(rule.selector) || ""

            rule.walkDecls((decl: Declaration) => {
                results.push({
                    selector: currentSelector,
                    property: decl.prop,
                    value: decl.value,
                })
            })
        })

        return results
    }

    /**
     * Parse css block style, root node and styles
     */
    public parseStyleBlock(css: string): StyleBlock | null {
        const root = this.parseCSS(css)

        let topRule: Rule | null = null
        for (const node of root.nodes) {
            if (node.type === "rule") {
                topRule = node as Rule
                break
            }
        }

        if (!topRule) return null

        const styles: StyleSheet = {}
        if (Array.isArray(topRule.nodes)) {
            for (const child of topRule.nodes) {
                this.collectDeclarationsRecursively(child, styles)
            }
        }

        return {
            rootSelector: this.declPurifier(topRule.selector),
            styles,
        }
    }

    private collectDeclarationsRecursively(
        node: ChildNode,
        styles: StyleSheet
    ): void {
        if (node.type === "decl") {
            const declarationNode = node as Declaration
            styles[declarationNode.prop] = declarationNode.value
            // collect styles
        } else if (node.type === "rule" || node.type === "atrule") {
            if ("nodes" in node && Array.isArray(node.nodes)) {
                for (const child of node.nodes) {
                    this.collectDeclarationsRecursively(child, styles)
                    // visit child node
                }
            }
        }
    }
}
