import path from "node:path"
import * as ts from "typescript"
import { collectMutatedBindingNames } from "./ast_bindings"
import { DependencyGraph } from "./dependency_graph"
import { hasTailwindestSentinel } from "./lexical_gate"
import { StaticResolver, type StaticResolverHost } from "./static_resolver"
import {
    TAILWINDEST_CALL_KINDS,
    createAnalyzerDiagnostic,
    type DetectionResult,
    type ExportedBinding,
    type ImportedBinding,
    type ModuleInfo,
    type TailwindestCallKind,
    type TailwindestSymbol,
} from "./symbols"

interface CachedSourceFile {
    version: number
    sourceFile: ts.SourceFile
}

interface ToolResolutionContext {
    rootFile: string
    currentFile: string
    dependencies: Set<string>
    visiting: Set<string>
    recordDependencies?: boolean
}

type TailwindestPropertyName =
    | TailwindestCallKind
    | "class"
    | "style"
    | "compose"

export interface StaticAnalyzer {
    analyzeFile(fileName: string): DetectionResult
    updateFile(fileName: string, source: string): void
    getDependencyGraph(): DependencyGraph
    getParseCount(): number
}

export const createStaticAnalyzer = (
    files: Record<string, string>
): StaticAnalyzer => {
    return new StaticAnalyzerImpl(files)
}

class StaticAnalyzerImpl implements StaticAnalyzer, StaticResolverHost {
    public readonly dependencyGraph = new DependencyGraph()
    private readonly files = new Map<string, string>()
    private readonly versions = new Map<string, number>()
    private readonly sourceFiles = new Map<string, CachedSourceFile>()
    private readonly moduleInfos = new Map<string, ModuleInfo>()
    private parseCount = 0

    public constructor(files: Record<string, string>) {
        for (const [fileName, source] of Object.entries(files)) {
            const normalized = normalizeFileName(fileName)
            this.files.set(normalized, source)
            this.versions.set(normalized, 0)
        }
    }

    public analyzeFile(fileName: string): DetectionResult {
        const normalized = normalizeFileName(fileName)
        const source = this.files.get(normalized) ?? ""
        const calls: DetectionResult["calls"] = []
        const provenReceiverSpans: DetectionResult["provenReceiverSpans"] = []
        const resolvedCallArguments: DetectionResult["resolvedCallArguments"] =
            []
        const runtimeMergerCalls: DetectionResult["runtimeMergerCalls"] = []
        const diagnostics: DetectionResult["diagnostics"] = []
        const dependencies = new Set<string>()

        this.dependencyGraph.clearConsumer(normalized)

        if (!hasTailwindestSentinel(source)) {
            return {
                calls,
                provenReceiverSpans,
                resolvedCallArguments,
                runtimeMergerCalls,
                dependencies: [],
                diagnostics,
            }
        }

        const sourceFile = this.getSourceFile(normalized)
        const resolver = new StaticResolver(this)

        const visit = (node: ts.Node): void => {
            if (!ts.isCallExpression(node)) {
                ts.forEachChild(node, visit)
                return
            }

            const propertyName = this.getTailwindestCallKind(node.expression)
            if (!propertyName) {
                ts.forEachChild(node, visit)
                return
            }

            const receiverExpression = ts.isPropertyAccessExpression(
                node.expression
            )
                ? node.expression.expression
                : undefined
            const receiverName = ts.isIdentifier(node.expression)
                ? node.expression.text
                : propertyName

            const isToolCallKind = TAILWINDEST_CALL_KINDS.has(
                propertyName as TailwindestCallKind
            )
            const isStylerMethodKind =
                ts.isPropertyAccessExpression(node.expression) &&
                (propertyName === "class" ||
                    propertyName === "style" ||
                    propertyName === "compose")
            if (!isToolCallKind && !isStylerMethodKind) {
                ts.forEachChild(node, visit)
                return
            }

            const receiver = receiverExpression
                ? this.resolveToolExpression(receiverExpression, normalized, {
                      rootFile: normalized,
                      currentFile: normalized,
                      dependencies,
                      visiting: new Set(),
                  })
                : this.resolveDestructuredToolIdentifier(
                      receiverName,
                      normalized,
                      node.expression.getStart(),
                      {
                          rootFile: normalized,
                          currentFile: normalized,
                          dependencies,
                          visiting: new Set(),
                      }
                  )

            if (!receiver) {
                if (isToolCallKind) {
                    diagnostics.push(
                        createAnalyzerDiagnostic(
                            "NOT_TAILWINDEST_SYMBOL",
                            `${propertyName} receiver is not proven to come from createTools().`
                        )
                    )
                }
                ts.forEachChild(node, visit)
                return
            }

            const span = {
                fileName: normalized,
                start: node.getStart(sourceFile),
                end: node.getEnd(),
            }
            provenReceiverSpans.push(span)
            if (receiver.runtimeMerger) {
                runtimeMergerCalls.push(span)
            }

            const resolvedArguments = resolver.resolveArguments(
                normalized,
                node.arguments
            )
            for (const dependency of resolvedArguments.dependencies) {
                dependencies.add(dependency)
            }

            if (resolvedArguments.diagnostics.length === 0) {
                resolvedCallArguments.push({
                    span,
                    arguments: resolvedArguments.arguments,
                })
                if (isToolCallKind) {
                    calls.push({
                        kind: propertyName as TailwindestCallKind,
                        span,
                        receiver,
                        arguments: resolvedArguments.arguments,
                    })
                }
            } else if (isToolCallKind) {
                diagnostics.push(...resolvedArguments.diagnostics)
            }

            ts.forEachChild(node, visit)
        }

        visit(sourceFile)

        return {
            calls,
            provenReceiverSpans,
            resolvedCallArguments,
            runtimeMergerCalls,
            dependencies: [...dependencies],
            diagnostics,
        }
    }

