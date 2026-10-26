export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="bg-surface-container-lowest border border-[#E4E9E3] rounded-2xl p-12 text-center custom-card-shadow">
      <div className="w-12 h-12 rounded-xl bg-[#EDF3ED] text-primary mx-auto flex items-center justify-center mb-5">
        <span className="material-symbols-outlined text-[26px]">search_off</span>
      </div>
      <h3 className="font-headline-sm text-headline-sm text-[#202923] font-bold mb-2">
        {title}
      </h3>
      <p className="font-body-sm text-body-sm text-[#66716A] max-w-md mx-auto leading-relaxed mb-6">
        {description}
      </p>
      {action}
    </div>
  )
}
