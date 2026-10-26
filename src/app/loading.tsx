import { Icon } from "@/components/icon"

export default function Loading() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
        <Icon
          name="progress_activity"
          className="text-primary text-[32px] animate-spin"
        />
        <p className="font-body-md text-body-md text-[#66716A]">Loading…</p>
      </div>
    </section>
  )
}
