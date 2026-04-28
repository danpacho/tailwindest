import type { TailwindestCallKind, SourceSpan } from "../analyzer/symbols"
import type { ReplacementPlan } from "../transform/replacement"
import {
    createGeneratedSymbol,
    emitReadonlyConst,
    emitStringLiteral,
    emitValueLiteral,
    literalExpression,
    resetCodegenSymbolCounter,
    type GeneratedExpression,
} from "./codegen"
import type { CompilerDiagnostic } from "./diagnostic_types"
import {
    deepMerge,
    getClassName,
    join,
    mergeProps,
    mergeRecord,
} from "./evaluator"
import {
    candidatesFromClassName,
    type EvaluationMode,
    type EvaluationOptions,
    type MergerPolicy,
} from "./merger"
import type { StaticClassValue, StaticStyleObject } from "./static_value"
import {
    allRotaryStyles,
    allToggleStyles,
    allVariantStyles,
    classCandidatesFromStyles,
    composePrimitive,
    composeRotary,
    composeToggle,
    composeVariants,
    createPrimitiveModel,
    createRotaryModel,
    createToggleModel,
    createVariantsModel,
    primitiveClass,
    primitiveStyle,
    rotaryClassFor,
    rotaryStyleFor,
    toClass,
    toggleClassFor,
    toggleStyleFor,
    variantsClassFor,
    variantsStyleFor,
} from "./styler_model"
import {
    MISSING_VARIANT_VALUE,
    optimizeVariants,
    type OptimizedVariants,
    styleWritePaths,
    variantKey,
} from "./variant_optimizer"

/**
 * Compile input wrapper for a value proven static before code generation.
 *
 * @public
 */
export type StaticCompileValue<T = unknown> = {
    kind: "static"
    value: T
}

/**
 * Compile input wrapper for a dynamic expression that can still be represented
 * safely in generated lookup code.
 *
 * @public
 */
export type DynamicExpression = {
    kind: "dynamic"
    expression: string
}

/**
 * Compile input wrapper for a value that cannot be compiled exactly.
 *
 * @public
 */
export type UnsupportedCompileValue = {
    kind: "unsupported"
    reason: string
}

/**
 * Value channel accepted by the low-level per-call compiler API.
 *
 * @public
 */
export type CompileValue<T = unknown> =
    | StaticCompileValue<T>
    | DynamicExpression
    | UnsupportedCompileValue

/**
 * Dynamic variant prop expressions that can be lowered into deterministic
 * lookup tables.
 *
 * @public
 */
export interface DynamicVariantProps {
    kind: "dynamic-variant-props"
    entries: Array<{
        axis: string
        expression: string
    }>
}

/**
 * Variant props accepted by `variants.class` and `variants.style` compilation.
 *
 * @public
 */
export type VariantPropsValue =
    | StaticCompileValue<Record<string, unknown>>
    | DynamicVariantProps
    | UnsupportedCompileValue

/**
 * Low-level representation of one Tailwindest API call.
 *
 * Integrations normally use `compile()` or the Vite plugin. This union is
 * exported for tool authors that already have their own AST extraction layer.
 *
 * @public
 */
