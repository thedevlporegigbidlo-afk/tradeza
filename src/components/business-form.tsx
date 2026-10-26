"use client"

import { useActionState } from "react"
import {
  createBusiness,
  updateBusiness,
} from "@/lib/actions/businesses"
import { SubmitButton } from "@/components/submit-button"
import { ImageUploader } from "@/components/image-uploader"
import {
  BUSINESS_TYPES,
  BUSINESS_TYPE_LABELS,
  MAX_GALLERY_IMAGES,
  MAX_LOGOS,
} from "@/lib/constants"
import type { FormState } from "@/lib/validation"
import type { Category } from "@/lib/types/database"
import type { Business } from "@/lib/types/database"

const inputClass =
  "w-full bg-surface-container-lowest border border-[#E4E9E3] rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"

const labelClass =
  "block font-label-lg text-label-lg text-[#202923] mb-1.5"

function SectionTitle({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="border-t border-[#E4E9E3] pt-6 mt-2">
      <h2 className="font-headline-sm text-headline-sm text-[#202923] font-bold">
        {title}
      </h2>
      {description && (
        <p className="font-body-sm text-body-sm text-[#66716A] mt-1">
          {description}
        </p>
      )}
    </div>
  )
}

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
        <div>
          <label htmlFor="business_type" className={labelClass}>
            Business type
          </label>
          <select
            id="business_type"
            name="business_type"
            required
            defaultValue={business?.business_type ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Choose a type…
            </option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {BUSINESS_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <SectionTitle
        title="Location"
        description="Where you operate and where you can deliver or serve."
      />

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="service_areas" className={labelClass}>
            Service areas{" "}
            <span className="text-outline font-body-sm">(optional)</span>
          </label>
          <input
            id="service_areas"
            name="service_areas"
            type="text"
            maxLength={300}
            defaultValue={business?.service_areas ?? ""}
            placeholder="e.g. Jaipur, Delhi NCR, all India"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="established_year" className={labelClass}>
            Established year{" "}
            <span className="text-outline font-body-sm">(optional)</span>
          </label>
          <input
            id="established_year"
            name="established_year"
            type="number"
            inputMode="numeric"
            min={1900}
            max={2100}
            defaultValue={business?.established_year ?? ""}
            placeholder="e.g. 2016"
            className={inputClass}
          />
        </div>
      </div>

      <SectionTitle
        title="What you offer"
        description="The details buyers usually ask for in the group chat."
      />

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
          rows={5}
          defaultValue={business?.description ?? ""}
          placeholder="Describe your business, experience, markets, and what you are looking for."
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="products" className={labelClass}>
          Products / services{" "}
          <span className="text-outline font-body-sm">(optional)</span>
        </label>
        <textarea
          id="products"
          name="products"
          maxLength={1000}
          rows={3}
          defaultValue={business?.products ?? ""}
          placeholder={"One per line, e.g.\nBasmati rice\nSpices\nPackaged groceries"}
          className={inputClass}
        />
        <p className="mt-1 font-body-sm text-body-sm text-outline">
          One product or service per line. These appear as chips on your
          profile and are searchable.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price_range" className={labelClass}>
            Price range{" "}
            <span className="text-outline font-body-sm">(optional)</span>
          </label>
          <input
            id="price_range"
            name="price_range"
            type="text"
            maxLength={120}
            defaultValue={business?.price_range ?? ""}
            placeholder="e.g. ₹650–₹1,200 per piece"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="moq" className={labelClass}>
            Minimum order (MOQ){" "}
            <span className="text-outline font-body-sm">(optional)</span>
          </label>
          <input
            id="moq"
            name="moq"
            type="text"
            maxLength={120}
            defaultValue={business?.moq ?? ""}
            placeholder="e.g. 50 pieces / 100 kg"
            className={inputClass}
          />
        </div>
      </div>

      <SectionTitle
        title="Photos"
        description="A logo and real product photos build trust. JPG, PNG, WebP, or AVIF up to 5 MB each."
      />

      <ImageUploader
        name="logo_url"
        label="Logo / profile photo"
        hint="Square images look best. Shown on cards and your profile."
        initialUrls={business?.logo_url ? [business.logo_url] : []}
        max={MAX_LOGOS}
        single
      />

      <ImageUploader
        name="gallery_urls"
        label="Product / work photos"
        hint={`Add up to ${MAX_GALLERY_IMAGES} photos so people can see what you actually offer.`}
        initialUrls={business?.gallery_urls ?? []}
        max={MAX_GALLERY_IMAGES}
      />

      <SectionTitle
        title="Contact"
        description="Buyers will use these details to reach you directly."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact_name" className={labelClass}>
            Contact person{" "}
            <span className="text-outline font-body-sm">(optional)</span>
          </label>
          <input
            id="contact_name"
            name="contact_name"
            type="text"
            maxLength={80}
            defaultValue={business?.contact_name ?? ""}
            placeholder="e.g. Imran Shaikh"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="designation" className={labelClass}>
            Designation{" "}
            <span className="text-outline font-body-sm">(optional)</span>
          </label>
          <input
            id="designation"
            name="designation"
            type="text"
            maxLength={80}
            defaultValue={business?.designation ?? ""}
            placeholder="e.g. Owner / Sales Head"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="whatsapp" className={labelClass}>
            WhatsApp number{" "}
            <span className="text-outline font-body-sm">(recommended)</span>
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            maxLength={40}
            defaultValue={business?.whatsapp ?? ""}
            placeholder="e.g. +91 98765 43210"
            className={inputClass}
          />
          <p className="mt-1 font-body-sm text-body-sm text-outline">
            Adds a one-tap “Chat on WhatsApp” button to your listing.
          </p>
        </div>
        <div>
          <label htmlFor="public_phone" className={labelClass}>
            Phone{" "}
            <span className="text-outline font-body-sm">(optional)</span>
          </label>
          <input
            id="public_phone"
            name="public_phone"
            type="tel"
            maxLength={40}
            defaultValue={business?.public_phone ?? ""}
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="public_email" className={labelClass}>
            Public email{" "}
            <span className="text-outline font-body-sm">(optional)</span>
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
          <label htmlFor="website_url" className={labelClass}>
            Website / catalogue{" "}
            <span className="text-outline font-body-sm">(optional)</span>
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
      </div>

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
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
