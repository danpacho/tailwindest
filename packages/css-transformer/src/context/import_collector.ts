import type {
    OptionalKind,
    SourceFile,
    ImportSpecifierStructure,
} from "ts-morph"

export class ImportCollector {
    // Map<modulePath, Map<importName, isTypeOnly>>
    private readonly imports = new Map<string, Map<string, boolean>>()
    private readonly toRemove = new Set<string>()

    public addNamedImport(modulePath: string, name: string): void {
        this.addImport(modulePath, name, false)
    }

    public addTypeNamedImport(modulePath: string, name: string): void {
        this.addImport(modulePath, name, true)
    }

    private addImport(
        modulePath: string,
        name: string,
        isTypeOnly: boolean
    ): void {
        if (!this.imports.has(modulePath)) {
            this.imports.set(modulePath, new Map())
        }
        const names = this.imports.get(modulePath)!
        names.set(name, names.get(name) === true || isTypeOnly)
    }

    public registerToRemove(name: string): void {
        this.toRemove.add(name)
    }

    public applyTo(sourceFile: SourceFile): void {
        // 1. Remove unused imports
        if (this.toRemove.size > 0) {
            this.removeUnusedImports(sourceFile, Array.from(this.toRemove))
        }

        // 2. Add new imports
        for (const [modulePath, names] of this.imports.entries()) {
            const existingImport = sourceFile.getImportDeclaration(
                (decl) => decl.getModuleSpecifierValue() === modulePath
            )

            if (existingImport) {
                // Check existing named imports
                const existingNamedImports = existingImport
                    .getNamedImports()
                    .map((ni) => ni.getName())

                for (const [name, isTypeOnly] of names.entries()) {
                    if (!existingNamedImports.includes(name)) {
                        existingImport.addNamedImport(
                            this.toImportSpecifier(name, isTypeOnly)
                        )
                    }
                }
            } else {
                // Create new import declaration
                sourceFile.addImportDeclaration({
                    moduleSpecifier: modulePath,
                    namedImports: Array.from(names.entries()).map(
                        ([name, isTypeOnly]) =>
                            this.toImportSpecifier(name, isTypeOnly)
                    ),
                })
            }
        }
    }

    private toImportSpecifier(
        name: string,
        isTypeOnly: boolean
    ): OptionalKind<ImportSpecifierStructure> {
        return isTypeOnly ? { name, isTypeOnly: true } : { name }
    }

    private removeUnusedImports(sourceFile: SourceFile, names: string[]): void {
        const importDeclarations = sourceFile.getImportDeclarations()

        for (const decl of importDeclarations) {
            const namedImports = decl.getNamedImports()

            for (const ni of namedImports) {
                if (names.includes(ni.getName())) {
                    ni.remove()
                }
            }

            // Remove default import if matches
            const defaultImport = decl.getDefaultImport()
            if (defaultImport && names.includes(defaultImport.getText())) {
                decl.removeDefaultImport()
            }

            // If no named imports and no default import, remove the whole declaration
            if (
                decl.getNamedImports().length === 0 &&
                !decl.getDefaultImport() &&
                !decl.getNamespaceImport()
            ) {
                decl.remove()
            }
        }
    }
}