export type ApiCompileInput =
    | {
          kind: "style.class"
          span: SourceSpan
          style: CompileValue<StaticStyleObject>
          extraClass: CompileValue[]
          merger?: MergerPolicy
          mode?: EvaluationMode
      }
    | {
          kind: "style.style"
          span: SourceSpan
          style: CompileValue<StaticStyleObject>
          extraStyles: CompileValue<StaticStyleObject>[]
      }
    | {
          kind: "style.compose"
          span: SourceSpan
          style: CompileValue<StaticStyleObject>
          styles: CompileValue<StaticStyleObject>[]
      }
    | {
          kind: "toggle.class"
          span: SourceSpan
          config: CompileValue<{
              base?: StaticStyleObject
              truthy: StaticStyleObject
              falsy: StaticStyleObject
          }>
          condition: CompileValue<boolean>
          extraClass: CompileValue[]
      }
    | {
          kind: "toggle.style"
          span: SourceSpan
          config: CompileValue<{
              base?: StaticStyleObject
              truthy: StaticStyleObject
              falsy: StaticStyleObject
          }>
          condition: CompileValue<boolean>
          extraStyles: CompileValue<StaticStyleObject>[]
      }
    | {
          kind: "toggle.compose"
          span: SourceSpan
          config: CompileValue<{
              base?: StaticStyleObject
              truthy: StaticStyleObject
              falsy: StaticStyleObject
          }>
          styles: CompileValue<StaticStyleObject>[]
      }
    | {
          kind: "rotary.class"
          span: SourceSpan
          config: CompileValue<{
              base?: StaticStyleObject
              variants: Record<string, StaticStyleObject>
          }>
          key: CompileValue<string>
          extraClass: CompileValue[]
      }
    | {
          kind: "rotary.style"
          span: SourceSpan
          config: CompileValue<{
              base?: StaticStyleObject
              variants: Record<string, StaticStyleObject>
          }>
          key: CompileValue<string>
          extraStyles: CompileValue<StaticStyleObject>[]
      }
    | {
          kind: "rotary.compose"
          span: SourceSpan
          config: CompileValue<{
              base?: StaticStyleObject
              variants: Record<string, StaticStyleObject>
          }>
          styles: CompileValue<StaticStyleObject>[]
      }
    | {
          kind: "variants.class"
          span: SourceSpan
          config: CompileValue<{
              base?: StaticStyleObject
              variants: Record<string, Record<string, StaticStyleObject>>
          }>
          props: VariantPropsValue
          extraClass: CompileValue[]
          variantTableLimit?: number
          mode?: EvaluationMode
      }
    | {
          kind: "variants.style"
          span: SourceSpan
          config: CompileValue<{
              base?: StaticStyleObject
              variants: Record<string, Record<string, StaticStyleObject>>
          }>
          props: VariantPropsValue
          extraStyles: CompileValue<StaticStyleObject>[]
          variantTableLimit?: number
          mode?: EvaluationMode
      }
    | {
          kind: "variants.compose"
          span: SourceSpan
          config: CompileValue<{
              base?: StaticStyleObject
              variants: Record<string, Record<string, StaticStyleObject>>
          }>
          styles: CompileValue<StaticStyleObject>[]
      }
    | {
          kind: "join"
          span: SourceSpan
          classList: CompileValue<StaticClassValue>[]
          merger?: MergerPolicy
          mode?: EvaluationMode
      }
    | {
          kind: "def"
          span: SourceSpan
          classList: CompileValue<StaticClassValue[]>
          styles: CompileValue<StaticStyleObject>[]
          merger?: MergerPolicy
          mode?: EvaluationMode
      }
    | {
          kind: "mergeProps"
          span: SourceSpan
          styles: CompileValue<StaticStyleObject>[]
          merger?: MergerPolicy
          mode?: EvaluationMode
      }
    | {
          kind: "mergeRecord"
          span: SourceSpan
          styles: CompileValue<StaticStyleObject>[]
      }

/**
 * Result of compiling a single Tailwindest API call.
 *
 * @public
 */
export interface ApiCompileResult {
    exact: boolean
    generated: GeneratedExpression
    replacement?: ReplacementPlan
    candidates: string[]
    diagnostics: CompilerDiagnostic[]
}

/**
 * Compile one already-extracted Tailwindest call.
 *
 * The result contains generated JavaScript, Tailwind candidates, diagnostics,
 * and an optional replacement plan. It does not parse source text.
 *
 * @public
 */
export function compileTailwindestCall(
    input: ApiCompileInput
): ApiCompileResult {
    resetCodegenSymbolCounter()

    switch (input.kind) {
        case "style.class":
            return compilePrimitiveClass(input)
        case "style.style":
            return compilePrimitiveStyle(input)
        case "style.compose":
            return compilePrimitiveCompose(input)
        case "toggle.class":
            return compileToggleClass(input)
        case "toggle.style":
            return compileToggleStyle(input)
        case "toggle.compose":
            return compileToggleCompose(input)
        case "rotary.class":
            return compileRotaryClass(input)
        case "rotary.style":
            return compileRotaryStyle(input)
        case "rotary.compose":
            return compileRotaryCompose(input)
        case "variants.class":
            return compileVariantsClass(input)
        case "variants.style":
            return compileVariantsStyle(input)
        case "variants.compose":
            return compileVariantsCompose(input)
        case "join":
            return compileJoin(input)
        case "def":
            return compileDef(input)
        case "mergeProps":
            return compileMergeProps(input)
        case "mergeRecord":
            return compileMergeRecord(input)
    }
}

function compilePrimitiveClass(
    input: Extract<ApiCompileInput, { kind: "style.class" }>
): ApiCompileResult {
    const unsupported = firstUnsupported([input.style, ...input.extraClass])
    if (unsupported) return fallback(input, unsupported.reason)
    const style = staticValue(input.style)
    const extras = staticValues(input.extraClass)
    const model = createPrimitiveModel(style)
    const value = primitiveClass(model, extras)
    return exact(
        input,
        emitStringLiteral(value),
        candidatesFromClassName(value)
    )
}

