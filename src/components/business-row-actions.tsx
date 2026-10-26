"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import {
  setBusinessStatus,
  deleteBusiness,
} from "@/lib/actions/businesses"
import type { ActionResult } from "@/lib/validation"
import { ConfirmActionButton } from "@/components/confirm-action-button"

export function BusinessRowActions({
  businessId,
  status,
  slug,
}: {
  businessId: string
  status: string
  slug: string
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function run(action: () => Promise<ActionResult>) {
    setError(null)
    startTransition(async () => {
      const result = await action()
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Link
          href={`/list-business/${businessId}/edit`}
          className="font-label-md text-label-md font-semibold text-on-surface-variant hover:text-primary"
        >
          Edit
        </Link>
        <Link
          href={`/my-business/${businessId}/preview`}
          className="font-label-md text-label-md font-semibold text-on-surface-variant hover:text-primary"
        >
          Preview
        </Link>
        {status === "draft" ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => setBusinessStatus(businessId, "published"))}
            className="font-label-md text-label-md font-semibold text-primary hover:underline disabled:opacity-60"
          >
            {pending ? "Working…" : "Publish"}
          </button>
        ) : (
          <>
            <Link
              href={`/businesses/${slug}`}
              className="font-label-md text-label-md font-semibold text-on-surface-variant hover:text-primary"
            >
              View
            </Link>
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => setBusinessStatus(businessId, "draft"))}
              className="font-label-md text-label-md font-semibold text-primary hover:underline disabled:opacity-60"
            >
              {pending ? "Working…" : "Unpublish"}
            </button>
          </>
        )}
        <ConfirmActionButton
          action={() => deleteBusiness(businessId)}
          confirmMessage="delete"
        >
          Delete
        </ConfirmActionButton>
      </div>
      {error && (
        <p role="alert" className="font-body-sm text-body-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
}
