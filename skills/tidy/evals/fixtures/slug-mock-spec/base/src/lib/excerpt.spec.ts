import { describe, expect, it } from "vitest";
import { excerpt } from "./excerpt";

describe("excerpt", () => {
  it("returns short bodies unchanged apart from whitespace", () => {
    expect(excerpt("  Hello\n\nworld  ")).toBe("Hello world");
  });

  it("cuts on a word boundary", () => {
    expect(excerpt("alpha beta gamma delta", 12)).toBe("alpha beta...");
  });
});
