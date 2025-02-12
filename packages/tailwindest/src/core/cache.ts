export class CacheMap<Key = string, Value = any> {
    private readonly _store = new Map<Key, Value>()
    public get store(): Map<Key, Value> {
        return this._store
    }

    public has(key: Key): boolean {
        return this.store.has(key)
    }
    public set(key: Key, value: Value): void {
        this.store.set(key, value)
    }
    public get(key: Key): Value | undefined
    public get(key: Key, cacheFindFallback: () => Value): Value
    public get(key: Key, cacheFindFallback?: () => Value): Value | undefined {
        const inquired = this.store.get(key)
        if (inquired === undefined) {
            const instead = cacheFindFallback?.()
            if (!instead) return inquired

            this.set(key, instead)
            return instead
        }

        return inquired
    }
    public reset(): void {
        this.store.clear()
    }
}