    public updateFile(fileName: string, source: string): void {
        const normalized = normalizeFileName(fileName)
        this.files.set(normalized, source)
        this.versions.set(normalized, (this.versions.get(normalized) ?? 0) + 1)
        this.sourceFiles.delete(normalized)
        this.moduleInfos.clear()
        this.dependencyGraph.clearConsumer(normalized)
    }

    public getDependencyGraph(): DependencyGraph {
        return this.dependencyGraph
    }

    public getParseCount(): number {
        return this.parseCount
    }

    public getSourceFile(fileName: string): ts.SourceFile {
        const normalized = normalizeFileName(fileName)
        const version = this.versions.get(normalized) ?? 0
        const cached = this.sourceFiles.get(normalized)

        if (cached?.version === version) {
            return cached.sourceFile
        }

        const sourceFile = ts.createSourceFile(
            normalized,
            this.files.get(normalized) ?? "",
            ts.ScriptTarget.Latest,
            true,
            sourceKindForFileName(normalized)
        )

        this.sourceFiles.set(normalized, { version, sourceFile })
        this.parseCount += 1

        return sourceFile
    }

    public getModuleInfo(fileName: string): ModuleInfo {
        const normalized = normalizeFileName(fileName)
        const cached = this.moduleInfos.get(normalized)
        if (cached) {
            return cached
        }

        const sourceFile = this.getSourceFile(normalized)
        const info: ModuleInfo = {
            imports: new Map(),
            exports: new Map(),
            topLevelDeclarations: new Map(),
            classDeclarations: new Set(),
            mutatedBindings: new Set(),
        }

        for (const statement of sourceFile.statements) {
            if (ts.isImportDeclaration(statement)) {
                this.readImportDeclaration(normalized, statement, info)
                continue
            }
            if (ts.isExportDeclaration(statement)) {
                this.readExportDeclaration(normalized, statement, info)
                continue
            }
            if (ts.isClassDeclaration(statement) && statement.name) {
                info.classDeclarations.add(statement.name.text)
                continue
            }
            if (ts.isVariableStatement(statement)) {
                this.readVariableStatement(statement, info)
            }
        }

        this.moduleInfos.set(normalized, info)

        for (const name of collectMutatedBindingNames(
            sourceFile,
            this.collectProvenReceiverSpanKeys(normalized, sourceFile)
        )) {
            info.mutatedBindings.add(name)
        }

        return info
    }

    public resolveModule(
        fromFile: string,
        moduleSpecifier: string
    ): string | undefined {
        if (!moduleSpecifier.startsWith(".")) {
            return undefined
        }

        const basePath = normalizeFileName(
            path.posix.join(path.posix.dirname(fromFile), moduleSpecifier)
        )
        const sourceExtensions = [
            ".ts",
            ".tsx",
            ".mts",
            ".cts",
            ".js",
            ".jsx",
            ".mjs",
            ".cjs",
        ]
        const candidates = [
            basePath,
            ...sourceExtensions.map((extension) => `${basePath}${extension}`),
            ...sourceExtensions.map((extension) =>
                path.posix.join(basePath, `index${extension}`)
            ),
        ]

        return candidates.find((candidate) => this.files.has(candidate))
    }

