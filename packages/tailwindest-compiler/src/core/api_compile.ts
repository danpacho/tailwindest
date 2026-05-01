import type { TailwindestCallKind, SourceSpan } from "../analyzer/symbols"
import type { ReplacementPlan } from "../transform/replacement"
import {
    createGeneratedSymbol,
    emitIndexableReadonlyConst,
    emitReadonlyConst,
    emitStringLiteral,
    emitValueLiteral,
    literalExpression,
    resetCodegenSymbolCounter,
    type GeneratedExpression,
} from "./codegen"
import type { CompilerDiagnostic } from "./diagnostic_types"
import {
    styleNeedsCompiledVariantMetadata,
    type CompiledStyleNormalizationOptions,
} from "./compiled_style_normalizer"
import type { CompiledVariantResolver } from "./compiled_variant_resolver"
import {
    deepMerge,
    getClassName,
    join,
    mergeProps,
    mergeRecord,
} from "./evaluator"
import {
    applyMergerPolicy,
    candidatesFromClassName,
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
    staticProps?: Record<string, unknown>
    entries: Array<{
        axis: string
        expression: string
    }>
    orderedEntries?: Array<
        | { kind: "static"; axis: string }
        | { kind: "dynamic"; axis: string; expression: string }
    >
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
          merger?: MergerPolicy
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
          merger?: MergerPolicy
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
          merger?: MergerPolicy
          variantTableLimit?: number
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
      }
    | {
          kind: "def"
          span: SourceSpan
          classList: CompileValue<StaticClassValue[]>
          styles: CompileValue<StaticStyleObject>[]
          merger?: MergerPolicy
      }
    | {
          kind: "mergeProps"
          span: SourceSpan
          styles: CompileValue<StaticStyleObject>[]
          merger?: MergerPolicy
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

export interface ApiCompileOptions extends CompiledStyleNormalizationOptions {
    variantResolver?: CompiledVariantResolver | undefined
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
    input: ApiCompileInput,
    options: ApiCompileOptions = {}
): ApiCompileResult {
    resetCodegenSymbolCounter()

    switch (input.kind) {
        case "style.class":
            return compilePrimitiveClass(input, options)
        case "style.style":
            return compilePrimitiveStyle(input, options)
        case "style.compose":
            return compilePrimitiveCompose(input, options)
        case "toggle.class":
            return compileToggleClass(input, options)
        case "toggle.style":
            return compileToggleStyle(input, options)
        case "toggle.compose":
            return compileToggleCompose(input, options)
        case "rotary.class":
            return compileRotaryClass(input, options)
        case "rotary.style":
            return compileRotaryStyle(input, options)
        case "rotary.compose":
            return compileRotaryCompose(input, options)
        case "variants.class":
            return compileVariantsClass(input, options)
        case "variants.style":
            return compileVariantsStyle(input, options)
        case "variants.compose":
            return compileVariantsCompose(input, options)
        case "join":
            return compileJoin(input)
        case "def":
            return compileDef(input, options)
        case "mergeProps":
            return compileMergeProps(input, options)
        case "mergeRecord":
            return compileMergeRecord(input, options)
    }
}

function compilePrimitiveClass(
    input: Extract<ApiCompileInput, { kind: "style.class" }>,
    options: ApiCompileOptions
): ApiCompileResult {
    const unsupported = firstUnsupported([input.style, ...input.extraClass])
    if (unsupported) return fallback(input, unsupported.reason)
    const style = staticValue(input.style)
    const missingMetadata = fallbackForMissingVariantMetadata(
        input,
        [style],
        options
    )
    if (missingMetadata) return missingMetadata
    const extras = staticValues(input.extraClass)
    const model = createPrimitiveModel(style)
    const value = primitiveClass(model, extras, options)
    const candidates = candidatesFromClassName(value)
    const mergerFallback = fallbackForClassMerger(input, candidates)
    if (mergerFallback) return mergerFallback
    return exact(input, emitStringLiteral(value), candidates)
}

function compilePrimitiveStyle(
    input: Extract<ApiCompileInput, { kind: "style.style" }>,
    options: ApiCompileOptions
): ApiCompileResult {
    const unsupported = firstUnsupported([input.style, ...input.extraStyles])
    if (unsupported) return fallback(input, unsupported.reason)
    const style = staticValue(input.style)
    const extraStyles = staticValues(input.extraStyles)
    const missingMetadata = fallbackForMissingVariantMetadata(
        input,
        [style, ...extraStyles],
        options
    )
    if (missingMetadata) return missingMetadata
    const model = createPrimitiveModel(style)
    const mergedStyle = primitiveStyle(model, extraStyles)
    return exact(
        input,
        emitValueLiteral(mergedStyle),
        classCandidatesFromStyles([mergedStyle], options)
    )
}

function compilePrimitiveCompose(
    input: Extract<ApiCompileInput, { kind: "style.compose" }>,
    options: ApiCompileOptions
): ApiCompileResult {
    const unsupported = firstUnsupported([input.style, ...input.styles])
    if (unsupported) return fallback(input, unsupported.reason)
    const style = staticValue(input.style)
    const styles = staticValues(input.styles)
    const model = composePrimitive(createPrimitiveModel(style), styles)
    const missingMetadata = fallbackForMissingVariantMetadata(
        input,
        [model.style],
        options
    )
    if (missingMetadata) return missingMetadata
    return exactWithoutReplacement(
        input,
        emitValueLiteral(model.style),
        classCandidatesFromStyles([model.style], options)
    )
}

function compileToggleClass(
    input: Extract<ApiCompileInput, { kind: "toggle.class" }>,
    options: ApiCompileOptions
): ApiCompileResult {
    const unsupported = firstUnsupported([input.config, ...input.extraClass])
    if (unsupported) return fallback(input, unsupported.reason)
    if (isUnsupported(input.condition))
        return fallback(input, input.condition.reason)
    const model = createToggleModel(staticValue(input.config))
    const styles = allToggleStyles(model)
    const missingMetadata = fallbackForMissingVariantMetadata(
        input,
        styles,
        options
    )
    if (missingMetadata) return missingMetadata
    const extras = staticValues(input.extraClass)
    const candidates = classCandidatesFromStyles(styles, options).concat(
        classCandidatesFromStrings(extras.map(String))
    )
    const mergerFallback = fallbackForClassMerger(input, candidates)
    if (mergerFallback) return mergerFallback
    if (isDynamic(input.condition)) {
        const truthy = toggleClassFor(model, true, extras, options)
        const falsy = toggleClassFor(model, false, extras, options)
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
            toggleClassFor(
                model,
                Boolean(staticValue(input.condition)),
                extras,
                options
            )
        ),
        unique(candidates)
    )
}

