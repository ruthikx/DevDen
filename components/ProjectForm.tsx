'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createProject } from '@/app/actions/projects';

export function ProjectForm() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const demoUrl = formData.get('demoUrl') as string;
    const repoUrl = formData.get('repoUrl') as string;
    const tags = formData.get('tags') as string;
    const screenshots = formData.get('screenshots') as string;

    const loadingToast = toast.loading('Creating project...');

    const result = await createProject(title, description, demoUrl || null, repoUrl || null, tags, screenshots);

    toast.dismiss(loadingToast);

    if (result.success) {
      toast.success('Project created successfully!');
      router.push('/projects');
    } else {
      toast.error(result.error || 'Failed to create project');
    }

    return result;
  }, null);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Submit Your Project</CardTitle>
        <CardDescription>Share your developer project with the community</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., DevPulse Platform"
              required
              disabled={isPending}
              className="bg-white dark:bg-zinc-900"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your project in detail..."
              required
              disabled={isPending}
              className="min-h-32 resize-none bg-white dark:bg-zinc-900"
            />
          </div>

          {/* Demo URL */}
          <div className="space-y-2">
            <Label htmlFor="demoUrl">Demo URL</Label>
            <Input
              id="demoUrl"
              name="demoUrl"
              type="url"
              placeholder="https://example.com"
              disabled={isPending}
              className="bg-white dark:bg-zinc-900"
            />
          </div>

          {/* Repository URL */}
          <div className="space-y-2">
            <Label htmlFor="repoUrl">Repository URL</Label>
            <Input
              id="repoUrl"
              name="repoUrl"
              type="url"
              placeholder="https://github.com/username/repo"
              disabled={isPending}
              className="bg-white dark:bg-zinc-900"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="e.g., React, TypeScript, Next.js"
              disabled={isPending}
              className="bg-white dark:bg-zinc-900"
            />
          </div>

          {/* Screenshots */}
          <div className="space-y-2">
            <Label htmlFor="screenshots">Screenshot URLs (comma-separated)</Label>
            <Textarea
              id="screenshots"
              name="screenshots"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              disabled={isPending}
              className="min-h-24 resize-none bg-white dark:bg-zinc-900"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isPending} className="w-full bg-violet-600 hover:bg-violet-700">
            {isPending ? 'Creating...' : 'Create Project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
