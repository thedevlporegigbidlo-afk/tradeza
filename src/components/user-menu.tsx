"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { Icon } from "@/components/icon"
import { signOut } from "@/lib/actions/auth"

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export function UserMenu({
  name,
  email,
  avatarUrl,
}: {
  name: string
  email: string
  avatarUrl: string | null
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[#F5F7F3] transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={name}
            className="w-9 h-9 rounded-full object-cover border border-[#E4E9E3]"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#EDF3ED] text-primary flex items-center justify-center font-label-md text-label-md font-semibold">
            {getInitials(name)}
          </div>
        )}
        <div className="hidden sm:flex flex-col items-start">
          <span className="font-label-md text-label-md text-[#202923] leading-tight">
            {name}
          </span>
          <span className="font-label-sm text-label-sm text-[#66716A] leading-tight">
            {email}
          </span>
        </div>
        <Icon
          name="expand_more"
          className={`text-outline transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl shadow-lg overflow-hidden z-50"
          role="menu"
        >
          <div className="px-4 py-3 border-b border-[#E4E9E3]">
            <p className="font-label-lg text-label-lg text-[#202923] truncate">
              {name}
            </p>
            <p className="font-body-sm text-body-sm text-[#66716A] truncate">
              {email}
            </p>
          </div>
          <div className="py-1">
            <Link
              href="/my-business"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F7F3] text-[#202923] font-body-md text-body-md transition-colors"
              role="menuitem"
            >
              <Icon name="dashboard" className="text-outline" />
              <span>My Dashboard</span>
            </Link>
            <Link
              href="/list-business"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F7F3] text-[#202923] font-body-md text-body-md transition-colors"
              role="menuitem"
            >
              <Icon name="add_business" className="text-outline" />
              <span>Add Business</span>
            </Link>
            <Link
              href="/post-opportunity"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F7F3] text-[#202923] font-body-md text-body-md transition-colors"
              role="menuitem"
            >
              <Icon name="campaign" className="text-outline" />
              <span>Post Opportunity</span>
            </Link>
          </div>
          <div className="py-1 border-t border-[#E4E9E3]">
            <form action={signOut}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#FEF3F2] text-[#BA1A1A] font-body-md text-body-md transition-colors"
                role="menuitem"
              >
                <Icon name="logout" className="text-[#BA1A1A]" />
                <span>Sign out</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
