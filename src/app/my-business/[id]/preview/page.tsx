import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { connection } from "next/server"
import { Icon } from "@/components/icon"
import { BusinessProfileView } from "@/components/business-profile"
import { createClient } from "@/lib/supabase/server"
import { getUserBusiness } from "@/lib/queries"

export const metadata: Metadata = {
  title: "Preview listing — Tradeza",
  robots: { index: false, follow: false },
}

export const instant = false

export default async function PreviewBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await connection()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const business = await getUserBusiness(user.id, id)
  if (!business) notFound()

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/my-business"
          className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-label-lg text-label-lg mb-8 transition-colors"
        >
          <Icon name="arrow_back" className="text-sm" />
          <span>My business</span>
        </Link>
        <BusinessProfileView business={business} preview />
      </div>
    </section>
  )
}
