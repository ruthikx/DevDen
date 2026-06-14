'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@clerk/nextjs';
import { addComment, toggleProjectVote } from '@/app/actions/projects';
import { toast } from 'sonner';

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

type ProjectDetailClientProps = {
  project: ProjectDetailData;
  initialHasVoted: boolean;
};

export function ProjectDetailClient({ project, initialHasVoted }: ProjectDetailClientProps) {
  const router = useRouter();
  const { userId: clerkUserId } = useAuth();
  const [isPending, startTransition] = useTransition();

  // Local state for interactive features
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [voteCount, setVoteCount] = useState(project.voteCount);
  const [commentsFilter, setCommentsFilter] = useState<'ALL' | 'BUG_REPORT' | 'FEATURE_REQUEST'>('ALL');
  
  // Comment posting form state
  const [commentBody, setCommentBody] = useState('');
  const [commentType, setCommentType] = useState<'GENERAL' | 'FEATURE_REQUEST' | 'BUG_REPORT'>('GENERAL');
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Simulated local comment voting state
  const [commentVotes, setCommentVotes] = useState<Record<string, { count: number; voted: boolean }>>(() => {
    const initialVotes: Record<string, { count: number; voted: boolean }> = {};
    project.comments.forEach((c, idx) => {
      // Generate some dummy vote counts for visual richness
      const baseCount = idx === 0 ? 124 : idx === 1 ? 42 : Math.floor(Math.random() * 20) + 5;
      initialVotes[c.id] = { count: baseCount, voted: false };
    });
    return initialVotes;
  });

  const handleProjectVote = async () => {
    if (!clerkUserId) {
      toast.error('Please sign in to upvote projects');
      return;
    }

    // Optimistic UI updates
    const previousVoted = hasVoted;
    setHasVoted(!previousVoted);
    setVoteCount(prev => previousVoted ? prev - 1 : prev + 1);

    startTransition(async () => {
      const result = await toggleProjectVote(project.id);
      if (!result.success) {
        // Revert on error
        setHasVoted(previousVoted);
        setVoteCount(prev => previousVoted ? prev + 1 : prev - 1);
        toast.error(result.error || 'Failed to register vote');
      } else {
        setHasVoted(result.voted);
        toast.success(result.voted ? 'Upvoted project!' : 'Removed upvote');
        router.refresh();
      }
    });
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clerkUserId) {
      toast.error('Please sign in to share feedback');
      return;
    }

    if (!commentBody.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsPostingComment(true);
    try {
      const result = await addComment(project.id, commentBody, commentType);
      if (result.success) {
        toast.success('Feedback posted successfully!');
        setCommentBody('');
        // Initialize dynamic votes for new comment
        if (result.comment) {
          setCommentVotes(prev => ({
            ...prev,
            [result.comment.id]: { count: 1, voted: true }
          }));
        }
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to post feedback');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleCommentVoteToggle = (commentId: string) => {
    setCommentVotes(prev => {
      const current = prev[commentId] || { count: 0, voted: false };
      const newVoted = !current.voted;
      const newCount = newVoted ? current.count + 1 : current.count - 1;
      return {
        ...prev,
        [commentId]: { count: newCount, voted: newVoted }
      };
    });
  };

  // Filtered comments list
  const filteredComments = project.comments.filter(c => {
    if (commentsFilter === 'ALL') return true;
    return c.type === commentsFilter;
  });

  const primaryScreenshot = project.screenshots[0]?.url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5peVeZkLLcKchbNy5lP4Y16r9w9KVtSXuvLw5YxGyUR4WjB_BkqbHdnPuYQjfQpbOJgbT1sLkdkx5oe5OgX8lhW9iKjXqyAH8HTNQvZlnGw-2kjkYhW2M5AgdVDpLCTJ3HK1HkUWMdSNkidVnN_-VQiLfUVS_kkk-DzQY8CkRnZOz88q_K2IMJVKSwBjVHowqaUmbkwlxEbPPTvj_9yowyofN6luMjKkJB_5R_A91_f6iv7cJczciIDcAxOTWi_Z27W8rdRx9yfUq';

  return (
    <div className="flex min-h-screen text-on-background bg-background/50">
      {/* Side Navigation (Desktop Only) */}
      <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-0 pt-24 w-64 bg-surface-container-lowest/50 backdrop-blur-2xl border-r border-outline-variant/20 shadow-2xl z-40">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">terminal</span>
            </div>
            <div>
              <p className="font-headline-lg text-[16px] text-primary leading-tight font-bold">DevMode</p>
              <p className="text-xs text-on-surface-variant opacity-70">Level 42 Architect</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          <Link href="/projects" className="flex items-center gap-4 px-6 py-3 bg-primary-container/20 text-primary border-r-4 border-primary transition-all">
            <span className="material-symbols-outlined">dynamic_feed</span>
            <span className="font-label-caps text-label-caps">Feed</span>
          </Link>
          <Link href="/projects" className="flex items-center gap-4 px-6 py-3 text-on-surface-variant hover:bg-white/5 hover:text-secondary-fixed-dim transition-all">
            <span className="material-symbols-outlined">terminal</span>
            <span className="font-label-caps text-label-caps">Repositories</span>
          </Link>
          <Link href="/leaderboards" className="flex items-center gap-4 px-6 py-3 text-on-surface-variant hover:bg-white/5 hover:text-secondary-fixed-dim transition-all">
            <span className="material-symbols-outlined">group</span>
            <span className="font-label-caps text-label-caps">Following</span>
          </Link>
          <Link href="/projects" className="flex items-center gap-4 px-6 py-3 text-on-surface-variant hover:bg-white/5 hover:text-secondary-fixed-dim transition-all">
            <span className="material-symbols-outlined">forum</span>
            <span className="font-label-caps text-label-caps">Messages</span>
          </Link>
          <Link href="/projects" className="flex items-center gap-4 px-6 py-3 text-on-surface-variant hover:bg-white/5 hover:text-secondary-fixed-dim transition-all">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-caps text-label-caps">Settings</span>
          </Link>
        </nav>
        <div className="p-6 border-t border-white/5">
          <div className="mt-4 flex gap-4 text-on-surface-variant">
            <Link href="/projects" className="flex items-center gap-1 text-[10px] uppercase tracking-widest hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-sm">menu_book</span> Docs
            </Link>
            <Link href="/projects" className="flex items-center gap-1 text-[10px] uppercase tracking-widest hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-sm">support_agent</span> Support
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:pl-64 w-full pt-12 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-10">
          
          {/* Back button */}
          <div className="mb-6">
            <Link href="/projects" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-code-sm">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Trending Feed
            </Link>
          </div>

          {/* Hero Section */}
          <section className="relative mb-section-gap">
            {/* Background Atmospheric Glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-1/2 -left-24 w-64 h-64 bg-secondary-fixed-dim/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-secondary-container/20 border border-secondary-container/40 text-secondary-fixed-dim rounded-full text-[10px] font-code-sm tracking-widest">
                    ● ACTIVE PRODUCTION
                  </span>
                  {project.version && (
                    <span className="font-code-sm text-code-sm text-on-surface-variant opacity-60">
                      [ {project.version} ]
                    </span>
                  )}
                </div>
                
                <h1 className="font-display-lg text-display-lg text-on-surface leading-tight uppercase">
                  {project.title.slice(0, -5)}
                  <span className="text-primary text-glow-primary">{project.title.slice(-5)}</span>
                </h1>
                
                <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
                  {project.tagline || project.description.slice(0, 160) + '...'}
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  {project.demoUrl && (
                    <Link href={project.demoUrl} target="_blank" rel="noreferrer" className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(255,177,195,0.4)] hover:shadow-[0_0_35px_rgba(255,177,195,0.6)] hover:scale-105 transition-all duration-300">
                      Live Demo
                    </Link>
                  )}
                  {project.repoUrl && (
                    <Link href={project.repoUrl} target="_blank" rel="noreferrer" className="bg-transparent border border-secondary-fixed-dim text-secondary-fixed-dim px-8 py-3 rounded-full font-bold hover:bg-secondary-fixed-dim/10 hover:shadow-[0_0_20px_rgba(0,219,233,0.3)] hover:scale-105 transition-all duration-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">code</span> View on GitHub
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Featured Screenshot with Glowing Frame */}
            <div className="mt-12 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-tertiary-container to-secondary-fixed-dim rounded-[2rem] blur opacity-30 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative glass-card rounded-[2rem] overflow-hidden border-2 border-white/10">
                <img 
                  className="w-full h-[450px] object-cover group-hover:scale-[1.01] transition-transform duration-700" 
                  alt={project.title}
                  src={primaryScreenshot}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
                  <div>
                    <p className="font-label-caps text-primary mb-1">Architecture</p>
                    <p className="font-headline-lg text-2xl text-on-surface">{project.title}</p>
                  </div>
                  <div className="flex gap-2">
                    {project.frameworks.slice(0, 2).map(fw => (
                      <span key={fw} className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 font-code-sm text-secondary-fixed-dim">
                        {fw}
                      </span>
                    ))}
                    {project.languages.slice(0, 1).map(lang => (
                      <span key={lang} className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 font-code-sm text-tertiary">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Grid Content: Description & Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Detailed Description */}
            <div className="lg:col-span-8 space-y-12">
              <section>
                <h2 className="font-headline-lg text-2xl text-on-surface mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-primary rounded-full"></span>
                  Project Overview
                </h2>
                <div className="space-y-6 text-on-surface-variant leading-relaxed text-lg">
                  <p className="whitespace-pre-line">
                    {project.description}
                  </p>
                  
                  {/* Highlight Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                    <div className="glass-card p-6 rounded-2xl border-l-4 border-l-primary hover:translate-x-2 transition-transform">
                      <h4 className="font-headline-lg text-lg mb-2 text-on-surface">Integrated Tech</h4>
                      <p className="text-sm opacity-80">
                        {project.languages.join(', ') || 'Modern Stack'} power this responsive system.
                      </p>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border-l-4 border-l-secondary-fixed-dim hover:translate-x-2 transition-transform">
                      <h4 className="font-headline-lg text-lg mb-2 text-on-surface">Pulse Discovery</h4>
                      <p className="text-sm opacity-80">
                        Ranked dynamically based on views, developer upvotes, and launch feedback.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Feedback & Comments Section */}
              <section className="mt-section-gap">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <h2 className="font-headline-lg text-2xl text-on-surface">Feedback &amp; Community</h2>
                  <div className="flex gap-1 bg-surface-container-low p-1 rounded-lg border border-white/5">
                    <button 
                      onClick={() => setCommentsFilter('ALL')}
                      className={`text-xs font-label-caps px-3 py-1.5 rounded-md transition-all ${
                        commentsFilter === 'ALL' 
                          ? 'bg-primary text-on-primary font-bold shadow-md' 
                          : 'text-on-surface-variant hover:text-on-surface opacity-75'
                      }`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setCommentsFilter('BUG_REPORT')}
                      className={`text-xs font-label-caps px-3 py-1.5 rounded-md transition-all ${
                        commentsFilter === 'BUG_REPORT' 
                          ? 'bg-error text-on-error font-bold shadow-md' 
                          : 'text-on-surface-variant hover:text-on-surface opacity-75'
                      }`}
                    >
                      Bugs
                    </button>
                    <button 
                      onClick={() => setCommentsFilter('FEATURE_REQUEST')}
                      className={`text-xs font-label-caps px-3 py-1.5 rounded-md transition-all ${
                        commentsFilter === 'FEATURE_REQUEST' 
                          ? 'bg-secondary-fixed-dim text-on-secondary font-bold shadow-md' 
                          : 'text-on-surface-variant hover:text-on-surface opacity-75'
                      }`}
                    >
                      Features
                    </button>
                  </div>
                </div>

                {/* Comment Input */}
                <form onSubmit={handlePostComment} className="glass-card p-6 rounded-2xl mb-8 relative border border-white/10">
                  <textarea 
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    className="w-full bg-transparent border-none outline-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/40 resize-none h-24 text-sm"
                    placeholder={clerkUserId ? "Join the discussion... share a bug or suggest a feature." : "Please sign in to share a comment."}
                    disabled={!clerkUserId || isPostingComment}
                  />
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-4 border-t border-white/5 pt-4 gap-4">
                    
                    {/* Channel Selector */}
                    {clerkUserId && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-on-surface-variant/60 font-code-sm">Channel:</span>
                        <div className="flex rounded-md bg-black/40 p-0.5 border border-white/5">
                          <button
                            type="button"
                            onClick={() => setCommentType('GENERAL')}
                            className={`px-2.5 py-1 text-xs rounded transition-all ${commentType === 'GENERAL' ? 'bg-primary/20 text-primary border border-primary/20' : 'text-on-surface-variant hover:text-on-surface'}`}
                          >
                            General
                          </button>
                          <button
                            type="button"
                            onClick={() => setCommentType('FEATURE_REQUEST')}
                            className={`px-2.5 py-1 text-xs rounded transition-all ${commentType === 'FEATURE_REQUEST' ? 'bg-secondary-fixed-dim/20 text-secondary-fixed-dim border border-secondary-fixed-dim/20' : 'text-on-surface-variant hover:text-on-surface'}`}
                          >
                            Feature
                          </button>
                          <button
                            type="button"
                            onClick={() => setCommentType('BUG_REPORT')}
                            className={`px-2.5 py-1 text-xs rounded transition-all ${commentType === 'BUG_REPORT' ? 'bg-error/20 text-error border border-error/20' : 'text-on-surface-variant hover:text-on-surface'}`}
                          >
                            Bug
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <button 
                      type="submit"
                      disabled={!clerkUserId || isPostingComment}
                      className="bg-secondary-fixed-dim text-on-secondary px-6 py-2 rounded-lg font-bold hover:shadow-[0_0_15px_#00dbe9] transition-all disabled:opacity-50 disabled:hover:shadow-none ml-auto"
                    >
                      {isPostingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>

                {/* Comments Thread */}
                <div className="space-y-6">
                  {filteredComments.length > 0 ? (
                    filteredComments.map((comment) => {
                      const voteInfo = commentVotes[comment.id] || { count: 0, voted: false };
                      
                      let badgeStyle = "bg-primary/10 text-primary border-primary/20";
                      let badgeLabel = "DISCUSSION";
                      
                      if (comment.type === 'FEATURE_REQUEST') {
                        badgeStyle = "bg-secondary-fixed-dim/10 text-secondary-fixed-dim border-secondary-fixed-dim/20";
                        badgeLabel = "FEATURE REQUEST";
                      } else if (comment.type === 'BUG_REPORT') {
                        badgeStyle = "bg-error/10 text-error border-error/20";
                        badgeLabel = "BUG REPORT";
                      }

                      return (
                        <div key={comment.id} className="glass-card p-6 rounded-2xl group hover:border-primary/30 transition-all border border-white/10">
                          <div className="flex gap-4">
                            {/* Upvote comment container */}
                            <div className="flex flex-col items-center gap-1 bg-black/40 px-2.5 py-3 rounded-xl h-fit border border-white/5 select-none">
                              <button 
                                type="button"
                                onClick={() => handleCommentVoteToggle(comment.id)}
                                className={`material-symbols-outlined text-lg transition-all ${voteInfo.voted ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                                style={{ fontVariationSettings: voteInfo.voted ? "'FILL' 1" : "'FILL' 0" }}
                              >
                                arrow_drop_up
                              </button>
                              <span className={`font-code-sm text-xs ${voteInfo.voted ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{voteInfo.count}</span>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="font-headline-lg text-sm text-on-surface font-semibold">Anonymous Builder</span>
                                <span className="text-[10px] text-on-surface-variant opacity-50">
                                  • {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </span>
                                <span className={`ml-auto text-[9px] font-code-sm px-2 py-0.5 rounded border ${badgeStyle}`}>
                                  {badgeLabel}
                                </span>
                              </div>
                              <p className="text-on-surface-variant leading-relaxed text-sm">
                                {comment.body}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="glass-card p-12 rounded-2xl text-center border border-white/10 border-dashed">
                      <p className="text-on-surface-variant font-medium">No reviews found under this channel</p>
                      <p className="text-xs text-on-surface-variant/40 mt-1">Be the first to submit a review for this project</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column: Stats & Meta & AI Analysis */}
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
              
              {/* Stats Panel */}
              <div className="glass-card p-8 rounded-2xl border border-white/10 overflow-hidden relative">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary-fixed-dim/20 rounded-full blur-3xl"></div>
                
                <h3 className="font-label-caps text-on-surface-variant mb-6 tracking-widest text-xs">PROJECT STATS</h3>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant opacity-70 text-sm">Total Upvotes</span>
                    <span className="font-code-sm text-primary font-bold text-lg">{voteCount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant opacity-70 text-sm">Pulse Score</span>
                    <span className="font-code-sm text-[#00dbe9] font-bold text-lg">{project.pulseScore}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant opacity-70 text-sm">Main Language</span>
                    <span className="font-code-sm text-secondary-fixed-dim text-sm">
                      {project.languages[0] || 'TypeScript'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant opacity-70 text-sm">License</span>
                    <span className="font-code-sm text-on-surface text-sm">MIT</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                  <button 
                    type="button"
                    onClick={handleProjectVote}
                    disabled={isPending}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold transition-all duration-300 ${
                      hasVoted 
                        ? 'bg-transparent border border-primary text-primary shadow-[0_0_15px_rgba(255,177,195,0.2)]'
                        : 'bg-primary text-on-primary hover:shadow-[0_0_20px_#ffb1c3] hover:scale-102'
                    }`}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: hasVoted ? "'FILL' 1" : "'FILL' 0" }}>
                      thumb_up
                    </span>
                    {hasVoted ? 'Upvoted!' : 'Upvote Project'}
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                  <p className="font-label-caps text-[10px] text-on-surface-variant tracking-wider">SHARE</p>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('Project link copied!');
                      }}
                      className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-all border border-white/5"
                    >
                      <span className="material-symbols-outlined text-md">share</span>
                    </button>
                    {project.repoUrl && (
                      <Link 
                        href={project.repoUrl} 
                        target="_blank"
                        className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-all border border-white/5"
                      >
                        <span className="material-symbols-outlined text-md">alternate_email</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Analysis Panel */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 relative">
                <h3 className="font-label-caps text-on-surface-variant mb-4 tracking-widest text-xs">AI ANALYSIS</h3>
                {project.aiAnalysis ? (
                  <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
                    <p>{project.aiAnalysis.summary}</p>
                    
                    {project.aiAnalysis.topIssues.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-cyan-300">Top Issues</p>
                        <ul className="space-y-2">
                          {project.aiAnalysis.topIssues.map((issue) => (
                            <li key={issue} className="rounded-md bg-white/5 px-3 py-2 text-xs border border-white/5">{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {project.aiAnalysis.featureRequests.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-secondary-fixed-dim">Feature Requests</p>
                        <ul className="space-y-2">
                          {project.aiAnalysis.featureRequests.map((req) => (
                            <li key={req} className="rounded-md bg-white/5 px-3 py-2 text-xs border border-white/5">{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs leading-6 text-zinc-500">
                    AI sentiment, issue clustering, and feature-request summaries will activate as community feedback accumulates.
                  </p>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
