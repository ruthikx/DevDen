import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Award, Shield, Sparkles } from 'lucide-react';
import { ProjectForm } from '@/components/ProjectForm';

export const metadata = {
  title: 'Submit Project - DevPulse',
  description: 'Submit your developer project to DevPulse',
};

const helpCards = [
  {
    icon: Sparkles,
    title: 'Auto-Tags',
    description:
      'Our AI analyzes your description to automatically tag your project for relevant search queries.',
    color: 'text-primary',
    hover: 'hover:border-primary/50',
  },
  {
    icon: Shield,
    title: 'Privacy Control',
    description:
      'Choose whether your project is public, private, or visible only to verified developers.',
    color: 'text-secondary-fixed-dim',
    hover: 'hover:border-secondary-fixed-dim/50',
  },
  {
    icon: Award,
    title: 'Earn XP',
    description:
      'Initial uploads grant 500 XP to your Architect profile and boost your leaderboard standing.',
    color: 'text-tertiary',
    hover: 'hover:border-tertiary/50',
  },
];

export default async function SubmitProjectPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen overflow-hidden bg-background pb-section-gap">
      <div className="mx-auto max-w-4xl space-y-stack-lg px-grid-margin pt-[120px]">
        <ProjectForm />

        <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
          {helpCards.map(({ icon: Icon, title, description, color, hover }) => (
            <div
              key={title}
              className={`glass-panel group rounded-xl p-6 transition-colors ${hover}`}
            >
              <Icon className={`mb-3 h-6 w-6 ${color}`} />
              <h3 className="mb-2 text-[16px] font-headline-lg-mobile">{title}</h3>
              <p className="text-xs leading-relaxed text-on-surface-variant">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
