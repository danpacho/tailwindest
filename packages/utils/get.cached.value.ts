import type { Cache, CacheKey } from "./cache"

type CacheFindFallback<T> = () => T

/**
 * @param store caching store
 * @param key store inquire key
 * @param cacheFindFallback when cache is not found, caching it
 * @returns cached value
 */
const getCachedValue = <CacheValue>(
    store: Cache<CacheValue>,
    key: CacheKey,
    cacheFindFallback: CacheFindFallback<CacheValue>
): CacheValue => {
    if (store.has(key)) return store.get(key) as CacheValue

    const newCacheValue = cacheFindFallback()
    store.set(key, newCacheValue)
    return newCacheValue
}

export { getCachedValue }
