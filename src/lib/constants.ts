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

export const LOGO_URL =
  "https://lh3.googleusercontent.com/aida/AEtjO1Vq0PwQBsRXKy0TZhpt7y-_qh2VMVg7IVfN3ghS5FcGGTUjP0WECc6TtbrvJh3ifx9sKZzKur5bOJ8j176VO21scaH96yvNa8YF3r4Zfdtg23wWB1_jId5GoqPczlttsBrU57OmiHylehVGhzJDF2bbnZMdHqTa-j1b8n1HzbKvRB3F22JcjYquxPVd8QK4i2aEZkmyFrDOGWOsV5iYcCyLKPsmLvAPMKb79G3GEHUdoiTt2zfhaj5g"
