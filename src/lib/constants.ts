export const OPPORTUNITY_TYPES = [
  "supplier_needed",
  "buyer_needed",
  "distributor_wanted",
  "partnership",
  "service_needed",
  "service_offered",
  "job",
  "investment",
  "property",
  "event",
] as const

export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number]

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  supplier_needed: "Supplier Needed",
  buyer_needed: "Buyer Needed",
  distributor_wanted: "Distributor Wanted",
  partnership: "Partnership",
  service_needed: "Service Needed",
  service_offered: "Service Offered",
  job: "Job / Hiring",
  investment: "Investment",
  property: "Property",
  event: "Event",
}

export function opportunityTypeLabel(type: string): string {
  return (
    OPPORTUNITY_TYPE_LABELS[type as OpportunityType] ?? "Opportunity"
  )
}

export const BUSINESS_TYPES = [
  "manufacturer",
  "wholesaler",
  "distributor",
  "retailer",
  "trader",
  "exporter",
  "importer",
  "service_provider",
  "consultant",
  "other",
] as const

export type BusinessType = (typeof BUSINESS_TYPES)[number]

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  manufacturer: "Manufacturer",
  wholesaler: "Wholesaler",
  distributor: "Distributor",
  retailer: "Retailer",
  trader: "Trader",
  exporter: "Exporter",
  importer: "Importer",
  service_provider: "Service Provider",
  consultant: "Consultant",
  other: "Other",
}

export function businessTypeLabel(type: string | null): string | null {
  if (!type) return null
  return BUSINESS_TYPE_LABELS[type as BusinessType] ?? type
}

export const BUSINESS_PAGE_SIZE = 12
export const OPPORTUNITY_PAGE_SIZE = 12
export const HOME_FEATURED_BUSINESSES = 4
export const HOME_RECENT_OPPORTUNITIES = 3

export const LOGO_URL = "/tradeza-mark.svg"

// Uploads are done straight from the browser to Supabase Storage, so the
// limits here mirror the bucket configuration in the migration.
export const BUSINESS_MEDIA_BUCKET = "business-media"
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
// Mirrors the `businesses_gallery_urls_check` constraint (max 8).
export const MAX_GALLERY_IMAGES = 8
export const MAX_LOGOS = 1
export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const
