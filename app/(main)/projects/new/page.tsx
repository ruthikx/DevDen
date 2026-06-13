import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { GradientHeader } from '@/components/gradient-header';
import { ProjectForm } from '@/components/ProjectForm';

export const metadata = {
  title: 'Submit Project - DevPulse',
  description: 'Submit your developer project to DevPulse',
};

export default async function SubmitProjectPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="space-y-8">
      <GradientHeader
        title="Share Your Project"
        subtitle="Tell the community about your amazing developer project and get feedback from other developers."
      />

      <div className="flex justify-center">
        <ProjectForm />
      </div>
    </div>
  );
}
