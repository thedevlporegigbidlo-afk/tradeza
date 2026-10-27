import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { safeNextPath } from "@/lib/site"
import { env } from "@/lib/env"
import type { Database } from "@/lib/types/database"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const base = (env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin).replace(
    /\/+$/,
    ""
  )
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

  if (!code) {
    return NextResponse.redirect(`${base}/login?error=auth_error`)
  }

  const response = NextResponse.redirect(`${base}${next}`)

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
            try {
              request.cookies.set(name, value)
            } catch {}
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("auth/callback exchangeCodeForSession error:", error.message)
    return NextResponse.redirect(`${base}/login?error=auth_error`)
  }

  await supabase.auth.getUser()

  return response
}
