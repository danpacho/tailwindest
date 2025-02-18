type JSDocSymbol =
    | "title"
    | "@abstract"
    | "@access"
    | "@alias"
    | "@async"
    | "@augments"
    | "@author"
    | "@borrows"
    | "@callback"
    | "@class"
    | "@classdesc"
    | "@constant"
    | "@constructs"
    | "@copyright"
    | "@default"
    | "@deprecated"
    | "@description"
    | "@enum"
    | "@event"
    | "@example"
    | "@exports"
    | "@external"
    | "@file"
    | "@fires"
    | "@function"
    | "@generator"
    | "@global"
    | "@hideconstructor"
    | "@ignore"
    | "@implements"
    | "@inheritdoc"
    | "@inner"
    | "@instance"
    | "@interface"
    | "@kind"
    | "@lends"
    | "@license"
    | "@listens"
    | "@member"
    | "@memberof"
    | "@mixes"
    | "@mixin"
    | "@module"
    | "@name"
    | "@namespace"
    | "@override"
    | "@package"
    | "@param"
    | "@private"
    | "@property"
    | "@protected"
    | "@public"
    | "@readonly"
    | "@requires"
    | "@returns"
    | "@see"
    | "@since"
    | "@static"
    | "@summary"
    | "@this"
    | "@throws"
    | "@todo"
    | "@tutorial"
    | "@type"
    | "@typedef"
    | "@variation"
    | "@version"
    | "@yields"

type JSDocLanguage =
    | "javascript"
    | "js"
    | "typescript"
    | "ts"
    | "html"
    | "css"
    | "json"
    | "xml"
    | "python"
    | "java"
    | "csharp"
    | "php"
    | "ruby"
    | "go"
    | "c"
    | "cpp"
    | "swift"
    | "kotlin"
    | "r"
    | "perl"
    | "bash"
    | "shell"
    | "sql"

export type GenericOption = Array<
    | {
          name: string
          extends?: string
          default?: string
      }
    | string
>

/**
 * The base abstract class for a type node.
 */
export abstract class Type {
    /**
     * Alias for Type.
     */
    public alias: string | undefined = undefined

    /**
     * Generics for Type.
     */
    public generic: GenericOption | undefined = undefined

    /**
     * JSDoc documentation for the type stored as a record.
     */
    public docs: Partial<Record<JSDocSymbol, string>> = {}

    /**
     * Export or not
     */
    public exports: boolean = false
    public setExport(exports: boolean): this {
        this.exports = exports
        return this
    }

    /**
     * Overloaded signatures for adding doc entries to `docs`.
     */
    public addDoc(doc: string): this
    public addDoc(key: JSDocSymbol, doc: string): this
    public addDoc(
        key: JSDocSymbol,
        doc: string,
        options?: { lang?: JSDocLanguage }
    ): this
    public addDoc(
        keyOrRawTitle: JSDocSymbol | string,
        doc?: string,
        options?: { lang?: JSDocLanguage }
    ): this {
        /**
         * If `doc` is undefined, we're calling `addDoc("some string")`,
         * so that is treated as the 'title'.
         */
        if (doc === undefined) {
            this.docs["title"] = keyOrRawTitle
            return this
        }

        let formattedDoc = doc
        /**
         * For `@example`, we insert a fenced code block if a language is provided.
         */
        if (keyOrRawTitle === "@example" && options?.lang) {
            formattedDoc = `\n@example\n\`\`\`${options.lang}\n${doc}\n\`\`\``
        }

        // Store it in the docs record, keyed by something like "@param" / "@example" / "title", etc.
        this.docs[keyOrRawTitle as JSDocSymbol] = formattedDoc
        return this
    }

    /**
     * Returns the JSDoc comment block if any documentation is present.
     * Each key-value pair in the docs record is output as:
     *
     *   * key
     *   * (doc text, preserving line breaks)
     */
    public getDoc(): string {
        const lines: string[] = []
        for (const [key, value] of Object.entries(this.docs)) {
            // If it's not 'title' or '@example', prepend " * key".
            // 'title' or '@example' will just have their contents appended.
            if (!["title", "@example"].includes(key)) {
                lines.push(` * ${key}`)
            }

            // Split the doc text by line to preserve line breaks
            const valueLines = value.split("\n")
            for (const line of valueLines) {
                // Escape '@' symbols to avoid JSDoc confusion
                const linePurified = line.replaceAll("@", "\\@")
                lines.push(` * ${linePurified}`)
            }
        }

        /**
         * If there are lines, wrap them in a JSDoc comment. Otherwise, return empty string.
         */
        const doc = lines.length ? "/**\n" + lines.join("\n") + "\n */\n" : ""
        return doc
    }

    /**
     * Returns the type prefix, including any JSDoc documentation.
     */
    public getTypePrefix(): string {
        // No alias => no type prefix. Return empty.
        if (!this.alias) {
            return ""
        }

        const typeWithExport = this.exports ? `export type` : "type"

        // If no generics, just produce `type MyAlias = ...`
        if (!this.generic || this.generic.length === 0) {
            return `${this.getDoc()}${typeWithExport} ${this.alias} = `
        }

        /**
         * Build the generic signature, e.g. <T extends Something, U = Default>
         */
        const genericPart: string = this.generic
            .map((param) => {
                if (typeof param === "string") {
                    return param
                }
                const hasExtends = param.extends !== undefined
                const hasDefault = param.default !== undefined

                // e.g. "T extends Foo = Bar"
                if (hasExtends && hasDefault) {
                    return `${param.name} extends ${param.extends} = ${param.default}`
                }

                // e.g. "T extends Foo"
                if (hasExtends) {
                    return `${param.name} extends ${param.extends}`
                }

                // e.g. "T = Default"
                if (hasDefault) {
                    return `${param.name} = ${param.default}`
                }

                return param.name
            })
            .join(", ")

        // E.g. "type MyAlias<T extends Foo = Bar> = "
        const prefix = `${this.getDoc()}${typeWithExport} ${this.alias}<${genericPart}> = `
        return prefix
    }

    /**
     * Returns the string representation for this type.
     */
    public abstract toTypeString(genericLiterals?: Array<string>): string

    /**
     * Recursively collects type alias declarations from this node and its children.
     */
    public abstract collectAliases(genericLiterals?: Array<string>): string[]
}
