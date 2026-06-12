import fs from "fs/promises"
import path from "path"
import {
    CallExpression,
    Expression,
    Node,
    Project,
    SourceFile,
    SyntaxKind,
} from "ts-morph"
import {
    CSSAnalyzer,
    TailwindCompiler,
    TailwindTypeGenerator,
    TypeSchemaGenerator,
} from "create-tailwind-type"
import { TransformerRegistry } from "../../src/registry/transformer_registry"
import { TokenAnalyzerImpl } from "../../src/analyzer/token_analyzer"
import { createContext } from "../../src/context/transformer_context"
import { CvaWalker } from "../../src/walkers/cva_walker"
import { CnWalker } from "../../src/walkers/cn_walker"
import { ClassNameWalker } from "../../src/walkers/classname_walker"
import { splitClassString } from "../../src/analyzer/split_utils"

export type ClassSourceSurface =
    | "className"
    | "cn-arg"
    | "clsx-arg"
    | "classNames-arg"
    | "cva-base"
    | "cva-option"

export type CollectedClassSource = {
    file: string
    surface: ClassSourceSurface
    source: string
    tokens: string[]
    location: { line: number; column: number }
}

export const shadcnRegistryDir = path.join(
    __dirname,
    "../fixtures/shadcn_registry"
)

export async function listShadcnInputFiles(): Promise<string[]> {
    const files = await fs.readdir(shadcnRegistryDir)
    return files
        .filter((file) => file.startsWith("input_") && file.endsWith(".txt"))
        .sort()
}

export async function readShadcnFixture(file: string): Promise<string> {
    return fs.readFile(path.join(shadcnRegistryDir, file), "utf-8")
}

export async function createShadcnRegistryHarness() {
    const project = new Project({
        compilerOptions: {
            jsx: 1,
            strict: true,
            esModuleInterop: true,
        },
    })

    const compiler = new TailwindCompiler({
        cssRoot: path.resolve(
            __dirname,
            "../../../create-tailwind-type/src/generator/__tests__/__mocks__/tailwind.css"
        ),
        base: path.resolve(__dirname, "../../../../node_modules/tailwindcss"),
    })
    const cssAnalyzer = new CSSAnalyzer()
    const schemaGenerator = new TypeSchemaGenerator()

    const generator = new TailwindTypeGenerator({
        compiler,
        cssAnalyzer,
        generator: schemaGenerator,
        storeRoot: path.join(
            __dirname,
            "../../../create-tailwind-type/src/generator/__tests__/__mocks__/store/docs.json"
        ),
    }).setGenOptions({
        useDocs: true,
        useExactVariants: false,
        useArbitraryValue: false,
        useSoftVariants: true,
        useStringKindVariantsOnly: false,
        useOptionalProperty: false,
        disableVariants: true,
    })

    await generator.init()

    const analyzer = new TokenAnalyzerImpl(generator.createPropertyResolver())
    const registry = new TransformerRegistry()

    registry.register(new CvaWalker())
    registry.register(new CnWalker({ objectThreshold: 5 }))
    registry.register(new ClassNameWalker({ objectThreshold: 5 }))

    return {
        createSourceFile(file: string, content: string): SourceFile {
            return project.createSourceFile(`test_${file}.tsx`, content, {
                overwrite: true,
            })
        },
        transform(sourceFile: SourceFile) {
            const context = createContext({
                analyzer,
                tailwindestIdentifier: "tw",
                tailwindestModulePath: "~/tw",
            })

            registry.transform(sourceFile, context)

            return context
        },
    }
}

export function collectInputClassSources(
    sourceFile: SourceFile,
    file: string
): CollectedClassSource[] {
    const sources: CollectedClassSource[] = []

    const collect = (
        node: Node,
        surface: ClassSourceSurface,
        source: string
    ) => {
        const tokens = splitClassString(source)
        if (tokens.length === 0) return

        sources.push({
            file,
            surface,
            source,
            tokens,
            location: getLocation(node),
        })
    }

    sourceFile.forEachDescendant((node) => {
        if (Node.isJsxAttribute(node)) {
            const nameNode = node.getNameNode()
            if (nameNode.getText() !== "className") return

            const initializer = node.getInitializer()
            if (Node.isStringLiteral(initializer)) {
                collect(initializer, "className", initializer.getLiteralText())
                return
            }

            if (!Node.isJsxExpression(initializer)) return

            const expression = initializer.getExpression()
            const source = expression
                ? getStaticClassSourceText(expression)
                : null
            if (source !== null) collect(expression, "className", source)
            return
        }

        if (!Node.isCallExpression(node)) return

        const expression = node.getExpression()
        if (!Node.isIdentifier(expression)) return

        const callName = expression.getText()
        if (isClassJoinCallName(callName)) {
            for (const arg of node.getArguments()) {
                const source = getStaticClassSourceText(arg)
                if (source === null) continue
                collect(arg, `${callName}-arg` as ClassSourceSurface, source)
            }
            return
        }

        if (callName !== "cva") return

        const args = node.getArguments()
        const baseSource = args[0] ? getStaticClassSourceText(args[0]) : null
        if (args[0] && baseSource !== null) {
            collect(args[0], "cva-base", baseSource)
        }

        const options = args[1]
        if (!Node.isObjectLiteralExpression(options)) return

        const variantsProperty = options.getProperty("variants")
        if (!Node.isPropertyAssignment(variantsProperty)) return

        const variants = variantsProperty.getInitializer()
        if (!Node.isObjectLiteralExpression(variants)) return

        for (const variantProperty of variants.getProperties()) {
            if (!Node.isPropertyAssignment(variantProperty)) continue

            const variantOptions = variantProperty.getInitializer()
            if (!Node.isObjectLiteralExpression(variantOptions)) continue

            for (const option of variantOptions.getProperties()) {
                if (!Node.isPropertyAssignment(option)) continue

                const optionValue = option.getInitializer()
                const optionSource = optionValue
                    ? getStaticClassSourceText(optionValue)
                    : null
                if (optionValue && optionSource !== null) {
                    collect(optionValue, "cva-option", optionSource)
                }
            }
        }
    })

    return sources
}

