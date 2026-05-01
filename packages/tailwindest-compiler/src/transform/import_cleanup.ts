import * as ts from "typescript"
import type { CompilerDiagnostic } from "../core/diagnostic_types"

export interface ImportCleanupInput {
    fileName: string
    code: string
}

export interface ImportCleanupResult {
    code: string
    changed: boolean
    diagnostics: CompilerDiagnostic[]
}

interface Edit {
    start: number
    end: number
    text: string
}

const runtimeImportNames = new Set([
    "createTools",
    "style",
    "toggle",
    "rotary",
    "variants",
    "join",
    "def",
    "mergeProps",
    "mergeRecord",
    "compose",
])

export const cleanupRuntimeImports = ({
    fileName,
    code,
}: ImportCleanupInput): ImportCleanupResult => {
    const sourceFile = ts.createSourceFile(
        fileName,
        code,
        ts.ScriptTarget.Latest,
        true,
        scriptKindFor(fileName)
    )
    const edits: Edit[] = []
    const removableCreateToolStatements =
        collectRemovableCreateToolStatements(sourceFile)

    for (const statement of sourceFile.statements) {
        if (ts.isVariableStatement(statement)) {
            if (removableCreateToolStatements.has(statement)) {
                edits.push({
                    start: statement.getStart(sourceFile),
                    end: includeFollowingLineBreak(code, statement.getEnd()),
                    text: "",
                })
            }
            continue
        }
        if (
            !ts.isImportDeclaration(statement) ||
            statement.importClause?.isTypeOnly
        ) {
            continue
        }
        if (
            !ts.isStringLiteral(statement.moduleSpecifier) ||
            statement.moduleSpecifier.text !== "tailwindest"
        ) {
            continue
        }

        const namedBindings = statement.importClause?.namedBindings
        if (!namedBindings || !ts.isNamedImports(namedBindings)) {
            continue
        }

        const runtimeSpecifiers = namedBindings.elements.filter((specifier) =>
            runtimeImportNames.has(
                (specifier.propertyName ?? specifier.name).text
            )
        )
        if (runtimeSpecifiers.length === 0) {
            continue
        }

        if (
            runtimeSpecifiers.some((specifier) =>
                isIdentifierUsed(
                    sourceFile,
                    specifier.name.text,
                    statement,
                    removableCreateToolStatements
                )
            )
        ) {
            continue
        }

        const preservedSpecifiers = namedBindings.elements.filter(
            (specifier) =>
                !runtimeImportNames.has(
                    (specifier.propertyName ?? specifier.name).text
                )
        )

        const defaultImportName = statement.importClause?.name?.text
        if (preservedSpecifiers.length === 0 && !defaultImportName) {
            edits.push({
                start: statement.getStart(sourceFile),
                end: includeFollowingLineBreak(code, statement.getEnd()),
                text: "",
            })
            continue
        }

        const preservedText = preservedSpecifiers
            .map((specifier) => specifier.getText(sourceFile))
            .join(", ")
        const quote = statement.moduleSpecifier
            .getText(sourceFile)
            .startsWith("'")
            ? "'"
            : `"`
        const importText =
            preservedSpecifiers.length === 0 && defaultImportName
                ? `import ${defaultImportName} from ${quote}tailwindest${quote}`
                : `import ${defaultImportName ? `${defaultImportName}, ` : ""}{ ${preservedText} } from ${quote}tailwindest${quote}`
        edits.push({
            start: statement.getStart(sourceFile),
            end: statement.getEnd(),
            text: importText,
        })
    }

    if (edits.length === 0) {
        return { code, changed: false, diagnostics: [] }
    }

    return {
        code: applyEdits(code, edits),
        changed: true,
        diagnostics: [],
    }
}

const collectRemovableCreateToolStatements = (
    sourceFile: ts.SourceFile
): Set<ts.Node> => {
    const removable = new Set<ts.Node>()
    for (const statement of sourceFile.statements) {
        if (!ts.isVariableStatement(statement)) {
            continue
        }
        const declaration = statement.declarationList.declarations[0]
        if (
            declaration &&
            !hasExportModifier(statement) &&
            statement.declarationList.declarations.length === 1 &&
            ts.isIdentifier(declaration.name) &&
            declaration.initializer &&
            ts.isCallExpression(declaration.initializer) &&
            ts.isIdentifier(declaration.initializer.expression) &&
            declaration.initializer.expression.text === "createTools" &&
            isCreateToolsCallSafeToErase(declaration.initializer) &&
            !isIdentifierUsed(sourceFile, declaration.name.text, statement)
        ) {
            removable.add(statement)
        }
    }
    return removable
}

