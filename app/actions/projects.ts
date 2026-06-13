'use server';

import prisma from '@/lib/prisma';
import { syncCurrentUser } from '@/lib/sync-user';
import { generateSlug } from '@/lib/slug-helper';

export async function createProject(
  title: string,
  description: string,
  demoUrl: string | null,
  repoUrl: string | null,
  tagsString: string,
  screenshotUrls: string
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
    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Parse screenshot URLs
    const screenshots = screenshotUrls
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    // Create project with tags and screenshots
    const project = await prisma.project.create({
      data: {
        clerkUserId: user.clerkUserId,
        title: title.trim(),
        slug,
        description: description.trim(),
        demoUrl: demoUrl || null,
        repoUrl: repoUrl || null,
        tags: {
          create: tags.map((name) => ({ name })),
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

    // Build filter query
    let where = {};
    if (filter && filter !== 'all') {
      where = {
        tags: {
          some: {
            name: filter,
          },
        },
      };
    }

    // Build sort query
    let orderBy = { createdAt: 'desc' as const };
    if (sortBy === 'trending') {
      // Trending sort by creation date for now (will optimize later)
      orderBy = { createdAt: 'desc' as const };
    } else if (sortBy === 'most-voted') {
      orderBy = { createdAt: 'desc' as const };
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

    // Sort by vote count if needed
    if (sortBy === 'trending' || sortBy === 'most-voted') {
      projects.sort((a, b) => (b.votes?.length || 0) - (a.votes?.length || 0));
    }

    const projectsWithCounts = projects.map((project) => ({
      ...project,
      voteCount: project.votes?.length || 0,
      commentCount: project.comments?.length || 0,
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
    const project = await prisma.project.findUnique({
      where: { slug },
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
      },
    };
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return { success: false, error: 'Failed to fetch project' };
  }
}

export async function getAllTags() {
  try {
    const tags = await prisma.projectTag.findMany({
      select: { name: true },
      distinct: ['name'],
    });

    return { success: true, tags: tags.map((t) => t.name) };
  } catch (error) {
    console.error('Error fetching tags:', error);
    return { success: false, error: 'Failed to fetch tags', tags: [] };
  }
}
