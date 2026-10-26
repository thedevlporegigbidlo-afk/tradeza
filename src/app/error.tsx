"use client"

import Link from "next/link"
import { Icon } from "@/components/icon"

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-xl mx-auto px-6">
        <div className="bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl p-8 custom-card-shadow text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#EDF3ED] text-primary flex items-center justify-center mx-auto mb-6">
            <Icon name="cloud_off" className="text-[28px]" />
          </div>
          <h1 className="font-headline-md text-headline-md text-[#202923] font-bold tracking-tight mb-2">
            Something went wrong
          </h1>
          <p className="font-body-md text-body-md text-[#66716A] mb-8 leading-relaxed">
            We could not load this page. Please try again — if it keeps
            happening, come back in a few minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="w-full sm:w-auto bg-primary-container hover:bg-[#1C573F] text-on-primary font-label-lg text-label-lg px-6 py-3 rounded-xl transition-all active:scale-[0.99]"
            >
              Try again
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto bg-surface-container-lowest hover:bg-[#FAFAF7] text-[#202923] border border-[#E4E9E3] hover:border-[#CCD5CB] font-label-lg text-label-lg px-6 py-3 rounded-xl transition-all"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
