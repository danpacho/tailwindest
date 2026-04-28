import * as ts from "typescript"
import type { CompilerDiagnostic } from "../core/diagnostic_types"
import type { DependencyGraph } from "./dependency_graph"
import {
    createAnalyzerDiagnostic,
    type DetectionResult,
    type ModuleInfo,
    type ResolvedStaticArgument,
} from "./symbols"

export interface StaticResolverHost {
    getModuleInfo(fileName: string): ModuleInfo
    getSourceFile(fileName: string): ts.SourceFile
    resolveModule(fromFile: string, moduleSpecifier: string): string | undefined
    dependencyGraph: DependencyGraph
}

interface ResolveContext {
    rootFile: string
    currentFile: string
    dependencies: Set<string>
    diagnostics: CompilerDiagnostic[]
    visiting: Set<string>
}

interface ResolveResult {
    ok: boolean
    value?: unknown
}

export class StaticResolver {
    public constructor(private readonly host: StaticResolverHost) {}

    public resolveArguments(
        rootFile: string,
        expressions: readonly ts.Expression[]
    ): {
        arguments: ResolvedStaticArgument[]
        dependencies: DetectionResult["dependencies"]
        diagnostics: CompilerDiagnostic[]
    } {
        const context: ResolveContext = {
            rootFile,
            currentFile: rootFile,
            dependencies: new Set(),
            diagnostics: [],
            visiting: new Set(),
        }
        const resolvedArguments: ResolvedStaticArgument[] = []

        for (const expression of expressions) {
            const result = this.resolveExpression(expression, context)
            if (!result.ok) {
                return {
                    arguments: [],
                    dependencies: [...context.dependencies],
                    diagnostics: context.diagnostics,
                }
            }

            resolvedArguments.push({
                value: result.value,
                dependencies: [...context.dependencies],
            })
        }

        return {
            arguments: resolvedArguments,
            dependencies: [...context.dependencies],
            diagnostics: context.diagnostics,
        }
    }

    private resolveExpression(
        expression: ts.Expression,
        context: ResolveContext
    ): ResolveResult {
        const unwrapped = this.unwrapExpression(expression)

        if (
            ts.isStringLiteral(unwrapped) ||
            ts.isNoSubstitutionTemplateLiteral(unwrapped)
        ) {
            return { ok: true, value: unwrapped.text }
        }
        if (ts.isNumericLiteral(unwrapped)) {
            return { ok: true, value: Number(unwrapped.text) }
        }
        if (unwrapped.kind === ts.SyntaxKind.TrueKeyword) {
            return { ok: true, value: true }
        }
        if (unwrapped.kind === ts.SyntaxKind.FalseKeyword) {
            return { ok: true, value: false }
        }
        if (unwrapped.kind === ts.SyntaxKind.NullKeyword) {
            return { ok: true, value: null }
        }
        if (ts.isBigIntLiteral(unwrapped)) {
            return { ok: true, value: BigInt(unwrapped.text.slice(0, -1)) }
        }
        if (ts.isPrefixUnaryExpression(unwrapped)) {
            const inner = this.resolveExpression(unwrapped.operand, context)
            if (!inner.ok || typeof inner.value !== "number") {
                this.addDiagnostic(
                    context,
                    "UNRESOLVED_STATIC_VALUE",
                    "Unable to resolve unary value."
                )
                return { ok: false }
            }
            return {
                ok: true,
                value:
                    unwrapped.operator === ts.SyntaxKind.MinusToken
                        ? -inner.value
                        : inner.value,
            }
        }
        if (ts.isArrayLiteralExpression(unwrapped)) {
            const values: unknown[] = []
            for (const element of unwrapped.elements) {
                if (ts.isSpreadElement(element)) {
                    this.addDiagnostic(
                        context,
                        "UNSUPPORTED_DYNAMIC_VALUE",
                        "Array spreads are not static."
                    )
                    return { ok: false }
                }
                const result = this.resolveExpression(element, context)
                if (!result.ok) {
                    return { ok: false }
                }
                values.push(result.value)
            }
            return { ok: true, value: values }
        }
        if (ts.isObjectLiteralExpression(unwrapped)) {
            return this.resolveObjectLiteral(unwrapped, context)
        }
        if (ts.isIdentifier(unwrapped)) {
            return this.resolveIdentifier(unwrapped.text, context)
        }
        if (ts.isPropertyAccessExpression(unwrapped)) {
            return this.resolvePropertyAccess(unwrapped, context)
        }
        if (ts.isCallExpression(unwrapped)) {
            this.addDiagnostic(
                context,
                "UNSUPPORTED_DYNAMIC_VALUE",
                "Function calls are dynamic."
            )
            return { ok: false }
        }
        if (ts.isNewExpression(unwrapped)) {
            this.addDiagnostic(
                context,
                "SIDE_EFFECTFUL_INITIALIZER",
                "New expressions are side-effectful."
            )
            return { ok: false }
        }
        if (
            ts.isFunctionExpression(unwrapped) ||
            ts.isArrowFunction(unwrapped) ||
            ts.isClassExpression(unwrapped)
        ) {
            this.addDiagnostic(
                context,
                "SIDE_EFFECTFUL_INITIALIZER",
                "Executable initializers are not static."
            )
            return { ok: false }
        }

        this.addDiagnostic(
            context,
            "UNRESOLVED_STATIC_VALUE",
            "Unable to resolve static value."
        )
        return { ok: false }
    }

