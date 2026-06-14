import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { calculatePulseScore } from '@/lib/pulse-score';

export async function GET(_request: NextRequest, context: RouteContext<'/api/projects/[id]'>) {
  const { id } = await context.params;

  const project = await prisma.project.update({
    where: id.startsWith('c') ? { id } : { slug: id },
    data: { views: { increment: 1 } },
    include: {
      tags: true,
      screenshots: { orderBy: { order: 'asc' } },
      votes: { select: { id: true } },
      comments: { orderBy: { createdAt: 'desc' } },
      aiAnalysis: true,
    },
  }).catch(() => null);

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json({
    project: {
      ...project,
      voteCount: project.votes.length,
      commentCount: project.comments.length,
      pulseScore: calculatePulseScore({
        upvotes: project.votes.length,
        comments: project.comments.length,
        views: project.views,
      }),
      votes: undefined,
    },
  });
}
