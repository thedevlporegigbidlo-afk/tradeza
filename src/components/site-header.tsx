import Link from "next/link"
import { connection } from "next/server"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "@/components/sign-out-button"
import { TradezaLogo } from "@/components/tradeza-logo"

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
    return (
      <div className="flex items-center gap-4">
        <Link
          className="text-on-surface-variant hover:text-primary font-label-lg text-label-lg px-3 py-2 transition-colors active:scale-[0.99]"
          href="/my-business"
        >
          My Business
        </Link>
        <SignOutButton />
      </div>
    )
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
        href="/list-business"
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
