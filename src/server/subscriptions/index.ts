import { env } from "@/lib/env";
import { assertLocalPersistenceAllowed } from "@/server/families";
import { createMemorySubscriptionStore } from "./memoryStore";
import { createPostgresSubscriptionStore } from "./postgresStore";
import type { SubscriptionStore } from "./store";

/**
 * Chooses the subscription store, on the same rule as the family store: real
 * PostgreSQL when the database is configured, the in-memory stand-in otherwise —
 * and the stand-in is forbidden outside `local` (it shares
 * `assertLocalPersistenceAllowed` with the family store, since both are gated by
 * the same Supabase service-role configuration).
 */
let cached: SubscriptionStore | null = null;

export function getSubscriptionStore(): SubscriptionStore {
  if (cached === null) {
    if (env.databaseConfigured) {
      cached = createPostgresSubscriptionStore();
    } else {
      assertLocalPersistenceAllowed(env.APP_ENV);
      cached = createMemorySubscriptionStore();
    }
  }
  return cached;
}
