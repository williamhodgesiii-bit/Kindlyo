import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins class names with a single space", () => {
    expect(cn("rounded-lg", "bg-surface")).toBe("rounded-lg bg-surface");
  });

  it("drops falsy values so conditional classes stay readable", () => {
    const isSelected = false;
    expect(cn("border", isSelected && "border-brand-primary", undefined)).toBe(
      "border",
    );
  });

  it("keeps the caller's class last", () => {
    // Components append the caller's className so intent reads correctly, even
    // though Tailwind precedence comes from stylesheet order, not this one.
    expect(cn("p-4", "mt-8")).toBe("p-4 mt-8");
  });

  it("returns an empty string when nothing is supplied", () => {
    expect(cn(undefined, null, false)).toBe("");
  });
});
