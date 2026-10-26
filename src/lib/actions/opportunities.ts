"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { opportunitySchema } from "@/lib/validation"
import type { FormState } from "@/lib/validation"

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
    is_international: formData.get("is_international") === "on",
    public_email: formData.get("public_email") || undefined,
    public_phone: formData.get("public_phone") || undefined,
    business_id: formData.get("business_id") || undefined,
  })
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

  const supabase = await createClient()

  let businessId: string | null = null
  if (parsed.data.business_id) {
    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", parsed.data.business_id)
      .eq("owner_id", userId)
      .maybeSingle()
    businessId = business?.id ?? null
  }

  const { error } = await supabase.from("opportunities").insert({
    owner_id: userId,
    business_id: businessId,
    title: parsed.data.title,
    type: parsed.data.type,
    description: parsed.data.description,
    country: parsed.data.country ?? null,
    city: parsed.data.city ?? null,
    is_international: parsed.data.is_international,
    public_email: parsed.data.public_email ?? null,
    public_phone: parsed.data.public_phone ?? null,
    status: "draft",
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

  const supabase = await createClient()

  let businessId: string | null = null
  if (parsed.data.business_id) {
    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", parsed.data.business_id)
      .eq("owner_id", userId)
      .maybeSingle()
    businessId = business?.id ?? null
  }

  const { error } = await supabase
    .from("opportunities")
    .update({
      title: parsed.data.title,
      type: parsed.data.type,
      description: parsed.data.description,
      country: parsed.data.country ?? null,
      city: parsed.data.city ?? null,
      is_international: parsed.data.is_international,
      public_email: parsed.data.public_email ?? null,
      public_phone: parsed.data.public_phone ?? null,
      business_id: businessId,
    })
    .eq("id", opportunityId)
    .eq("owner_id", userId)

  if (error) {
    return { error: "Could not update your opportunity. Please try again." }
  }

  revalidatePath("/", "layout")
  redirect("/my-business?updated=1")
}

import type { ActionResult } from "@/lib/validation"

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
