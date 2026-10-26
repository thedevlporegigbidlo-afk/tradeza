import Link from "next/link"
import { Icon } from "@/components/icon"
import { businessTypeLabel } from "@/lib/constants"
import {
  formatDateOnly,
  initials,
  locationLabel,
  splitList,
  whatsappLink,
} from "@/lib/utils"
import type { PublicBusiness } from "@/lib/types/database"

function DetailCard({
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

export function BusinessProfileView({
  business,
  preview = false,
}: {
  business: PublicBusiness
  preview?: boolean
}) {
  const location = locationLabel(business.city, business.country)
  const businessType = businessTypeLabel(business.business_type)
  const products = splitList(business.products)
  const gallery = business.gallery_urls ?? []
  const whatsappHref = business.whatsapp
    ? whatsappLink(
        business.whatsapp,
        `Hi ${business.name}, I found your business on Tradeza and would like to know more.`
      )
    : null
  const hasContact = Boolean(
    business.whatsapp ||
      business.public_phone ||
      business.public_email ||
      business.website_url
  )

  return (
    <>
      {preview && (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#EDF3ED] border border-[#CCD5CB] rounded-xl px-4 py-3">
          <p className="font-body-sm text-body-sm text-[#236B50]">
            <span className="font-semibold">Draft preview.</span> Only you can
            see this page until the listing is published.
          </p>
          <Link
            href="/my-business"
            className="shrink-0 font-label-md text-label-md font-semibold text-primary hover:underline"
          >
            Manage listing
          </Link>
        </div>
      )}

      <div className="bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl overflow-hidden custom-card-shadow">
        <div className="bg-[#EDF3ED] px-8 py-8 border-b border-[#CCD5CB]">
          <div className="flex items-start gap-5">
            {business.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={`${business.name} logo`}
                className="w-20 h-20 rounded-2xl object-cover border border-[#CCD5CB] bg-white shrink-0"
                src={business.logo_url}
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white text-[#236B50] flex items-center justify-center font-bold font-headline-md text-headline-md border border-[#CCD5CB] shrink-0">
                {initials(business.name)}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="font-headline-lg-mobile md:text-headline-md text-headline-md text-[#202923] font-bold tracking-tight">
                  {business.name}
                </h1>
                {business.verified && (
                  <span className="inline-flex items-center gap-1 bg-white text-[#236B50] font-label-sm text-label-sm font-semibold px-2.5 py-1 rounded-full border border-[#CCD5CB]">
                    <Icon name="verified" className="text-[14px]" />
                    Verified
                  </span>
                )}
                {preview && (
                  <span className="inline-flex items-center gap-1 bg-white text-[#66716A] font-label-sm text-label-sm font-semibold px-2.5 py-1 rounded-full border border-[#CCD5CB]">
                    Draft
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {business.categories && (
                  <span className="inline-block bg-white text-[#236B50] font-label-sm text-label-sm font-semibold px-2.5 py-1 rounded-full border border-[#CCD5CB]">
                    {business.categories.name}
                  </span>
                )}
                {businessType && (
                  <span className="inline-block bg-white text-[#3F4943] font-label-sm text-label-sm font-semibold px-2.5 py-1 rounded-full border border-[#CCD5CB]">
                    {businessType}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#3F4943] mt-3 font-body-sm text-body-sm">
                {location && (
                  <span className="flex items-center gap-1.5">
                    <Icon name="location_on" className="text-[18px]" />
                    <span>{location}</span>
                  </span>
                )}
                {business.established_year && (
                  <span className="flex items-center gap-1.5">
                    <Icon name="calendar_month" className="text-[18px]" />
                    <span>Since {business.established_year}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {(whatsappHref || business.city || business.country) && (
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-primary-container hover:bg-[#1C573F] text-on-primary font-label-lg text-label-lg font-semibold px-6 py-3 rounded-xl transition-all shadow-sm"
                >
                  <Icon name="chat" className="text-[20px]" />
                  Chat on WhatsApp
                </a>
              )}
              {(business.city || business.country) && (
                <Link
                  href={`/businesses?city=${encodeURIComponent(business.city ?? business.country ?? "")}`}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAFAF7] text-[#202923] border border-[#CCD5CB] font-label-lg text-label-lg px-6 py-3 rounded-xl transition-all"
                >
                  <Icon name="location_city" className="text-[20px]" />
                  More in {business.city ?? business.country}
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="p-8">
          {business.short_description && (
            <p className="font-body-lg text-body-lg text-[#3F4943] leading-relaxed mb-6">
              {business.short_description}
            </p>
          )}

          {(business.price_range || business.moq || business.service_areas) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {business.price_range && (
                <DetailCard
                  icon="sell"
                  label="Price range"
                  value={business.price_range}
                />
              )}
              {business.moq && (
                <DetailCard icon="inventory" label="MOQ" value={business.moq} />
              )}
              {business.service_areas && (
                <DetailCard
                  icon="public"
                  label="Service areas"
                  value={business.service_areas}
                />
              )}
            </div>
          )}

          {products.length > 0 && (
            <div className="mb-8">
              <h2 className="font-headline-sm text-headline-sm text-[#202923] font-bold mb-3">
                Products &amp; services
              </h2>
              <div className="flex flex-wrap gap-2">
                {products.map((product) => (
                  <span
                    key={product}
                    className="inline-block bg-[#EDF3ED] text-[#236B50] font-label-md text-label-md font-medium px-3 py-1.5 rounded-full border border-[#CCD5CB]"
                  >
                    {product}
                  </span>
                ))}
              </div>
            </div>
          )}

          {business.description && (
            <div className="mb-8">
              <h2 className="font-headline-sm text-headline-sm text-[#202923] font-bold mb-3">
                About
              </h2>
              <p className="font-body-md text-body-md text-[#66716A] leading-relaxed whitespace-pre-line">
                {business.description}
              </p>
            </div>
          )}

          {gallery.length > 0 && (
            <div className="mb-8">
              <h2 className="font-headline-sm text-headline-sm text-[#202923] font-bold mb-3">
                Photos
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gallery.map((url) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-square rounded-xl overflow-hidden border border-[#E4E9E3] bg-[#FAFAF7] hover:opacity-95 transition-opacity"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${business.name} photo`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-[#E4E9E3] pt-6">
            <h2 className="font-headline-sm text-headline-sm text-[#202923] font-bold mb-4">
              Contact
            </h2>

            {(business.contact_name || business.designation) && (
              <div className="mb-4">
                <p className="font-body-md text-body-md text-[#202923] font-semibold">
                  {business.contact_name}
                </p>
                {business.designation && (
                  <p className="font-body-sm text-body-sm text-[#66716A]">
                    {business.designation}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {business.whatsapp && (
                <a
                  href={whatsappLink(
                    business.whatsapp,
                    `Hi ${business.name}, I found your business on Tradeza and would like to know more.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-[#1C573F] font-body-md text-body-md font-medium"
                >
                  <Icon name="chat" className="text-[18px]" />
                  <span className="underline underline-offset-2">
                    WhatsApp {business.whatsapp}
                  </span>
                </a>
              )}
              {business.public_phone && (
                <a
                  href={`tel:${business.public_phone.replace(/[^\d+]/g, "")}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-[#1C573F] font-body-md text-body-md font-medium"
                >
                  <Icon name="call" className="text-[18px]" />
                  <span className="underline underline-offset-2">
                    {business.public_phone}
                  </span>
                </a>
              )}
              {business.public_email && (
                <a
                  href={`mailto:${business.public_email}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-[#1C573F] font-body-md text-body-md font-medium"
                >
                  <Icon name="mail" className="text-[18px]" />
                  <span className="underline underline-offset-2">
                    {business.public_email}
                  </span>
                </a>
              )}
              {business.website_url && (
                <a
                  href={business.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-[#1C573F] font-body-md text-body-md font-medium"
                >
                  <Icon name="language" className="text-[18px]" />
                  <span className="underline underline-offset-2">
                    {business.website_url}
                  </span>
                </a>
              )}
              {!hasContact && (
                <p className="font-body-sm text-body-sm text-[#66716A]">
                  This business has not published contact details yet.
                </p>
              )}
            </div>
          </div>

          <p className="mt-8 pt-4 border-t border-[#E4E9E3] font-body-sm text-body-sm text-outline">
            Listing updated {formatDateOnly(business.updated_at.slice(0, 10))}.
            Always confirm rates and terms directly before paying.
          </p>
        </div>
      </div>
    </>
  )
}
