'use client';

import { useActionState, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Check,
  CloudUpload,
  Globe,
  Loader2,
  Rocket,
  Shield,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { createProject } from '@/app/actions/projects';

type CreateProjectState = Awaited<ReturnType<typeof createProject>> | null;

const steps = ['Identity', 'Showcase', 'Connect'];

const requiredFields: Record<number, string[]> = {
  0: ['title', 'description'],
  1: [],
  2: [],
};

function formValue(form: HTMLFormElement | null, name: string) {
  if (!form) return '';
  const field = form.elements.namedItem(name);
  return field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement
    ? field.value.trim()
    : '';
}

export function ProjectWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formEl, setFormEl] = useState<HTMLFormElement | null>(null);

  const [, formAction, isPending] = useActionState<CreateProjectState, FormData>(
    async (_prevState, formData) => {
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
        frameworks,
      );

      toast.dismiss(loadingToast);

      if (result.success && result.project) {
        toast.success('Project launched on DevPulse.');
        router.push(`/projects/${result.project.slug}`);
      } else {
        toast.error(result.error || 'Failed to create project');
      }

      return result;
    },
    null,
  );

  const progress = useMemo(() => ((currentStep + 1) / steps.length) * 100, [currentStep]);

  function canAdvance() {
    const missing = requiredFields[currentStep].filter((field) => !formValue(formEl, field));
    if (missing.length > 0) {
      toast.error('Complete the highlighted launch fields before continuing.');
      return false;
    }
    return true;
  }

  function goNext() {
    if (canAdvance()) setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }

  return (
    <>
      <style>{`
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div className="glass-panel rounded-xl p-8 relative overflow-hidden">
        <div className="shimmer absolute inset-0 pointer-events-none" />

        <div className="mb-10 text-center relative">
          <h1 className="font-bold text-3xl font-headline-lg text-headline-lg mb-2 text-primary">
            Upload Your Project
          </h1>
          <p className="text-on-surface-variant font-body-md">
            Bring your vision to the DevPulse ecosystem.
          </p>
        </div>

        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${progress}%`, filter: 'drop-shadow(0 0 8px #ffb1c3)' }}
          />
          {steps.map((label, idx) => (
            <div key={label} className="relative z-10 flex flex-col items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-background font-bold transition-all duration-300 ${
                  idx <= currentStep
                    ? 'bg-primary text-on-primary-container'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {idx < currentStep ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <span
                className={`font-label-caps text-[10px] uppercase tracking-widest ${
                  idx <= currentStep ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <form ref={setFormEl} action={formAction} className="flex min-h-[400px] flex-col space-y-8">
          <div className={`flex-1 space-y-6 ${currentStep !== 0 ? 'hidden' : ''}`}>
            <div className="group">
              <label className="mb-2 block font-label-caps text-label-caps text-on-surface-variant transition-colors group-focus-within:text-primary">
                Project Title
              </label>
              <input
                name="title"
                required
                className="w-full border-0 border-b border-white/10 bg-white/5 px-0 py-3 font-headline-lg-mobile text-headline-lg-mobile text-on-surface outline-none transition-all placeholder:text-white/20 focus:border-primary focus:ring-0"
                placeholder="e.g., Quantum Compiler 2.0"
              />
            </div>
            <div className="group">
              <label className="mb-2 block font-label-caps text-label-caps text-on-surface-variant transition-colors group-focus-within:text-primary">
                Tagline
              </label>
              <input
                name="tagline"
                className="w-full border-0 border-b border-white/10 bg-white/5 px-0 py-3 font-body-md text-body-md text-on-surface outline-none transition-all placeholder:text-white/20 focus:border-primary focus:ring-0"
                placeholder="A short punchy one-liner"
              />
            </div>
            <div className="group">
              <label className="mb-2 block font-label-caps text-label-caps text-on-surface-variant transition-colors group-focus-within:text-primary">
                Project Description
              </label>
              <textarea
                name="description"
                required
                rows={4}
                className="w-full resize-none border-0 border-b border-white/10 bg-white/5 px-0 py-3 font-body-md text-body-md text-on-surface outline-none transition-all placeholder:text-white/20 focus:border-primary focus:ring-0"
                placeholder="Explain the architecture and the problem it solves..."
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="group">
                <label className="mb-2 block font-label-caps text-label-caps text-on-surface-variant transition-colors group-focus-within:text-primary">
                  Discovery Tags
                </label>
                <input
                  name="tags"
                  className="w-full border-0 border-b border-white/10 bg-white/5 px-0 py-3 text-on-surface outline-none transition-all placeholder:text-white/20 focus:border-primary focus:ring-0"
                  placeholder="AI, Open Source, Analytics"
                />
              </div>
              <div className="group">
                <label className="mb-2 block font-label-caps text-label-caps text-on-surface-variant transition-colors group-focus-within:text-primary">
                  Version
                </label>
                <input
                  name="version"
                  className="w-full border-0 border-b border-white/10 bg-white/5 px-0 py-3 font-code-sm text-on-surface outline-none transition-all placeholder:text-white/20 focus:border-primary focus:ring-0"
                  placeholder="v1.0.0"
                />
              </div>
            </div>
          </div>

          <div className={`flex-1 space-y-8 ${currentStep !== 1 ? 'hidden' : ''}`}>
            <div>
              <label className="mb-4 block font-label-caps text-label-caps text-on-surface-variant">
                Project Screenshots
              </label>
              <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-white/10 p-8 transition-all hover:border-secondary-fixed-dim">
                <div className="pointer-events-none absolute inset-0 bg-secondary-fixed-dim/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <CloudUpload className="mb-4 h-12 w-12 text-on-surface-variant transition-all group-hover:scale-110 group-hover:text-secondary-fixed-dim" />
                <p className="text-center font-body-md text-on-surface-variant transition-colors group-hover:text-on-surface">
                  Add screenshot URLs for your project
                </p>
                <p className="mt-2 text-center text-xs text-outline opacity-60">
                  Paste comma-separated image URLs (screenshots, mockups, etc.)
                </p>
              </div>
              <textarea
                name="screenshots"
                rows={2}
                className="mt-4 w-full resize-none border-0 border-b border-white/10 bg-white/5 px-0 py-3 font-body-md text-body-md text-on-surface outline-none transition-all placeholder:text-white/20 focus:border-secondary-fixed-dim focus:ring-0"
                placeholder="https://example.com/screen-a.png, https://example.com/screen-b.png"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="group">
                <label className="mb-2 block font-label-caps text-label-caps text-on-surface-variant transition-colors group-focus-within:text-secondary-fixed-dim">
                  Languages
                </label>
                <input
                  name="languages"
                  className="w-full border-0 border-b border-white/10 bg-white/5 px-0 py-3 text-on-surface outline-none transition-all placeholder:text-white/20 focus:border-secondary-fixed-dim focus:ring-0"
                  placeholder="TypeScript, Rust, Go"
                />
              </div>
              <div className="group">
                <label className="mb-2 block font-label-caps text-label-caps text-on-surface-variant transition-colors group-focus-within:text-secondary-fixed-dim">
                  Frameworks
                </label>
                <input
                  name="frameworks"
                  className="w-full border-0 border-b border-white/10 bg-white/5 px-0 py-3 text-on-surface outline-none transition-all placeholder:text-white/20 focus:border-secondary-fixed-dim focus:ring-0"
                  placeholder="Next.js, Tailwind, Prisma"
                />
              </div>
            </div>
          </div>

          <div className={`flex-1 space-y-6 ${currentStep !== 2 ? 'hidden' : ''}`}>
            <div className="group">
              <label className="mb-2 block font-label-caps text-label-caps text-on-surface-variant transition-colors group-focus-within:text-primary">
                Source Code Repository
              </label>
              <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-3">
                <Terminal className="h-5 w-5 shrink-0 text-on-surface-variant" />
                <input
                  name="repoUrl"
                  type="url"
                  className="flex-1 border-0 bg-transparent py-4 text-body-md text-primary outline-none placeholder:text-white/20 focus:ring-0"
                  placeholder="https://github.com/user/repo"
                />
              </div>
            </div>
            <div className="group">
              <label className="mb-2 block font-label-caps text-label-caps text-on-surface-variant transition-colors group-focus-within:text-secondary-fixed-dim">
                Live Production URL
              </label>
              <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-3">
                <Globe className="h-5 w-5 shrink-0 text-on-surface-variant" />
                <input
                  name="demoUrl"
                  type="url"
                  className="flex-1 border-0 bg-transparent py-4 text-body-md text-secondary-fixed-dim outline-none placeholder:text-white/20 focus:ring-0"
                  placeholder="https://yourproject.dev"
                />
              </div>
            </div>
            <div className="mt-8 rounded-lg border border-white/5 bg-surface-container-high p-6">
              <div className="flex items-start gap-4">
                <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                <div>
                  <h4 className="mb-1 text-[16px] font-headline-lg-mobile text-on-surface">
                    Final Review
                  </h4>
                  <p className="text-sm text-on-surface-variant">
                    By clicking 'Initialize Project', your code will be indexed and ranked by the
                    DevPulse algorithm. Ensure your README is populated for better discovery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-10">
            <button
              type="button"
              onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))}
              disabled={currentStep === 0 || isPending}
              className={`flex items-center gap-2 px-6 py-3 font-label-caps text-label-caps text-on-surface-variant transition-colors hover:text-on-surface disabled:opacity-0 ${
                currentStep === 0 ? 'invisible' : ''
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="flex gap-4">
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-label-caps text-label-caps text-on-primary transition-all active:scale-95 hover:scale-105"
                  style={{ boxShadow: '0 0 20px rgba(255, 177, 195, 0.4)' }}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-3 rounded-full bg-primary px-10 py-4 font-headline-lg-mobile text-[18px] text-on-primary transition-all active:scale-95 hover:scale-105 disabled:opacity-80"
                  style={{ boxShadow: '0 0 20px rgba(255, 177, 195, 0.4)' }}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    <>
                      Initialize Project
                      <Rocket className="h-5 w-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
