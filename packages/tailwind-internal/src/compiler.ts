import {
    type CompileOptions,
    compile,
    __unstable__loadDesignSystem as loadDesignSystem,
} from "@tailwindcss/node"
import { Features, transform } from "lightningcss"
import { readFile } from "node:fs/promises"

interface ClassMetadata {
    modifiers: string[]
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

export interface TailwindVariantEntry {
    name: string
    isArbitrary: boolean
    values: string[]
    hasDash: boolean
    selectors?: (options: SelectorOptions) => string[]
}

export type VariantEntry = TailwindVariantEntry

export type TailwindDesignSystem = Awaited<ReturnType<typeof loadDesignSystem>>
export type DesignSystem = TailwindDesignSystem

export type TailwindCompileOptions = Omit<
    CompileOptions,
    "base" | "onDependency"
> & {
    minify?: boolean
}

export type TailwindCompilerInput =
    | {
          cssRoot: string
          base: string
      }
    | {
          cssSource: string
          base: string
      }

export class TailwindCompiler {
    private _rawCSS: string | null = null
    private readonly _base: string
    private readonly _cssRoot: string | null
    private readonly _cssSource: string | null
    private _initialized = false

    public get config() {
        return {
            base: this._base,
            cssRoot: this._cssRoot,
            rawCSS: this._rawCSS,
        }
    }

    public constructor(input: TailwindCompilerInput) {
        this._base = input.base
        this._cssRoot = "cssRoot" in input ? input.cssRoot : null
        this._cssSource = "cssSource" in input ? input.cssSource : null
    }

    private async init(): Promise<void> {
        if (this._initialized) return

        if (this._cssSource !== null) {
            this._rawCSS = this._cssSource
            this._initialized = true
            return
        }

        try {
            this._rawCSS = await readFile(this._cssRoot!, {
                encoding: "utf-8",
            })
            this._initialized = true
        } catch (e) {
            this._initialized = false
            throw new Error("css inquire failed", {
                cause: e,
            })
        }
    }

    private getOption(options?: TailwindCompileOptions): CompileOptions {
        return {
            ...options,
            onDependency() {},
            base: this._base,
        }
    }

    public async compileCss(
        candidates: string[] = [],
        options?: TailwindCompileOptions
    ): Promise<string> {
        await this.init()

        const { build } = await compile(this._rawCSS!, this.getOption(options))
        const compiledCSS = build(candidates)

        if (options?.minify) {
            return this.optimizeCss(compiledCSS).trim()
        }

        return compiledCSS
    }

    public async getDesignSystem(): Promise<TailwindDesignSystem> {
        await this.init()

        return await loadDesignSystem(this._rawCSS!, { base: this._base })
    }

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

        return optimize(optimize(Buffer.from(input))).toString()
    }
}
