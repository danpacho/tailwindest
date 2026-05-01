import * as ts from "typescript"

export function collectMutatedBindingNames(
    sourceFile: ts.SourceFile,
    ignoredCallSpans?: ReadonlySet<string>
): Set<string> {
    const names = new Set<string>()
    const referenceMutations = new Set<string>()
    const aliasRoots = collectAliasRoots(sourceFile)
    const referenceLikeBindings = collectReferenceLikeBindingNames(sourceFile)

    const recordMutation = (root: string | undefined, propagates: boolean) => {
        if (!root) return
        names.add(root)
        if (propagates) {
            referenceMutations.add(root)
        }
    }

    const visit = (node: ts.Node): void => {
        if (
            ts.isBinaryExpression(node) &&
            isAssignmentOperator(node.operatorToken.kind)
        ) {
            recordMutation(
                getAssignmentRoot(node.left),
                !ts.isIdentifier(unwrapExpression(node.left))
            )
        } else if (
            ts.isPrefixUnaryExpression(node) ||
            ts.isPostfixUnaryExpression(node)
        ) {
            recordMutation(
                getAssignmentRoot(node.operand),
                !ts.isIdentifier(unwrapExpression(node.operand))
            )
        } else if (ts.isCallExpression(node)) {
            for (const root of getReferenceMutationRootsFromCall(
                node,
                sourceFile,
                referenceLikeBindings,
                ignoredCallSpans
            )) {
                recordMutation(root, true)
            }
        }

        ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    propagateAliasMutations(names, referenceMutations, aliasRoots)
    return names
}

export function findLexicalBinding(
    sourceFile: ts.SourceFile,
    name: string,
    position: number
): ts.Node | undefined {
    let result: ts.Node | undefined
    let resultScopeSize = Number.POSITIVE_INFINITY
    let resultStart = Number.POSITIVE_INFINITY

    const consider = (binding: ts.Node): void => {
        const scope = bindingScope(sourceFile, binding)
        if (!scope || !scopeContains(sourceFile, scope, position)) {
            return
        }
        const scopeSize = scope.getEnd() - scope.getStart(sourceFile)
        const bindingStart = binding.getStart(sourceFile)
        if (
            scopeSize < resultScopeSize ||
            (scopeSize === resultScopeSize && bindingStart < resultStart)
        ) {
            result = binding
            resultScopeSize = scopeSize
            resultStart = bindingStart
        }
    }

    const visit = (node: ts.Node): void => {
        if (
            ts.isVariableDeclaration(node) &&
            ts.isIdentifier(node.name) &&
            node.name.text === name
        ) {
            consider(node)
        } else if (
            ts.isBindingElement(node) &&
            ts.isIdentifier(node.name) &&
            node.name.text === name
        ) {
            consider(node)
        } else if (
            ts.isParameter(node) &&
            ts.isIdentifier(node.name) &&
            node.name.text === name
        ) {
            consider(node)
        } else if (
            (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) &&
            node.name?.text === name
        ) {
            consider(node)
        }

        ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    return result
}

export function findVisibleVariableDeclaration(
    sourceFile: ts.SourceFile,
    name: string,
    position: number
): ts.VariableDeclaration | undefined {
    let result: ts.VariableDeclaration | undefined
    let resultStart = -1

    const visit = (node: ts.Node): void => {
        if (node.getStart(sourceFile) >= position) {
            return
        }

        if (
            ts.isVariableDeclaration(node) &&
            ts.isIdentifier(node.name) &&
            node.name.text === name &&
            node.getStart(sourceFile) > resultStart &&
            declarationScopeContains(sourceFile, node, position)
        ) {
            result = node
            resultStart = node.getStart(sourceFile)
        }

        ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    return result
}

export function isBindingDeclaredBeforeUse(
    sourceFile: ts.SourceFile,
    binding: ts.Node,
    position: number
): boolean {
    return binding.getStart(sourceFile) < position
}

function collectAliasRoots(sourceFile: ts.SourceFile): Map<string, string> {
    const aliases = new Map<string, string>()

    const visit = (node: ts.Node): void => {
        if (
            ts.isVariableDeclaration(node) &&
            ts.isIdentifier(node.name) &&
            node.initializer
        ) {
            const root = getAccessRoot(node.initializer)
            if (root && root !== node.name.text) {
                aliases.set(node.name.text, root)
            }
        }
        ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    return aliases
}

function collectReferenceLikeBindingNames(
    sourceFile: ts.SourceFile
): Set<string> {
    const names = new Set<string>()
    const pending: Array<{ name: string; initializer: ts.Expression }> = []

    const visit = (node: ts.Node): void => {
        if (ts.isImportDeclaration(node) && node.importClause) {
            const clause = node.importClause
            if (clause.name) {
                names.add(clause.name.text)
            }
            const namedBindings = clause.namedBindings
            if (namedBindings && ts.isNamedImports(namedBindings)) {
                for (const element of namedBindings.elements) {
                    names.add(element.name.text)
                }
            } else if (namedBindings && ts.isNamespaceImport(namedBindings)) {
                names.add(namedBindings.name.text)
            }
        } else if (
            ts.isVariableDeclaration(node) &&
            ts.isIdentifier(node.name) &&
            node.initializer
        ) {
            const initializer = unwrapExpression(node.initializer)
            if (
                ts.isObjectLiteralExpression(initializer) ||
                ts.isArrayLiteralExpression(initializer)
            ) {
                names.add(node.name.text)
            } else {
                pending.push({ name: node.name.text, initializer })
            }
        }
        ts.forEachChild(node, visit)
    }

    visit(sourceFile)

    let changed = true
    while (changed) {
        changed = false
        for (const item of pending) {
            if (names.has(item.name)) {
                continue
            }
            const root = getAccessRoot(item.initializer)
            if (root && names.has(root)) {
                names.add(item.name)
                changed = true
            }
        }
    }

    return names
}

function propagateAliasMutations(
    names: Set<string>,
    referenceMutations: Set<string>,
    aliasRoots: Map<string, string>
): void {
    const queue = [...referenceMutations]
    for (let index = 0; index < queue.length; index += 1) {
        const root = aliasRoots.get(queue[index]!)
        if (root && !names.has(root)) {
            names.add(root)
            queue.push(root)
        }
    }
}

function getReferenceMutationRootsFromCall(
    node: ts.CallExpression,
    sourceFile: ts.SourceFile,
    referenceLikeBindings: Set<string>,
    ignoredCallSpans: ReadonlySet<string> | undefined
): string[] {
    const expression = node.expression
    if (ts.isPropertyAccessExpression(expression)) {
        if (
            ts.isIdentifier(expression.expression) &&
            expression.expression.text === "Object" &&
            (expression.name.text === "assign" ||
                expression.name.text === "defineProperty" ||
                expression.name.text === "defineProperties")
        ) {
            const first = node.arguments[0]
            const root = first ? getAssignmentRoot(first) : undefined
            return root ? [root] : []
        }
        if (mutatingMethodNames.has(expression.name.text)) {
            const root = getAssignmentRoot(expression.expression)
            return root ? [root] : []
        }
    }
    if (ignoredCallSpans?.has(callSpanKey(sourceFile, node))) {
        return []
    }
    const roots: string[] = []
    for (const argument of node.arguments) {
        const root = getAccessRoot(argument)
        if (root && referenceLikeBindings.has(root)) {
            roots.push(root)
        }
    }
    return roots
}

const mutatingMethodNames = new Set([
    "copyWithin",
    "fill",
    "pop",
    "push",
    "reverse",
    "shift",
    "sort",
    "splice",
    "unshift",
])

function callSpanKey(
    sourceFile: ts.SourceFile,
    node: ts.CallExpression
): string {
    return `${sourceFile.fileName}:${node.getStart(sourceFile)}:${node.getEnd()}`
}

function isAssignmentOperator(kind: ts.SyntaxKind): boolean {
    return (
        kind >= ts.SyntaxKind.FirstAssignment &&
        kind <= ts.SyntaxKind.LastAssignment
    )
}

function getAssignmentRoot(expression: ts.Expression): string | undefined {
    const unwrapped = unwrapExpression(expression)
    if (ts.isIdentifier(unwrapped)) {
        return unwrapped.text
    }
    if (
        ts.isPropertyAccessExpression(unwrapped) ||
        ts.isElementAccessExpression(unwrapped)
    ) {
        return getAssignmentRoot(unwrapped.expression)
    }
    return undefined
}

function getAccessRoot(expression: ts.Expression): string | undefined {
    const unwrapped = unwrapExpression(expression)
    if (ts.isIdentifier(unwrapped)) {
        return unwrapped.text
    }
    if (
        ts.isPropertyAccessExpression(unwrapped) ||
        ts.isElementAccessExpression(unwrapped)
    ) {
        return getAccessRoot(unwrapped.expression)
    }
    return undefined
}

function unwrapExpression(expression: ts.Expression): ts.Expression {
    let current = expression
    while (
        ts.isParenthesizedExpression(current) ||
        ts.isAsExpression(current) ||
        ts.isSatisfiesExpression(current) ||
        ts.isTypeAssertionExpression(current)
    ) {
        current = current.expression
    }
    return current
}

function bindingScope(
    sourceFile: ts.SourceFile,
    binding: ts.Node
): ts.Node | undefined {
    if (ts.isVariableDeclaration(binding)) {
        return variableDeclarationScope(sourceFile, binding)
    }
    if (ts.isBindingElement(binding)) {
        const declaration = findBindingVariableDeclaration(binding)
        return declaration
            ? variableDeclarationScope(sourceFile, declaration)
            : findDeclarationScope(binding)
    }
    if (ts.isParameter(binding)) {
        return findFunctionLikeScope(binding)
    }
    return findDeclarationScope(binding)
}

function variableDeclarationScope(
    sourceFile: ts.SourceFile,
    declaration: ts.VariableDeclaration
): ts.Node | undefined {
    const declarationList = declaration.parent
    if (
        ts.isVariableDeclarationList(declarationList) &&
        (declarationList.flags & ts.NodeFlags.BlockScoped) === 0
    ) {
        return findFunctionLikeScope(declaration)
    }
    return findDeclarationScope(declaration) ?? sourceFile
}

function findBindingVariableDeclaration(
    binding: ts.BindingElement
): ts.VariableDeclaration | undefined {
    let current: ts.Node | undefined = binding.parent
    while (current) {
        if (ts.isVariableDeclaration(current)) {
            return current
        }
        current = current.parent
    }
    return undefined
}

function findFunctionLikeScope(node: ts.Node): ts.Node | undefined {
    let current: ts.Node | undefined = node.parent
    while (current) {
        if (ts.isFunctionLike(current) || ts.isSourceFile(current)) {
            return current
        }
        current = current.parent
    }
    return undefined
}

function declarationScopeContains(
    sourceFile: ts.SourceFile,
    declaration: ts.Node,
    position: number
): boolean {
    const scope = findDeclarationScope(declaration)
    if (!scope || ts.isSourceFile(scope)) {
        return true
    }

    return scope.getStart(sourceFile) <= position && position <= scope.getEnd()
}

function findDeclarationScope(node: ts.Node): ts.Node | undefined {
    let current: ts.Node | undefined = node.parent
    while (current) {
        if (
            ts.isBlock(current) ||
            ts.isSourceFile(current) ||
            ts.isFunctionLike(current)
        ) {
            return current
        }
        current = current.parent
    }
    return undefined
}

function scopeContains(
    sourceFile: ts.SourceFile,
    scope: ts.Node,
    position: number
): boolean {
    return scope.getStart(sourceFile) <= position && position <= scope.getEnd()
}
