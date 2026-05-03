import { Node, SourceFile, SyntaxKind } from "ts-morph"
import type { TransformerContext } from "../context"
import type { TransformResult } from "../types"
import type { ClassTransformerWalker } from "../walkers/walker_interface"
import { objectToString } from "../walkers/utils/object_to_string"

export class TransformerRegistry {
    private walkers: ClassTransformerWalker[] = []

    public register(walker: ClassTransformerWalker): void {
        this.walkers.push(walker)
        // Sort by priority descending
        this.walkers.sort((a, b) => b.priority - a.priority)
    }

    public transform(
        sourceFile: SourceFile,
        context: TransformerContext
    ): TransformResult[] {
        const targets: Array<{ node: Node; walker: ClassTransformerWalker }> =
            []

        // Phase 1 - Collect
        sourceFile.forEachDescendant((node) => {
            for (const walker of this.walkers) {
                if (walker.canWalk(node)) {
                    targets.push({ node, walker })
                    break // Only one walker per node
                }
            }
        })

        // Phase 2 - Reverse Execute
        const results: TransformResult[] = []

        // Reverse array to mutate AST from bottom to top
        targets.reverse()

        for (const target of targets) {
            const { node, walker } = target

            if (node.wasForgotten()) {
                context.diagnostics.push({
                    level: "warning",
                    walkerName: walker.name,
                    message:
                        "Node was forgotten during transformation (likely removed or replaced by a parent node's transformation)",
                })
                continue
            }

            try {
                const result = walker.walk(node, context)
                results.push(result)
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : String(error)
                context.diagnostics.push({
                    level: "error",
                    walkerName: walker.name,
                    message: `Walker failed: ${message}`,
                    location: {
                        line: node.getStartLineNumber(),
                        column: node.getStartLinePos(),
                    },
                })
            }
        }

        // Phase 3 - Style Constant Insertion (Intelligent Placement)
        // This MUST happen before Import Finalize to keep statement indices valid.
        const extractedStyles = context.styles.getStyles()
        if (extractedStyles.length > 0) {
            // Group styles by their target statement index
            const groupedStyles = new Map<number, string[]>()

            for (const [name, metadata] of extractedStyles) {
                const { style, targetStatementIndex } = metadata
                const code = `const ${name} = ${context.tailwindestIdentifier}.style(${objectToString(style, 4)});\n\n`

                const existing = groupedStyles.get(targetStatementIndex) ?? []
                existing.push(code)
                groupedStyles.set(targetStatementIndex, existing)
            }

            // Get unique statement indices and sort them DESCENDING (bottom-to-top)
            // to prevent position shifts affecting subsequent insertions.
            const targetIndices = Array.from(groupedStyles.keys()).sort(
                (a, b) => b - a
            )

            for (const index of targetIndices) {
                // Fetch the statement FRESHLY to handle potential invalidation after insertText
                const statement = sourceFile.getStatements()[index]
                if (!statement) continue

                const codes = groupedStyles.get(index)!
                const combinedCode = `\n${codes.join("")}`
                sourceFile.insertText(statement.getStart(), combinedCode)
            }
        }

        // Phase 4 - Import Finalize
        context.imports.applyTo(sourceFile)

        return results
    }
}