function compilePrimitiveStyle(
    input: Extract<ApiCompileInput, { kind: "style.style" }>
): ApiCompileResult {
    const unsupported = firstUnsupported([input.style, ...input.extraStyles])
    if (unsupported) return fallback(input, unsupported.reason)
    const model = createPrimitiveModel(staticValue(input.style))
    const style = primitiveStyle(model, staticValues(input.extraStyles))
    return exact(
        input,
        emitValueLiteral(style),
        classCandidatesFromStyles([style])
    )
}

function compilePrimitiveCompose(
    input: Extract<ApiCompileInput, { kind: "style.compose" }>
): ApiCompileResult {
    const unsupported = firstUnsupported([input.style, ...input.styles])
    if (unsupported) return fallback(input, unsupported.reason)
    const model = composePrimitive(
        createPrimitiveModel(staticValue(input.style)),
        staticValues(input.styles)
    )
    return exactWithoutReplacement(
        input,
        emitValueLiteral(model.style),
        classCandidatesFromStyles([model.style])
    )
}

function compileToggleClass(
    input: Extract<ApiCompileInput, { kind: "toggle.class" }>
): ApiCompileResult {
    const unsupported = firstUnsupported([input.config, ...input.extraClass])
    if (unsupported) return fallback(input, unsupported.reason)
    if (isUnsupported(input.condition))
        return fallback(input, input.condition.reason)
    const model = createToggleModel(staticValue(input.config))
    const extras = staticValues(input.extraClass)
    const candidates = classCandidatesFromStyles(allToggleStyles(model)).concat(
        classCandidatesFromStrings(extras.map(String))
    )
    if (isDynamic(input.condition)) {
        const truthy = toggleClassFor(model, true, extras)
        const falsy = toggleClassFor(model, false, extras)
        return exact(
            input,
            {
                declarations: [],
                expression: `(${input.condition.expression} ? ${JSON.stringify(truthy)} : ${JSON.stringify(falsy)})`,
            },
            unique(candidates)
        )
    }
    return exact(
        input,
        emitStringLiteral(
            toggleClassFor(model, Boolean(staticValue(input.condition)), extras)
        ),
        unique(candidates)
    )
}

function compileToggleStyle(
    input: Extract<ApiCompileInput, { kind: "toggle.style" }>
): ApiCompileResult {
    const unsupported = firstUnsupported([
        input.config,
        input.condition,
        ...input.extraStyles,
    ])
    if (unsupported) return fallback(input, unsupported.reason)
    const model = createToggleModel(staticValue(input.config))
    const extras = staticValues(input.extraStyles)
    const candidates = classCandidatesFromStyles(
        allToggleStyles(model).concat(extras)
    )
    if (isDynamic(input.condition)) {
        const truthy = toggleStyleFor(model, true, extras)
        const falsy = toggleStyleFor(model, false, extras)
        return exact(
            input,
            {
                declarations: [],
                expression: `(${input.condition.expression} ? ${literalExpression(truthy)} : ${literalExpression(falsy)})`,
            },
            candidates
        )
    }
    const style = toggleStyleFor(
        model,
        Boolean(staticValue(input.condition)),
        extras
    )
    return exact(input, emitValueLiteral(style), candidates)
}

function compileToggleCompose(
    input: Extract<ApiCompileInput, { kind: "toggle.compose" }>
): ApiCompileResult {
    const unsupported = firstUnsupported([input.config, ...input.styles])
    if (unsupported) return fallback(input, unsupported.reason)
    const model = composeToggle(
        createToggleModel(staticValue(input.config)),
        staticValues(input.styles)
    )
    const style = toggleStyleFor(model, true)
    return exactWithoutReplacement(
        input,
        emitValueLiteral(style),
        classCandidatesFromStyles(allToggleStyles(model))
    )
}

function compileRotaryClass(
    input: Extract<ApiCompileInput, { kind: "rotary.class" }>
): ApiCompileResult {
    const unsupported = firstUnsupported([input.config, ...input.extraClass])
    if (unsupported) return fallback(input, unsupported.reason)
    if (isUnsupported(input.key)) return fallback(input, input.key.reason)
    const model = createRotaryModel(staticValue(input.config))
    const extras = staticValues(input.extraClass)
    const table = Object.fromEntries(
        ["base", ...Object.keys(model.variants)].map((key) => [
            key,
            rotaryClassFor(model, key, extras),
        ])
    )
    const candidates = unique(
        classCandidatesFromStyles(allRotaryStyles(model)).concat(
            classCandidatesFromStrings(extras.map(String))
        )
    )
    if (isDynamic(input.key)) {
        const symbol = createGeneratedSymbol("rotary_class")
        return exact(
            input,
            {
                declarations: [emitReadonlyConst(symbol, table)],
                expression: `${symbol}[${input.key.expression}]`,
            },
            candidates
        )
    }
    return exact(
        input,
        emitStringLiteral(table[String(staticValue(input.key))] ?? ""),
        candidates
    )
}

