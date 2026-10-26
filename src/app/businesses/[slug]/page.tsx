import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Icon } from "@/components/icon"
import { BusinessProfileView } from "@/components/business-profile"
import { getPublishedBusinessBySlug } from "@/lib/queries"

export const instant = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const business = await getPublishedBusinessBySlug(slug)
  if (!business) return { title: "Business not found — Tradeza" }

  return {
    title: `${business.name} — Tradeza`,
    description:
      business.short_description ??
      `Business profile for ${business.name} on Tradeza.`,
  }
}

export default async function BusinessProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const business = await getPublishedBusinessBySlug(slug)
  if (!business) notFound()

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/businesses"
          className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-label-lg text-label-lg mb-8 transition-colors"
        >
          <Icon name="arrow_back" className="text-sm" />
          <span>All businesses</span>
        </Link>
        <BusinessProfileView business={business} />
      </div>
    </section>
  )
}