function compileToggleStyle(
    input: Extract<ApiCompileInput, { kind: "toggle.style" }>,
    options: ApiCompileOptions
): ApiCompileResult {
    const unsupported = firstUnsupported([
        input.config,
        input.condition,
        ...input.extraStyles,
    ])
    if (unsupported) return fallback(input, unsupported.reason)
    const model = createToggleModel(staticValue(input.config))
    const extras = staticValues(input.extraStyles)
    const styles = allToggleStyles(model).concat(extras)
    const missingMetadata = fallbackForMissingVariantMetadata(
        input,
        styles,
        options
    )
    if (missingMetadata) return missingMetadata
    const candidates = classCandidatesFromStyles(styles, options)
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
    input: Extract<ApiCompileInput, { kind: "toggle.compose" }>,
    options: ApiCompileOptions
): ApiCompileResult {
    const unsupported = firstUnsupported([input.config, ...input.styles])
    if (unsupported) return fallback(input, unsupported.reason)
    const model = composeToggle(
        createToggleModel(staticValue(input.config)),
        staticValues(input.styles)
    )
    const styles = allToggleStyles(model)
    const missingMetadata = fallbackForMissingVariantMetadata(
        input,
        styles,
        options
    )
    if (missingMetadata) return missingMetadata
    const style = toggleStyleFor(model, true)
    return exactWithoutReplacement(
        input,
        emitValueLiteral(style),
        classCandidatesFromStyles(styles, options)
    )
}

