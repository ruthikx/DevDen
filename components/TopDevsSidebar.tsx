import Link from 'next/link';
import { Trophy, Users } from 'lucide-react';
import { getTopDevelopers } from '@/app/actions/projects';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export async function TopDevsSidebar() {
  const result = await getTopDevelopers(5);
  const developers = result.success ? result.developers : [];

  return (
    <aside className="neon-panel rounded-lg p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Global Signal</p>
          <h2 className="mt-1 flex items-center gap-2 font-semibold">
            <Trophy className="h-5 w-5 text-[#ff007a]" />
            Top Devs
          </h2>
        </div>
        <Button asChild variant="ghost" size="sm" className="text-cyan-200 hover:bg-cyan-300/10 hover:text-cyan-100">
          <Link href="/leaderboards">All</Link>
        </Button>
      </div>

      <div className="space-y-3">
        {developers.length > 0 ? developers.map((developer, index) => (
          <div key={developer.clerkUserId} className="rounded-lg border border-white/10 bg-black/20 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#ff007a]/30 bg-[#ff007a]/10 text-xs font-semibold text-pink-100">
                {index + 1}
              </div>
              <Avatar>
                <AvatarImage src={developer.image} alt={developer.name} />
                <AvatarFallback>{developer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{developer.name}</p>
                <p className="text-xs text-zinc-500">{developer.projectCount} launches</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-cyan-200">{developer.pulseScore}</p>
                <p className="text-[11px] text-zinc-500">Pulse</p>
              </div>
            </div>
          </div>
        )) : (
          <div className="rounded-lg border border-dashed border-white/15 p-5 text-center">
            <Users className="mx-auto mb-2 h-5 w-5 text-cyan-300" />
            <p className="text-sm text-zinc-400">Launches will rank developers here.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
