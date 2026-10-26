"use client"

import { useState, useTransition } from "react"

export function ConfirmActionButton({
  action,
  confirmMessage,
  children,
  className,
}: {
  action: () => Promise<{ error?: string } | void>
  confirmMessage: string
  children: React.ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setError(null)
          setOpen(true)
        }}
        className={
          className ??
          "font-label-md text-label-md font-semibold text-error hover:underline"
        }
      >
        {children}
      </button>
    )
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <span className="inline-flex items-center gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              const result = await action()
              if (result && "error" in result && result.error) {
                setError(result.error)
                return
              }
              setOpen(false)
            })
          }}
          className={
            className ??
            "font-label-md text-label-md font-semibold text-error hover:underline disabled:opacity-60"
          }
        >
          {pending ? "Working…" : `Yes, ${confirmMessage}`}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => setOpen(false)}
          className="font-label-md text-label-md font-semibold text-on-surface-variant hover:text-primary"
        >
          Cancel
        </button>
      </span>
      {error && (
        <span role="alert" className="font-body-sm text-body-sm text-error">
          {error}
        </span>
      )}
    </span>
  )
}
