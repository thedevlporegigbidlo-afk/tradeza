import "server-only"
import { createClient } from "@/lib/supabase/server"
import { createPublicClient } from "@/lib/supabase/public"
import { escapeLike } from "@/lib/utils"
import {
  BUSINESS_PAGE_SIZE,
  HOME_FEATURED_BUSINESSES,
  HOME_RECENT_OPPORTUNITIES,
  OPPORTUNITY_PAGE_SIZE,
} from "@/lib/constants"
import type {
  BusinessWithCategory,
  Category,
  OpportunityWithBusiness,
  PublicBusiness,
  PublicOpportunity,
} from "@/lib/types/database"

// Public projections deliberately exclude `owner_id` and any future private
// columns. Keep these lists in sync with the types in `lib/types/database.ts`.
const PUBLIC_BUSINESS_SELECT =
  "id, name, slug, business_type, short_description, description, category_id, city, country, service_areas, established_year, products, price_range, moq, logo_url, gallery_urls, website_url, public_email, public_phone, whatsapp, contact_name, designation, verified, status, created_at, updated_at, categories(id, name, slug, icon)"

const PUBLIC_OPPORTUNITY_SELECT =
  "id, business_id, title, type, description, is_international, country, city, quantity, budget, deadline, public_email, public_phone, whatsapp, contact_name, status, created_at, updated_at, businesses(id, name, slug)"

export async function getCategories(): Promise<Category[]> {
  const supabase = createPublicClient()
  const { data } = await supabase.from("categories").select("*").order("name")
  return data ?? []
}

export async function getFeaturedBusinesses(): Promise<PublicBusiness[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from("businesses")
    .select(PUBLIC_BUSINESS_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(HOME_FEATURED_BUSINESSES)
  return (data ?? []) as unknown as PublicBusiness[]
}

export async function getRecentOpportunities(): Promise<PublicOpportunity[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from("opportunities")
    .select(PUBLIC_OPPORTUNITY_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(HOME_RECENT_OPPORTUNITIES)
  return (data ?? []) as unknown as PublicOpportunity[]
}

export type BusinessFilters = {
  q?: string
  category?: string
  country?: string
  city?: string
  type?: string
  verified?: boolean
  page?: number
}

export async function getPublishedBusinesses(filters: BusinessFilters) {
  const supabase = createPublicClient()
  const page = Math.max(1, filters.page ?? 1)
  const from = (page - 1) * BUSINESS_PAGE_SIZE
  const to = from + BUSINESS_PAGE_SIZE - 1

  let query = supabase
    .from("businesses")
    .select(PUBLIC_BUSINESS_SELECT, { count: "exact" })
    .eq("status", "published")

  if (filters.q) {
    const term = escapeLike(filters.q)
    if (term) {
      query = query.or(
        `name.ilike.%${term}%,short_description.ilike.%${term}%,description.ilike.%${term}%,products.ilike.%${term}%,price_range.ilike.%${term}%,moq.ilike.%${term}%,service_areas.ilike.%${term}%,city.ilike.%${term}%,country.ilike.%${term}%`
      )
    }
  }
  if (filters.category) {
    query = query.eq("category_id", filters.category)
  }
  if (filters.country) {
    const country = escapeLike(filters.country)
    if (country) query = query.ilike("country", `%${country}%`)
  }
  if (filters.city) {
    const city = escapeLike(filters.city)
    if (city) query = query.ilike("city", `%${city}%`)
  }
  if (filters.type) {
    query = query.eq("business_type", filters.type)
  }
  if (filters.verified) {
    query = query.eq("verified", true)
  }

  const { data, count, error } = await query.order("name").range(from, to)

  if (error) return { businesses: [], total: 0, page, pageCount: 0 }

  return {
    businesses: (data ?? []) as unknown as PublicBusiness[],
    total: count ?? 0,
    page,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / BUSINESS_PAGE_SIZE)),
  }
}

export async function getPublishedBusinessBySlug(
  slug: string
): Promise<PublicBusiness | null> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from("businesses")
    .select(PUBLIC_BUSINESS_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()
  return (data as unknown as PublicBusiness) ?? null
}

