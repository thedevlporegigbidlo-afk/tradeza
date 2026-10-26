import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserBusiness } from "@/lib/queries"
import { BusinessForm } from "@/components/business-form"
import { getCategories } from "@/lib/queries"

export const metadata: Metadata = {
  title: "Edit Business — Tradeza",
}

export const instant = false

export default async function EditBusinessPage({
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
  if (!business) redirect("/my-business")

  const categories = await getCategories()

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#202923] font-bold tracking-tight">
            Edit business
          </h1>
          <p className="font-body-md text-body-md text-[#66716A] mt-1">
            Update the details for {business.name}.
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl p-8 custom-card-shadow">
          <BusinessForm categories={categories} business={business} />
        </div>
      </div>
    </section>
  )
}
