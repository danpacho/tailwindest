import * as ts from "typescript"

export interface TailwindTypesetIndex {
    hasKey(key: string): boolean
    hasNestGroup(group: string): boolean
    matchUtility(utility: string, candidateKeys?: string[]): string[]
}

export interface CreateTailwindTypesetIndexInput {
    tailwindSource: string
}

export function createTailwindTypesetIndex({
    tailwindSource,
}: CreateTailwindTypesetIndexInput): TailwindTypesetIndex {
    const fileName = "/__tailwindest_generated_tailwind.ts"
    const compilerOptions: ts.CompilerOptions = {
        strict: true,
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        noEmit: true,
        skipLibCheck: true,
    }
    const baseHost = ts.createCompilerHost(compilerOptions, true)
    const host: ts.CompilerHost = {
        ...baseHost,
        fileExists: (requestedFileName) =>
            requestedFileName === fileName ||
            baseHost.fileExists(requestedFileName),
        readFile: (requestedFileName) =>
            requestedFileName === fileName
                ? tailwindSource
                : baseHost.readFile(requestedFileName),
        getSourceFile: (
            requestedFileName,
            languageVersion,
            onError,
            shouldCreateNewSourceFile
        ) => {
            if (requestedFileName === fileName) {
                return ts.createSourceFile(
                    requestedFileName,
                    tailwindSource,
                    languageVersion,
                    true
                )
            }
            return baseHost.getSourceFile(
                requestedFileName,
                languageVersion,
                onError,
                shouldCreateNewSourceFile
            )
        },
    }

    const program = ts.createProgram([fileName], compilerOptions, host)
    const diagnostics = program.getSemanticDiagnostics()
    if (diagnostics.length > 0) {
        const message = diagnostics
            .slice(0, 5)
            .map((diagnostic) =>
                ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
            )
            .join("\n")
        throw new Error(`Tailwind typeset index generation failed:\n${message}`)
    }

    const sourceFile = program.getSourceFile(fileName)
    if (!sourceFile) {
        throw new Error(
            "Tailwind typeset index generation failed: missing source"
        )
    }

    const tailwindDeclaration = sourceFile.statements.find(
        (statement): statement is ts.InterfaceDeclaration =>
            ts.isInterfaceDeclaration(statement) &&
            statement.name.text === "Tailwind"
    )
    if (!tailwindDeclaration) {
        throw new Error(
            "Tailwind typeset index generation failed: Tailwind interface not found"
        )
    }

    const checker = program.getTypeChecker()
    const tailwindType = checker.getTypeAtLocation(tailwindDeclaration.name)
    const tailwindNestGroupsDeclaration = sourceFile.statements.find(
        (statement): statement is ts.TypeAliasDeclaration =>
            ts.isTypeAliasDeclaration(statement) &&
            statement.name.text === "TailwindNestGroups"
    )
    const tailwindNestGroupsType = tailwindNestGroupsDeclaration
        ? checker.getTypeAtLocation(tailwindNestGroupsDeclaration.name)
        : null
    const propertyTypes = new Map<string, ts.Type>()

    checker.getPropertiesOfType(tailwindType).forEach((property) => {
        propertyTypes.set(
            property.getName(),
            checker.getTypeOfSymbolAtLocation(
                property,
                property.valueDeclaration ?? tailwindDeclaration
            )
        )
    })

    const keySet = new Set(propertyTypes.keys())
    const utilityMatchCache = new Map<string, string[]>()

    const matchAllKeys = (utility: string): string[] => {
        const cached = utilityMatchCache.get(utility)
        if (cached) return cached

        const utilityType = checker.getStringLiteralType(utility)
        const matches = Array.from(propertyTypes.entries())
            .filter(([, propertyType]) =>
                checker.isTypeAssignableTo(utilityType, propertyType)
            )
            .map(([key]) => key)

        utilityMatchCache.set(utility, matches)
        return matches
    }

    return {
        hasKey(key: string): boolean {
            return keySet.has(key)
        },
        hasNestGroup(group: string): boolean {
            if (!tailwindNestGroupsType) return false
            return checker.isTypeAssignableTo(
                checker.getStringLiteralType(group),
                tailwindNestGroupsType
            )
        },
        matchUtility(utility: string, candidateKeys?: string[]): string[] {
            if (!candidateKeys || candidateKeys.length === 0) {
                return matchAllKeys(utility)
            }

            const utilityType = checker.getStringLiteralType(utility)
            return candidateKeys.filter((key) => {
                const propertyType = propertyTypes.get(key)
                if (!propertyType) return false
                return checker.isTypeAssignableTo(utilityType, propertyType)
            })
        },
    }
}
