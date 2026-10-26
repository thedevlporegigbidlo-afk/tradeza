import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Icon } from "@/components/icon"
import { getPublishedOpportunityById } from "@/lib/queries"
import { opportunityTypeLabel } from "@/lib/constants"
import { locationLabel, relativeTime } from "@/lib/utils"

export const instant = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const opportunity = await getPublishedOpportunityById(id)
  if (!opportunity) return { title: "Opportunity not found — Tradeza" }

  return {
    title: `${opportunity.title} — Tradeza`,
    description:
      opportunity.description?.slice(0, 150) ??
      `Opportunity on Tradeza: ${opportunity.title}`,
  }
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const opportunity = await getPublishedOpportunityById(id)
  if (!opportunity) notFound()

  const location = opportunity.is_international
    ? "Open to international partners"
    : locationLabel(opportunity.city, opportunity.country)

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-label-lg text-label-lg mb-8 transition-colors"
        >
          <Icon name="arrow_back" className="text-sm" />
          <span>All opportunities</span>
        </Link>

        <div className="bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl overflow-hidden custom-card-shadow">
          <div className="bg-[#EDF3ED] px-8 py-8 border-b border-[#CCD5CB]">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-block bg-white text-[#236B50] font-label-sm text-label-sm font-semibold px-3 py-1 rounded-full border border-[#CCD5CB]">
                {opportunityTypeLabel(opportunity.type)}
              </span>
              <span className="font-label-sm text-label-sm text-[#66716A]">
                Posted {relativeTime(opportunity.created_at)}
              </span>
            </div>
            <h1 className="font-headline-lg-mobile md:text-headline-md text-headline-md text-[#202923] font-bold tracking-tight leading-snug">
              {opportunity.title}
            </h1>
            <div className="flex items-center gap-1.5 text-[#3F4943] mt-3 font-body-sm text-body-sm">
              <Icon
                name={opportunity.is_international ? "public" : "location_on"}
                className="text-[18px]"
              />
              <span>{location}</span>
            </div>
          </div>

          <div className="p-8">
            {opportunity.description && (
              <div className="mb-8">
                <h2 className="font-headline-sm text-headline-sm text-[#202923] font-bold mb-3">
                  Details
                </h2>
                <p className="font-body-md text-body-md text-[#66716A] leading-relaxed whitespace-pre-line">
                  {opportunity.description}
                </p>
              </div>
            )}

            {opportunity.businesses && (
              <div className="border-t border-[#E4E9E3] pt-6 mb-6">
                <h2 className="font-headline-sm text-headline-sm text-[#202923] font-bold mb-3">
                  Posted by
                </h2>
                <Link
                  href={`/businesses/${opportunity.businesses.slug}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-[#1C573F] font-body-md text-body-md font-medium"
                >
                  <Icon name="domain" className="text-[18px]" />
                  <span className="underline underline-offset-2">
                    {opportunity.businesses.name}
                  </span>
                </Link>
              </div>
            )}

            <div className="border-t border-[#E4E9E3] pt-6">
              <h2 className="font-headline-sm text-headline-sm text-[#202923] font-bold mb-4">
                Contact
              </h2>
              <div className="flex flex-col gap-3">
                {opportunity.public_email && (
                  <a
                    href={`mailto:${opportunity.public_email}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-[#1C573F] font-body-md text-body-md font-medium"
                  >
                    <Icon name="mail" className="text-[18px]" />
                    <span className="underline underline-offset-2">
                      {opportunity.public_email}
                    </span>
                  </a>
                )}
                {opportunity.public_phone && (
                  <a
                    href={`tel:${opportunity.public_phone}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-[#1C573F] font-body-md text-body-md font-medium"
                  >
                    <Icon name="call" className="text-[18px]" />
                    <span className="underline underline-offset-2">
                      {opportunity.public_phone}
                    </span>
                  </a>
                )}
                {!opportunity.public_email && !opportunity.public_phone && (
                  <p className="font-body-sm text-body-sm text-[#66716A]">
                    Contact the poster through their business profile.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
