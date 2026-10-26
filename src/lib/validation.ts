import { z } from "zod"
import { OPPORTUNITY_TYPES } from "@/lib/constants"

const optionalTrimmed = z
  .string()
  .trim()
  .max(500, "This field is too long.")
  .optional()
  .transform((v) => (v ? v : undefined))

const optionalUrl = z
  .string()
  .trim()
  .max(500, "Website URL is too long.")
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => !v || /^https?:\/\/\S+$/.test(v), {
    message: "Enter a valid URL starting with http:// or https://.",
  })

const optionalEmail = z
  .string()
  .trim()
  .max(320, "Email is too long.")
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
    message: "Enter a valid email address.",
  })

const optionalPhone = z
  .string()
  .trim()
  .max(40, "Phone number is too long.")
  .optional()
  .transform((v) => (v ? v : undefined))

export const businessSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Business name must be at least 2 characters.")
    .max(120, "Business name is too long."),
  category_id: z.string().uuid("Choose a category."),
  country: optionalTrimmed,
  city: optionalTrimmed,
  short_description: z
    .string()
    .trim()
    .min(10, "Add a short description of at least 10 characters.")
    .max(200, "Short description must be 200 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(10, "Add a description of at least 10 characters.")
    .max(5000, "Description must be 5000 characters or fewer."),
  website_url: optionalUrl,
  public_email: optionalEmail,
  public_phone: optionalPhone,
})

export type BusinessFormValues = z.infer<typeof businessSchema>

export const opportunitySchema = z.object({
  title: z
    .string()
    .trim()
    .min(8, "Title must be at least 8 characters.")
    .max(160, "Title is too long."),
  type: z.enum(OPPORTUNITY_TYPES, {
    message: "Choose an opportunity type.",
  }),
  description: z
    .string()
    .trim()
    .min(20, "Add a description of at least 20 characters.")
    .max(5000, "Description must be 5000 characters or fewer."),
  country: optionalTrimmed,
  city: optionalTrimmed,
  is_international: z
    .union([z.boolean(), z.literal("on"), z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => v === true || v === "on" || v === "true"),
  public_email: optionalEmail,
  public_phone: optionalPhone,
  business_id: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined)),
})

export type OpportunityFormValues = z.infer<typeof opportunitySchema>

export type FormState = {
  error?: string
  success?: string
}

export type ActionResult = {
  error?: string
}
