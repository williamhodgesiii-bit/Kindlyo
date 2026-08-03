import { describe, expect, it } from "vitest";
import { placeholderModule } from "./placeholder";

describe("placeholderModule", () => {
  it("matches the module named in the MVP scope", () => {
    expect(placeholderModule.title).toBe("Meeting People");
  });

  it("is marked draft, since no content has been reviewed", () => {
    expect(placeholderModule.status).toBe("draft");
  });

  it("lists the eight scoped lessons", () => {
    expect(placeholderModule.lessons).toHaveLength(8);
  });

  it("numbers lessons consecutively from one", () => {
    const orders = placeholderModule.lessons.map((lesson) => lesson.order);
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("gives every lesson a non-empty title", () => {
    for (const lesson of placeholderModule.lessons) {
      expect(lesson.title.trim().length).toBeGreaterThan(0);
    }
  });
});
