import type { Metadata } from "next"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Log in — Tradeza",
  description: "Sign in to Tradeza with Google.",
}

export const instant = false

const ERROR_MESSAGES: Record<string, string> = {
  sign_in_cancelled: "Sign-in was cancelled. You can try again anytime.",
  auth_error: "Something went wrong signing you in. Please try again.",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>
}) {
  const params = await searchParams
  const errorMessage = params.error
    ? (ERROR_MESSAGES[params.error] ?? ERROR_MESSAGES.auth_error)
    : null

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 w-full max-w-md bg-error-container text-on-error-container font-body-sm text-body-sm rounded-xl px-4 py-3 border border-[#FFDAD6] text-center"
          >
            {errorMessage}
          </div>
        )}
        <LoginForm next={params.next} />
      </div>
    </section>
  )
}
