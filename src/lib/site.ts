import { env } from "@/lib/env"

export { safeNextPath } from "@/lib/utils"

export function siteUrl(path = ""): string {
  const base = (env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    ""
  )
  return `${base}${path}`
}
