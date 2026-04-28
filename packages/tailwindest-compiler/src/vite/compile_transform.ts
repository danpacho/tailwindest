import * as ts from "typescript"
import type { SourceSpan } from "../analyzer/symbols"
import {
    compileTailwindestCall,
    type ApiCompileInput,
    type CompileValue,
    type VariantPropsValue,
} from "../core/api_compile"
import type { CompilerDiagnostic } from "../core/diagnostic_types"
import type { MergerPolicy } from "../core/merger"
import type { StaticClassValue, StaticStyleObject } from "../core/static_value"
import {
    diagnosticWithSource,
    type RichCompilerDiagnostic,
    type TailwindestMode,
} from "../debug/diagnostics"
import type { TailwindestDebugReplacement } from "../debug/debug_manifest"
import type { ReplacementPlan } from "../transform/replacement"

export interface CompileTransformInput {
    fileName: string
    code: string
    mode: TailwindestMode
    variantTableLimit?: number | undefined
    merger?: MergerPolicy | undefined
}

export interface CompileTransformOutput {
    plans: ReplacementPlan[]
    candidates: string[]
    diagnostics: RichCompilerDiagnostic[]
    debugReplacements: TailwindestDebugReplacement[]
}

interface StaticBinding {
    value: unknown
}

interface CompileContext {
    fileName: string
    sourceFile: ts.SourceFile
    toolNames: Set<string>
    staticBindings: Map<string, StaticBinding>
    mode: TailwindestMode
    variantTableLimit?: number | undefined
    merger?: MergerPolicy | undefined
}

function optionalMerger(merger: MergerPolicy | undefined): {
    merger?: MergerPolicy
} {
    return merger === undefined ? {} : { merger }
}

function optionalVariantTableLimit(variantTableLimit: number | undefined): {
    variantTableLimit?: number
} {
    return variantTableLimit === undefined ? {} : { variantTableLimit }
}

export function compileTailwindestSource({
    fileName,
    code,
    mode,
    variantTableLimit,
    merger,
}: CompileTransformInput): CompileTransformOutput {
    const sourceFile = ts.createSourceFile(
        fileName,
        code,
        ts.ScriptTarget.Latest,
        true,
        scriptKindFor(fileName)
    )
    const context: CompileContext = {
        fileName,
        sourceFile,
        toolNames: collectToolNames(sourceFile),
        staticBindings: collectStaticBindings(sourceFile),
        mode,
        variantTableLimit,
        merger,
    }
    const plans: ReplacementPlan[] = []
    const candidates: string[] = []
    const diagnostics: RichCompilerDiagnostic[] = []
    const debugReplacements: TailwindestDebugReplacement[] = []

    const visit = (node: ts.Node): void => {
        if (!ts.isCallExpression(node)) {
            ts.forEachChild(node, visit)
            return
        }

        const input = inputForCall(node, context)
        if (!input) {
            ts.forEachChild(node, visit)
            return
        }

        const result = compileTailwindestCall(input)
        candidates.push(...result.candidates)

        const richDiagnostics = result.diagnostics.map((diagnostic) =>
            diagnosticWithSource(
                normalizeDiagnosticForMode(diagnostic, context.mode),
                fileName,
                input.span
            )
        )
        diagnostics.push(...richDiagnostics)

        if (result.replacement && result.exact) {
            const text = generatedText(result.generated)
            plans.push({
                ...result.replacement,
                text,
            })
            debugReplacements.push({
                kind: result.replacement.kind,
                originalSpan: input.span,
                generatedText: text,
                candidates: result.candidates,
                fallback: false,
            })
        } else if (!result.exact) {
            debugReplacements.push({
                kind: replacementKind(input.kind),
                originalSpan: input.span,
                generatedText: "",
                candidates: result.candidates,
                fallback: true,
            })
        }

        ts.forEachChild(node, visit)
    }

    visit(sourceFile)

    return {
        plans,
        candidates: unique(candidates),
        diagnostics,
        debugReplacements,
    }
}

