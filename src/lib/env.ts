/**
 * Environment validation.
 *
 * Hand-rolled rather than pulling in a schema library: the surface is small and
 * CLAUDE.md asks us to avoid unnecessary dependencies.
 *
 * Rules:
 * - Fail loudly and early on malformed configuration.
 * - Only `NEXT_PUBLIC_*` values may ever reach the browser.
 * - A fresh clone runs with no `.env` file: everything is optional in `local`.
 * - Deployed environments (`preview`, `production`) must be fully configured for
 *   the services they use, so those are required there and the build fails
 *   without them.
 */

export type AppEnvironment = "local" | "preview" | "production";

const APP_ENVIRONMENTS: readonly AppEnvironment[] = [
  "local",
  "preview",
  "production",
];

export type Env = {
  APP_ENV: AppEnvironment;
  NEXT_PUBLIC_APP_URL: string;
  /** Client-safe Supabase project URL, or null when auth is not configured. */
  NEXT_PUBLIC_SUPABASE_URL: string | null;
  /** Client-safe Supabase anon key, or null when auth is not configured. */
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string | null;
  /**
   * Server-only Supabase service-role key, or null when the database is not
   * configured. Full access — it never reaches the browser and backs the
   * family data store (see `src/server/families`).
   */
  SUPABASE_SERVICE_ROLE_KEY: string | null;
  /**
   * True when both Supabase values are present. When false, the app falls back
   * to the local development auth stand-in (see `src/features/auth`), which is
   * only permitted in the `local` environment.
   */
  authConfigured: boolean;
  /**
   * True when the service-role key and project URL are present. When false, the
   * app falls back to the in-memory family store (see `src/server/families`),
   * only permitted in the `local` environment. Required in preview/production.
   */
  databaseConfigured: boolean;
};

export class EnvValidationError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(
      `Invalid environment configuration:\n${issues
        .map((issue) => `  - ${issue}`)
        .join("\n")}`,
    );
    this.name = "EnvValidationError";
    this.issues = issues;
  }
}

function isAppEnvironment(value: string): value is AppEnvironment {
  return (APP_ENVIRONMENTS as readonly string[]).includes(value);
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validates a raw environment record and returns typed values.
 *
 * The application fields fall back to local defaults, so a fresh clone runs with
 * no `.env` file. Values that are present but malformed are rejected, and the
 * Supabase pair is required once the environment is `preview` or `production`.
 */
export function parseEnv(source: Record<string, string | undefined>): Env {
  const issues: string[] = [];

  const rawAppEnv = source.APP_ENV?.trim();
  let appEnv: AppEnvironment = "local";
  if (rawAppEnv !== undefined && rawAppEnv !== "") {
    if (isAppEnvironment(rawAppEnv)) {
      appEnv = rawAppEnv;
    } else {
      issues.push(
        `APP_ENV must be one of ${APP_ENVIRONMENTS.join(", ")} (received "${rawAppEnv}")`,
      );
    }
  }

  const rawAppUrl = source.NEXT_PUBLIC_APP_URL?.trim();
  let appUrl = "http://localhost:3000";
  if (rawAppUrl !== undefined && rawAppUrl !== "") {
    if (isValidHttpUrl(rawAppUrl)) {
      appUrl = rawAppUrl;
    } else {
      issues.push(
        `NEXT_PUBLIC_APP_URL must be a valid http(s) URL (received "${rawAppUrl}")`,
      );
    }
  }

  // Deployed environments must have real authentication; local may run without.
  const deployed = appEnv === "preview" || appEnv === "production";

  const rawSupabaseUrl = source.NEXT_PUBLIC_SUPABASE_URL?.trim();
  let supabaseUrl: string | null = null;
  if (rawSupabaseUrl !== undefined && rawSupabaseUrl !== "") {
    if (!isValidHttpUrl(rawSupabaseUrl)) {
      issues.push(
        `NEXT_PUBLIC_SUPABASE_URL must be a valid http(s) URL (received "${rawSupabaseUrl}")`,
      );
    } else if (deployed && !isHttpsUrl(rawSupabaseUrl)) {
      issues.push(
        "NEXT_PUBLIC_SUPABASE_URL must use https in preview and production.",
      );
    } else {
      supabaseUrl = rawSupabaseUrl;
    }
  }

  const rawAnonKey = source.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const anonKey =
    rawAnonKey !== undefined && rawAnonKey !== "" ? rawAnonKey : null;

  const rawServiceKey = source.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const serviceRoleKey =
    rawServiceKey !== undefined && rawServiceKey !== "" ? rawServiceKey : null;

  const supabaseUrlPresent =
    rawSupabaseUrl !== undefined && rawSupabaseUrl !== "";

  if (deployed) {
    // Deployed environments require the full pair; the message names the env.
    if (!supabaseUrlPresent) {
      issues.push(
        `NEXT_PUBLIC_SUPABASE_URL is required when APP_ENV is ${appEnv}.`,
      );
    }
    if (anonKey === null) {
      issues.push(
        `NEXT_PUBLIC_SUPABASE_ANON_KEY is required when APP_ENV is ${appEnv}.`,
      );
    }
    // A deployed app must have a real database; the in-memory stand-in is
    // forbidden outside local (assertLocalPersistenceAllowed).
    if (serviceRoleKey === null) {
      issues.push(
        `SUPABASE_SERVICE_ROLE_KEY is required when APP_ENV is ${appEnv}.`,
      );
    }
  } else {
    // Local: both or neither. A half-configured client cannot talk to Supabase,
    // and silently falling back to the local stand-in would hide the mistake.
    if (supabaseUrl !== null && anonKey === null) {
      issues.push(
        "NEXT_PUBLIC_SUPABASE_ANON_KEY is required when NEXT_PUBLIC_SUPABASE_URL is set.",
      );
    }
    if (anonKey !== null && !supabaseUrlPresent) {
      issues.push(
        "NEXT_PUBLIC_SUPABASE_URL is required when NEXT_PUBLIC_SUPABASE_ANON_KEY is set.",
      );
    }
    // A service-role key with no project URL cannot reach a database. (Deployed
    // environments already require the URL above, so this only adds locally.)
    if (serviceRoleKey !== null && !supabaseUrlPresent) {
      issues.push(
        "NEXT_PUBLIC_SUPABASE_URL is required when SUPABASE_SERVICE_ROLE_KEY is set.",
      );
    }
  }

  if (issues.length > 0) {
    throw new EnvValidationError(issues);
  }

  const authConfigured = supabaseUrl !== null && anonKey !== null;
  const databaseConfigured = supabaseUrl !== null && serviceRoleKey !== null;

  return {
    APP_ENV: appEnv,
    NEXT_PUBLIC_APP_URL: appUrl,
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
    SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey,
    authConfigured,
    databaseConfigured,
  };
}

export const env: Env = parseEnv(process.env);
