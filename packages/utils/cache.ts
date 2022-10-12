export type CacheKey = string

export interface Cache<CachedValue> {
    get: (key: CacheKey) => undefined | CachedValue
    set: (key: CacheKey, value: CachedValue) => void
    has: (key: CacheKey) => boolean
}
/**
 * cache the computed result with `Map`
 * @returns `get`, get cached result at inquire key
 * @returns `set`, set cached value at inquire key
 * @returns `has`, has cached value at inquire key
 */
const cache = <CacheValue>(): Cache<CacheValue> => {
    const cached = new Map<CacheKey, CacheValue>()

    return {
        get: (key: CacheKey) => cached.get(key),
        set: (key: CacheKey, value: CacheValue) => {
            cached.set(key, value)
        },
        has: (key: CacheKey) => cached.has(key),
    }
}

export { cache }
