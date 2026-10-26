import Link from "next/link"
import { Icon } from "@/components/icon"
import { BusinessCard } from "@/components/business-card"
import { OpportunityCard } from "@/components/opportunity-card"
import { EmptyState } from "@/components/empty-state"
import {
  getCategories,
  getFeaturedBusinesses,
  getRecentOpportunities,
} from "@/lib/queries"

export const instant = false

const SUGGESTED_SEARCHES = [
  "Manufacturers",
  "Wholesale",
  "IT Services",
  "Distributors",
]

export default async function Home() {
  const [categories, featuredBusinesses, recentOpportunities] =
    await Promise.all([
      getCategories(),
      getFeaturedBusinesses(),
      getRecentOpportunities(),
    ])

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E4E9E3]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDF3ED] border border-[#CCD5CB] text-primary mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                Global Business Discovery
              </span>
            </div>
            <h1 className="font-headline-lg-mobile md:text-display-lg text-headline-lg-mobile md:text-display-lg text-[#202923] mb-5 tracking-tight font-bold">
              Your next business connection starts here.
            </h1>
            <p className="font-body-lg text-body-lg text-[#66716A] mb-8 max-w-2xl text-center leading-relaxed">
              Discover businesses, find the right suppliers, and explore
              opportunities to grow together.
            </p>
            <div className="w-full max-w-2xl bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl p-2 custom-card-shadow mb-6 transition-all focus-within:border-primary-container focus-within:ring-4 focus-within:ring-primary-container/10">
              <form action="/businesses" className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-3 pl-3 w-full py-1">
                  <Icon name="search" className="text-outline" />
                  <input
                    name="q"
                    type="search"
                    placeholder="Search businesses, products, or services…"
                    className="w-full bg-transparent border-0 p-0 text-on-surface font-body-md text-body-md placeholder:text-outline focus:ring-0 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-primary-container hover:bg-[#1C573F] active:scale-[0.99] text-on-primary font-label-lg text-label-lg px-7 py-3 rounded-xl transition-all duration-150 flex items-center justify-center shrink-0"
                >
                  Search
                </button>
              </form>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-center">
              <span className="font-label-md text-label-md text-[#66716A] mr-1">
                Suggested:
              </span>
              {SUGGESTED_SEARCHES.map((term) => (
                <Link
                  key={term}
                  href={`/businesses?q=${encodeURIComponent(term)}`}
                  className="bg-surface-container-lowest hover:bg-[#EDF3ED] hover:text-primary text-[#3F4943] border border-[#E4E9E3] rounded-full px-3.5 py-1 font-label-md text-label-md transition-all active:scale-[0.98]"
                >
                  {term}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/businesses"
                className="bg-primary-container hover:bg-[#1C573F] text-on-primary font-label-lg text-label-lg px-6 py-3 rounded-xl transition-all active:scale-[0.99] shadow-sm"
              >
                Explore Businesses
              </Link>
              <Link
                href="/list-business"
                className="bg-surface-container-lowest hover:bg-[#FAFAF7] text-[#202923] border border-[#E4E9E3] hover:border-[#CCD5CB] font-label-lg text-label-lg px-6 py-3 rounded-xl transition-all active:scale-[0.99]"
              >
                List Your Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 md:py-20 border-b border-[#E4E9E3]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#202923] font-bold tracking-tight">
                Explore by category
              </h2>
              <p className="font-body-md text-body-md text-[#66716A] mt-1">
                Find the businesses you need.
              </p>
            </div>
            <span className="hidden md:inline-flex items-center text-outline font-label-md text-label-md gap-1">
              <Icon name="category" className="text-[18px]" />
              5 Core Classifications
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/businesses?category=${category.id}`}
                className="group bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl p-6 custom-card-shadow hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#EDF3ED] text-primary flex items-center justify-center mb-5 group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                    <Icon name={category.icon ?? "category"} className="text-[26px]" />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-[#202923] mb-2 font-semibold">
                    {category.name}
                  </h3>
                  <p className="font-body-sm text-body-sm text-[#66716A] leading-relaxed">
                    {category.description}
                  </p>
                </div>
                <div className="pt-6 mt-4 border-t border-[#E4E9E3]/60 flex items-center justify-between text-primary font-label-md text-label-md font-semibold">
                  <span>Browse directory</span>
                  <Icon
                    name="arrow_forward"
                    className="text-sm group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BUSINESSES */}
      <section className="py-16 md:py-20 border-b border-[#E4E9E3]" id="businesses">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#202923] font-bold tracking-tight">
                Businesses to discover
              </h2>
              <p className="font-body-md text-body-md text-[#66716A] mt-1">
                Authentic, operational enterprises seeking global trade and
                partnerships.
              </p>
            </div>
            <Link
              href="/businesses"
              className="inline-flex items-center gap-1.5 text-primary hover:text-[#1C573F] font-label-lg text-label-lg font-semibold group transition-colors shrink-0"
            >
              <span className="hidden sm:inline">View all businesses</span>
              <span className="sm:hidden">View all</span>
              <Icon
                name="arrow_forward"
                className="text-lg group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
          {featuredBusinesses.length === 0 ? (
            <EmptyState
              title="No businesses listed yet"
              description="Be the first — create a profile and let the right partners find you."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBusinesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* OPPORTUNITIES */}
      <section className="py-16 md:py-20 border-b border-[#E4E9E3]" id="opportunities">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
              <span className="font-label-sm text-label-sm font-bold text-primary uppercase tracking-wide">
                Live Deal Flow
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#202923] font-bold tracking-tight">
              Business opportunities
            </h2>
            <p className="font-body-md text-body-md text-[#66716A] mt-1">
              Explore active requests from businesses worldwide.
            </p>
          </div>
          {recentOpportunities.length === 0 ? (
            <EmptyState
              title="No opportunities posted yet"
              description="Post a supplier request, buyer need, or partnership offer to get started."
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-1.5 text-primary hover:text-[#1C573F] font-label-lg text-label-lg font-semibold group transition-colors"
            >
              <span>View all opportunities</span>
              <Icon
                name="arrow_forward"
                className="text-lg group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#EDF3ED] border border-[#CCD5CB] rounded-3xl p-8 md:p-14 text-center max-w-4xl mx-auto custom-card-shadow relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-surface-container-lowest text-primary rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-sm">
                <Icon name="domain_add" className="text-[30px]" />
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#202923] font-bold tracking-tight mb-4">
                Let people discover your business.
              </h2>
              <p className="font-body-lg text-body-lg text-[#66716A] max-w-xl mx-auto mb-8 leading-relaxed">
                Create a simple business profile and help the right people find
                you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/list-business"
                  className="w-full sm:w-auto bg-primary-container hover:bg-[#1C573F] active:scale-[0.99] text-on-primary font-label-lg text-label-lg px-8 py-3.5 rounded-xl transition-all duration-150 shadow-sm flex items-center justify-center gap-2"
                >
                  <span>List Your Business</span>
                  <Icon name="arrow_forward" className="text-sm" />
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-outline font-label-sm text-label-sm">
                <span className="flex items-center gap-1.5">
                  <Icon name="check_circle" className="text-[16px] text-primary" />{" "}
                  No upfront fees
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon name="check_circle" className="text-[16px] text-primary" />{" "}
                  Direct peer-to-peer outreach
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
