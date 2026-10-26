import Link from "next/link"
import { Icon } from "@/components/icon"
import { businessTypeLabel } from "@/lib/constants"
import { initials, locationLabel, splitList, whatsappLink } from "@/lib/utils"
import type { PublicBusiness } from "@/lib/types/database"

export function BusinessCard({
  business,
  footer,
}: {
  business: PublicBusiness
  footer?: React.ReactNode
}) {
  const location = locationLabel(business.city, business.country)
  const businessType = businessTypeLabel(business.business_type)
  const products = splitList(business.products)
  const whatsappHref = business.whatsapp
    ? whatsappLink(
        business.whatsapp,
        `Hi ${business.name}, I found your business on Tradeza and would like to know more.`
      )
    : null

  return (
    <div className="bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl overflow-hidden custom-card-shadow hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group h-full">
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-5">
          {business.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={`${business.name} logo`}
              className="w-12 h-12 rounded-xl object-cover border border-[#E4E9E3]"
              src={business.logo_url}
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-[#EDF3ED] text-[#236B50] flex items-center justify-center font-bold font-headline-sm text-headline-sm border border-[#E4E9E3]">
              {initials(business.name)}
            </div>
          )}
          {business.categories && (
            <span className="inline-block bg-[#EDF3ED] text-[#236B50] font-label-sm text-label-sm font-semibold px-2.5 py-1 rounded-full text-right">
              {business.categories.name}
            </span>
          )}
        </div>
        <h3 className="font-headline-sm text-headline-sm text-[#202923] font-bold mb-2 group-hover:text-primary transition-colors">
          <Link href={`/businesses/${business.slug}`} className="after:absolute after:inset-0">
            {business.name}
          </Link>
        </h3>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {location && (
            <span className="flex items-center gap-1 text-outline font-body-sm text-body-sm">
              <Icon name="location_on" className="text-[16px]" />
              <span>{location}</span>
            </span>
          )}
          {businessType && (
            <span className="inline-block bg-[#FAFAF7] text-[#3F4943] font-label-sm text-label-sm px-2 py-0.5 rounded-full border border-[#E4E9E3]">
              {businessType}
            </span>
          )}
        </div>
        {business.short_description && (
          <p className="font-body-sm text-body-sm text-[#66716A] leading-relaxed">
            {business.short_description}
          </p>
        )}
        {products.length > 0 && (
          <p className="mt-3 font-label-sm text-label-sm text-outline truncate">
            <span className="text-[#3F4943] font-medium">Products:</span>{" "}
            {products.slice(0, 3).join(" · ")}
            {products.length > 3 ? " …" : ""}
          </p>
        )}
        {(business.price_range || business.moq) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {business.price_range && (
              <span className="inline-flex items-center gap-1 bg-[#EDF3ED] text-[#236B50] font-label-sm text-label-sm font-semibold px-2.5 py-1 rounded-full">
                <Icon name="sell" className="text-[14px]" />
                {business.price_range}
              </span>
            )}
            {business.moq && (
              <span className="inline-flex items-center gap-1 bg-[#FAFAF7] text-[#3F4943] font-label-sm text-label-sm px-2.5 py-1 rounded-full border border-[#E4E9E3]">
                <Icon name="inventory" className="text-[14px]" />
                MOQ {business.moq}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="px-6 py-4 bg-[#FAFAF7] border-t border-[#E4E9E3] flex items-center justify-between gap-3 relative z-10">
        {footer ?? (
          <>
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-20 inline-flex items-center gap-1.5 text-[#236B50] hover:text-[#1C573F] font-label-sm text-label-sm font-semibold"
              >
                <Icon name="chat" className="text-[16px]" />
                WhatsApp
              </a>
            ) : (
              <span className="font-label-sm text-label-sm text-outline">
                {business.verified ? "Verified Profile" : "Business Profile"}
              </span>
            )}
          </>
        )}
        <span className="text-primary hover:text-[#1C573F] font-label-md text-label-md font-semibold inline-flex items-center gap-1 pointer-events-none shrink-0">
          <span>View Business</span>
          <Icon name="arrow_forward" className="text-sm" />
        </span>
      </div>
    </div>
  )
}