function compileRotaryStyle(
    input: Extract<ApiCompileInput, { kind: "rotary.style" }>
): ApiCompileResult {
    const unsupported = firstUnsupported([
        input.config,
        input.key,
        ...input.extraStyles,
    ])
    if (unsupported) return fallback(input, unsupported.reason)
    const model = createRotaryModel(staticValue(input.config))
    const extras = staticValues(input.extraStyles)
    const table = Object.fromEntries(
        ["base", ...Object.keys(model.variants)].map((key) => [
            key,
            rotaryStyleFor(model, key, extras),
        ])
    )
    const candidates = classCandidatesFromStyles(
        allRotaryStyles(model).concat(extras)
    )
    if (isDynamic(input.key)) {
        const symbol = createGeneratedSymbol("rotary_style")
        return exact(
            input,
            {
                declarations: [emitReadonlyConst(symbol, table)],
                expression: `${symbol}[${input.key.expression}]`,
            },
            candidates
        )
    }
    return exact(
        input,
        emitValueLiteral(table[String(staticValue(input.key))] ?? {}),
        candidates
    )
}

function compileRotaryCompose(
    input: Extract<ApiCompileInput, { kind: "rotary.compose" }>
): ApiCompileResult {
    const unsupported = firstUnsupported([input.config, ...input.styles])
    if (unsupported) return fallback(input, unsupported.reason)
    const model = composeRotary(
        createRotaryModel(staticValue(input.config)),
        staticValues(input.styles)
    )
    const style = rotaryStyleFor(
        model,
        Object.prototype.hasOwnProperty.call(model.variants, "sm")
            ? "sm"
            : (Object.keys(model.variants)[0] ?? "base")
    )
    return exactWithoutReplacement(
        input,
        emitValueLiteral(style),
        classCandidatesFromStyles(allRotaryStyles(model))
    )
}

function compileVariantsClass(
    input: Extract<ApiCompileInput, { kind: "variants.class" }>
): ApiCompileResult {
    const unsupported = firstUnsupported([input.config, ...input.extraClass])
    if (unsupported) return fallback(input, unsupported.reason)
    if (isUnsupported(input.props)) return fallback(input, input.props.reason)
    const model = createVariantsModel(staticValue(input.config))
    const extras = staticValues(input.extraClass)
    const candidates = unique(
        classCandidatesFromStyles(allVariantStyles(model)).concat(
            classCandidatesFromStrings(extras.map(String))
        )
    )
    if (isStatic(input.props)) {
        const value = variantsClassFor(model, input.props.value, extras)
        return exact(input, emitStringLiteral(value), candidates)
    }
    const optimized = optimizeVariants({
        base: model.base,
        variants: model.variants,
        ...optionalVariantOptions(input.variantTableLimit, input.mode),
    })
    if (!optimized.exact)
        return fallback(
            input,
            optimized.diagnostics[0]?.message ?? "variant table overflow",
            candidates,
            optimized.diagnostics
        )
    const generated = emitDynamicVariantsClass(
        model.base,
        input.props,
        optimized,
        extras
    )
    return exact(input, generated, candidates)
}

function compileVariantsStyle(
    input: Extract<ApiCompileInput, { kind: "variants.style" }>
): ApiCompileResult {
    const unsupported = firstUnsupported([input.config, ...input.extraStyles])
    if (unsupported) return fallback(input, unsupported.reason)
    if (isUnsupported(input.props)) return fallback(input, input.props.reason)
    const model = createVariantsModel(staticValue(input.config))
    const extras = staticValues(input.extraStyles)
    const candidates = classCandidatesFromStyles(
        allVariantStyles(model).concat(extras)
    )
    if (isStatic(input.props)) {
        const style = variantsStyleFor(model, input.props.value, extras)
        return exact(input, emitValueLiteral(style), candidates)
    }
    const optimized = optimizeVariants({
        base: model.base,
        variants: model.variants,
        ...optionalVariantOptions(input.variantTableLimit, input.mode),
    })
    if (!optimized.exact)
        return fallback(
            input,
            optimized.diagnostics[0]?.message ?? "variant table overflow",
            candidates,
            optimized.diagnostics
        )
    const generated = emitDynamicVariantsStyle(
        model.base,
        input.props,
        optimized,
        extras
    )
    return exact(input, generated, candidates)
}

