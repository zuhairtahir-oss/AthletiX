/**
 * Minimal in-memory TTL cache. The free API-Sports tier allows a small
 * daily request budget, so every service caches upstream responses for
 * a short window instead of hitting the API on every page load. This
 * is intentionally simple (no Redis, no LRU eviction) — appropriate for
 * a single-process demo backend.
 */
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export async function withCache<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = store.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value as T;
  }

  const value = await fetcher();
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
}
