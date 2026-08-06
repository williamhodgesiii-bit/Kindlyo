import { describe, expect, it } from "vitest";
import { EnvValidationError, parseEnv } from "./env";

const validPair = {
  NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
};

/** A fully-configured deployed environment: auth pair plus the database key. */
const validDeployed = {
  ...validPair,
  SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
};

describe("parseEnv", () => {
  it("falls back to local defaults when nothing is set", () => {
    expect(parseEnv({})).toEqual({
      APP_ENV: "local",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NEXT_PUBLIC_SUPABASE_URL: null,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: null,
      SUPABASE_SERVICE_ROLE_KEY: null,
      authConfigured: false,
      databaseConfigured: false,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: null,
      STRIPE_SECRET_KEY: null,
      STRIPE_WEBHOOK_SECRET: null,
      STRIPE_PRICE_ID_MONTHLY: null,
      STRIPE_PRICE_ID_ANNUAL: null,
      billingConfigured: false,
    });
  });

  it("accepts each valid APP_ENV value", () => {
    for (const value of ["local", "preview", "production"] as const) {
      // preview/production require the Supabase pair and the database key.
      expect(parseEnv({ APP_ENV: value, ...validDeployed }).APP_ENV).toBe(
        value,
      );
    }
  });

  it("accepts a valid https URL", () => {
    expect(
      parseEnv({ NEXT_PUBLIC_APP_URL: "https://kindlyo.example" })
        .NEXT_PUBLIC_APP_URL,
    ).toBe("https://kindlyo.example");
  });

  it("treats empty strings as unset", () => {
    expect(
      parseEnv({
        APP_ENV: "",
        NEXT_PUBLIC_APP_URL: "",
        NEXT_PUBLIC_SUPABASE_URL: "",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
      }),
    ).toEqual({
      APP_ENV: "local",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NEXT_PUBLIC_SUPABASE_URL: null,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: null,
      SUPABASE_SERVICE_ROLE_KEY: null,
      authConfigured: false,
      databaseConfigured: false,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: null,
      STRIPE_SECRET_KEY: null,
      STRIPE_WEBHOOK_SECRET: null,
      STRIPE_PRICE_ID_MONTHLY: null,
      STRIPE_PRICE_ID_ANNUAL: null,
      billingConfigured: false,
    });
  });

  it("trims surrounding whitespace", () => {
    expect(
      parseEnv({ APP_ENV: "  production  ", ...validDeployed }).APP_ENV,
    ).toBe("production");
  });

  it("rejects an unknown APP_ENV", () => {
    expect(() => parseEnv({ APP_ENV: "staging" })).toThrow(EnvValidationError);
  });

  it("rejects a malformed URL", () => {
    expect(() => parseEnv({ NEXT_PUBLIC_APP_URL: "not-a-url" })).toThrow(
      EnvValidationError,
    );
  });

  it("rejects a non-http protocol", () => {
    expect(() =>
      parseEnv({ NEXT_PUBLIC_APP_URL: "ftp://kindlyo.example" }),
    ).toThrow(EnvValidationError);
  });

  it("reports every issue at once", () => {
    try {
      parseEnv({ APP_ENV: "staging", NEXT_PUBLIC_APP_URL: "nope" });
      expect.unreachable("parseEnv should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(EnvValidationError);
      expect((error as EnvValidationError).issues).toHaveLength(2);
    }
  });

  it("names the offending variable in the message", () => {
    expect(() => parseEnv({ APP_ENV: "staging" })).toThrow(/APP_ENV/);
  });

  describe("Supabase auth configuration", () => {
    it("marks auth configured when both values are present", () => {
      const env = parseEnv(validPair);
      expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe("https://project.supabase.co");
      expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe("anon-key");
      expect(env.authConfigured).toBe(true);
    });

    it("allows an http Supabase URL locally (e.g. supabase start)", () => {
      const env = parseEnv({
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
      });
      expect(env.authConfigured).toBe(true);
    });

    it("rejects a malformed Supabase URL", () => {
      expect(() =>
        parseEnv({
          NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
          NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
        }),
      ).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
    });

    it("requires the anon key when only the URL is set (local)", () => {
      expect(() =>
        parseEnv({ NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co" }),
      ).toThrow(/NEXT_PUBLIC_SUPABASE_ANON_KEY/);
    });

    it("requires the URL when only the anon key is set (local)", () => {
      expect(() =>
        parseEnv({ NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key" }),
      ).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
    });

    it("requires the pair in preview", () => {
      expect(() => parseEnv({ APP_ENV: "preview" })).toThrow(
        /required when APP_ENV is preview/,
      );
    });

    it("requires the auth pair and the database key in production", () => {
      try {
        parseEnv({ APP_ENV: "production" });
        expect.unreachable("parseEnv should have thrown");
      } catch (error) {
        const issues = (error as EnvValidationError).issues;
        expect(issues).toHaveLength(3);
        const joined = issues.join("\n");
        expect(joined).toMatch(/NEXT_PUBLIC_SUPABASE_URL/);
        expect(joined).toMatch(/NEXT_PUBLIC_SUPABASE_ANON_KEY/);
        expect(joined).toMatch(/SUPABASE_SERVICE_ROLE_KEY/);
      }
    });

    it("rejects an http Supabase URL in production", () => {
      expect(() =>
        parseEnv({
          APP_ENV: "production",
          ...validDeployed,
          NEXT_PUBLIC_SUPABASE_URL: "http://project.supabase.co",
        }),
      ).toThrow(/must use https/);
    });
  });

  describe("database configuration", () => {
    it("marks the database configured when the service key and URL are present", () => {
      const env = parseEnv(validDeployed);
      expect(env.SUPABASE_SERVICE_ROLE_KEY).toBe("service-role-key");
      expect(env.databaseConfigured).toBe(true);
    });

    it("leaves the database unconfigured with only the auth pair (local)", () => {
      const env = parseEnv(validPair);
      expect(env.SUPABASE_SERVICE_ROLE_KEY).toBeNull();
      expect(env.databaseConfigured).toBe(false);
      // Auth still stands on its own — the two are configured independently.
      expect(env.authConfigured).toBe(true);
    });

    it("requires a project URL when only the service key is set (local)", () => {
      expect(() =>
        parseEnv({ SUPABASE_SERVICE_ROLE_KEY: "service-role-key" }),
      ).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
    });

    it("requires the service key in preview", () => {
      expect(() => parseEnv({ APP_ENV: "preview", ...validPair })).toThrow(
        /SUPABASE_SERVICE_ROLE_KEY is required when APP_ENV is preview/,
      );
    });
  });

  describe("billing configuration", () => {
    const allBillingValues = {
      STRIPE_SECRET_KEY: "sk_test_123",
      STRIPE_WEBHOOK_SECRET: "whsec_123",
      STRIPE_PRICE_ID_MONTHLY: "price_monthly",
      STRIPE_PRICE_ID_ANNUAL: "price_annual",
    };

    it("marks billing configured only when all four values are present", () => {
      expect(parseEnv(allBillingValues).billingConfigured).toBe(true);
    });

    it("leaves billing unconfigured when a value is missing", () => {
      expect(
        parseEnv({
          STRIPE_SECRET_KEY: "sk_test_123",
          STRIPE_PRICE_ID_MONTHLY: "price_monthly",
          STRIPE_PRICE_ID_ANNUAL: "price_annual",
        }).billingConfigured,
      ).toBe(false);
    });

    it("is optional in production (the flow is not launched yet)", () => {
      expect(
        parseEnv({ APP_ENV: "production", ...validDeployed }).APP_ENV,
      ).toBe("production");
    });

    it("rejects a secret key placed in the public publishable slot", () => {
      expect(() =>
        parseEnv({ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "sk_live_leak" }),
      ).toThrow(/NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY/);
    });

    it("accepts a genuine publishable key", () => {
      expect(
        parseEnv({ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_ok" })
          .NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      ).toBe("pk_test_ok");
    });
  });
});
