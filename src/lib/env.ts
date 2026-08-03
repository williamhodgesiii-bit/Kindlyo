/**
 * Environment validation.
 *
 * Hand-rolled rather than pulling in a schema library: the surface is small and
 * CLAUDE.md asks us to avoid unnecessary dependencies.
 *
 * Rules:
 * - Fail loudly and early on malformed configuration.
 * - Only `NEXT_PUBLIC_*` values may ever reach the browser.
 * - No secrets are required yet; auth, database, and payments arrive in later
 *   slices and will extend this module.
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

/**
 * Validates a raw environment record and returns typed values.
 *
 * Both fields are optional and fall back to local defaults, so a fresh clone
 * runs with no `.env` file. Values that are present but malformed are rejected.
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

  if (issues.length > 0) {
    throw new EnvValidationError(issues);
  }

  return { APP_ENV: appEnv, NEXT_PUBLIC_APP_URL: appUrl };
}

export const env: Env = parseEnv(process.env);
