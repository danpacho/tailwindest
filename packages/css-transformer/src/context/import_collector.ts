import type { SourceFile } from "ts-morph"

export class ImportCollector {
    // Map<modulePath, Set<importName>>
    private readonly imports = new Map<string, Set<string>>()
    private readonly toRemove = new Set<string>()

    public addNamedImport(modulePath: string, name: string): void {
        if (!this.imports.has(modulePath)) {
            this.imports.set(modulePath, new Set())
        }
        this.imports.get(modulePath)!.add(name)
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

                for (const name of names) {
                    if (!existingNamedImports.includes(name)) {
                        existingImport.addNamedImport(name)
                    }
                }
            } else {
                // Create new import declaration
                sourceFile.addImportDeclaration({
                    moduleSpecifier: modulePath,
                    namedImports: Array.from(names),
                })
            }
        }
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
