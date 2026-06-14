import { getProjectBySlug } from '@/app/actions/projects';
import { CommentThread } from '@/components/CommentThread';
import { ProjectDetail } from '@/components/ProjectDetail';
import { TechStackHUD } from '@/components/TechStackHUD';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type ProjectDetailData = {
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
  languages: string[];
  frameworks: string[];
  screenshots: { id: string; url: string }[];
  comments: { id: string; body: string; type: 'GENERAL' | 'FEATURE_REQUEST' | 'BUG_REPORT'; createdAt: Date }[];
  aiAnalysis?: {
    sentiment: string;
    topIssues: string[];
    featureRequests: string[];
    summary: string;
  } | null;
};

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);

  if (!result.success || !result.project) {
    notFound();
  }

  const project = result.project as ProjectDetailData;

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <Button asChild variant="ghost" className="text-zinc-300 hover:bg-white/5 hover:text-white">
        <Link href="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trending
        </Link>
      </Button>

      <ProjectDetail project={project} />

      <section className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <CommentThread comments={project.comments} />

        <div className="space-y-6">
          <TechStackHUD tags={project.tags} languages={project.languages} frameworks={project.frameworks} />

          <div className="neon-panel rounded-lg p-5">
            <h2 className="mb-4 font-semibold">AI Analysis</h2>
            {project.aiAnalysis ? (
              <div className="space-y-4 text-sm text-zinc-300">
                <p>{project.aiAnalysis.summary}</p>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.22em] text-cyan-300">Top Issues</p>
                  <ul className="space-y-2">
                    {project.aiAnalysis.topIssues.map((issue) => (
                      <li key={issue} className="rounded-md bg-white/5 px-3 py-2">{issue}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-6 text-zinc-500">AI sentiment, issue clustering, and feature-request summaries will activate as community feedback accumulates.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
