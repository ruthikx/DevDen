import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, GitBranch, MessageSquare, ShieldCheck, ThumbsUp, Zap, Eye } from 'lucide-react';
import { TagPill } from '@/components/TagPill';
import { Button } from '@/components/ui/button';

type ProjectDetailProps = {
  project: {
    title: string;
    tagline?: string | null;
    version?: string | null;
    description: string;
    demoUrl: string | null;
    repoUrl: string | null;
    createdAt: Date;
    views: number;
    voteCount: number;
    commentCount: number;
    pulseScore: number;
    tags: { id: string; name: string }[];
    screenshots: { id: string; url: string }[];
  };
};

export function ProjectDetail({ project }: ProjectDetailProps) {
  const primaryScreenshot = project.screenshots[0]?.url;

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="neon-panel overflow-hidden rounded-lg">
        <div className="relative aspect-[16/8] border-b border-white/10 bg-black/30">
          {primaryScreenshot ? (
            <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${primaryScreenshot})` }} />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(255,0,122,0.22),rgba(0,229,255,0.1))]">
              <Zap className="h-14 w-14 text-white/80" />
            </div>
          )}
          <div className="absolute left-5 top-5 rounded-md border border-[#ff007a]/35 bg-black/65 px-3 py-1 text-xs font-semibold text-pink-100 backdrop-blur">
            Project Intelligence
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                {project.version && <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">{project.version}</span>}
                {project.tagline && <span className="rounded-md border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 text-xs text-cyan-100">{project.tagline}</span>}
              </div>
              <h1 className="neon-text text-4xl font-bold tracking-tight">{project.title}</h1>
              <p className="mt-3 max-w-3xl leading-7 text-zinc-300">{project.description}</p>
            </div>
            <div className="rounded-lg border border-cyan-300/25 bg-cyan-300/10 p-4 text-center">
              <p className="text-3xl font-bold text-cyan-100">{project.pulseScore}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Pulse Score</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <TagPill key={tag.id} name={tag.name} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.demoUrl && (
              <Button asChild className="bg-[#ff007a] text-white hover:bg-[#e6006e]">
                <Link href={project.demoUrl} target="_blank" rel="noreferrer">
                  Live Demo <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            {project.repoUrl && (
              <Button asChild variant="outline" className="border-white/15 bg-white/5 text-zinc-100">
                <Link href={project.repoUrl} target="_blank" rel="noreferrer">
                  Repository <GitBranch className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="neon-panel rounded-lg p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-5 w-5 text-cyan-300" />
            Social Proof
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <ThumbsUp className="mb-2 h-4 w-4 text-[#ff007a]" />
              <p className="text-2xl font-bold">{project.voteCount}</p>
              <p className="text-xs text-zinc-500">Upvotes</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <MessageSquare className="mb-2 h-4 w-4 text-cyan-300" />
              <p className="text-2xl font-bold">{project.commentCount}</p>
              <p className="text-xs text-zinc-500">Feedback</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <Eye className="mb-2 h-4 w-4 text-cyan-300" />
              <p className="text-2xl font-bold">{project.views}</p>
              <p className="text-xs text-zinc-500">Views</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Initialized {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
          </p>
        </div>
      </aside>
    </section>
  );
}
