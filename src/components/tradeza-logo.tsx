import Link from "next/link"

export const TRADEZA_MARK_SRC = "/tradeza-mark.svg"

type MarkSize = "sm" | "md" | "lg"

const MARK_SIZES: Record<MarkSize, string> = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-14 w-14",
}

const WORDMARK_SIZES: Record<MarkSize, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-3xl",
}

export function TradezaMark({
  size = "md",
  className = "",
}: {
  size?: MarkSize
  className?: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      aria-hidden="true"
      src={TRADEZA_MARK_SRC}
      className={`${MARK_SIZES[size]} rounded-[24%] object-contain shrink-0 ${className}`}
    />
  )
}

export function TradezaLogo({
  size = "md",
  href = "/",
  className = "",
}: {
  size?: MarkSize
  href?: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 active:scale-[0.99] transition-transform duration-100 ${className}`}
    >
      <TradezaMark size={size} />
      <span
        className={`${WORDMARK_SIZES[size]} font-bold tracking-tight text-[#202923]`}
      >
        Tradeza
      </span>
    </Link>
  )
}