function compileVariantsCompose(
    input: Extract<ApiCompileInput, { kind: "variants.compose" }>
): ApiCompileResult {
    const unsupported = firstUnsupported([input.config, ...input.styles])
    if (unsupported) return fallback(input, unsupported.reason)
    const model = composeVariants(
        createVariantsModel(staticValue(input.config)),
        staticValues(input.styles)
    )
    const firstAxis = Object.keys(model.variants)[0]
    const firstValue = firstAxis
        ? Object.keys(model.variants[firstAxis] ?? {})[0]
        : undefined
    const style = variantsStyleFor(
        model,
        firstAxis && firstValue ? { [firstAxis]: firstValue } : {}
    )
    return exactWithoutReplacement(
        input,
        emitValueLiteral(style),
        classCandidatesFromStyles(allVariantStyles(model))
    )
}

function compileJoin(
    input: Extract<ApiCompileInput, { kind: "join" }>
): ApiCompileResult {
    const unsupported = firstUnsupported(input.classList)
    if (unsupported) return fallback(input, unsupported.reason)
    const result = join(
        staticValues(input.classList),
        input.merger ?? { kind: "none" },
        optionalEvaluationOptions(input.mode)
    )
    return result.exact
        ? exact(
              input,
              emitStringLiteral(result.value),
              result.candidates,
              result.diagnostics
          )
        : fallback(
              input,
              result.diagnostics[0]?.message ?? "unsupported merger",
              result.candidates,
              result.diagnostics
          )
}

function compileDef(
    input: Extract<ApiCompileInput, { kind: "def" }>
): ApiCompileResult {
    const unsupported = firstUnsupported([input.classList, ...input.styles])
    if (unsupported) return fallback(input, unsupported.reason)
    const classList = staticValue(input.classList)
    const styles = staticValues(input.styles)
    const result = join(
        [...classList, getClassName(deepMerge(styles))],
        input.merger ?? { kind: "none" },
        optionalEvaluationOptions(input.mode)
    )
    return result.exact
        ? exact(
              input,
              emitStringLiteral(result.value),
              result.candidates,
              result.diagnostics
          )
        : fallback(
              input,
              result.diagnostics[0]?.message ?? "unsupported merger",
              result.candidates,
              result.diagnostics
          )
}

function compileMergeProps(
    input: Extract<ApiCompileInput, { kind: "mergeProps" }>
): ApiCompileResult {
    const unsupported = firstUnsupported(input.styles)
    if (unsupported) return fallback(input, unsupported.reason)
    const result = mergeProps(
        staticValues(input.styles),
        input.merger ?? { kind: "none" },
        optionalEvaluationOptions(input.mode)
    )
    return result.exact
        ? exact(
              input,
              emitStringLiteral(result.value),
              result.candidates,
              result.diagnostics
          )
        : fallback(
              input,
              result.diagnostics[0]?.message ?? "unsupported merger",
              result.candidates,
              result.diagnostics
          )
}

function compileMergeRecord(
    input: Extract<ApiCompileInput, { kind: "mergeRecord" }>
): ApiCompileResult {
    const unsupported = firstUnsupported(input.styles)
    if (unsupported) return fallback(input, unsupported.reason)
    const result = mergeRecord(staticValues(input.styles))
    return exact(input, emitValueLiteral(result.value), result.candidates)
}

function emitDynamicVariantsClass(
    base: StaticStyleObject,
    props: DynamicVariantProps,
    optimized: OptimizedVariants,
    extras: unknown[]
): GeneratedExpression {
    const declarations: string[] = []
    const baseResidual = omitStylePaths(base, [
        ...optimized.additiveAxes.flatMap((axis) =>
            Object.values(axis.styleMap).flatMap((style) =>
                styleWritePaths(style)
            )
        ),
        ...optimized.components.flatMap((component) =>
            Object.values(component.axisStyleMaps).flatMap((axisMap) =>
                Object.values(axisMap).flatMap((style) =>
                    styleWritePaths(style)
                )
            )
        ),
    ])
    const parts = [JSON.stringify(getClassName(baseResidual))]

    for (const axis of optimized.additiveAxes) {
        const prop = props.entries.find((entry) => entry.axis === axis.axis)
        if (!prop) continue
        const symbol = createGeneratedSymbol(`${axis.axis}_class`)
        declarations.push(emitReadonlyConst(symbol, axis.classMap))
        const fallback = JSON.stringify(axis.baseFallbackClass)
        parts.push(
            `(${prop.expression} ? ${symbol}[${prop.expression}] : ${fallback})`
        )
    }

    for (const component of optimized.components) {
        const componentProps = props.entries
            .filter((entry) => component.axes.includes(entry.axis))
            .filter((entry): entry is { axis: string; expression: string } =>
                Boolean(entry)
            )
        if (componentProps.length !== component.axes.length) continue
        const symbol = createGeneratedSymbol("component_class")
        declarations.push(
            emitReadonlyConst(
                symbol,
                createOrderedComponentClassTable(
                    base,
                    component,
                    componentProps
                )
            )
        )
        const keyExpression = componentProps
            .map(
                (entry) =>
                    `\`${entry.axis}:\${${entry.expression} ? ${entry.expression} : ${JSON.stringify(MISSING_VARIANT_VALUE)}}\``
            )
            .join(' + "|" + ')
        parts.push(`${symbol}[${keyExpression}]`)
    }

    parts.push(...extras.map((extra) => JSON.stringify(String(extra))))

    return {
        declarations,
        expression: `[${parts.join(",")}].filter(Boolean).join(" ")`,
    }
}

