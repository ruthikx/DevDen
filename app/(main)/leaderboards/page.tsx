import Link from 'next/link';
import { Search, Trophy, Award } from 'lucide-react';
import { getTopDevelopers } from '@/app/actions/projects';

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

const PODIUM = [
  { border: 'border-[#00dbe9]/40', accent: 'text-[#00dbe9]', ring: '', size: 'w-24 h-24', order: 'order-2 md:order-1 mt-8' },
  { border: 'border-[#ffb1c3]', accent: 'text-[#ffb1c3]', ring: 'ring-2 ring-[#ffb1c3]/30 md:scale-105 z-10', size: 'w-32 h-32', order: 'order-1 md:order-2' },
  { border: 'border-[#dcb8ff]/40', accent: 'text-[#dcb8ff]', ring: '', size: 'w-24 h-24', order: 'order-3 mt-8' },
];

function formatNum(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default async function LeaderboardsPage({ searchParams }: LeaderboardsPageProps) {
  const params = await searchParams;
  const timeframe = params.timeframe || 'all';
  const query = (params.q || '').toLowerCase();
  const result = await getTopDevelopers(50);
  const developers = (result.success ? result.developers : []).filter((developer) =>
    developer.name.toLowerCase().includes(query)
  );

  const top3 = developers.slice(0, 3);
  const rest = developers.slice(3);
  // Re-order so champion (#1) sits in the middle visually
  const podiumOrder = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#131313] text-[#e5e2e1]">
      <style>{`
        .lb-glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .lb-glass:hover {
          border-color: #ffb1c3;
          box-shadow: 0 0 20px rgba(255,177,195,0.2);
        }
        .lb-neon-glow { text-shadow: 0 0 10px rgba(255,177,195,0.8); }
        .lb-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .lb-scroll::-webkit-scrollbar-thumb { background: rgba(255,177,195,0.2); border-radius: 10px; }
      `}</style>

      {/* Atmospheric background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-[#ffb1c3]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[#00dbe9]/10 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-[1440px] px-6 py-10">
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded border border-[#00dbe9]/20 bg-[#00dbe9]/10 px-3 py-1 text-xs font-medium tracking-wide text-[#00dbe9]">
                  ● LIVE UPDATES
                </span>
              </div>
              <h1 className="lb-neon-glow mb-2 text-3xl font-bold text-[#ffb1c3] md:text-[48px]">
                Global Leaderboard
              </h1>
              <p className="max-w-xl text-[#e5bcc4]">
                Pulse Score ranks builders by the practical impact their launches earn:
                upvotes, discussion, views, and sustained community signal.
              </p>
            </div>

            {/* Timeframe pills */}
            <div className="flex w-fit items-center rounded-full border border-white/10 bg-white/5 p-1.5">
              {[
                ['weekly', 'Weekly'],
                ['monthly', 'Monthly'],
                ['all', 'All-time'],
              ].map(([value, label]) => (
                <Link
                  key={value}
                  href={`/leaderboards?timeframe=${value}`}
                  className={`rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                    timeframe === value
                      ? 'bg-[#ffb1c3]/10 text-[#ffb1c3]'
                      : 'text-[#e5bcc4] hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </header>

        {developers.length === 0 ? (
          <div className="lb-glass rounded-2xl p-10 text-center">
            <Trophy className="mx-auto mb-3 h-8 w-8 text-[#ffb1c3]" />
            <h2 className="font-semibold">No ranked developers yet</h2>
            <p className="mt-2 text-sm text-[#e5bcc4]">
              Launch projects and collect feedback to light up the board.
            </p>
          </div>
        ) : (
          <>
            {/* Podium - top 3 */}
            <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {podiumOrder.map((dev) => {
                const realRank = developers.indexOf(dev) + 1;
                const style = PODIUM[realRank - 1] ?? PODIUM[0];
                return (
                  <div
                    key={dev.clerkUserId}
                    className={`lb-glass relative flex h-full flex-col items-center overflow-hidden rounded-2xl p-8 pt-12 ${style.order} ${style.ring} ${
                      realRank === 1 ? 'border-[#ffb1c3]/40 bg-[#ffb1c3]/5 shadow-[0_0_40px_rgba(255,177,195,0.15)]' : ''
                    }`}
                  >
                    <div className="pointer-events-none absolute left-4 top-4 select-none text-4xl font-bold text-white/10">
                      #{realRank}
                    </div>
                    {realRank === 1 && (
                      <Award className="absolute right-4 top-4 h-8 w-8 text-[#ffb1c3]" />
                    )}
                    <div className={`${style.size} mb-4 rounded-full border-4 ${style.border} p-1`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={dev.image}
                        alt={dev.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <h3 className={`text-xl font-semibold ${realRank === 1 ? 'lb-neon-glow text-[#ffb1c3]' : 'text-white'}`}>
                      {dev.name}
                    </h3>
                    <div className="mb-8 mt-6 flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-widest text-[#e5bcc4]">Projects</p>
                        <p className="font-bold text-white">{dev.projectCount}</p>
                      </div>
                      <div className="h-10 w-px bg-white/10" />
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-widest text-[#e5bcc4]">Pulse</p>
                        <p className={`font-bold ${style.accent}`}>{formatNum(dev.pulseScore)}</p>
                      </div>
                    </div>
                    <Link
                      href={`/leaderboards`}
                      className={`w-full rounded-xl border py-3 text-center font-bold transition-all ${
                        realRank === 1
                          ? 'border-transparent bg-[#ffb1c3] text-[#66002c] hover:shadow-[0_0_25px_#ffb1c3]'
                          : `${style.border} ${style.accent} hover:bg-white/5`
                      }`}
                    >
                      View Profile
                    </Link>
                  </div>
                );
              })}
            </section>

            {/* Full rankings table */}
            <div className="lb-glass overflow-hidden rounded-2xl">
              <div className="flex flex-col justify-between gap-4 border-b border-white/10 bg-white/5 p-6 md:flex-row md:items-center">
                <h2 className="text-xl font-semibold text-white">Full Rankings</h2>
                <form className="relative">
                  <input type="hidden" name="timeframe" value={timeframe} />
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#e5bcc4]" />
                  <input
                    name="q"
                    defaultValue={params.q}
                    placeholder="Search developer..."
                    className="w-full rounded-lg border border-white/10 bg-[#1c1b1b] py-2 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-[#00dbe9] md:w-64"
                  />
                </form>
              </div>

              <div className="lb-scroll overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-[#e5bcc4]">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Rank</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Developer</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Upvotes</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Comments</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Views</th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {rest.map((dev, i) => (
                      <tr key={dev.clerkUserId} className="group transition-colors hover:bg-white/5">
                        <td className="px-6 py-5 text-sm text-[#e5bcc4]">
                          #{String(i + 4).padStart(2, '0')}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded border border-white/10 bg-white/10">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={dev.image} alt={dev.name} className="h-full w-full object-cover" />
                            </div>
                            <p className="font-bold text-white transition-colors group-hover:text-[#ffb1c3]">
                              {dev.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-white">{formatNum(dev.upvotes)}</td>
                        <td className="px-6 py-5 text-white">{formatNum(dev.comments)}</td>
                        <td className="px-6 py-5 text-white">{formatNum(dev.views)}</td>
                        <td className="px-6 py-5 text-right font-bold text-[#ffb1c3]">
                          {formatNum(dev.pulseScore)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
