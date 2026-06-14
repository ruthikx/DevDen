import { Medal, Rocket, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type LeaderboardCardProps = {
  rank: number;
  name: string;
  image: string;
  pulseScore: number;
  projectCount: number;
  upvotes: number;
  comments: number;
  views: number;
};

export function LeaderboardCard({
  rank,
  name,
  image,
  pulseScore,
  projectCount,
  upvotes,
  comments,
  views,
}: LeaderboardCardProps) {
  return (
    <div className="neon-panel rounded-lg p-5 transition hover:border-[#ff007a]/40 hover:shadow-[0_0_34px_rgba(255,0,122,0.14)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#ff007a]/35 bg-[#ff007a]/10 text-lg font-bold text-pink-100">
            {rank}
          </div>
          <Avatar size="lg">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-white">{name}</h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
              <Rocket className="h-4 w-4 text-cyan-300" />
              {projectCount} launched projects
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-3 text-center">
            <Medal className="mx-auto mb-1 h-4 w-4 text-cyan-200" />
            <p className="text-lg font-bold text-cyan-100">{pulseScore}</p>
            <p className="text-[11px] text-zinc-500">Pulse</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-center">
            <p className="text-lg font-bold">{upvotes}</p>
            <p className="text-[11px] text-zinc-500">Upvotes</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-center">
            <p className="text-lg font-bold">{comments}</p>
            <p className="text-[11px] text-zinc-500">Comments</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-center">
            <Users className="mx-auto mb-1 h-4 w-4 text-[#ff007a]" />
            <p className="text-lg font-bold">{views}</p>
            <p className="text-[11px] text-zinc-500">Views</p>
          </div>
        </div>
      </div>
    </div>
  );
}