function compileRotaryClass(
    input: Extract<ApiCompileInput, { kind: "rotary.class" }>,
    options: ApiCompileOptions
): ApiCompileResult {
    const unsupported = firstUnsupported([input.config, ...input.extraClass])
    if (unsupported) return fallback(input, unsupported.reason)
    if (isUnsupported(input.key)) return fallback(input, input.key.reason)
    const model = createRotaryModel(staticValue(input.config))
    const styles = allRotaryStyles(model)
    const missingMetadata = fallbackForMissingVariantMetadata(
        input,
        styles,
        options
    )
    if (missingMetadata) return missingMetadata
    const extras = staticValues(input.extraClass)
    const table = Object.fromEntries(
        ["base", ...Object.keys(model.variants)].map((key) => [
            key,
            rotaryClassFor(model, key, extras, options),
        ])
    )
    const candidates = unique(
        classCandidatesFromStyles(styles, options).concat(
            classCandidatesFromStrings(extras.map(String))
        )
    )
    const mergerFallback = fallbackForClassMerger(input, candidates)
    if (mergerFallback) return mergerFallback
    if (isDynamic(input.key)) {
        const symbol = createGeneratedSymbol("rotary_class")
        return exact(
            input,
            {
                declarations: [emitIndexableReadonlyConst(symbol, table)],
                expression: `((key) => ${symbol}[key] !== undefined ? ${symbol}[key] : ${emitThrowExpression("Unknown rotary class key.")})(${input.key.expression})`,
            },
            candidates
        )
    }
    if (table[String(staticValue(input.key))] === undefined) {
        return exact(
            input,
            {
                declarations: [],
                expression: emitThrowExpression("Unknown rotary class key."),
            },
            candidates
        )
    }
    return exact(
        input,
        emitStringLiteral(table[String(staticValue(input.key))]!),
        candidates
    )
}

function compileRotaryStyle(
    input: Extract<ApiCompileInput, { kind: "rotary.style" }>,
    options: ApiCompileOptions
): ApiCompileResult {
    const unsupported = firstUnsupported([
        input.config,
        input.key,
        ...input.extraStyles,
    ])
    if (unsupported) return fallback(input, unsupported.reason)
    const model = createRotaryModel(staticValue(input.config))
    const extras = staticValues(input.extraStyles)
    const styles = allRotaryStyles(model).concat(extras)
    const missingMetadata = fallbackForMissingVariantMetadata(
        input,
        styles,
        options
    )
    if (missingMetadata) return missingMetadata
    const table = Object.fromEntries(
        ["base", ...Object.keys(model.variants)].map((key) => [
            key,
            rotaryStyleFor(model, key, extras),
        ])
    )
    const missing = rotaryStyleFor(model, "__missing__", extras)
    const candidates = classCandidatesFromStyles(styles, options)
    if (isDynamic(input.key)) {
        const symbol = createGeneratedSymbol("rotary_style")
        return exact(
            input,
            {
                declarations: [emitIndexableReadonlyConst(symbol, table)],
                expression: `((key) => ${symbol}[key] !== undefined ? ${symbol}[key] : ${literalExpression(missing)})(${input.key.expression})`,
            },
            candidates
        )
    }
    return exact(
        input,
        emitValueLiteral(table[String(staticValue(input.key))] ?? missing),
        candidates
    )
}

function compileRotaryCompose(
    input: Extract<ApiCompileInput, { kind: "rotary.compose" }>,
    options: ApiCompileOptions
): ApiCompileResult {
    const unsupported = firstUnsupported([input.config, ...input.styles])
    if (unsupported) return fallback(input, unsupported.reason)
    const model = composeRotary(
        createRotaryModel(staticValue(input.config)),
        staticValues(input.styles)
    )
    const styles = allRotaryStyles(model)
    const missingMetadata = fallbackForMissingVariantMetadata(
        input,
        styles,
        options
    )
    if (missingMetadata) return missingMetadata
    const style = rotaryStyleFor(
        model,
        Object.prototype.hasOwnProperty.call(model.variants, "sm")
            ? "sm"
            : (Object.keys(model.variants)[0] ?? "base")
    )
    return exactWithoutReplacement(
        input,
        emitValueLiteral(style),
        classCandidatesFromStyles(styles, options)
    )
}

