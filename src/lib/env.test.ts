import { describe, expect, it } from "vitest";
import { EnvValidationError, parseEnv } from "./env";

describe("parseEnv", () => {
  it("falls back to local defaults when nothing is set", () => {
    expect(parseEnv({})).toEqual({
      APP_ENV: "local",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    });
  });

  it("accepts each valid APP_ENV value", () => {
    for (const value of ["local", "preview", "production"] as const) {
      expect(parseEnv({ APP_ENV: value }).APP_ENV).toBe(value);
    }
  });

  it("accepts a valid https URL", () => {
    expect(
      parseEnv({ NEXT_PUBLIC_APP_URL: "https://kindlyo.example" })
        .NEXT_PUBLIC_APP_URL,
    ).toBe("https://kindlyo.example");
  });

  it("treats empty strings as unset", () => {
    expect(parseEnv({ APP_ENV: "", NEXT_PUBLIC_APP_URL: "" })).toEqual({
      APP_ENV: "local",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    });
  });

  it("trims surrounding whitespace", () => {
    expect(parseEnv({ APP_ENV: "  production  " }).APP_ENV).toBe("production");
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
});
