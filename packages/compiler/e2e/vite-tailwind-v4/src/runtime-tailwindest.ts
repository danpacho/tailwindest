export function createTools() {
    return {
        join: (...values: unknown[]) =>
            values.flat(Infinity).filter(Boolean).join(" "),
    }
}