function createOrderedComponentClassTable(
    base: StaticStyleObject,
    component: OptimizedVariants["components"][number],
    componentProps: Array<{ axis: string; expression: string }>
): Record<string, string> {
    const entries = cartesian(
        componentProps.map((entry) =>
            [
                MISSING_VARIANT_VALUE,
                ...Object.keys(component.axisStyleMaps[entry.axis] ?? {}),
            ].map((value) => [entry.axis, value] as [string, string])
        )
    )
    const componentBaseFallback = pickStylePaths(
        base,
        component.axes.flatMap((axis) =>
            Object.values(component.axisStyleMaps[axis] ?? {}).flatMap(
                (style) => styleWritePaths(style)
            )
        )
    )

    return Object.fromEntries(
        entries.map((combination) => {
            const styles = [
                componentBaseFallback,
                ...combination
                    .filter(([, value]) => value !== MISSING_VARIANT_VALUE)
                    .map(
                        ([axis, value]) =>
                            component.axisStyleMaps[axis]?.[value] ?? {}
                    ),
            ]
            return [variantKey(combination), getClassName(deepMerge(styles))]
        })
    )
}

function emitDynamicVariantsStyle(
    base: StaticStyleObject,
    props: DynamicVariantProps,
    optimized: OptimizedVariants,
    extras: StaticStyleObject[]
): GeneratedExpression {
    const declarations: string[] = []
    const leafPaths = collectDynamicStyleLeafPaths(
        base,
        props,
        optimized,
        extras
    )
    const leaves: Array<{ path: string[]; expression: string }> = []

    for (const path of leafPaths) {
        let expression = literalExpression(getStylePath(base, path))
        for (const entry of props.entries) {
            const axisValues = optimized.axisValueKeys[entry.axis]
            if (!axisValues) continue
            const pathMap = Object.fromEntries(
                axisValues.flatMap((value) => {
                    const style = styleForAxisValue(
                        optimized,
                        entry.axis,
                        value
                    )
                    const leaf = getStylePath(style, path)
                    return leaf === undefined ? [] : [[value, leaf]]
                })
            )
            if (Object.keys(pathMap).length === 0) continue
            const symbol = createGeneratedSymbol(
                `${entry.axis}_${path.join("_")}`
            )
            declarations.push(emitReadonlyConst(symbol, pathMap))
            expression = `(${entry.expression} && ${symbol}[${entry.expression}] !== undefined ? ${symbol}[${entry.expression}] : ${expression})`
        }
        for (const extra of extras) {
            const leaf = getStylePath(extra, path)
            if (leaf !== undefined) {
                expression = literalExpression(leaf)
            }
        }
        leaves.push({ path, expression })
    }

    return {
        declarations,
        expression: emitNestedObjectFromLeaves(leaves),
    }
}

function collectDynamicStyleLeafPaths(
    base: StaticStyleObject,
    props: DynamicVariantProps,
    optimized: OptimizedVariants,
    extras: StaticStyleObject[]
): string[][] {
    return uniquePaths([
        ...styleWritePaths(base).map((path) => path.split(".")),
        ...props.entries.flatMap((entry) =>
            (optimized.axisValueKeys[entry.axis] ?? []).flatMap((value) =>
                styleWritePaths(
                    styleForAxisValue(optimized, entry.axis, value)
                ).map((path) => path.split("."))
            )
        ),
        ...extras.flatMap((style) =>
            styleWritePaths(style).map((path) => path.split("."))
        ),
    ])
}

function styleForAxisValue(
    optimized: OptimizedVariants,
    axis: string,
    value: string
): StaticStyleObject {
    const additive = optimized.additiveAxes.find((item) => item.axis === axis)
    if (additive) return additive.styleMap[value] ?? {}
    for (const component of optimized.components) {
        const style = component.axisStyleMaps[axis]?.[value]
        if (style) return style
    }
    return {}
}

function emitNestedObjectFromLeaves(
    leaves: Array<{ path: string[]; expression: string }>
): string {
    return emitNestedObjectAtPath(leaves, [])
}

