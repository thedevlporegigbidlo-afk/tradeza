"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { siteUrl, safeNextPath } from "@/lib/site"

export type AuthFormState = {
  error?: string
}

export async function signInWithGoogle(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const next = safeNextPath(formData.get("next") as string | null)
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: siteUrl(`/auth/callback?next=${encodeURIComponent(next)}`),
    },
  })

  if (error) {
    return {
      error: "Could not start Google sign-in. Please try again.",
    }
  }

  redirect(data.url)
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
