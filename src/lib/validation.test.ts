import { describe, expect, it } from "vitest"
import { businessSchema, opportunitySchema } from "./validation"

const categoryId = "7438820c-37b3-437a-9464-14b682895f64"

describe("businessSchema", () => {
  const valid = {
    name: "Northstar Solar Supply",
    category_id: categoryId,
    short_description: "Solar panels and mounting hardware for distributors.",
    description: "We manufacture and export solar mounting systems worldwide.",
    website_url: "https://example.com",
    public_email: "sales@example.com",
  }

  it("accepts a valid business", () => {
    const result = businessSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it("rejects a non-uuid category", () => {
    const result = businessSchema.safeParse({ ...valid, category_id: "nope" })
    expect(result.success).toBe(false)
  })

  it("rejects an invalid website url", () => {
    const result = businessSchema.safeParse({
      ...valid,
      website_url: "example.com",
    })
    expect(result.success).toBe(false)
  })

  it("rejects an invalid email", () => {
    const result = businessSchema.safeParse({
      ...valid,
      public_email: "not-an-email",
    })
    expect(result.success).toBe(false)
  })

  it("rejects a too-short description", () => {
    const result = businessSchema.safeParse({ ...valid, description: "short" })
    expect(result.success).toBe(false)
  })

  it("treats empty optional fields as undefined", () => {
    const result = businessSchema.safeParse({
      ...valid,
      website_url: "",
      public_email: "",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.website_url).toBeUndefined()
      expect(result.data.public_email).toBeUndefined()
    }
  })
})

describe("opportunitySchema", () => {
  const valid = {
    title: "Looking for packaging suppliers",
    type: "supplier_needed",
    description:
      "We need sustainable packaging suppliers for monthly volumes above 10k units.",
    country: "India",
    city: "Jaipur",
    is_international: true,
  }

  it("accepts a valid opportunity", () => {
    const result = opportunitySchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it("rejects an unsupported type", () => {
    const result = opportunitySchema.safeParse({ ...valid, type: "hiring" })
    expect(result.success).toBe(false)
  })

  it("normalises the checkbox value", () => {
    const result = opportunitySchema.safeParse({
      ...valid,
      is_international: "on",
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.is_international).toBe(true)
  })

  it("defaults is_international to false", () => {
    const withoutFlag = {
      title: valid.title,
      type: valid.type,
      description: valid.description,
    }
    const result = opportunitySchema.safeParse(withoutFlag)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.is_international).toBe(false)
  })
})
