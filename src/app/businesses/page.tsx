import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { Icon } from "@/components/icon"
import { BusinessCard } from "@/components/business-card"
import { EmptyState } from "@/components/empty-state"
import { Pagination } from "@/components/pagination"
import {
  getPublishedBusinesses,
  getCategories,
  getBusinessCountries,
  getBusinessCities,
} from "@/lib/queries"
import {
  BUSINESS_PAGE_SIZE,
  BUSINESS_TYPES,
  BUSINESS_TYPE_LABELS,
} from "@/lib/constants"

export const metadata: Metadata = {
  title: "Explore Businesses — Tradeza",
  description:
    "Discover published businesses seeking global trade and partnerships.",
}

export const instant = false

type SearchParams = {
  q?: string
  category?: string
  country?: string
  city?: string
  type?: string
  verified?: string
  page?: string
}

async function BusinessResults({
  q,
  category,
  country,
  city,
  type,
  verified,
  page,
}: Required<Pick<SearchParams, "page">> & SearchParams) {
  const pageNum = Number(page) || 1
  const [{ businesses, total, pageCount }, categories, countries, cities] =
    await Promise.all([
      getPublishedBusinesses({
        q,
        category,
        country,
        city,
        type,
        verified: verified === "1",
        page: pageNum,
      }),
      getCategories(),
      getBusinessCountries(),
      getBusinessCities(),
    ])

  const selectedCategory = categories.find((c) => c.id === category)
  const currentFilters: Record<string, string | undefined> = {
    q,
    category,
    country,
    city,
    type,
    verified,
  }

  return (
    <>
      {/* Filters */}
      <form
        method="get"
        action="/businesses"
        className="mb-10 bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl p-5 custom-card-shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
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
                placeholder="Name, product, price, city…"
                className="w-full bg-transparent border-0 p-0 text-on-surface font-body-md text-body-md placeholder:text-outline focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="category"
              className="block font-label-lg text-label-lg text-[#202923] mb-1.5"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={category ?? ""}
              className="w-full bg-surface-container-lowest border border-[#E4E9E3] rounded-xl px-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="city"
              className="block font-label-lg text-label-lg text-[#202923] mb-1.5"
            >
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              list="city-list"
              defaultValue={city ?? ""}
              placeholder="Any city"
              className="w-full bg-surface-container-lowest border border-[#E4E9E3] rounded-xl px-3 py-2.5 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"
            />
            <datalist id="city-list">
              {cities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
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
              list="country-list"
              defaultValue={country ?? ""}
              placeholder="Any country"
              className="w-full bg-surface-container-lowest border border-[#E4E9E3] rounded-xl px-3 py-2.5 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"
            />
            <datalist id="country-list">
              {countries.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <label
              htmlFor="type"
              className="block font-label-lg text-label-lg text-[#202923] mb-1.5"
            >
              Business type
            </label>
            <select
              id="type"
              name="type"
              defaultValue={type ?? ""}
              className="w-full bg-surface-container-lowest border border-[#E4E9E3] rounded-xl px-3 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"
            >
              <option value="">All types</option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t} value={t}>
                  {BUSINESS_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2.5 bg-surface-container-lowest border border-[#E4E9E3] rounded-xl px-3 py-2.5 h-[46px] cursor-pointer">
            <input
              type="checkbox"
              name="verified"
              value="1"
              defaultChecked={verified === "1"}
              className="h-4 w-4 rounded border-[#E4E9E3] text-primary-container focus:ring-primary-container/30"
            />
            <span className="font-body-md text-body-md text-[#202923]">
              Verified only
            </span>
          </label>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            className="bg-primary-container hover:bg-[#1C573F] active:scale-[0.99] text-on-primary font-label-lg text-label-lg px-6 py-2.5 rounded-xl transition-all duration-150 shadow-sm"
          >
            Apply filters
          </button>
          <Link
            href="/businesses"
            className="text-on-surface-variant hover:text-primary font-label-lg text-label-lg px-3 py-2 transition-colors"
          >
            Clear all
          </Link>
          <span className="ml-auto font-label-md text-label-md text-[#66716A]">
            {total} result{total === 1 ? "" : "s"}
            {selectedCategory ? ` in ${selectedCategory.name}` : ""}
          </span>
        </div>
      </form>

      {businesses.length === 0 ? (
        <EmptyState
          title="No businesses found"
          description="Try a different search term or clear the filters to browse the full directory."
          action={
            <Link
              href="/businesses"
              className="inline-block bg-primary-container hover:bg-[#1C573F] text-on-primary font-label-lg text-label-lg px-6 py-3 rounded-xl transition-all shadow-sm"
            >
              Clear filters
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
          <Pagination
            page={pageNum}
            pageCount={pageCount}
            basePath="/businesses"
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
      {Array.from({ length: BUSINESS_PAGE_SIZE }).map((_, i) => (
        <div
          key={i}
          className="bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl h-72 animate-pulse"
        />
      ))}
    </div>
  )
}

export default async function BusinessesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#202923] font-bold tracking-tight">
            Explore businesses
          </h1>
          <p className="font-body-md text-body-md text-[#66716A] mt-1">
            Browse published businesses seeking trade, suppliers, and
            partnerships worldwide.
          </p>
        </div>
        <Suspense fallback={<ResultsSkeleton />}>
          <BusinessResults
            q={params.q}
            category={params.category}
            country={params.country}
            city={params.city}
            type={params.type}
            verified={params.verified}
            page={params.page ?? "1"}
          />
        </Suspense>
      </div>
    </section>
  )
}
