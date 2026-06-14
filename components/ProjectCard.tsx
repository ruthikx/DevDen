import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, MessageSquare, ThumbsUp, Zap } from 'lucide-react';
import Link from 'next/link';
import { TagPill } from '@/components/TagPill';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar';

interface ProjectCardProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  tagline?: string | null;
  tags: { id: string; name: string }[];
  voteCount: number;
  commentCount: number;
  views?: number;
  pulseScore?: number;
  createdAt: Date;
  screenshotUrl?: string | null;
}

export function ProjectCard({
  slug,
  title,
  description,
  tagline,
  tags,
  voteCount,
  commentCount,
  views = 0,
  pulseScore,
  createdAt,
  screenshotUrl,
}: ProjectCardProps) {
  const descriptionExcerpt = description.length > 150 ? `${description.slice(0, 150)}...` : description;
  const visibleTags = tags.slice(0, 3);
  const score = pulseScore ?? Math.min(99, voteCount * 8 + commentCount * 5 + visibleTags.length * 3 + 42);

  return (
    <Link href={`/projects/${slug}`} className="block h-full">
      <Card className="neon-panel h-full rounded-lg py-0 transition-all duration-200 hover:-translate-y-1 hover:border-[#ff007a]/40 hover:shadow-[0_0_34px_rgba(255,0,122,0.16)]">
        <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10 bg-black/30">
          {screenshotUrl ? (
            <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${screenshotUrl})` }} />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(255,0,122,0.22),rgba(0,229,255,0.1))]">
              <Zap className="h-10 w-10 text-white/80" />
            </div>
          )}
          <div className="absolute right-3 top-3 rounded-md border border-cyan-300/30 bg-black/65 px-2.5 py-1 text-xs font-semibold text-cyan-100 backdrop-blur">
            {score} Pulse
          </div>
        </div>
        <CardHeader className="px-5 pt-5">
          <CardTitle className="line-clamp-2 text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="line-clamp-2 leading-6 text-zinc-400">{tagline || descriptionExcerpt}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-5">
          {/* Tags */}
          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {visibleTags.map((tag) => (
                <TagPill key={tag.id} name={tag.name} />
              ))}
            </div>
          )}

          {/* Date */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-zinc-500">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
            <AvatarGroup>
              {['DP', 'AI'].map((initials) => (
                <Avatar key={initials} size="sm">
                  <AvatarFallback className="bg-white/10 text-[10px] text-cyan-100">{initials}</AvatarFallback>
                </Avatar>
              ))}
              <AvatarGroupCount className="size-6 bg-[#ff007a]/15 text-[10px] text-pink-100">+{Math.max(1, voteCount)}</AvatarGroupCount>
            </AvatarGroup>
          </div>

          {/* Vote and Comment Counts */}
          <div className="flex gap-4 border-t border-white/10 pt-4">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-[#ff007a]" />
              <span className="text-sm text-zinc-300">{voteCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-cyan-300" />
              <span className="text-sm text-zinc-300">{commentCount}</span>
            </div>
            <div className="ml-auto flex items-center gap-2 text-sm text-cyan-200">
              <Eye className="h-4 w-4" />
              <span>{views}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
