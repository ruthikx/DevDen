import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type WizardStepProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function WizardStep({ title, description, children }: WizardStepProps) {
  return (
    <Card className="border-white/10 bg-black/20 py-0">
      <CardHeader>
        <CardTitle className="text-xl text-white">{title}</CardTitle>
        <CardDescription className="text-zinc-400">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">{children}</CardContent>
    </Card>
  );
}
