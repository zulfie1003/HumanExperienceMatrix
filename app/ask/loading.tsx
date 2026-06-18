export default function AskLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-80 bg-muted animate-pulse rounded" />
      </div>
      <div className="h-32 bg-muted animate-pulse rounded-lg" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-8 w-24 bg-muted animate-pulse rounded-full" />
        ))}
      </div>
      <div className="h-10 bg-muted animate-pulse rounded-lg" />
    </div>
  );
}
