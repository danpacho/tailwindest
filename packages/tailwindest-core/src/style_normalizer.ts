type StyleRecord = Record<string, unknown>

export function flattenStyleRecord(value: unknown): string[] {
    if (!value) return []

    if (typeof value === "string") {
        return value.split(/\s+/).filter(Boolean)
    }

    if (Array.isArray(value)) {
        return value.flatMap((item) => flattenStyleRecord(item))
    }

    if (typeof value === "object") {
        return Object.values(value as StyleRecord).flatMap((item) =>
            flattenStyleRecord(item)
        )
    }

    return []
}