function compileVariantsClass(
    input: Extract<ApiCompileInput, { kind: "variants.class" }>,
    options: ApiCompileOptions
): ApiCompileResult {
    const unsupported = firstUnsupported([input.config, ...input.extraClass])
    if (unsupported) return fallback(input, unsupported.reason)
    if (isUnsupported(input.props)) return fallback(input, input.props.reason)
    const model = createVariantsModel(staticValue(input.config))
    const styles = allVariantStyles(model)
    const missingMetadata = fallbackForMissingVariantMetadata(
        input,
        styles,
        options
    )
    if (missingMetadata) return missingMetadata
    const extras = staticValues(input.extraClass)
    const candidates = unique(
        classCandidatesFromStyles(styles, options).concat(
            classCandidatesFromStrings(extras.map(String))
        )
    )
    const mergerFallback = fallbackForClassMerger(input, candidates)
    if (mergerFallback) return mergerFallback
    if (isStatic(input.props)) {
        const value = variantsClassFor(
            model,
            input.props.value,
            extras,
            options
        )
        return exact(input, emitStringLiteral(value), candidates)
    }
    const optimized = optimizeVariants({
        base: model.base,
        variants: model.variants,
        variantResolver: options.variantResolver,
        ...optionalVariantOptions(input.variantTableLimit),
    })
    if (!optimized.exact)
        return fallback(
            input,
            optimized.diagnostics[0]?.message ?? "variant table overflow",
            candidates,
            optimized.diagnostics
        )
    const overflow = dynamicVariantTableOverflow(input.props, optimized, input)
    if (overflow)
        return fallback(input, overflow.message, candidates, [overflow])
    const generated = emitOrderedDynamicVariantsClass(
        model,
        input.props,
        optimized,
        extras,
        options
    )
    return exact(input, generated, candidates)
}

function compileVariantsStyle(
    input: Extract<ApiCompileInput, { kind: "variants.style" }>,
    options: ApiCompileOptions
): ApiCompileResult {
    const unsupported = firstUnsupported([input.config, ...input.extraStyles])
    if (unsupported) return fallback(input, unsupported.reason)
    if (isUnsupported(input.props)) return fallback(input, input.props.reason)
    const model = createVariantsModel(staticValue(input.config))
    const extras = staticValues(input.extraStyles)
    const styles = allVariantStyles(model).concat(extras)
    const missingMetadata = fallbackForMissingVariantMetadata(
        input,
        styles,
        options
    )
    if (missingMetadata) return missingMetadata
    const candidates = classCandidatesFromStyles(styles, options)
    if (isStatic(input.props)) {
        const style = variantsStyleFor(model, input.props.value, extras)
        return exact(input, emitValueLiteral(style), candidates)
    }
    const optimized = optimizeVariants({
        base: model.base,
        variants: model.variants,
        variantResolver: options.variantResolver,
        ...optionalVariantOptions(input.variantTableLimit),
    })
    if (!optimized.exact)
        return fallback(
            input,
            optimized.diagnostics[0]?.message ?? "variant table overflow",
            candidates,
            optimized.diagnostics
        )
    const overflow = orderedVariantTableOverflow(input.props, optimized, input)
    if (overflow)
        return fallback(input, overflow.message, candidates, [overflow])
    const generated = shouldUseOrderedVariantTable(input.props)
        ? emitOrderedDynamicVariantsStyle(
              model,
              input.props,
              optimized,
              extras,
              options
          )
        : emitDynamicVariantsStyle(
              model.base,
              input.props,
              optimized,
              extras,
              options
          )
    return exact(input, generated, candidates)
}

function compileVariantsCompose(
    input: Extract<ApiCompileInput, { kind: "variants.compose" }>,
    options: ApiCompileOptions
): ApiCompileResult {
    const unsupported = firstUnsupported([input.config, ...input.styles])
    if (unsupported) return fallback(input, unsupported.reason)
    const model = composeVariants(
        createVariantsModel(staticValue(input.config)),
        staticValues(input.styles)
    )
    const styles = allVariantStyles(model)
    const missingMetadata = fallbackForMissingVariantMetadata(
        input,
        styles,
        options
    )
    if (missingMetadata) return missingMetadata
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
        classCandidatesFromStyles(styles, options)
    )
}

