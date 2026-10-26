"use client"

import { useFormStatus } from "react-dom"

export function SubmitButton({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        "bg-primary-container hover:bg-[#1C573F] active:scale-[0.99] text-on-primary font-label-lg text-label-lg px-7 py-3 rounded-xl transition-all duration-150 shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      }
    >
      {pending ? "Please wait…" : children}
    </button>
  )
}
