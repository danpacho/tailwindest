import * as ts from "typescript"
import {
    collectMutatedBindingNames,
    findLexicalBinding,
    findVisibleVariableDeclaration,
} from "../analyzer/ast_bindings"
import type { SourceSpan, TailwindestCallKind } from "../analyzer/symbols"
import {
    compileTailwindestCall,
    type ApiCompileInput,
    type ApiCompileOptions,
    type CompileValue,
    type VariantPropsValue,
} from "../core/api_compile"
import type { CompilerDiagnostic } from "../core/diagnostic_types"
import { deepMerge } from "../core/evaluator"
import type { MergerPolicy } from "../core/merger"
import type { StaticClassValue, StaticStyleObject } from "../core/static_value"
import {
    diagnosticWithSource,
    type RichCompilerDiagnostic,
} from "../debug/diagnostics"
import type { TailwindestDebugReplacement } from "../debug/debug_manifest"
import type { CandidateRecord } from "../tailwind/manifest"
import type { ReplacementPlan } from "../transform/replacement"

export interface CompileTransformInput {
    fileName: string
    code: string
    provenCalls?: SourceSpan[] | undefined
    provenReceiverCalls?: SourceSpan[] | undefined
    resolvedCallArguments?: ResolvedCallArguments[] | undefined
    runtimeMergerCalls?: SourceSpan[] | undefined
    candidateOnlyCalls?: CandidateOnlyDebugCall[] | undefined
    variantTableLimit?: number | undefined
    merger?: MergerPolicy | undefined
    variantResolver?: ApiCompileOptions["variantResolver"] | undefined
}

export interface CompileTransformOutput {
    plans: ReplacementPlan[]
    candidates: string[]
    diagnostics: RichCompilerDiagnostic[]
    debugReplacements: TailwindestDebugReplacement[]
}

export interface ResolvedCallArguments {
    span: SourceSpan
    arguments: unknown[]
}

interface StaticBinding {
    value: unknown
    declaration: ts.VariableDeclaration
}

type StoredStylerKind = "style" | "toggle" | "rotary" | "variants"

interface StoredStylerBinding {
    kind: StoredStylerKind
    styleOrConfig: CompileValue
    initializerSpan: SourceSpan
    merger?: MergerPolicy | undefined
}

interface CompileContext {
    fileName: string
    sourceFile: ts.SourceFile
    provenCallSpans: Set<string>
    provenReceiverSpans: Set<string>
    resolvedCallArguments: Map<string, unknown[]>
    runtimeMergerCallSpans: Set<string>
    staticBindings: Map<string, StaticBinding>
    storedStylers: Map<ts.VariableDeclaration, StoredStylerBinding>
    receiverMergers: Map<ts.VariableDeclaration, MergerPolicy>
    variantTableLimit?: number | undefined
    merger?: MergerPolicy | undefined
    variantResolver?: ApiCompileOptions["variantResolver"] | undefined
}

interface TransformCallInput {
    compileInput: ApiCompileInput
    eligibilitySpan: SourceSpan
}

export interface CandidateOnlyDebugCall {
    kind: TailwindestCallKind
    span: SourceSpan
    candidates: string[]
    reason?: string | undefined
}

