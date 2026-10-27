import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { BusinessForm } from "@/components/business-form"
import { PayToList } from "@/components/pay-to-list"
import { getCategories } from "@/lib/queries"

export const metadata: Metadata = {
  title: "List Your Business — Tradeza",
  description: "Create a business profile and help the right people find you.",
}

export const instant = false

export default async function ListBusinessPage() {
  await connection()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login?next=%2Flist-business")

  const { data: profile } = await supabase
    .from("profiles")
    .select("has_paid_listing, paid_at")
    .eq("id", user.id)
    .maybeSingle()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasPaid = (profile as any)?.has_paid_listing === true

  const categories = await getCategories()

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#202923] font-bold tracking-tight">
            List your business
          </h1>
          <p className="font-body-md text-body-md text-[#66716A] mt-1">
            Create a profile so other businesses can find you.
          </p>
        </div>
        {hasPaid ? (
          <div className="bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl p-8 custom-card-shadow">
            <BusinessForm categories={categories} />
          </div>
        ) : (
          <PayToList />
        )}
      </div>
    </section>
  )
}
