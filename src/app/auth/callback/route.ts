import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { safeNextPath } from "@/lib/site"
import { env } from "@/lib/env"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  // Prefer the configured public site URL so redirects stay on the canonical
  // host even when the request reaches us through a proxy.
  const base = (env.NEXT_PUBLIC_SITE_URL ?? origin).replace(/\/+$/, "")
  const code = searchParams.get("code")
  const next = safeNextPath(searchParams.get("next"))
  const providerError = searchParams.get("error")

  if (providerError) {
    const message =
      providerError === "access_denied"
        ? "sign_in_cancelled"
        : "auth_error"
    return NextResponse.redirect(
      `${base}/login?error=${encodeURIComponent(message)}`
    )
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${base}${next}`)
    }
  }

  return NextResponse.redirect(
    `${base}/login?error=${encodeURIComponent("auth_error")}`
  )
}
