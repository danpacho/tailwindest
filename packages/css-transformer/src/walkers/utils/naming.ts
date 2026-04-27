import { Node, SyntaxKind } from "ts-morph"

/**
 * Finds the name of the nearest enclosing component (function or variable declaration).
 */
export function getEnclosingComponentName(node: Node): string | undefined {
    let current: Node | undefined = node.getParent()

    while (current) {
        // Function component: function MyComponent() {}
        if (Node.isFunctionDeclaration(current)) {
            const name = current.getName()
            if (name && isPascalCase(name)) return name
        }

        // Variable component: const MyComponent = () => {}
        if (Node.isVariableDeclaration(current)) {
            const name = current.getName()
            if (name && isPascalCase(name)) return name
        }

        // Arrow function inside a variable declaration: const MyComponent = React.forwardRef(...)
        if (Node.isVariableStatement(current)) {
            const declarations = current.getDeclarations()
            const name = declarations[0]?.getName()
            if (name && isPascalCase(name)) return name
        }

        current = current.getParent()
    }

    return undefined
}

/**
 * Finds the nearest JSX tag name.
 */
export function getTagName(node: Node): string | undefined {
    let current: Node | undefined = node

    while (current) {
        if (
            Node.isJsxOpeningElement(current) ||
            Node.isJsxSelfClosingElement(current)
        ) {
            const tagName = current.getTagNameNode().getText()
            // Handle member expressions like AccordionPrimitive.Content -> AccordionPrimitiveContent
            return tagName.replace(/\./g, "")
        }

        // If we are inside an attribute, the parent is usually the opening element
        if (Node.isJsxAttribute(current)) {
            const parent = current.getParent()
            if (
                Node.isJsxOpeningElement(parent) ||
                Node.isJsxSelfClosingElement(parent)
            ) {
                const tagName = parent.getTagNameNode().getText()
                return tagName.replace(/\./g, "")
            }
        }

        current = current.getParent()
    }

    return undefined
}

function isPascalCase(str: string): boolean {
    return /^[A-Z][a-zA-Z0-9]*$/.test(str)
}
