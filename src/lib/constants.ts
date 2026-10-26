export const OPPORTUNITY_TYPES = [
  "supplier_needed",
  "buyer_needed",
  "distributor_wanted",
  "partnership",
] as const

export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number]

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  supplier_needed: "Supplier Needed",
  buyer_needed: "Buyer Needed",
  distributor_wanted: "Distributor Wanted",
  partnership: "Partnership",
}

export function opportunityTypeLabel(type: string): string {
  return (
    OPPORTUNITY_TYPE_LABELS[type as OpportunityType] ?? "Opportunity"
  )
}

export const BUSINESS_PAGE_SIZE = 12
export const OPPORTUNITY_PAGE_SIZE = 12
export const HOME_FEATURED_BUSINESSES = 4
export const HOME_RECENT_OPPORTUNITIES = 3

export const LOGO_URL = "/tradeza-mark.svg"
