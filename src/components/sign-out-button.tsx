"use client"

import { useFormStatus } from "react-dom"
import { signOut } from "@/lib/actions/auth"

export function SignOutButton() {
  const { pending } = useFormStatus()

  return (
    <form action={signOut}>
      <button
        type="submit"
        disabled={pending}
        className="text-on-surface-variant hover:text-primary font-label-lg text-label-lg px-3 py-2 transition-colors active:scale-[0.99] disabled:opacity-60"
      >
        {pending ? "Signing out…" : "Sign out"}
      </button>
    </form>
  )
}
