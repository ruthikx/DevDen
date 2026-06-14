export function TagPill({ name }: { name: string }) {
  return (
    <span className="inline-block rounded-md border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 text-xs font-medium text-cyan-200">
      {name}
    </span>
  );
}
