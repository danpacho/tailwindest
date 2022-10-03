/**
 * Cache the computed result with `Map`
 * @returns `get`, get cached result with `string` key
 * @returns `set`, set cached value at input `string` key
 */
const cache = <CachedKey extends string, CachedValue>(): {
    get: (key: CachedKey) => undefined | CachedValue
    set: (key: CachedKey, value: CachedValue) => void
    has: (key: CachedKey) => boolean
} => {
    const cached = new Map<CachedKey, CachedValue>()

    return {
        get: (key: CachedKey) => cached.get(key),
        set: (key: CachedKey, value: CachedValue) => {
            cached.set(key, value)
        },
        has: (key: CachedKey) => cached.has(key),
    }
}

export { cache }
