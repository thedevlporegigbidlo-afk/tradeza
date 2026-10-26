"use client"

import { useRef, useState } from "react"
import { Icon } from "@/components/icon"
import { createClient } from "@/lib/supabase/client"
import {
  BUSINESS_MEDIA_BUCKET,
  IMAGE_MIME_TYPES,
  MAX_IMAGE_BYTES,
} from "@/lib/constants"

type ImageUploaderProps = {
  name: string
  label: string
  hint?: string
  initialUrls?: string[]
  max?: number
  single?: boolean
}

export function ImageUploader({
  name,
  label,
  hint,
  initialUrls = [],
  max = 8,
  single = false,
}: ImageUploaderProps) {
  const limit = single ? 1 : max
  const [urls, setUrls] = useState<string[]>(
    initialUrls.filter(Boolean).slice(0, limit)
  )
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null)

    const remaining = limit - urls.length
    if (remaining <= 0) {
      setError(`You can add up to ${limit} photo${limit === 1 ? "" : "s"}.`)
      return
    }

    const selected = Array.from(files)
    if (selected.length > remaining) {
      setError(
        `Only ${remaining} more photo${remaining === 1 ? "" : "s"} can be added.`
      )
      return
    }

    for (const file of selected) {
      if (!IMAGE_MIME_TYPES.includes(file.type as (typeof IMAGE_MIME_TYPES)[number])) {
        setError("Use a JPG, PNG, WebP, or AVIF image.")
        return
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setError("Each photo must be 5 MB or smaller.")
        return
      }
    }

    setBusy(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("Your session expired. Please sign in again to upload photos.")
        return
      }

      const uploaded: string[] = []
      for (const file of selected) {
        const rawExt = file.name.split(".").pop()?.toLowerCase() ?? ""
        const ext = /^[a-z0-9]{2,5}$/.test(rawExt) ? rawExt : "jpg"
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from(BUSINESS_MEDIA_BUCKET)
          .upload(path, file, {
            cacheControl: "31536000",
            contentType: file.type,
            upsert: false,
          })

        if (uploadError) {
          setError("Could not upload this photo. Please try again.")
          break
        }

        const { data } = supabase.storage
          .from(BUSINESS_MEDIA_BUCKET)
          .getPublicUrl(path)
        uploaded.push(data.publicUrl)
      }

      if (uploaded.length > 0) {
        setUrls((current) => [...current, ...uploaded].slice(0, limit))
      }
    } catch {
      setError("Could not upload this photo. Please try again.")
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  async function remove(url: string) {
    setUrls((current) => current.filter((item) => item !== url))
    setError(null)

    const marker = `/object/public/${BUSINESS_MEDIA_BUCKET}/`
    if (!url.includes(marker)) return
    const path = decodeURIComponent(url.split(marker)[1]?.split("?")[0] ?? "")
    if (!path) return

    const supabase = createClient()
    await supabase.storage.from(BUSINESS_MEDIA_BUCKET).remove([path])
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <span className="block font-label-lg text-label-lg text-[#202923]">
          {label}
        </span>
        <span className="font-label-sm text-label-sm text-outline">
          {urls.length}/{limit}
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {urls.map((url) => (
          <div
            key={url}
            className="relative aspect-square rounded-xl overflow-hidden border border-[#E4E9E3] bg-[#FAFAF7]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/95 text-[#202923] border border-[#E4E9E3] inline-flex items-center justify-center shadow-sm hover:bg-white"
              aria-label="Remove photo"
            >
              <Icon name="close" className="text-[16px]" />
            </button>
          </div>
        ))}

        {urls.length < limit && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="aspect-square rounded-xl border border-dashed border-[#CCD5CB] bg-[#FAFAF7] text-[#66716A] flex flex-col items-center justify-center gap-1 px-2 hover:border-primary-container hover:text-primary transition-colors disabled:opacity-60"
          >
            <Icon
              name={busy ? "hourglass_top" : "add_photo_alternate"}
              className="text-[24px]"
            />
            <span className="font-label-sm text-label-sm text-center">
              {busy ? "Uploading…" : "Add photo"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_MIME_TYPES.join(",")}
        multiple={!single}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => handleFiles(event.target.files)}
      />

      {urls.map((url) => (
        <input key={url} type="hidden" name={name} value={url} />
      ))}

      {hint && (
        <p className="mt-2 font-body-sm text-body-sm text-outline">{hint}</p>
      )}
      {error && (
        <p role="alert" className="mt-2 font-body-sm text-body-sm text-[#B3261E]">
          {error}
        </p>
      )}
    </div>
  )
}
