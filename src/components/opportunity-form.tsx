"use client"

import { useActionState } from "react"
import {
  createOpportunity,
  updateOpportunity,
} from "@/lib/actions/opportunities"
import { SubmitButton } from "@/components/submit-button"
import { OPPORTUNITY_TYPES, OPPORTUNITY_TYPE_LABELS } from "@/lib/constants"
import type { FormState } from "@/lib/validation"
import type { Opportunity, Business } from "@/lib/types/database"

const inputClass =
  "w-full bg-surface-container-lowest border border-[#E4E9E3] rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"

const labelClass =
  "block font-label-lg text-label-lg text-[#202923] mb-1.5"

export function OpportunityForm({
  businesses,
  opportunity,
}: {
  businesses: Business[]
  opportunity?: Opportunity
}) {
  const isEdit = Boolean(opportunity?.id)
  const action = isEdit
    ? updateOpportunity.bind(null, opportunity!.id)
    : createOpportunity

  const initialState: FormState = {}
  const [state, formAction] = useActionState(action, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.error && (
        <div
          role="alert"
          className="bg-error-container text-on-error-container font-body-sm text-body-sm rounded-xl px-4 py-3 border border-[#FFDAD6]"
        >
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={8}
          maxLength={160}
          defaultValue={opportunity?.title ?? ""}
          placeholder="e.g. Looking for sustainable packaging suppliers"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="type" className={labelClass}>
          Opportunity type
        </label>
        <select
          id="type"
          name="type"
          required
          defaultValue={opportunity?.type ?? ""}
          className={inputClass}
        >
          <option value="" disabled>
            Choose a type…
          </option>
          {OPPORTUNITY_TYPES.map((type) => (
            <option key={type} value={type}>
              {OPPORTUNITY_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={20}
          maxLength={5000}
          rows={6}
          defaultValue={opportunity?.description ?? ""}
          placeholder="Describe what you need or offer, quantities, timelines, and any requirements."
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="country" className={labelClass}>
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            maxLength={100}
            defaultValue={opportunity?.country ?? ""}
            placeholder="e.g. Netherlands"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="city" className={labelClass}>
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            maxLength={100}
            defaultValue={opportunity?.city ?? ""}
            placeholder="e.g. Rotterdam"
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          id="is_international"
          name="is_international"
          type="checkbox"
          defaultChecked={opportunity?.is_international ?? false}
          className="mt-1 h-5 w-5 rounded border-[#E4E9E3] text-primary-container focus:ring-primary-container/30"
        />
        <span>
          <span className="block font-label-lg text-label-lg text-[#202923]">
            Open to international partners
          </span>
          <span className="block font-body-sm text-body-sm text-[#66716A]">
            Tick this if location does not matter and you welcome global
            responses.
          </span>
        </span>
      </label>

      <div>
        <label htmlFor="business_id" className={labelClass}>
          Link to one of your businesses{" "}
          <span className="text-outline font-body-sm">(optional)</span>
        </label>
        <select
          id="business_id"
          name="business_id"
          defaultValue={opportunity?.business_id ?? ""}
          className={inputClass}
        >
          <option value="">No linked business</option>
          {businesses.map((business) => (
            <option key={business.id} value={business.id}>
              {business.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="public_email" className={labelClass}>
            Public email <span className="text-outline font-body-sm">(optional)</span>
          </label>
          <input
            id="public_email"
            name="public_email"
            type="email"
            maxLength={320}
            defaultValue={opportunity?.public_email ?? ""}
            placeholder="deals@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="public_phone" className={labelClass}>
            Public phone <span className="text-outline font-body-sm">(optional)</span>
          </label>
          <input
            id="public_phone"
            name="public_phone"
            type="tel"
            maxLength={40}
            defaultValue={opportunity?.public_phone ?? ""}
            placeholder="+1 555 000 0000"
            className={inputClass}
          />
        </div>
      </div>

      <div className="pt-2 flex items-center gap-4">
        <SubmitButton>
          {isEdit ? "Save changes" : "Create opportunity"}
        </SubmitButton>
        <p className="font-body-sm text-body-sm text-[#66716A]">
          Saved as a draft — you can publish it from My Business.
        </p>
      </div>
    </form>
  )
}
