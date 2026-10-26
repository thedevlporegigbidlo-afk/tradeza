import { describe, expect, it } from "vitest"
import {
  escapeLike,
  initials,
  locationLabel,
  relativeTime,
  safeNextPath,
  slugify,
} from "./utils"

describe("slugify", () => {
  it("creates url-safe slugs", () => {
    expect(slugify("Northstar Solar Supply")).toBe("northstar-solar-supply")
    expect(slugify("  O'Brien & Sons!! ")).toBe("obrien-sons")
  })

  it("trims leading and trailing separators", () => {
    expect(slugify("--hello--")).toBe("hello")
    expect(slugify("!!!")).toBe("")
  })
})

describe("escapeLike", () => {
  it("strips PostgREST filter syntax and LIKE wildcards", () => {
    expect(escapeLike("a,b(c)d*e%f_g")).toBe("a b c d e f g")
  })

  it("keeps normal words and collapses whitespace", () => {
    expect(escapeLike("  solar   panels  ")).toBe("solar panels")
  })

  it("caps very long terms", () => {
    expect(escapeLike("a".repeat(300)).length).toBe(100)
  })
})

describe("safeNextPath", () => {
  it("accepts same-origin paths", () => {
    expect(safeNextPath("/my-business")).toBe("/my-business")
    expect(safeNextPath("/businesses?q=solar")).toBe("/businesses?q=solar")
  })

  it("rejects absolute external urls", () => {
    expect(safeNextPath("https://evil.example")).toBe("/my-business")
  })

  it("rejects protocol-relative and backslash tricks", () => {
    expect(safeNextPath("//evil.example")).toBe("/my-business")
    expect(safeNextPath("/\\evil.example")).toBe("/my-business")
    expect(safeNextPath("/\\/evil.example")).toBe("/my-business")
  })

  it("falls back for empty or relative input", () => {
    expect(safeNextPath(null)).toBe("/my-business")
    expect(safeNextPath("my-business")).toBe("/my-business")
  })

  it("supports a custom fallback", () => {
    expect(safeNextPath("https://evil.example", "/")).toBe("/")
  })
})

describe("display helpers", () => {
  it("builds initials", () => {
    expect(initials("Northstar Solar Supply")).toBe("NS")
    expect(initials("Tradeza")).toBe("TR")
    expect(initials("   ")).toBe("?")
  })

  it("builds a location label", () => {
    expect(locationLabel("Jaipur", "India")).toBe("Jaipur, India")
    expect(locationLabel(null, "India")).toBe("India")
    expect(locationLabel(null, null)).toBe("")
  })

  it("formats relative time", () => {
    const now = new Date()
    expect(relativeTime(new Date(now.getTime() - 5000).toISOString())).toBe(
      "Just now"
    )
    expect(relativeTime(new Date(now.getTime() - 3600_000).toISOString())).toBe(
      "1 hour ago"
    )
    expect(relativeTime("not-a-date")).toBe("")
  })
})