function emitNestedObjectAtPath(
    leaves: Array<{ path: string[]; expression: string }>,
    prefix: string[]
): string {
    const entries: string[] = []
    const childKeys = unique(
        leaves
            .filter((leaf) => leaf.path.length > prefix.length)
            .map((leaf) => leaf.path[prefix.length]!)
    )

    for (const key of childKeys) {
        const childPrefix = [...prefix, key]
        const exactLeaf = leaves.find((leaf) =>
            pathsEqual(leaf.path, childPrefix)
        )
        const descendants = leaves.filter(
            (leaf) =>
                leaf.path.length > childPrefix.length &&
                pathStartsWith(leaf.path, childPrefix)
        )

        if (descendants.length > 0) {
            const childExpression = emitNestedObjectAtPath(leaves, childPrefix)
            const definedChecks = descendants
                .map((leaf) => `(${leaf.expression}) !== undefined`)
                .join(" || ")
            entries.push(
                `...((${definedChecks}) ? {${JSON.stringify(key)}:${childExpression}} : {})`
            )
        } else if (exactLeaf) {
            entries.push(
                `...((${exactLeaf.expression}) === undefined ? {} : {${JSON.stringify(key)}:${exactLeaf.expression}})`
            )
        }
    }

    return `({${entries.join(",")}})`
}

function getStylePath(style: StaticStyleObject, path: string[]): unknown {
    let current: unknown = style
    for (const key of path) {
        if (!current || typeof current !== "object") return undefined
        current = (current as Record<string, unknown>)[key]
    }
    return current
}

function uniquePaths(paths: string[][]): string[][] {
    const seen = new Set<string>()
    const result: string[][] = []
    for (const path of paths) {
        const key = path.join(".")
        if (seen.has(key)) continue
        seen.add(key)
        result.push(path)
    }
    return result
}

function pathsEqual(left: string[], right: string[]): boolean {
    return (
        left.length === right.length &&
        left.every((part, index) => part === right[index])
    )
}

function pathStartsWith(path: string[], prefix: string[]): boolean {
    return prefix.every((part, index) => path[index] === part)
}

function exact(
    input: ApiCompileInput,
    generated: GeneratedExpression,
    candidates: string[],
    diagnostics: CompilerDiagnostic[] = []
): ApiCompileResult {
    const result: ApiCompileResult = {
        exact: diagnostics.length === 0,
        generated,
        candidates: unique(candidates),
        diagnostics,
    }
    if (diagnostics.length === 0) {
        result.replacement = replacement(
            input,
            generated.expression,
            candidates,
            diagnostics
        )
    }
    return result
}

function exactWithoutReplacement(
    input: ApiCompileInput,
    generated: GeneratedExpression,
    candidates: string[],
    diagnostics: CompilerDiagnostic[] = []
): ApiCompileResult {
    void input
    return {
        exact: diagnostics.length === 0,
        generated,
        candidates: unique(candidates),
        diagnostics,
    }
}

function fallback(
    input: ApiCompileInput,
    reason: string,
    candidates: string[] = candidatesForFallback(input),
    diagnostics: CompilerDiagnostic[] = [
        {
            code: "UNSUPPORTED_DYNAMIC_VALUE",
            message: reason,
            severity: "error",
        },
    ]
): ApiCompileResult {
    return {
        exact: false,
        generated: {
            declarations: [],
            expression: "",
        },
        candidates: unique(candidates),
        diagnostics,
    }
}

function replacement(
    input: ApiCompileInput,
    text: string,
    candidates: string[],
    diagnostics: CompilerDiagnostic[]
): ReplacementPlan {
    return {
        span: input.span,
        text,
        priority: 0,
        kind: replacementKind(input.kind),
        candidates: unique(candidates),
        diagnostics,
    }
}

function replacementKind(kind: ApiCompileInput["kind"]): TailwindestCallKind {
    return kind.split(".")[0] as TailwindestCallKind
}

function firstUnsupported(
    values: unknown[]
): UnsupportedCompileValue | undefined {
    return values.find(isUnsupported)
}

function isStatic<T>(
    value: CompileValue<T> | VariantPropsValue
): value is StaticCompileValue<T> {
    return value.kind === "static"
}

function isDynamic(value: CompileValue): value is DynamicExpression {
    return value.kind === "dynamic"
}

function isUnsupported(value: unknown): value is UnsupportedCompileValue {
    return (
        Boolean(value) &&
        typeof value === "object" &&
        (value as UnsupportedCompileValue).kind === "unsupported"
    )
}

function staticValue<T>(value: CompileValue<T>): T {
    return (value as StaticCompileValue<T>).value
}

