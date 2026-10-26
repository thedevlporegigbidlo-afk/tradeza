"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { businessSchema } from "@/lib/validation"
import { escapeLike, slugify } from "@/lib/utils"
import type { FormState, ActionResult } from "@/lib/validation"

const MAX_BUSINESSES_PER_USER = 3

async function requireUserId(): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  return user.id
}

async function uniqueSlug(base: string): Promise<string> {
  const supabase = await createClient()
  const root = slugify(base) || "business"
  let candidate = root
  for (let i = 2; i <= 50; i++) {
    const { data } = await supabase
      .from("businesses")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle()
    if (!data) return candidate
    candidate = `${root}-${i}`
  }
  return `${root}-${Date.now().toString(36)}`
}

function parseBusinessForm(formData: FormData) {
  return businessSchema.safeParse({
    name: formData.get("name"),
    category_id: formData.get("category_id"),
    business_type: formData.get("business_type") || undefined,
    country: formData.get("country") || undefined,
    city: formData.get("city") || undefined,
    service_areas: formData.get("service_areas") || undefined,
    established_year: formData.get("established_year") || undefined,
    short_description: formData.get("short_description"),
    description: formData.get("description"),
    products: formData.get("products") || undefined,
    price_range: formData.get("price_range") || undefined,
    moq: formData.get("moq") || undefined,
    logo_url: formData.get("logo_url") || undefined,
    gallery_urls: formData
      .getAll("gallery_urls")
      .filter((v): v is string => typeof v === "string" && v.length > 0),
    website_url: formData.get("website_url") || undefined,
    public_email: formData.get("public_email") || undefined,
    public_phone: formData.get("public_phone") || undefined,
    whatsapp: formData.get("whatsapp") || undefined,
    contact_name: formData.get("contact_name") || undefined,
    designation: formData.get("designation") || undefined,
  })
}

function listingPayload(data: ReturnType<typeof parseBusinessForm>) {
  if (!data.success) return null
  const v = data.data
  return {
    name: v.name,
    category_id: v.category_id,
    business_type: v.business_type ?? null,
    country: v.country ?? null,
    city: v.city ?? null,
    service_areas: v.service_areas ?? null,
    established_year: v.established_year ?? null,
    short_description: v.short_description,
    description: v.description,
    products: v.products ?? null,
    price_range: v.price_range ?? null,
    moq: v.moq ?? null,
    logo_url: v.logo_url ?? null,
    gallery_urls: v.gallery_urls ?? [],
    website_url: v.website_url ?? null,
    public_email: v.public_email ?? null,
    public_phone: v.public_phone ?? null,
    whatsapp: v.whatsapp ?? null,
    contact_name: v.contact_name ?? null,
    designation: v.designation ?? null,
  }
}

export async function createBusiness(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = await requireUserId()

  const parsed = parseBusinessForm(formData)
  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    }
  }

  const payload = listingPayload(parsed)
  if (!payload) {
    return { error: "Please check the form and try again." }
  }

  const supabase = await createClient()

  const [{ count }, { data: duplicate }] = await Promise.all([
    supabase
      .from("businesses")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", userId),
    supabase
      .from("businesses")
      .select("id")
      .eq("owner_id", userId)
      .ilike("name", escapeLike(payload.name))
      .maybeSingle(),
  ])

  if ((count ?? 0) >= MAX_BUSINESSES_PER_USER) {
    return {
      error:
        "You already have the maximum number of business profiles. Edit an existing one instead.",
    }
  }

  if (duplicate) {
    return { error: "You already have a listing with this business name." }
  }

  const slug = await uniqueSlug(payload.name)

  const { error } = await supabase.from("businesses").insert({
    owner_id: userId,
    slug,
    status: "draft",
    ...payload,
  })

  if (error) {
    if (error.code === "23505") {
      return { error: "A business with a similar name already exists." }
    }
    return { error: "Could not save your business. Please try again." }
  }

  revalidatePath("/", "layout")
  redirect("/my-business?created=1")
}

export async function updateBusiness(
  businessId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = await requireUserId()

  const parsed = parseBusinessForm(formData)
  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    }
  }

  const payload = listingPayload(parsed)
  if (!payload) {
    return { error: "Please check the form and try again." }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("businesses")
    .update(payload)
    .eq("id", businessId)
    .eq("owner_id", userId)

  if (error) {
    return { error: "Could not update your business. Please try again." }
  }

  revalidatePath("/", "layout")
  redirect("/my-business?updated=1")
}

export async function setBusinessStatus(
  businessId: string,
  status: "draft" | "published"
): Promise<ActionResult> {
  const userId = await requireUserId()
  const supabase = await createClient()

  const { error } = await supabase
    .from("businesses")
    .update({ status })
    .eq("id", businessId)
    .eq("owner_id", userId)

  if (error) {
    return { error: "Could not update this listing. Please try again." }
  }

  revalidatePath("/", "layout")
  return {}
}

export async function deleteBusiness(
  businessId: string
): Promise<ActionResult> {
  const userId = await requireUserId()
  const supabase = await createClient()

  const { error } = await supabase
    .from("businesses")
    .delete()
    .eq("id", businessId)
    .eq("owner_id", userId)

  if (error) {
    return { error: "Could not delete this listing. Please try again." }
  }

  revalidatePath("/", "layout")
  return {}
}