const RUNTIME_CREATE_TOOLS_MERGER: MergerPolicy = {
    kind: "unsupported",
    reason: "Runtime createTools merger cannot be evaluated at build time.",
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
    provenCalls,
    provenReceiverCalls,
    resolvedCallArguments,
    runtimeMergerCalls,
    candidateOnlyCalls,
    variantTableLimit,
    merger,
    variantResolver,
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
        provenCallSpans: new Set((provenCalls ?? []).map(spanKey)),
        provenReceiverSpans: new Set(
            (provenReceiverCalls ?? provenCalls ?? []).map(spanKey)
        ),
        resolvedCallArguments: new Map(
            (resolvedCallArguments ?? []).map((call) => [
                spanKey(call.span),
                call.arguments,
            ])
        ),
        runtimeMergerCallSpans: new Set(
            (runtimeMergerCalls ?? []).map(spanKey)
        ),
        staticBindings: collectStaticBindings(sourceFile),
        storedStylers: new Map(),
        receiverMergers: collectRuntimeReceiverMergers(sourceFile),
        variantTableLimit,
        merger,
        variantResolver,
    }
    context.storedStylers = collectStoredStylerBindings(sourceFile, context)
    const plans: ReplacementPlan[] = []
    const candidates: string[] = []
    const diagnostics: RichCompilerDiagnostic[] = []
    const debugReplacements: TailwindestDebugReplacement[] = []
    const consumedCandidateOnlySpans = new Set<string>()

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

        const compileInput = input.compileInput
        consumedCandidateOnlySpans.add(spanKey(input.eligibilitySpan))
        consumedCandidateOnlySpans.add(spanKey(compileInput.span))
        const result = compileTailwindestCall(compileInput, {
            variantResolver: context.variantResolver,
        })
        candidates.push(...result.candidates)

        const richDiagnostics = result.diagnostics.map((diagnostic) =>
            diagnosticWithSource(
                normalizeFallbackDiagnostic(diagnostic),
                fileName,
                compileInput.span
            )
        )
        diagnostics.push(...richDiagnostics)

        if (
            result.replacement &&
            result.exact &&
            isProvenReplacementSpan(input.eligibilitySpan, context)
        ) {
            const text = generatedText(result.generated, context.fileName)
            plans.push({
                ...result.replacement,
                text,
            })
            debugReplacements.push({
                kind: result.replacement.kind,
                originalSpan: compileInput.span,
                generatedText: text,
                candidates: result.candidates,
                candidateRecords: candidateRecordsFor(
                    result.candidates,
                    "exact",
                    compileInput.span
                ),
                status: "compiled",
                fallback: false,
            })
        } else if (!result.exact) {
            debugReplacements.push({
                kind: replacementKind(compileInput.kind),
                originalSpan: compileInput.span,
                generatedText: "",
                candidates: result.candidates,
                candidateRecords: candidateRecordsFor(
                    result.candidates,
                    "fallback-known",
                    compileInput.span
                ),
                status: "runtime-fallback",
                fallback: true,
                reason: reasonFromDiagnostics(richDiagnostics),
            })
        } else if (result.candidates.length > 0) {
            debugReplacements.push({
                kind: replacementKind(compileInput.kind),
                originalSpan: compileInput.span,
                generatedText: "",
                candidates: result.candidates,
                candidateRecords: candidateRecordsFor(
                    result.candidates,
                    "fallback-known",
                    compileInput.span
                ),
                status: "candidate-only",
                fallback: false,
                reason: "Candidates collected; no supported replacement was attempted.",
            })
        }

        ts.forEachChild(node, visit)
    }

    visit(sourceFile)

    for (const call of candidateOnlyCalls ?? []) {
        if (consumedCandidateOnlySpans.has(spanKey(call.span))) {
            continue
        }
        debugReplacements.push({
            kind: call.kind,
            originalSpan: call.span,
            generatedText: "",
            candidates: call.candidates,
            candidateRecords: candidateRecordsFor(
                call.candidates,
                "fallback-known",
                call.span
            ),
            status: "candidate-only",
            fallback: false,
            reason:
                call.reason ??
                "Candidates collected; no supported replacement was attempted.",
        })
    }

    return {
        plans,
        candidates: unique(candidates),
        diagnostics,
        debugReplacements,
    }
}

function candidateRecordsFor(
    candidates: string[],
    kind: CandidateRecord["kind"],
    sourceSpan: SourceSpan
): CandidateRecord[] {
    return candidates.map((candidate) => ({
        candidate,
        kind,
        sourceSpan,
    }))
}

function reasonFromDiagnostics(diagnostics: RichCompilerDiagnostic[]): string {
    return (
        diagnostics.find((diagnostic) => diagnostic.message.trim())?.message ??
        "Source preserved for runtime evaluation."
    )
}

