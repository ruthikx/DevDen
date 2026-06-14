'use client';

import { useActionState, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BadgeCheck, Code2, Eye, Image as ImageIcon, Link2, Rocket, Sparkles } from 'lucide-react';
import { createProject } from '@/app/actions/projects';
import { WizardStep } from '@/components/WizardStep';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

type CreateProjectState = Awaited<ReturnType<typeof createProject>> | null;

const steps = [
  { label: 'Identity', icon: BadgeCheck },
  { label: 'Showcase', icon: ImageIcon },
  { label: 'Stack', icon: Code2 },
  { label: 'Review', icon: Eye },
];

const requiredFields: Record<number, string[]> = {
  0: ['title', 'tagline', 'version', 'description'],
  1: [],
  2: ['tags'],
  3: [],
};

function formValue(form: HTMLFormElement | null, name: string) {
  if (!form) return '';
  const field = form.elements.namedItem(name);
  return field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement ? field.value.trim() : '';
}

export function ProjectWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formEl, setFormEl] = useState<HTMLFormElement | null>(null);

  const [, formAction, isPending] = useActionState<CreateProjectState, FormData>(async (_prevState, formData) => {
    const title = formData.get('title') as string;
    const tagline = formData.get('tagline') as string;
    const version = formData.get('version') as string;
    const description = formData.get('description') as string;
    const demoUrl = formData.get('demoUrl') as string;
    const repoUrl = formData.get('repoUrl') as string;
    const tags = formData.get('tags') as string;
    const languages = formData.get('languages') as string;
    const frameworks = formData.get('frameworks') as string;
    const screenshots = formData.get('screenshots') as string;

    const loadingToast = toast.loading('Initializing launch...');
    const result = await createProject(
      title,
      description,
      demoUrl || null,
      repoUrl || null,
      tags,
      screenshots,
      tagline,
      version,
      languages,
      frameworks
    );

    toast.dismiss(loadingToast);

    if (result.success && result.project) {
      toast.success('Project launched on DevPulse.');
      router.push(`/projects/${result.project.slug}`);
    } else {
      toast.error(result.error || 'Failed to create project');
    }

    return result;
  }, null);

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  function canAdvance() {
    const missing = requiredFields[step].filter((field) => !formValue(formEl, field));
    if (missing.length > 0) {
      toast.error('Complete the highlighted launch fields before continuing.');
      return false;
    }
    return true;
  }

  function goNext() {
    if (canAdvance()) setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  const reviewFields = [
    ['Title', formValue(formEl, 'title')],
    ['Tagline', formValue(formEl, 'tagline')],
    ['Version', formValue(formEl, 'version')],
    ['Tags', formValue(formEl, 'tags')],
    ['Languages', formValue(formEl, 'languages')],
    ['Frameworks', formValue(formEl, 'frameworks')],
  ];

  return (
    <div className="neon-panel w-full max-w-4xl rounded-lg p-5">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Project Launchpad</p>
            <h2 className="mt-1 flex items-center gap-2 text-2xl font-semibold">
              <Rocket className="h-6 w-6 text-[#ff007a]" />
              Initialize Project
            </h2>
          </div>
          <div className="text-sm text-zinc-400">Step {step + 1} of {steps.length}</div>
        </div>
        <Progress value={progress} className="h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-[#ff007a] [&_[data-slot=progress-indicator]]:to-cyan-300" />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {steps.map(({ label, icon: Icon }, index) => (
            <button
              key={label}
              type="button"
              onClick={() => index <= step && setStep(index)}
              className={`rounded-lg border p-3 text-left transition ${
                index === step
                  ? 'border-[#ff007a]/50 bg-[#ff007a]/15 text-white'
                  : index < step
                    ? 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100'
                    : 'border-white/10 bg-black/20 text-zinc-500'
              }`}
            >
              <Icon className="mb-2 h-4 w-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <form ref={setFormEl} action={formAction} className="space-y-5">
        <div className={step === 0 ? 'block' : 'hidden'}>
          <WizardStep title="Project Identity" description="Name the launch and frame the feedback you want from other builders.">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input id="title" name="title" required disabled={isPending} placeholder="DevPulse Platform" className="border-white/10 bg-black/30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version *</Label>
                <Input id="version" name="version" required disabled={isPending} placeholder="v1.0 beta" className="border-white/10 bg-black/30" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline *</Label>
              <Input id="tagline" name="tagline" required disabled={isPending} placeholder="A launch radar for ambitious developer projects" className="border-white/10 bg-black/30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Launch Brief *</Label>
              <Textarea id="description" name="description" required disabled={isPending} placeholder="Describe the problem, technical approach, standout craft, and feedback needed..." className="min-h-36 resize-none border-white/10 bg-black/30" />
            </div>
          </WizardStep>
        </div>

        <div className={step === 1 ? 'block' : 'hidden'}>
          <WizardStep title="Showcase" description="Add proof: product screenshots, live demo, and repository context.">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="demoUrl" className="flex items-center gap-2"><Link2 className="h-4 w-4 text-cyan-300" /> Demo URL</Label>
                <Input id="demoUrl" name="demoUrl" type="url" disabled={isPending} placeholder="https://example.com" className="border-white/10 bg-black/30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repoUrl" className="flex items-center gap-2"><Link2 className="h-4 w-4 text-[#ff007a]" /> Repository URL</Label>
                <Input id="repoUrl" name="repoUrl" type="url" disabled={isPending} placeholder="https://github.com/user/repo" className="border-white/10 bg-black/30" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="screenshots">Screenshot URLs</Label>
              <Textarea id="screenshots" name="screenshots" disabled={isPending} placeholder="https://example.com/screen-a.png, https://example.com/screen-b.png" className="min-h-28 resize-none border-white/10 bg-black/30" />
            </div>
          </WizardStep>
        </div>

        <div className={step === 2 ? 'block' : 'hidden'}>
          <WizardStep title="Technical Stack" description="These signals power filtering, project cards, and the stack HUD.">
            <div className="space-y-2">
              <Label htmlFor="tags" className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-cyan-300" /> Discovery Tags *</Label>
              <Input id="tags" name="tags" required disabled={isPending} placeholder="AI, Open Source, Analytics" className="border-white/10 bg-black/30" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="languages">Languages</Label>
                <Input id="languages" name="languages" disabled={isPending} placeholder="TypeScript, SQL" className="border-white/10 bg-black/30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frameworks">Frameworks</Label>
                <Input id="frameworks" name="frameworks" disabled={isPending} placeholder="Next.js, Prisma, Tailwind" className="border-white/10 bg-black/30" />
              </div>
            </div>
          </WizardStep>
        </div>

        <div className={step === 3 ? 'block' : 'hidden'}>
          <WizardStep title="Review & Submit" description="Confirm the public launch profile before it enters the trending feed.">
            <div className="grid gap-3 md:grid-cols-2">
              {reviewFields.map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-black/20 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
                  <p className="mt-1 min-h-5 text-sm text-zinc-200">{value || 'Not provided'}</p>
                </div>
              ))}
            </div>
          </WizardStep>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="outline" disabled={step === 0 || isPending} onClick={() => setStep((current) => Math.max(current - 1, 0))} className="border-white/15 bg-white/5 text-zinc-100">
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button type="button" onClick={goNext} className="bg-[#ff007a] text-white hover:bg-[#e6006e]">
              Continue
            </Button>
          ) : (
            <Button type="submit" disabled={isPending} className="bg-[#ff007a] text-white shadow-[0_0_24px_rgba(255,0,122,0.35)] hover:bg-[#e6006e]">
              {isPending ? 'Launching...' : 'Launch Project'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
