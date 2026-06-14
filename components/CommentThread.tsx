import { formatDistanceToNow } from 'date-fns';
import { Bug, Lightbulb, MessageSquare } from 'lucide-react';

type CommentThreadProps = {
  comments: {
    id: string;
    body: string;
    type: 'GENERAL' | 'FEATURE_REQUEST' | 'BUG_REPORT';
    createdAt: Date;
  }[];
};

const channelStyles = {
  GENERAL: { label: 'Discussion', icon: MessageSquare, className: 'text-cyan-200' },
  FEATURE_REQUEST: { label: 'Feature Request', icon: Lightbulb, className: 'text-[#ff007a]' },
  BUG_REPORT: { label: 'Bug Report', icon: Bug, className: 'text-amber-200' },
};

export function CommentThread({ comments }: CommentThreadProps) {
  return (
    <div className="neon-panel rounded-lg p-5">
      <h2 className="mb-5 text-xl font-semibold">Feedback Channels</h2>
      <div className="space-y-3">
        {comments.length > 0 ? comments.map((comment) => {
          const channel = channelStyles[comment.type];
          const Icon = channel.icon;
          return (
            <div key={comment.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className={`flex items-center gap-2 text-sm font-medium ${channel.className}`}>
                  <Icon className="h-4 w-4" />
                  {channel.label}
                </div>
                <span className="text-xs text-zinc-500">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
              </div>
              <p className="text-sm leading-6 text-zinc-300">{comment.body}</p>
            </div>
          );
        }) : (
          <div className="rounded-lg border border-dashed border-white/15 p-8 text-center">
            <p className="font-medium">No feedback yet</p>
            <p className="mt-2 text-sm text-zinc-500">Discussion, bug reports, and feature requests will appear here once reviewers join the launch.</p>
          </div>
        )}
      </div>
    </div>
  );
}