    private readImportDeclaration(
        fileName: string,
        statement: ts.ImportDeclaration,
        info: ModuleInfo
    ): void {
        if (
            !statement.importClause ||
            !ts.isStringLiteral(statement.moduleSpecifier)
        ) {
            return
        }

        const moduleSpecifier = statement.moduleSpecifier.text
        const namedBindings = statement.importClause.namedBindings
        if (!namedBindings || !ts.isNamedImports(namedBindings)) {
            return
        }

        for (const element of namedBindings.elements) {
            const importedName = element.propertyName?.text ?? element.name.text
            const localName = element.name.text
            info.imports.set(localName, {
                localName,
                importedName,
                moduleSpecifier,
                resolvedFile: this.resolveModule(fileName, moduleSpecifier),
                isTypeOnly:
                    statement.importClause.isTypeOnly || element.isTypeOnly,
            })
        }
    }

    private readExportDeclaration(
        fileName: string,
        statement: ts.ExportDeclaration,
        info: ModuleInfo
    ): void {
        if (
            !statement.exportClause ||
            !ts.isNamedExports(statement.exportClause)
        ) {
            return
        }

        const moduleSpecifier =
            statement.moduleSpecifier &&
            ts.isStringLiteral(statement.moduleSpecifier)
                ? statement.moduleSpecifier.text
                : undefined

        for (const element of statement.exportClause.elements) {
            const exportedName = element.name.text
            const importedName = element.propertyName?.text ?? element.name.text

            if (moduleSpecifier) {
                info.exports.set(exportedName, {
                    reexport: {
                        localName: exportedName,
                        importedName,
                        moduleSpecifier,
                        resolvedFile: this.resolveModule(
                            fileName,
                            moduleSpecifier
                        ),
                        isTypeOnly: element.isTypeOnly,
                    },
                })
                continue
            }

            const declaration = info.topLevelDeclarations.get(importedName)
            info.exports.set(exportedName, {
                localName: importedName,
                expression: declaration?.initializer,
            })
        }
    }

