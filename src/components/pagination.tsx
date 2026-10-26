import Link from "next/link"
import { Icon } from "@/components/icon"

export function Pagination({
  page,
  pageCount,
  basePath,
  searchParams,
}: {
  page: number
  pageCount: number
  basePath: string
  searchParams: Record<string, string | undefined>
}) {
  if (pageCount <= 1) return null

  function hrefFor(p: number): string {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value)
    }
    if (p > 1) params.set("page", String(p))
    else params.delete("page")
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-3 mt-12"
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          className="inline-flex items-center gap-1.5 bg-surface-container-lowest hover:bg-[#FAFAF7] text-[#202923] border border-[#E4E9E3] hover:border-[#CCD5CB] font-label-lg text-label-lg px-4 py-2.5 rounded-xl transition-all"
        >
          <Icon name="arrow_back" className="text-sm" />
          <span>Previous</span>
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-outline font-label-lg text-label-lg px-4 py-2.5 opacity-50">
          <Icon name="arrow_back" className="text-sm" />
          <span>Previous</span>
        </span>
      )}
      <span className="font-label-md text-label-md text-[#66716A]">
        Page {page} of {pageCount}
      </span>
      {page < pageCount ? (
        <Link
          href={hrefFor(page + 1)}
          className="inline-flex items-center gap-1.5 bg-surface-container-lowest hover:bg-[#FAFAF7] text-[#202923] border border-[#E4E9E3] hover:border-[#CCD5CB] font-label-lg text-label-lg px-4 py-2.5 rounded-xl transition-all"
        >
          <span>Next</span>
          <Icon name="arrow_forward" className="text-sm" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-outline font-label-lg text-label-lg px-4 py-2.5 opacity-50">
          <span>Next</span>
          <Icon name="arrow_forward" className="text-sm" />
        </span>
      )}
    </nav>
  )
}
