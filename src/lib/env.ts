import { z } from "zod"

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  DODO_API_KEY: z.string().min(1).optional(),
  DODO_WEBHOOK_SECRET: z.string().min(1).optional(),
  DODO_PRODUCT_ID: z.string().min(1).optional(),
  DODO_ENDPOINT_ID: z.string().min(1).optional(),
})

export const env = schema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  DODO_API_KEY: process.env.DODO_API_KEY,
  DODO_WEBHOOK_SECRET: process.env.DODO_WEBHOOK_SECRET,
  DODO_PRODUCT_ID: process.env.DODO_PRODUCT_ID,
  DODO_ENDPOINT_ID: process.env.DODO_ENDPOINT_ID,
})
