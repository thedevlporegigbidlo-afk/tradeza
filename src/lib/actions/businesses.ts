"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { businessSchema } from "@/lib/validation"
import { slugify } from "@/lib/utils"
import type { FormState, ActionResult } from "@/lib/validation"

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
    country: formData.get("country") || undefined,
    city: formData.get("city") || undefined,
    short_description: formData.get("short_description"),
    description: formData.get("description"),
    website_url: formData.get("website_url") || undefined,
    public_email: formData.get("public_email") || undefined,
    public_phone: formData.get("public_phone") || undefined,
  })
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

  const supabase = await createClient()
  const slug = await uniqueSlug(parsed.data.name)

  const { error } = await supabase.from("businesses").insert({
    owner_id: userId,
    name: parsed.data.name,
    slug,
    category_id: parsed.data.category_id,
    country: parsed.data.country ?? null,
    city: parsed.data.city ?? null,
    short_description: parsed.data.short_description,
    description: parsed.data.description,
    website_url: parsed.data.website_url ?? null,
    public_email: parsed.data.public_email ?? null,
    public_phone: parsed.data.public_phone ?? null,
    status: "draft",
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

  const supabase = await createClient()
  const { error } = await supabase
    .from("businesses")
    .update({
      name: parsed.data.name,
      category_id: parsed.data.category_id,
      country: parsed.data.country ?? null,
      city: parsed.data.city ?? null,
      short_description: parsed.data.short_description,
      description: parsed.data.description,
      website_url: parsed.data.website_url ?? null,
      public_email: parsed.data.public_email ?? null,
      public_phone: parsed.data.public_phone ?? null,
    })
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
