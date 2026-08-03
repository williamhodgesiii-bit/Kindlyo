import { expect, test } from "@playwright/test";

test.describe("health check", () => {
  test("reports ok without leaking configuration", async ({ request }) => {
    const response = await request.get("/api/health");

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.environment).toBeTruthy();
    expect(typeof body.timestamp).toBe("string");

    // Operational values only — never secrets.
    const keys = Object.keys(body).sort();
    expect(keys).toEqual(["environment", "status", "timestamp"]);
  });
});