    private resolveObjectLiteral(
        expression: ts.ObjectLiteralExpression,
        context: ResolveContext
    ): ResolveResult {
        const value: Record<string, unknown> = {}

        for (const property of expression.properties) {
            if (ts.isSpreadAssignment(property)) {
                const spread = this.resolveExpression(
                    property.expression,
                    context
                )
                if (!spread.ok || !this.isPlainObject(spread.value)) {
                    this.addDiagnostic(
                        context,
                        "UNKNOWN_SPREAD",
                        "Object spread source is not statically known."
                    )
                    return { ok: false }
                }
                Object.assign(value, spread.value)
                continue
            }

            if (
                ts.isGetAccessor(property) ||
                ts.isMethodDeclaration(property) ||
                ts.isSetAccessor(property)
            ) {
                this.addDiagnostic(
                    context,
                    "SIDE_EFFECTFUL_INITIALIZER",
                    "Accessors and methods are side-effectful."
                )
                return { ok: false }
            }

            if (ts.isShorthandPropertyAssignment(property)) {
                const shorthand = this.resolveIdentifier(
                    property.name.text,
                    context
                )
                if (!shorthand.ok) {
                    return { ok: false }
                }
                value[property.name.text] = shorthand.value
                continue
            }

            if (!ts.isPropertyAssignment(property)) {
                this.addDiagnostic(
                    context,
                    "UNRESOLVED_STATIC_VALUE",
                    "Unsupported object property."
                )
                return { ok: false }
            }

            const key = this.resolvePropertyName(property.name, context)
            if (key === undefined) {
                return { ok: false }
            }

            const propertyValue = this.resolveExpression(
                property.initializer,
                context
            )
            if (!propertyValue.ok) {
                return { ok: false }
            }
            value[key] = propertyValue.value
        }

        return { ok: true, value }
    }

    private resolvePropertyName(
        name: ts.PropertyName,
        context: ResolveContext
    ): string | undefined {
        if (
            ts.isIdentifier(name) ||
            ts.isStringLiteral(name) ||
            ts.isNumericLiteral(name)
        ) {
            return name.text
        }
        if (ts.isComputedPropertyName(name)) {
            const result = this.resolveExpression(name.expression, context)
            if (result.ok && typeof result.value === "string") {
                return result.value
            }
        }

        this.addDiagnostic(
            context,
            "UNRESOLVED_STATIC_VALUE",
            "Computed property key is not a static string."
        )
        return undefined
    }

    private resolveIdentifier(
        name: string,
        context: ResolveContext
    ): ResolveResult {
        if (name === "Date") {
            this.addDiagnostic(
                context,
                "SIDE_EFFECTFUL_INITIALIZER",
                "Date is runtime state."
            )
            return { ok: false }
        }

        const info = this.host.getModuleInfo(context.currentFile)

        if (info.mutatedBindings.has(name)) {
            this.addDiagnostic(
                context,
                "MUTATED_BINDING",
                `Binding ${name} is mutated after declaration.`
            )
            return { ok: false }
        }
        if (info.classDeclarations.has(name)) {
            this.addDiagnostic(
                context,
                "SIDE_EFFECTFUL_INITIALIZER",
                `Class ${name} is not a static value.`
            )
            return { ok: false }
        }

        const declaration = info.topLevelDeclarations.get(name)
        if (declaration?.initializer) {
            return this.resolveNamedExpression(
                context.currentFile,
                name,
                declaration.initializer,
                context
            )
        }

        const imported = info.imports.get(name)
        if (imported && !imported.isTypeOnly) {
            const dependency = imported.resolvedFile
            if (!dependency) {
                this.addDiagnostic(
                    context,
                    "UNRESOLVED_STATIC_VALUE",
                    `Unable to resolve ${imported.moduleSpecifier}.`
                )
                return { ok: false }
            }

            this.addDependency(context, context.currentFile, dependency)
            return this.resolveExportedValue(
                dependency,
                imported.importedName,
                context
            )
        }

        this.addDiagnostic(
            context,
            "UNRESOLVED_STATIC_VALUE",
            `Unable to resolve ${name}.`
        )
        return { ok: false }
    }