function compileJoin(
    input: Extract<ApiCompileInput, { kind: "join" }>
): ApiCompileResult {
    const unsupported = firstUnsupported(input.classList)
    if (unsupported) return fallback(input, unsupported.reason)
    const result = join(
        staticValues(input.classList),
        input.merger ?? { kind: "none" }
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
    input: Extract<ApiCompileInput, { kind: "def" }>,
    options: ApiCompileOptions
): ApiCompileResult {
    const unsupported = firstUnsupported([input.classList, ...input.styles])
    if (unsupported) return fallback(input, unsupported.reason)
    const classList = staticValue(input.classList)
    const styles = staticValues(input.styles)
    const missingMetadata = fallbackForMissingVariantMetadata(
        input,
        styles,
        options
    )
    if (missingMetadata) return missingMetadata
    const result = join(
        [...classList, getClassName(deepMerge(styles), options)],
        input.merger ?? { kind: "none" }
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
    input: Extract<ApiCompileInput, { kind: "mergeProps" }>,
    options: ApiCompileOptions
): ApiCompileResult {
    const unsupported = firstUnsupported(input.styles)
    if (unsupported) return fallback(input, unsupported.reason)
    const styles = staticValues(input.styles)
    const missingMetadata = fallbackForMissingVariantMetadata(
        input,
        styles,
        options
    )
    if (missingMetadata) return missingMetadata
    const result = mergeProps(styles, input.merger ?? { kind: "none" }, options)
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
    input: Extract<ApiCompileInput, { kind: "mergeRecord" }>,
    options: ApiCompileOptions
): ApiCompileResult {
    const unsupported = firstUnsupported(input.styles)
    if (unsupported) return fallback(input, unsupported.reason)
    const styles = staticValues(input.styles)
    const missingMetadata = fallbackForMissingVariantMetadata(
        input,
        styles,
        options
    )
    if (missingMetadata) return missingMetadata
    const result = mergeRecord(styles, options)
    return exact(input, emitValueLiteral(result.value), result.candidates)
}

function emitOrderedDynamicVariantsClass(
    model: ReturnType<typeof createVariantsModel>,
    props: DynamicVariantProps,
    optimized: OptimizedVariants,
    extras: unknown[],
    options: ApiCompileOptions
): GeneratedExpression {
    const entries = dynamicVariantLookupEntries(props, optimized)
    const table = createOrderedVariantResultTable(props, entries, (item) =>
        variantsClassFor(model, item, extras, options)
    )
    const symbol = createGeneratedSymbol("variants_class")
    return {
        declarations: [emitIndexableReadonlyConst(symbol, table)],
        expression: `${symbol}[${dynamicVariantKeyExpression(entries)}]`,
    }
}

function emitOrderedDynamicVariantsStyle(
    model: ReturnType<typeof createVariantsModel>,
    props: DynamicVariantProps,
    optimized: OptimizedVariants,
    extras: StaticStyleObject[],
    options: ApiCompileOptions
): GeneratedExpression {
    void options
    const entries = dynamicVariantLookupEntries(props, optimized)
    const table = createOrderedVariantResultTable(props, entries, (item) =>
        variantsStyleFor(model, item, extras)
    )
    const symbol = createGeneratedSymbol("variants_style")
    return {
        declarations: [emitIndexableReadonlyConst(symbol, table)],
        expression: `${symbol}[${dynamicVariantKeyExpression(entries)}]`,
    }
}

function emitDynamicVariantsStyle(
    base: StaticStyleObject,
    props: DynamicVariantProps,
    optimized: OptimizedVariants,
    extras: StaticStyleObject[],
    options: ApiCompileOptions
): GeneratedExpression {
    void options
    const declarations: string[] = []
    const dynamicEntries = props.entries.map((entry) => ({
        ...entry,
        valueSymbol: createGeneratedSymbol(`${entry.axis}_value`),
    }))
    const leafPaths = collectDynamicStyleLeafPaths(
        base,
        props,
        optimized,
        extras
    )
    const leaves: Array<{ path: string[]; expression: string }> = []

    for (const path of leafPaths) {
        let expression = literalExpression(getStylePath(base, path))
        for (const entry of dynamicEntries) {
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
            declarations.push(emitIndexableReadonlyConst(symbol, pathMap))
            expression = `(${entry.valueSymbol} && ${symbol}[${entry.valueSymbol}] !== undefined ? ${symbol}[${entry.valueSymbol}] : ${expression})`
        }
        for (const extra of extras) {
            const leaf = getStylePath(extra, path)
            if (leaf !== undefined) {
                expression = literalExpression(leaf)
            }
        }
        leaves.push({ path, expression })
    }

    const expression = emitNestedObjectFromLeaves(leaves)
    return {
        declarations,
        expression:
            dynamicEntries.length === 0
                ? expression
                : `((${dynamicEntries.map((entry) => entry.valueSymbol).join(",")}) => ${expression})(${dynamicEntries.map((entry) => `(${entry.expression})`).join(",")})`,
    }
}

type DynamicVariantLookupEntry = {
    axis: string
    expression: string
    values: string[]
}

type OrderedVariantEntry = NonNullable<
    DynamicVariantProps["orderedEntries"]
>[number]

function shouldUseOrderedVariantTable(props: DynamicVariantProps): boolean {
    return (
        Object.keys(staticVariantProps(props)).length > 0 ||
        Boolean(props.orderedEntries?.some((entry) => entry.kind === "static"))
    )
}

function orderedVariantTableOverflow(
    props: DynamicVariantProps,
    optimized: OptimizedVariants,
    input: ApiCompileInput
): CompilerDiagnostic | undefined {
    if (!shouldUseOrderedVariantTable(props)) return undefined
    return dynamicVariantTableOverflow(props, optimized, input)
}

function dynamicVariantTableOverflow(
    props: DynamicVariantProps,
    optimized: OptimizedVariants,
    input: ApiCompileInput
): CompilerDiagnostic | undefined {
    const entries = dynamicVariantLookupEntries(props, optimized)
    const count = entries.reduce(
        (total, entry) => total * (entry.values.length + 1),
        1
    )
    const limit =
        (input as { variantTableLimit?: number }).variantTableLimit ?? 256
    if (count <= limit) return undefined

    return {
        code: "VARIANT_TABLE_LIMIT_EXCEEDED",
        message: `Variant table for ${entries.map((entry) => entry.axis).join(", ")} has ${count} entries, exceeding limit ${limit}.`,
        severity: "warning",
    }
}

function createOrderedVariantResultTable<T>(
    props: DynamicVariantProps,
    entries: DynamicVariantLookupEntry[],
    evaluate: (props: Record<string, unknown>) => T
): Record<string, T> {
    const groups = entries.map((entry) => [undefined, ...entry.values])
    return Object.fromEntries(
        cartesian(groups).map((combination) => {
            const dynamicValues = Object.fromEntries(
                combination.map((value, index) => [entries[index]!.axis, value])
            )
            return [
                dynamicVariantKey(entries, combination),
                evaluate(orderedVariantProps(props, dynamicValues)),
            ]
        })
    )
}

function dynamicVariantLookupEntries(
    props: DynamicVariantProps,
    optimized: OptimizedVariants
): DynamicVariantLookupEntry[] {
    const seen = new Set<string>()
    const entries: DynamicVariantLookupEntry[] = []
    for (const entry of orderedVariantEntries(props)) {
        if (entry.kind !== "dynamic" || seen.has(entry.axis)) continue
        const values = optimized.axisValueKeys[entry.axis]
        if (!values) continue
        seen.add(entry.axis)
        entries.push({ ...entry, values })
    }
    return entries
}

function orderedVariantProps(
    props: DynamicVariantProps,
    dynamicValues: Record<string, string | undefined>
): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    const staticProps = staticVariantProps(props)

    for (const entry of orderedVariantEntries(props)) {
        if (entry.kind === "static") {
            result[entry.axis] = staticProps[entry.axis]
            continue
        }
        result[entry.axis] = dynamicValues[entry.axis]
    }

    return result
}

function orderedVariantEntries(
    props: DynamicVariantProps
): OrderedVariantEntry[] {
    const entries: OrderedVariantEntry[] = [...(props.orderedEntries ?? [])]
    const staticProps = staticVariantProps(props)
    const staticAxes = new Set(
        entries
            .filter((entry) => entry.kind === "static")
            .map((entry) => entry.axis)
    )
    const dynamicAxes = new Set(
        entries
            .filter((entry) => entry.kind === "dynamic")
            .map((entry) => entry.axis)
    )

    for (const axis of Object.keys(staticProps)) {
        if (!staticAxes.has(axis)) entries.push({ kind: "static", axis })
    }
    for (const entry of props.entries) {
        if (!dynamicAxes.has(entry.axis)) {
            entries.push({ kind: "dynamic", ...entry })
        }
    }

    return entries
}

function staticVariantProps(
    props: DynamicVariantProps
): Record<string, unknown> {
    return props.staticProps ?? {}
}

function dynamicVariantKey(
    entries: DynamicVariantLookupEntry[],
    values: Array<string | undefined>
): string {
    return variantKey(
        entries.map(
            (entry, index) =>
                [entry.axis, values[index]] as [string, string | undefined]
        )
    )
}

function dynamicVariantKeyExpression(
    entries: DynamicVariantLookupEntry[]
): string {
    if (entries.length === 0) return JSON.stringify(variantKey([]))
    return entries
        .map((entry) => {
            const expression = `(${entry.expression})`
            return `${JSON.stringify(`${entry.axis}:`)} + ((value) => value === undefined ? "m" : "v:" + value)(${dynamicVariantValueExpression(expression, entry.values)})`
        })
        .join(' + "|" + ')
}

function dynamicVariantValueExpression(
    expression: string,
    values: string[]
): string {
    return `((value) => value && ${JSON.stringify(values)}.includes(String(value)) ? String(value) : undefined)(${expression})`
}

function emitThrowExpression(message: string): string {
    return `(() => { throw new TypeError(${JSON.stringify(message)}) })()`
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
    const finalDiagnostics =
        diagnosticsWithCompiledVariantClassOutputRequirement(input, diagnostics)
    const result: ApiCompileResult = {
        exact: finalDiagnostics.length === 0,
        generated,
        candidates: unique(candidates),
        diagnostics: finalDiagnostics,
    }
    if (finalDiagnostics.length === 0 && canCreateReplacement(input.kind)) {
        result.replacement = replacement(
            input,
            generated.expression,
            candidates,
            finalDiagnostics
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
    const finalDiagnostics =
        diagnosticsWithCompiledVariantClassOutputRequirement(input, diagnostics)
    return {
        exact: finalDiagnostics.length === 0,
        generated,
        candidates: unique(candidates),
        diagnostics: finalDiagnostics,
    }
}

function fallbackForClassMerger(
    input: ApiCompileInput,
    candidates: string[]
): ApiCompileResult | undefined {
    const policy = "merger" in input ? input.merger : undefined
    if (!policy || policy.kind === "none") return undefined

    const result = applyMergerPolicy("", policy)
    return fallback(
        input,
        result.diagnostics[0]?.message ?? "unsupported merger",
        candidates,
        result.diagnostics
    )
}

function fallbackForMissingVariantMetadata(
    input: ApiCompileInput,
    styles: unknown[],
    options: ApiCompileOptions
): ApiCompileResult | undefined {
    if (options.variantResolver) return undefined
    if (!styles.some(styleNeedsCompiledVariantMetadata)) return undefined

    return fallback(
        input,
        "Compiled variant metadata is required for nested compiled shorthand.",
        [],
        [
            {
                code: "MISSING_COMPILED_VARIANT_METADATA",
                message:
                    "Compiled variant metadata is required for nested compiled shorthand.",
                severity: "error",
            },
        ]
    )
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
    const finalDiagnostics =
        diagnosticsWithCompiledVariantClassOutputRequirement(input, diagnostics)
    return {
        exact: false,
        generated: {
            declarations: [],
            expression: "",
        },
        candidates: unique(candidates),
        diagnostics: finalDiagnostics,
    }
}

function diagnosticsWithCompiledVariantClassOutputRequirement(
    input: ApiCompileInput,
    diagnostics: CompilerDiagnostic[]
): CompilerDiagnostic[] {
    if (
        diagnostics.some(
            (diagnostic) =>
                diagnostic.code === "MISSING_COMPILED_VARIANT_METADATA" ||
                diagnostic.code === "COMPILED_VARIANT_REQUIRES_CLASS_OUTPUT"
        )
    ) {
        return diagnostics
    }
    if (diagnostics.length === 0 && canCreateReplacement(input.kind)) {
        return diagnostics
    }
    if (!inputContainsCompiledVariantShorthand(input)) {
        return diagnostics
    }
    return [...diagnostics, compiledVariantRequiresClassOutputDiagnostic()]
}

function compiledVariantRequiresClassOutputDiagnostic(): CompilerDiagnostic {
    return {
        code: "COMPILED_VARIANT_REQUIRES_CLASS_OUTPUT",
        message:
            "Nested compiled shorthand requires compilation to a final class string; preserving this call at runtime would emit unprefixed classes.",
        severity: "error",
    }
}

function inputContainsCompiledVariantShorthand(
    input: ApiCompileInput
): boolean {
    return inputStaticStyles(input).some(styleNeedsCompiledVariantMetadata)
}

function inputStaticStyles(input: ApiCompileInput): unknown[] {
    switch (input.kind) {
        case "style.class":
            return staticStyleValues([input.style])
        case "style.style":
            return staticStyleValues([input.style, ...input.extraStyles])
        case "style.compose":
            return staticStyleValues([input.style, ...input.styles])
        case "toggle.class":
            return toggleStaticStyles(input.config)
        case "toggle.style":
            return [
                ...toggleStaticStyles(input.config),
                ...staticStyleValues(input.extraStyles),
            ]
        case "toggle.compose":
            return [
                ...toggleStaticStyles(input.config),
                ...staticStyleValues(input.styles),
            ]
        case "rotary.class":
            return rotaryStaticStyles(input.config)
        case "rotary.style":
            return [
                ...rotaryStaticStyles(input.config),
                ...staticStyleValues(input.extraStyles),
            ]
        case "rotary.compose":
            return [
                ...rotaryStaticStyles(input.config),
                ...staticStyleValues(input.styles),
            ]
        case "variants.class":
            return variantsStaticStyles(input.config)
        case "variants.style":
            return [
                ...variantsStaticStyles(input.config),
                ...staticStyleValues(input.extraStyles),
            ]
        case "variants.compose":
            return [
                ...variantsStaticStyles(input.config),
                ...staticStyleValues(input.styles),
            ]
        case "def":
        case "mergeProps":
        case "mergeRecord":
            return staticStyleValues(input.styles)
        case "join":
            return []
    }
}

function staticStyleValues(
    values: Array<CompileValue<StaticStyleObject>>
): unknown[] {
    return values.flatMap((value) => (isStatic(value) ? [value.value] : []))
}

function toggleStaticStyles(
    config: CompileValue<{
        base?: StaticStyleObject
        truthy: StaticStyleObject
        falsy: StaticStyleObject
    }>
): unknown[] {
    if (!isStatic(config)) return []
    return [config.value.base, config.value.truthy, config.value.falsy]
}

function rotaryStaticStyles(
    config: CompileValue<{
        base?: StaticStyleObject
        variants: Record<string, StaticStyleObject>
    }>
): unknown[] {
    if (!isStatic(config)) return []
    return [config.value.base, ...Object.values(config.value.variants)]
}

function variantsStaticStyles(
    config: CompileValue<{
        base?: StaticStyleObject
        variants: Record<string, Record<string, StaticStyleObject>>
    }>
): unknown[] {
    if (!isStatic(config)) return []
    return [
        config.value.base,
        ...Object.values(config.value.variants).flatMap((axis) =>
            Object.values(axis)
        ),
    ]
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

function canCreateReplacement(kind: ApiCompileInput["kind"]): boolean {
    return (
        kind === "style.class" ||
        kind === "toggle.class" ||
        kind === "rotary.class" ||
        kind === "variants.class" ||
        kind === "def" ||
        kind === "mergeProps"
    )
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

function optionalVariantOptions(variantTableLimit: number | undefined): {
    variantTableLimit?: number
} {
    return variantTableLimit === undefined ? {} : { variantTableLimit }
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
