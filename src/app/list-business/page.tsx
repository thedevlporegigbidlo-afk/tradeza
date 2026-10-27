import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { BusinessForm } from "@/components/business-form"
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

  const categories = await getCategories()

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#202923] font-bold tracking-tight">
            List your business
          </h1>
          <p className="font-body-md text-body-md text-[#66716A] mt-1">
            Create a profile so other businesses can find you. It starts as a
            draft — review and publish when you are ready.
          </p>
        </div>
        <div className="bg-[#EDF3ED] border border-[#CCD5CB] rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-label-lg text-label-lg text-[#202923] font-semibold">
              Business Listing Fee
            </p>
            <p className="font-body-sm text-body-sm text-[#66716A] mt-0.5">
              Pay ₹49 once to publish your business listing on Tradeza
            </p>
          </div>
          <span className="font-headline-sm text-headline-sm text-primary font-bold">
            ₹49
          </span>
        </div>
        <div className="bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl p-8 custom-card-shadow">
          <BusinessForm categories={categories} />
        </div>
      </div>
    </section>
  )
}
