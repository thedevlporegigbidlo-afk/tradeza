import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  getUserBusinesses,
  getUserOpportunities,
} from "@/lib/queries"
import { BusinessRowActions } from "@/components/business-row-actions"
import { OpportunityRowActions } from "@/components/opportunity-row-actions"
import { EmptyState } from "@/components/empty-state"
import { relativeTime } from "@/lib/utils"

export const metadata: Metadata = {
  title: "My Business — Tradeza",
}

export const instant = false

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-[#EDF3ED] text-[#236B50] border-[#CCD5CB]",
    draft: "bg-surface-container-highest text-[#66716A] border-[#E4E9E3]",
    closed: "bg-error-container text-on-error-container border-[#FFDAD6]",
  }
  return (
    <span
      className={`inline-block font-label-sm text-label-sm font-semibold px-2.5 py-1 rounded-full border ${styles[status] ?? styles.draft}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default async function MyBusinessPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string }>
}) {
  await connection()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [businesses, opportunities, params] = await Promise.all([
    getUserBusinesses(user.id),
    getUserOpportunities(user.id),
    searchParams,
  ])

  const flash = params.created
    ? "Saved. It is currently a draft — publish it when you are ready."
    : params.updated
      ? "Your changes have been saved."
      : null

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#202923] font-bold tracking-tight">
              My business
            </h1>
            <p className="font-body-md text-body-md text-[#66716A] mt-1">
              Manage your listings and opportunities.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/list-business"
              className="bg-primary-container hover:bg-[#1C573F] text-on-primary font-label-lg text-label-lg px-5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              New business
            </Link>
            <Link
              href="/post-opportunity"
              className="bg-surface-container-lowest hover:bg-[#FAFAF7] text-[#202923] border border-[#E4E9E3] hover:border-[#CCD5CB] font-label-lg text-label-lg px-5 py-2.5 rounded-xl transition-all"
            >
              New opportunity
            </Link>
          </div>
        </div>

        {flash && (
          <div className="mb-8 bg-[#EDF3ED] text-[#236B50] font-body-sm text-body-sm rounded-xl px-4 py-3 border border-[#CCD5CB]">
            {flash}
          </div>
        )}

        {/* Businesses */}
        <div className="mb-12">
          <h2 className="font-headline-md text-headline-md text-[#202923] font-bold mb-5">
            Businesses
          </h2>
          {businesses.length === 0 ? (
            <EmptyState
              title="No businesses yet"
              description="Create your first business profile to appear in the directory."
              action={
                <Link
                  href="/list-business"
                  className="inline-block bg-primary-container hover:bg-[#1C573F] text-on-primary font-label-lg text-label-lg px-6 py-3 rounded-xl transition-all shadow-sm"
                >
                  List Your Business
                </Link>
              }
            />
          ) : (
            <div className="flex flex-col gap-4">
              {businesses.map((business) => (
                <div
                  key={business.id}
                  className="bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl p-6 custom-card-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="font-headline-sm text-headline-sm text-[#202923] font-bold">
                          {business.name}
                        </h3>
                        <StatusBadge status={business.status} />
                      </div>
                      <p className="font-body-sm text-body-sm text-[#66716A]">
                        {business.short_description}
                      </p>
                      <p className="font-label-sm text-label-sm text-outline mt-1">
                        Created {relativeTime(business.created_at)}
                      </p>
                      {(!business.whatsapp ||
                        !business.logo_url ||
                        !business.products ||
                        business.gallery_urls.length === 0) && (
                        <p className="font-label-sm text-label-sm text-primary mt-1">
                          Add WhatsApp, products and photos so buyers can find
                          and contact you.
                        </p>
                      )}
                    </div>
                    <div className="shrink-0">
                      <BusinessRowActions
                        businessId={business.id}
                        status={business.status}
                        slug={business.slug}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Opportunities */}
        <div>
          <h2 className="font-headline-md text-headline-md text-[#202923] font-bold mb-5">
            Opportunities
          </h2>
          {opportunities.length === 0 ? (
            <EmptyState
              title="No opportunities yet"
              description="Post a supplier request, buyer need, or partnership offer."
              action={
                <Link
                  href="/post-opportunity"
                  className="inline-block bg-primary-container hover:bg-[#1C573F] text-on-primary font-label-lg text-label-lg px-6 py-3 rounded-xl transition-all shadow-sm"
                >
                  Post an Opportunity
                </Link>
              }
            />
          ) : (
            <div className="flex flex-col gap-4">
              {opportunities.map((opportunity) => (
                <div
                  key={opportunity.id}
                  className="bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl p-6 custom-card-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="font-headline-sm text-headline-sm text-[#202923] font-bold">
                          {opportunity.title}
                        </h3>
                        <StatusBadge status={opportunity.status} />
                      </div>
                      <p className="font-body-sm text-body-sm text-[#66716A]">
                        {opportunity.description?.slice(0, 140)}
                        {opportunity.description &&
                        opportunity.description.length > 140
                          ? "…"
                          : ""}
                      </p>
                      <p className="font-label-sm text-label-sm text-outline mt-1">
                        Created {relativeTime(opportunity.created_at)}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <OpportunityRowActions
                        opportunityId={opportunity.id}
                        status={opportunity.status}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