export function collectOutputTokenCounts(
    sourceFile: SourceFile
): Map<string, number> {
    const counts = new Map<string, number>()
    const styleTokensByIdentifier = new Map<string, string[]>()
    const styleUseCounts = new Map<string, number>()

    sourceFile.forEachDescendant((node) => {
        if (Node.isVariableDeclaration(node)) {
            const initializer = node.getInitializer()
            const nameNode = node.getNameNode()

            if (
                Node.isIdentifier(nameNode) &&
                initializer &&
                Node.isCallExpression(initializer) &&
                isTailwindestCall(initializer, "style")
            ) {
                const styleObject = initializer.getArguments()[0]
                styleTokensByIdentifier.set(
                    nameNode.getText(),
                    styleObject
                        ? collectObjectStringLeafTokens(styleObject)
                        : []
                )
            }
            return
        }

        if (!Node.isCallExpression(node)) return

        if (isTailwindestCall(node, "style")) {
            if (Node.isVariableDeclaration(node.getParent())) return

            const styleObject = node.getArguments()[0]
            if (styleObject)
                addTokenList(counts, collectObjectStringLeafTokens(styleObject))
            return
        }

        if (isTailwindestCall(node, "variants")) {
            const variantsObject = node.getArguments()[0]
            if (variantsObject)
                addTokenList(
                    counts,
                    collectObjectStringLeafTokens(variantsObject)
                )
            return
        }

        if (isTailwindestCall(node, "def")) {
            const args = node.getArguments()
            const classList = args[0]
            if (!Node.isArrayLiteralExpression(classList)) return

            for (const element of classList.getElements()) {
                collectClassTokensFromExpression(element, counts)
            }

            for (const arg of args.slice(1)) {
                const styleIdentifier = getStyleMethodTargetIdentifier(arg)
                if (
                    styleIdentifier &&
                    styleTokensByIdentifier.has(styleIdentifier)
                ) {
                    increment(styleUseCounts, styleIdentifier)
                }
            }
            return
        }

        if (isTailwindestCall(node, "join")) {
            for (const arg of node.getArguments()) {
                collectClassTokensFromExpression(arg, counts)
            }
            return
        }

        if (!isClassMethodCall(node)) return

        const styleIdentifier = getClassMethodTargetIdentifier(node)
        if (styleIdentifier && styleTokensByIdentifier.has(styleIdentifier)) {
            increment(styleUseCounts, styleIdentifier)
        }

        const args = node.getArguments()
        const classArgStart =
            args[0] && Node.isObjectLiteralExpression(args[0]) ? 1 : 0

        for (const arg of args.slice(classArgStart)) {
            collectClassTokensFromExpression(arg, counts)
        }
    })

    for (const [identifier, tokens] of styleTokensByIdentifier) {
        const useCount = Math.max(1, styleUseCounts.get(identifier) ?? 0)
        for (let index = 0; index < useCount; index++) {
            addTokenList(counts, tokens)
        }
    }

    return counts
}

export function collectOutputLiteralClassSources(
    sourceFile: SourceFile
): string[] {
    const sources: string[] = []

    sourceFile.forEachDescendant((node) => {
        if (!Node.isCallExpression(node)) return

        if (isTailwindestCall(node, "def")) {
            const classList = node.getArguments()[0]
            if (!Node.isArrayLiteralExpression(classList)) return

            for (const element of classList.getElements()) {
                sources.push(...collectClassSourcesFromExpression(element))
            }
            return
        }

        if (isTailwindestCall(node, "join")) {
            for (const arg of node.getArguments()) {
                sources.push(...collectClassSourcesFromExpression(arg))
            }
            return
        }

        if (!isClassMethodCall(node)) return

        const args = node.getArguments()
        const classArgStart =
            args[0] && Node.isObjectLiteralExpression(args[0]) ? 1 : 0

        for (const arg of args.slice(classArgStart)) {
            sources.push(...collectClassSourcesFromExpression(arg))
        }
    })

    return sources.filter((source) => splitClassString(source).length > 0)
}

