import Link from "next/link"
import { connection } from "next/server"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { TradezaLogo } from "@/components/tradeza-logo"
import { UserMenu } from "@/components/user-menu"

export const LOGO_URL = "/tradeza-mark.svg"

function BrandLogo() {
  return <TradezaLogo size="md" className="group" />
}

async function HeaderAuth() {
  await connection()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, email")
      .eq("id", user.id)
      .maybeSingle()

    const displayName =
      profile?.full_name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "User"
    const email = profile?.email || user.email || ""
    const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || null

    return <UserMenu name={displayName} email={email} avatarUrl={avatarUrl} />
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        className="text-on-surface-variant hover:text-primary font-label-lg text-label-lg px-3 py-2 transition-colors active:scale-[0.99]"
        href="/login"
      >
        Log in
      </Link>
      <Link
        className="bg-primary-container hover:bg-[#1C573F] active:scale-[0.99] text-on-primary font-label-lg text-label-lg px-5 py-2.5 rounded-xl transition-all duration-150 shadow-sm flex items-center gap-1.5"
        href="/login?next=%2Flist-business"
      >
        <span>List Your Business</span>
      </Link>
    </div>
  )
}

export function SiteHeader() {
  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-6 h-20">
        <BrandLogo />
        <nav className="hidden md:flex items-center gap-8">
          <Link
            className="text-on-surface-variant hover:text-primary font-medium transition-colors font-label-lg text-label-lg pb-1"
            href="/businesses"
          >
            Explore Businesses
          </Link>
          <Link
            className="text-on-surface-variant hover:text-primary font-medium transition-colors font-label-lg text-label-lg pb-1"
            href="/opportunities"
          >
            Opportunities
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Suspense
            fallback={
              <Link
                className="text-on-surface-variant hover:text-primary font-label-lg text-label-lg px-3 py-2 transition-colors"
                href="/login"
              >
                Log in
              </Link>
            }
          >
            <HeaderAuth />
          </Suspense>
        </div>
      </div>
    </header>
  )
}
