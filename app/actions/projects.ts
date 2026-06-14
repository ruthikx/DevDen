'use server';

import prisma from '@/lib/prisma';
import { syncCurrentUser } from '@/lib/sync-user';
import { generateSlug } from '@/lib/slug-helper';
import { revalidatePath } from 'next/cache';
import { calculatePulseScore } from '@/lib/pulse-score';

function parseList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function projectPulseScore(project: {
  votes?: unknown[];
  comments?: unknown[];
  views?: number | null;
}) {
  return calculatePulseScore({
    upvotes: project.votes?.length || 0,
    comments: project.comments?.length || 0,
    views: project.views || 0,
  });
}

export async function createProject(
  title: string,
  description: string,
  demoUrl: string | null,
  repoUrl: string | null,
  tagsString: string,
  screenshotUrls: string,
  tagline: string = '',
  version: string = '',
  languagesString: string = '',
  frameworksString: string = ''
) {
  try {
    const user = await syncCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Validate inputs
    if (!title.trim() || !description.trim()) {
      throw new Error('Title and description are required');
    }

    // Validate URLs
    if (demoUrl) {
      try {
        new URL(demoUrl);
      } catch {
        throw new Error('Invalid demo URL');
      }
    }
    if (repoUrl) {
      try {
        new URL(repoUrl);
      } catch {
        throw new Error('Invalid repository URL');
      }
    }

    // Generate slug
    const slug = generateSlug(title);

    // Check if slug already exists
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (existingProject) {
      throw new Error('A project with this title already exists');
    }

    // Parse tags
    const tags = parseList(tagsString);
    const languages = parseList(languagesString);
    const frameworks = parseList(frameworksString);

    // Parse screenshot URLs
    const screenshots = parseList(screenshotUrls);

    // Create project with tags and screenshots
    const project = await prisma.project.create({
      data: {
        clerkUserId: user.clerkUserId,
        title: title.trim(),
        slug,
        tagline: tagline.trim() || null,
        version: version.trim() || null,
        description: description.trim(),
        demoUrl: demoUrl || null,
        repoUrl: repoUrl || null,
        languages,
        frameworks,
        tags: {
          create: [...new Set([...tags, ...languages, ...frameworks])].map((name) => ({ name })),
        },
        screenshots: {
          create: screenshots.map((url, order) => ({ url, order })),
        },
      },
      include: {
        tags: true,
        screenshots: true,
      },
    });

    revalidatePath('/projects');
    revalidatePath('/leaderboards');

    return { success: true, project };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create project';
    console.error('Error creating project:', error);
    return { success: false, error: message };
  }
}

export async function getProjects(
  filter?: string,
  sortBy: string = 'newest',
  page: number = 1
) {
  try {
    const limit = 12;
    const skip = (page - 1) * limit;

    const filters = parseList(filter || '').filter((item) => item !== 'all');

    // Build filter query
    let where = {};
    if (filters.length > 0) {
      where = {
        OR: [
          { tags: { some: { name: { in: filters, mode: 'insensitive' as const } } } },
          { languages: { hasSome: filters } },
          { frameworks: { hasSome: filters } },
        ],
      };
    }

    // Build sort query
    let orderBy:
      | { createdAt: 'desc' }
      | { views: 'desc' } = { createdAt: 'desc' };
    if (sortBy === 'most-viewed') {
      orderBy = { views: 'desc' as const };
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          tags: true,
          screenshots: true,
          votes: {
            select: { clerkUserId: true },
          },
          comments: {
            select: { id: true },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    // Sort by computed counts when needed.
    if (sortBy === 'trending') {
      projects.sort((a, b) => projectPulseScore(b) - projectPulseScore(a));
    } else if (sortBy === 'most-voted') {
      projects.sort((a, b) => (b.votes?.length || 0) - (a.votes?.length || 0));
    } else if (sortBy === 'most-discussed') {
      projects.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
    }

    const projectsWithCounts = projects.map((project) => ({
      ...project,
      voteCount: project.votes?.length || 0,
      commentCount: project.comments?.length || 0,
      pulseScore: projectPulseScore(project),
      votes: undefined,
      comments: undefined,
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      projects: projectsWithCounts,
      totalPages,
      currentPage: page,
      total,
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return {
      success: false,
      error: 'Failed to fetch projects',
      projects: [],
      totalPages: 0,
      currentPage: 1,
      total: 0,
    };
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const project = await prisma.project.update({
      where: { slug },
      data: { views: { increment: 1 } },
      include: {
        tags: true,
        screenshots: {
          orderBy: { order: 'asc' },
        },
        votes: {
          select: { clerkUserId: true, value: true },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            project: {
              select: { id: true },
            },
          },
        },
        aiAnalysis: true,
      },
    });

    if (!project) {
      return { success: false, error: 'Project not found' };
    }

    const voteCount = project.votes.length;
    const commentCount = project.comments.length;

    return {
      success: true,
      project: {
        ...project,
        voteCount,
        commentCount,
        pulseScore: projectPulseScore(project),
      },
    };
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return { success: false, error: 'Failed to fetch project' };
  }
}

export async function getTopDevelopers(limit: number = 5) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        votes: { select: { id: true } },
        comments: { select: { id: true } },
      },
    });

    const users = await prisma.user.findMany({
      select: {
        clerkUserId: true,
        name: true,
        image: true,
        email: true,
        pulseScore: true,
      },
    });

    const byUser = new Map<string, {
      clerkUserId: string;
      name: string;
      image: string;
      email: string;
      projectCount: number;
      upvotes: number;
      comments: number;
      views: number;
      pulseScore: number;
    }>();

    for (const user of users) {
      byUser.set(user.clerkUserId, {
        clerkUserId: user.clerkUserId,
        name: user.name || user.email.split('@')[0],
        image: user.image,
        email: user.email,
        projectCount: 0,
        upvotes: 0,
        comments: 0,
        views: 0,
        pulseScore: user.pulseScore || 0,
      });
    }

    for (const project of projects) {
      const developer = byUser.get(project.clerkUserId);
      if (!developer) continue;
      developer.projectCount += 1;
      developer.upvotes += project.votes.length;
      developer.comments += project.comments.length;
      developer.views += project.views;
      developer.pulseScore += projectPulseScore(project);
    }

    return {
      success: true,
      developers: Array.from(byUser.values())
        .filter((developer) => developer.projectCount > 0)
        .sort((a, b) => b.pulseScore - a.pulseScore)
        .slice(0, limit),
    };
  } catch (error) {
    console.error('Error fetching top developers:', error);
    return { success: false, developers: [] };
  }
}

export async function getAllTags() {
  try {
    const [tags, projects] = await Promise.all([
      prisma.projectTag.findMany({
      select: { name: true },
      distinct: ['name'],
      }),
      prisma.project.findMany({
        select: { languages: true, frameworks: true },
      }),
    ]);

    const uniqueTags = new Set(tags.map((t) => t.name));
    for (const project of projects) {
      project.languages.forEach((item) => uniqueTags.add(item));
      project.frameworks.forEach((item) => uniqueTags.add(item));
    }

    return { success: true, tags: Array.from(uniqueTags).sort((a, b) => a.localeCompare(b)) };
  } catch (error) {
    console.error('Error fetching tags:', error);
    return { success: false, error: 'Failed to fetch tags', tags: [] };
  }
}
