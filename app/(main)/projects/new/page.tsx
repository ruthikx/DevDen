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
    <div className="container mx-auto space-y-8 px-4 py-8">
      <GradientHeader
        title="Project Launchpad"
        subtitle="Initialize your project profile, add showcase assets, connect your repository, and prepare the launch for community review."
      />

      <div className="flex justify-center">
        <ProjectForm />
      </div>
    </div>
  );
}
