type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const store = new Map<string, CacheEntry<unknown>>();

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value as T;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function cacheWrap<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<{ value: T; cached: boolean }> {
  const cached = cacheGet<T>(key);
  if (cached !== null) return Promise.resolve({ value: cached, cached: true });
  return fn().then((value) => {
    cacheSet(key, value, ttlMs);
    return { value, cached: false };
  });
}