function inputForCall(
    node: ts.CallExpression,
    context: CompileContext
): TransformCallInput | undefined {
    const expression = node.expression
    if (!ts.isPropertyAccessExpression(expression)) {
        return undefined
    }
    if (isOptionalCall(node) || isOptionalPropertyAccess(expression)) {
        return undefined
    }

    const directReceiver = expression.expression
    const directName = expression.name.text
    if (ts.isIdentifier(directReceiver)) {
        const storedInput = storedInputForCall(
            directReceiver,
            directName,
            node,
            context
        )
        if (storedInput) {
            return storedInput
        }

        if (isProvenReceiverSpan(node, context)) {
            const input = directInputForCall(
                directName,
                node,
                context,
                mergerForCall(spanFor(context, node), directReceiver, context)
            )
            return input
                ? withEligibility(input, spanFor(context, node))
                : undefined
        }
    }

    if (!ts.isCallExpression(directReceiver)) {
        return undefined
    }
    const composedInput = composedStylerInputForCall(
        directName,
        directReceiver,
        node,
        context
    )
    if (composedInput) return composedInput

    const stylerExpression = directReceiver.expression
    if (!ts.isPropertyAccessExpression(stylerExpression)) {
        return undefined
    }
    if (
        isOptionalCall(directReceiver) ||
        isOptionalPropertyAccess(stylerExpression)
    ) {
        return undefined
    }
    const stylerReceiver = stylerExpression.expression
    if (!ts.isIdentifier(stylerReceiver)) {
        return undefined
    }
    if (!isProvenReceiverSpan(directReceiver, context)) {
        return undefined
    }

    const eligibilitySpan = spanFor(context, directReceiver)
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
    const styleOrConfig = valueOfCallArgument(directReceiver, first, 0, context)
    const args = [...node.arguments]
    const merger = mergerForCall(eligibilitySpan, stylerReceiver, context)

    return inputForStylerCall({
        stylerKind,
        directName,
        span,
        eligibilitySpan,
        styleOrConfig,
        callNode: node,
        args,
        merger,
        context,
    })
}

function composedStylerInputForCall(
    directName: string,
    directReceiver: ts.CallExpression,
    node: ts.CallExpression,
    context: CompileContext
): TransformCallInput | undefined {
    if (directName !== "class" && directName !== "style") {
        return undefined
    }
    if (
        isOptionalCall(directReceiver) ||
        !ts.isPropertyAccessExpression(directReceiver.expression) ||
        directReceiver.expression.name.text !== "compose"
    ) {
        return undefined
    }

    const baseCall = directReceiver.expression.expression
    if (
        !ts.isCallExpression(baseCall) ||
        isOptionalCall(baseCall) ||
        !ts.isPropertyAccessExpression(baseCall.expression) ||
        baseCall.expression.name.text !== "style" ||
        !isProvenReceiverSpan(baseCall, context)
    ) {
        return undefined
    }

    const baseStyle = valueOfCallArgument(
        baseCall,
        baseCall.arguments[0],
        0,
        context
    ) as CompileValue<StaticStyleObject>
    const extraStyles = directReceiver.arguments.map(
        (arg, index) =>
            valueOfCallArgument(
                directReceiver,
                arg,
                index,
                context
            ) as CompileValue<StaticStyleObject>
    )
    const style = composeStaticStyleValue(baseStyle, extraStyles)
    if (style.kind === "unsupported") {
        return undefined
    }

    const merger = ts.isIdentifier(baseCall.expression.expression)
        ? mergerForCall(
              spanFor(context, baseCall),
              baseCall.expression.expression,
              context
          )
        : undefined

    return inputForStylerCall({
        stylerKind: "style",
        directName,
        span: spanFor(context, node),
        eligibilitySpan: spanFor(context, directReceiver),
        styleOrConfig: style,
        callNode: node,
        args: [...node.arguments],
        merger,
        context,
    })
}

function composeStaticStyleValue(
    baseStyle: CompileValue<StaticStyleObject>,
    extraStyles: Array<CompileValue<StaticStyleObject>>
): CompileValue<StaticStyleObject> {
    const unsupported = firstUnsupportedValue([baseStyle, ...extraStyles])
    if (unsupported) return unsupported
    return {
        kind: "static",
        value: deepMerge([
            staticCompileValue(baseStyle),
            ...staticCompileValues(extraStyles),
        ]),
    }
}

function firstUnsupportedValue(
    values: CompileValue[]
): Extract<CompileValue, { kind: "unsupported" }> | undefined {
    return values.find(
        (value): value is Extract<CompileValue, { kind: "unsupported" }> =>
            value.kind === "unsupported"
    )
}

function staticCompileValue<T>(value: CompileValue<T>): T {
    if (value.kind !== "static") {
        throw new Error("Expected static compile value.")
    }
    return value.value
}

function staticCompileValues<T>(values: Array<CompileValue<T>>): T[] {
    return values.map(staticCompileValue)
}

function storedInputForCall(
    receiver: ts.Identifier,
    directName: string,
    node: ts.CallExpression,
    context: CompileContext
): TransformCallInput | undefined {
    if (directName !== "class" && directName !== "style") {
        return undefined
    }
    const declaration = findVisibleVariableDeclaration(
        context.sourceFile,
        receiver.text,
        receiver.getStart(context.sourceFile)
    )
    if (
        !declaration ||
        findLexicalBinding(
            context.sourceFile,
            receiver.text,
            receiver.getStart(context.sourceFile)
        ) !== declaration
    ) {
        return undefined
    }
    const stored = context.storedStylers.get(declaration)
    if (!stored) {
        return undefined
    }

    return inputForStylerCall({
        stylerKind: stored.kind,
        directName,
        span: spanFor(context, node),
        eligibilitySpan: stored.initializerSpan,
        styleOrConfig: stored.styleOrConfig,
        callNode: node,
        args: [...node.arguments],
        merger: stored.merger,
        context,
    })
}