const isCreateToolsCallSafeToErase = (call: ts.CallExpression): boolean => {
    if (call.arguments.length === 0) {
        return true
    }
    if (call.arguments.length !== 1) {
        return false
    }

    const optionsArgument = call.arguments[0]
    if (!optionsArgument) {
        return false
    }

    const options = unwrapExpression(optionsArgument)
    return (
        ts.isObjectLiteralExpression(options) &&
        isSideEffectFreeObjectLiteral(options)
    )
}

const isSideEffectFreeObjectLiteral = (
    expression: ts.ObjectLiteralExpression
): boolean =>
    expression.properties.every((property) => {
        if (
            !ts.isPropertyAssignment(property) ||
            ts.isComputedPropertyName(property.name) ||
            getPropertyNameText(property.name) === "merger"
        ) {
            return false
        }

        return isSideEffectFreeLiteralExpression(property.initializer)
    })

const isSideEffectFreeLiteralExpression = (
    expression: ts.Expression
): boolean => {
    const unwrapped = unwrapExpression(expression)

    if (ts.isObjectLiteralExpression(unwrapped)) {
        return isSideEffectFreeObjectLiteral(unwrapped)
    }
    if (ts.isArrayLiteralExpression(unwrapped)) {
        return unwrapped.elements.every(
            (element) =>
                !ts.isSpreadElement(element) &&
                isSideEffectFreeLiteralExpression(element)
        )
    }
    return (
        ts.isStringLiteral(unwrapped) ||
        ts.isNumericLiteral(unwrapped) ||
        ts.isBigIntLiteral(unwrapped) ||
        ts.isNoSubstitutionTemplateLiteral(unwrapped) ||
        unwrapped.kind === ts.SyntaxKind.TrueKeyword ||
        unwrapped.kind === ts.SyntaxKind.FalseKeyword ||
        unwrapped.kind === ts.SyntaxKind.NullKeyword
    )
}

const unwrapExpression = (expression: ts.Expression): ts.Expression => {
    let current = expression
    while (
        ts.isAsExpression(current) ||
        ts.isTypeAssertionExpression(current) ||
        ts.isSatisfiesExpression(current) ||
        ts.isParenthesizedExpression(current)
    ) {
        current = current.expression
    }
    return current
}

const getPropertyNameText = (name: ts.PropertyName): string | undefined => {
    if (
        ts.isIdentifier(name) ||
        ts.isStringLiteral(name) ||
        ts.isNumericLiteral(name)
    ) {
        return name.text
    }
    return undefined
}

const hasExportModifier = (node: ts.VariableStatement): boolean =>
    ts
        .getModifiers(node)
        ?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ??
    false

const isIdentifierUsed = (
    sourceFile: ts.SourceFile,
    localName: string,
    ignoredDeclaration: ts.Node,
    ignoredNodes: Set<ts.Node> = new Set()
): boolean => {
    let used = false

    const visit = (node: ts.Node): void => {
        if (used || node === ignoredDeclaration || ignoredNodes.has(node)) {
            return
        }
        if (ts.isIdentifier(node) && node.text === localName) {
            used = true
            return
        }
        ts.forEachChild(node, visit)
    }

    ts.forEachChild(sourceFile, visit)
    return used
}

const applyEdits = (code: string, edits: Edit[]): string => {
    let next = code
    for (const edit of [...edits].sort(
        (left, right) => right.start - left.start
    )) {
        next = next.slice(0, edit.start) + edit.text + next.slice(edit.end)
    }
    return next
}

const includeFollowingLineBreak = (code: string, end: number): number => {
    if (code[end] === "\r" && code[end + 1] === "\n") {
        return end + 2
    }
    if (code[end] === "\n") {
        return end + 1
    }
    return end
}

const scriptKindFor = (fileName: string): ts.ScriptKind =>
    fileName.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
