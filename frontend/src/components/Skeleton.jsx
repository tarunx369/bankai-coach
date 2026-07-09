export function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonLesson() {
  return (
    <div className="space-y-4">
      <SkeletonBlock className="h-8 w-2/3" />
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-5/6" />
      <SkeletonBlock className="h-40 w-full" />
      <SkeletonBlock className="h-4 w-3/4" />
    </div>
  );
}
