export function EntrySkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div aria-hidden="true" className="border-t border-rule-firm">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="border-b border-rule px-4 py-6">
          <div className="shimmer h-6 w-1/3 rounded-sm" />
          <div className="shimmer mt-3 h-4 w-3/4 rounded-sm" />
          <div className="shimmer mt-3 h-3.5 w-1/4 rounded-sm" />
        </div>
      ))}
    </div>
  )
}