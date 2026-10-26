import { z } from "zod"
import { BUSINESS_TYPES, OPPORTUNITY_TYPES } from "@/lib/constants"

const optionalTrimmed = z
  .string()
  .trim()
  .max(500, "This field is too long.")
  .optional()
  .transform((v) => (v ? v : undefined))

const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} is too long.`)
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

// WhatsApp numbers are typed in many formats (+91 98765 43210, 09876543210,
// 0091…). Store what the owner typed but require a usable number of digits.
const optionalWhatsapp = optionalPhone.refine(
  (v) => {
    if (!v) return true
    const digits = v.replace(/\D/g, "")
    return digits.length >= 7 && digits.length <= 15
  },
  { message: "Enter a WhatsApp number with 7 to 15 digits." }
)

const optionalYear = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.coerce
    .number()
    .int()
    .min(1900, "Year must be 1900 or later.")
    .max(2100, "Year must be 2100 or earlier.")
    .optional()
)

const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), {
    message: "Enter a valid date.",
  })

const galleryUrls = z
  .array(z.string().trim().max(500, "Image URL is too long."))
  .max(8, "You can add up to 8 photos.")
  .optional()
  .transform((urls) =>
    (urls ?? []).filter((url) => /^https?:\/\/\S+$/.test(url))
  )

export const businessSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Business name must be at least 2 characters.")
    .max(120, "Business name is too long."),
  category_id: z.string().uuid("Choose a category."),
  business_type: z.enum(BUSINESS_TYPES, {
    message: "Choose a business type.",
  }),
  country: optionalTrimmed,
  city: optionalTrimmed,
  service_areas: optionalText(300, "Service areas"),
  established_year: optionalYear,
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
  products: optionalText(1000, "Products and services"),
  price_range: optionalText(120, "Price range"),
  moq: optionalText(120, "Minimum order quantity"),
  logo_url: optionalUrl,
  gallery_urls: galleryUrls,
  website_url: optionalUrl,
  public_email: optionalEmail,
  public_phone: optionalPhone,
  whatsapp: optionalWhatsapp,
  contact_name: optionalText(80, "Contact name"),
  designation: optionalText(80, "Designation"),
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
  quantity: optionalText(160, "Quantity"),
  budget: optionalText(160, "Budget"),
  deadline: optionalDate,
  is_international: z
    .union([z.boolean(), z.literal("on"), z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => v === true || v === "on" || v === "true"),
  public_email: optionalEmail,
  public_phone: optionalPhone,
  whatsapp: optionalWhatsapp,
  contact_name: optionalText(80, "Contact name"),
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
