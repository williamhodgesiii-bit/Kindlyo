import { env, type AppEnvironment } from "@/lib/env";
import { createMemoryFamilyStore } from "./memoryStore";
import { createPostgresFamilyStore } from "./postgresStore";
import type { FamilyStore } from "./store";

/**
 * Chooses the family store, and keeps the in-memory stand-in out of any
 * deployed environment.
 *
 * The mirror of `assertLocalAuthAllowed` (decision 033): the in-memory store is
 * a development convenience that loses everything on restart, so preview and
 * production must use PostgreSQL. Env validation already fails the build there
 * without a service-role key, so this is a second, louder guard rather than the
 * only one.
 */
export function assertLocalPersistenceAllowed(appEnv: AppEnvironment): void {
  if (appEnv !== "local") {
    throw new Error(
      "The in-memory family store is only available when APP_ENV is 'local'. " +
        "Configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
}

let cached: FamilyStore | null = null;

export function getFamilyStore(): FamilyStore {
  if (cached === null) {
    if (env.databaseConfigured) {
      cached = createPostgresFamilyStore();
    } else {
      assertLocalPersistenceAllowed(env.APP_ENV);
      cached = createMemoryFamilyStore();
    }
  }
  return cached;
}
