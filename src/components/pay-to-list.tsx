"use client"

import { useState } from "react"
import { Icon } from "@/components/icon"

export function PayToList() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePay() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        setError(data.error || `Failed to start checkout (${res.status})`)
        setLoading(false)
        return
      }
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl p-8 custom-card-shadow max-w-2xl mx-auto text-center">
      <div className="w-14 h-14 bg-[#EDF3ED] text-primary rounded-2xl mx-auto flex items-center justify-center mb-6">
        <Icon name="payments" className="text-[30px]" />
      </div>
      <h2 className="font-headline-md text-headline-md text-[#202923] font-bold tracking-tight mb-2">
        Pay to list your business
      </h2>
      <p className="font-body-md text-body-md text-[#66716A] mb-6 max-w-md mx-auto">
        To keep the directory spam-free, we charge a one-time fee of ₹49 to
        publish your business listing.
      </p>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-baseline gap-2">
          <span className="font-headline-lg text-headline-lg text-primary font-bold">
            ₹49
          </span>
          <span className="font-body-md text-body-md text-[#66716A]">
            one-time
          </span>
        </div>
        <button
          onClick={handlePay}
          disabled={loading}
          className="bg-primary-container hover:bg-[#1C573F] disabled:opacity-60 disabled:cursor-not-allowed text-on-primary font-label-lg text-label-lg px-8 py-3.5 rounded-xl transition-all flex items-center gap-2"
        >
          {loading ? "Redirecting..." : "Pay ₹49 & List Business"}
          {!loading && <Icon name="arrow_forward" className="text-sm" />}
        </button>
        {error && (
          <p className="font-body-sm text-body-sm text-[#BA1A1A]">{error}</p>
        )}
      </div>
      <div className="mt-8 pt-6 border-t border-[#E4E9E3]">
        <ul className="flex flex-wrap items-center justify-center gap-4 text-[#66716A] font-label-sm text-label-sm">
          <li className="flex items-center gap-1.5">
            <Icon name="check_circle" className="text-primary text-[16px]" />
            <span>Appears in directory</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Icon name="check_circle" className="text-primary text-[16px]" />
            <span>Direct WhatsApp leads</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Icon name="check_circle" className="text-primary text-[16px]" />
            <span>Global visibility</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
