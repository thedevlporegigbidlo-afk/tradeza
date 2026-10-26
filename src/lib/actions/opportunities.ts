"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { opportunitySchema } from "@/lib/validation"
import type { FormState, ActionResult } from "@/lib/validation"

const DUPLICATE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

async function requireUserId(): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  return user.id
}

function parseOpportunityForm(formData: FormData) {
  return opportunitySchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    description: formData.get("description"),
    country: formData.get("country") || undefined,
    city: formData.get("city") || undefined,
    quantity: formData.get("quantity") || undefined,
    budget: formData.get("budget") || undefined,
    deadline: formData.get("deadline") || undefined,
    is_international: formData.get("is_international") === "on",
    public_email: formData.get("public_email") || undefined,
    public_phone: formData.get("public_phone") || undefined,
    whatsapp: formData.get("whatsapp") || undefined,
    contact_name: formData.get("contact_name") || undefined,
    business_id: formData.get("business_id") || undefined,
  })
}

function opportunityPayload(data: ReturnType<typeof parseOpportunityForm>) {
  if (!data.success) return null
  const v = data.data
  return {
    title: v.title,
    type: v.type,
    description: v.description,
    country: v.country ?? null,
    city: v.city ?? null,
    quantity: v.quantity ?? null,
    budget: v.budget ?? null,
    deadline: v.deadline ?? null,
    is_international: v.is_international,
    public_email: v.public_email ?? null,
    public_phone: v.public_phone ?? null,
    whatsapp: v.whatsapp ?? null,
    contact_name: v.contact_name ?? null,
  }
}

async function resolveOwnedBusinessId(
  userId: string,
  businessId: string | undefined
): Promise<string | null> {
  if (!businessId) return null
  const supabase = await createClient()
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("id", businessId)
    .eq("owner_id", userId)
    .maybeSingle()
  return business?.id ?? null
}

export async function createOpportunity(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = await requireUserId()

  const parsed = parseOpportunityForm(formData)
  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    }
  }

  const payload = opportunityPayload(parsed)
  if (!payload) return { error: "Please check the form and try again." }

  const supabase = await createClient()

  const { data: duplicate } = await supabase
    .from("opportunities")
    .select("id")
    .eq("owner_id", userId)
    .eq("title", payload.title)
    .gte("created_at", new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString())
    .maybeSingle()

  if (duplicate) {
    return {
      error:
        "You already posted an opportunity with this title in the last 7 days. Edit that post instead.",
    }
  }

  const businessId = await resolveOwnedBusinessId(
    userId,
    parsed.data.business_id
  )

  const { error } = await supabase.from("opportunities").insert({
    owner_id: userId,
    business_id: businessId,
    status: "draft",
    ...payload,
  })

  if (error) {
    return { error: "Could not save your opportunity. Please try again." }
  }

  revalidatePath("/", "layout")
  redirect("/my-business?created=1")
}

export async function updateOpportunity(
  opportunityId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = await requireUserId()

  const parsed = parseOpportunityForm(formData)
  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    }
  }

  const payload = opportunityPayload(parsed)
  if (!payload) return { error: "Please check the form and try again." }

  const supabase = await createClient()
  const businessId = await resolveOwnedBusinessId(
    userId,
    parsed.data.business_id
  )

  const { error } = await supabase
    .from("opportunities")
    .update({ ...payload, business_id: businessId })
    .eq("id", opportunityId)
    .eq("owner_id", userId)

  if (error) {
    return { error: "Could not update your opportunity. Please try again." }
  }

  revalidatePath("/", "layout")
  redirect("/my-business?updated=1")
}

export async function setOpportunityStatus(
  opportunityId: string,
  status: "draft" | "published" | "closed"
): Promise<ActionResult> {
  const userId = await requireUserId()
  const supabase = await createClient()

  const { error } = await supabase
    .from("opportunities")
    .update({ status })
    .eq("id", opportunityId)
    .eq("owner_id", userId)

  if (error) {
    return { error: "Could not update this opportunity. Please try again." }
  }

  revalidatePath("/", "layout")
  return {}
}

export async function deleteOpportunity(
  opportunityId: string
): Promise<ActionResult> {
  const userId = await requireUserId()
  const supabase = await createClient()

  const { error } = await supabase
    .from("opportunities")
    .delete()
    .eq("id", opportunityId)
    .eq("owner_id", userId)

  if (error) {
    return { error: "Could not delete this opportunity. Please try again." }
  }

  revalidatePath("/", "layout")
  return {}
}
