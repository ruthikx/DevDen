import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { TagPill } from '@/components/TagPill';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: { id: string; name: string }[];
  voteCount: number;
  commentCount: number;
  createdAt: Date;
}

export function ProjectCard({
  slug,
  title,
  description,
  tags,
  voteCount,
  commentCount,
  createdAt,
}: ProjectCardProps) {
  const descriptionExcerpt = description.length > 150 ? `${description.slice(0, 150)}...` : description;
  const visibleTags = tags.slice(0, 3);

  return (
    <Link href={`/projects/${slug}`}>
      <Card className="transition-all duration-200 hover:scale-[1.01] hover:shadow-lg">
        <CardHeader>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <CardDescription className="line-clamp-2">{descriptionExcerpt}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tags */}
          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {visibleTags.map((tag) => (
                <TagPill key={tag.id} name={tag.name} />
              ))}
            </div>
          )}

          {/* Date */}
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>

          {/* Vote and Comment Counts */}
          <div className="flex gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              <span className="text-sm text-zinc-600 dark:text-zinc-300">{voteCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              <span className="text-sm text-zinc-600 dark:text-zinc-300">{commentCount}</span>
            </div>
            <div className="ml-auto">
              <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700 dark:text-violet-400">
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
