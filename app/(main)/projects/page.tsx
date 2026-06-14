import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/ProjectCard';
import { GradientHeader } from '@/components/gradient-header';
import { getProjects, getAllTags } from '@/app/actions/projects';
import { ArrowRight, Flame, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { TopDevsSidebar } from '@/components/TopDevsSidebar';

export const metadata = {
  title: 'Discover Projects - DevPulse',
  description: 'Discover amazing developer projects',
};

interface ProjectsPageProps {
  searchParams: Promise<{
    tag?: string;
    sort?: string;
    page?: string;
  }>;
}

type ProjectSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  tagline?: string | null;
  tags: { id: string; name: string }[];
  screenshots?: { url: string }[];
  voteCount: number;
  commentCount: number;
  views: number;
  pulseScore: number;
  createdAt: Date;
};

async function ProjectsGrid({ tag, sort, page }: { tag?: string; sort?: string; page?: string }) {
  const pageNum = page ? parseInt(page) : 1;
  const sortBy = sort || 'newest';

  const result = await getProjects(tag || 'all', sortBy, pageNum);

  if (!result.success || result.projects.length === 0) {
    return (
      <div className="neon-panel rounded-lg px-6 py-12 text-center">
        <h3 className="mb-2 text-lg font-semibold text-white">No projects found</h3>
        <p className="mb-4 text-zinc-400">Be the first to initialize a project on DevPulse.</p>
        <Button asChild className="bg-[#ff007a] text-white hover:bg-[#e6006e]">
          <Link href="/projects/new">
            Submit Your Project <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(result.projects as ProjectSummary[]).map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            slug={project.slug}
            title={project.title}
            description={project.description}
            tagline={project.tagline}
            tags={project.tags}
            voteCount={project.voteCount}
            commentCount={project.commentCount}
            views={project.views}
            pulseScore={project.pulseScore}
            createdAt={project.createdAt}
            screenshotUrl={project.screenshots?.[0]?.url}
          />
        ))}
      </div>

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {pageNum > 1 && (
            <Button asChild variant="outline" className="border-white/15 bg-white/5">
              <Link href={`/projects?tag=${tag || 'all'}&sort=${sortBy}&page=${pageNum - 1}`}>Previous</Link>
            </Button>
          )}
          <div className="flex items-center gap-2 px-4 py-2">
            Page {pageNum} of {result.totalPages}
          </div>
          {pageNum < result.totalPages && (
            <Button asChild variant="outline" className="border-white/15 bg-white/5">
              <Link href={`/projects?tag=${tag || 'all'}&sort=${sortBy}&page=${pageNum + 1}`}>Next</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

async function TagsFilter({ currentTag }: { currentTag?: string }) {
  const tagsResult = await getAllTags();
  const tags = tagsResult.success ? tagsResult.tags : [];

  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/projects?tag=all&sort=newest&page=1">
        <Button variant={!currentTag || currentTag === 'all' ? 'default' : 'outline'} size="sm" className={!currentTag || currentTag === 'all' ? 'bg-[#ff007a] text-white' : 'border-white/15 bg-white/5 text-zinc-200'}>
          All Projects
        </Button>
      </Link>
      {tags.map((tag) => (
        <Link key={tag} href={`/projects?tag=${tag}&sort=newest&page=1`}>
          <Button variant={currentTag === tag ? 'default' : 'outline'} size="sm" className={currentTag === tag ? 'bg-[#ff007a] text-white' : 'border-white/15 bg-white/5 text-zinc-200'}>
            {tag}
          </Button>
        </Link>
      ))}
    </div>
  );
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const { tag, sort, page } = params;

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <GradientHeader
        title="Trending Feed"
        subtitle="Discover high-impact launches, inspect their technical stack, and give useful feedback before they climb the global Pulse rankings."
      >
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-black/20 p-3">
            <Flame className="mb-2 h-4 w-4 text-[#ff007a]" />
            <p className="text-sm font-semibold">Dynamic Discovery</p>
            <p className="mt-1 text-xs text-zinc-400">Fresh launches with score momentum.</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-3">
            <Users className="mb-2 h-4 w-4 text-cyan-300" />
            <p className="text-sm font-semibold">Reviewer Signals</p>
            <p className="mt-1 text-xs text-zinc-400">Votes and feedback at a glance.</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-3">
            <Trophy className="mb-2 h-4 w-4 text-[#ff007a]" />
            <p className="text-sm font-semibold">Pulse Score</p>
            <p className="mt-1 text-xs text-zinc-400">Ranking fuel for standout craft.</p>
          </div>
        </div>
      </GradientHeader>

      {/* Filter Section */}
      <div className="neon-panel space-y-4 rounded-lg p-6">
        <div>
          <h3 className="mb-3 font-semibold text-white">Filter by Stack</h3>
          <TagsFilter currentTag={tag} />
        </div>

        <div className="border-t border-white/10 pt-4">
          <h3 className="mb-3 font-semibold text-white">Sort by</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'newest', label: 'Newest' },
              { value: 'trending', label: 'Trending' },
              { value: 'most-voted', label: 'Most Voted' },
              { value: 'most-discussed', label: 'Most Discussed' },
              { value: 'most-viewed', label: 'Most Viewed' },
            ].map(({ value, label }) => (
              <Link key={value} href={`/projects?tag=${tag || 'all'}&sort=${value}&page=1`}>
                <Button variant={sort === value ? 'default' : 'outline'} size="sm" className={sort === value ? 'bg-[#ff007a] text-white' : 'border-white/15 bg-white/5 text-zinc-200'}>
                  {label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Projects Grid */}
        <Suspense fallback={<div className="text-center text-zinc-400">Loading projects...</div>}>
          <ProjectsGrid tag={tag} sort={sort} page={page} />
        </Suspense>
        <Suspense fallback={<div className="neon-panel rounded-lg p-5 text-sm text-zinc-400">Loading top devs...</div>}>
          <TopDevsSidebar />
        </Suspense>
      </div>
    </div>
  );
}
