import Link from "next/link"
import { Icon } from "@/components/icon"

export default function OpportunityNotFound() {
  return (
    <section className="py-24">
      <div className="max-w-xl mx-auto px-6 text-center">
        <div className="w-14 h-14 bg-[#EDF3ED] text-primary rounded-2xl mx-auto flex items-center justify-center mb-6">
          <Icon name="search_off" className="text-[28px]" />
        </div>
        <h1 className="font-headline-md text-headline-md text-[#202923] font-bold mb-3">
          Opportunity not found
        </h1>
        <p className="font-body-md text-body-md text-[#66716A] mb-8">
          This opportunity does not exist or is no longer published.
        </p>
        <Link
          href="/opportunities"
          className="inline-block bg-primary-container hover:bg-[#1C573F] text-on-primary font-label-lg text-label-lg px-6 py-3 rounded-xl transition-all shadow-sm"
        >
          Browse opportunities
        </Link>
      </div>
    </section>
  )
}
