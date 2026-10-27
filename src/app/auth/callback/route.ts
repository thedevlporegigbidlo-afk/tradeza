import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { safeNextPath } from "@/lib/site"
import { env } from "@/lib/env"
import type { Database } from "@/lib/types/database"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  // Prefer the configured public site URL so redirects stay on the canonical host
  const base = (env.NEXT_PUBLIC_SITE_URL ?? origin).replace(/\/+$/, "")
  const code = searchParams.get("code")
  const next = safeNextPath(searchParams.get("next"))
  const providerError = searchParams.get("error")

  if (providerError) {
    const message =
      providerError === "access_denied" ? "sign_in_cancelled" : "auth_error"
    return NextResponse.redirect(
      `${base}/login?error=${encodeURIComponent(message)}`
    )
  }

  if (code) {
    const redirectResponse = NextResponse.redirect(`${base}${next}`)

    const supabase = createServerClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              redirectResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Force cookie write in some environments
      await supabase.auth.getUser()
      return redirectResponse
    }
  }

  return NextResponse.redirect(
    `${base}/login?error=${encodeURIComponent("auth_error")}`
  )
}
