import prettier from "prettier"
import { Type } from "./types/type"
import { RecordType } from "./types/record"

abstract class TypeGenerator<Args, Frame> {
    /**
     * Formats the generated type literal string using Prettier.
     * @param literal The unformatted TypeScript code string.
     * @returns The formatted code string.
     */
    public async prettify(literal: string): Promise<string> {
        try {
            const purified = literal.trim()
            const formatted = prettier.format(purified, {
                parser: "typescript",
                plugins: ["prettier-plugin-jsdoc"],
            })
            return formatted
        } catch (error) {
            console.error("Prettier formatting error:", { error, literal })
            return literal
        }
    }

    public abstract generateFrame(args: Args): Frame
    public abstract toString(generatedFrame: Frame): string

    /**
     * Generate a TypeScript type literal from the provided arguments.
     */
    public async generate(args: Args): Promise<string> {
        const frame = this.generateFrame(args)
        const typeString = this.toString(frame)

        return await this.prettify(typeString)
    }
}

export class TypeSchemaGenerator extends TypeGenerator<Type, Type> {
    public generateFrame(args: Type): Type {
        if (args instanceof Type) return args
        throw new Error("TypeSchemaGenerator error, should use Type instance")
    }

    private extractGenericArgs(
        generatedFrame: Type
    ): Array<string> | undefined {
        if (!generatedFrame.generic) return undefined

        return generatedFrame.generic.map((generic) => {
            if (typeof generic === "string") return generic
            return generic.name
        })
    }

    public toString(generatedFrame: Type): string {
        const genericLiterals = this.extractGenericArgs(generatedFrame)
        const aliases = generatedFrame.collectAliases(genericLiterals)
        const uniqueAliases = Array.from(new Set(aliases))

        if (generatedFrame instanceof RecordType && generatedFrame["alias"]) {
            const topAlias = generatedFrame.toTypeString(genericLiterals)
            const referenceAliases = uniqueAliases.filter((a) => a !== topAlias)
            const finalType = referenceAliases.join("\n") + "\n" + topAlias
            return finalType
        }

        if (uniqueAliases.length === 0) {
            return generatedFrame.toTypeString(genericLiterals)
        }
        return uniqueAliases.join("\n")
    }
}
