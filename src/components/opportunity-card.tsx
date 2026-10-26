import Link from "next/link"
import { Icon } from "@/components/icon"
import { opportunityTypeLabel } from "@/lib/constants"
import { locationLabel, formatDateOnly, relativeTime } from "@/lib/utils"
import type { PublicOpportunity } from "@/lib/types/database"

export function OpportunityCard({
  opportunity,
}: {
  opportunity: PublicOpportunity
}) {
  const location = opportunity.is_international
    ? "Open to international partners"
    : locationLabel(opportunity.city, opportunity.country)

  return (
    <div className="bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl p-6 custom-card-shadow flex flex-col justify-between hover:-translate-y-1 transition-all duration-200 h-full relative">
      <div>
        <div className="flex items-center justify-between mb-4 gap-2">
          <span className="inline-block bg-[#EDF3ED] text-[#236B50] font-label-sm text-label-sm font-semibold px-3 py-1 rounded-full border border-[#CCD5CB]">
            {opportunityTypeLabel(opportunity.type)}
          </span>
          <span className="font-label-sm text-label-sm text-outline shrink-0">
            {relativeTime(opportunity.created_at)}
          </span>
        </div>
        <h3 className="font-headline-sm text-headline-sm text-[#202923] font-bold mb-3 leading-snug">
          <Link
            href={`/opportunities/${opportunity.id}`}
            className="after:absolute after:inset-0"
          >
            {opportunity.title}
          </Link>
        </h3>
        <div className="flex items-center gap-1.5 text-outline mb-4 font-body-sm text-body-sm">
          <Icon
            name={opportunity.is_international ? "public" : "location_on"}
            className="text-[18px]"
          />
          <span>{location}</span>
        </div>
        {(opportunity.budget ||
          opportunity.quantity ||
          opportunity.deadline) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {opportunity.budget && (
              <span className="inline-flex items-center gap-1 bg-[#EDF3ED] text-[#236B50] font-label-sm text-label-sm font-semibold px-2.5 py-1 rounded-full">
                <Icon name="sell" className="text-[14px]" />
                {opportunity.budget}
              </span>
            )}
            {opportunity.quantity && (
              <span className="inline-flex items-center gap-1 bg-[#FAFAF7] text-[#3F4943] font-label-sm text-label-sm px-2.5 py-1 rounded-full border border-[#E4E9E3]">
                <Icon name="inventory" className="text-[14px]" />
                {opportunity.quantity}
              </span>
            )}
            {opportunity.deadline && (
              <span className="inline-flex items-center gap-1 bg-[#FAFAF7] text-[#3F4943] font-label-sm text-label-sm px-2.5 py-1 rounded-full border border-[#E4E9E3]">
                <Icon name="event" className="text-[14px]" />
                By {formatDateOnly(opportunity.deadline)}
              </span>
            )}
          </div>
        )}
        {opportunity.description && (
          <p className="font-body-sm text-body-sm text-[#66716A] leading-relaxed mb-6">
            {opportunity.description.length > 160
              ? `${opportunity.description.slice(0, 160)}…`
              : opportunity.description}
          </p>
        )}
      </div>
      <div className="pt-4 border-t border-[#E4E9E3] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 min-w-0">
          <Icon name="verified_user" className="text-outline text-[18px]" />
          <span className="font-label-sm text-label-sm text-[#66716A] truncate">
            {opportunity.businesses?.name ?? "Direct Request"}
          </span>
        </div>
        <span className="text-primary hover:text-[#1C573F] font-label-md text-label-md font-semibold inline-flex items-center gap-1 group pointer-events-none shrink-0 ml-3">
          <span>View Details</span>
          <Icon name="arrow_forward" className="text-sm" />
        </span>
      </div>
    </div>
  )
}
