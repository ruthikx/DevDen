import { getProjectBySlug } from '@/app/actions/projects';
import { ProjectDetailClient } from '@/components/ProjectDetailClient';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

type ProjectDetailData = {
  id: string;
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
  comments: {
    id: string;
    body: string;
    type: 'GENERAL' | 'FEATURE_REQUEST' | 'BUG_REPORT';
    createdAt: Date;
  }[];
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

  const project = result.project as unknown as ProjectDetailData & {
    votes: { clerkUserId: string; value: number }[];
  };
  const { userId } = await auth();

  // Check if the current user has upvoted
  const hasVoted = project.votes ? project.votes.some(
    (v) => v.clerkUserId === userId
  ) : false;

  return (
    <ProjectDetailClient project={project} initialHasVoted={hasVoted} />
  );
}
