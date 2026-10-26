import type { Metadata } from "next"
import { connection } from "next/server"
import { OpportunityForm } from "@/components/opportunity-form"
import { createClient } from "@/lib/supabase/server"
import { getUserBusinesses } from "@/lib/queries"

export const metadata: Metadata = {
  title: "Post an Opportunity — Tradeza",
  description:
    "Share a supplier request, buyer need, or partnership offer with the network.",
}

export const instant = false

export default async function PostOpportunityPage() {
  await connection()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const businesses = user ? await getUserBusinesses(user.id) : []

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#202923] font-bold tracking-tight">
            Post an opportunity
          </h1>
          <p className="font-body-md text-body-md text-[#66716A] mt-1">
            Share what you need or offer. It starts as a draft — publish it when
            you are ready for responses.
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl p-8 custom-card-shadow">
          <OpportunityForm businesses={businesses} />
        </div>
      </div>
    </section>
  )
}
