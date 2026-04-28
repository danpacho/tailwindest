const TAILWINDEST_SENTINELS = [
    "createTools",
    ".style(",
    ".toggle(",
    ".rotary(",
    ".variants(",
    ".join(",
    ".def(",
    ".mergeProps(",
    ".mergeRecord(",
]

export const hasTailwindestSentinel = (source: string): boolean => {
    return TAILWINDEST_SENTINELS.some((sentinel) => source.includes(sentinel))
}