function inputForCall(
    node: ts.CallExpression,
    context: CompileContext
): ApiCompileInput | undefined {
    const expression = node.expression
    if (!ts.isPropertyAccessExpression(expression)) {
        return undefined
    }

    const directReceiver = expression.expression
    const directName = expression.name.text
    if (
        ts.isIdentifier(directReceiver) &&
        context.toolNames.has(directReceiver.text)
    ) {
        return directInputForCall(directName, node, context)
    }

    if (!ts.isCallExpression(directReceiver)) {
        return undefined
    }
    const stylerExpression = directReceiver.expression
    if (!ts.isPropertyAccessExpression(stylerExpression)) {
        return undefined
    }
    if (
        !ts.isIdentifier(stylerExpression.expression) ||
        !context.toolNames.has(stylerExpression.expression.text)
    ) {
        return undefined
    }

    const stylerKind = stylerExpression.name.text
    if (
        stylerKind !== "style" &&
        stylerKind !== "toggle" &&
        stylerKind !== "rotary" &&
        stylerKind !== "variants"
    ) {
        return undefined
    }
    if (
        directName !== "class" &&
        directName !== "style" &&
        directName !== "compose"
    ) {
        return undefined
    }

    const span = spanFor(context, node)
    const first = directReceiver.arguments[0]
    const styleOrConfig = valueOf(first, context)
    const args = [...node.arguments]
    const kind = `${stylerKind}.${directName}` as ApiCompileInput["kind"]

    if (stylerKind === "style") {
        if (directName === "class") {
            return {
                kind: "style.class",
                span,
                style: styleOrConfig as CompileValue<StaticStyleObject>,
                extraClass: args.map((arg) => valueOf(arg, context)),
                ...optionalMerger(context.merger),
                mode: context.mode,
            }
        }
        if (directName === "style") {
            return {
                kind: "style.style",
                span,
                style: styleOrConfig as CompileValue<StaticStyleObject>,
                extraStyles: args.map(
                    (arg) =>
                        valueOf(arg, context) as CompileValue<StaticStyleObject>
                ),
            }
        }
        return {
            kind: "style.compose",
            span,
            style: styleOrConfig as CompileValue<StaticStyleObject>,
            styles: args.map(
                (arg) =>
                    valueOf(arg, context) as CompileValue<StaticStyleObject>
            ),
        }
    }

    if (stylerKind === "toggle") {
        const condition = valueOf(args[0], context, { allowDynamic: true })
        if (directName === "class") {
            return {
                kind: "toggle.class",
                span,
                config: styleOrConfig as never,
                condition: condition as never,
                extraClass: args.slice(1).map((arg) => valueOf(arg, context)),
            }
        }
        if (directName === "style") {
            return {
                kind: "toggle.style",
                span,
                config: styleOrConfig as never,
                condition: condition as never,
                extraStyles: args
                    .slice(1)
                    .map((arg) => valueOf(arg, context) as never),
            }
        }
        return {
            kind: "toggle.compose",
            span,
            config: styleOrConfig as never,
            styles: args.map((arg) => valueOf(arg, context) as never),
        }
    }

    if (stylerKind === "rotary") {
        const key = valueOf(args[0], context, { allowDynamic: true })
        if (directName === "class") {
            return {
                kind: "rotary.class",
                span,
                config: styleOrConfig as never,
                key: key as never,
                extraClass: args.slice(1).map((arg) => valueOf(arg, context)),
            }
        }
        if (directName === "style") {
            return {
                kind: "rotary.style",
                span,
                config: styleOrConfig as never,
                key: key as never,
                extraStyles: args
                    .slice(1)
                    .map((arg) => valueOf(arg, context) as never),
            }
        }
        return {
            kind: "rotary.compose",
            span,
            config: styleOrConfig as never,
            styles: args.map((arg) => valueOf(arg, context) as never),
        }
    }

    if (stylerKind === "variants") {
        const props = propsValueOf(args[0], context)
        if (directName === "class") {
            return {
                kind: "variants.class",
                span,
                config: styleOrConfig as never,
                props,
                extraClass: args.slice(1).map((arg) => valueOf(arg, context)),
                ...optionalVariantTableLimit(context.variantTableLimit),
                ...(context.mode === "loose" || context.mode === "strict"
                    ? { mode: context.mode }
                    : {}),
            }
        }
        if (directName === "style") {
            return {
                kind: "variants.style",
                span,
                config: styleOrConfig as never,
                props,
                extraStyles: args
                    .slice(1)
                    .map((arg) => valueOf(arg, context) as never),
                ...optionalVariantTableLimit(context.variantTableLimit),
                ...(context.mode === "loose" || context.mode === "strict"
                    ? { mode: context.mode }
                    : {}),
            }
        }
        return {
            kind,
            span,
            config: styleOrConfig as never,
            styles: args.map((arg) => valueOf(arg, context) as never),
        } as ApiCompileInput
    }

    return undefined
}