function inputForStylerCall({
    stylerKind,
    directName,
    span,
    eligibilitySpan,
    styleOrConfig,
    callNode,
    args,
    merger,
    context,
}: {
    stylerKind: string
    directName: string
    span: SourceSpan
    eligibilitySpan: SourceSpan
    styleOrConfig: CompileValue
    callNode: ts.CallExpression
    args: ts.NodeArray<ts.Expression> | ts.Expression[]
    merger: MergerPolicy | undefined
    context: CompileContext
}): TransformCallInput | undefined {
    const kind = `${stylerKind}.${directName}` as ApiCompileInput["kind"]

    if (stylerKind === "style") {
        if (directName === "class") {
            return withEligibility(
                {
                    kind: "style.class",
                    span,
                    style: styleOrConfig as CompileValue<StaticStyleObject>,
                    extraClass: args.map((arg, index) =>
                        valueOfCallArgument(callNode, arg, index, context)
                    ),
                    ...optionalMerger(merger),
                },
                eligibilitySpan
            )
        }
        if (directName === "style") {
            return withEligibility(
                {
                    kind: "style.style",
                    span,
                    style: styleOrConfig as CompileValue<StaticStyleObject>,
                    extraStyles: args.map(
                        (arg, index) =>
                            valueOfCallArgument(
                                callNode,
                                arg,
                                index,
                                context
                            ) as CompileValue<StaticStyleObject>
                    ),
                },
                eligibilitySpan
            )
        }
        return withEligibility(
            {
                kind: "style.compose",
                span,
                style: styleOrConfig as CompileValue<StaticStyleObject>,
                styles: args.map(
                    (arg, index) =>
                        valueOfCallArgument(
                            callNode,
                            arg,
                            index,
                            context
                        ) as CompileValue<StaticStyleObject>
                ),
            },
            eligibilitySpan
        )
    }

    if (stylerKind === "toggle") {
        const condition = valueOfCallArgument(callNode, args[0], 0, context, {
            allowDynamic: true,
        })
        if (directName === "class") {
            return withEligibility(
                {
                    kind: "toggle.class",
                    span,
                    config: styleOrConfig as never,
                    condition: condition as never,
                    extraClass: args
                        .slice(1)
                        .map((arg, index) =>
                            valueOfCallArgument(
                                callNode,
                                arg,
                                index + 1,
                                context
                            )
                        ),
                    ...optionalMerger(merger),
                },
                eligibilitySpan
            )
        }
        if (directName === "style") {
            return withEligibility(
                {
                    kind: "toggle.style",
                    span,
                    config: styleOrConfig as never,
                    condition: condition as never,
                    extraStyles: args
                        .slice(1)
                        .map(
                            (arg, index) =>
                                valueOfCallArgument(
                                    callNode,
                                    arg,
                                    index + 1,
                                    context
                                ) as never
                        ),
                },
                eligibilitySpan
            )
        }
        return withEligibility(
            {
                kind: "toggle.compose",
                span,
                config: styleOrConfig as never,
                styles: args.map(
                    (arg, index) =>
                        valueOfCallArgument(
                            callNode,
                            arg,
                            index,
                            context
                        ) as never
                ),
            },
            eligibilitySpan
        )
    }

    if (stylerKind === "rotary") {
        const key = valueOfCallArgument(callNode, args[0], 0, context, {
            allowDynamic: true,
        })
        if (directName === "class") {
            return withEligibility(
                {
                    kind: "rotary.class",
                    span,
                    config: styleOrConfig as never,
                    key: key as never,
                    extraClass: args
                        .slice(1)
                        .map((arg, index) =>
                            valueOfCallArgument(
                                callNode,
                                arg,
                                index + 1,
                                context
                            )
                        ),
                    ...optionalMerger(merger),
                },
                eligibilitySpan
            )
        }
        if (directName === "style") {
            return withEligibility(
                {
                    kind: "rotary.style",
                    span,
                    config: styleOrConfig as never,
                    key: key as never,
                    extraStyles: args
                        .slice(1)
                        .map(
                            (arg, index) =>
                                valueOfCallArgument(
                                    callNode,
                                    arg,
                                    index + 1,
                                    context
                                ) as never
                        ),
                },
                eligibilitySpan
            )
        }
        return withEligibility(
            {
                kind: "rotary.compose",
                span,
                config: styleOrConfig as never,
                styles: args.map(
                    (arg, index) =>
                        valueOfCallArgument(
                            callNode,
                            arg,
                            index,
                            context
                        ) as never
                ),
            },
            eligibilitySpan
        )
    }

    if (stylerKind === "variants") {
        const props = propsValueOfCallArgument(callNode, args[0], 0, context)
        if (directName === "class") {
            return withEligibility(
                {
                    kind: "variants.class",
                    span,
                    config: styleOrConfig as never,
                    props,
                    extraClass: args
                        .slice(1)
                        .map((arg, index) =>
                            valueOfCallArgument(
                                callNode,
                                arg,
                                index + 1,
                                context
                            )
                        ),
                    ...optionalVariantTableLimit(context.variantTableLimit),
                    ...optionalMerger(merger),
                },
                eligibilitySpan
            )
        }
        if (directName === "style") {
            return withEligibility(
                {
                    kind: "variants.style",
                    span,
                    config: styleOrConfig as never,
                    props,
                    extraStyles: args
                        .slice(1)
                        .map(
                            (arg, index) =>
                                valueOfCallArgument(
                                    callNode,
                                    arg,
                                    index + 1,
                                    context
                                ) as never
                        ),
                    ...optionalVariantTableLimit(context.variantTableLimit),
                },
                eligibilitySpan
            )
        }
        return withEligibility(
            {
                kind,
                span,
                config: styleOrConfig as never,
                styles: args.map(
                    (arg, index) =>
                        valueOfCallArgument(
                            callNode,
                            arg,
                            index,
                            context
                        ) as never
                ),
            } as ApiCompileInput,
            eligibilitySpan
        )
    }

    return undefined
}

