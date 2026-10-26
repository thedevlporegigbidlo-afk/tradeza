"use client"

import { useActionState } from "react"
import {
  createBusiness,
  updateBusiness,
} from "@/lib/actions/businesses"
import { SubmitButton } from "@/components/submit-button"
import type { FormState } from "@/lib/validation"
import type { Category } from "@/lib/types/database"
import type { Business } from "@/lib/types/database"

const inputClass =
  "w-full bg-surface-container-lowest border border-[#E4E9E3] rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"

const labelClass =
  "block font-label-lg text-label-lg text-[#202923] mb-1.5"

export function BusinessForm({
  categories,
  business,
}: {
  categories: Category[]
  business?: Business
}) {
  const isEdit = Boolean(business?.id)
  const action = isEdit
    ? updateBusiness.bind(null, business!.id)
    : createBusiness

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
        <label htmlFor="name" className={labelClass}>
          Business name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={120}
          defaultValue={business?.name ?? ""}
          placeholder="e.g. Northstar Solar Supply"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="category_id" className={labelClass}>
          Category
        </label>
        <select
          id="category_id"
          name="category_id"
          required
          defaultValue={business?.category_id ?? ""}
          className={inputClass}
        >
          <option value="" disabled>
            Choose a category…
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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
            defaultValue={business?.country ?? ""}
            placeholder="e.g. India"
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
            defaultValue={business?.city ?? ""}
            placeholder="e.g. Jaipur"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="short_description" className={labelClass}>
          Short description
        </label>
        <input
          id="short_description"
          name="short_description"
          type="text"
          required
          minLength={10}
          maxLength={200}
          defaultValue={business?.short_description ?? ""}
          placeholder="One line that summarizes what your business does."
          className={inputClass}
        />
        <p className="mt-1 font-body-sm text-body-sm text-outline">
          Up to 200 characters. Shown on cards.
        </p>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Full description
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          defaultValue={business?.description ?? ""}
          placeholder="Describe your products, services, markets, and what you are looking for."
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="website_url" className={labelClass}>
          Website URL <span className="text-outline font-body-sm">(optional)</span>
        </label>
        <input
          id="website_url"
          name="website_url"
          type="url"
          maxLength={500}
          defaultValue={business?.website_url ?? ""}
          placeholder="https://example.com"
          className={inputClass}
        />
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
            defaultValue={business?.public_email ?? ""}
            placeholder="hello@example.com"
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
            defaultValue={business?.public_phone ?? ""}
            placeholder="+1 555 000 0000"
            className={inputClass}
          />
        </div>
      </div>

      <div className="pt-2 flex items-center gap-4">
        <SubmitButton>
          {isEdit ? "Save changes" : "Create business"}
        </SubmitButton>
        <p className="font-body-sm text-body-sm text-[#66716A]">
          Saved as a draft — you can publish it from My Business.
        </p>
      </div>
    </form>
  )
}