function directInputForCall(
    name: string,
    node: ts.CallExpression,
    context: CompileContext
): ApiCompileInput | undefined {
    const span = spanFor(context, node)
    if (name === "join") {
        return {
            kind: "join",
            span,
            classList: [...node.arguments].map(
                (arg) => valueOf(arg, context) as CompileValue<StaticClassValue>
            ),
            ...optionalMerger(context.merger),
            mode: context.mode,
        }
    }
    if (name === "def") {
        const [classList, ...styles] = [...node.arguments]
        return {
            kind: "def",
            span,
            classList: valueOf(classList, context) as CompileValue<
                StaticClassValue[]
            >,
            styles: styles.map(
                (arg) =>
                    valueOf(arg, context) as CompileValue<StaticStyleObject>
            ),
            ...optionalMerger(context.merger),
            mode: context.mode,
        }
    }
    if (name === "mergeProps") {
        return {
            kind: "mergeProps",
            span,
            styles: [...node.arguments].map(
                (arg) =>
                    valueOf(arg, context) as CompileValue<StaticStyleObject>
            ),
            ...optionalMerger(context.merger),
            mode: context.mode,
        }
    }
    if (name === "mergeRecord") {
        return {
            kind: "mergeRecord",
            span,
            styles: [...node.arguments].map(
                (arg) =>
                    valueOf(arg, context) as CompileValue<StaticStyleObject>
            ),
        }
    }
    return undefined
}

function valueOf(
    expression: ts.Expression | undefined,
    context: CompileContext,
    options: { allowDynamic?: boolean } = {}
): CompileValue {
    if (!expression) {
        return { kind: "unsupported", reason: "Missing argument." }
    }

    const literal = literalValueOf(expression, context)
    if (literal.supported) {
        return { kind: "static", value: literal.value }
    }

    if (options.allowDynamic) {
        return {
            kind: "dynamic",
            expression: expression.getText(context.sourceFile),
        }
    }

    return {
        kind: "unsupported",
        reason: `Unsupported dynamic value: ${expression.getText(context.sourceFile)}`,
    }
}

function propsValueOf(
    expression: ts.Expression | undefined,
    context: CompileContext
): VariantPropsValue {
    if (!expression) {
        return { kind: "static", value: {} }
    }
    const literal = literalValueOf(expression, context)
    if (literal.supported) {
        return {
            kind: "static",
            value: literal.value as Record<string, unknown>,
        }
    }
    if (!ts.isObjectLiteralExpression(expression)) {
        return {
            kind: "unsupported",
            reason: `Unsupported variants props: ${expression.getText(context.sourceFile)}`,
        }
    }

    const entries: Array<{ axis: string; expression: string }> = []
    const staticProps: Record<string, unknown> = {}
    let hasDynamic = false

    for (const property of expression.properties) {
        if (ts.isSpreadAssignment(property)) {
            return {
                kind: "unsupported",
                reason: "Unknown variants props spread.",
            }
        }
        if (ts.isShorthandPropertyAssignment(property)) {
            hasDynamic = true
            entries.push({
                axis: property.name.text,
                expression: property.name.text,
            })
            continue
        }
        if (!ts.isPropertyAssignment(property)) {
            continue
        }
        const name = propertyNameOf(property.name)
        if (!name) {
            return {
                kind: "unsupported",
                reason: "Unsupported variants props key.",
            }
        }
        const value = literalValueOf(property.initializer, context)
        if (value.supported) {
            staticProps[name] = value.value
            continue
        }
        hasDynamic = true
        entries.push({
            axis: name,
            expression: property.initializer.getText(context.sourceFile),
        })
    }

    return hasDynamic
        ? { kind: "dynamic-variant-props", entries }
        : { kind: "static", value: staticProps }
}

function collectToolNames(sourceFile: ts.SourceFile): Set<string> {
    const names = new Set<string>(["tw"])
    for (const statement of sourceFile.statements) {
        if (!ts.isVariableStatement(statement)) {
            continue
        }
        for (const declaration of statement.declarationList.declarations) {
            if (
                ts.isIdentifier(declaration.name) &&
                declaration.initializer &&
                ts.isCallExpression(declaration.initializer) &&
                ts.isIdentifier(declaration.initializer.expression) &&
                declaration.initializer.expression.text === "createTools"
            ) {
                names.add(declaration.name.text)
            }
        }
    }
    return names
}

