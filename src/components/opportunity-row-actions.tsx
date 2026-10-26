"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import {
  setOpportunityStatus,
  deleteOpportunity,
} from "@/lib/actions/opportunities"
import type { ActionResult } from "@/lib/validation"
import { ConfirmActionButton } from "@/components/confirm-action-button"

export function OpportunityRowActions({
  opportunityId,
  status,
}: {
  opportunityId: string
  status: string
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
          href={`/post-opportunity/${opportunityId}/edit`}
          className="font-label-md text-label-md font-semibold text-on-surface-variant hover:text-primary"
        >
          Edit
        </Link>
        {status === "draft" && (
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              run(() => setOpportunityStatus(opportunityId, "published"))
            }
            className="font-label-md text-label-md font-semibold text-primary hover:underline disabled:opacity-60"
          >
            {pending ? "Working…" : "Publish"}
          </button>
        )}
        {status === "published" && (
          <>
            <Link
              href={`/opportunities/${opportunityId}`}
              className="font-label-md text-label-md font-semibold text-on-surface-variant hover:text-primary"
            >
              View
            </Link>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                run(() => setOpportunityStatus(opportunityId, "closed"))
              }
              className="font-label-md text-label-md font-semibold text-primary hover:underline disabled:opacity-60"
            >
              {pending ? "Working…" : "Close"}
            </button>
          </>
        )}
        {status === "closed" && (
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              run(() => setOpportunityStatus(opportunityId, "published"))
            }
            className="font-label-md text-label-md font-semibold text-primary hover:underline disabled:opacity-60"
          >
            {pending ? "Working…" : "Reopen"}
          </button>
        )}
        <ConfirmActionButton
          action={() => deleteOpportunity(opportunityId)}
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
