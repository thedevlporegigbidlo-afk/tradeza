import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Icon } from "@/components/icon"
import { getPublishedOpportunityById } from "@/lib/queries"
import { opportunityTypeLabel } from "@/lib/constants"
import {
  formatDateOnly,
  locationLabel,
  relativeTime,
  whatsappLink,
} from "@/lib/utils"

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

function Fact({
  icon,
  label,
  value,
}: {
  icon: string
  label: string
  value: string
}) {
  return (
    <div className="bg-[#FAFAF7] border border-[#E4E9E3] rounded-xl p-4">
      <div className="flex items-center gap-1.5 text-outline mb-1">
        <Icon name={icon} className="text-[16px]" />
        <span className="font-label-sm text-label-sm uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="font-body-md text-body-md text-[#202923] font-medium">
        {value}
      </p>
    </div>
  )
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
  const whatsappHref = opportunity.whatsapp
    ? whatsappLink(
        opportunity.whatsapp,
        `Hi, I am responding to your Tradeza opportunity: "${opportunity.title}".`
      )
    : null
  const hasContact = Boolean(
    opportunity.whatsapp || opportunity.public_phone || opportunity.public_email
  )
  const deadline = formatDateOnly(opportunity.deadline)

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

            {whatsappHref && (
              <div className="mt-6">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-primary-container hover:bg-[#1C573F] text-on-primary font-label-lg text-label-lg font-semibold px-6 py-3 rounded-xl transition-all shadow-sm"
                >
                  <Icon name="chat" className="text-[20px]" />
                  Chat on WhatsApp
                </a>
              </div>
            )}
          </div>

          <div className="p-8">
            {(opportunity.budget ||
              opportunity.quantity ||
              deadline) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {opportunity.budget && (
                  <Fact
                    icon="sell"
                    label="Budget / rate"
                    value={opportunity.budget}
                  />
                )}
                {opportunity.quantity && (
                  <Fact
                    icon="inventory"
                    label="Quantity"
                    value={opportunity.quantity}
                  />
                )}
                {deadline && (
                  <Fact icon="event" label="Needed by" value={deadline} />
                )}
              </div>
            )}

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

              {opportunity.contact_name && (
                <p className="font-body-md text-body-md text-[#202923] font-semibold mb-3">
                  {opportunity.contact_name}
                </p>
              )}

              <div className="flex flex-col gap-3">
                {opportunity.whatsapp && (
                  <a
                    href={whatsappLink(
                      opportunity.whatsapp,
                      `Hi, I am responding to your Tradeza opportunity: "${opportunity.title}".`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-[#1C573F] font-body-md text-body-md font-medium"
                  >
                    <Icon name="chat" className="text-[18px]" />
                    <span className="underline underline-offset-2">
                      WhatsApp {opportunity.whatsapp}
                    </span>
                  </a>
                )}
                {opportunity.public_phone && (
                  <a
                    href={`tel:${opportunity.public_phone.replace(/[^\d+]/g, "")}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-[#1C573F] font-body-md text-body-md font-medium"
                  >
                    <Icon name="call" className="text-[18px]" />
                    <span className="underline underline-offset-2">
                      {opportunity.public_phone}
                    </span>
                  </a>
                )}
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
                {!hasContact && (
                  <p className="font-body-sm text-body-sm text-[#66716A]">
                    Contact the poster through their business profile.
                  </p>
                )}
              </div>

              <p className="mt-6 font-body-sm text-body-sm text-outline">
                Deal directly with the poster. Always verify the business and
                confirm rates before paying any advance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