function collectStaticBindings(
    sourceFile: ts.SourceFile
): Map<string, StaticBinding> {
    const bindings = new Map<string, StaticBinding>()
    for (const statement of sourceFile.statements) {
        if (!ts.isVariableStatement(statement)) {
            continue
        }
        const isConst =
            (statement.declarationList.flags & ts.NodeFlags.Const) ===
            ts.NodeFlags.Const
        if (!isConst) {
            continue
        }
        for (const declaration of statement.declarationList.declarations) {
            if (
                !ts.isIdentifier(declaration.name) ||
                !declaration.initializer
            ) {
                continue
            }
            const value = literalValueOf(declaration.initializer, {
                sourceFile,
                staticBindings: bindings,
            })
            if (value.supported) {
                bindings.set(declaration.name.text, { value: value.value })
            }
        }
    }
    return bindings
}

function literalValueOf(
    expression: ts.Expression,
    context: Pick<CompileContext, "sourceFile" | "staticBindings">
): { supported: true; value: unknown } | { supported: false } {
    if (ts.isStringLiteralLike(expression)) {
        return { supported: true, value: expression.text }
    }
    if (expression.kind === ts.SyntaxKind.TrueKeyword) {
        return { supported: true, value: true }
    }
    if (expression.kind === ts.SyntaxKind.FalseKeyword) {
        return { supported: true, value: false }
    }
    if (ts.isNumericLiteral(expression)) {
        return { supported: true, value: Number(expression.text) }
    }
    if (ts.isIdentifier(expression)) {
        const binding = context.staticBindings.get(expression.text)
        return binding
            ? { supported: true, value: binding.value }
            : { supported: false }
    }
    if (ts.isPropertyAccessExpression(expression)) {
        const receiver = literalValueOf(expression.expression, context)
        if (
            receiver.supported &&
            receiver.value &&
            typeof receiver.value === "object" &&
            expression.name.text in receiver.value
        ) {
            return {
                supported: true,
                value: (receiver.value as Record<string, unknown>)[
                    expression.name.text
                ],
            }
        }
        return { supported: false }
    }
    if (ts.isArrayLiteralExpression(expression)) {
        const values: unknown[] = []
        for (const element of expression.elements) {
            if (ts.isSpreadElement(element)) {
                return { supported: false }
            }
            const value = literalValueOf(element, context)
            if (!value.supported) {
                return { supported: false }
            }
            values.push(value.value)
        }
        return { supported: true, value: values }
    }
    if (ts.isObjectLiteralExpression(expression)) {
        const record: Record<string, unknown> = {}
        for (const property of expression.properties) {
            if (ts.isSpreadAssignment(property)) {
                return { supported: false }
            }
            if (ts.isShorthandPropertyAssignment(property)) {
                const binding = context.staticBindings.get(property.name.text)
                if (!binding) {
                    return { supported: false }
                }
                record[property.name.text] = binding.value
                continue
            }
            if (!ts.isPropertyAssignment(property)) {
                return { supported: false }
            }
            const name = propertyNameOf(property.name)
            if (!name) {
                return { supported: false }
            }
            const value = literalValueOf(property.initializer, context)
            if (!value.supported) {
                return { supported: false }
            }
            record[name] = value.value
        }
        return { supported: true, value: record }
    }
    return { supported: false }
}

function spanFor(context: CompileContext, node: ts.Node): SourceSpan {
    return {
        fileName: context.fileName,
        start: node.getStart(context.sourceFile),
        end: node.getEnd(),
    }
}

function propertyNameOf(name: ts.PropertyName): string | undefined {
    if (
        ts.isIdentifier(name) ||
        ts.isStringLiteral(name) ||
        ts.isNumericLiteral(name)
    ) {
        return name.text
    }
    return undefined
}

function generatedText(generated: {
    declarations: string[]
    expression: string
}): string {
    if (generated.declarations.length === 0) {
        return generated.expression
    }
    return `(() => { ${generated.declarations.join("; ")}; return ${generated.expression}; })()`
}

function normalizeDiagnosticForMode(
    diagnostic: CompilerDiagnostic,
    mode: TailwindestMode
): CompilerDiagnostic {
    if (diagnostic.severity === "error" && mode === "loose") {
        return { ...diagnostic, severity: "warning" }
    }
    return diagnostic
}

function replacementKind(kind: ApiCompileInput["kind"]): string {
    return kind.split(".")[0] ?? kind
}

function scriptKindFor(fileName: string): ts.ScriptKind {
    return fileName.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
}

function unique(values: string[]): string[] {
    return [...new Set(values)].sort()
}