function withEligibility(
    compileInput: ApiCompileInput,
    eligibilitySpan: SourceSpan
): TransformCallInput {
    return { compileInput, eligibilitySpan }
}

function directInputForCall(
    name: string,
    node: ts.CallExpression,
    context: CompileContext,
    merger: MergerPolicy | undefined
): ApiCompileInput | undefined {
    const span = spanFor(context, node)
    if (name === "join") {
        return {
            kind: "join",
            span,
            classList: [...node.arguments].map(
                (arg, index) =>
                    valueOfCallArgument(
                        node,
                        arg,
                        index,
                        context
                    ) as CompileValue<StaticClassValue>
            ),
            ...optionalMerger(merger),
        }
    }
    if (name === "def") {
        const [classList, ...styles] = [...node.arguments]
        return {
            kind: "def",
            span,
            classList: valueOfCallArgument(
                node,
                classList,
                0,
                context
            ) as CompileValue<StaticClassValue[]>,
            styles: styles.map(
                (arg, index) =>
                    valueOfCallArgument(
                        node,
                        arg,
                        index + 1,
                        context
                    ) as CompileValue<StaticStyleObject>
            ),
            ...optionalMerger(merger),
        }
    }
    if (name === "mergeProps") {
        return {
            kind: "mergeProps",
            span,
            styles: [...node.arguments].map(
                (arg, index) =>
                    valueOfCallArgument(
                        node,
                        arg,
                        index,
                        context
                    ) as CompileValue<StaticStyleObject>
            ),
            ...optionalMerger(merger),
        }
    }
    if (name === "mergeRecord") {
        return {
            kind: "mergeRecord",
            span,
            styles: [...node.arguments].map(
                (arg, index) =>
                    valueOfCallArgument(
                        node,
                        arg,
                        index,
                        context
                    ) as CompileValue<StaticStyleObject>
            ),
        }
    }
    return undefined
}

