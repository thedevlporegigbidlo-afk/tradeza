"use client"

import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { signInWithGoogle, type AuthFormState } from "@/lib/actions/auth"

function GoogleButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-surface-container-lowest hover:bg-[#FAFAF7] text-[#202923] border border-[#E4E9E3] hover:border-[#CCD5CB] font-label-lg text-label-lg px-6 py-3.5 rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.97 10.97 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"
        />
      </svg>
      {pending ? "Redirecting to Google…" : "Continue with Google"}
    </button>
  )
}

const initialState: AuthFormState = {}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(
    signInWithGoogle,
    initialState
  )

  return (
    <div className="w-full max-w-md bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl p-8 custom-card-shadow">
      <div className="text-center mb-8">
        <h1 className="font-headline-md text-headline-md text-[#202923] font-bold tracking-tight mb-2">
          Welcome to Tradeza
        </h1>
        <p className="font-body-sm text-body-sm text-[#66716A] leading-relaxed">
          Sign in to list your business, post opportunities, and connect with
          businesses worldwide.
        </p>
      </div>

      {state.error && (
        <div
          role="alert"
          className="mb-6 bg-error-container text-on-error-container font-body-sm text-body-sm rounded-xl px-4 py-3 border border-[#FFDAD6]"
        >
          {state.error}
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        {next && <input type="hidden" name="next" value={next} />}
        <GoogleButton />
      </form>

      <p className="mt-8 text-center font-body-sm text-body-sm text-[#66716A]">
        By continuing, you agree to use Tradeza for legitimate business
        networking.
      </p>

      <div className="mt-6 pt-6 border-t border-[#E4E9E3] text-center">
        <Link
          href="/"
          className="text-primary hover:text-[#1C573F] font-label-lg text-label-lg font-semibold"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
