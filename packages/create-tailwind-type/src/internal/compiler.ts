import {
    type CompileOptions,
    compile,
    __unstable__loadDesignSystem as loadDesignSystem,
} from "@tailwindcss/node"
import { Features, transform } from "lightningcss"
import { readFile } from "fs/promises"

/*
    compileAst :: compile internal function
    1. get css as pure string using <fs.readFile>
    2. transform css into CSS AST
    3. based on CSS AST call compileAST
    4. based on compileAST result, call compile
*/

interface ClassMetadata {
    /**
     * style modifiers, such as
     *
     * @example
     * ```js
     * const in = `bg-red-100/{opacity_modifiers}`
     * const modifiers = [0, 10, 20, ...]
     * ```
     */
    modifiers: Array<string>
}
export interface ClassItem extends ClassMetadata {
    name: string
    utility: string
    fraction: boolean
}
export type ClassEntry = [string, ClassMetadata]

interface SelectorOptions {
    modifier?: string
    value?: string
}

export interface VariantEntry {
    name: string
    isArbitrary: boolean
    values: string[]
    hasDash: boolean
    selectors: (options: SelectorOptions) => string[]
}

type CompilerOptionCustom = Omit<CompileOptions, "base" | "onDependency"> & {
    minify?: boolean
}

export class TailwindCompiler {
    private _rawCSS: string | null = null
    private _base: string
    private _cssRoot: string
    private _initialized: boolean = false

    public get config() {
        return {
            base: this._base,
            cssRoot: this._cssRoot,
            rawCSS: this._rawCSS,
        }
    }

    private async init(): Promise<void> {
        if (this._initialized) return

        try {
            const inquiredCSS = await readFile(this._cssRoot, {
                encoding: "utf-8",
            })
            this._rawCSS = inquiredCSS
            this._initialized = true
        } catch (e) {
            this._initialized = false
            throw new Error("css inquire failed", {
                cause: e,
            })
        }
    }

    public constructor({
        cssRoot,
        base = __dirname,
    }: {
        /**
         * tailwind css input.css file location
         */
        cssRoot: string
        /**
         * base root
         * @default __dirname
         */
        base?: string
    }) {
        this._cssRoot = cssRoot
        this._base = base
    }

    private getOption(options?: CompilerOptionCustom): CompileOptions {
        return {
            ...options,
            onDependency(path) {},
            base: this._base,
        }
    }

    /**
     * Compile tailwind classnames into CSS string
     * @param candidates tailwind className candidates
     * @param options compiler option
     * @returns compiled css string
     */
    public async compileCss(
        candidates: Array<string> = [],
        options?: CompilerOptionCustom
    ): Promise<string> {
        await this.init()

        const { build } = await compile(this._rawCSS!, this.getOption(options))

        const compiledCSS = build(candidates)

        if (options?.minify) {
            const optimizedCss = this.optimizeCss(compiledCSS).trim()
            return optimizedCss
        }

        return compiledCSS
    }

    /**
     * Design system generator
     * @param css `input.css` root path
     * @returns design system
     */
    public async getDesignSystem() {
        await this.init()

        return await loadDesignSystem(this._rawCSS!, { base: this._base! })
    }

    /**
     * Source code origin : https://github.com/tailwindlabs/tailwindcss/blob/main/packages/%40tailwindcss-vite/src/index.ts#L324
     * LICENSE : MIT from "tailwindcss"
     *
     * Optional css optimizer
     * @param input css literal
     * @param config css optimization config
     * @returns optimized css
     */
    private optimizeCss(
        input: string,
        {
            file = "input.css",
            minify = false,
        }: { file?: string; minify?: boolean } = {}
    ): string {
        function optimize(code: Buffer | Uint8Array) {
            return transform({
                filename: file,
                code: code as Uint8Array,
                minify,
                sourceMap: false,
                drafts: {
                    customMedia: true,
                },
                nonStandard: {
                    deepSelectorCombinator: true,
                },
                include: Features.Nesting,
                exclude:
                    Features.LogicalProperties |
                    Features.DirSelector |
                    Features.LightDark,
                targets: {
                    safari: (16 << 16) | (4 << 8),
                    ios_saf: (16 << 16) | (4 << 8),
                    firefox: 128 << 16,
                    chrome: 111 << 16,
                },
                errorRecovery: true,
            }).code
        }

        // Running Lightning CSS twice to ensure that adjacent rules are merged after
        // nesting is applied. This creates a more optimized output.
        return optimize(optimize(Buffer.from(input))).toString()
    }
}
