import Link from 'next/link';
import { Search, Trophy } from 'lucide-react';
import { getTopDevelopers } from '@/app/actions/projects';
import { GradientHeader } from '@/components/gradient-header';
import { LeaderboardCard } from '@/components/LeaderboardCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const metadata = {
  title: 'Leaderboards - DevPulse',
  description: 'Rank developers by project impact and community engagement.',
};

type LeaderboardsPageProps = {
  searchParams: Promise<{
    timeframe?: string;
    q?: string;
  }>;
};

export default async function LeaderboardsPage({ searchParams }: LeaderboardsPageProps) {
  const params = await searchParams;
  const timeframe = params.timeframe || 'all';
  const query = (params.q || '').toLowerCase();
  const result = await getTopDevelopers(50);
  const developers = (result.success ? result.developers : []).filter((developer) =>
    developer.name.toLowerCase().includes(query)
  );

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <GradientHeader
        title="Global Leaderboards"
        subtitle="Pulse Score ranks builders by the practical impact their launches earn: upvotes, discussion, views, and sustained community signal."
      />

      <div className="neon-panel flex flex-col gap-4 rounded-lg p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            ['weekly', 'Weekly'],
            ['monthly', 'Monthly'],
            ['all', 'All Time'],
          ].map(([value, label]) => (
            <Button key={value} asChild size="sm" variant={timeframe === value ? 'default' : 'outline'} className={timeframe === value ? 'bg-[#ff007a] text-white' : 'border-white/15 bg-white/5 text-zinc-200'}>
              <Link href={`/leaderboards?timeframe=${value}`}>{label}</Link>
            </Button>
          ))}
        </div>
        <form className="relative w-full lg:w-80">
          <input type="hidden" name="timeframe" value={timeframe} />
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input name="q" defaultValue={params.q} placeholder="Search developers" className="border-white/10 bg-black/30 pl-9" />
        </form>
      </div>

      <div className="space-y-4">
        {developers.length > 0 ? developers.map((developer, index) => (
          <LeaderboardCard
            key={developer.clerkUserId}
            rank={index + 1}
            name={developer.name}
            image={developer.image}
            pulseScore={developer.pulseScore}
            projectCount={developer.projectCount}
            upvotes={developer.upvotes}
            comments={developer.comments}
            views={developer.views}
          />
        )) : (
          <div className="neon-panel rounded-lg p-10 text-center">
            <Trophy className="mx-auto mb-3 h-8 w-8 text-[#ff007a]" />
            <h2 className="font-semibold">No ranked developers yet</h2>
            <p className="mt-2 text-sm text-zinc-400">Launch projects and collect feedback to light up the board.</p>
          </div>
        )}
      </div>
    </div>
  );
}
