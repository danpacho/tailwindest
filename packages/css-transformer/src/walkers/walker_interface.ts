import type { Node } from "ts-morph"
import type { TransformerContext } from "../context"
import type { TransformResult } from "../types"

export interface ClassTransformerWalker {
    /**
     * Higher priority walkers are executed first (higher number = higher priority).
     * For example, Priority 30 will run before Priority 10.
     */
    readonly priority: number

    /**
     * Name of the walker, used for diagnostics
     */
    readonly name: string

    /**
     * Check if this walker can process the given node
     */
    canWalk(node: Node): boolean

    /**
     * Transform the node. Returns the transform result.
     * Note: Walk() will be executed in reverse order of the nodes found,
     * so it's safe to mutate the AST.
     */
    walk(node: Node, context: TransformerContext): TransformResult
}
