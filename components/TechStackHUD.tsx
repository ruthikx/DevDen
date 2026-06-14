import { Code2, Cpu } from 'lucide-react';
import { TagPill } from '@/components/TagPill';

type TechStackHUDProps = {
  tags: { id: string; name: string }[];
  languages?: string[];
  frameworks?: string[];
};

export function TechStackHUD({ tags, languages = [], frameworks = [] }: TechStackHUDProps) {
  const stack = [
    ...languages.map((name) => ({ name, type: 'Language' })),
    ...frameworks.map((name) => ({ name, type: 'Framework' })),
  ];

  return (
    <div className="neon-panel rounded-lg p-5">
      <h2 className="mb-4 flex items-center gap-2 font-semibold">
        <Cpu className="h-5 w-5 text-cyan-300" />
        Technical Stack HUD
      </h2>
      {stack.length > 0 ? (
        <div className="grid gap-3">
          {stack.map((item, index) => (
            <div key={`${item.type}-${item.name}`} className="rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-zinc-400">{item.type}</span>
                <span className="text-cyan-200">{Math.max(52, 92 - index * 8)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-[#ff007a]" />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      ) : tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => <TagPill key={tag.id} name={tag.name} />)}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">No stack tags submitted yet.</p>
      )}
    </div>
  );
}
