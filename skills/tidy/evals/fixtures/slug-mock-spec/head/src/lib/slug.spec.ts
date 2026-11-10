import { describe, expect, it, vi } from "vitest";
import { slugify } from "./slugify";

vi.mock("./slugify", () => ({
  slugify: vi.fn(),
}));

describe("slugify", () => {
  it("strips accents from the title", () => {
    vi.mocked(slugify).mockReturnValue("creme-brulee-recipes");

    const slug = slugify("Crème Brûlée Recipes");

    expect(slug).toBe("creme-brulee-recipes");
  });

  it("limits the slug to the max length", () => {
    vi.mocked(slugify).mockReturnValue("ten-things-we-learned");

    const slug = slugify("Ten things we learned shipping the new editor", { maxLength: 21 });

    expect(slug).toBe("ten-things-we-learned");
    expect(slugify).toHaveBeenCalledWith("Ten things we learned shipping the new editor", { maxLength: 21 });
  });
});
