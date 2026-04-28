export function createTools() {
    const toClass = (value: unknown): string => {
        if (!value) return ""
        if (typeof value === "string") return value
        if (Array.isArray(value))
            return value.map(toClass).filter(Boolean).join(" ")
        if (typeof value === "object") {
            return Object.entries(value as Record<string, unknown>)
                .flatMap(([key, item]) =>
                    typeof item === "string" ||
                    Array.isArray(item) ||
                    typeof item === "object"
                        ? toClass(item)
                        : item
                          ? key
                          : ""
                )
                .filter(Boolean)
                .join(" ")
        }
        return ""
    }
    const merge = (...values: unknown[]) =>
        values.map(toClass).filter(Boolean).join(" ")
    return {
        join: (...values: unknown[]) => merge(...values.flat(Infinity)),
        def: (classList: unknown[], ...styles: unknown[]) =>
            merge(classList, ...styles),
        style: (style: unknown) => ({
            class: (...extra: unknown[]) => merge(style, ...extra),
            style: (...extra: unknown[]) => Object.assign({}, style, ...extra),
            compose: (...extra: unknown[]) =>
                createTools().style(Object.assign({}, style, ...extra)),
        }),
        toggle: (config: {
            base?: unknown
            truthy: unknown
            falsy: unknown
        }) => ({
            class: (condition: boolean, ...extra: unknown[]) =>
                merge(
                    config.base,
                    condition ? config.truthy : config.falsy,
                    ...extra
                ),
        }),
        rotary: (config: {
            base?: unknown
            variants: Record<string, unknown>
        }) => ({
            class: (key: string, ...extra: unknown[]) =>
                merge(config.base, config.variants[key], ...extra),
        }),
        variants: (config: {
            base?: unknown
            variants: Record<string, Record<string, unknown>>
        }) => ({
            class: (props: Record<string, string>, ...extra: unknown[]) =>
                merge(
                    config.base,
                    ...Object.entries(props).map(
                        ([axis, value]) => config.variants[axis]?.[value]
                    ),
                    ...extra
                ),
        }),
    }
}