function staticValues<T>(values: CompileValue<T>[]): T[] {
    return values.map((value) => staticValue(value))
}

function optionalEvaluationOptions(
    mode: EvaluationMode | undefined
): EvaluationOptions {
    return mode ? { mode } : {}
}

function optionalVariantOptions(
    variantTableLimit: number | undefined,
    mode: EvaluationMode | undefined
): {
    variantTableLimit?: number
    mode?: EvaluationMode
} {
    return {
        ...(variantTableLimit === undefined ? {} : { variantTableLimit }),
        ...(mode === undefined ? {} : { mode }),
    }
}

function candidatesForFallback(input: ApiCompileInput): string[] {
    const values: StaticStyleObject[] = []
    if ("style" in input && isStatic(input.style))
        values.push(input.style.value)
    if ("config" in input && isStatic(input.config)) {
        const config = input.config.value as {
            base?: StaticStyleObject
            truthy?: StaticStyleObject
            falsy?: StaticStyleObject
            variants?: Record<
                string,
                StaticStyleObject | Record<string, StaticStyleObject>
            >
        }
        if (config.base) values.push(config.base)
        if (config.truthy) values.push(config.truthy)
        if (config.falsy) values.push(config.falsy)
        if (config.variants) {
            for (const value of Object.values(config.variants)) {
                if (isStyleObjectMap(value)) {
                    values.push(...Object.values(value))
                } else {
                    values.push(value as StaticStyleObject)
                }
            }
        }
    }
    if ("styles" in input) {
        for (const style of input.styles) {
            if (isStatic(style)) values.push(style.value)
        }
    }
    if ("extraStyles" in input) {
        for (const style of input.extraStyles) {
            if (isStatic(style)) values.push(style.value)
        }
    }
    const classCandidates = classCandidatesFromStyles(values)
    if ("classList" in input) {
        if (Array.isArray(input.classList)) {
            classCandidates.push(
                ...candidatesFromClassName(
                    toClass(staticValues(input.classList))
                )
            )
        } else if (isStatic(input.classList)) {
            classCandidates.push(
                ...candidatesFromClassName(toClass(input.classList.value))
            )
        }
    }
    return unique(classCandidates)
}

function isStyleObjectMap(
    value: unknown
): value is Record<string, StaticStyleObject> {
    return (
        Boolean(value) &&
        typeof value === "object" &&
        Object.values(value as Record<string, unknown>).every(
            (item) => item && typeof item === "object" && !Array.isArray(item)
        )
    )
}

function omitStylePaths(
    style: StaticStyleObject,
    paths: string[]
): StaticStyleObject {
    const clone = deepMerge([style])
    for (const path of paths) {
        deletePath(clone, path.split("."))
    }
    return pruneEmpty(clone)
}

function pickStylePaths(
    style: StaticStyleObject,
    paths: string[]
): StaticStyleObject {
    const picked: StaticStyleObject = {}
    for (const path of paths) {
        const parts = path.split(".")
        const value = getStylePath(style, parts)
        if (value !== undefined) {
            setStylePath(picked, parts, value)
        }
    }
    return picked
}

function setStylePath(
    style: StaticStyleObject,
    path: string[],
    value: unknown
): void {
    let current: Record<string, unknown> = style
    for (let index = 0; index < path.length - 1; index += 1) {
        const key = path[index]!
        current[key] = (current[key] ?? {}) as Record<string, unknown>
        current = current[key] as Record<string, unknown>
    }
    current[path[path.length - 1]!] = value
}

function deletePath(style: StaticStyleObject, path: string[]): void {
    if (path.length === 0) return
    const [head, ...tail] = path
    if (tail.length === 0) {
        delete style[head!]
        return
    }
    const child = style[head!]
    if (child && typeof child === "object" && !Array.isArray(child)) {
        deletePath(child as StaticStyleObject, tail)
    }
}

function pruneEmpty(style: StaticStyleObject): StaticStyleObject {
    const next: StaticStyleObject = {}
    for (const [key, value] of Object.entries(style)) {
        if (value && typeof value === "object" && !Array.isArray(value)) {
            const child = pruneEmpty(value as StaticStyleObject)
            if (Object.keys(child).length > 0) next[key] = child
            continue
        }
        next[key] = value
    }
    return next
}

function classCandidatesFromStrings(values: string[]): string[] {
    return unique(values.flatMap((value) => candidatesFromClassName(value)))
}

function cartesian<T>(groups: T[][]): T[][] {
    return groups.reduce<T[][]>(
        (acc, group) =>
            acc.flatMap((prefix) => group.map((item) => [...prefix, item])),
        [[]]
    )
}

function unique(values: string[]): string[] {
    return [...new Set(values)]
}
