export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "")
}

// Strips characters that PostgREST treats as filter syntax inside `or=(...)`
// expressions and characters that act as LIKE wildcards, so user input can
// only ever be used as a literal search term.
export function escapeLike(input: string): string {
  return input
    .replace(/[%_,()*\\:]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100)
}

const FALLBACK_NEXT = "/my-business"

// Only allows same-origin, absolute-path redirects. Rejects protocol-relative
// URLs (`//evil.com`), backslash tricks (`/\evil.com`) and control characters.
export function safeNextPath(
  next: string | null | undefined,
  fallback: string = FALLBACK_NEXT
): string {
  if (!next) return fallback
  const value = next.trim()
  if (!value.startsWith("/")) return fallback
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback
  if (/[\u0000-\u001f\u007f\\]/.test(value)) return fallback
  try {
    const base = "http://localhost"
    const url = new URL(value, base)
    if (url.origin !== base) return fallback
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ""
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (seconds < 60) return "Just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`
  const years = Math.floor(days / 365)
  return `${years} year${years === 1 ? "" : "s"} ago`
}

export function locationLabel(
  city: string | null,
  country: string | null
): string {
  return [city, country].filter(Boolean).join(", ")
}

// Builds a wa.me link from whatever number the owner typed. Bare 10-digit
// Indian numbers get the +91 prefix, `00` international prefixes are dropped.
export function whatsappLink(phone: string, message?: string): string {
  let digits = phone.replace(/\D/g, "")
  if (digits.startsWith("00")) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = `91${digits.slice(1)}`
  } else if (digits.length === 10) {
    digits = `91${digits}`
  }
  const query = message ? `?text=${encodeURIComponent(message)}` : ""
  return `https://wa.me/${digits}${query}`
}

// Products/services are entered as free text (one per line or comma
// separated). This turns that into clean, de-duplicated chips.
export function splitList(text: string | null | undefined): string[] {
  if (!text) return []
  const parts = text
    .split(/[\n,;|•]+/)
    .map((part) => part.trim())
    .filter(Boolean)
  return [...new Set(parts)].slice(0, 24)
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

// Formats a Postgres `date` (YYYY-MM-DD) without timezone drift.
export function formatDateOnly(value: string | null): string | null {
  if (!value) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (!match) return value
  const [, year, month, day] = match
  const monthName = MONTHS[Number(month) - 1]
  if (!monthName) return value
  return `${Number(day)} ${monthName} ${year}`
}