    private resolveNamedExpression(
        fileName: string,
        exportName: string,
        expression: ts.Expression,
        context: ResolveContext
    ): ResolveResult {
        const key = `${fileName}:${exportName}`
        if (context.visiting.has(key)) {
            this.addDiagnostic(
                context,
                "CIRCULAR_STATIC_REFERENCE",
                `Circular static reference at ${exportName}.`
            )
            return { ok: false }
        }

        context.visiting.add(key)
        const previousFile = context.currentFile
        context.currentFile = fileName
        const result = this.resolveExpression(expression, context)
        context.currentFile = previousFile
        context.visiting.delete(key)

        return result
    }

    private resolveExportedValue(
        fileName: string,
        exportName: string,
        context: ResolveContext
    ): ResolveResult {
        const info = this.host.getModuleInfo(fileName)
        const exported = info.exports.get(exportName)

        if (!exported) {
            this.addDiagnostic(
                context,
                "UNRESOLVED_STATIC_VALUE",
                `Export ${exportName} was not found.`
            )
            return { ok: false }
        }

        if (exported.reexport) {
            const dependency = exported.reexport.resolvedFile
            if (!dependency) {
                this.addDiagnostic(
                    context,
                    "UNRESOLVED_STATIC_VALUE",
                    `Unable to resolve re-export ${exportName}.`
                )
                return { ok: false }
            }

            this.addDependency(context, fileName, dependency)
            return this.resolveExportedValue(
                dependency,
                exported.reexport.importedName,
                context
            )
        }

        if (exported.expression && exported.localName) {
            return this.resolveNamedExpression(
                fileName,
                exported.localName,
                exported.expression,
                context
            )
        }

        this.addDiagnostic(
            context,
            "UNRESOLVED_STATIC_VALUE",
            `Export ${exportName} is not static.`
        )
        return { ok: false }
    }

    private resolvePropertyAccess(
        expression: ts.PropertyAccessExpression,
        context: ResolveContext
    ): ResolveResult {
        const left = expression.expression
        if (
            ts.isIdentifier(left) &&
            left.text === "Math" &&
            expression.name.text === "random"
        ) {
            this.addDiagnostic(
                context,
                "SIDE_EFFECTFUL_INITIALIZER",
                "Math.random is runtime state."
            )
            return { ok: false }
        }
        if (
            ts.isPropertyAccessExpression(left) &&
            ts.isIdentifier(left.expression) &&
            left.expression.text === "process" &&
            left.name.text === "env"
        ) {
            this.addDiagnostic(
                context,
                "SIDE_EFFECTFUL_INITIALIZER",
                "process.env is runtime state."
            )
            return { ok: false }
        }

        this.addDiagnostic(
            context,
            "UNRESOLVED_STATIC_VALUE",
            "Property access is not statically resolved."
        )
        return { ok: false }
    }

    private addDependency(
        context: ResolveContext,
        consumer: string,
        dependency: string
    ): void {
        this.host.dependencyGraph.addEdge(consumer, dependency)
        this.host.dependencyGraph.addEdge(context.rootFile, dependency)
        context.dependencies.add(dependency)
    }

    private addDiagnostic(
        context: ResolveContext,
        code: CompilerDiagnostic["code"],
        message: string
    ): void {
        context.diagnostics.push(createAnalyzerDiagnostic(code, message))
    }

    private unwrapExpression(expression: ts.Expression): ts.Expression {
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

    private isPlainObject(value: unknown): value is Record<string, unknown> {
        return (
            typeof value === "object" && value !== null && !Array.isArray(value)
        )
    }
}
