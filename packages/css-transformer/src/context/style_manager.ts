import { Node } from "ts-morph"

export class StyleManager {
    /**
     * Maps a serialized style object to an already generated identifier name.
     */
    private styleToName = new Map<string, string>()

    /**
     * Tracks how many times a base name (componentTag) has been used.
     */
    private nameToCount = new Map<string, number>()

    /**
     * Stores style metadata including the content, target statement index for insertion,
     * and its position in the file.
     */
    private extractedStyles = new Map<
        string,
        {
            style: Record<string, any>
            targetStatementIndex: number
            pos: number
        }
    >()

    /**
     * Registers a style object for extraction or returns an existing identifier.
     *
     * @param style The resolved CSS property object.
     * @param node The node where the style is used (to find the insertion point).
     * @param component The name of the enclosing component (default: "Global").
     * @param tag The HTML tag name (default: "Div").
     * @returns The unique identifier for the style constant.
     */
    public getOrRegister(
        style: Record<string, any>,
        node: Node,
        component: string = "Global",
        tag: string = "Div"
    ): string {
        // Serialize style object deterministically to handle deduplication
        const serialized = JSON.stringify(style, Object.keys(style).sort())

        const targetStatement = this.getTopLevelStatement(node)
        const targetStatementIndex = targetStatement.getChildIndex()
        const pos = targetStatement.getStart()

        if (this.styleToName.has(serialized)) {
            const existingName = this.styleToName.get(serialized)!
            const metadata = this.extractedStyles.get(existingName)!

            // Hoisting safety: Always use the earliest occurrence as the insertion point
            if (pos < metadata.pos) {
                metadata.targetStatementIndex = targetStatementIndex
                metadata.pos = pos
            }
            return existingName
        }

        // Generate base name: [component][Tag] (camelCase)
        const normalizedComponent =
            component.charAt(0).toLowerCase() + component.slice(1)
        const normalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1)
        const baseName = `${normalizedComponent}${normalizedTag}`

        // Resolve unique name with index if collision occurs
        const currentCount = this.nameToCount.get(baseName) ?? 0
        const uniqueName =
            currentCount === 0 ? baseName : `${baseName}${currentCount + 1}`

        // Update tracking maps
        this.nameToCount.set(baseName, currentCount + 1)
        this.styleToName.set(serialized, uniqueName)
        this.extractedStyles.set(uniqueName, {
            style,
            targetStatementIndex,
            pos,
        })

        return uniqueName
    }

    /**
     * Returns all extracted styles.
     */
    public getStyles() {
        return Array.from(this.extractedStyles.entries())
    }

    /**
     * Finds the nearest statement that is a direct child of the SourceFile.
     */
    private getTopLevelStatement(node: Node): Node {
        let current = node
        while (
            current.getParent() &&
            !Node.isSourceFile(current.getParent()!)
        ) {
            current = current.getParent()!
        }
        return current
    }
}
