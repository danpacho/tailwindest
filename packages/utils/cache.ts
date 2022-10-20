export type CacheKey = string | symbol

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
    const store = new Map<CacheKey, CacheValue>()

    return {
        get: (key: CacheKey) => store.get(key),
        set: (key: CacheKey, value: CacheValue) => {
            store.set(key, value)
        },
        has: (key: CacheKey) => store.has(key),
    }
}

export { cache }
