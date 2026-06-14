import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Code2,
  Eye,
  Flame,
  MessageSquare,
  Search,
  Sparkles,
  Terminal,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { getProjects, getTopDevelopers } from "@/app/actions/projects";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC_w42S8VP7ToVf1XQIVnK0-IdrZmxoTWnbGEKIiOO2tgmgvUSgxR_02a5pbrA40pTuB8-qO95KfvkiPEcXnaPJtldi_QoJJzpANx1EcXY_p9xPHfxL6YtXdAlrTYzB98thrduBVU3Vtkbz1rE1N34aigsbje9AezgbhGEm_k4rXWQ2JIJR-elFd1xOcNB98dakooND285yqMHUCnY22o1zDbd1RBF9WPm3Hw31jyUOPqJb1audKdgkksYmwqGNG26lN3rL7Y5WaCTT";

const sideNav = [
  ["Feed", Flame],
  ["Repositories", Terminal],
  ["Following", Users],
  ["Insights", Sparkles],
];

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
  return String(n);
}

function ProjectCard({
  project,
  glow,
}: {
  project: {
    title: string;
    description: string;
    tags: { name: string }[];
    voteCount: number;
    commentCount: number;
    views: number;
    version?: string | null;
    slug: string;
    screenshots?: { url: string }[];
  };
  glow: "primary" | "secondary";
}) {
  const glowClass =
    glow === "secondary" ? "neon-glow-secondary" : "neon-glow-primary";
  const imageUrl = project.screenshots?.[0]?.url;

  return (
    <Link href={`/projects/${project.slug}`}>
      <article className={`glass-panel ${glowClass} rounded-lg p-4 transition-all duration-300`}>
        <div
          className="relative mb-4 h-48 overflow-hidden rounded-lg bg-cover bg-center"
          role="img"
          aria-label={`${project.title} preview`}
          style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {project.version && (
            <div className="absolute right-2 top-2 rounded-full border border-white/10 bg-[#050505]/70 px-3 py-1 font-mono text-xs text-[#00dbe9] backdrop-blur-md">
              {project.version}
            </div>
          )}
        </div>
        <h3 className="text-2xl font-semibold tracking-wide text-[#e5e2e1]">{project.title}</h3>
        <p className="mt-2 min-h-16 text-sm leading-6 text-[#e5bcc4]">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag, index) => (
            <span
              key={tag.name}
              className={`rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${
                index === 0
                  ? "border-[#00eefc]/30 bg-[#00eefc]/10 text-[#00dbe9]"
                  : "border-[#ff4b89]/30 bg-[#ff4b89]/10 text-[#ffb1c3]"
              }`}
            >
              {tag.name}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-sm text-[#e5bcc4]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-mono text-[#e5e2e1]">
              <ChevronUp className="h-4 w-4 text-[#ffb1c3]" />
              {formatCount(project.voteCount)}
            </span>
            <ChevronDown className="h-4 w-4 text-[#e5bcc4]" />
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {formatCount(project.commentCount)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {formatCount(project.views)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

const devColors = [
  { color: "text-[#ffb1c3]", border: "border-[#ffb1c3]/50" },
  { color: "text-[#00dbe9]", border: "border-[#00dbe9]/50" },
  { color: "text-zinc-300", border: "border-white/20" },
];

export default async function HomePage() {
  const [projectsResult, devsResult] = await Promise.all([
    getProjects(undefined, "trending", 1),
    getTopDevelopers(3),
  ]);

  const projects = (projectsResult.projects || []).slice(0, 3);
  const developers = devsResult.developers || [];

  const featured = projects[0];
  const featured2 = projects[1];
  const featuredWide = projects[2];

  const totalProjects = projectsResult.total ?? 0;

  return (
    <div className="min-h-screen overflow-hidden bg-[#050505] pb-10 text-[#e5e2e1]">
      <div className="absolute inset-x-0 top-16 h-[34rem] bg-[radial-gradient(circle_at_16%_14%,rgba(255,177,195,0.18),transparent_28rem),radial-gradient(circle_at_86%_16%,rgba(0,219,233,0.16),transparent_26rem)]" />

      <div className="relative mx-auto grid w-full max-w-[1440px] gap-8 px-4 py-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-8">
        <aside className="hidden lg:block">
          <div className="glass-panel sticky top-24 rounded-lg p-4">
            <div className="mb-6 rounded-lg border border-white/10 bg-white/[0.04] p-3">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#ffb1c3]">
                DevMode
              </p>
              <p className="mt-1 text-xs text-[#e5bcc4]">Level 42 Architect</p>
            </div>
            <nav className="space-y-2">
              {sideNav.map(([label, Icon], index) => (
                <Link
                  key={label as string}
                  href={index === 1 ? "/projects" : "#trending"}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-xs font-bold uppercase tracking-[0.15em] transition-all ${
                    index === 0
                      ? "border-r-4 border-[#ffb1c3] bg-[#ff4b89]/15 text-[#ffb1c3]"
                      : "text-[#e5bcc4] hover:bg-white/[0.05] hover:text-[#00dbe9]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label as string}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0">
          <section className="relative mb-12 min-h-[500px] overflow-hidden rounded-lg border border-white/10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              role="img"
              aria-label="Futuristic neon developer showcase"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30" />

            <div className="relative z-10 flex min-h-[500px] flex-col justify-center px-5 py-12 sm:px-10 lg:max-w-2xl lg:px-12">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#00dbe9]">
                Marketplace for
              </p>
              <h1 className="text-glow-primary text-5xl font-extrabold uppercase leading-none tracking-[0.05em] text-[#ffb1c3] sm:text-6xl">
                Creators
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#e5bcc4] sm:text-lg">
                The pulse of open source innovation. Discover projects, connect with builders, and push the boundaries of digital creation.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-[#ffb1c3] px-7 text-[#66002c] shadow-[0_0_20px_rgba(255,177,195,0.35)] hover:bg-[#ffd9e0]">
                  <Link href="/projects">
                    Explore <Zap className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 px-7 text-[#e5e2e1] backdrop-blur-md hover:bg-white/10">
                  <Link href="/projects/new">
                    Create Project <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="absolute right-6 top-10 z-10 hidden space-y-4 xl:block">
              {["100% Authenticity", "50000+ Creators", `5k+ Projects Stored`].map((badge, index) => (
                <div
                  key={badge}
                  className={`glass-panel rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#e5e2e1] ${
                    index === 1 ? "-translate-x-10" : ""
                  }`}
                >
                  {badge}
                </div>
              ))}
            </div>
          </section>

          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#00dbe9]">
                <Code2 className="h-4 w-4" />
                Live Feed
              </p>
              <h2 id="trending" className="mt-2 text-3xl font-semibold tracking-wide">
                Trending Now
              </h2>
            </div>
            <div className="glass-panel flex h-11 items-center gap-2 rounded-full px-4 text-[#e5bcc4] md:w-72">
              <Search className="h-4 w-4" />
              <span className="text-sm">Search projects...</span>
            </div>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="grid gap-6 md:grid-cols-2">
                  {featured && (
                    <ProjectCard project={featured} glow="primary" />
                  )}
                  {featured2 && (
                    <ProjectCard project={featured2} glow="secondary" />
                  )}
                </div>

                {featuredWide && (
                  <article className="glass-panel neon-glow-primary flex flex-col gap-6 rounded-lg p-4 transition-all duration-300 md:flex-row">
                    <div
                      className="h-56 rounded-lg bg-cover bg-center md:h-auto md:w-1/3"
                      role="img"
                      aria-label={`${featuredWide.title} preview`}
                      style={featuredWide.screenshots?.[0]?.url ? { backgroundImage: `url(${featuredWide.screenshots[0].url})` } : undefined}
                    />
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-semibold tracking-wide">{featuredWide.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[#e5bcc4]">{featuredWide.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {featuredWide.tags.map((tag) => (
                            <span key={tag.name} className="rounded border border-[#ff4b89]/30 bg-[#ff4b89]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#ffb1c3]">
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-6">
                        <Button asChild className="border border-[#ffb1c3]/20 bg-[#ffb1c3]/10 text-[#ffb1c3] hover:bg-[#ffb1c3] hover:text-[#66002c]">
                          <Link href={`/projects/${featuredWide.slug}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                )}
              </div>

              <aside className="space-y-6">
                <section className="glass-panel rounded-lg border-[#ffb1c3]/20 p-5">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-2xl font-semibold">
                      <Trophy className="h-5 w-5 text-[#ffb1c3]" />
                      Top Devs
                    </h3>
                    <span className="font-mono text-xs text-[#e5bcc4]">Weekly</span>
                  </div>
                  {developers.length > 0 ? (
                    <div className="space-y-3">
                      {developers.map((dev, index) => {
                        const dc = devColors[index] ?? devColors[devColors.length - 1];
                        return (
                          <div key={dev.clerkUserId} className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-white/[0.05]">
                            <div className="flex min-w-0 items-center gap-4">
                              <span className={`font-mono text-xs ${dc.color}`}>
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${dc.border} bg-white/[0.04] text-xs font-bold`}>
                                {dev.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-xs font-bold uppercase tracking-[0.15em] transition-colors group-hover:text-[#ffb1c3]">
                                  {dev.name}
                                </p>
                                <p className="truncate text-[10px] text-[#e5bcc4]">
                                  {dev.projectCount} project{dev.projectCount > 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-mono text-xs ${dc.color}`}>{formatCount(dev.pulseScore)}</p>
                              <p className="text-[9px] uppercase tracking-[0.15em] text-[#e5bcc4]">
                                Reputation
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-[#e5bcc4]">No developers yet.</p>
                  )}
                  <Button asChild variant="outline" className="mt-6 w-full border-white/10 bg-transparent text-[#e5bcc4] hover:border-[#ffb1c3]/50 hover:text-[#ffb1c3]">
                    <Link href="/leaderboards">Full Leaderboard</Link>
                  </Button>
                </section>

                <section className="glass-panel relative overflow-hidden rounded-lg p-6 text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(181,110,255,0.22),transparent_14rem)]" />
                  <div className="relative">
                    <h4 className="text-3xl font-bold text-[#ffb1c3]">{formatCount(totalProjects)}</h4>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e5bcc4]">
                      Projects Stored
                    </p>
                    <div className="mt-5 flex justify-center -space-x-2">
                      {developers.slice(0, 3).map((dev) => (
                        <div key={dev.clerkUserId} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#050505] bg-[#353534] text-[10px] font-bold text-[#e5e2e1]">
                          {dev.name.slice(0, 2).toUpperCase()}
                        </div>
                      ))}
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#050505] bg-[#ffb1c3] text-[10px] font-bold text-[#66002c]">
                        +{formatCount(Math.max(0, developers.length - 3))}
                      </div>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 py-20">
              <Code2 className="mb-4 h-12 w-12 text-[#e5bcc4]" />
              <h3 className="text-xl font-semibold text-[#e5e2e1]">No projects yet</h3>
              <p className="mt-2 text-sm text-[#e5bcc4]">Be the first to create a project!</p>
              <Button asChild className="mt-6 bg-[#ffb1c3] px-7 text-[#66002c] hover:bg-[#ffd9e0]">
                <Link href="/projects/new">Create Project</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
