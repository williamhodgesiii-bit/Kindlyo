import { describe, expect, it } from "vitest";
import { EnvValidationError, parseEnv } from "./env";

const validPair = {
  NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
};

describe("parseEnv", () => {
  it("falls back to local defaults when nothing is set", () => {
    expect(parseEnv({})).toEqual({
      APP_ENV: "local",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NEXT_PUBLIC_SUPABASE_URL: null,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: null,
      authConfigured: false,
    });
  });

  it("accepts each valid APP_ENV value", () => {
    for (const value of ["local", "preview", "production"] as const) {
      // preview/production require the Supabase pair, so supply it.
      expect(parseEnv({ APP_ENV: value, ...validPair }).APP_ENV).toBe(value);
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
      authConfigured: false,
    });
  });

  it("trims surrounding whitespace", () => {
    expect(parseEnv({ APP_ENV: "  production  ", ...validPair }).APP_ENV).toBe(
      "production",
    );
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

    it("requires the pair in production", () => {
      try {
        parseEnv({ APP_ENV: "production" });
        expect.unreachable("parseEnv should have thrown");
      } catch (error) {
        const issues = (error as EnvValidationError).issues;
        expect(issues).toHaveLength(2);
        expect(issues.join("\n")).toMatch(/NEXT_PUBLIC_SUPABASE_URL/);
        expect(issues.join("\n")).toMatch(/NEXT_PUBLIC_SUPABASE_ANON_KEY/);
      }
    });

    it("rejects an http Supabase URL in production", () => {
      expect(() =>
        parseEnv({
          APP_ENV: "production",
          NEXT_PUBLIC_SUPABASE_URL: "http://project.supabase.co",
          NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
        }),
      ).toThrow(/must use https/);
    });
  });
});
