/**
 * A `Storage` backed by an in-memory `Map`, not a browser.
 *
 * The persistence slice keeps the injectable-`Storage` design of the local
 * prototype stores (`profileStorage`, `progressStorage`) and reuses their
 * validation wholesale — see `src/server/families/memoryStore.ts`. To do that
 * off the browser (on the server, and in unit tests) it needs a `Storage` that
 * does not depend on `window`. This is that: the same five operations, backed
 * by a `Map`.
 *
 * It is deliberately tiny and has no persistence of its own. On the server it
 * is the offline stand-in for PostgreSQL — per-process, gone on restart — and
 * is only ever selected when the database is not configured (the same posture
 * as the local auth stand-in, decision 033). In tests it is the seedable data
 * behind the family client double.
 */
export function createMemoryStorage(): Storage {
  const map = new Map<string, string>();

  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(map.keys())[index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, String(value));
    },
  };
}