export type OpportunityFilters = {
  q?: string
  type?: string
  country?: string
  city?: string
  page?: number
}

export async function getPublishedOpportunities(filters: OpportunityFilters) {
  const supabase = createPublicClient()
  const page = Math.max(1, filters.page ?? 1)
  const from = (page - 1) * OPPORTUNITY_PAGE_SIZE
  const to = from + OPPORTUNITY_PAGE_SIZE - 1

  let query = supabase
    .from("opportunities")
    .select(PUBLIC_OPPORTUNITY_SELECT, { count: "exact" })
    .eq("status", "published")

  if (filters.q) {
    const term = escapeLike(filters.q)
    if (term) {
      query = query.or(
        `title.ilike.%${term}%,description.ilike.%${term}%,quantity.ilike.%${term}%,budget.ilike.%${term}%,country.ilike.%${term}%,city.ilike.%${term}%`
      )
    }
  }
  if (filters.type) {
    query = query.eq("type", filters.type)
  }
  if (filters.country) {
    const country = escapeLike(filters.country)
    if (country) query = query.ilike("country", `%${country}%`)
  }
  if (filters.city) {
    const city = escapeLike(filters.city)
    if (city) query = query.ilike("city", `%${city}%`)
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) return { opportunities: [], total: 0, page, pageCount: 0 }

  return {
    opportunities: (data ?? []) as unknown as PublicOpportunity[],
    total: count ?? 0,
    page,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / OPPORTUNITY_PAGE_SIZE)),
  }
}

export async function getPublishedOpportunityById(
  id: string
): Promise<PublicOpportunity | null> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from("opportunities")
    .select(PUBLIC_OPPORTUNITY_SELECT)
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle()
  return (data as unknown as PublicOpportunity) ?? null
}

export async function getUserBusinesses(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("businesses")
    .select("*, categories(id, name, slug, icon)")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false })
  return (data ?? []) as BusinessWithCategory[]
}

export async function getUserBusiness(userId: string, id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("businesses")
    .select("*, categories(id, name, slug, icon)")
    .eq("id", id)
    .eq("owner_id", userId)
    .maybeSingle()
  return data as BusinessWithCategory | null
}

export async function getUserOpportunities(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("opportunities")
    .select("*, businesses(id, name, slug)")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false })
  return (data ?? []) as OpportunityWithBusiness[]
}

export async function getUserOpportunity(userId: string, id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("opportunities")
    .select("*, businesses(id, name, slug)")
    .eq("id", id)
    .eq("owner_id", userId)
    .maybeSingle()
  return data as OpportunityWithBusiness | null
}

export async function getBusinessCountries(): Promise<string[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from("businesses")
    .select("country")
    .eq("status", "published")
    .not("country", "is", null)
  const set = new Set(
    (data ?? [])
      .map((r) => r.country?.trim())
      .filter((c): c is string => Boolean(c))
  )
  return [...set].sort((a, b) => a.localeCompare(b))
}

export async function getOpportunityCountries(): Promise<string[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from("opportunities")
    .select("country")
    .eq("status", "published")
    .not("country", "is", null)
  const set = new Set(
    (data ?? [])
      .map((r) => r.country?.trim())
      .filter((c): c is string => Boolean(c))
  )
  return [...set].sort((a, b) => a.localeCompare(b))
}

export async function getBusinessCities(): Promise<string[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from("businesses")
    .select("city")
    .eq("status", "published")
    .not("city", "is", null)
  const set = new Set(
    (data ?? [])
      .map((r) => r.city?.trim())
      .filter((c): c is string => Boolean(c))
  )
  return [...set].sort((a, b) => a.localeCompare(b))
}

export async function getOpportunityCities(): Promise<string[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from("opportunities")
    .select("city")
    .eq("status", "published")
    .not("city", "is", null)
  const set = new Set(
    (data ?? [])
      .map((r) => r.city?.trim())
      .filter((c): c is string => Boolean(c))
  )
  return [...set].sort((a, b) => a.localeCompare(b))
}