export function countInputTokens(
    sources: CollectedClassSource[]
): Map<string, number> {
    const counts = new Map<string, number>()

    for (const source of sources) {
        for (const token of source.tokens) {
            increment(counts, token)
        }
    }

    return counts
}

function collectObjectStringLeafTokens(node: Node): string[] {
    if (
        Node.isStringLiteral(node) ||
        Node.isNoSubstitutionTemplateLiteral(node)
    ) {
        return splitClassString(node.getLiteralText())
    }

    if (Node.isObjectLiteralExpression(node)) {
        const tokens: string[] = []
        for (const property of node.getProperties()) {
            if (Node.isPropertyAssignment(property)) {
                const initializer = property.getInitializer()
                if (initializer)
                    tokens.push(...collectObjectStringLeafTokens(initializer))
            } else if (Node.isSpreadAssignment(property)) {
                const expression = property.getExpression()
                tokens.push(...collectObjectStringLeafTokens(expression))
            }
        }
        return tokens
    }

    if (Node.isArrayLiteralExpression(node)) {
        const tokens: string[] = []
        for (const element of node.getElements()) {
            tokens.push(...collectObjectStringLeafTokens(element))
        }
        return tokens
    }

    return []
}

function collectClassTokensFromExpression(
    expression: Expression,
    counts: Map<string, number>
) {
    for (const source of collectClassSourcesFromExpression(expression)) {
        addTokens(counts, source)
    }
}

function collectClassSourcesFromExpression(expression: Expression): string[] {
    const source = getStaticClassSourceText(expression)
    if (source !== null) return [source]

    if (Node.isParenthesizedExpression(expression)) {
        return collectClassSourcesFromExpression(expression.getExpression())
    }

    if (Node.isConditionalExpression(expression)) {
        return [
            ...collectClassSourcesFromExpression(expression.getWhenTrue()),
            ...collectClassSourcesFromExpression(expression.getWhenFalse()),
        ]
    }

    if (!Node.isBinaryExpression(expression)) return []

    const operator = expression.getOperatorToken().getKind()
    if (
        operator === SyntaxKind.AmpersandAmpersandToken ||
        operator === SyntaxKind.BarBarToken
    ) {
        return collectClassSourcesFromExpression(expression.getRight())
    }

    return []
}

function getStaticClassSourceText(node: Node): string | null {
    if (
        Node.isStringLiteral(node) ||
        Node.isNoSubstitutionTemplateLiteral(node)
    ) {
        return node.getLiteralText()
    }

    if (!Node.isTaggedTemplateExpression(node)) return null
    if (node.getTag().getText() !== "String.raw") return null

    const template = node.getTemplate()
    if (!Node.isNoSubstitutionTemplateLiteral(template)) return null

    const text = template.getText()
    return text.slice(1, -1)
}

function isTailwindestCall(call: CallExpression, methodName: string): boolean {
    const expression = call.getExpression()
    if (!Node.isPropertyAccessExpression(expression)) return false

    return (
        expression.getExpression().getText() === "tw" &&
        expression.getName() === methodName
    )
}

function isClassMethodCall(call: CallExpression): boolean {
    const expression = call.getExpression()
    return (
        Node.isPropertyAccessExpression(expression) &&
        expression.getName() === "class"
    )
}

function getClassMethodTargetIdentifier(call: CallExpression): string | null {
    const expression = call.getExpression()
    if (!Node.isPropertyAccessExpression(expression)) return null

    const target = expression.getExpression()
    return Node.isIdentifier(target) ? target.getText() : null
}

function getStyleMethodTargetIdentifier(expression: Expression): string | null {
    if (!Node.isCallExpression(expression)) return null

    const callee = expression.getExpression()
    if (!Node.isPropertyAccessExpression(callee)) return null
    if (callee.getName() !== "style") return null

    const target = callee.getExpression()
    return Node.isIdentifier(target) ? target.getText() : null
}

function isClassJoinCallName(callName: string): boolean {
    return callName === "cn" || callName === "clsx" || callName === "classNames"
}

function getLocation(node: Node): { line: number; column: number } {
    return node.getSourceFile().getLineAndColumnAtPos(node.getStart())
}

function addTokens(counts: Map<string, number>, source: string) {
    for (const token of splitClassString(source)) {
        increment(counts, token)
    }
}

function addTokenList(counts: Map<string, number>, tokens: string[]) {
    for (const token of tokens) {
        increment(counts, token)
    }
}

function increment(counts: Map<string, number>, token: string) {
    counts.set(token, (counts.get(token) ?? 0) + 1)
}
