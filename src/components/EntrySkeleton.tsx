/** Stands in for the work list while webfonts resolve. */
export function EntrySkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div aria-hidden="true" className="border-t border-rule-firm">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="border-b border-rule px-2 py-6">
          <div className="shimmer h-[22px] w-[34%] rounded-sm" />
          <div className="shimmer mt-4 h-[14px] w-[72%] rounded-sm" />
          <div className="shimmer mt-4 h-[10px] w-[22%] rounded-sm" />
        </div>
      ))}
    </div>
  )
}