function valueOfCallArgument(
    node: ts.CallExpression,
    expression: ts.Expression | undefined,
    index: number,
    context: CompileContext,
    options: { allowDynamic?: boolean } = {}
): CompileValue {
    const resolved = context.resolvedCallArguments.get(
        spanKey(spanFor(context, node))
    )
    if (resolved && index < resolved.length) {
        return { kind: "static", value: resolved[index] }
    }
    return valueOf(expression, context, options)
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

function propsValueOfCallArgument(
    node: ts.CallExpression,
    expression: ts.Expression | undefined,
    index: number,
    context: CompileContext
): VariantPropsValue {
    const resolved = context.resolvedCallArguments.get(
        spanKey(spanFor(context, node))
    )
    if (resolved && index < resolved.length) {
        return {
            kind: "static",
            value: resolved[index] as Record<string, unknown>,
        }
    }
    return propsValueOf(expression, context)
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
    const orderedEntries: Array<
        | { kind: "static"; axis: string }
        | { kind: "dynamic"; axis: string; expression: string }
    > = []
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
            const entry = {
                axis: property.name.text,
                expression: property.name.text,
            }
            entries.push(entry)
            orderedEntries.push({ kind: "dynamic", ...entry })
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
            orderedEntries.push({ kind: "static", axis: name })
            continue
        }
        hasDynamic = true
        const entry = {
            axis: name,
            expression: property.initializer.getText(context.sourceFile),
        }
        entries.push(entry)
        orderedEntries.push({ kind: "dynamic", ...entry })
    }

    return hasDynamic
        ? {
              kind: "dynamic-variant-props",
              staticProps,
              entries,
              orderedEntries,
          }
        : { kind: "static", value: staticProps }
}

function collectStaticBindings(
    sourceFile: ts.SourceFile
): Map<string, StaticBinding> {
    const bindings = new Map<string, StaticBinding>()
    const mutatedBindings = collectMutatedBindingNames(sourceFile)
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
                !declaration.initializer ||
                mutatedBindings.has(declaration.name.text)
            ) {
                continue
            }
            const value = literalValueOf(declaration.initializer, {
                sourceFile,
                staticBindings: bindings,
            })
            if (value.supported) {
                bindings.set(declaration.name.text, {
                    value: value.value,
                    declaration,
                })
            }
        }
    }
    return bindings
}