    private readVariableStatement(
        statement: ts.VariableStatement,
        info: ModuleInfo
    ): void {
        const isExported = statement.modifiers?.some(
            (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
        )

        for (const declaration of statement.declarationList.declarations) {
            if (!ts.isIdentifier(declaration.name)) {
                continue
            }

            info.topLevelDeclarations.set(declaration.name.text, declaration)
            if (isExported) {
                info.exports.set(declaration.name.text, {
                    localName: declaration.name.text,
                    expression: declaration.initializer,
                })
            }
        }
    }

    private resolveToolExpression(
        expression: ts.Expression,
        fileName: string,
        context: ToolResolutionContext
    ): TailwindestSymbol | undefined {
        const unwrapped = unwrapExpression(expression)
        if (
            ts.isCallExpression(unwrapped) &&
            ts.isPropertyAccessExpression(unwrapped.expression)
        ) {
            return this.resolveToolExpression(
                unwrapped.expression.expression,
                fileName,
                context
            )
        }
        if (!ts.isIdentifier(unwrapped)) {
            return undefined
        }

        return this.resolveToolIdentifier(
            unwrapped.text,
            fileName,
            unwrapped.getStart(),
            context
        )
    }

    private resolveToolIdentifier(
        name: string,
        fileName: string,
        position: number,
        context: ToolResolutionContext
    ): TailwindestSymbol | undefined {
        const sourceFile = this.getSourceFile(fileName)
        const declaration = findVisibleVariableDeclaration(
            sourceFile,
            name,
            position
        )
        if (declaration) {
            if (!declaration.initializer) {
                return undefined
            }

            const createToolsSymbol = this.resolveCreateToolsSymbol(
                name,
                declaration.initializer,
                fileName
            )
            if (createToolsSymbol) {
                return createToolsSymbol
            }

            const initializer = unwrapExpression(declaration.initializer)
            const initializerReceiver = this.resolveToolInitializer(
                initializer,
                fileName,
                context
            )
            if (initializerReceiver) {
                return {
                    name,
                    sourceFile: initializerReceiver.sourceFile,
                    provenance: initializerReceiver.provenance,
                    runtimeMerger: initializerReceiver.runtimeMerger,
                }
            }

            if (ts.isIdentifier(initializer)) {
                return this.resolveToolIdentifier(
                    initializer.text,
                    fileName,
                    initializer.getStart(),
                    context
                )
            }

            return undefined
        }

        const imported = this.getModuleInfo(fileName).imports.get(name)
        if (imported && !imported.isTypeOnly) {
            const dependency = imported.resolvedFile
            if (!dependency) {
                return undefined
            }

            this.addToolDependency(context, fileName, dependency)
            return this.resolveExportedTool(
                dependency,
                imported.importedName,
                context
            )
        }

        return undefined
    }

    private resolveDestructuredToolIdentifier(
        name: string,
        fileName: string,
        position: number,
        context: ToolResolutionContext
    ): TailwindestSymbol | undefined {
        const sourceFile = this.getSourceFile(fileName)
        const shadowingDeclaration = findVisibleVariableDeclaration(
            sourceFile,
            name,
            position
        )
        if (shadowingDeclaration) {
            return undefined
        }

        const binding = findVisibleBindingElement(sourceFile, name, position)
        if (!binding || !ts.isIdentifier(binding.name)) {
            return undefined
        }

        const declaration = findBindingVariableDeclaration(binding)
        const initializer = declaration?.initializer
        if (!initializer) {
            return undefined
        }

        const createToolsSymbol = this.resolveCreateToolsSymbol(
            name,
            initializer,
            fileName
        )
        if (createToolsSymbol) {
            return createToolsSymbol
        }

        const unwrapped = unwrapExpression(initializer)
        if (ts.isIdentifier(unwrapped)) {
            const receiver = this.resolveToolIdentifier(
                unwrapped.text,
                fileName,
                unwrapped.getStart(),
                context
            )
            return receiver
                ? {
                      name,
                      sourceFile: receiver.sourceFile,
                      provenance: receiver.provenance,
                      runtimeMerger: receiver.runtimeMerger,
                  }
                : undefined
        }

        return undefined
    }

    private resolveExportedTool(
        fileName: string,
        exportName: string,
        context: ToolResolutionContext
    ): TailwindestSymbol | undefined {
        const key = `${fileName}:${exportName}`
        if (context.visiting.has(key)) {
            return undefined
        }
        context.visiting.add(key)

        const exported = this.getModuleInfo(fileName).exports.get(exportName)
        if (!exported) {
            context.visiting.delete(key)
            return undefined
        }

        if (exported.reexport) {
            const dependency = exported.reexport.resolvedFile
            if (!dependency) {
                context.visiting.delete(key)
                return undefined
            }

            this.addToolDependency(context, fileName, dependency)
            const result = this.resolveExportedTool(
                dependency,
                exported.reexport.importedName,
                context
            )
            context.visiting.delete(key)
            return result
        }

        if (exported.expression && exported.localName) {
            const createToolsSymbol = this.resolveCreateToolsSymbol(
                exported.localName,
                exported.expression,
                fileName
            )
            if (createToolsSymbol) {
                context.visiting.delete(key)
                return createToolsSymbol
            }

            const expression = unwrapExpression(exported.expression)
            const expressionReceiver = this.resolveToolInitializer(
                expression,
                fileName,
                context
            )
            if (expressionReceiver) {
                context.visiting.delete(key)
                return {
                    name: exported.localName,
                    sourceFile: expressionReceiver.sourceFile,
                    provenance: expressionReceiver.provenance,
                    runtimeMerger: expressionReceiver.runtimeMerger,
                }
            }

            if (ts.isIdentifier(expression)) {
                const result = this.resolveToolIdentifier(
                    expression.text,
                    fileName,
                    expression.getStart(),
                    context
                )
                context.visiting.delete(key)
                return result
            }
        }

        context.visiting.delete(key)
        return undefined
    }

    private resolveToolInitializer(
        expression: ts.Expression,
        fileName: string,
        context: ToolResolutionContext
    ): TailwindestSymbol | undefined {
        if (
            !ts.isCallExpression(expression) ||
            !ts.isPropertyAccessExpression(expression.expression)
        ) {
            return undefined
        }
        const propertyName = expression.expression.name.text
        if (!TAILWINDEST_CALL_KINDS.has(propertyName as TailwindestCallKind)) {
            return undefined
        }
        return this.resolveToolExpression(
            expression.expression.expression,
            fileName,
            context
        )
    }

    private resolveCreateToolsSymbol(
        name: string,
        expression: ts.Expression,
        fileName: string
    ): TailwindestSymbol | undefined {
        const unwrapped = unwrapExpression(expression)
        if (
            !ts.isCallExpression(unwrapped) ||
            !ts.isIdentifier(unwrapped.expression) ||
            !this.isCreateToolsIdentifier(unwrapped.expression.text, fileName)
        ) {
            return undefined
        }

        return {
            name,
            sourceFile: fileName,
            provenance: "createTools",
            runtimeMerger: this.createToolsCallHasRuntimeMerger(
                unwrapped,
                fileName
            ),
        }
    }

    private createToolsCallHasRuntimeMerger(
        call: ts.CallExpression,
        fileName: string
    ): boolean {
        const options = call.arguments[0]
        if (!options) {
            return false
        }

        const unwrapped = unwrapExpression(options)
        if (ts.isObjectLiteralExpression(unwrapped)) {
            return !isMergerFreeObjectLiteral(unwrapped)
        }
        if (!ts.isIdentifier(unwrapped)) {
            return true
        }

        const sourceFile = this.getSourceFile(fileName)
        const declaration = findVisibleVariableDeclaration(
            sourceFile,
            unwrapped.text,
            unwrapped.getStart(sourceFile)
        )
        if (!declaration?.initializer) {
            return true
        }

        const initializer = unwrapExpression(declaration.initializer)
        return ts.isObjectLiteralExpression(initializer)
            ? !isMergerFreeObjectLiteral(initializer)
            : true
    }

    private isCreateToolsIdentifier(name: string, fileName: string): boolean {
        const imported = this.getModuleInfo(fileName).imports.get(name)
        if (
            !imported ||
            imported.isTypeOnly ||
            imported.importedName !== "createTools"
        ) {
            return false
        }
        if (isTailwindestModule(imported.moduleSpecifier)) {
            return true
        }
        if (!imported.resolvedFile) {
            return false
        }

        return this.isExportedCreateTools(
            imported.resolvedFile,
            imported.importedName,
            new Set()
        )
    }

    private isExportedCreateTools(
        fileName: string,
        exportName: string,
        visiting: Set<string>
    ): boolean {
        const key = `${fileName}:${exportName}`
        if (visiting.has(key)) {
            return false
        }
        visiting.add(key)

        const exported = this.getModuleInfo(fileName).exports.get(exportName)
        if (!exported?.reexport) {
            return false
        }

        if (isTailwindestModule(exported.reexport.moduleSpecifier)) {
            return exported.reexport.importedName === "createTools"
        }

        return exported.reexport.resolvedFile
            ? this.isExportedCreateTools(
                  exported.reexport.resolvedFile,
                  exported.reexport.importedName,
                  visiting
              )
            : false
    }

    private addToolDependency(
        context: ToolResolutionContext,
        consumer: string,
        dependency: string
    ): void {
        if (context.recordDependencies === false) {
            return
        }
        this.dependencyGraph.addEdge(consumer, dependency)
        this.dependencyGraph.addEdge(context.rootFile, dependency)
        context.dependencies.add(dependency)
    }

    private collectProvenReceiverSpanKeys(
        fileName: string,
        sourceFile: ts.SourceFile
    ): Set<string> {
        const spans = new Set<string>()

        const visit = (node: ts.Node): void => {
            if (!ts.isCallExpression(node)) {
                ts.forEachChild(node, visit)
                return
            }

            const propertyName = this.getTailwindestCallKind(node.expression)
            if (!propertyName) {
                ts.forEachChild(node, visit)
                return
            }

            const receiverExpression = ts.isPropertyAccessExpression(
                node.expression
            )
                ? node.expression.expression
                : undefined
            const receiverName = ts.isIdentifier(node.expression)
                ? node.expression.text
                : propertyName
            const isToolCallKind = TAILWINDEST_CALL_KINDS.has(
                propertyName as TailwindestCallKind
            )
            const isStylerMethodKind =
                ts.isPropertyAccessExpression(node.expression) &&
                (propertyName === "class" ||
                    propertyName === "style" ||
                    propertyName === "compose")

            if (!isToolCallKind && !isStylerMethodKind) {
                ts.forEachChild(node, visit)
                return
            }

            const receiver = receiverExpression
                ? this.resolveToolExpression(receiverExpression, fileName, {
                      rootFile: fileName,
                      currentFile: fileName,
                      dependencies: new Set(),
                      visiting: new Set(),
                      recordDependencies: false,
                  })
                : this.resolveDestructuredToolIdentifier(
                      receiverName,
                      fileName,
                      node.expression.getStart(sourceFile),
                      {
                          rootFile: fileName,
                          currentFile: fileName,
                          dependencies: new Set(),
                          visiting: new Set(),
                          recordDependencies: false,
                      }
                  )

            if (receiver) {
                spans.add(
                    `${fileName}:${node.getStart(sourceFile)}:${node.getEnd()}`
                )
            }

            ts.forEachChild(node, visit)
        }

        visit(sourceFile)
        return spans
    }

    private getTailwindestCallKind(
        expression: ts.Expression
    ): TailwindestPropertyName | undefined {
        if (ts.isPropertyAccessExpression(expression)) {
            const name = expression.name.text
            if (isTailwindestPropertyName(name)) return name
            return undefined
        }

        if (
            ts.isIdentifier(expression) &&
            TAILWINDEST_CALL_KINDS.has(expression.text as TailwindestCallKind)
        ) {
            return expression.text as TailwindestCallKind
        }

        return undefined
    }
}

function isTailwindestPropertyName(
    value: string
): value is TailwindestPropertyName {
    return (
        TAILWINDEST_CALL_KINDS.has(value as TailwindestCallKind) ||
        value === "class" ||
        value === "style" ||
        value === "compose"
    )
}

const normalizeFileName = (fileName: string): string => {
    const normalized = path.posix.normalize(fileName)
    return normalized.startsWith("/") ? normalized : `/${normalized}`
}

const sourceKindForFileName = (fileName: string): ts.ScriptKind => {
    if (fileName.endsWith(".tsx")) {
        return ts.ScriptKind.TSX
    }
    if (fileName.endsWith(".jsx")) {
        return ts.ScriptKind.JSX
    }
    return ts.ScriptKind.TS
}

const isTailwindestModule = (moduleSpecifier: string): boolean => {
    return (
        moduleSpecifier === "tailwindest" ||
        moduleSpecifier.startsWith("tailwindest/")
    )
}

const unwrapExpression = (expression: ts.Expression): ts.Expression => {
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

const objectLiteralHasMerger = (expression: ts.Expression): boolean => {
    if (!ts.isObjectLiteralExpression(expression)) {
        return false
    }
    return expression.properties.some((property) => {
        if (ts.isShorthandPropertyAssignment(property)) {
            return property.name.text === "merger"
        }
        if (ts.isPropertyAssignment(property)) {
            return propertyNameOf(property.name) === "merger"
        }
        return false
    })
}

const isMergerFreeObjectLiteral = (
    expression: ts.ObjectLiteralExpression
): boolean => {
    return expression.properties.every((property) => {
        if (ts.isSpreadAssignment(property)) {
            return false
        }
        if (ts.isShorthandPropertyAssignment(property)) {
            return property.name.text !== "merger"
        }
        if (
            ts.isPropertyAssignment(property) ||
            ts.isMethodDeclaration(property) ||
            ts.isGetAccessorDeclaration(property) ||
            ts.isSetAccessorDeclaration(property)
        ) {
            const name = propertyNameOf(property.name)
            return Boolean(name) && name !== "merger"
        }
        return false
    })
}

const propertyNameOf = (name: ts.PropertyName): string | undefined => {
    if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
        return name.text
    }
    if (ts.isNumericLiteral(name)) {
        return name.text
    }
    return undefined
}

const findVisibleVariableDeclaration = (
    sourceFile: ts.SourceFile,
    name: string,
    position: number
): ts.VariableDeclaration | undefined => {
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

const findVisibleBindingElement = (
    sourceFile: ts.SourceFile,
    name: string,
    position: number
): ts.BindingElement | undefined => {
    let result: ts.BindingElement | undefined
    let resultStart = -1

    const visit = (node: ts.Node): void => {
        if (node.getStart(sourceFile) >= position) {
            return
        }

        if (
            ts.isBindingElement(node) &&
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

const findBindingVariableDeclaration = (
    binding: ts.BindingElement
): ts.VariableDeclaration | undefined => {
    let current: ts.Node | undefined = binding.parent
    while (current) {
        if (ts.isVariableDeclaration(current)) {
            return current
        }
        current = current.parent
    }
    return undefined
}

const declarationScopeContains = (
    sourceFile: ts.SourceFile,
    declaration: ts.Node,
    position: number
): boolean => {
    const scope = findDeclarationScope(declaration)
    if (!scope || ts.isSourceFile(scope)) {
        return true
    }

    return scope.getStart(sourceFile) <= position && position <= scope.getEnd()
}

const findDeclarationScope = (node: ts.Node): ts.Node | undefined => {
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
