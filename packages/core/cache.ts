export interface Cache<Key, Value> {
    set: (key: Key, value: Value) => void
    has: (key: Key) => boolean
    /**
     * @param key store inquire key
     * @param cacheFindFallback when cache is not found, caching it
     * @returns cached value
     */
    get: (key: Key, cacheFindFallback: () => Value) => Value
}

/**
 * Simple cache with `Map` data structure
 */
const cache = <Key, Value>(): Cache<Key, Value> => {
    const store = new Map<Key, Value>()

    return {
        set: (key: Key, value: Value) => {
            store.set(key, value)
        },
        has: (key: Key) => store.has(key),
        get: (key: Key, cacheFindFallback: () => Value) => {
            if (store.has(key)) return store.get(key) as Value

            const newCacheValue = cacheFindFallback()
            store.set(key, newCacheValue)
            return newCacheValue
        },
    }
}

export { cache }