function collectStoredStylerBindings(
    sourceFile: ts.SourceFile,
    context: CompileContext
): Map<ts.VariableDeclaration, StoredStylerBinding> {
    const bindings = new Map<ts.VariableDeclaration, StoredStylerBinding>()
    const mutatedBindings = collectMutatedBindingNames(sourceFile)

    const visit = (node: ts.Node): void => {
        if (
            !ts.isVariableDeclaration(node) ||
            !ts.isIdentifier(node.name) ||
            !node.initializer ||
            !isConstVariableDeclaration(node) ||
            isExportedVariableDeclaration(node) ||
            mutatedBindings.has(node.name.text)
        ) {
            ts.forEachChild(node, visit)
            return
        }

        const initializer = unwrapExpression(node.initializer)
        if (
            !ts.isCallExpression(initializer) ||
            initializer.arguments.length !== 1 ||
            !ts.isPropertyAccessExpression(initializer.expression) ||
            !ts.isIdentifier(initializer.expression.expression) ||
            isOptionalCall(initializer) ||
            isOptionalPropertyAccess(initializer.expression)
        ) {
            ts.forEachChild(node, visit)
            return
        }

        const stylerKind = initializer.expression.name.text
        if (!isStoredStylerKind(stylerKind)) {
            ts.forEachChild(node, visit)
            return
        }

        const initializerSpan = spanFor(context, initializer)
        if (!isProvenReplacementSpan(initializerSpan, context)) {
            ts.forEachChild(node, visit)
            return
        }

        const styleOrConfig = valueOfCallArgument(
            initializer,
            initializer.arguments[0],
            0,
            context
        )
        if (styleOrConfig.kind === "unsupported") {
            ts.forEachChild(node, visit)
            return
        }

        bindings.set(node, {
            kind: stylerKind,
            styleOrConfig,
            initializerSpan,
            merger: mergerForCall(
                initializerSpan,
                initializer.expression.expression,
                context
            ),
        })

        ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    for (const declaration of [...bindings.keys()]) {
        if (!isStoredStylerReferenceSafe(sourceFile, declaration)) {
            bindings.delete(declaration)
        }
    }
    return bindings
}

function isConstVariableDeclaration(
    declaration: ts.VariableDeclaration
): boolean {
    const declarationList = declaration.parent
    return (
        ts.isVariableDeclarationList(declarationList) &&
        (declarationList.flags & ts.NodeFlags.Const) === ts.NodeFlags.Const
    )
}

function isExportedVariableDeclaration(
    declaration: ts.VariableDeclaration
): boolean {
    const statement = declaration.parent.parent
    return (
        ts.isVariableStatement(statement) &&
        (ts
            .getModifiers(statement)
            ?.some(
                (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
            ) ??
            false)
    )
}

function isStoredStylerKind(kind: string): kind is StoredStylerKind {
    return (
        kind === "style" ||
        kind === "toggle" ||
        kind === "rotary" ||
        kind === "variants"
    )
}

function isStoredStylerReferenceSafe(
    sourceFile: ts.SourceFile,
    declaration: ts.VariableDeclaration
): boolean {
    if (!ts.isIdentifier(declaration.name)) {
        return false
    }
    const name = declaration.name.text
    let safe = true

    const visit = (node: ts.Node): void => {
        if (!safe) {
            return
        }
        if (
            ts.isIdentifier(node) &&
            node.text === name &&
            isValueReferenceIdentifier(node) &&
            findLexicalBinding(sourceFile, name, node.getStart(sourceFile)) ===
                declaration &&
            node !== declaration.name &&
            !isAllowedStoredStylerReceiverUse(node)
        ) {
            safe = false
            return
        }
        ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    return safe
}

function isValueReferenceIdentifier(identifier: ts.Identifier): boolean {
    const parent = identifier.parent
    if (!parent) {
        return true
    }
    if (ts.isPropertyAccessExpression(parent) && parent.name === identifier) {
        return false
    }
    if (ts.isPropertyAssignment(parent) && parent.name === identifier) {
        return false
    }
    if (
        (ts.isMethodDeclaration(parent) ||
            ts.isGetAccessorDeclaration(parent) ||
            ts.isSetAccessorDeclaration(parent)) &&
        parent.name === identifier
    ) {
        return false
    }
    return true
}

function isAllowedStoredStylerReceiverUse(identifier: ts.Identifier): boolean {
    const propertyAccess = identifier.parent
    if (
        !propertyAccess ||
        !ts.isPropertyAccessExpression(propertyAccess) ||
        propertyAccess.expression !== identifier ||
        isOptionalPropertyAccess(propertyAccess) ||
        (propertyAccess.name.text !== "class" &&
            propertyAccess.name.text !== "style")
    ) {
        return false
    }

    const call = propertyAccess.parent
    return (
        ts.isCallExpression(call) &&
        call.expression === propertyAccess &&
        !isOptionalCall(call)
    )
}

function collectRuntimeReceiverMergers(
    sourceFile: ts.SourceFile
): Map<ts.VariableDeclaration, MergerPolicy> {
    const createToolsNames = collectCreateToolsImportNames(sourceFile)
    const optionsWithMerger = new Set<ts.VariableDeclaration>()
    const declarations: ts.VariableDeclaration[] = []

    const visit = (node: ts.Node): void => {
        if (
            ts.isVariableDeclaration(node) &&
            ts.isIdentifier(node.name) &&
            node.initializer
        ) {
            declarations.push(node)
            const initializer = unwrapExpression(node.initializer)
            if (
                ts.isObjectLiteralExpression(initializer) &&
                !isMergerFreeObjectLiteral(initializer)
            ) {
                optionsWithMerger.add(node)
            }
        }
        ts.forEachChild(node, visit)
    }

    visit(sourceFile)

    const receiverMergers = new Map<ts.VariableDeclaration, MergerPolicy>()
    for (const declaration of declarations) {
        if (!ts.isIdentifier(declaration.name) || !declaration.initializer) {
            continue
        }
        const initializer = unwrapExpression(declaration.initializer)
        if (
            ts.isCallExpression(initializer) &&
            ts.isIdentifier(initializer.expression) &&
            createToolsNames.has(initializer.expression.text) &&
            createToolsCallHasRuntimeMerger(
                sourceFile,
                initializer,
                optionsWithMerger
            )
        ) {
            receiverMergers.set(declaration, RUNTIME_CREATE_TOOLS_MERGER)
        }
    }

    return receiverMergers
}

function collectCreateToolsImportNames(sourceFile: ts.SourceFile): Set<string> {
    const names = new Set<string>()

    for (const statement of sourceFile.statements) {
        if (
            !ts.isImportDeclaration(statement) ||
            !statement.importClause ||
            !ts.isStringLiteral(statement.moduleSpecifier) ||
            !isTailwindestModule(statement.moduleSpecifier.text)
        ) {
            continue
        }
        const namedBindings = statement.importClause.namedBindings
        if (!namedBindings || !ts.isNamedImports(namedBindings)) {
            continue
        }
        for (const element of namedBindings.elements) {
            const importedName = element.propertyName?.text ?? element.name.text
            if (importedName === "createTools") {
                names.add(element.name.text)
            }
        }
    }

    return names
}

function createToolsCallHasRuntimeMerger(
    sourceFile: ts.SourceFile,
    call: ts.CallExpression,
    optionsWithMerger: Set<ts.VariableDeclaration>
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
    const declaration = findVisibleVariableDeclaration(
        sourceFile,
        unwrapped.text,
        unwrapped.getStart(sourceFile)
    )
    if (!declaration?.initializer) {
        return true
    }
    if (optionsWithMerger.has(declaration)) {
        return true
    }
    const initializer = unwrapExpression(declaration.initializer)
    return ts.isObjectLiteralExpression(initializer)
        ? !isMergerFreeObjectLiteral(initializer)
        : true
}

function objectLiteralHasMerger(expression: ts.Expression): boolean {
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

function isMergerFreeObjectLiteral(
    expression: ts.ObjectLiteralExpression
): boolean {
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
        if (
            binding &&
            findLexicalBinding(
                context.sourceFile,
                expression.text,
                expression.getStart(context.sourceFile)
            ) !== binding.declaration
        ) {
            return { supported: false }
        }
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

function isProvenReceiverSpan(node: ts.Node, context: CompileContext): boolean {
    return context.provenReceiverSpans.has(spanKey(spanFor(context, node)))
}

function isProvenReplacementSpan(
    span: SourceSpan,
    context: CompileContext
): boolean {
    return context.provenCallSpans.has(spanKey(span))
}

function mergerForCall(
    callSpan: SourceSpan,
    receiver: ts.Identifier,
    context: CompileContext
): MergerPolicy | undefined {
    return context.runtimeMergerCallSpans.has(spanKey(callSpan))
        ? RUNTIME_CREATE_TOOLS_MERGER
        : mergerForReceiver(receiver, context)
}

function mergerForReceiver(
    receiver: ts.Identifier,
    context: CompileContext
): MergerPolicy | undefined {
    const declaration = findVisibleVariableDeclaration(
        context.sourceFile,
        receiver.text,
        receiver.getStart(context.sourceFile)
    )
    if (!declaration) {
        return context.merger
    }
    return context.receiverMergers.get(declaration) ?? context.merger
}

function spanKey(span: SourceSpan): string {
    return `${span.fileName}:${span.start}:${span.end}`
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

function isOptionalCall(node: ts.CallExpression): boolean {
    return Boolean(
        (node as { questionDotToken?: ts.QuestionDotToken }).questionDotToken
    )
}

function isOptionalPropertyAccess(node: ts.PropertyAccessExpression): boolean {
    return Boolean(
        (node as { questionDotToken?: ts.QuestionDotToken }).questionDotToken
    )
}

function isTailwindestModule(moduleSpecifier: string): boolean {
    return (
        moduleSpecifier === "tailwindest" ||
        moduleSpecifier.startsWith("tailwindest/")
    )
}

function generatedText(
    generated: {
        declarations: string[]
        expression: string
    },
    fileName: string
): string {
    const declarations = isTypeScriptSource(fileName)
        ? generated.declarations
        : generated.declarations.map(stripReadonlyConst)
    if (declarations.length === 0) {
        return generated.expression
    }
    return `(() => { ${declarations.join("; ")}; return ${generated.expression}; })()`
}

function normalizeFallbackDiagnostic(
    diagnostic: CompilerDiagnostic
): CompilerDiagnostic {
    if (diagnostic.severity === "error") {
        return { ...diagnostic, severity: "warning" }
    }
    return diagnostic
}

function replacementKind(kind: ApiCompileInput["kind"]): string {
    return kind.split(".")[0] ?? kind
}

function scriptKindFor(fileName: string): ts.ScriptKind {
    if (fileName.endsWith(".tsx")) {
        return ts.ScriptKind.TSX
    }
    if (fileName.endsWith(".jsx")) {
        return ts.ScriptKind.JSX
    }
    if (
        fileName.endsWith(".js") ||
        fileName.endsWith(".mjs") ||
        fileName.endsWith(".cjs")
    ) {
        return ts.ScriptKind.JS
    }
    return ts.ScriptKind.TS
}

function unique(values: string[]): string[] {
    return [...new Set(values)].sort()
}

function isTypeScriptSource(fileName: string): boolean {
    const scriptKind = scriptKindFor(fileName)
    return scriptKind === ts.ScriptKind.TS || scriptKind === ts.ScriptKind.TSX
}

function stripReadonlyConst(declaration: string): string {
    const suffix = " as const"
    return declaration.endsWith(suffix)
        ? declaration.slice(0, -suffix.length)
        : declaration
}
