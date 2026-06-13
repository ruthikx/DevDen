export function TagPill({ name }: { name: string }) {
  return (
    <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-sm text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
      {name}
    </span>
  );
}
