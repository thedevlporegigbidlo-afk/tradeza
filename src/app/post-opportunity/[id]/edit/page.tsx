import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserOpportunity } from "@/lib/queries"
import { OpportunityForm } from "@/components/opportunity-form"
import { getUserBusinesses } from "@/lib/queries"

export const metadata: Metadata = {
  title: "Edit Opportunity — Tradeza",
}

export const instant = false

export default async function EditOpportunityPage({
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

  const opportunity = await getUserOpportunity(user.id, id)
  if (!opportunity) redirect("/my-business")

  const businesses = await getUserBusinesses(user.id)

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#202923] font-bold tracking-tight">
            Edit opportunity
          </h1>
          <p className="font-body-md text-body-md text-[#66716A] mt-1">
            Update the details for this opportunity.
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl p-8 custom-card-shadow">
          <OpportunityForm businesses={businesses} opportunity={opportunity} />
        </div>
      </div>
    </section>
  )
}
