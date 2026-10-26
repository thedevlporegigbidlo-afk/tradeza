import Link from "next/link"
import { Icon } from "@/components/icon"
import { locationLabel, initials } from "@/lib/utils"
import type { PublicBusiness } from "@/lib/types/database"

export function BusinessProfileView({
  business,
  preview = false,
}: {
  business: PublicBusiness
  preview?: boolean
}) {
  const location = locationLabel(business.city, business.country)

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
                className="w-20 h-20 rounded-2xl object-cover border border-[#CCD5CB] bg-white"
                src={business.logo_url}
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white text-[#236B50] flex items-center justify-center font-bold font-headline-md text-headline-md border border-[#CCD5CB]">
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
              {business.categories && (
                <span className="inline-block bg-white text-[#236B50] font-label-sm text-label-sm font-semibold px-2.5 py-1 rounded-full border border-[#CCD5CB]">
                  {business.categories.name}
                </span>
              )}
              {location && (
                <div className="flex items-center gap-1.5 text-[#3F4943] mt-3 font-body-sm text-body-sm">
                  <Icon name="location_on" className="text-[18px]" />
                  <span>{location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          {business.short_description && (
            <p className="font-body-lg text-body-lg text-[#3F4943] leading-relaxed mb-6">
              {business.short_description}
            </p>
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

          <div className="border-t border-[#E4E9E3] pt-6">
            <h2 className="font-headline-sm text-headline-sm text-[#202923] font-bold mb-4">
              Connect
            </h2>
            <div className="flex flex-col gap-3">
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
              {business.public_phone && (
                <a
                  href={`tel:${business.public_phone}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-[#1C573F] font-body-md text-body-md font-medium"
                >
                  <Icon name="call" className="text-[18px]" />
                  <span className="underline underline-offset-2">
                    {business.public_phone}
                  </span>
                </a>
              )}
              {!business.website_url &&
                !business.public_email &&
                !business.public_phone && (
                  <p className="font-body-sm text-body-sm text-[#66716A]">
                    This business has not published contact details yet.
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
