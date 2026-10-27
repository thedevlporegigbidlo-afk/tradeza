import Link from "next/link"
import { TradezaLogo } from "@/components/tradeza-logo"

export function SiteFooter() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant w-full">
      <div className="w-full max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 pb-8 border-b border-[#E4E9E3]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <TradezaLogo size="sm" />
            </div>
            <p className="font-body-sm text-body-sm text-[#66716A]">
              Good businesses connect here.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-6 font-label-md text-label-md">
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="/businesses"
            >
              Explore Businesses
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="/opportunities"
            >
              Opportunities
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="/list-business"
            >
              List Your Business
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="/post-opportunity"
            >
              Post an Opportunity
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="/pricing"
            >
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-[#66716A]">
          <p>© 2025 Tradeza. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-container" />
              Global Enterprise Network
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
