import type { Metadata } from "next"
import Link from "next/link"
import { Icon } from "@/components/icon"

export const metadata: Metadata = {
  title: "Pricing — Tradeza",
  description: "List your business on Tradeza for just ₹49.",
}

export const instant = false

export default function PricingPage() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#202923] font-bold tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="font-body-md text-body-md text-[#66716A] mt-2">
            One-time fee to get your business in front of buyers worldwide
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl p-8 custom-card-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-headline-md text-headline-md text-[#202923] font-bold">
                Business Listing
              </h2>
              <p className="font-body-sm text-body-sm text-[#66716A] mt-1">
                Get discovered by businesses across the globe
              </p>
            </div>
            <div className="text-right">
              <span className="font-headline-lg text-headline-lg text-primary font-bold">
                ₹49
              </span>
              <p className="font-label-sm text-label-sm text-[#66716A]">one-time</p>
            </div>
          </div>

          <ul className="flex flex-col gap-3 mb-8">
            {[
              "Business profile in Tradeza directory",
              "Direct WhatsApp contact button",
              "Photo gallery & product showcase",
              "Appear in category & search results",
              "Post business opportunities",
              "Dashboard to manage your listing",
            ].map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 font-body-md text-body-md text-[#202923]"
              >
                <Icon name="check_circle" className="text-primary text-[20px]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/list-business"
            className="w-full bg-primary-container hover:bg-[#1C573F] text-on-primary font-label-lg text-label-lg px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>List Your Business for ₹49</span>
            <Icon name="arrow_forward" className="text-sm" />
          </Link>
        </div>
      </div>
    </section>
  )
}
