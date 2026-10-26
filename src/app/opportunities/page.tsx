import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { Icon } from "@/components/icon"
import { OpportunityCard } from "@/components/opportunity-card"
import { EmptyState } from "@/components/empty-state"
import { Pagination } from "@/components/pagination"
import {
  getPublishedOpportunities,
  getOpportunityCountries,
} from "@/lib/queries"
import {
  OPPORTUNITY_TYPES,
  OPPORTUNITY_TYPE_LABELS,
  OPPORTUNITY_PAGE_SIZE,
} from "@/lib/constants"

export const metadata: Metadata = {
  title: "Business Opportunities — Tradeza",
  description:
    "Browse published opportunities from businesses worldwide: suppliers, buyers, distributors, and partnerships.",
}

export const instant = false

type SearchParams = {
  q?: string
  type?: string
  country?: string
  page?: string
}

async function OpportunityResults({
  q,
  type,
  country,
  page,
}: SearchParams & { page: string }) {
  const pageNum = Number(page) || 1
  const [{ opportunities, total, pageCount }, countries] = await Promise.all([
    getPublishedOpportunities({ q, type, country, page: pageNum }),
    getOpportunityCountries(),
  ])

  const currentFilters: Record<string, string | undefined> = {
    q,
    type,
    country,
  }

  return (
    <>
      <form
        method="get"
        action="/opportunities"
        className="mb-10 bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl p-5 custom-card-shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label
              htmlFor="q"
              className="block font-label-lg text-label-lg text-[#202923] mb-1.5"
            >
              Search
            </label>
            <div className="flex items-center gap-2 border border-[#E4E9E3] rounded-xl px-3 py-2.5 bg-surface-container-lowest focus-within:border-primary-container focus-within:ring-4 focus-within:ring-primary-container/10 transition-all">
              <Icon name="search" className="text-outline" />
              <input
                id="q"
                name="q"
                type="search"
                defaultValue={q ?? ""}
                placeholder="Title, description, location…"
                className="w-full bg-transparent border-0 p-0 text-on-surface font-body-md text-body-md placeholder:text-outline focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="type"
              className="block font-label-lg text-label-lg text-[#202923] mb-1.5"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              defaultValue={type ?? ""}
              className="w-full bg-surface-container-lowest border border-[#E4E9E3] rounded-xl px-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"
            >
              <option value="">All types</option>
              {OPPORTUNITY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {OPPORTUNITY_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="country"
              className="block font-label-lg text-label-lg text-[#202923] mb-1.5"
            >
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              list="opp-country-list"
              defaultValue={country ?? ""}
              placeholder="Any country"
              className="w-full bg-surface-container-lowest border border-[#E4E9E3] rounded-xl px-3 py-2.5 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"
            />
            <datalist id="opp-country-list">
              {countries.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            className="bg-primary-container hover:bg-[#1C573F] active:scale-[0.99] text-on-primary font-label-lg text-label-lg px-6 py-2.5 rounded-xl transition-all duration-150 shadow-sm"
          >
            Apply filters
          </button>
          <Link
            href="/opportunities"
            className="text-on-surface-variant hover:text-primary font-label-lg text-label-lg px-3 py-2 transition-colors"
          >
            Clear all
          </Link>
          <span className="ml-auto font-label-md text-label-md text-[#66716A]">
            {total} result{total === 1 ? "" : "s"}
          </span>
        </div>
      </form>

      {opportunities.length === 0 ? (
        <EmptyState
          title="No opportunities found"
          description="Try a different search or clear the filters. You can also post your own opportunity."
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
          <Pagination
            page={pageNum}
            pageCount={pageCount}
            basePath="/opportunities"
            searchParams={currentFilters}
          />
        </>
      )}
    </>
  )
}

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: OPPORTUNITY_PAGE_SIZE }).map((_, i) => (
        <div
          key={i}
          className="bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl h-72 animate-pulse"
        />
      ))}
    </div>
  )
}

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
            <span className="font-label-sm text-label-sm font-bold text-primary uppercase tracking-wide">
              Live Deal Flow
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#202923] font-bold tracking-tight">
            Business opportunities
          </h1>
          <p className="font-body-md text-body-md text-[#66716A] mt-1">
            Explore active requests from businesses worldwide.
          </p>
        </div>
        <Suspense fallback={<ResultsSkeleton />}>
          <OpportunityResults
            q={params.q}
            type={params.type}
            country={params.country}
            page={params.page ?? "1"}
          />
        </Suspense>
      </div>
    </section>
  )
}
