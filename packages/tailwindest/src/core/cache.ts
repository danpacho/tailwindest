export interface Cache<Key, Value> {
    set: (key: Key, value: Value) => void
    has: (key: Key) => boolean
    /**
     * @param key store inquire key
     * @param cacheFindFallback when cache is not found, caching it
     * @returns cached value
     */
    get: (key: Key, cacheFindFallback: () => Value) => Value
    /**
     * @description reset store
     */
    reset: () => void
}

/**
 * Simple cache with `Map` data structure
 */
const cache = <Key, Value>(): Cache<Key, Value> => {
    let store = new Map<Key, Value>()

    return {
        set: (key, value) => {
            store.set(key, value)
        },
        has: (key) => store.has(key),
        get: (key, cacheFindFallback) => {
            if (store.has(key)) return store.get(key) as Value

            const newCacheValue = cacheFindFallback()
            store.set(key, newCacheValue)
            return newCacheValue
        },
        reset: () => {
            store = new Map<Key, Value>()
        },
    }
}

export { cache }
