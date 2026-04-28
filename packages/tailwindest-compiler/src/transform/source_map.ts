import type { ReplacementPlan, ViteSourceMap } from "./replacement"

export interface ReplacementSourceMapInput {
    fileName: string
    originalCode: string
    generatedCode: string
    replacements: ReplacementPlan[]
}

interface Position {
    line: number
    column: number
}

const vlqChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

export const createReplacementSourceMap = ({
    fileName,
    originalCode,
    generatedCode,
    replacements,
}: ReplacementSourceMapInput): ViteSourceMap => {
    const mappingsByLine = new Map<
        number,
        Array<{ generated: Position; original: Position }>
    >()
    let delta = 0

    for (const replacement of [...replacements].sort(
        (left, right) => left.span.start - right.span.start
    )) {
        const generatedOffset = replacement.span.start + delta
        delta +=
            replacement.text.length -
            (replacement.span.end - replacement.span.start)

        if (generatedOffset < 0 || generatedOffset > generatedCode.length) {
            continue
        }

        const generated = offsetToPosition(generatedCode, generatedOffset)
        const original = offsetToPosition(originalCode, replacement.span.start)
        const mappings = mappingsByLine.get(generated.line) ?? []
        mappings.push({ generated, original })
        mappingsByLine.set(generated.line, mappings)
    }

    return {
        version: 3,
        file: fileName,
        sources: [fileName],
        sourcesContent: [originalCode],
        names: [],
        mappings: encodeMappings(generatedCode, mappingsByLine),
    }
}

const encodeMappings = (
    generatedCode: string,
    mappingsByLine: Map<
        number,
        Array<{ generated: Position; original: Position }>
    >
): string => {
    const lineCount = generatedCode.split("\n").length
    const encodedLines: string[] = []
    let previousSourceIndex = 0
    let previousOriginalLine = 0
    let previousOriginalColumn = 0

    for (let line = 0; line < lineCount; line += 1) {
        const segments = (mappingsByLine.get(line) ?? []).sort(
            (left, right) => left.generated.column - right.generated.column
        )
        let previousGeneratedColumn = 0

        encodedLines.push(
            segments
                .map((segment) => {
                    const encoded = [
                        encodeVlq(
                            segment.generated.column - previousGeneratedColumn
                        ),
                        encodeVlq(0 - previousSourceIndex),
                        encodeVlq(segment.original.line - previousOriginalLine),
                        encodeVlq(
                            segment.original.column - previousOriginalColumn
                        ),
                    ].join("")

                    previousGeneratedColumn = segment.generated.column
                    previousSourceIndex = 0
                    previousOriginalLine = segment.original.line
                    previousOriginalColumn = segment.original.column

                    return encoded
                })
                .join(",")
        )
    }

    return encodedLines.join(";")
}

const encodeVlq = (value: number): string => {
    let vlq = value < 0 ? (-value << 1) | 1 : value << 1
    let encoded = ""

    do {
        let digit = vlq & 31
        vlq >>>= 5
        if (vlq > 0) {
            digit |= 32
        }
        encoded += vlqChars[digit] ?? ""
    } while (vlq > 0)

    return encoded
}

const offsetToPosition = (code: string, offset: number): Position => {
    let line = 0
    let column = 0

    for (let index = 0; index < offset; index += 1) {
        if (code[index] === "\n") {
            line += 1
            column = 0
            continue
        }
        column += 1
    }

    return { line, column }
}
