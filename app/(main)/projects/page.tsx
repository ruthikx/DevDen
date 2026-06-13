import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/ProjectCard';
import { GradientHeader } from '@/components/gradient-header';
import { getProjects, getAllTags } from '@/app/actions/projects';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

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

async function ProjectsGrid({ tag, sort, page }: { tag?: string; sort?: string; page?: string }) {
  const pageNum = page ? parseInt(page) : 1;
  const sortBy = sort || 'newest';

  const result = await getProjects(tag || 'all', sortBy, pageNum);

  if (!result.success || result.projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
        <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">No projects found</h3>
        <p className="mb-4 text-zinc-600 dark:text-zinc-400">Be the first to submit your project to DevPulse!</p>
        <Button asChild className="bg-violet-600 hover:bg-violet-700">
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
        {result.projects.map((project: any) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            slug={project.slug}
            title={project.title}
            description={project.description}
            tags={project.tags}
            voteCount={project.voteCount}
            commentCount={project.commentCount}
            createdAt={project.createdAt}
          />
        ))}
      </div>

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {pageNum > 1 && (
            <Button asChild variant="outline">
              <Link href={`/projects?tag=${tag || 'all'}&sort=${sortBy}&page=${pageNum - 1}`}>Previous</Link>
            </Button>
          )}
          <div className="flex items-center gap-2 px-4 py-2">
            Page {pageNum} of {result.totalPages}
          </div>
          {pageNum < result.totalPages && (
            <Button asChild variant="outline">
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
        <Button variant={!currentTag || currentTag === 'all' ? 'default' : 'outline'} size="sm">
          All Projects
        </Button>
      </Link>
      {tags.map((tag) => (
        <Link key={tag} href={`/projects?tag=${tag}&sort=newest&page=1`}>
          <Button variant={currentTag === tag ? 'default' : 'outline'} size="sm">
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
    <div className="space-y-8">
      <GradientHeader
        title="Discover Projects"
        subtitle="Explore amazing developer projects and discover what others are building"
      />

      {/* Filter Section */}
      <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <h3 className="mb-3 font-semibold text-zinc-900 dark:text-white">Filter by Tag</h3>
          <TagsFilter currentTag={tag} />
        </div>

        <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <h3 className="mb-3 font-semibold text-zinc-900 dark:text-white">Sort by</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'newest', label: 'Newest' },
              { value: 'trending', label: 'Trending' },
              { value: 'most-voted', label: 'Most Voted' },
            ].map(({ value, label }) => (
              <Link key={value} href={`/projects?tag=${tag || 'all'}&sort=${value}&page=1`}>
                <Button variant={sort === value ? 'default' : 'outline'} size="sm">
                  {label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <Suspense fallback={<div className="text-center text-zinc-600 dark:text-zinc-400">Loading projects...</div>}>
        <ProjectsGrid tag={tag} sort={sort} page={page} />
      </Suspense>
    </div>
  );
}
